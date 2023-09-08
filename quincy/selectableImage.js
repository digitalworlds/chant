function SelectableImage(imgID, imgDir) {
	this.imgID = imgID;
	this.imgDir = imgDir;
	this.selected = false;
	this.symbolSize = 80;
	this.yellowBackground = "rgb(252, 237, 217)";
	
	document.getElementById("checkboxArea").innerHTML +=
		'<canvas id="' + this.imgID + '" class="symbolCanvas" width="' + this.symbolSize + '" height="' + this.symbolSize + '">';
}

SelectableImage.prototype.show = function() {
	var canvas = document.getElementById(this.imgID);
    var context = canvas.getContext("2d");
	
	// Show image
	var img = new Image();
	img.src = this.imgDir;

	var self = this;
	img.onload = function() {
		var tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
		tempCanvas.height = img.height;
		
		var tempContext = tempCanvas.getContext('2d');
		
		// Draw yellow background
		tempContext.rect(0, 0, img.width, img.height);
		tempContext.fillStyle = self.yellowBackground;
		tempContext.fill();
		
		// Draw image on yellow background
        tempContext.drawImage(img, 0, 0, img.width, img.height);

        // Repeatedly scale down image by half, otherwise image would lose quality
        var tempContextWidth = img.width;
        var tempContextHeight = img.height;
        for (var i = 0; i < Math.floor(Math.log(img.width / self.symbolSize) / Math.log(2)); i++) {		
			tempContext.drawImage(tempCanvas, 0, 0, tempContextWidth, tempContextHeight,
                                              0, 0, tempContextWidth * 0.5, tempContextHeight * 0.5);
            tempContextWidth *= 0.5;
            tempContextHeight *= 0.5;
        }
                      
        context.drawImage(tempCanvas, 0, 0, tempContextWidth, tempContextHeight,
                                  0, 0, self.symbolSize, self.symbolSize);

	}
	
	
}

SelectableImage.prototype.toggleBorder = function() {
	if (!this.selected)    this.select();
	else 		          this.deselect();
}

SelectableImage.prototype.select = function() {
	document.getElementById(this.imgID).style.border = "2px solid rgb(64, 143, 255)";
	document.getElementById(this.imgID).style.borderRadius  = "3px";
	this.selected = true;
}

SelectableImage.prototype.deselect = function() {
	document.getElementById(this.imgID).style.border = "2px solid rgba(0, 0, 0, 0)";
	document.getElementById(this.imgID).style.backgroundColor = this.yellowBackground;
	this.selected = false;
}

SelectableImage.prototype.onMouseOver = function() {
	document.getElementById(this.imgID).style.border = "2px solid rgb(64, 143, 255)";
	document.getElementById(this.imgID).style.borderRadius  = "3px";
}

SelectableImage.prototype.onMouseOut = function() {
	if (!this.selected) {
    	document.getElementById(this.imgID).style.border = "2px solid rgba(0, 0, 0, 0)";
	}
	document.getElementById(this.imgID).style.backgroundColor = this.yellowBackground;
}

SelectableImage.prototype.showCheckMark = function() {
	var canvas = document.getElementById(this.imgID);
    var context = canvas.getContext("2d");
    var img = new Image();
	img.src = "quincy/img/tick.png";
	var self = this;
	img.onload = function() {
		context.drawImage(img, 0, 0, 16, 16);
	}
}

SelectableImage.prototype.showXMark = function() {
	var canvas = document.getElementById(this.imgID);
    var context = canvas.getContext("2d");
    var img = new Image();
	img.src = "quincy/img/x.png";
	var self = this;
	img.onload = function() {
		context.drawImage(img, 0, 0, 16, 16);
	}
}