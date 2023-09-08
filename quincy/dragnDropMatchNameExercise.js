// A child class of Exercise
function DragnDropMatchNameExercise(school, level, group, questionSymbolID, mechanic) {
    Exercise.call(this, mechanic);
	this.school = school;
	this.level = level;
	this.group = group;
	this.questionSymbolID = questionSymbolID;
	this.getSolution();
}

DragnDropMatchNameExercise.prototype = Object.create(Exercise.prototype);
DragnDropMatchNameExercise.prototype.constructor = DragnDropMatchNameExercise;

DragnDropMatchNameExercise.prototype.show = function(index) {
	document.getElementById("question").innerHTML = "Question " + (index + 1) +
    	": Drag the symbol to match the given name.";
	
	document.getElementById("dynamicArea").innerHTML = '<div id="answer"></div>' + 
	'<div id="symbolSection"><div id="searchBox"></div><div id="symbols"></div></div>';
	
	document.getElementById("answer").innerHTML =
	    '<center><div>' + this.symbolDB.symbols[this.questionSymbolID].name + '</div><br>' +
	    '<div id="dropbox" style="width:60px; height:60px; padding:5px; border:2px dotted #000000;"></div></center>';
		
	// clear drop box if there was an answer
	if (document.getElementById("dropbox").firstChild) {
	    document.getElementById("dropbox").innerHTML = "";	
	}
	
	var self = this;	
	document.getElementById("dropbox").ondrop = function(event) {
		self.drop(event);
	};	
	document.getElementById("dropbox").ondragover = function(event) {
	    self.allowDrop(event);
	};

	this.symbolDB.filterList(this.school, this.level, this.group, this.studentsAnswer);
}

DragnDropMatchNameExercise.prototype.getSolution = function() {
    this.solution = this.questionSymbolID;
}

// Dropbox
DragnDropMatchNameExercise.prototype.allowDrop = function(ev) {
    if (ev.target.id == "dropbox") {
        ev.preventDefault();		
		// put old answer back to the list
		if (ev.target.firstChild && ev.target.firstChild.id != this.symbolDB.draggedSymbol) {
		    var id = parseInt(document.getElementById("dropbox").firstChild.id.substring(7));			
			document.getElementById("symbolHolder_" + id).appendChild(document.getElementById("symbol_" + id));
			document.getElementById("dropbox").innerHTML = "";
		}
	}
}

// Dropbox
DragnDropMatchNameExercise.prototype.drop = function(ev) {
    if (ev.target.id == "dropbox") {
	    ev.preventDefault();
		var data = ev.dataTransfer.getData("text/html");
	    ev.target.appendChild(document.getElementById(data));
		
		this.saveAnswer();
		if (this.mechanic == 1) {
		    this.showHint();
		}
	}
}

DragnDropMatchNameExercise.prototype.saveAnswer = function() {
    if (document.getElementById("dropbox").firstChild) {
	    this.studentsAnswer = document.getElementById("dropbox").firstChild.id.substring(7);
		this.symbolDB.studentsAnswer = this.studentsAnswer;
	}
	else {
	    this.studentsAnswer = "";
	}
}

DragnDropMatchNameExercise.prototype.showHint = function() {
	if (this.studentsAnswer == this.solution) {	    
		document.getElementById("hint").innerHTML = '<div id="hintBox" class"hintCorrect">Your answer is correct. Good job!</div>';
	}	
	else {
	    document.getElementById("hint").innerHTML = '<div id="hintBox" class"hintWrong">Your answer is wrong. Please try again.</div>';
	}
}
