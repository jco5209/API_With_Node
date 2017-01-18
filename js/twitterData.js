'use strict';
const Twitter = require('twitter');
const format = require('dateformat');
const timeago = require('timeago.js');
const dmConvo = require('./dmConversation.js').dmConvo;
const mRCallback = require('./dmConversation.js').mRCallback;
const mSCallback = require('./dmConversation.js').mSCallback;
const friendsCallback = require('./dmConversation.js').friendsCallback;
const tweetsCallback = require('./dmConversation.js').tweetsCallback;

// Credentials are entered in process environment - this ensures the security of sensitive data
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// The screen_name which will be used with the Twitter package
const params = {screen_name: 'jtc0_0'};

// GET user's latest 5 tweets
const twitterTimeline = () => {

	// Create a new promise to resolve & return a GET request for the user's timeline
	const promise = new Promise((resolve, reject) => {

		// Initial API call for user's timeline
		client.get('statuses/user_timeline', params, (error, tweets, response) => {
		  if (!error) {
		  	
		  	// Object & property creation callback
		    resolve( tweetsCallback(tweets) )
		  } else {console.log(error)}
		});	
	})	
	return promise
}

// GET user's latest 5 friends - twitterTimeline's resolved promise is passed into here in order to build upon the initial object
const twitterFriends = (tweets) => {

	// Create a new promise to resolve & return a GET request for the user's latest friends
	const promise = new Promise((resolve, reject) => {

		// API call for friends list
		client.get('friends/list', params, function(error, friends, response) {
		  if (!error) {

		  	// Object & property creation callback
		  	resolve( friendsCallback(friends) )
		  } else {console.log(error)}
		});	
	})
	return promise
}

// GET user's latest 3 messages recieved - twitterFriends's resolved promise is passed into here in order to build upon the initial object
const messagesRecieved = (friends) => {

	// Create a new promise to resolve & return a GET request for the user's latest 3 messages recieved
	const promise = new Promise((resolve, reject) => {

		// API call for messages recieved
		client.get('direct_messages.json?count=15', params, function(error, messages, response) {
		  if (!error) {

		  	// Object & property creation callback
		  	resolve( mRCallback(messages) )
		  } else {console.log(error)}
		});	
	})
	return promise
}

// GET user's latest 3 messages sent - messagesRecieved's resolved promise is passed into here in order to build upon the initial object
const messagesSent = (messagesRecieved) => {

	// Create a new promise to resolve & return a GET request for the user's latest 3 messages sent
	const promise = new Promise((resolve, reject) => {

		// API call for messages sent
		client.get('direct_messages/sent.json?count=15', params, function(error, messages, response) {
		  if (!error) {

		  	// Object & property creation callback
		  	resolve( mSCallback(messages) )
		  } else {console.log(error)}
		});	
	})
	return promise
}

const statusUpdate = (statusText) => {
	client.post('statuses/update', {status: statusText},  function(error, tweet, response) {
	  if(error) throw error;
	  //console.log(tweet);
	});	
}


// Export Modules to be used in app.js
module.exports.twitterTimeline = twitterTimeline;
module.exports.twitterFriends = twitterFriends;
module.exports.messagesRecieved = messagesRecieved;
module.exports.messagesSent = messagesSent;
module.exports.statusUpdate = statusUpdate;

