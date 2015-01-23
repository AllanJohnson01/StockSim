function sketchProc(processing) {
  processing.setup = function() {
    noStroke();


  };
  var leftX = 143;
  var rightX = 262;
  var sunRadius = 100;
  processing.draw = function() {
    size(400,400);

    background(184, 236, 255);

    fill(255, 170, 0);
    ellipse(200, 100, sunRadius, sunRadius);

    // clouds
    fill(255, 255, 255);
    // left cloud
    ellipse(leftX, 150, 126, 97);
    ellipse(leftX+62, 150, 70, 60);
    ellipse(leftX-62, 150, 70, 60);

    // right cloud
    ellipse(rightX, 100, 126, 97);
    ellipse(rightX+62, 100, 70, 60);
    ellipse(rightX-62, 100, 70, 60);

    leftX--;
    rightX++;
    sunRadius +=2;
  };
}
var canvas = document.getElementById("canvas2");
// attaching the sketchProc function to the canvas
var processingInstance = new Processing(canvas, sketchProc);
