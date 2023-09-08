function ReviewLesson(school, level, groups) {
	var mechanism = 1;
	this.exercises = new Array();
	
	// Compile exercises of all groups in this level
	for (var i = 0; i < groups.length; i++) {		
		var exerciseGroup = new ExerciseGroup(school, level, groups[i], mechanism, 0);
		this.exercises = this.exercises.concat(exerciseGroup.exercises);
	}
    
	// Add review score exercises
	var scoreExercises = new Array();
	if (level < 5) {
		var xmlhttp;
		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		}
		else {// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET","quincy/scores/scoreIndex.xml", false);
		xmlhttp.send();
		
		var scoreInfo = xmlhttp.responseXML;
		var i = 0;
		var length = scoreInfo.getElementsByTagName("score").length;
		
		for (; i < length; i++) {
			if (scoreInfo.getElementsByTagName("score")[i].getAttribute("school") == school &&
				scoreInfo.getElementsByTagName("score")[i].getAttribute("level") == level &&
				scoreInfo.getElementsByTagName("score")[i].getAttribute("type") == "review") {
				break;	
			}
		}
		
		for (; i < length; i++) {
			var scoreFileName = scoreInfo.getElementsByTagName("score")[i].getAttribute("fileName");
			var solution = scoreInfo.getElementsByTagName("score")[i].getAttribute("solution");
			scoreExercises.push(new ScoreExercise(school, level, scoreFileName, solution, mechanism));
			
			if (i + 1 >= length ||
				scoreInfo.getElementsByTagName("score")[i+1].getAttribute("school") != school ||
				scoreInfo.getElementsByTagName("score")[i+1].getAttribute("level") != level ||
				scoreInfo.getElementsByTagName("score")[i+1].getAttribute("type") != "review") {
				break;	
			}
		}
		
		// Randomly draw 2 score exercises!!!!!!!!!!!!!!!!
		scoreExercises = shuffle(scoreExercises);
		scoreExercises.splice(2, scoreExercises.length - 2);
	}
	else if (level == 6) {
		var xmlhttp;
		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		}
		else {// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET","quincy/scores/" + school + "_level_6_score_index.xml", false);
		xmlhttp.send();
		
		var scoreInfo = xmlhttp.responseXML;
		var length = scoreInfo.getElementsByTagName("score").length;
			
		if (school == "StGall") {
			for (var i = 0; i < length; i++) {
				if (scoreInfo.getElementsByTagName("score")[i].getAttribute("type") == "review") {
					var scoreFileName = scoreInfo.getElementsByTagName("score")[i].getAttribute("fileName");
					var solution = scoreInfo.getElementsByTagName("score")[i].getAttribute("solution");
					var symbolPos = scoreInfo.getElementsByTagName("score")[i].getAttribute("symbolPos");
					this.exercises.push(new ScoreExercise2(this.school, this.level, scoreFileName, solution, symbolPos, mechanism));
				}
			}
		}
		else {			
			for (var i = 0; i < length; i++) {
				if (scoreInfo.getElementsByTagName("score")[i].getAttribute("type") == "review") {
					var scoreFileName = scoreInfo.getElementsByTagName("score")[i].getAttribute("fileName");
					var solution = scoreInfo.getElementsByTagName("score")[i].getAttribute("solution");
					var symbolPos = scoreInfo.getElementsByTagName("score")[i].getAttribute("symbolPos");
					var symbolPosRange = scoreInfo.getElementsByTagName("score")[i].getAttribute("symbolPosRange");
					this.exercises.push(new LaonLevel6ScoreExercise(this.school, this.level, scoreFileName, solution, symbolPos, symbolPosRange, mechanism));
				}
			}
		}
	}

	// Combine regular exercises and 2 score exercises, then shuffle
	this.exercises = this.exercises.concat(scoreExercises);
	this.exercises = shuffle(this.exercises);
	this.numOfQuestions = this.exercises.length;
	
	this.exercises.splice(0, 0, new IntroPage(school, level, groups.length + 1));
	this.exercises.push(new EndPage(school, level, groups.length + 1));
	
	this.currentEx = 0;
    this.start = true;	
}

ReviewLesson.prototype.initUI = function(container_div_id) {
	this.container_div = document.getElementById(container_div_id);
	this.container_div.innerHTML = 
		'<div id="lesson">' +
	      '<div id="questionhere"><div id="question"></div></div>' +
		  '<div id="progressBarOutline"><div id="progressBar"></div></div>' +
	      '<div id="dynamicArea"></div>' +
	      '<div id="controls"></div>' +
		  '<button id="excercise-btn" type="button" ><a>Go to Review >></a></button>' +
	      '<div id="hint"></div>' +
	    '</div>';
	
	// control buttons
	document.getElementById("controls").innerHTML = 
         '<div id="prev"><img id="prev-img"  src="quincy/img/left.gif" /></div>' +
         '<div id="next"><img id="next-img"  src="quincy/img/right.gif" /></div>';
		 
    this.exercises[0].show(0);

	var self = this;
	document.getElementById("prev").onclick = function() {
	    self.prevQuestion();
	    
	};
	document.getElementById("next").onclick = function() {
	    self.nextQuestion();
	    document.getElementById("progressBarOutline").style.display = "block";
	    document.getElementById("prev").style.visibility = "visible";
	};
	document.getElementById("excercise-btn").onclick = function() {
	    self.nextQuestion();
	    document.getElementById("progressBarOutline").style.display = "block";
	};

	if(this.currentEx == 0){
		document.getElementById("prev").style.visibility = "hidden";//init
		document.getElementById("next").style.visibility = "hidden";
		document.getElementById("excercise-btn").style.display = "block";
	}
	
	window.onclick = function(event) {
	    if (event.target.id != "checkAnswer" && document.getElementById("hint").innerHTML) {
		    document.getElementById("hint").innerHTML = "";
		}
	};			
}

ReviewLesson.prototype.prevQuestion = function() {
    if (this.currentEx > 0 && this.currentEx < this.exercises.length -1) {
		this.exercises[this.currentEx].saveAnswer();
		this.exercises[this.currentEx].grade();
	}
	
    if (this.currentEx > 0) {
	    this.currentEx--;
	}
	this.exercises[this.currentEx].show(this.currentEx, this.numOfQuestions);
	
	if (this.currentEx > 0) {
		this.showProgress(this.currentEx);
		document.getElementById("excercise-btn").style.visibility = "hidden";
		document.getElementById("excercise-btn").style.marginTop = "0px";
		document.getElementById("excercise-btn").style.marginBottom = "0px";
	}
	else {
		this.hideProgress();
	}
	document.getElementById("next").style.visibility = "visible";
	if(this.currentEx==0){
	    document.getElementById("prev").style.visibility = "hidden";
		document.getElementById("next").style.visibility = "hidden";
		//document.getElementById("excercise-btn").style.display = "block";
		document.getElementById("excercise-btn").style.visibility = "visible";
		document.getElementById("excercise-btn").style.marginTop = "30px";
		document.getElementById("excercise-btn").style.marginBottom = "40px";
		
		//document.getElementById("progressBarOutline").style.display = "none";//yoyo
		}
	
}

ReviewLesson.prototype.nextQuestion = function() {
	if (this.currentEx > 0 && this.currentEx < this.exercises.length -1) {
		this.exercises[this.currentEx].saveAnswer();
		this.exercises[this.currentEx].grade();
	}
    
	if (this.currentEx < this.exercises.length - 1) {
	    this.currentEx++;
	}
	if (this.currentEx > 0) {
		document.getElementById("excercise-btn").style.visibility = "hidden";
		document.getElementById("excercise-btn").style.marginTop = "0px";
		document.getElementById("excercise-btn").style.marginBottom = "0px";
		//document.getElementById("excercise-btn").style.display = "none";
	}	
	this.exercises[this.currentEx].show(this.currentEx, this.numOfQuestions);
	this.showProgress(Math.min(this.currentEx, this.numOfQuestions));

	document.getElementById("prev").style.visibility = "visible";
	document.getElementById("next").style.visibility = "visible";

	if (this.currentEx == this.exercises.length - 1) {
		document.getElementById("next").style.visibility = "hidden";
	}

    // If question 1 is shown for the first time, start timer
	if (this.currentEx == 1 && this.start == true) {
		var date1 = new Date();
		this.startTime = date1.getTime();
		this.start = false;
	}
}

ReviewLesson.prototype.showProgress = function(count) {
	var html = "";
	for (var i = 0; i < count; i++) {
		html = '<div class="progressBar" style="width:' + (851 / this.numOfQuestions)*(i+1) + 'px"></div>';
	}
	document.getElementById("progressBar").innerHTML = html;
}

ReviewLesson.prototype.hideProgress = function(count) {
	document.getElementById("progressBar").innerHTML = "";
}