// A child class of Exercise
function GivenNameEnterNameExercise(language, name, answers, mechanism) {
    Exercise.call(this, mechanism);
	this.type = 9;
	this.language = language;
	this.neumName = name;
	this.answers = answers;
	this.hintOn = false;
	this.score = 0;
	this.maxScore = answers.length;
	this.studentsAnswer = new Array();
}

GivenNameEnterNameExercise.prototype = Object.create(Exercise.prototype);
GivenNameEnterNameExercise.prototype.constructor = GivenNameEnterNameExercise;

GivenNameEnterNameExercise.prototype.show = function(index, numOfQuestions) {
	var term = (this.maxScore == 1) ? "term" : "terms";
	var match = (this.maxScore == 1) ? "matches" : "match";
	
	if (this.language == 1) {
		this.questionText = "Enter the Latin " + term + " that " + match + " the given English term";
	}
	else if (this.language == 2) {
		this.questionText = "Enter the English " + term + " that " + match + " the given Latin term";
	}
	document.getElementById("question").innerHTML = "Question " + index + " of " + numOfQuestions + ": " + this.questionText + ".";
	
	var html = '<center><div id="neumName">' + this.neumName + '</div>'+
				'<div id="enterboxArea">';
	for (var i = 0; i < this.answers.length; i++) {
		html += '<input id="nameTextBox' + i + '" class="enter-name-ex-text-box" type="text" size="30"><br>';
	}
	html += '</div>'+
			'<div id="buttonDiv"></div></center>';
	document.getElementById("dynamicArea").innerHTML = html;
	
	// Show check answer button if it's in exercise mode
	if (this.mechanism == 1) {
	    document.getElementById("buttonDiv").innerHTML =
		    '<button id="checkAnswer" class="check-answer-btn" type="button">Check Answer</button>' +
			'<button id="cheat" class="cheat-btn" type="button">Reveal Answer</button>';
			
		var self = this;
		for (var i = 0; i < this.answers.length; i++) {
			document.getElementById("nameTextBox" + i).onkeyup = function(event) {
				self.handleKeyPress(event);
			};
		}
		document.getElementById("checkAnswer").onclick = function() {
			self.saveAnswer();
	        self.showHint();
	    };
		document.getElementById("cheat").onclick = function() {
			self.showRightAnswer();
	    };
	}
	
	// Show answer previously entered by student
	for (var i = 0; i < this.studentsAnswer.length; i++) {
		document.getElementById("nameTextBox" + i).value = this.studentsAnswer[i];		
	}
}

GivenNameEnterNameExercise.prototype.handleKeyPress = function(ev) {
	// Hit Enter key to check answer
    if (!this.hintOn && ev.keyCode == 13) {
		this.saveAnswer();
	    this.showHint();		
	}
	// Hit any key to make the hint go away
	else if (this.hintOn) {
		document.getElementById("hint").innerHTML = "";
		this.hintOn = false;
	}
}

GivenNameEnterNameExercise.prototype.saveAnswer = function() {
	this.studentsAnswer.length = 0;
	for (var i = 0; i < this.answers.length; i++) {
		this.studentsAnswer[i] = document.getElementById("nameTextBox" + i).value;
	}
}

GivenNameEnterNameExercise.prototype.showRightAnswer = function() {
	for (var i = 0; i < this.answers.length; i++) {
		document.getElementById("nameTextBox" + i).value = this.answers[i];
	}
}

GivenNameEnterNameExercise.prototype.grade = function() {
	this.score = 0;
    this.saveAnswer();
	
	var answersCopy = this.answers.slice(0);
	for (var i = 0; i < this.studentsAnswer.length; i++) {
		for (var j = 0; j < answersCopy.length; j++) {
			if (this.studentsAnswer[i].toLowerCase() == answersCopy[j].toLowerCase()) {
				this.score += 1;
				answersCopy.splice(j, 1);
				break;
			}
		}
	}
}

GivenNameEnterNameExercise.prototype.showHint = function() {
	this.grade();
	if (this.score == this.answers.length) {	    
		document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-correct"><div class="hint-no-table">Your answer is correct.</div></div>';
	}	
	else {
	    document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-wrong"><div class="hint-no-table">Your answer is wrong. Please try again.</div></div>';
	}
	this.hintOn = true;
}
