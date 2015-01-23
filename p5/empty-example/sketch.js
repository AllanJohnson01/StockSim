function setup() {
  // put setup code here
    createCanvas(640, 480);
}

function draw() {
  // put drawing code here
    if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255,255,255,0);
  }
    noStroke();
  ellipse(mouseX, mouseY, 80, 80);
}