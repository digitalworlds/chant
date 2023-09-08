// A child class of Exercise
function ScoreExercise(school, level, scoreFileName, solution, mechanism) {
    Exercise.call(this, mechanism);
	this.school = school;
	this.level = level;
	this.scoreFileName = scoreFileName;
	this.solution = solution;
	this.size = solution.split("-").length;
	this.type = 5;
	this.score = 0;
	this.maxScore = this.size * 2;
	this.mode = 2;

	this.getSolution();
	
	// Init student answer arrays
	this.studentsAnswerIDs = new Array();
	this.studentAnswerNames = new Array();
	for (var i = 0; i < this.size; i++) {
        this.studentsAnswerIDs.push("");
        this.studentAnswerNames.push("");
	}
}

ScoreExercise.prototype = Object.create(Exercise.prototype);
ScoreExercise.prototype.constructor = ScoreExercise;


ScoreExercise.prototype.show = function(index, numOfQuestions) {
	var str = "Question " + index + " of " + numOfQuestions + ": Drag the neums to the boxes to match the circled notes in the score";
	if (this.mode == 1) {
		str += ".";
		
	}
	else if (this.mode == 2) {
		str += " and enter the neums' names.";
		
	}
	document.getElementById("question").innerHTML = str;
	
	document.getElementById("dynamicArea").innerHTML =
	    '<div><img class="score-image" style="margin-top: 10px; margin-bottom: 10px;" draggable="false"; src="quincy/scores/' + this.scoreFileName + '"></div>' +
	    '<div id="drag-area">' +
		'<div id="scoreExAnswer"></div>' + 
		'<div id="symbolSection"></div>' +
		'<div id="buttonDiv" style="clear: both; text-align: center;"></div>' +
		'</div>';//yoyo add style, make it not overlap.
	
    // Show the table with drop boxes and text boxes
	var tableInnerHTML = "";	   
	
	if (this.mode == 1) {
		tableInnerHTML = '<table class="score-exercise-answer-table" style="width:340px;"><tr><th>No.</th><th>Neum</th><th>No.</th><th>Neum</th>';
		tableInnerHTML += '</tr>';
		document.getElementById("scoreExAnswer").style.width="340px";
		
	}
	else if (this.mode == 2) {
		tableInnerHTML = '<table class="score-exercise-answer-table" style="width:403px;"><tr><th>No.</th><th>Neum</th>';
		tableInnerHTML += '<th>Name</th></tr>';
		document.getElementById("scoreExAnswer").style.width="403px";
		
	}
	   
	var self = this;
	/*for (var i = 0; i < this.size; i++) {
		tableInnerHTML +=
		    '<tr>' + 
			  '<td style="width: 25px;">' + (i + 1) + '</td>' + //yoyo add fixed width
			  '<td style="width: 115px;">' +
			  	'<span class="checkmark" id="checkmark_' + i + '"><div class="checkmark-stem"></div><div class="checkmark-kick"></div></span>' +
				'<span class="x-mark" id="x-mark_' + i + '"><div class="x-tick-stroke"></div><div class="x-falling-stroke"></div></span>' +
  			    '<div class="dropbox" id="neum-dropbox_' + i + '" data-neumID=""></div>' +
				'<img class="delete-icon" id="delete-icon_' + i + '" src="quincy/img/delete.png">' +
			  '</td>';*/
        if (this.mode == 1) {
        	for (var i = 0; i+4 < this.size; i++) {
		tableInnerHTML +=
		    '<tr>' + 
			  '<td style="width: 25px;">' + (i + 1) + '</td>' + //yoyo add fixed width
			  '<td style="width: 115px;">' +
			  	'<span class="checkmark" id="checkmark_' + i + '"><div class="checkmark-stem"></div><div class="checkmark-kick"></div></span>' +
				'<span class="x-mark" id="x-mark_' + i + '"><div class="x-tick-stroke"></div><div class="x-falling-stroke"></div></span>' +
  			    '<div class="dropbox" id="neum-dropbox_' + i + '" data-neumID=""></div>' +
				'<img class="delete-icon" id="delete-icon_' + i + '" src="quincy/img/delete.png">' +
			  '</td>'+
			  '<td style="width: 25px;border-left:1px; border-style: dashed;border-color: rgb(183, 183, 183);">' + (i + 1+4) + '</td>' + //yoyo add fixed width
			  '<td style="width: 115px;">' +
			  	'<span class="checkmark" id="checkmark_' + (i+4) + '"><div class="checkmark-stem"></div><div class="checkmark-kick"></div></span>' +
				'<span class="x-mark" id="x-mark_' + (i+4) + '"><div class="x-tick-stroke"></div><div class="x-falling-stroke"></div></span>' +
  			    '<div class="dropbox" id="neum-dropbox_' + (i+4) + '" data-neumID=""></div>' +
				'<img class="delete-icon" id="delete-icon_' + (i+4) + '" src="quincy/img/delete.png">' +
			  '</td>';
			  
			}
			if (this.size == 7){
			  	tableInnerHTML +=
			  	'<tr>' + 
			  '<td style="width: 25px;">' + (i + 1) + '</td>' + //yoyo add fixed width
			  '<td style="width: 115px;">' +
			  	'<span class="checkmark" id="checkmark_' + i + '"><div class="checkmark-stem"></div><div class="checkmark-kick"></div></span>' +
				'<span class="x-mark" id="x-mark_' + i + '"><div class="x-tick-stroke"></div><div class="x-falling-stroke"></div></span>' +
  			    '<div class="dropbox" id="neum-dropbox_' + i + '" data-neumID=""></div>' +
				'<img class="delete-icon" id="delete-icon_' + i + '" src="quincy/img/delete.png">' +
			  '</td>'+
			  '<td style="width: 25px;border-left:1px; border-style: dashed;border-color: rgb(183, 183, 183);">' + '</td>' + //yoyo add fixed width
			  '<td style="width: 115px;">' +
			  '</td>'
			  }
			tableInnerHTML += '</tr>';
		}

        else if (this.mode == 2) {
        	for (var i = 0; i < this.size; i++) {
		tableInnerHTML +=
		    '<tr>' + 
			  '<td style="width: 25px;">' + (i + 1) + '</td>' + //yoyo add fixed width
			  '<td style="width: 115px;">' +
			  	'<span class="checkmark" id="checkmark_' + i + '"><div class="checkmark-stem"></div><div class="checkmark-kick"></div></span>' +
				'<span class="x-mark" id="x-mark_' + i + '"><div class="x-tick-stroke"></div><div class="x-falling-stroke"></div></span>' +
  			    '<div class="dropbox" id="neum-dropbox_' + i + '" data-neumID=""></div>' +
				'<img class="delete-icon" id="delete-icon_' + i + '" src="quincy/img/delete.png">' +
			  '</td>';
			tableInnerHTML += '<td><input class="scoreExTextBox" id="textBox_' + i + '" type="text"></td></tr>';
		}
			
	}
	tableInnerHTML += '</table>';
	document.getElementById("scoreExAnswer").innerHTML = tableInnerHTML;
	
	// Delete icons' callback functions
	for (var i = 0; i < this.size; i++) {
		document.getElementById("delete-icon_" + i).onclick = function(event) {
	        self.deleteNeum(event);
	    };
	}

    // Allow drag and drop on answer drop boxes
	for (var i = 0; i < this.size; i++) {
		document.getElementById("neum-dropbox_" + i).ondragstart = function(event) {
	        self.dragStart(event);
	    };
        document.getElementById("neum-dropbox_" + i).ondragover = function(event) {
	        self.allowDrop(event);
	    };		
		document.getElementById("neum-dropbox_" + i).ondrop = function(event) {
		    self.drop(event);
	    };
	}
	
	// Show all neums of this level
	this.nNeumsInARow = (this.mode == 2) ? 4 : 5;
	this.symbolDB.filterList(this.school, this.level, this.studentsAnswer, this.nNeumsInARow);
	
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
	
	// Show student's answer
	for (var i = 0; i < this.size; i++) {
		if (this.studentsAnswerIDs[i] != "") {
			document.getElementById("neum-dropbox_" + i).innerHTML = this.showNeumWithID(this.studentsAnswerIDs[i]);
			document.getElementById("neum-dropbox_" + i).setAttribute("data-neumID", this.studentsAnswerIDs[i]);		
		}
		if (this.mode == 2) {
		    document.getElementById("textBox_" + i).value = this.studentAnswerNames[i];
		}
	}
}

ScoreExercise.prototype.dragStart = function(ev) {    
    
}

ScoreExercise.prototype.allowDrop = function(ev) {
    ev.preventDefault();
}

ScoreExercise.prototype.drop = function(ev) {
	ev.preventDefault();
	
	var imageID = ev.dataTransfer.getData("text/html");
	var symbolID = parseInt(imageID.substring(imageID.indexOf("symbol")+7));
	ev.target.innerHTML = this.showNeumWithID(symbolID);
	ev.target.setAttribute("data-neumID", symbolID);
}

ScoreExercise.prototype.deleteNeum = function(ev) {
	document.getElementById("neum-dropbox_" + ev.target.id.substring(12)).innerHTML = "";
	document.getElementById("neum-dropbox_" + ev.target.id.substring(12)).setAttribute("data-neumID", "");
	document.getElementById("checkmark_" + ev.target.id.substring(12)).style.display = "none";
	document.getElementById("x-mark_" + ev.target.id.substring(12)).style.display = "none";
}

ScoreExercise.prototype.getSolution = function() {
	this.solutionIDs = this.solution.split("-");    // An array of neum IDs	
}

ScoreExercise.prototype.saveAnswer = function() {
	// Save student's answers - neum IDs and names
	for (var i = 0; i < this.size; i++) {
		this.studentsAnswerIDs[i] = document.getElementById("neum-dropbox_" + i).getAttribute("data-neumID");
		if (this.mode == 2) {
		    this.studentAnswerNames[i] = document.getElementById("textBox_" + i).value;
		}
	}
//	console.log(this.studentsAnswerIDs);
//	console.log(this.solutionIDs);
}

ScoreExercise.prototype.showRightAnswer = function() {
	for (var i = 0; i < this.size; i++) {
		document.getElementById("checkmark_" + i).style.display = "none";    // hide checkmark
		document.getElementById("x-mark_" + i).style.display = "none";    	 // hide x-mark
		document.getElementById("neum-dropbox_" + i).innerHTML = this.showNeumWithID(this.solutionIDs[i]);
		document.getElementById("neum-dropbox_" + i).setAttribute("data-neumID", this.solutionIDs[i]);
		
		if (this.mode == 2) {
			document.getElementById("textBox_" + i).style.backgroundColor = "white";    // clear background color
			//document.getElementById("textBox_" + i).value = this.symbolDB.symbols[this.solutionIDs[i]].name.replace("=", " OR ");
			document.getElementById("textBox_" + i).value = replaceAll(this.symbolDB.symbols[this.solutionIDs[i]].name, "=", " OR ");
		}
	}
}

ScoreExercise.prototype.showHint = function() {
	document.getElementById("hint").innerHTML = '<div id="hint-box" class="hint-correct"><table id="hintTable"><tbody id="hint-tbody"></tbody></table></div>';
	for (var i = 0; i < this.size; i++) {
		// Check neums
		if (this.studentsAnswerIDs[i] != "") {
			if (this.studentsAnswerIDs[i] == this.solutionIDs[i]) {    // answer is right
			    document.getElementById("checkmark_" + i).style.display = "inline-block";
			}
			else {
				document.getElementById("x-mark_" + i).style.display = "inline-block";
				this.showSymbolInfo(this.studentsAnswerIDs[i]);
			}
			document.getElementById("delete-icon_" + i).style.left = "20px"; //yoyo revise
			document.getElementById("delete-icon_" + i).style.float="left";
			document.getElementById("delete-icon_" + i).style.top = "31px";
		}
		
		// Check names
		if (this.mode == 2) {
			if (this.checkEnteredName(this.symbolDB.symbols[this.solutionIDs[i]].name, document.getElementById("textBox_" + i).value)) {
			    document.getElementById("textBox_" + i).style.backgroundColor = "#64EC64";    // green
		    }
		    else {
			    document.getElementById("textBox_" + i).style.backgroundColor = "#FE9999";    // red			
		    }
		}
	}
}

ScoreExercise.prototype.showSymbolInfo = function(symbolID) {
	document.getElementById("hint-tbody").innerHTML += //yoyo add hint border
	    '<tr class="hint-tr" ><td><img src="quincy/symbols/' +
		this.symbolDB.symbols[symbolID].school + '/Level_' + this.symbolDB.symbols[symbolID].level +
		'/Group_' + this.symbolDB.symbols[symbolID].group + '/' +
	    this.symbolDB.symbols[symbolID].fileName + '" hspace="20" style="width:50px; height:50px;"></td>' +
		'<td class="hint-td" >' +//yoyo add line height
    	this.symbolDB.symbols[symbolID].info +
		'</td></tr>';
}

ScoreExercise.prototype.checkEnteredName = function(solution, enteredText) {
	var rightAnswers = solution.split("=");
	for (var i = 0; i < rightAnswers.length; i++) {
		if (enteredText.toLowerCase() == rightAnswers[i].toLowerCase()) {
			return true;
		}
	}
	return false;
}

ScoreExercise.prototype.grade = function() {
	this.saveAnswer();
	this.score = 0;
	for (var i = 0; i < this.size; i++) {
		// Check neums
		if (this.studentsAnswerIDs[i] != "") {
			if (this.studentsAnswerIDs[i] == this.solutionIDs[i]) {    // answer is right
			    this.score++;
			}
		}

		// Check names
		if (this.mode == 2) {
		    if (this.checkEnteredName(this.symbolDB.symbols[this.solutionIDs[i]].name, document.getElementById("textBox_" + i).value)) {
			    this.score++;
		    }
		}
	}
}

ScoreExercise.prototype.showNeumWithID = function(ID) {
    return '<img id="symbol_' + ID + '_copy" src="quincy/symbols/' +
		    this.symbolDB.symbols[ID].school + '/Level_' + this.symbolDB.symbols[ID].level +
		    '/Group_' + this.symbolDB.symbols[ID].group + '/' + this.symbolDB.symbols[ID].fileName +
	        '" draggable="false" style="width:60px;height:60px;">';
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}