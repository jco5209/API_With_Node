'use strict';
const Twitter = require('twitter');
const format = require('dateformat');
const timeago = require('timeago.js');
const winston = require('winston');
const dmConvo = require('./twitterDataCB.js').dmConvo;
const mRCallback = require('./twitterDataCB.js').mRCallback;
const mSCallback = require('./twitterDataCB.js').mSCallback;
const friendsCallback = require('./twitterDataCB.js').friendsCallback;
const tweetsCallback = require('./twitterDataCB.js').tweetsCallback;


const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true
    })
  ]
});
logger.level = 'error';

// Credentials are entered in process environment - this ensures the security of sensitive data
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


// The screen_name which will be used with the Twitter package
const params = {screen_name: 'jtc0_0'};


// GET user's latest 3 messages recieved - twitterFriends's resolved promise is passed into here in order to build upon the initial object
const messagesRecieved = () => {

	logger.info('twitterData.js: messagesRecieved() CALLED | ', 'Promise: API GET Request for Twitter Recieved Messages')

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

	// promise.catch(function(e) {
	// 	logger.error(e)
	// })

	logger.info('twitterData.js: messagesRecieved() RETURNING | ', 'Returning object from mRCallback')

	return promise
}

// GET user's latest 3 messages sent - messagesRecieved's resolved promise is passed into here in order to build upon the initial object
const messagesSent = (messages) => {

	logger.info('twitterData.js: messagesSent(messages) CALLED | ', 'Promise: API GET Request for Twitter Sent Messages')

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

	logger.info('twitterData.js: messagesSent(messages) RETURNING | ', 'Returning object from msCallback')

	return promise
}

// GET user's latest 5 tweets
const twitterTimeline = () => {

	logger.info('twitterData.js: twitterTimeline() CALLED | ', 'Promise: API GET Request for Twitter Timeline Data')

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

	logger.info('twitterData.js: twitterTimeline() RETURNING | ', 'Returning object from tweetsCallback')

	return promise
}

// GET user's latest 5 friends - twitterTimeline's resolved promise is passed into here in order to build upon the initial object
const twitterFriends = () => {

	logger.info('twitterData.js: twitterFriends() CALLED | ', 'Promise: API GET Request for Twitter Friends Data')

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

	logger.info('twitterData.js: twitterFriends() RETURNING | ', 'Returning object from friendsCallback')

	return promise
}


// POST request to tweet to user's timeline
const statusUpdate = (statusText) => {

	logger.info('twitterData.js: statusUpdate(statusText) CALLED | ', 'Promise: API POST Request for Posting New Tweet')

	// API call with status: as tweet data 
	client.post('statuses/update', {status: statusText},  function(error, tweet, response) {
	  if(error) logger.error(error);
	});	
}


// Export Modules to be used in app.js
module.exports.twitterTimeline = twitterTimeline;
module.exports.twitterFriends = twitterFriends;
module.exports.messagesRecieved = messagesRecieved;
module.exports.messagesSent = messagesSent;
module.exports.statusUpdate = statusUpdate;

