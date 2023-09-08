function Exercise(mechanism) {
	this.symbolDB = new SymbolDB();
	this.mechanism = mechanism;
	this.studentsAnswer = "";
	this.solution = "";
}

Exercise.prototype.saveAnswer = function() {}
Exercise.prototype.getSolution = function() {}

Exercise.prototype.grade = function() {
	this.saveAnswer();	
	if (this.studentsAnswer == this.solution) {		
		return true;
	}
    return false;
}