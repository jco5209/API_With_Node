'use strict';
const express = require('express');
const app = express();
const Twitter = require('twitter');
const twitterTimeline = require('./twitterData.js').twitterTimeline;
const twitterFriends = require('./twitterData.js').twitterFriends;
const messagesRecieved = require('./twitterData.js').messagesRecieved;
const messagesSent = require('./twitterData.js').messagesSent;

let timelineResults;
let friendResults;
let messagesResults;
let twitterData;

app.set('views', './templates');
app.set('view engine', 'jade');
app.use(express.static('./css'));
app.use(express.static('./images'));

twitterTimeline()
.then((results) => {timelineResults = results})
.then(twitterFriends)
.then((results) => {friendResults = Object.assign(timelineResults, results)})
.then(messagesRecieved)
.then((results) => {messagesResults = Object.assign(friendResults, results)})
.then(messagesSent)
.then((results) => {twitterData = Object.assign(messagesResults, results)})
.then(() => {
	//console.log(twitterData)
	app.get('/', (req, res) => {
		res.render('layout', {
			data: twitterData, 
			tweets: twitterData.tweets, 
			friends: twitterData.friends, 
			messagesRecieved: twitterData.messagesRecieved,
			messagesSent: twitterData.messagesSent
		});
	})
});

app.listen(3000, () => {
	console.log("Server is running on port 3000.")
});


