// A child class of Exercise
function CombinedMultipleChoiceExercise(school, level, questionSymbolID, mechanism) {
    Exercise.call(this, mechanism);
	this.type = 12;
	this.school = school;
	this.level = level;
	this.score = 0;
	this.questionSymbolID = questionSymbolID;
	
	this.randomizeImageArrayOrder();
	this.getSolution();
	this.maxScore = this.solution.split("-").length;
}

CombinedMultipleChoiceExercise.prototype = Object.create(Exercise.prototype);
CombinedMultipleChoiceExercise.prototype.constructor = CombinedMultipleChoiceExercise;

CombinedMultipleChoiceExercise.prototype.randomizeImageArrayOrder = function() {	
	// Get number of symbols in the given level
	var i = 0;
	for(; i < this.symbolDB.symbols.length; i++) {
		if (this.symbolDB.symbols[i].school == this.school &&
		    this.symbolDB.symbols[i].level == this.level) {
			this.indexOfFirstSymbol = i++;
			break;
		}
	}
	while (i < this.symbolDB.symbols.length &&
	       this.symbolDB.symbols[i].school == this.school &&
		   this.symbolDB.symbols[i].level == this.level) {
	    i++;
	}
	this.numOfChoices = i - this.indexOfFirstSymbol;
	
	// Create an random order
	this.imageOrder = new Array();
	for (i = 0; i < this.numOfChoices; i++) {
		this.imageOrder[i] = i;
	}
	
	// Don't randomize symbols for level 5 group 3 & 4
/*	if (!(this.school == "StGall" && this.level == 5 && (this.group == 3 || this.group == 4))) {
		this.imageOrder = shuffle(this.imageOrder);
	}*/
}

CombinedMultipleChoiceExercise.prototype.show = function(index, numOfQuestions) {
	document.getElementById("question").innerHTML =
        "Question " + index + " of " + numOfQuestions + ": Select the neum(s) that match the given neum.";
	
	document.getElementById("dynamicArea").innerHTML = '<div id="answer"></div>';
	
	document.getElementById("answer").innerHTML =
    	'<center><div id="questionSymbol"></div><div id="checkboxArea"></div><div id="buttonDiv"></div></center>';
	
	document.getElementById("questionSymbol").innerHTML = '<img id="symbol_' + this.questionSymbolID +
    	'" src="quincy/symbols/' + this.symbolDB.symbols[this.questionSymbolID].school + '/Level_' +
		this.symbolDB.symbols[this.questionSymbolID].level + '/Group_' +
		this.symbolDB.symbols[this.questionSymbolID].group + '/' +
		this.symbolDB.symbols[this.questionSymbolID].fileName + '" style="width:80px;height:80px">';
		
	this.showOptionSymbols();
	
	// Show check answer button if it's in exercise mode
	if (this.mechanism == 1) {
	    document.getElementById("buttonDiv").innerHTML =
		    '<button id="checkAnswer" class="check-answer-btn" type="button">Check Answer</button>' +
			'<button id="cheat" class="cheat-btn" type="button">Reveal Answer</button>';
			
		var self = this;
	    document.getElementById("checkAnswer").onclick = function() {
			self.saveAnswer();
	        self.showHint();
	    };
		document.getElementById("cheat").onclick = function() {
			self.showRightAnswer();
	    };
	}
}

CombinedMultipleChoiceExercise.prototype.showOptionSymbols = function() {
	this.selectableImages = new Array();
	this.mapping = new Array();
	
	// Create the array of selectable images
	for (var i = 0; i < this.numOfChoices; i++) {
	    var symbolID = this.imageOrder[i] + this.indexOfFirstSymbol;
		var imgDir = 'quincy/symbols/' + this.school + '/Level_' + this.level + '/Group_' + this.symbolDB.symbols[symbolID].group + '/' +
    		this.symbolDB.symbols[symbolID].fileName;
		this.selectableImages[i] = new SelectableImage("symbol_" + symbolID, imgDir);

		// Create a mapping from symbolID to index in the image array
		this.mapping[String(symbolID)] = i;
	}
	
	// Show the image array
	for (var i = 0; i < this.selectableImages.length; i++) {
		this.selectableImages[i].show();		
	}
	
	// Check symbols selected by student previously
	this.showStudentsAnswer();
	
	// Handle click events of symbols
	var self = this;
	for (var i = 0; i < this.selectableImages.length; i++) {
		document.getElementById(this.selectableImages[i].imgID).onclick = (function(i) {
			return function() {
				self.selectImage(i);
			};
		})(i);
	}
	
	// Handle hovering over events of symbols
	for (var i = 0; i < this.selectableImages.length; i++) {
		document.getElementById(this.selectableImages[i].imgID).onmouseover = (function(i) {
			return function() {
				self.onMouseOverImage(i);
			};
		})(i);
	}
	
	for (var i = 0; i < this.selectableImages.length; i++) {
		document.getElementById(this.selectableImages[i].imgID).onmouseout = (function(i) {
			return function() {
				self.onMouseOutImage(i);
			};
		})(i);
	}
}

CombinedMultipleChoiceExercise.prototype.selectImage = function(index) {
	this.selectableImages[index].toggleBorder();
}

CombinedMultipleChoiceExercise.prototype.onMouseOverImage = function(index) {
	this.selectableImages[index].onMouseOver();
}

CombinedMultipleChoiceExercise.prototype.onMouseOutImage = function(index) {
	this.selectableImages[index].onMouseOut();
}

CombinedMultipleChoiceExercise.prototype.getSolution = function() {
	if (this.school == "Laon") {
		this.solution = this.symbolDB.symbols[this.questionSymbolID].matchingLaon;
	}
	else {
		this.solution = this.symbolDB.symbols[this.questionSymbolID].matchingStGall;
	}
}

CombinedMultipleChoiceExercise.prototype.saveAnswer = function() {
	this.studentsAnswer = "";
	
	// Images are shuffled. Sort the checked images to increasing order.
	var selectedImgs = new Array();
	for (var i = 0; i < this.selectableImages.length; i++) {
		if (this.selectableImages[i].selected) {
			selectedImgs.push(parseInt(this.selectableImages[i].imgID.substring(7)));
		}
	}
	selectedImgs.sort(sortNumber);
//	console.log("selected = " + selectedImgs);
	
	for (var i = 0; i < selectedImgs.length; i++) {
		this.studentsAnswer += selectedImgs[i] + "-";
	}
	this.studentsAnswer = this.studentsAnswer.substring(0, this.studentsAnswer.length - 1);
}

CombinedMultipleChoiceExercise.prototype.grade = function() {
	this.saveAnswer();
	this.score = 0;
	if (this.studentsAnswer != "") {
		var checked = this.studentsAnswer.split("-");
		var rightAnswers = this.solution.split("-");
		
		for (var i = 0; i < checked.length; i++) {
		    if (isInArray(rightAnswers, checked[i])) {
			    this.score++;
		    }
			else {
				this.score--;
			}
	    }
		if (this.score < 0)    this.score = 0;
	}
}

CombinedMultipleChoiceExercise.prototype.showHint = function() {
	this.clearMarks();
	
	if (this.studentsAnswer == "") {
		document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-wrong"><div class="hint-no-table">Please select at least one symbol.</div></div>';
	}	
	else {
		document.getElementById("hint").innerHTML = '<div id="hint-box"><table id="hintTable"><tbody id="hint-tbody"></tbody></table></div>';
		
		var checked = this.studentsAnswer.split("-");
		var rightAnswers = this.solution.split("-");
		var wrongAnswers = new Array();
	
	    this.hintItemIndex = 0;
	    for (var i = 0; i < checked.length; i++) {
		    if (!isInArray(rightAnswers, checked[i])) {    // Show x marks on incorrectly selected symbols
			    wrongAnswers.push(checked[i]);
			    this.selectableImages[this.mapping[checked[i]]].showXMark();
				if (this.level != 2)	this.showSymbolInfo(checked[i]);
		    }
			else {    // Show check marks on incorrectly selected symbols
				this.selectableImages[this.mapping[checked[i]]].showCheckMark();
			}
	    }
		
		if (wrongAnswers.length == 0) {
			if (this.studentsAnswer == this.solution) {
				document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-correct"><div class="hint-no-table">Your answer is correct.</div></div>';
				return;
		    }
			else {
				document.getElementById("hint").innerHTML = 
					'<div id="hint-box" class="hint-wrong"><div class="hint-no-table">Your answer is correct but incomplete. The correct answer has one or more additional possibilities.</div></div>';
			}
		}
		else {
			if (this.level == 2) {
				document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-wrong"><div class="hint-no-table">Your answer is wrong. Please try again.</div></div>';
			}
		}
		document.getElementById("hint-box").className = "hint-wrong";
	}
}

CombinedMultipleChoiceExercise.prototype.showSymbolInfo = function(index) {
	document.getElementById("hint-tbody").innerHTML += 
	    '<tr class="hint-tr"><td><img src="quincy/symbols/' +
		this.symbolDB.symbols[index].school + '/Level_' + this.symbolDB.symbols[index].level +
		'/Group_' + this.symbolDB.symbols[index].group + '/' +
	    this.symbolDB.symbols[index].fileName + '" hspace="20" style="width:50px; height:50px;"></td>' +
		'<td class="hint-td" align="left">' +
    	this.symbolDB.symbols[index].info +
		'</td></tr>';
}

CombinedMultipleChoiceExercise.prototype.showRightAnswer = function() {
	this.clearMarks();
	
	var rightAnswers = this.solution.split("-");
	for (var i = 0; i < rightAnswers.length; i++) {
		this.selectableImages[this.mapping[rightAnswers[i]]].showCheckMark();
	}
}

CombinedMultipleChoiceExercise.prototype.showStudentsAnswer = function() {
	if (this.studentsAnswer != "") {
		var checked = this.studentsAnswer.split("-");
		for (var i = 0; i < checked.length; i++) {
			this.selectableImages[this.mapping[checked[i]]].select();
		}
	}
}

CombinedMultipleChoiceExercise.prototype.clearMarks = function() {
	for (var i = 0; i < this.selectableImages.length; i++) {
		this.selectableImages[i].show();
	}
}

function shuffle(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function isInArray(array, element) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == element)    return true;		
	}
	return false;
}

function sortNumber(a, b) {
    return a - b;
}