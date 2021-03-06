'use strict';
const timeago = require('timeago.js'),
winston 	  = require('winston');


// Setup winston logging
const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      //json: true
    })
  ]
});
logger.level = 'error';

// Determine unique user messages from reoccuring user messages 
const dmConvo = (recieved, sent) => {

	logger.verbose('twitterAPIData.js: dmConvo(recieved, sent) CALLED | ', 'Create unique Sender/Recipient Objects & Uninque Name Array > Push both recieved & sent messages to respective Unique User Object > Sort messages by date');
	logger.debug('twitterAPIData.js: dmConvo Arguments | ', {dmConvo_arguments: [recieved, sent]});

	const unique = {};
	const distinct = [];
	for(let i = 0; i < recieved.length; i++) {

		// If the unique object does not have a Key of a sender's name
		if(typeof(unique[recieved[i].sender]) == "undefined") {

			// Push sender's name to distinct array - this will hold unique users
			distinct.push(recieved[i].sender);

			// Create Key of sender's name within unique & Value of an array w/ message data
			unique[recieved[i].sender] = [recieved[i]];
		} else {

			// If Key has already been created, push the data to the Value's array
			unique[recieved[i].sender].push(recieved[i])
		}
	}
	for(let i = 0; i < sent.length; i++) {

		// If the unique object does not have a Key of a recipient's name
		if(typeof(unique[sent[i].recipient]) == "undefined") {

			// Push recipient's name to distinct array - this will hold unique users
			distinct.push(sent[i].recipient);

			// Create Key of recipient's name within unique & Value of an array w/ message data
			unique[sent[i].recipient] = [sent[i]];
		} else {

			// If Key has already been created, push the data to the Value's array
			unique[sent[i].recipient].push(sent[i])
		}
	}

	const logList = [];

	// Sort messages based on date sent
	for(let i in unique) {
		unique[i].sort(compare)
		logList.push(unique[i])
	}

	logger.verbose('twitterAPIData.js: dmConvo(recieved, sent) RETURNING | ', 'Returning [logList Object & Unqiue User Array]');
	logger.debug('twitterAPIData.js: dmConvo returned object | ', {dmConvo_returnObject: [logList, distinct]});

	return [logList, distinct]

}

// Sorting callback
const compare = (a, b) => {
	if(a.rawDate > b.rawDate) {
		return -1
	}
	if(a.rawDate < b.rawDate) {
		return 1
	}
	return 0
}

// MessagesRecieved Resolver Callback
const mRCallback = (messages) => {

	logger.verbose('twitterAPIData.js: mRCallback(messages) CALLED | ', 'Object Creator for twitterData.js: messagesRecieved() data')
	logger.debug('twitterAPIData.js: mRCallback Argument | ', {mRCallback_arguments: messages});

	const promise = {};
	promise.messagesRecieved = [];

	// Generate messages based on amount of messagesRecieved
	for(let i = 0; i < messages.length; i++) {

		// Push messages to the messagesRecieved array within the promise object
		promise.messagesRecieved.push({msg: messages[i].text, date: new timeago().format(messages[i].created_at), profile_img: messages[i].sender.profile_image_url, rawDate: new Date(messages[i].created_at).getTime(), id_str: messages[i].id_str, sender: messages[i].sender.name, msgIn: true})
	}

	logger.verbose('twitterAPIData.js: mRCallback(messages) RETURNING | ', 'Returning object');
	logger.debug('twitterAPIData.js: mRCallback returned object | ', {mRCallback_returnObject: promise});

	return promise
}

// MessagesSent Resolver Callback
const mSCallback = (messages) => {

	logger.verbose('twitterAPIData.js: mSCallback(messages) CALLED | ', 'Object Creator for twitterData.js: messagesSent() data');
	logger.debug('twitterAPIData.js: mSCallback Argument | ', {mSCallback_argument: messages});

	const promise = {};
	promise.messagesSent = [];

	// Generate messages based on amount of messagesSent
	for(let i = 0; i < messages.length; i++) {

		// Push messages to the messagesSent array within the promise object
		promise.messagesSent.push({msg: messages[i].text, date: new timeago().format(messages[i].created_at), profile_img: messages[i].sender.profile_image_url, rawDate: new Date(messages[i].created_at).getTime(), id_str: messages[i].id_str, recipient: messages[i].recipient.name, msgOut: true})
	}

	logger.verbose('twitterAPIData.js: mSCallback(messages) RETURNING | ', 'Returning object');
	logger.debug('twitterAPIData.js: mRSallback returned object | ', {mRCallback_returnObject: promise});

	return promise
}

// Callback for User's timeline
const tweetsCallback = (tweets) => {
	
	logger.verbose('twitterAPIData.js: tweetsCallback(tweets) CALLED | ', 'Object Creator for twitterData.js: twitterTimeline() data | ')
	logger.debug('twitterAPIData.js: tweetsCallback Argument | ', {tweetsCallback_argument: tweets});

	const promise = {};

	// Create properties to the promise object: name; screen name; profile img
	promise.name = tweets[0].user.name;
	promise.screen_name = tweets[0].user.screen_name;
	promise.profile_img = tweets[0].user.profile_image_url;
	promise.tweets = [];
	promise.friends_count = tweets[0].user.friends_count;

	// Generate 10 tweet objects with properties of: tweet text; date tweeted; favorite count; retweet count
	for(let i = 0; i < 10; i++) {

		// Push tweets to the tweet array within the promis object
		promise.tweets.push({text: tweets[i].text, date: new timeago().format(tweets[i].created_at), favorite_count: tweets[i].favorite_count, retweet_count: tweets[i].retweet_count});
	}

	logger.verbose('twitterAPIData.js: tweetsCallback(tweets) RETURNING | ', 'Returning object')
	logger.debug('twitterAPIData.js: tweetsCallback returned Object | ', {tweetsCallback_returnObject: promise})

	return promise
}

const friendsCallback = (friends) => {

	logger.verbose('twitterAPIData.js: friendsCallback(friends) CALLED | ', 'Object Creator for twitterData.js: twitterFriends() data');
	logger.debug('twitterAPIData.js: friendsCallback Argument | ', {friendsCallback_argument: friends});

	const promise = {};
	promise.friends = [];

	// Generate 10 friend objects with properties of: name; screen name; profile img
	for( let i = 0; i < 10; i++) {

		// Push friends to the friends array within the promise object
		promise.friends.push({name: friends.users[i].name, screen_name: friends.users[i].screen_name, profile_img: friends.users[i].profile_image_url})
	}

	logger.verbose('twitterAPIData.js: friendsCallback(friends) RETURNING | ', 'Returning object');
	logger.debug('twitterAPIData.js: friendsCallback returned Object | ', {friendsCallback_returnObject: promise});

	return promise
}



module.exports.dmConvo 		   = dmConvo;
module.exports.tweetsCallback  = tweetsCallback;
module.exports.friendsCallback = friendsCallback;
module.exports.mRCallback 	   = mRCallback;
module.exports.mSCallback 	   = mSCallback;


