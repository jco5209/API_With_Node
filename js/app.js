'use strict';
const express = require('express');
const app = express();
const Twitter = require('twitter');

let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let params = {screen_name: '_jtco'};

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

// client.post('statuses/update', {status: 'api test'},  (error, tweet, response) => {
//   if(error) throw error;
//   console.log(tweet);  // Tweet body. 
//   console.log(response);  // Raw response object. 
// });

app.set('views', './templates');
app.set('view engine', 'jade');
app.use(express.static('./css'));
app.use(express.static('./images'));

app.get('/', (req, res) => {
	res.render('layout')
})

app.listen(3000, () => {
	console.log("Server is running on port 3000.")
});