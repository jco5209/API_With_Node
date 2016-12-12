'use strict';
const express = require('express');
const app = express();
const Twitter = require('twitter');
const twitterTimeline = require('./twitterData.js').twitterTimeline;
const twitterFriends = require('./twitterData.js').twitterFriends;

app.set('views', './templates');
app.set('view engine', 'jade');
app.use(express.static('./css'));
app.use(express.static('./images'));

twitterTimeline()
.then(twitterFriends)
.then((data) => {
	app.get('/', (req, res) => {
		res.render('layout', {tweets: data.tweets, friends: data.friends});
	})
});

app.listen(3000, () => {
	console.log("Server is running on port 3000.")
});


