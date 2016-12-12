const Twitter = require('twitter');
const format = require('dateformat');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const params = {screen_name: 'joerogan'};

const twitterTimeline = () => {
	const promise = new Promise((resolve, reject) => {
		client.get('statuses/user_timeline', params, (error, tweets, response) => {
		  if (!error) {
		    resolve({
		    	name: tweets[0].user.name,
		    	screen_name: tweets[0].user.screen_name,
		    	profile_img: tweets[0].user.profile_image_url,
		    	tweet1: {text: tweets[0].text, date: tweetTime(tweets[0].created_at), favorite_count: tweets[0].favorite_count, retweet_count: tweets[0].retweet_count}, 
		    	tweet2: {text: tweets[1].text, date: tweetTime(tweets[1].created_at), favorite_count: tweets[1].favorite_count, retweet_count: tweets[1].retweet_count},
		    	tweet3: {text: tweets[2].text, date: tweetTime(tweets[2].created_at), favorite_count: tweets[2].favorite_count, retweet_count: tweets[2].retweet_count},
		    	tweet4: {text: tweets[3].text, date: tweetTime(tweets[3].created_at), favorite_count: tweets[3].favorite_count, retweet_count: tweets[3].retweet_count},
		    	tweet5: {text: tweets[4].text, date: tweetTime(tweets[4].created_at), favorite_count: tweets[4].favorite_count, retweet_count: tweets[4].retweet_count}
		    })
		  }
		});	
	})	
	return promise
}

const twitterFriends = (tweets) => {
	const promise = new Promise((resolve, reject) => {
		client.get('friends/list', params, function(error, friends, response) {
		  if (!error) {
		  	resolve({
		  		tweets: tweets,
		  		friends: {
			  		friend1: {name: friends.users[0].name, screen_name: friends.users[0].screen_name, profile_img: friends.users[0].profile_image_url},
			  		friend2: {name: friends.users[1].name, screen_name: friends.users[1].screen_name, profile_img: friends.users[1].profile_image_url},
			  		friend3: {name: friends.users[2].name, screen_name: friends.users[2].screen_name, profile_img: friends.users[2].profile_image_url},
			  		friend4: {name: friends.users[3].name, screen_name: friends.users[3].screen_name, profile_img: friends.users[3].profile_image_url},
			  		friend5: {name: friends.users[4].name, screen_name: friends.users[4].screen_name, profile_img: friends.users[4].profile_image_url}
		  		}
		  	})
		  }
		});	
	})
	return promise
}

const tweetTime = (created_at) => {
	const now = parseInt(format(new Date(), 'HH', true));
	const timeTweeted = parseInt(created_at.split(" ")[3]);
	let dateTweeted = created_at.split(" ");
	dateTweeted.splice(3);
	dateTweeted = dateTweeted[0] + ' / ' + dateTweeted[1] + ' / ' + dateTweeted[2]; 
	if(now - timeTweeted >= 1) {
		return (now - timeTweeted) + 'h';
	} else if(now - timeTweeted === 0){
		return '>1h';
	} else {
		return dateTweeted
	}
}

module.exports.twitterTimeline = twitterTimeline;
module.exports.twitterFriends = twitterFriends;

