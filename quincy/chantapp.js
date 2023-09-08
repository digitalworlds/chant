function server_login(app)
{
	var div=document.getElementById("vn_window_manager");
	vn.setScreen(div);
	var me=vn.cloud.getMe();
	
	var init=function()
	{
		div.style.pointerEvents='none';
		var data=me.getAppDataInstalled('62p9v6qon1ls1fwp');
		data.whenReady().then(function(data){
			app.cloud={me:me,data:data};
		});
	};
	
	me.whenReady().then(function(){
		init();
	}).otherwise(function(){
		div.style.pointerEvents='auto';
		me.loginWithDiv(div);
	});
	me.whenLogin().then(function(){
		init();
	});
	me.whenAuthenticationRequired().then(function(){
		console.log('authentication required');
		var w =me.getSessionExpiredWindow(vn.getWindowManager());
		w.setTitle('Logged out due to inactivity.');
		w.show();
		me.logout();
	});
}

function ChantApp(container_div_id) {
	this.container_div_id = container_div_id;
	
	this.stGallGroups = [["1", "2", "3", "4", "5"],
	                     ["1", "2", "3", "4", "5"],
		        		 ["1", "2"],
						 ["1", "2", "3", "4", "5", "6", "7"],
						 ["1", "2", "3", "4"],
						 ["1"]];
						 
    this.laonGroups = [["1", "2", "3", "4", "5"],
	                   ["1", "2", "3", "4", "5"], 
				       ["1", "2"],
					   ["1", "2", "3", "4", "5", "6"],
					   ["1", "2", "3", "4"],
					   ["1"]];
				       
	this.school = "";
	this.level = 0;
	this.group = 0;
	
	this.lastClickedItem = 0;
}

//NOTE: For St. Gall school = 1, for Laon school = 2
ChantApp.prototype.initLesson = function(school, level, group) {
	if(this.cloud)
	{
		console.log(this.cloud.me.info.name+' '+school+' '+level+' '+group);
	}else return;
	if (school == 1) {
		this.school = "StGall";
		this.schoolTitle = "St. Gall";
	}
	else if (school == 2) {
		this.school = "Laon";
		this.schoolTitle = "Laon";
	}
	else {
		this.school = "Combination";
		this.schoolTitle = "Combination";
	}
	this.level = level;
	this.group = group;
	this.lesson = new Lesson(this.school, level, group);
    this.lesson.initUI(this.container_div_id);

	// Change text color of selected menu item to red
	if (this.school == "Combination"){
			for (var i = 1; i <= 4; i++){
			//document.getElementById("menu-"+school+"-"+level+"-"+i).style.background="transparent";//yoyo
			document.getElementById("menu-"+i).style.background="transparent";//yoyo
		}
		document.getElementById("u3339").style.background="transparent";//intro
		if(level == 5){ level = 4; }
		document.getElementById("menu-"+level).style.background="#FF994D";
	}
	else{
		for (var i = 1; i <= this.getGroupNum(school, level); i++){
			//document.getElementById("menu-"+school+"-"+level+"-"+i).style.background="transparent";//yoyo
			document.getElementById("menu-"+i).style.background="transparent";//yoyo
		}
		
			document.getElementById("u3339").style.background="transparent";//intro
			document.getElementById("u1981").style.background="transparent";//review
			document.getElementById("u1960").style.background="transparent";//assessment
			document.getElementById("menu-"+group).style.background="#FF994D";//yoyo
		
		if(this.level !=6){
			document.getElementById("quizlet").style.background="transparent";//quizlet
		}
			//document.getElementById("menu-"+school+"-"+level+"-"+group).style.background="#FF994D";//yoyo
			document.getElementById("menu-"+group).style.background="#FF994D";//yoyo
	}
	
//	this.changeTextColor(group);
}

ChantApp.prototype.initReviewLesson = function(school, level) {
	this.level = level;

	if (school == 1) {    // St. Gall
		this.school = "StGall";
		this.schoolTitle = "St. Gall";
		this.reviewLesson = new ReviewLesson(this.school, level, this.stGallGroups[level-1]);
	}
	else if (school == 2) {    // Laon
		this.school = "Laon";
		this.schoolTitle = "Laon";
		this.reviewLesson = new ReviewLesson(this.school, level, this.laonGroups[level-1]);
	}
	this.reviewLesson.initUI(this.container_div_id);

	// Change text color of selected menu item to red
	for (var i = 1; i <= this.getGroupNum(school, level); i++){
		//document.getElementById("menu-"+school+"-"+level+"-"+i).style.background="transparent";//yoyo
		document.getElementById("menu-"+i).style.background="transparent";//yoyo
	}
	document.getElementById("u3339").style.background="transparent";//intro
	document.getElementById("u1981").style.background="#FF994D";//review
	document.getElementById("u1960").style.background="transparent";//assessment
	if(this.level !=6){
		document.getElementById("quizlet").style.background="transparent";//quizlet
	}
}

ChantApp.prototype.initTest = function(school, level) {
	this.level = level;

	if (school == 1) {    // St. Gall
		this.school = "StGall";
		this.schoolTitle = "St. Gall";
		this.levelTest = new LevelTest(this.school, level, this.stGallGroups[level-1]);
	}
	else if (school == 2) {    // Laon
		this.school = "Laon";
		this.schoolTitle = "Laon";
		this.levelTest = new LevelTest(this.school, level, this.laonGroups[level-1]);
	}	
	this.levelTest.initUI(this.container_div_id);
	
	// Change text color of selected menu item to red
	for (var i = 1; i <= this.getGroupNum(school, level); i++){
		//document.getElementById("menu-"+school+"-"+level+"-"+i).style.background="transparent";//yoyo
		document.getElementById("menu-"+i).style.background="transparent";//yoyo
	}
	document.getElementById("u3339").style.background="transparent";//intro
	document.getElementById("u1981").style.background="transparent";//review
	document.getElementById("u1960").style.background="#FF994D";//assessment
	if(this.level !=6){
		document.getElementById("quizlet").style.background="transparent";//quizlet
	}
}

/*yoyo add*/
ChantApp.prototype.initQuizlet = function(school, level) {
	this.level = level;

	if (school == 1) {    // St. Gall
		this.school = "StGall";
		this.schoolTitle = "St. Gall";
		this.quizlet = new Quizlet(this.school, level, this.stGallGroups[level-1]);
	}
	else if (school == 2) {    // Laon
		this.school = "Laon";
		this.schoolTitle = "Laon";
		this.quizlet = new Quizlet(this.school, level, this.laonGroups[level-1]);
	}		
	this.quizlet.initUI(this.container_div_id);
	
	// Change text color of selected menu item to red
	for (var i = 1; i <= this.getGroupNum(school, level); i++){
		//document.getElementById("menu-"+school+"-"+level+"-"+i).style.background="transparent";//yoyo
		document.getElementById("menu-"+i).style.background="transparent";//yoyo
	}
	document.getElementById("u3339").style.background="transparent";//intro
	document.getElementById("u1981").style.background="transparent";//review
	document.getElementById("u1960").style.background="transparent";//assessment
	document.getElementById("quizlet").style.background="#FF994D";//quizlet
}

ChantApp.prototype.getGroupNum = function(school, level) {
	if (level == 1 || level == 2) {
		return 5;
	}
    else if (level == 3) {
		return 2;
	}
    else if (level == 4) {
		return (8 - school);
	}
    else if (level == 5) {
		return 4;
	}
    else if (level == 6) {
		return 1;
	}
}

ChantApp.prototype.changeTextColor = function(index) {
	document.getElementById("menuItem" + index).style.color = "#ff6969";
	console.log("menuItem" + index + " clicked!");
	document.getElementById("menuItem" + this.lastClickedItem).style.color = "inherit";
	this.lastClickedItem = index;
}