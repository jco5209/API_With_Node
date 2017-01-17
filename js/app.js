'use strict';
const express = require('express');
const app = express();
const Twitter = require('twitter');

app.set('views', './templates');
app.set('view engine', 'pug');
app.use(express.static('./css'));
app.use(express.static('./images'));
app.use(express.static('./js'));

// Require modules from twitterData.js
const twitterTimeline = require('./twitterData.js').twitterTimeline;
const twitterFriends = require('./twitterData.js').twitterFriends;
const messagesRecieved = require('./twitterData.js').messagesRecieved;
const messagesSent = require('./twitterData.js').messagesSent;
const dmConvo = require('./dmConversation.js').dmConvo;

let timelineResults;
let friendResults;
let messagesResults;
let twitterData;
let logList;

// Initial API call - twitterTimeline() to GET user's latest 5 tweets
twitterTimeline()

// Assign returned data from twitterTimeline() to timelineResults
.then((results) => {timelineResults = results})

// API call twitterFriends to GET user's latest 5 friends
.then(twitterFriends)

// Assign returned data from timelineResults & twitterFriends() to friendResults object
.then((results) => {friendResults = Object.assign(timelineResults, results)})

// API call messagesRecieved to GET user's latest 3 messages recived
.then(messagesRecieved)

// Assign returned data from friendResults & messagesRecieved() to messagesResults object
.then((results) => {messagesResults = Object.assign(friendResults, results)})

// API call messagesSent to GET user's latest 3 messages sent
.then(messagesSent)

// Assign returned data from messagesResults & messagesSent() to twitterData object - twitterData object has data from all API calls
.then((results) => {twitterData = Object.assign(messagesResults, results); logList = dmConvo(twitterData.messagesRecieved, twitterData.messagesSent)})

// Once all API calls have been made & twitterData object has been created, render page with assigned data
.then(() => {
	app.get('/', (req, res) => {
		res.render('layout', {
			data: twitterData, 
			tweets: twitterData.tweets, 
			friends: twitterData.friends, 
			logList: logList[0][0],
			users: logList[1]
		});
	})
});

// Route to load new conversation logs
app.get('/newmessages/:id', (req, res) => {
	res.render('partials/newmessages', {
		layout: false,

		// Uses :id parameter to select conversation indicies - :id parameter will be an index
		logList: logList[0][req.params.id]
	})
})

app.listen(3000, () => {
	console.log("Server is running on port 3000.")
});


