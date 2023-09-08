// A child class of Exercise
function GivenNeumEnterEnglishOrLatinNamesExercise(language, questionSymbolID, mechanism) {
    Exercise.call(this, mechanism);
	this.type = 8;
	this.language = language;
	this.questionSymbolID = questionSymbolID;
	this.hintOn = false;
	this.score = 0;
	this.studentsAnswer = new Array();
	
	this.getSolution();
}

GivenNeumEnterEnglishOrLatinNamesExercise.prototype = Object.create(Exercise.prototype);
GivenNeumEnterEnglishOrLatinNamesExercise.prototype.constructor = GivenNeumEnterEnglishOrLatinNamesExercise;

GivenNeumEnterEnglishOrLatinNamesExercise.prototype.show = function(index, numOfQuestions) {
    var school = this.symbolDB.symbols[this.questionSymbolID].school;
	var level = this.symbolDB.symbols[this.questionSymbolID].level;
	var group = this.symbolDB.symbols[this.questionSymbolID].group;
	var fileName = this.symbolDB.symbols[this.questionSymbolID].fileName;

	var language = (this.language == 2) ? "English" : "Latin";
	var term = (this.answerLength == 1) ? " term" : " terms";
	this.questionText = "Enter the " + language + term + " signified by the given letter(s)";
    document.getElementById("question").innerHTML = "Question " + index + " of " + numOfQuestions + ": " + this.questionText + ".";
		
	var html = '<div id="type2ExAnswerArea"><center><div id="questionSymbol">' +
		           '<img id="symbol_' + this.questionSymbolID + '"src="quincy/symbols/' +	school + '/Level_' + level +
				   '/Group_' + group + '/' + fileName + '"style="width:80px;height:80px"></div>'+
				   '<div id="enterboxArea">';

	for (var i = 0; i < this.answerLength; i++) {
		html += '<input id="nameTextBox' + i + '" class="enter-name-ex-text-box" type="text" size="30"><br>';
	}
	html += '</div>'+
			'<div id="buttonDiv"></div></center></div>';
	
	document.getElementById("dynamicArea").innerHTML = html;
	
	// Show check answer button if it's in exercise mode
	if (this.mechanism == 1) {
	    document.getElementById("buttonDiv").innerHTML =
		    '<button id="checkAnswer" class="check-answer-btn" type="button">Check Answer</button>' +
			'<button id="cheat" class="cheat-btn" type="button">Reveal Answer</button>';
			
		var self = this;
	    for (var i = 0; i < this.answerLength; i++) {
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

GivenNeumEnterEnglishOrLatinNamesExercise.prototype.handleKeyPress = function(ev) {
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

GivenNeumEnterEnglishOrLatinNamesExercise.prototype.getSolution = function() {
	// solution is in format of English name--Latin name	
    var nameArray = this.symbolDB.symbols[this.questionSymbolID].name.split("--");
	this.correctEnglishName = nameArray[0].split("=");
	this.correctLatinName = nameArray[1].split("=");
	this.answerLength = (this.language == 2) ? this.correctEnglishName.length : this.correctLatinName.length;
	this.maxScore = this.answerLength;
}

GivenNeumEnterEnglishOrLatinNamesExercise.prototype.saveAnswer = function() {
    this.studentsAnswer.length = 0;
	for (var i = 0; i < this.answerLength; i++) {
		this.studentsAnswer[i] = document.getElementById("nameTextBox" + i).value;
	}
}

GivenNeumEnterEnglishOrLatinNamesExercise.prototype.showRightAnswer = function() {
	var names = (this.language == 2) ? this.correctEnglishName : this.correctLatinName;
	for (var i = 0; i < names.length; i++) {
		document.getElementById("nameTextBox" + i).value = names[i];
	}
}

GivenNeumEnterEnglishOrLatinNamesExercise.prototype.grade = function() {
	this.score = 0;
    this.saveAnswer();
	var answersCopy;
	
	if (this.language == 1)	   answersCopy = this.correctLatinName.slice(0);
	else                   answersCopy = this.correctEnglishName.slice(0);

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

GivenNeumEnterEnglishOrLatinNamesExercise.prototype.showHint = function() {
	this.grade();
	if (this.score == this.answerLength) {	    
		document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-correct"><div class="hint-no-table">Your answer is correct.</div></div>';
	}	
	else {
	    document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-wrong"><div class="hint-no-table">Your answer is wrong. Please try again.</div></div>';
	}
	this.hintOn = true;
}
