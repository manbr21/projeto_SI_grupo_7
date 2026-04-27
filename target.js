class Target {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
  }
  
  show() {
    noStroke()
    fill(255,0,0, 180)
    circle(this.pos.x, this.pos.y, this.r*2);
  }
}