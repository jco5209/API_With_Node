'use strict';
const Twitter = require('twitter');
const format = require('dateformat');
const timeago = require('timeago.js');
const dmConvo = require('./dmConversation.js').dmConvo;
const mRCallback = require('./dmConversation.js').mRCallback;
const mSCallback = require('./dmConversation.js').mSCallback;

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
		  	// Once data has been returned, appoint data to properties - username; screen_name; profile_img; tweets
		    resolve({
		    	name: tweets[0].user.name,
		    	screen_name: tweets[0].user.screen_name,
		    	profile_img: tweets[0].user.profile_image_url,
		    	// Appoint data for each tweet - text; date ( Format time by using timeago's package ); favorite_count; retweet_count
		    	tweets: [
			    	{text: tweets[0].text, date: new timeago().format(tweets[0].created_at), favorite_count: tweets[0].favorite_count, retweet_count: tweets[0].retweet_count}, 
			    	{text: tweets[1].text, date: new timeago().format(tweets[1].created_at), favorite_count: tweets[1].favorite_count, retweet_count: tweets[1].retweet_count},
			    	{text: tweets[2].text, date: new timeago().format(tweets[2].created_at), favorite_count: tweets[2].favorite_count, retweet_count: tweets[2].retweet_count},
			    	{text: tweets[3].text, date: new timeago().format(tweets[3].created_at), favorite_count: tweets[3].favorite_count, retweet_count: tweets[3].retweet_count},
			    	{text: tweets[4].text, date: new timeago().format(tweets[4].created_at), favorite_count: tweets[4].favorite_count, retweet_count: tweets[4].retweet_count}
			  	]
		    })
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
		  	// Once data has been returned, appoint data to properties, within the friends object - friend's name; friend's screen_name; friend's profile_img
		  	resolve({
		  		friends: [
			  		{name: friends.users[0].name, screen_name: friends.users[0].screen_name, profile_img: friends.users[0].profile_image_url},
			  		{name: friends.users[1].name, screen_name: friends.users[1].screen_name, profile_img: friends.users[1].profile_image_url},
			  		{name: friends.users[2].name, screen_name: friends.users[2].screen_name, profile_img: friends.users[2].profile_image_url},
			  		{name: friends.users[3].name, screen_name: friends.users[3].screen_name, profile_img: friends.users[3].profile_image_url},
			  		{name: friends.users[4].name, screen_name: friends.users[4].screen_name, profile_img: friends.users[4].profile_image_url}
			  	]
		  	})
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
		  	// Once data has been returned, appoint data to propterties, within the messagesRecieved object- message text; date ( Format time by using timeago's package ); sender's profile_img
		  	resolve(
		  		mRCallback(messages)
		  	)
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
		  	// Once data has been returned, appoint data to propterties, within the messagesSent object- message text; date ( Format time by using timeago's package ); sender's profile_img
		  	resolve(
		  		mSCallback(messages)
		  	)
		  } else {console.log(error)}
		});	
	})
	return promise
}



// Export Modules to be used in app.js
module.exports.twitterTimeline = twitterTimeline;
module.exports.twitterFriends = twitterFriends;
module.exports.messagesRecieved = messagesRecieved;
module.exports.messagesSent = messagesSent;

