(function() {
	
	var dmLog 		= $('.app--message--conversation'),
	userLog 		= $('.user--log'),
	log 			= $('.log'),
	convos 			= $('.user--log--content'),

	tweet 			= $('#tweet-textarea'),
	tweetButton 	= $('.button-primary'),
	tweetChr 		= $('#tweet-char'),
	tweetLimit 		= true,
	tweetCounter,

	tweetList 		= $('.app--tweet--list'),
	tweetNotif 		= false,
	newTweetCounter = 1,

	following 		= $('.app--user--list li'),
	followingButton = $('.app--user--list li a.button');


	/* Event Handlers */

	// Unfollow selected 
	followingButton.click(function() { unfriend(this); });


	// On conversation log selection, load new conversation
	log.click(function() { toggleLogs(this); });


	// Toggle Conversation Logs Display
	userLog.click(function() { convos.toggle(); });


	// Post a tweet on button click
	tweetButton.click(function(e) { e.preventDefault(); postTweet(); });


	// On New Tweet Notification Click GET New Tweets
	tweetList.on("click", ".new-tweet", function() { getNewTweets(); });


	// On tweet text area input
	tweet.on('change keyup paste', function() { tweetTextInput(); });	


	/* Functions */

	// Unfollow Selected
	function unfriend(selected) {

		// Add Unfollowed Notification
		$.post('/unfriend/', { friend: friends[following.index($(selected).parents("li"))].screen_name} );

		// Unfollowed animation
		$(selected).parents("li").slideToggle( "slow", function() {});	

	}	


	// On conversation log selection, load new conversation
	function toggleLogs(selected) {

		// Index of selected conversation
		var userIndex = log.index(selected);

		// Selected user text
		var userText = $(selected).text();

		// Replace current user conversatoin with selected user
		userLog.text(userText + ' ▼');

		// Get request loads new conversation, userIndex is passed as :id parameter 
		$.get( "/newmessages/" + userIndex, function( data ) {
			dmLog.html('');
			dmLog.html(data);
		});

		convos.toggle();
	}


	// Post a tweet on button click
	function postTweet() {

		// If tweetLimit is true - there are 140 or less characters
		if(tweetLimit) {

			// Route POST request with tweet text data
			$.post( "/status/", { tweet: tweet.val() } );

			tweet.val(' ');
			tweetChr.text('140');			

			if(!tweetNotif) {

				// New Tweet Notification
				tweetList.prepend('<li class="new-tweet">New Tweet(' + newTweetCounter + ')</li>');

				tweetNotif = true;

				// Notification Animation
				setTimeout(function(){$( ".new-tweet" ).slideDown( "slow", function() {});}, 1000);

			} else if(tweetNotif) {
				newTweetCounter += 1;
				$('.new-tweet').text('New Tweet(' + newTweetCounter + ')');
			}

		}		
	}


	// On New Tweet Notification Click GET New Tweets
	function getNewTweets() {

		// New tweet notification is now off
		tweetNotif = false;

		// Reset new tweets counter
		newTweetCounter = 1;

		// New Tweets Route
		$.get("/newtweet/", function( data ) {

			// Clear old tweets
			tweetList.html('');

			// New Tweets Data
			tweetList.html(data);
		});		
	}


	// On tweet text area input
	function tweetTextInput() {

		// Calculate amount of characters left to use - limit is 140
		tweetCounter = 140 - tweet.val().length;

		// Visual for amount of characters left to use
		tweetChr.text(tweetCounter);

		// If character limit is exceeded
		if(tweetCounter < 0) {

			// Give tweetChr a visual indicator for too many characters
			tweetChr.css('color', '#eb4a33');

			// Set tweetLimit to false to reject POST request
			tweetLimit = false;

		// If tweetCounter is greater than 0 & too many character indicator is still applied			
		} else if(tweetChr.css('color') != 'rgb(204, 204, 204)'){

			// Set color back to default
			tweetChr.css('color', '#ccc');

			// Set tweetLimit to true - enbles POST request
			tweetLimit = true;
		}		
	}

})()


