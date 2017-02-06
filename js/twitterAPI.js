'use strict';
const Twitter 	= require('twitter'),
appKeys 				= require('./config.js'),
format 		  	= require('dateformat'),
timeago 	  	= require('timeago.js'),
winston 	  	= require('winston'),
dmConvo 	  	= require('./twitterAPIData.js').dmConvo,
mRCallback 	  	= require('./twitterAPIData.js').mRCallback,
mSCallback 	  	= require('./twitterAPIData.js').mSCallback,
friendsCallback = require('./twitterAPIData.js').friendsCallback,
tweetsCallback  = require('./twitterAPIData.js').tweetsCallback;

// Setup winston logging
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      //json: true
    })
  ]
});
logger.level = 'error';

// Credentials are required from the appKeys object, within a config.js file - this file is ignored within .gitignore
const client = new Twitter({
  consumer_key: appKeys.consumer_key,
  consumer_secret: appKeys.consumer_secret,
  access_token_key: appKeys.access_token_key,
  access_token_secret: appKeys.access_token_secret
});


// The screen_name which will be used with the Twitter package
const params = {screen_name: 'jtc0_0'};


// GET user's latest 3 messages recieved - twitterFriends's resolved promise is passed into here in order to build upon the initial object
const messagesRecieved = () => {

	logger.verbose('twitterAPI.js: messagesRecieved() CALLED | ', 'Promise: API GET Request for Twitter Recieved Messages | ', 'Should Call mRCallback(messages)');
	logger.debug('twitterAPI.js: messagesRecieved NO Arguments');

	// Create a new promise to resolve & return a GET request for the user's latest 3 messages recieved
	const promise = new Promise((resolve, reject) => {
		//throw 'messagesRecieved Promise rejection';

		// API call for messages recieved
		client.get('direct_messages.json?count=15', params, function(error, messages, response) {
		  if (!error) {

		  	// Object & property creation callback
		  	resolve( mRCallback(messages) )
		  } else {logger.error(error)}
		});	
	})


	return promise
}

// GET user's latest 3 messages sent - messagesRecieved's resolved promise is passed into here in order to build upon the initial object
const messagesSent = (messages) => {

	logger.verbose('twitterAPI.js: messagesSent(messages) CALLED | ', 'Promise: API GET Request for Twitter Sent Messages | ', 'Should Call mSCallback(messages)');
	logger.debug('twitterAPI.js: messagesSent Argument | ', {messagesSent_argument: messages});

	// Create a new promise to resolve & return a GET request for the user's latest 3 messages sent
	const promise = new Promise((resolve, reject) => {

		// API call for messages sent
		client.get('direct_messages/sent.json?count=15', params, function(error, messages, response) {
		  if (!error) {

		  	// Object & property creation callback
		  	resolve( mSCallback(messages) )
		  } else {logger.error(error)}
		});	
	})

	return promise
}

// GET user's latest 5 tweets
const twitterTimeline = () => {

	logger.verbose('twitterAPI.js: twitterTimeline() CALLED | ', 'Promise: API GET Request for Twitter Timeline Data | ', 'Should Call tweetsCallback(tweets)');
	logger.debug('twitterAPI.js: twitterTimeline NO Arguments');

	// Create a new promise to resolve & return a GET request for the user's timeline
	const promise = new Promise((resolve, reject) => {

		// Initial API call for user's timeline
		client.get('statuses/user_timeline', params, (error, tweets, response) => {
		  if (!error) {
		  	
		  	// Object & property creation callback
		    resolve( tweetsCallback(tweets) )
		  } else {logger.error(error)}
		});	
	})	

	return promise
}

// GET user's latest 5 friends - twitterTimeline's resolved promise is passed into here in order to build upon the initial object
const twitterFriends = () => {

	logger.verbose('twitterAPI.js: twitterFriends() CALLED | ', 'Promise: API GET Request for Twitter Friends Data | ', 'Should Call friendsCallback(friends)');
	logger.debug('twitterAPI.js: twitterFriends NO Arguments');

	// Create a new promise to resolve & return a GET request for the user's latest friends
	const promise = new Promise((resolve, reject) => {

		// API call for friends list
		client.get('friends/list', params, function(error, friends, response) {
		  if (!error) {

		  	// Object & property creation callback
		  	resolve( friendsCallback(friends) )
		  } else {logger.error(error)}
		});	
	})

	return promise
}

// POST request to twitter API to unfriend selected friend
const unfriend = (screen_name) => {

	logger.verbose('twitterAPI.js: unfriend(screen_name) CALLED | ', 'Promise: API GET Request for Twitter Friends Data | ', 'Should Call friendsCallback(friends)');
	logger.debug('twitterAPI.js: unfriend Argument | ', {unfriend_argument: screen_name});

	// API call with selected user's screen_name
	client.post('friendships/destroy', {screen_name: screen_name}, (error, unfriend, response) => {
		if(error){logger.error(error)};
	})
}


// POST request to tweet to user's timeline
const statusUpdate = (statusText) => {

	logger.verbose('twitterAPI.js: statusUpdate(statusText) CALLED | ', 'Promise: API POST Request for Posting New Tweet | ', 'Should Route From /status/:id')
	logger.debug('twitterAPI.js: statusUpdate Argument | ', {statusUpdate_argument: statusText});

	// API call with status: as tweet data 
	client.post('statuses/update', {status: statusText},  (error, tweet, response) => {
	  if(error) {logger.error(error)};
	});
}


// Export Modules to be used in app.js
module.exports.twitterTimeline  = twitterTimeline;
module.exports.twitterFriends   = twitterFriends;
module.exports.messagesRecieved = messagesRecieved;
module.exports.messagesSent 	= messagesSent;
module.exports.statusUpdate 	= statusUpdate;
module.exports.unfriend 		= unfriend;

