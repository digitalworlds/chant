// Class to hold the info for one symbol
function Symbol() {
	this.id = 0;
	this.name = "";
	this.fileName = "";
	this.school = "";
	this.level = "";
	this.group = "";
	this.matchingLaon = "";
	this.matchingStGall = "";
	this.matchingModern = "";
	this.altType = "";
	this.altLoc = "";
	this.info = "";
	this.searchable = "";
	this.visible = false;
	this.belongsToThisExercise = false;
	this.isInAnswerBox = false;
}

// Return HTML code for displaying the symbol
Symbol.prototype.show = function(width, padding) {
    return '<div class="symbolHolder" id="symbolHolder_' + this.id + '"><img id="symbol_' +
           this.id + '" src="quincy/symbols/' + this.school + '/Level_' + this.level + '/Group_' + this.group + '/' + this.fileName +
		   '" draggable="true" style="width:' + width + 'px;height:' + width + 'px;padding:' + padding + 'px;"></div>';
}

// Class of the Database of Symbols
function SymbolDB() {
	this.symbols = new Array();
	this.numOfVisibleSymbols = 0;
	this.studentsAnswer = -1;
	this.draggedSymbol;
	this.loadDB();
}

// Load symbol database
SymbolDB.prototype.loadDB = function() {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else {// code for IE6, IE5
  		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET","quincy/symbols/index.xml", false);
	xmlhttp.send();
	var data = xmlhttp.responseXML;
	var numOfSymbols = data.getElementsByTagName("symbol").length;
	
	for(var i = 0; i < numOfSymbols; i++) {
		this.symbols[i] = new Symbol();
		this.symbols[i].id = data.getElementsByTagName("symbol")[i].getAttribute("id");
		this.symbols[i].name = data.getElementsByTagName("symbol")[i].getAttribute("name");
		this.symbols[i].fileName = data.getElementsByTagName("symbol")[i].getAttribute("fileName");
		this.symbols[i].school = data.getElementsByTagName("symbol")[i].getAttribute("school");
		this.symbols[i].level = data.getElementsByTagName("symbol")[i].getAttribute("level");
		this.symbols[i].group = data.getElementsByTagName("symbol")[i].getAttribute("group");
		this.symbols[i].searchable += data.getElementsByTagName("symbol")[i].getAttribute("fileName");
		this.symbols[i].altType += data.getElementsByTagName("symbol")[i].getAttribute("altType");
		this.symbols[i].altLoc += data.getElementsByTagName("symbol")[i].getAttribute("altLoc");
		this.symbols[i].info = data.getElementsByTagName("symbol")[i].getAttribute("info");
		
		switch(this.symbols[i].school) {
		    case "Laon":
			    this.symbols[i].matchingStGall = data.getElementsByTagName("symbol")[i].getAttribute("matchingStGall");
				this.symbols[i].matchingModern = data.getElementsByTagName("symbol")[i].getAttribute("matchingModern");
				break;
			case "StGall":
			    this.symbols[i].matchingLaon = data.getElementsByTagName("symbol")[i].getAttribute("matchingLaon");
				this.symbols[i].matchingModern = data.getElementsByTagName("symbol")[i].getAttribute("matchingModern");
				break;
			case "StGallModern":
			    this.symbols[i].matchingStGall = data.getElementsByTagName("symbol")[i].getAttribute("matchingStGall");
				this.symbols[i].matchingLaon = data.getElementsByTagName("symbol")[i].getAttribute("matchingLaon");
				break;
			case "LaonModern":
			    this.symbols[i].matchingStGall = data.getElementsByTagName("symbol")[i].getAttribute("matchingStGall");
				this.symbols[i].matchingLaon = data.getElementsByTagName("symbol")[i].getAttribute("matchingLaon");
				break;
		}
	}
}

// Show list of symbols and answer in drop box
SymbolDB.prototype.showList = function(nNeumsInARow) {
	var width = 60;
	var padding = 7;//14yoyo revise
	
	// show list of symbols
    var e = document.getElementById("symbolSection");	
    var html = '<div id="symbolList" style="width:' + (width + 2 * padding + 2) * nNeumsInARow + 'px; height:' + Math.ceil(this.numOfVisibleSymbols / nNeumsInARow) * (width + 2 * padding + 6) +
	           'px;">';
    
	for (var i = 0; i < this.symbols.length; i++) {
	    if (this.symbols[i].visible) {
			html += this.symbols[i].show(width, padding);//how to show symbol
	    }
    }
	html += '</div>';
	e.innerHTML = html;
	
	var self = this;	
	// drag function of symbols
	for (var i = 0; i < this.symbols.length; i++) {
	    if (this.symbols[i].visible) {
	        document.getElementById("symbol_" + this.symbols[i].id).ondragstart = function(event) {
		        self.drag(event);
		    };
		}
    }
	
	// drop function of symbol list
	document.getElementById("symbolList").ondrop = function(event) {
		self.drop(event);
	};
	document.getElementById("symbolList").ondragover = function(event) {
	    self.allowDrop(event);
	};		
}

// Filter the symbol list by school and level
SymbolDB.prototype.filterList = function(school, level, studentsAnswer, nNeumsInARow) {
    // Show search box
/*	document.getElementById("searchBox").innerHTML = '<input id="keywords" type="text" size="40">';
    var self = this;
	document.getElementById("keywords").onkeyup = function(event) {
	    self.handleKeyPress(event);
	};
*/
	// reset visibility of all symbols

	//set invisible neums here
    this.numOfVisibleSymbols = 0;
    for (var i = 0; i < this.symbols.length; i++) {
	    this.symbols[i].visible = false;
	}
	
	if(school == "Laon" && level == 2){
		for (var i = 0; i < this.symbols.length; i++) {
		    if (this.symbols[i].school == school && this.symbols[i].level == level && this.symbols[i].id != 611 && this.symbols[i].id != 612) {
				this.symbols[i].visible = true;
				this.symbols[i].belongsToThisExercise = true;
				this.numOfVisibleSymbols++;
			}		
		}
	}
	else if (school == "Laon" && level == 1){
		for (var i = 0; i < this.symbols.length; i++) {
		    if (this.symbols[i].school == school && this.symbols[i].level == level && 
		    	this.symbols[i].id != 579 && 
		    	this.symbols[i].id != 580 &&
		    	this.symbols[i].id != 583 &&
		    	this.symbols[i].id != 589 &&
		    	this.symbols[i].id != 595 &&
		    	this.symbols[i].id != 597 &&
		    	this.symbols[i].id != 600 &&
		    	this.symbols[i].id != 602 &&
		    	this.symbols[i].id != 603) {
				this.symbols[i].visible = true;
				this.symbols[i].belongsToThisExercise = true;
				this.numOfVisibleSymbols++;
			}		
		}
	}
	else if(school == "StGall" && level == 2){
		for (var i = 0; i < this.symbols.length; i++) {
		    if (this.symbols[i].school == school && this.symbols[i].level == level && this.symbols[i].id != 35) {
				this.symbols[i].visible = true;
				this.symbols[i].belongsToThisExercise = true;
				this.numOfVisibleSymbols++;
			}		
		}
	}
	else{
		for (var i = 0; i < this.symbols.length; i++) {
		    if (this.symbols[i].school == school && this.symbols[i].level == level) {
				this.symbols[i].visible = true;
				this.symbols[i].belongsToThisExercise = true;
				this.numOfVisibleSymbols++;
			}		
		}	
	}
	this.studentsAnswer = studentsAnswer;
	this.showList(nNeumsInARow);
}

// Filter the symbol list for level 6
SymbolDB.prototype.filterListForLevelSix = function(neumIds, studentsAnswer, nNeumsInARow) {
	// reset visibility of all symbols
    this.numOfVisibleSymbols = 0;
    for (var i = 0; i < this.symbols.length; i++) {
	    this.symbols[i].visible = false;
	}
		
	for (var i = 0; i < neumIds.length; i++) {
		this.symbols[neumIds[i]].visible = true;
		this.symbols[neumIds[i]].belongsToThisExercise = true;
		this.numOfVisibleSymbols++;
	}
	
	this.studentsAnswer = studentsAnswer;
	this.showList(nNeumsInARow);
}

// Handle key press
SymbolDB.prototype.handleKeyPress = function(ev) {    
    var keywords = document.getElementById("keywords").value;
	
	if (keywords) {
	    var tokens = keywords.split(" ");
	    for (var i = 0; i < this.symbols.length; i++) {
	        if (this.symbols[i].visible) {
			    for (var j = 0; j < tokens.length; j++) {
	                if (this.symbols[i].searchable.indexOf(tokens[j]) > -1) {
			            break;
		            }
					this.symbols[i].visible = false;
	            }
			}
	    }
	}
	else {
	    for (var i = 0; i < this.symbols.length; i++) {
	        this.symbols[i].visible = this.symbols[i].belongsToThisExercise;
		}	    
	}
	console.log(this.studentsAnswer);
	this.showList();
}

// Handle drag and drop events 
SymbolDB.prototype.drag = function(ev) {
	console.log("run dragstart1 in symbols");

    ev.dataTransfer.setData("text/html", ev.target.id);

    var offsetX;
    var offsetY;
    
    	offsetX = (ev.pageX - ((($(document).width()-1096)/2)+363))%76;
    	console.log("pagex:"+ev.pageX);
    	console.log("pageY when drag:"+ev.pageY);
    	console.log("bodyWidth:"+$(document).width());
    	//console.log("offsetX="+offsetX);

    	offsetY = ev.pageY - 658;
  

    //ev.dataTransfer.setData("text", offsetX);
    ev.dataTransfer.setData("text/plain", offsetX+','+offsetY);

	this.draggedSymbol = ev.target.id;

	//var style = window.getComputedStyle(ev.target, null);
	//var transfer=ev.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"), 10) - (ev.clientX-((window.innerWidth-15-1096)/2+226+66.5))) /*+ ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY) + ',' + ev.target.getAttribute('data-item')*/); 
	//console.log("transfer:"+(parseInt(style.getPropertyValue("left"), 10) - (ev.clientX-((window.innerWidth-15-1096)/2+226+66.5))));
}

// SymbolList
SymbolDB.prototype.allowDrop = function(ev) {
    // The symbol is only allowed to be put back to its own box
    if (ev.target.id.lastIndexOf("symbolHolder", 0) == 0 &&
	    ev.target.id.substring(13) == this.draggedSymbol.substring(7) &&
    	!ev.target.firstChild) {
        ev.preventDefault();
	}
}

// SymbolList
// Must be the answer symbol being dropped back to its spot
SymbolDB.prototype.drop = function(ev) {  
	ev.preventDefault();
    var data = ev.dataTransfer.getData("text/html");
    ev.target.appendChild(document.getElementById(data));
	this.studentsAnswer = -1;
}