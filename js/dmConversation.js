const timeago = require('timeago.js');

// Determine unique user messages from reoccuring user messages 
const dmConvo = (recieved, sent) => {
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

	for(let i in unique) {
		unique[i].sort(compare)
	}

	return unique

}

// Sorting callback
const compare = (a, b) => {
	if(a.rawDate < b.rawDate) {
		return -1
	}
	if(a.rawDate > b.rawDate) {
		return 1
	}
	return 0
}

// MessagesRecieved Resolver Callback
const mRCallback = (messages) => {
	const promise = {};
	promise.messagesRecieved = [];
	for(let i = 0; i < messages.length; i++) {
		promise.messagesRecieved.push({msg: messages[i].text, date: new timeago().format(messages[i].created_at), profile_img: messages[i].sender.profile_image_url, rawDate: new Date(messages[i].created_at).getTime(), id_str: messages[i].id_str, sender: messages[i].sender.name})
	}
	return promise
}



// MessagesSent Resolver Callback
const mSCallback = (messages) => {
	const promise = {};
	promise.messagesSent = [];
	for(let i = 0; i < messages.length; i++) {
		promise.messagesSent.push({msg: messages[i].text, date: new timeago().format(messages[i].created_at), profile_img: messages[i].sender.profile_image_url, rawDate: new Date(messages[i].created_at).getTime(), id_str: messages[i].id_str, recipient: messages[i].recipient.name})
	}
	return promise
}




module.exports.dmConvo = dmConvo;
module.exports.mRCallback = mRCallback;
module.exports.mSCallback = mSCallback;






