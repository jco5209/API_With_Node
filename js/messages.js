(function() {

	var dmLog = $('.app--message--conversation');
	var userLog = $('.user--log');
	var log = $('.log');
	var convos = $('.user--log--content');

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

})()


