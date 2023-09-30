class Spaceship {
  constructor() {
    this.velocity = new createVector(0, 0);
    this.location = new createVector(width / 2, height / 2);
    this.acceleration = new createVector(0, 0);
    this.maxVelocity = 5;
    this.bulletSys = new BulletSystem();
    this.size = 50;
  }

  run() {
    this.bulletSys.run();
    this.draw();
    this.move();
    this.edges();
    this.interaction();
  }

  draw() {
    push();

    // customising the look of the spaceship
    var locX = this.location.x;
    var locY = this.location.y;
    var size = this.size;

    stroke(135, 206, 235);
    strokeWeight(1);
    fill(0);

    // right wing
    rect(locX + 5, locY, 20, 20, 5);

    // left wing
    rect(locX - size / 2, locY, 20, 20, 5);

    // rocket body
    fill(255, 0, 0);
    ellipse(locX, locY, size / 2 + 5, size);

    // line across rocket body
    strokeWeight(2);
    line(
      locX + size / 5 + 2,
      locY - size / 6 - 5,
      locX - size / 5 - 2,
      locY - size / 6 - 5
    );

    // rocket window
    stroke(0);
    fill(135, 206, 235);
    ellipse(locX, locY, 14);
    noStroke();

    // jet thrusters activating from the opposite side of movement
    fill(226, 88, 34);

    // draw right thrusters when left arrow is pressed
    if (keyIsDown(LEFT_ARROW)) {
      // random height used to give a "fire" effect
      rect(locX + 10, locY + 20, 15, random(0, 15), 5);
    }

    // draw left thrusters when right arrow is pressed
    if (keyIsDown(RIGHT_ARROW)) {
      rect(locX - size / 2, locY + 20, 15, random(0, 15), 5);
    }

    pop();
  }

  move() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxVelocity); // limit the velocity vector to maxVelocity
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce(f) {
    this.acceleration.add(f);
  }

  interaction() {
    // decrease x when left arrow pressed
    if (keyIsDown(LEFT_ARROW)) {
      this.applyForce(createVector(-0.1, 0));
    }

    // increase x when right arrow pressed
    if (keyIsDown(RIGHT_ARROW)) {
      this.applyForce(createVector(0.1, 0));
    }

    // decrease y when up arrow pressed
    if (keyIsDown(UP_ARROW)) {
      this.applyForce(createVector(0, -0.1));
    }

    // increase y when up arrow pressed
    if (keyIsDown(DOWN_ARROW)) {
      this.applyForce(createVector(0, 0.1));
    }
  }

  fire() {
    this.bulletSys.fire(this.location.x, this.location.y);
  }

  edges() {
    if (this.location.x < 0) this.location.x = width;
    else if (this.location.x > width) this.location.x = 0;
    else if (this.location.y < 0) this.location.y = height;
    else if (this.location.y > height) this.location.y = 0;
  }

  setNearEarth() {
    var downPoint = createVector(0, 0.05);
    this.applyForce(downPoint); // pulls spaceship towards earth

    var friction = this.velocity.copy();
    friction.mult(-1); // change direction
    friction.mult(1 / 30); // 30x smaller than velocity of spaceship
    this.applyForce(friction);
  }
}
