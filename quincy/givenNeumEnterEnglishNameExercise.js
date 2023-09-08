// A child class of Exercise
function GivenNeumEnterEnglishNameExercise(questionSymbolID, mechanism) {
    Exercise.call(this, mechanism);
	this.type = 1;
	this.score = 0;
	this.questionSymbolID = questionSymbolID;
	this.hintOn = false;
	this.studentsAnswer = new Array();
	
	this.getSolution();
}

GivenNeumEnterEnglishNameExercise.prototype = Object.create(Exercise.prototype);
GivenNeumEnterEnglishNameExercise.prototype.constructor = GivenNeumEnterEnglishNameExercise;

GivenNeumEnterEnglishNameExercise.prototype.show = function(index, numOfQuestions) {
    var school = this.symbolDB.symbols[this.questionSymbolID].school;
	var level = this.symbolDB.symbols[this.questionSymbolID].level;
	var group = this.symbolDB.symbols[this.questionSymbolID].group;
	var fileName = this.symbolDB.symbols[this.questionSymbolID].fileName;

    document.getElementById("question").innerHTML = 
    	"Question " + index + " of " + numOfQuestions + ": Enter the name of the given neum.";
		
	var html = '<div id="type2ExAnswerArea"><center><div id="questionSymbol">' + 
		       '<img id="symbol_' + this.questionSymbolID + '"src="quincy/symbols/' +
			   school + '/Level_' + level + '/Group_' + group + '/' + fileName +
			   '"style="width:80px;height:80px"></div><div id="enterboxArea">';
			   
	for (var i = 0; i < this.solution.length; i++) {
		html += '<input id="englishNameTextBox' + i + '" class="enter-name-ex-text-box" type="text" size="30"><br>';
	}
	html += '</div><div id="buttonDiv"></div></center></div>';
	
	document.getElementById("dynamicArea").innerHTML = html;
	
	// Show check answer button if it's in exercise mode
	if (this.mechanism == 1) {
	    document.getElementById("buttonDiv").innerHTML =
		    '<button id="checkAnswer" class="check-answer-btn" type="button">Check Answer</button>' +
			'<button id="cheat" class="cheat-btn" type="button">Reveal Answer</button>';
			
		var self = this;
		for (var i = 0; i < this.solution.length; i++) {
			document.getElementById("englishNameTextBox" + i).onkeyup = function(event) {
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
		document.getElementById("englishNameTextBox" + i).value = this.studentsAnswer[i];		
	}
}

GivenNeumEnterEnglishNameExercise.prototype.handleKeyPress = function(ev) {
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

GivenNeumEnterEnglishNameExercise.prototype.getSolution = function() {
	// solution is in format of name1=name2	
    this.solution = this.symbolDB.symbols[this.questionSymbolID].name.split("=");
	this.maxScore = this.solution.length;
}

GivenNeumEnterEnglishNameExercise.prototype.saveAnswer = function() {
	this.studentsAnswer.length = 0;
	for (var i = 0; i < this.solution.length; i++) {
		this.studentsAnswer[i] = document.getElementById("englishNameTextBox" + i).value;
	}
}

GivenNeumEnterEnglishNameExercise.prototype.showRightAnswer = function() {
	for (var i = 0; i < this.solution.length; i++) {
		document.getElementById("englishNameTextBox" + i).value = this.solution[i];
	}
}

GivenNeumEnterEnglishNameExercise.prototype.grade = function() {
	this.score = 0;
    this.saveAnswer();
	
    var answersCopy = this.solution.slice(0);
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

GivenNeumEnterEnglishNameExercise.prototype.showHint = function() {
	this.grade();
	if (this.score == this.solution.length) {	    
		document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-correct"><div class="hint-no-table">Your answer is correct.</div></div>';
	}	
	else {
	    document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-wrong"><div class="hint-no-table">Your answer is wrong. Please try again.</div></div>';
	}
	this.hintOn = true;
}
