class Target {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
  }
  
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    
    noStroke();
    fill(147, 51, 234, 110);
    circle(0, 0, this.r * 3.5); 
    
    fill(147, 51, 234, 150);
    circle(0, 0, this.r * 2.5);

    fill(168, 85, 247); 
    stroke(40, 10, 70);       
    strokeWeight(2);
    
    beginShape();
    vertex(0, -this.r);
    vertex(this.r, 0);
    vertex(0, this.r);
    vertex(-this.r, 0);
    endShape(CLOSE);

    pop();
  }
}