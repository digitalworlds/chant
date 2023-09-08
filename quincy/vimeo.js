function closeVimeo(num) {
    document.getElementById('video-' + num).style.display = 'none';
    document.getElementById('fade').style.display = 'none';
	
	var $frame = $('iframe#vimeo-' + num);
	var vidsrc = $frame.attr('src');  // saves the current iframe source
	$frame.attr('src', ''); // sets the source to nothing, stopping the video
	$frame.attr('src', vidsrc);  // sets it back to the correct link so that it reloads immediately on the next window open
}
