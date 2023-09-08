// A child class of Exercise
function SelectSymbolToMatch2Exercise(school, level, group, questionSymbolInfo, mechanism) {
    Exercise.call(this, mechanism);
	this.type = 7;
	this.school = school;
	this.level = level;
	this.group = group;
	this.score = 0;
	this.questionSymbolID = questionSymbolInfo;
	
	this.loadSymbolInfo();
	this.randomizeImageArrayOrder();
}

SelectSymbolToMatch2Exercise.prototype = Object.create(Exercise.prototype);
SelectSymbolToMatch2Exercise.prototype.constructor = SelectSymbolToMatch2Exercise;

SelectSymbolToMatch2Exercise.prototype.loadSymbolInfo = function() {
	// Load extra symbol index file
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else {// code for IE6, IE5
  		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET","quincy/symbols/Extra/" + this.school + "/extraIndex.xml", false);
	xmlhttp.send();
	
	var extraIndex = xmlhttp.responseXML;
	var length = extraIndex.getElementsByTagName("symbol").length;
	
	for (var i = 0; i < length; i++) {
		if (extraIndex.getElementsByTagName("symbol")[i].getAttribute("id") == this.questionSymbolID) {
			this.choice = extraIndex.getElementsByTagName("symbol")[i].getAttribute("choice").split("-");
			this.rawSolution = extraIndex.getElementsByTagName("symbol")[i].getAttribute("solution");
			break;	
		}
	}
	
	// convert a-b-c to 0-1-2
	var temp = this.rawSolution.split("-");
	for (var i = 0; i < temp.length; i++) {
		temp[i] = temp[i].charCodeAt(0) - 'A'.charCodeAt(0);
	}
	
	this.solution = "";
	for (var i = 0; i < temp.length; i++) {
		this.solution += temp[i] + "-";
	}
	this.solution = this.solution.substring(0, this.solution.length - 1);
	this.maxScore = this.solution.split("-").length;
}

SelectSymbolToMatch2Exercise.prototype.randomizeImageArrayOrder = function() {	
	this.imageChoices = shuffle(this.choice);
}

SelectSymbolToMatch2Exercise.prototype.show = function(index, numOfQuestions) {
	document.getElementById("question").innerHTML = 
	    "Question " + index + " of " + numOfQuestions + ": Select the example(s) of modern notation that match the given neum.";
	
	document.getElementById("dynamicArea").innerHTML = '<div id="answer"></div>';
	
	document.getElementById("answer").innerHTML =
    '<center><div id="questionSymbol"></div>' + 
	'<div id="checkboxArea"></div><div id="buttonDiv"></div></center>';
	
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

SelectSymbolToMatch2Exercise.prototype.showOptionSymbols = function() {
	this.selectableImages = new Array();
	this.mapping = new Array();
	
	// Create the array of selectable images
	for (var i = 0; i < this.imageChoices.length; i++) {
		var imgDir = 'quincy/symbols/Extra/' + this.school + '/Level_' + this.level + '/Group_' + this.group + '/' +
    		this.getOptionImageFileName(this.symbolDB.symbols[this.questionSymbolID].fileName, this.imageChoices[i]);
		this.selectableImages[i] = new SelectableImage(this.questionSymbolID + "_" + this.imageChoices[i], imgDir);
		
		// Create a mapping from symbol ID to index in the image array
		// Here this.imageChoices[i] == a/b/c/d, equivalent to symbol ID
		this.mapping[this.imageChoices[i].charCodeAt(0) - 'A'.charCodeAt(0)] = i;
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

SelectSymbolToMatch2Exercise.prototype.getOptionImageFileName = function(name, mark) {
	return name.substr(0, name.length - 4) + mark + name.substr(name.length - 4);
}

SelectSymbolToMatch2Exercise.prototype.selectImage = function(index) {
	this.selectableImages[index].toggleBorder();
}

SelectSymbolToMatch2Exercise.prototype.onMouseOverImage = function(index) {
	this.selectableImages[index].onMouseOver();
}

SelectSymbolToMatch2Exercise.prototype.onMouseOutImage = function(index) {
	this.selectableImages[index].onMouseOut();
}

SelectSymbolToMatch2Exercise.prototype.saveAnswer = function() {
	this.studentsAnswer = "";
	
	// Images are shuffled. Sort the checked images to increasing order.
	var selectedImgs = new Array();
	for (var i = 0; i < this.selectableImages.length; i++) {
		if (this.selectableImages[i].selected) {
			selectedImgs.push(this.selectableImages[i].imgID.substring(this.selectableImages[i].imgID.length - 1).charCodeAt(0) - 'A'.charCodeAt(0));
		}
	}
	selectedImgs.sort(sortNumber);
	
	for (var i = 0; i < selectedImgs.length; i++) {
		this.studentsAnswer += selectedImgs[i] + "-";
	}
	this.studentsAnswer = this.studentsAnswer.substring(0, this.studentsAnswer.length - 1);
//	console.log("student answer = " + this.studentsAnswer);
}

SelectSymbolToMatch2Exercise.prototype.grade = function() {
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

SelectSymbolToMatch2Exercise.prototype.showHint = function() {
	this.clearMarks();
	
	if (this.studentsAnswer == "") {
		document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-wrong"><div class="hint-no-table">Please select at least one symbol.</div></div>';
	}	
	else {
		document.getElementById("hint").innerHTML = '<div id="hint-box"><table id="hintTable"><tbody id="hint-tbody"></tbody></table></div>';
		
		var checked = this.studentsAnswer.split("-");
		var wrongAnswers = new Array();
		var rightAnswers = this.solution.split("-");
	
	    this.hintItemIndex = 0;
	    for (var i = 0; i < checked.length; i++) {
		    if (!isInArray(rightAnswers, checked[i])) {    // Show x marks on incorrectly selected symbols
			    wrongAnswers.push(checked[i]);
			    this.selectableImages[this.mapping[checked[i]]].showXMark();
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
			this.showSymbolInfo(this.questionSymbolID);
		}
		document.getElementById("hint-box").className = "hint-wrong";
	}
}

SelectSymbolToMatch2Exercise.prototype.showSymbolInfo = function(index) {
	document.getElementById("hint-tbody").innerHTML += 
	    '<tr class="hint-tr"><td><img src="quincy/symbols/' +
		this.symbolDB.symbols[index].school + '/Level_' + this.symbolDB.symbols[index].level +
		'/Group_' + this.symbolDB.symbols[index].group + '/' +
	    this.symbolDB.symbols[index].fileName + '" hspace="20" style="width:50px; height:50px;"></td>' +
		'<td class="hint-td" align="left">' +
    	this.symbolDB.symbols[index].info +
		'</td></tr>';
}

SelectSymbolToMatch2Exercise.prototype.showRightAnswer = function() {
	this.clearMarks();
	
	var rightAnswers = this.solution.split("-");
	for (var i = 0; i < rightAnswers.length; i++) {
		this.selectableImages[this.mapping[rightAnswers[i]]].showCheckMark();
	}
}

SelectSymbolToMatch2Exercise.prototype.showStudentsAnswer = function() {
	if (this.studentsAnswer != "") {
		var checked = this.studentsAnswer.split("-");
		for (var i = 0; i < checked.length; i++) {
			this.selectableImages[this.mapping[checked[i]]].select();
		}
	}
}

SelectSymbolToMatch2Exercise.prototype.clearMarks = function() {
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