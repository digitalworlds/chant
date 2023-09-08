function IntroPage(school, level, group) {
	this.school = school;
	this.level = level;
	this.group = group;
	this.stGallGroup = [["Single-note Neums", "Repercussive Neums", "Two-note Neums", "Three-note Neums", "Four- or Five-note Neums", "Review Lesson", "Assessment"],
	                    ["Single-note Neums", "Repercussive Neums", "Two-note Neums", "Three-note Neums", "Four- or Five-note Neums", "Review Lesson", "Assessment"],
						["Melodic Implications", "Melodic and Rhythmic Implications", "Review Lesson", "Assessment"],
						["Melodic Implications", "Rhythmic Implications", "Modifying Letters", "Combinations", "Infrequently Used", "Combined Letters Separate Meanings", "Others", "Review Lesson", "Assessment"],
						["Quilisma", "Oriscus Basics", "Oriscus Variations", "Liquescence", "Review Lesson", "Assessment"],
						["Neumatic Breaks", "Review Lesson", "Assessment"]];
						
	this.laonGroup =   [["Single-note Neums", "Repercussive Neums", "Two-note Neums", "Three-note Neums", "Four- or Five-note Neums", "Review Lesson", "Assessment"],
	                    ["Single-note Neums", "Repercussive Neums", "Two-note Neums", "Three-note Neums", "Four- or Five-note Neums", "Review Lesson", "Assessment"],
						["Melodic Implications", "Melodic and-or Rhythmic Implications", "Review Lesson", "Assessment"],
						["Melodic Implications", "Rhythmic Implications", "Melodic or Rhythmic Implications", "Combinations", "Combined Letters Separate Meanings", "Tironien Signs", "Review Lesson", "Assessment"],
						["Quilisma", "Oriscus Basics", "Oriscus Variations", "Liquescence", "Review Lesson", "Assessment"],
						["Neumatic Breaks", "Review Lesson", "Assessment"]];
						
	this.combinedLevels = ["Simple Neums", "Neums with Repercussive and Rhythmic Signs", "Neumative Alternations with Melodic and Rhythmic Alterations", "", "Special Signs"];
	
	
}

IntroPage.prototype.show = function() {
	
	if (this.school == "StGall") {
		document.getElementById("question").innerHTML = this.stGallGroup[this.level - 1][this.group - 1];
	}
	else if (this.school == "Laon") {
		document.getElementById("question").innerHTML = this.laonGroup[this.level - 1][this.group - 1];
	}
	else {
		document.getElementById("question").innerHTML = this.combinedLevels[this.level - 1];
	}
	
	// Show instruction videos for this group
	if (this.school == "StGall" || this.school == "Laon") {
		
		if (this.school == "StGall" && this.group <= this.stGallGroup[this.level - 1].length - 2 ||
			this.school == "Laon" && this.group <= this.laonGroup[this.level - 1].length - 2) {
			if (this.school == "StGall") {
				console.log(this.level-1);
		        console.log(this.group-1);
		        console.log(videoDesc_gall[this.level-1][this.group-1][0]);
		        console.log(videoDesc_gall[this.level-1][this.group-1][1]);
		        console.log(videoDesc_gall[this.level-1][this.group-1][2]);
		        
				var videoDesc1 = videoDesc_gall[this.level-1][this.group-1][0];
				var videoDesc2 = videoDesc_gall[this.level-1][this.group-1][1];
				var videoDesc3 = videoDesc_gall[this.level-1][this.group-1][2];
			}
			else if (this.school == "Laon") {
				var videoDesc1 = videoDesc_laon[this.level-1][this.group-1][0];
				var videoDesc2 = videoDesc_laon[this.level-1][this.group-1][1];
				var videoDesc3 = videoDesc_laon[this.level-1][this.group-1][2];
			}
			document.getElementById("dynamicArea").innerHTML =
			'<a href="javascript:void(0)" onclick="document.getElementById(\'video-' + this.school + '-' + this.level + '-' + this.group + '-1\').style.display=\'block\';document.getElementById(\'fade\').style.display=\'block\'"><div id="video_thumbnail1"></div></a>' +
			'<div class="box"><div class="video-description">'+videoDesc1+'<br><br><a href="transcripts/transcript_'+this.school+'_'+this.level+'_'+this.group+'_1.pdf" target="_blank" >Click here for the Transcript.</a></div></div>' +
			
			'<a href="javascript:void(0)" onclick="document.getElementById(\'video-' + this.school + '-' + this.level + '-' + this.group + '-2\').style.display=\'block\';document.getElementById(\'fade\').style.display=\'block\'"><div id="video_thumbnail2"></div></a>' +
			'<div class="box"><div class="video-description">'+videoDesc2+'<br><br><a href="transcripts/transcript_'+this.school+'_'+this.level+'_'+this.group+'_2.pdf" target="_blank" >Click here for the Transcript.</a></div></div>'  + 
		
			'<a href="studyGuide/studyGuide-'+this.school+'-'+this.level+'-'+this.group+'.pdf" target="_blank"><div id="video_thumbnail3"></div></a>' +
			'<div class="box"><div class="video-description">'+videoDesc3+'<br><br></div></div>';

			//set video thumbnails
			document.getElementById("video_thumbnail1").style.backgroundImage = "url('images/thumbnails/" + this.school + "-thumbnail-" + this.level + "-" + this.group + "-1.jpg')";
			document.getElementById("video_thumbnail2").style.backgroundImage = "url('images/thumbnails/" + this.school + "-thumbnail-" + this.level + "-" + this.group + "-2.jpg')";
			document.getElementById("video_thumbnail3").style.backgroundImage = "url('images/thumbnails/" + this.school + "-thumbnail-" + this.level + "-" + this.group + "-3.jpg')";
		}
		// Show instruction text for review
		if (this.school == "StGall" && this.group == this.stGallGroup[this.level - 1].length - 1 ||
			this.school == "Laon" && this.group == this.laonGroup[this.level - 1].length - 1) {
			// Level 4
			if (this.school == "StGall" && this.level == 4) {
				document.getElementById("dynamicArea").innerHTML =
				    '<div class = "introText">All of the previous exercises are assembled together here for your review.<br><br>Below there is a study guide to help you prepare.<br><br>When you are ready to begin, click the link below to go to the review exercises.</div>'+
				    '<a class="nonblock nontext museBGSize grpelem" id = "studyGuideGall" href="St_Gall_Level_Four_ Study_Guide.pdf" target="_blank"></a><a href="St_Gall_Level_Four_ Study_Guide.pdf" target="_blank" style="z-index: 92; width: 160px; height: 20px; position: relative; margin-right: -10000px; left:382px; top:200px; color: black;">Study Guide</a>';
			}
			else if (this.school == "Laon" && this.level == 4){
				document.getElementById("dynamicArea").innerHTML =
				    '<div class = "introText">All of the previous exercises are assembled together here for your review.<br><br>Below there is a study guide to help you prepare.<br><br>When you are ready to begin, click the link below to go to the review exercises.</div>'+
				    '<a class="nonblock nontext museBGSize grpelem" id = "studyGuideLaon" href="Laon_Level_Four_ Study_Guide.pdf" target="_blank"></a><a href="Laon_Level_Four_ Study_Guide.pdf" target="_blank" style="z-index: 92; width: 160px; height: 20px; position: relative; margin-right: -10000px; left:382px; top:200px; color: black;">Study Guide</a>';
			}
			else if (this.level == 6){
				document.getElementById("dynamicArea").innerHTML =
					'<div class = "introText">All of the previous exercises are assembled together here, along with some additional questions, for your review.<br><br>When you are ready to begin, click the link below to go to the review exercises.</div>';
			}
			else if (this.level == 5){
				document.getElementById("dynamicArea").innerHTML =
					'<div class = "introText">All of the previous exercises are assembled together here for your review.<br><br>When you are ready to begin, click the link below to go to the review exercises.</div>';
			}
			else {
				document.getElementById("dynamicArea").innerHTML =
					'<div class = "introText">All of the previous exercises are assembled together here for your review.<br><br>In addition, there are some surprise questions to help you synthesize the material in this level.<br><br>When you are ready to begin, click the link below to go to the review exercises.</div>';
			}
		}
		// Show instruction text for test
		if (this.school == "StGall" && this.group == this.stGallGroup[this.level - 1].length ||
			this.school == "Laon" && this.group == this.laonGroup[this.level - 1].length) {
			// Level 4
			if (this.level == 4) {
				document.getElementById("dynamicArea").innerHTML =
					'<div class = "introText">This test consists of a small number of questions taken randomly from the various exercises for this level.<br><br>In the assessment you will be able to review your answers and see your score only when the test is complete.<br><br>When you are ready to begin, click the link below to go to the assessment.</div>';
			}
			else if (this.level == 6){
				document.getElementById("dynamicArea").innerHTML =
					'<div class = "introText">This test consists of a small number of questions taken randomly from the various exercises for this level, along with some new questions.<br><br>In the assessment you will be able to review your answers and see your score only when the test is complete.<br><br>When you are ready to begin, click the link below to go to the assessment.</div>';
			}
			else if (this.level == 5){
				document.getElementById("dynamicArea").innerHTML =
					'<div class = "introText">This test consists of a small number of questions taken randomly from the various exercises for this level.<br><br>In the assessment you will be able to review your answers and see your score only when the test is complete.<br><br>When you are ready to begin, click the link below to go to the assessment.</div>';
			}
			else {
				document.getElementById("dynamicArea").innerHTML =
					'<div class = "introText">This test consists of a small number of questions taken randomly from the various exercises for this level. In addition, there are some surprise questions to assess your synthesis of the material in this level.<br><br>In the assessment you will be able to review your answers and see your score only when the test is complete.<br><br>When you are ready to begin, click the link below to go to the assessment.</div>';
			}
		}
	}
	else {
		var text;
		if (this.level == 1) {
			text = '<div class = "introText">This level asks you to match simple neums of the St. Gall notation with the corresponding neums of the Laon notation or vice versa.</div>';
		}
		else if (this.level == 2) {
			text = '<div class = "introText">This level asks you to match neums with repercussive and/or rhythmic signs of the St. Gall notation with the corresponding neums of the Laon notation or vice versa.</div>';
		}
		else if (this.level == 3) {
			text = '<div class = "introText">This level asks you to match neums with alterations that have melodic and/or rhythmic implications of the St. Gall notation with the corresponding neums of the Laon notation or vice versa.</div>';
		}
		else if (this.level == 5) {
			text = '<div class = "introText">This level asks you to match quilismatic, oriscus, or liquescent neums of the St. Gall notation with the corresponding neums of the Laon notation or vice versa.</div>';
		}
		document.getElementById("dynamicArea").innerHTML = text;
	}
}