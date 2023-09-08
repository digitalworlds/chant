// A child class of Exercise
function SelectSymbolToMatchExercise(type, school, level, group, questionSymbolInfo, mechanism) {
    Exercise.call(this, mechanism);
	this.type = type;
	this.school = school;
	this.level = level;
	this.group = group;
	this.score = 0;
	
	if (type == 2 || type == 21 || type == 22) {
		this.neumName = questionSymbolInfo;
	}
	else {
		this.questionSymbolID = questionSymbolInfo;
	}
	
	this.randomizeImageArrayOrder();
	this.getSolution();
	this.maxScore = this.solution.split("-").length;
}

SelectSymbolToMatchExercise.prototype = Object.create(Exercise.prototype);
SelectSymbolToMatchExercise.prototype.constructor = SelectSymbolToMatchExercise;

SelectSymbolToMatchExercise.prototype.randomizeImageArrayOrder = function() {
	var school = (this.type == 3) ? (this.school + "Modern") : this.school;
	
	// Get number of symbols of the given group
	var i = 0;
	for(; i < this.symbolDB.symbols.length; i++) {
		if (this.symbolDB.symbols[i].school == school &&
		    this.symbolDB.symbols[i].level == this.level &&
			this.symbolDB.symbols[i].group == this.group) {
			this.indexOfFirstSymbol = i++;
			break;
		}
	}
	while (i < this.symbolDB.symbols.length &&
	       this.symbolDB.symbols[i].school == school &&
		   this.symbolDB.symbols[i].level == this.level &&
		   this.symbolDB.symbols[i].group == this.group) {
	    i++;
	}
	this.numOfChoices = i - this.indexOfFirstSymbol;
	
	// Create an random order
	this.imageOrder = new Array();
	for (i = 0; i < this.numOfChoices; i++) {
		this.imageOrder[i] = i;
	}
	
	// Don't randomize symbols for level 5 group 3 & 4
	if (!(this.school == "StGall" && this.level == 5 && (this.group == 3 || this.group == 4))) {
		this.imageOrder = shuffle(this.imageOrder);
	}
}

SelectSymbolToMatchExercise.prototype.show = function(index, numOfQuestions) {
	if (this.type == 2) {
		document.getElementById("question").innerHTML =
    	    "Question " + index + " of " + numOfQuestions + ": Select the neum that matches the given name.";
	}
	else if (this.type == 3) {    // Select modern symbols to match neum
		document.getElementById("question").innerHTML = "Question " + index + " of " + numOfQuestions + ": Select the example(s) of modern notation that match the given neum.<br>In any set of notes with a red note, it is the red note that must be matched.";
	}
	else if (this.type == 4) {    // Select neums to match modern symbols
		// For the red notes
	    if (this.questionSymbolID == 324 || (this.questionSymbolID >= 326 && this.questionSymbolID <= 329) ||
	        (this.questionSymbolID >= 331 && this.questionSymbolID <= 335)) {
		    document.getElementById("question").innerHTML = 
		        "Question " + index + " of " + numOfQuestions + ": Select the neum(s) that match the red note in the given group of modern notes.";
	    }
	    else {
		    document.getElementById("question").innerHTML = 
		        "Question " + index + " of " + numOfQuestions + ": Select the neum(s) that match the given modern note.";
	    }
	}
	else if (this.type == 21 || this.type == 22) {
		document.getElementById("question").innerHTML =
    	    "Question " + index + " of " + numOfQuestions + ": Select the letter(s) that signify the given term.";
	}
	
	document.getElementById("dynamicArea").innerHTML = '<div id="answer"></div>';
	
	if (this.type == 2 || this.type == 21 || this.type == 22) {
		// neum name is in format of name1=name2
		document.getElementById("answer").innerHTML = 
	        '<center><div id="neumName">' + this.neumName + '</div>' + 
	        '<div id="checkboxArea"></div><div id="buttonDiv"></div></center>';
	}
	else {
		document.getElementById("answer").innerHTML =
    	'<center><div id="questionSymbol"></div>' + 
	    '<div id="checkboxArea"></div><div id="buttonDiv"></div></center>';
	
	    document.getElementById("questionSymbol").innerHTML = '<img id="symbol_' + this.questionSymbolID +
    	    '" src="quincy/symbols/' + this.symbolDB.symbols[this.questionSymbolID].school + '/Level_' +
		    this.symbolDB.symbols[this.questionSymbolID].level + '/Group_' +
		    this.symbolDB.symbols[this.questionSymbolID].group + '/' +
		    this.symbolDB.symbols[this.questionSymbolID].fileName + '" style="width:80px;height:80px">';
	}
		
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

SelectSymbolToMatchExercise.prototype.showOptionSymbols = function() {
	this.selectableImages = new Array();
	this.mapping = new Array();
	
	// Create the array of selectable images
	var school = (this.type == 3) ? (this.school + "Modern") : this.school;
	for (var i = 0; i < this.numOfChoices; i++) {
	    var symbolID = this.imageOrder[i] + this.indexOfFirstSymbol;
		var imgDir = 'quincy/symbols/' + school + '/Level_' + this.level + '/Group_' + this.group + '/' +
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

SelectSymbolToMatchExercise.prototype.selectImage = function(index) {
	this.selectableImages[index].toggleBorder();
}

SelectSymbolToMatchExercise.prototype.onMouseOverImage = function(index) {
	this.selectableImages[index].onMouseOver();
}

SelectSymbolToMatchExercise.prototype.onMouseOutImage = function(index) {
	this.selectableImages[index].onMouseOut();
}

SelectSymbolToMatchExercise.prototype.getSolution = function() {
	// Select neum to match name
	if (this.type == 2) {
		this.solution = "";
        for (var i = 0; i < this.numOfChoices; i++) {
			var neumNames = this.symbolDB.symbols[this.indexOfFirstSymbol + i].name.split("=");
			for (var j = 0; j < neumNames.length; j++) {
				if (neumNames[j] == this.neumName) {
					this.solution += (this.indexOfFirstSymbol + i) + "-";
					break;
				}
			}
	    }
	    this.solution = this.solution.substring(0, this.solution.length - 1);
	}
	// Select neum to match English or Latin name
	// 21 = Latin, 22 = English
	else if (this.type == 21 || this.type == 22) {
		this.solution = "";
		for (var i = 0; i < this.numOfChoices; i++) {
			var neumNames = this.symbolDB.symbols[this.indexOfFirstSymbol + i].name.split("--")[22 - this.type].split("=");
			for (var j = 0; j < neumNames.length; j++) {
				if (neumNames[j] == this.neumName) {
					this.solution += (this.indexOfFirstSymbol + i) + "-";
					break;
				}
			}
		}
		this.solution = this.solution.substring(0, this.solution.length - 1);
	}
	// Select modern symbols to match neum
	else if (this.type == 3) {
		this.solution = this.symbolDB.symbols[this.questionSymbolID].matchingModern;
	}
	// Select neums to match modern symbols
	else if (this.type == 4) {
		if (this.school == "StGall") {
			this.solution = this.symbolDB.symbols[this.questionSymbolID].matchingStGall;
		}
		else {
			this.solution = this.symbolDB.symbols[this.questionSymbolID].matchingLaon;
		}
	}    
}

SelectSymbolToMatchExercise.prototype.saveAnswer = function() {
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

SelectSymbolToMatchExercise.prototype.grade = function() {
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

SelectSymbolToMatchExercise.prototype.showHint = function() {
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
				if (this.type != 21 && this.type != 22) {    // No show of hint table in level 4
					this.showSymbolInfo(checked[i]);
				}
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
			if (this.type == 21 || this.type == 22) {
				document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-wrong"><div class="hint-no-table">Your answer is wrong. Please try again.</div></div>';
			}
		}
		document.getElementById("hint-box").className = "hint-wrong";
	}
}

SelectSymbolToMatchExercise.prototype.showSymbolInfo = function(index) {
	document.getElementById("hint-tbody").innerHTML += 
	    '<tr class="hint-tr"><td><img src="quincy/symbols/' +
		this.symbolDB.symbols[index].school + '/Level_' + this.symbolDB.symbols[index].level +
		'/Group_' + this.symbolDB.symbols[index].group + '/' +
	    this.symbolDB.symbols[index].fileName + '" hspace="20" style="width:50px; height:50px;"></td>' +
		'<td class="hint-td" align="left">' +
    	this.symbolDB.symbols[index].info +
		'</td></tr>';
}

SelectSymbolToMatchExercise.prototype.showRightAnswer = function() {
	this.clearMarks();
	
	var rightAnswers = this.solution.split("-");
	for (var i = 0; i < rightAnswers.length; i++) {
		this.selectableImages[this.mapping[rightAnswers[i]]].showCheckMark();
	}
}

SelectSymbolToMatchExercise.prototype.showStudentsAnswer = function() {
	if (this.studentsAnswer != "") {
		var checked = this.studentsAnswer.split("-");
		for (var i = 0; i < checked.length; i++) {
			this.selectableImages[this.mapping[checked[i]]].select();
		}
	}
}

SelectSymbolToMatchExercise.prototype.clearMarks = function() {
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