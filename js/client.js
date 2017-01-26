(function() {
	
	var dmLog = $('.app--message--conversation');
	var userLog = $('.user--log');
	var log = $('.log');
	var convos = $('.user--log--content');

	var tweet = $('#tweet-textarea');
	var tweetButton = $('.button-primary');
	var tweetChr = $('#tweet-char');
	var tweetLimit = true;
	var tweetCounter;

	var tweetList = $('.app--tweet--list');

	var appUserList = $('.app--user--list li');
	var appUserListButton = $('.app--user--list li a.button')

	appUserListButton.click(function() {
		// Add Unfollowed Notification
		$.post('/unfriend/' + friends[appUserList.index($(this).parents("li"))].screen_name);

		$(this).parents("li").slideToggle( "slow", function() {});
	})

	console.log(appUserList)

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
			dmLog.html('');
			dmLog.html(data);
		});

		convos.toggle();

	});


	// Post a tweet on button click
	tweetButton.click(function(e) {
		e.preventDefault();

		// If tweetLimit is true - there are 140 or less characters
		if(tweetLimit) {

			// Route POST request with tweet text data
			$.post( "/status/" + tweet.val());
			
			tweet.val(' ');
			tweetChr.text('140');

			// New Tweet Notification
			$('.app--tweet--list').prepend('<li class="new-tweet"> +1</li>');

			// Notification Animation
			setTimeout(function(){$( ".new-tweet" ).slideDown( "slow", function() {});}, 1000);
		}
	});

	// On New Tweet Notification Click GET New Tweets
	$('.app--tweet--list').on("click", ".new-tweet", function() {
		tweetList.html('');

		// New Tweets Route
		$.get("/newtweet/", function( data ) {

			// New Tweets Data
			tweetList.html(data);
		});
	})

	// On tweet text area input
	tweet.on('change keyup paste', function() {

		// Calculate amount of characters left to use - limit is 140
		tweetCounter = 140 - tweet.val().length;

		// Visual for amount of characters left to use
		tweetChr.text(tweetCounter);

		if(tweetCounter < 0) {

			// Give tweetChr a visual indicator for too many characters
			tweetChr.css('color', '#eb4a33');

			// Set tweetLimi to false to reject POST request
			tweetLimit = false;

		// If tweetCounter is greater than 0 & too many character indicator is still applied			
		} else if(tweetChr.css('color') != 'rgb(204, 204, 204)'){

			// Set color back to default
			tweetChr.css('color', '#ccc');

			// Set tweetLimit to true - enbles POST request
			tweetLimit = true;
		}
	});








})()


