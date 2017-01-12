'use strict'; 

const dmLog = $('.app--message--conversation');
const userLog = $('.user--log')

console.log(userLog.text())

userLog.click(() => {
	$.get( "/newmessages/2", function( data ) {
		dmLog.html('');
  		setTimeout(function(){ dmLog.html(data); }, 1000);
	});
})


// WRONG CLICK ELEMENT