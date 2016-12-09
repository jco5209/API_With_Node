'use strict';
const express = require('express');
const app = express();
const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let params = {screen_name: 'joerogan'};

client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    //console.log(tweets);
  }
});

// let stream = client.stream('statuses/filter', {track: 'nostalrius'});
// stream.on('data', (event) => {
//     console.log(event && event.text);
// });

// stream.on('error', (error) => {
//   throw error;
// });

const twitterGET = new Promise((resolve, reject) => {
	client.get('statuses/user_timeline', params, (error, tweets, response) => {
	  if (!error) {
	    resolve({tweet1: tweets[0].text, tweet2: tweets[1].text, tweet3: tweets[2].text, tweet4: tweets[3].text, tweet5: tweets[4].text})
	    console.log(tweets);
	  }
	});	
})

app.set('views', './templates');
app.set('view engine', 'jade');
app.use(express.static('./css'));
app.use(express.static('./images'));

twitterGET.then((tweets) => {
	app.get('/', (req, res) => {
		res.render('layout', {tweets: tweets});
	})
})

app.listen(3000, () => {
	console.log("Server is running on port 3000.")
});


