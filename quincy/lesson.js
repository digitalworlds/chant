function Lesson(school, level, group) {
	this.exerciseGroup = new ExerciseGroup(school, level, group, 1, 1);
	this.numOfQuestions = this.exerciseGroup.exercises.length - 2;
	this.currentEx = 0;
}

Lesson.prototype.initUI = function(container_div_id) {
	this.container_div = document.getElementById(container_div_id);
	this.container_div.innerHTML = 
		// dynamicArea width is 728px!
	    '<div id="lesson">' +
	      '<div id="questionhere"><div id="question"></div></div>' +
		  '<div id="progressBarOutline"><div id="progressBar"></div></div>' +
	      '<div id="dynamicArea"></div>' +
	      '<div id="controls"></div>' +
	      '<button id="excercise-btn" type="button"><a>Go to Excercises >></a></button>'+
	      '<div id="hint"></div>' +
	    '</div>';
	
	// control buttons
	document.getElementById("controls").innerHTML = 
         '<div id="prev"><img id="prev-img"  src="quincy/img/left.gif" /></div>' +
         '<div id="next"><img id="next-img"  src="quincy/img/right.gif" /></div>';
		 
	this.exerciseGroup.exercises[0].show(0);
	
	var self = this;
	document.getElementById("prev").onclick = function() {
	    self.prevQuestion();
	    //document.getElementById("progressBarOutline").style.display = "block";
	};
	document.getElementById("next").onclick = function() {
	    self.nextQuestion();
	    //document.getElementById("progressBarOutline").style.display = "block";
	};
	document.getElementById("excercise-btn").onclick = function() {
	    self.nextQuestion();
	    document.getElementById("progressBarOutline").style.display = "block";
	};

/*
	document.getElementById("continueToExLink").onclick = function () {
	    self.nextQuestion();
	    document.getElementById("progressBarOutline").style.display = "block";
	};
	*/
	window.onclick = function(event) {
	    if ((event.target.id != "checkAnswer") && (event.target.id != "cheat") && document.getElementById("hint").innerHTML) {
		    document.getElementById("hint").innerHTML = "";
		}
	};

	if(this.currentEx == 0){
		document.getElementById("prev").style.visibility = "hidden";
		document.getElementById("next").style.visibility = "hidden";
		document.getElementById("excercise-btn").style.display = "block";
		document.getElementById("progressBarOutline").style.display = "none";//yoyo
		
		//document.getElementById("excercise-btn").onclick = function() {
	   // self.nextQuestion();
	   // document.getElementById("progressBarOutline").style.display = "block";
		//};
	}
}

Lesson.prototype.prevQuestion = function() {
	if (this.currentEx > 0 && this.currentEx < this.exerciseGroup.exercises.length - 1) {
		this.exerciseGroup.exercises[this.currentEx].saveAnswer();
	}

    if (this.currentEx > 0) {
	    this.currentEx--;
	}    
	this.exerciseGroup.exercises[this.currentEx].show(this.currentEx, this.numOfQuestions);
	if (this.currentEx > 0) {
		this.showProgress(this.currentEx);
		document.getElementById("excercise-btn").style.visibility = "hidden";
		document.getElementById("excercise-btn").style.marginTop = "0px";
		document.getElementById("excercise-btn").style.marginBottom = "0px";
		//document.getElementById("excercise-btn").style.display = "none";
	}
	else {
		this.hideProgress();
	}

	document.getElementById("next").style.visibility = "visible";

	if(this.currentEx == 0){
		document.getElementById("prev").style.visibility = "hidden";
		document.getElementById("next").style.visibility = "hidden";
		//document.getElementById("excercise-btn").style.display = "block";
		document.getElementById("excercise-btn").style.visibility = "visible";
		document.getElementById("excercise-btn").style.marginTop = "30px";
		document.getElementById("excercise-btn").style.marginBottom = "40px";
		
		document.getElementById("progressBarOutline").style.display = "none";//yoyo

	}
	
}

Lesson.prototype.nextQuestion = function() {
	if (this.currentEx > 0 && this.currentEx < this.exerciseGroup.exercises.length - 1) {
		this.exerciseGroup.exercises[this.currentEx].saveAnswer();
	}
    if (this.currentEx < this.exerciseGroup.exercises.length - 1) {
	    this.currentEx++;
	}
	if (this.currentEx > 0) {
		document.getElementById("excercise-btn").style.visibility = "hidden";
		document.getElementById("excercise-btn").style.marginTop = "0px";
		document.getElementById("excercise-btn").style.marginBottom = "0px";
		//document.getElementById("excercise-btn").style.display = "none";
	}

	document.getElementById("prev").style.visibility = "visible";
	document.getElementById("next").style.visibility = "visible";//yo

	if (this.currentEx == this.exerciseGroup.exercises.length - 1) {
		document.getElementById("next").style.visibility = "hidden";
	}
	this.exerciseGroup.exercises[this.currentEx].show(this.currentEx, this.numOfQuestions);
	this.showProgress(Math.min(this.currentEx, this.numOfQuestions));
}

Lesson.prototype.showProgress = function(count) {
	var html = "";
	for (var i = 0; i < count; i++) { // 728 or 635
		html = '<div class="progressBar" style="width:' + (851 / this.numOfQuestions)*(i+1) + 'px"></div>';//yoyo
	}
	document.getElementById("progressBar").innerHTML = html;
}

Lesson.prototype.hideProgress = function(count) {
	document.getElementById("progressBar").innerHTML = "";
}