'use strict';

// Module Dependencies
const express = require('express'),
winston 	  = require('winston'),
app 		  = express(),
Twitter 	  = require('twitter'),
morgan 	 	  = require('morgan'),
bodyParser 	  = require('body-parser');

// Require'd modules from twitterAPI.js & twitterAPIData
const twitterTimeline = require('./twitterAPI.js').twitterTimeline,
twitterFriends 		  = require('./twitterAPI.js').twitterFriends,
messagesRecieved 	  = require('./twitterAPI.js').messagesRecieved,
messagesSent 		  = require('./twitterAPI.js').messagesSent,
statusUpdate 		  = require('./twitterAPI.js').statusUpdate,
dmConvo 			  = require('./twitterAPIData.js').dmConvo,
unfriend 			  = require('./twitterAPI.js').unfriend;

// Config
app.set('views', './templates');
app.set('view engine', 'pug');
app.use(express.static('./css'));
app.use(express.static('./images'));
app.use(express.static('./js'));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Twitter API variables
let recieved;
let sent;
let logList;
let twitterData;
let friendResults;

// Twitter Data Promise Handling
messagesRecieved()

.then((results) => {recieved = results})

.then(messagesSent)

.then((results) => {sent = results; logList = dmConvo(recieved.messagesRecieved, sent.messagesSent)})

.then(twitterTimeline)

.then((results) => {twitterData = results})

.then(twitterFriends)

.then((results) => {friendResults = results});

// Routes

// Main Page
app.get('/', (req, res) => {
	res.render('layout', {
		data: twitterData, 
		tweets: twitterData.tweets, 
		friends: friendResults.friends, 
		logList: logList[0][0],
		users: logList[1]
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

// Route to load new tweets when the user posts a new tweet
app.get('/newtweet/', (req, res) => {

	// GET updated tweets 
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

// Route to remove friend with twitter API POST request
app.post('/unfriend/', (req, res) => {

	// Call unfriend with req.body property: friend
	unfriend(req.body.friend);

	// End Route
	return res.end();
});

// Route to send tweet POST
app.post('/status/', (req, res) => {

	// Call statusUpdate with req.body property: tweet
	statusUpdate(req.body.tweet);

	// End Route
	return res.end();
});

//Error Handlers

app.use(function (req, res, next) {
	console.log('404 error')
	res.render('error', {
		error: '404 page not found.'
	})  
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  console.log('500 interal server error')
	res.render('error', {
		error: 'An internal server error has occured.'
	})   
})

// Server
app.listen(3000, () => {
	console.log("Server is running on port 3000.")
});


