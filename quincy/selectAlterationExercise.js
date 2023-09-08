// A child class of Exercise
function SelectAlterationExercise(questionSymbolID, mechanism) {
    Exercise.call(this, mechanism);
	this.type = 6;
	this.score = 0;
	this.questionSymbolID = questionSymbolID;
	this.secondPartUnlocked = false;
	this.modernShowed = false;
	this.radioButtonDisabled = false;
	this.studentAnswerAltType = "";
	this.studentAnswerAltLoc = "";
	
	this.getSolution();
}

SelectAlterationExercise.prototype = Object.create(Exercise.prototype);
SelectAlterationExercise.prototype.constructor = SelectAlterationExercise;

SelectAlterationExercise.prototype.show = function(index, numOfQuestions) {
    var school = this.symbolDB.symbols[this.questionSymbolID].school;
	var level = this.symbolDB.symbols[this.questionSymbolID].level;
	var group = this.symbolDB.symbols[this.questionSymbolID].group;
	var fileName = this.symbolDB.symbols[this.questionSymbolID].fileName;
	this.modernEquivalents = this.symbolDB.symbols[this.questionSymbolID].matchingModern.split("-");

    document.getElementById("question").innerHTML = 
    	"Question " + index + " of " + numOfQuestions + ": Select the right answer.";
		
	document.getElementById("dynamicArea").innerHTML =
    	'<div id="questionSymbol">' + 
		    '<img id="symbol_' + this.questionSymbolID + '"src="quincy/symbols/' +	school + '/Level_' + level +
		    '/Group_' + group + '/' + fileName + '"style="width:80px;height:80px">' +
		'</div><br>' +
		'<center style="margin-top: -30px;">' +
		    '<div id="question-1" class="question_card">'+
	            '<p class="question">What type of alteration is presented in this neum?</p>' +
		        '<form id="options1"><input class="OptBox" type="radio" name="alt-type" id="rhythmic" value="rhythmic">Rhythmic<br>' +
		        '<input class="OptBox" type="radio" name="alt-type" id="repercussive" value="repercussive">Repercussive<br>' +
			    '<input class="OptBox" type="radio" name="alt-type" id="both" value="both">Both</form>' +
	            '<div id="hint-div-1" class="hint-div"></div>' +
	            '<div id="button-div-1" class="buttons"></div>' +
	        '</div>' +
			'<div id="question-2"></div>' +		
		(this.mechanism == 1 ? '<button id="show-modern-symbols" type="button">+ Show Modern Equivalents</button>' : '') +
		'<div class="modern-equivalents-card">'+
		'<div id="modern-equivalents"></div></div>'+
		'</center>';
	
	// Show check answer button if it's in exercise mode
	if (this.mechanism == 1) {
	    document.getElementById("button-div-1").innerHTML =
		    '<button id="check-answer-1" class="check-answer-btn" type="button">Check Answer</button>' +
			'<button id="cheat-1" class="cheat-btn" type="button">Reveal Answer</button>';
			
		var self = this;
		document.getElementById("show-modern-symbols").onclick = function() {
			self.showModernEquivalents();
	    };
		document.getElementById("check-answer-1").onclick = function() {
			self.saveAnswer();
	        self.showHint(1);
	    };
		document.getElementById("cheat-1").onclick = function() {
			self.showRightAnswer(1);
	    };
	}
	// Test mode
	else if (this.mechanism == 0) {
		document.getElementById("button-div-1").innerHTML =
		    '<button id="continue" class="check-answer-btn" type="button">Continue</button>';
			
		var self = this;
		document.getElementById("continue").onclick = function() {
			self.saveAnswer();
			self.disableRadioButtons();
	        self.showSecondPart();
			self.secondPartUnlocked = true;
	    };
	}
	
	if (this.secondPartUnlocked) {
		this.showSecondPart();
	}
	if (this.radioButtonDisabled) {
		this.disableRadioButtons();
	}
	this.showStudentsAnswer();
}

SelectAlterationExercise.prototype.showModernEquivalents = function() {
	if (this.modernShowed == false) {
		for (var i = 0; i < this.modernEquivalents.length; i++) {
			document.getElementById("modern-equivalents").innerHTML +=
			    '<img id="symbol_' + this.modernEquivalents[i] +
				'"src="quincy/symbols/' + this.symbolDB.symbols[this.modernEquivalents[i]].school +
				'/Level_' + this.symbolDB.symbols[this.modernEquivalents[i]].level +
		        '/Group_' + this.symbolDB.symbols[this.modernEquivalents[i]].group +
				'/' + this.symbolDB.symbols[this.modernEquivalents[i]].fileName + '"style="width:70px;height:70px;margin:20px 0px 20px 20px;background: white;">';
		}
		document.getElementById("show-modern-symbols").firstChild.data = "-  Hide Modern Equivalents";
		this.modernShowed = true;
	}
	else {
		document.getElementById("modern-equivalents").innerHTML = "";
		document.getElementById("show-modern-symbols").firstChild.data = "+ Show Modern Equivalents";
		this.modernShowed = false;
	}
}

SelectAlterationExercise.prototype.showSecondPart = function() {
	var html = "";
	
	// Show second question, either rhythmic or percussive
	if (this.altType != "both") {
		html = '<p class="question">Which part of the neum does the ' + this.altType + ' alteration affect?</p>' +
		       '<form id="options2">'+
		       '<div class="OptContainer">'+
		       		'<div id="x-1-1" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-1-1" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
		       		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-1" id="alt-loc-1-choice-1" value="beginning">Beginning<br></div>' +
		       	'<div class="OptContainer">'+
		       		'<div id="x-1-2" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-1-2" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
			   		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-1" id="alt-loc-1-choice-2" value="middle">Middle<br></div>' +
			   '<div class="OptContainer">'+
		       		'<div id="x-1-3" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-1-3" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
			   		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-1" id="alt-loc-1-choice-3" value="end">End<br></div>' +
			   '<div class="OptContainer">'+
		       		'<div id="x-1-4" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-1-4" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
			   		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-1" id="alt-loc-1-choice-4" value="all">All</div></form>' +
	           '<div id="hint-div-2" class="hint-div"></div>' +
			   (this.mechanism == 1 ?
				   ('<div id="button-div-2" class="buttons">' +
					   '<button id="check-answer-2" class="check-answer-btn" type="button">Check Answer</button>' +
					   '<button id="cheat-2" class="cheat-btn" type="button">Reveal Answer</button>' +
				   '</div>') : '');
	}
	else {
		html = '<p class="question">Which part of the neum does the rhythmic alteration affect?</p>' +
		       '<form id="options2">'+
		       '<div class="OptContainer">'+
		       		'<div id="x-1-1" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-1-1" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
		       		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-1" id="alt-loc-1-choice-1" value="beginning">Beginning<br></div>' +
		       	'<div class="OptContainer">'+
		       		'<div id="x-1-2" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-1-2" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
			   		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-1" id="alt-loc-1-choice-2" value="middle">Middle<br></div>' +
			   	'<div class="OptContainer">'+
			   	    '<div id="x-1-3" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-1-3" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
			   		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-1" id="alt-loc-1-choice-3" value="end">End<br></div>' +
			   	'<div class="OptContainer">'+
			   	    '<div id="x-1-4" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-1-4" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
			   		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-1" id="alt-loc-1-choice-4" value="all">All</form></div>' +
		       '<div id="hint-div-2" class="hint-div"></div>' +

			   '<p class="question">Which part of the neum does the repercussive alteration affect?</p>' +
		       '<form id="options2">'+
		       '<div class="OptContainer">'+
		       		'<div id="x-2-1" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-2-1" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
		       		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-2" id="alt-loc-2-choice-1" value="beginning">Beginning<br></div>' +
		       '<div class="OptContainer">'+
		       		'<div id="x-2-2" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-2-2" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
			   		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-2" id="alt-loc-2-choice-2" value="middle">Middle<br></div>' +
			   	'<div class="OptContainer">'+
		       		'<div id="x-2-3" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-2-3" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
			   		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-2" id="alt-loc-2-choice-3" value="end">End<br></div>' +
			   	'<div class="OptContainer">'+
		       		'<div id="x-2-4" class="mark"><img src="quincy/img/x.png" style="margin-left: 2px;margin-top:3px;width: 13px;"/></div>'+
					'<div id="t-2-4" class="mark"><img src="quincy/img/tick.png" style="margin-left: 2px;margin-top:3.5px;width: 13px;"/></div></div>' +
			   		'<div class="choice"><input class="OptBox" type="checkbox" name="alt-loc-2" id="alt-loc-2-choice-4" value="all">All</div></form>' +
	           '<div id="hint-div-3" class="hint-div"></div>' +
			   (this.mechanism == 1 ?
				   ('<div id="button-div-2" class="buttons">' +
					   '<button id="check-answer-2" class="check-answer-btn" type="button">Check Answer</button>' +
					   '<button id="cheat-2" class="cheat-btn" type="button">Reveal Answer</button>' +
				   '</div>') : '');
	}
	document.getElementById("question-2").innerHTML = html;
	document.getElementById("question-2").className = "question_card";

	// Recheck part 1 answer
	if (this.studentAnswerAltType != "") {
		document.getElementById(this.studentAnswerAltType).checked = true;
	}
	
	if (this.mechanism == 1) {
		var self = this;
		document.getElementById("check-answer-2").onclick = function() {
			self.saveAnswer();
			self.showHint(2);
		};
		document.getElementById("cheat-2").onclick = function() {
			self.showRightAnswer(2);
		};
	}
}

SelectAlterationExercise.prototype.getSolution = function() {
    this.altType = this.symbolDB.symbols[this.questionSymbolID].altType;
	this.altLoc = this.symbolDB.symbols[this.questionSymbolID].altLoc;
	
	this.maxScore = 1;    // Alteration type is 1 point
	var choiceSet = this.altLoc.split(",");
	for (var i = 0; i < choiceSet.length; i++) {
		this.maxScore += choiceSet[i].split("-").length;    // Each part of alteration is 1 point
	}
}

SelectAlterationExercise.prototype.saveAnswer = function() {
	if (document.getElementById("rhythmic").checked)             this.studentAnswerAltType = "rhythmic";
	else if (document.getElementById("repercussive").checked)    this.studentAnswerAltType = "repercussive";
	else if (document.getElementById("both").checked)            this.studentAnswerAltType = "both";
	else                                                         this.studentAnswerAltType = "";
	
    if (this.secondPartUnlocked) {
		this.studentAnswerAltLoc = "";
		for (var i = 1; i <= 4; i++) {
			if (document.getElementById("alt-loc-1-choice-" + i).checked) {
				this.studentAnswerAltLoc += i + "-";
			}			
		}
		if (this.studentAnswerAltLoc == "") {    // no box checked
			this.studentAnswerAltLoc = "0-";
		}
		this.studentAnswerAltLoc = this.studentAnswerAltLoc.substring(0, this.studentAnswerAltLoc.length - 1);

		if (this.altType == "both") {
			this.studentAnswerAltLoc += ",";
			for (var i = 1; i <= 4; i++) {
			    if (document.getElementById("alt-loc-2-choice-" + i).checked) {
				    this.studentAnswerAltLoc += i + "-";
			    }
		    }
			if (this.studentAnswerAltLoc.substring(this.studentAnswerAltLoc.length - 1) == ",") {
				this.studentAnswerAltLoc += "0-";
			}
		    this.studentAnswerAltLoc = this.studentAnswerAltLoc.substring(0, this.studentAnswerAltLoc.length - 1);
		}
	}
}

SelectAlterationExercise.prototype.showStudentsAnswer = function(num) {
	if (this.studentAnswerAltType != "") {
		document.getElementById(this.studentAnswerAltType).checked = true;
	}
	
	if (this.secondPartUnlocked) {
		var answerSet = this.studentAnswerAltLoc.split(",");
		for (var i = 1; i <= answerSet.length; i++) {
			if (answerSet[i-1] != "0") {
				var choices = answerSet[i-1].split("-");
		        for (var j = 0; j < choices.length; j++) {
		            document.getElementById("alt-loc-" + i + "-choice-" + choices[j]).checked = true;
		        }
			}
		}
	}
}

SelectAlterationExercise.prototype.showRightAnswer = function(num) {
	if (num == 1) {
        document.getElementById(this.altType).checked = true;
	}
	else if (num == 2) {
		var choiceSet = this.altLoc.split(",");
		// Uncheck all boxes
		for (var i = 1; i <= choiceSet.length; i++) {
			for (var j = 1; j <= 4; j++) {
		        document.getElementById("alt-loc-" + i + "-choice-" + j).checked = false;				
		    }
		}
		// Check correct answers
		for (var i = 1; i <= choiceSet.length; i++) {
			var choices = choiceSet[i-1].split("-");
		    for (var j = 0; j < choices.length; j++) {
		        document.getElementById("alt-loc-" + i + "-choice-" + choices[j]).checked = true;
		    }
		}
	}
}

SelectAlterationExercise.prototype.grade = function() {
    this.saveAnswer();
	
	if (this.altType == this.studentAnswerAltType) {
		this.score = 1;
	}
	else {
		this.score = 0;
	}
	
	var studentAnswerSet = this.studentAnswerAltLoc.split(",");
	var rightAnswerSet = this.altLoc.split(",");
	for (var i = 0; i < studentAnswerSet.length; i++) {
		var studentsChoices = studentAnswerSet[i].split("-");
		for (var j = 0; j < studentsChoices.length; j++) {
			if (studentsChoices[j] != 0) {
				if (isInArray(rightAnswerSet[i], studentsChoices[j])) {
					this.score += 1;
				}
				else {
					this.score -= 1;
				}
			}	
		}
	}
	if (this.score < 0)    this.score = 0;	
}

SelectAlterationExercise.prototype.showHint = function(num) {
	if (num == 1) {
		if (document.getElementById(this.altType).checked == true) {
			document.getElementById("hint-div-1").innerHTML = "Correct.";
			document.getElementById("hint-div-1").style.color="rgb(71, 167, 67)";//yoyo
		    this.showSecondPart();
			this.secondPartUnlocked = true;
		}
		else {
			document.getElementById("hint-div-1").innerHTML = "Incorrect.";
			document.getElementById("hint-div-1").style.color="red";//yoyo
		}
	}
	else if (num == 2) {
		var studentAnswerSet = this.studentAnswerAltLoc.split(",");
		var rightAnswerSet = this.altLoc.split(",");
		for (var i = 0; i < rightAnswerSet.length; i++) {
			var rightChoices = rightAnswerSet[i].split("-");
			var wrongChoices = new Array();

			for (var j = 1; j < 5; j++) {
				if (document.getElementById("alt-loc-" + (i+1) + "-choice-" + j).checked == false) {
					// clear the symbol
					document.getElementById("t-" + (i+1) + "-" + j).style.display = "none";
					document.getElementById("x-" + (i+1) + "-" + j).style.display = "none";
				}
				else {
					if (isInArray(rightChoices, j)) {    // if answer is right
						document.getElementById("t-" + (i+1) + "-" + j).style.display = "block";
						document.getElementById("x-" + (i+1) + "-" + j).style.display = "none";						
					}
					else {
						wrongChoices.push(j);
						document.getElementById("x-" + (i+1) + "-" + j).style.display = "block";
						document.getElementById("t-" + (i+1) + "-" + j).style.display = "none";						
					}
				}
			}			
			
			if (wrongChoices.length == 0) {
				if (rightAnswerSet[i] == studentAnswerSet[i]) {
					document.getElementById("hint-div-" + (i+2)).innerHTML = "Correct.";
					document.getElementById("hint-div-" + (i+2)).style.color="rgb(71, 167, 67)";//yoyo
				}
				else {
					if (studentAnswerSet[i] == "0") {
						document.getElementById("hint-div-" + (i+2)).innerHTML = "Please check at least one box.";
					    document.getElementById("hint-div-" + (i+2)).style.color="red";//yoyo
					}
					else {
						document.getElementById("hint-div-" + (i+2)).innerHTML = "Your answer is correct but incomplete.";
					    document.getElementById("hint-div-" + (i+2)).style.color="red";//yoyo
					}
				}
			}
			else {
				document.getElementById("hint-div-" + (i+2)).innerHTML = "Incorrect.";
				document.getElementById("hint-div-" + (i+2)).style.color="red";//yoyo
			}
		}
	}
	this.grade();
}

SelectAlterationExercise.prototype.disableRadioButtons = function() {
	document.getElementById("rhythmic").disabled = true;
	document.getElementById("repercussive").disabled = true;
	document.getElementById("both").disabled = true;
	this.radioButtonDisabled = true;
}

function isInArray(array, element) {
	return (array.indexOf(element) != -1);
}
