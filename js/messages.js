(function() {

	var dmLog = $('.app--message--conversation');
	var userLog = $('.user--log');
	var log = $('.log');
	var convos = $('.user--log--content');

	var tweet = $('#tweet-textarea');
	var tweetButton = $('.button-primary');
	var tweetChr = $('#tweet-char');
	var tweetLimit = true;


	// Toggle Conversation Logs Display
	userLog.click(function() {
		convos.toggle();
	});

	// On conversation log selection, load new conversation
	log.click(function() {

		// Index of selected conversation
		var userIndex = log.index(this);

		// Selected user text
		var userText = $(this).text();

		// Replace current user conversatoin with selected user
		userLog.text(userText + ' ▼');

		// Get request loads new conversation, userIndex is passed as :id parameter 
		$.get( "/newmessages/" + userIndex, function( data ) {

			// Clear HTML
			dmLog.html('');

			// Load new HTML
			dmLog.html(data);
		});

		convos.toggle();

	});


	tweetButton.click(function(e) {
		e.preventDefault();
		console.log(tweet.val());
		if(tweetLimit) {
			$.post( "/status/" + tweet.val(), function(data) {
				console.log(data)
			} );
		}
	});


	tweet.on('change keyup paste', function() {
		console.log('changed! ', tweet.val().length);
		var tweetLimit = 140 - tweet.val().length;
		tweetChr.text(tweetLimit);
		if(tweetLimit < 0) {
			tweetChr.css('color', '#eb4a33');
			tweetLimit = false;
		} else if(tweetChr.css('color') != 'rgb(204, 204, 204)'){
			tweetChr.css('color', '#ccc');
			tweetLimit = true;
		}
	});

})()


