'use strict';

// Module Dependencies

const express = require('express');
const winston = require('winston');
const app = express();
const Twitter = require('twitter');
const morgan = require('morgan');



// Require'd modules from twitterData.js

const twitterTimeline = require('./twitterData.js').twitterTimeline;
const twitterFriends = require('./twitterData.js').twitterFriends;
const messagesRecieved = require('./twitterData.js').messagesRecieved;
const messagesSent = require('./twitterData.js').messagesSent;
const statusUpdate = require('./twitterData.js').statusUpdate;
const dmConvo = require('./twitterDataCB.js').dmConvo;

// Config

app.set('views', './templates');
app.set('view engine', 'pug');
app.use(express.static('./css'));
app.use(express.static('./images'));
app.use(express.static('./js'));
app.use(morgan('combined'));



// Twitter API variables

let friendResults;
let twitterData;
let sent;
let recieved;
let logList;

// Twitter Data Promise Handling

messagesRecieved()

.then((results) => {recieved = results})

.then(messagesSent)

.then((results) => {sent = results; logList = dmConvo(recieved.messagesRecieved, sent.messagesSent)})

.then(twitterTimeline)

.then((results) => {twitterData = results})

.then(twitterFriends)

.then((results) => {friendResults = results})

// Once all API calls have been made & twitterData object has been created, render page with assigned data
.then(() => {
	app.get('/', (req, res, next) => {
		res.render('layout', {
			data: twitterData, 
			tweets: twitterData.tweets, 
			friends: friendResults.friends, 
			logList: logList[0][0],
			users: logList[1]
		});
	});
});

// Route to load new conversation logs
app.get('/newmessages/:id', (req, res) => {
	res.render('partials/newmessages', {
		layout: false,

		// Uses :id parameter to select conversation indicies - :id parameter will be an index
		logList: logList[0][req.params.id]
	});
});

app.get('/newtweet/', (req, res) => {
	twitterTimeline()
	.then((results) => {twitterData = results})
	.then(() => {
		res.render('partials/timeline', {
			layout: false,
			data: twitterData,
			tweets: twitterData.tweets
		});		
	})
});

// Route to send tweet POST
app.post('/status/:id', (req, res) => {

	// Call statusUdate with tweet data to POST request
	statusUpdate(req.params.id);

	// Send client data to complete request
	return res.send(console.log('POST request sent with value of ' + req.params.id));
});


// Server

app.listen(3000, () => {
	console.log("Server is running on port 3000.")
});

// Error Handling


