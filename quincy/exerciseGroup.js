function ExerciseGroup(school, level, group, mechanism, mode) {
	this.school = school;
	this.level = level;
	this.group = group;
	this.mechanism = mechanism;
		
	// Load symbol database
	var xmlhttp;
	if (window.XMLHttpRequest) {    // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else {    // code for IE6, IE5
  		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET","quincy/symbols/index.xml", false);
	xmlhttp.send();
	this.data = xmlhttp.responseXML;
	var numOfSymbols = this.data.getElementsByTagName("symbol").length;
	
	// Get number of neums of the given group, level, school for Gall and Laon level 1-5
	if (school != "Combination") {
		if (level < 6) {
			var i = 0;
			for(; i < numOfSymbols; i++) {
				if (this.data.getElementsByTagName("symbol")[i].getAttribute("school") == school &&
					this.data.getElementsByTagName("symbol")[i].getAttribute("level") == level &&
					this.data.getElementsByTagName("symbol")[i].getAttribute("group") == group) {
					this.indexOfFirstNeum = i++;
					break;
				}
			}
			while (this.data.getElementsByTagName("symbol")[i].getAttribute("school") == school &&
				   this.data.getElementsByTagName("symbol")[i].getAttribute("level") == level &&
				   this.data.getElementsByTagName("symbol")[i].getAttribute("group") == group) {
				i++;
			}
			this.groupNeumCount = i - this.indexOfFirstNeum;
			
			// Get number of modern equivalents
			for(; i < numOfSymbols; i++) {
				if (this.data.getElementsByTagName("symbol")[i].getAttribute("school") == school + "Modern" &&
					this.data.getElementsByTagName("symbol")[i].getAttribute("level") == level &&
					this.data.getElementsByTagName("symbol")[i].getAttribute("group") == group) {
					this.indexOfFirstModernEquivalent = i++;
					break;
				}
			}
			while (i < numOfSymbols &&
				   this.data.getElementsByTagName("symbol")[i].getAttribute("school") == school + "Modern" &&
				   this.data.getElementsByTagName("symbol")[i].getAttribute("level") == level &&
				   this.data.getElementsByTagName("symbol")[i].getAttribute("group") == group) {
				i++;
			}
			this.modernEquivalentsCount = i - this.indexOfFirstModernEquivalent;
		}
		this.createLaonAndGallExercises(mode);
	}
	
	// Combined exercises
	else {
		this.createCombinedExercises(mode);
	}
}

ExerciseGroup.prototype.createLaonAndGallExercises = function(mode) {
	this.exercises = new Array();
	
	if (this.level == 1) {
		for (var i = 0; i < this.groupNeumCount; i++) {
			var questionSymbolID = this.indexOfFirstNeum + i;		
			// Exercise type 1 - enter given neum's name
			// One question for each neum
			this.exercises.push(new GivenNeumEnterEnglishNameExercise(questionSymbolID, this.mechanism));
			
			// Exercise type 3 - select modern symbol(s) to match neum
			// One question for each neum, show all modern symbols in this group
			this.exercises.push(new SelectSymbolToMatchExercise(3, this.school, this.level, this.group, questionSymbolID, this.mechanism));
		}
		
		// Exercise type 2 - select neum to match name
		// There are neums that have the same name, and neums that have multiple names
		// Questions are created on a name basis. One question for each name, not neum
		var names = new Array();
		for (var i = 0; i < this.groupNeumCount; i++) {
			var neumNames = this.data.getElementsByTagName("symbol")[this.indexOfFirstNeum+i].getAttribute("name").split("=");
			for (var j = 0; j < neumNames.length; j++) {
				if (!nameExists(names, neumNames[j])) {
					names.push(neumNames[j]);
					this.exercises.push(new SelectSymbolToMatchExercise(2, this.school, this.level, this.group, neumNames[j], this.mechanism));
				}
			}
		}
		
		// Exercise type 4 - select neum(s) to match modern symbol
		// One question for each modern symbol
		for (var i = 0; i < this.modernEquivalentsCount; i++) {
			var questionSymbolID = i + this.indexOfFirstModernEquivalent;    // ID of modern symbol
			this.exercises.push(new SelectSymbolToMatchExercise(4, this.school, this.level, this.group, questionSymbolID, this.mechanism));
		}
	}

	// Exercise type 6 - select neum alternation
	// Only available in level 2
	else if (this.level == 2) {
		for (var i = 0; i < this.groupNeumCount; i++) {
			// One question for each neum
			var questionSymbolID = this.indexOfFirstNeum + i;
			this.exercises.push(new SelectAlterationExercise(questionSymbolID, this.mechanism));
		}
	}
	
	// Exercise type 7 - multiple choice, multiple answers, each neum has its own unique set of modern equivalents
	// Only available in level 3
	else if (this.level == 3) {
		for (var i = 0; i < this.groupNeumCount; i++) {
			// One question for each neum
			var questionSymbolID = this.indexOfFirstNeum + i;
			this.exercises.push(new SelectSymbolToMatch2Exercise(this.school, this.level, this.group, questionSymbolID, this.mechanism));
		}
	}
	
	else if (this.level == 4) {
		// Exercise type 8 - enter the neum's English name or Latin name
		for (var i = 0; i < this.groupNeumCount; i++) {
			// One question for each neum
			var questionSymbolID = this.indexOfFirstNeum + i;			
			this.exercises.push(new GivenNeumEnterEnglishOrLatinNamesExercise(1, questionSymbolID, this.mechanism));
			this.exercises.push(new GivenNeumEnterEnglishOrLatinNamesExercise(2, questionSymbolID, this.mechanism));
		}
		
		// Exercise type 9 - given English/Latin name enter Latin/English name
		// There are neums that have the same name, and neums that have multiple names
		// Questions are created on a name basis. One question for each name, not neum
		var englishToLatinMap = new Array();
		var latinToEnglishMap = new Array();
		
		for (var i = 0; i < this.groupNeumCount; i++) {
			var neumNames = this.data.getElementsByTagName("symbol")[this.indexOfFirstNeum+i].getAttribute("name").split("--");
			var englishNames = neumNames[0].split("=");
			var latinNames = neumNames[1].split("=");
			
			for (var j = 0; j < englishNames.length; j++) {
				if (typeof englishToLatinMap[englishNames[j]] === "undefined") {
					englishToLatinMap[englishNames[j]] = latinNames;
//					console.log("adding new English name: " + englishNames[j]);
//					console.log("and its Latin names: " + latinNames);
				}
				else {
					// Avoid adding duplicates
					for (var k = 0; k < latinNames.length; k++) {
						if (!nameExists(englishToLatinMap[englishNames[j]], latinNames[k])) {
							/*console.log("dealing with " + englishNames[j]);
							console.log("----before push: lift up, quickly: " + englishToLatinMap["lift up, quickly"]);
							console.log("----before push: " + englishNames[j] + ": " + englishToLatinMap[englishNames[j]]);*/
							englishToLatinMap[englishNames[j]].push(latinNames[k]);
							if (englishNames[j] == "higher, quickly" && englishToLatinMap["lift up, quickly"].length > 1) {
								englishToLatinMap["lift up, quickly"].splice(1, 1);
							}
							if (englishNames[j] == "higher, hold" && englishToLatinMap["lift up, hold"].length > 1) {
								englishToLatinMap["lift up, hold"].splice(1, 1);
							}
							
						/*	console.log(englishNames[j] + " already exists");
							console.log("pushing Latin: " + latinNames[k]);
							console.log("----after push: lift up, quickly: " + englishToLatinMap["lift up, quickly"]);
							console.log("----after push: " + englishNames[j] + ": " + englishToLatinMap[englishNames[j]]);*/
						}
					}
				}
//				console.log("====================");
			}
			
			for (var j = 0; j < latinNames.length; j++) {
				if (typeof latinToEnglishMap[latinNames[j]] === "undefined") {
					latinToEnglishMap[latinNames[j]] = englishNames;
				}
				else {
					// Avoid adding duplicates
					for (var k = 0; k < englishNames.length; k++) {
						if (!nameExists(latinToEnglishMap[latinNames[j]], englishNames[k])) {
							latinToEnglishMap[latinNames[j]].push(englishNames[k]);
						}
					}
				}
			}
		}
		
		for (var key in englishToLatinMap) {
			this.exercises.push(new GivenNameEnterNameExercise(1, key, englishToLatinMap[key], this.mechanism));
		}
		for (var key in latinToEnglishMap) {
			this.exercises.push(new GivenNameEnterNameExercise(2, key, latinToEnglishMap[key], this.mechanism));
		}
		
		// Exercise type 2 - select neum to match name
		for (var key in latinToEnglishMap) {
			this.exercises.push(new SelectSymbolToMatchExercise(21, this.school, this.level, this.group, key, this.mechanism));
		}
		for (var key in englishToLatinMap) {
			this.exercises.push(new SelectSymbolToMatchExercise(22, this.school, this.level, this.group, key, this.mechanism));
		}
	}
	
	else if (this.level == 5) {
		// Exercise type 3 - select modern symbol(s) to match neum
		for (var i = 0; i < this.groupNeumCount; i++) {
			var questionSymbolID = this.indexOfFirstNeum + i;
			this.exercises.push(new SelectSymbolToMatchExercise(3, this.school, this.level, this.group, questionSymbolID, this.mechanism));
		}
		
		// Exercise type 4 - select neum(s) to match modern symbol
		for (var i = 0; i < this.modernEquivalentsCount; i++) {
			var questionSymbolID = i + this.indexOfFirstModernEquivalent;    // ID of modern symbol
			this.exercises.push(new SelectSymbolToMatchExercise(4, this.school, this.level, this.group, questionSymbolID, this.mechanism));
		}
		
		// Group 1/2/4 = level 1, add exercises type 1 & 2
		if (this.group != 3) {
			// Exercise type 1 - enter given neum's name
			for (var i = 0; i < this.groupNeumCount; i++) {
				var questionSymbolID = this.indexOfFirstNeum + i;		
				this.exercises.push(new GivenNeumEnterEnglishNameExercise(questionSymbolID, this.mechanism));
			}
			
			// Exercise type 2 - select neum to match name
			var names = new Array();
			for (var i = 0; i < this.groupNeumCount; i++) {
				var neumNames = this.data.getElementsByTagName("symbol")[this.indexOfFirstNeum+i].getAttribute("name").split("=");
				for (var j = 0; j < neumNames.length; j++) {
					if (!nameExists(names, neumNames[j])) {
						names.push(neumNames[j]);
						this.exercises.push(new SelectSymbolToMatchExercise(2, this.school, this.level, this.group, neumNames[j], this.mechanism));
					}
				}
			}
		}
	}
	
	else if (this.level == 6) {
		var xmlhttp;
		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		}
		else {// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET","quincy/scores/" + this.school + "_level_6_score_index.xml", false);
		xmlhttp.send();
		
		var scoreInfo = xmlhttp.responseXML;
		var length = scoreInfo.getElementsByTagName("score").length;
			
		// Exercise type 10 - St. Gall level 6 score exercise
		if (this.school == "StGall") {			
			for (var i = 0; i < length; i++) {
				if (scoreInfo.getElementsByTagName("score")[i].getAttribute("type") == "lesson") {
					var scoreFileName = scoreInfo.getElementsByTagName("score")[i].getAttribute("fileName");
					var solution = scoreInfo.getElementsByTagName("score")[i].getAttribute("solution");
					var symbolPos = scoreInfo.getElementsByTagName("score")[i].getAttribute("symbolPos");
					this.exercises.push(new ScoreExercise2(this.school, this.level, scoreFileName, solution, symbolPos, this.mechanism));
				}
			}
		}
		// Exercise type 11 - Laon level 6 score exercise
		else {
			for (var i = 0; i < length; i++) {
				if (scoreInfo.getElementsByTagName("score")[i].getAttribute("type") == "lesson") {
					var scoreFileName = scoreInfo.getElementsByTagName("score")[i].getAttribute("fileName");
					var solution = scoreInfo.getElementsByTagName("score")[i].getAttribute("solution");
					var symbolPos = scoreInfo.getElementsByTagName("score")[i].getAttribute("symbolPos");
					var symbolPosRange = scoreInfo.getElementsByTagName("score")[i].getAttribute("symbolPosRange");
					this.exercises.push(new LaonLevel6ScoreExercise(this.school, this.level, scoreFileName, solution, symbolPos, symbolPosRange, this.mechanism));
				}
			}
		}
	}
	
	// mode 0 - review mode, no shuffling, no intro/end page, do nothing here
	// mode 1 - regular mode
	if (mode == 1) {
	    this.exercises = shuffle(this.exercises);//!!!!!!!!!!!!!!!!

	    // Add intro and end pages
	    this.exercises.splice(0, 0, new IntroPage(this.school, this.level, this.group));
	    this.exercises.push(new EndPage(this.school, this.level, this.group));
	}
	
	// mode 2 - test mode, shuffle, no intro/end page
	else if (mode == 2) {
	    this.exercises = shuffle(this.exercises);
	}
}

ExerciseGroup.prototype.createCombinedExercises = function(mode) {
	stGallNeums = [[6, 7, 10, 11, 12, 13, 14, 15, 16, 18, 21, 22, 23],
	               [26, 27, 28, 29, 30, 32, 33, 39, 40, 43, 49, 50, 51, 53, 54, 58, 61, 63, 64, 66, 67, 68, 70, 73, 76, 77, 80, 85],
				   [91, 93, 95],
				   [],
				   [151, 152, 153, 154, 155, 156, 158, 159, 160, 161, 194, 195, 196, 197, 199, 200, 201, 202, 203, 205, 206, 207, 208, 217, 218, 219, 220]];
	
	laonNeums = [[581, 582, 584, 585, 586, 587, 588, 589, 592, 594, 595, 596, 597, 601],
	             [613, 614, 615, 616, 617, 618, 620, 621, 622, 624, 625, 627, 628, 629, 633, 635, 636, 638, 642, 648, 650, 652],
				 [653, 655, 656],
				 [],
				 [735, 736, 737, 739, 740, 741, 742, 743, 744, 745, 746, 747, 749, 750, 752, 753, 754, 755, 757]];
	
	this.exercises = new Array();
	
	// Given St Gall neum, select Laon neums to match
	for (var i = 0; i < stGallNeums[this.level-1].length; i++) {
		this.exercises.push(new CombinedMultipleChoiceExercise("Laon", this.level, stGallNeums[this.level-1][i], this.mechanism));
	}
	
	// Given Laon neum, select St Gall neums to match
	for (var i = 0; i < laonNeums[this.level-1].length; i++) {
		this.exercises.push(new CombinedMultipleChoiceExercise("StGall", this.level, laonNeums[this.level-1][i], this.mechanism));
	}
	
	// Add intro and end pages
	this.exercises.splice(0, 0, new IntroPage(this.school, this.level, this.group));
	this.exercises.push(new EndPage(this.school, this.level, this.group));
}

function nameExists(array, name) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].indexOf(name) > -1)    return true;
	}
	return false;
}

function shuffle(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}