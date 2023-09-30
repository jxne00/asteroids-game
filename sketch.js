var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];
var hits = 0; // stores the number of bullet-to-asteroid hits
var difficulty = 1;

function setup() {
  createCanvas(1200, 800);
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width / 2, height * 2.9);
  atmosphereSize = new createVector(width * 3, width * 3);
  earthLoc = new createVector(width / 2, height * 3.1);
  earthSize = new createVector(width * 3, width * 3);
}

function draw() {
  background(105, 60, 94);
  sky();

  spaceship.run();
  asteroids.run();

  drawEarth();
  drawScore(); // display the hit score on the top right of the canvas
  drawDifficultyLevel(); // display the current difficulty level

  checkCollisions(spaceship, asteroids); // function that checks collision between various elements
}

//draws earth and atmosphere
function drawEarth() {
  noStroke();

  //draw atmosphere
  fill(0, 0, 255, 40);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x, atmosphereSize.y);

  //draw earth
  fill(0, 0, 139);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

// checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids) {
  // spaceship-2-asteroid collisions
  // if the spaceship is hit by an asteroid the game will end
  for (var i = 0; i < asteroids.locations.length; i++) {
    // game ends if the spaceship is hit by an asteroid
    if (
      isInside(
        spaceship.location,
        spaceship.size,
        asteroids.locations[i],
        asteroids.diams[i]
      )
    ) {
      gameOver();
    }
  }

  // asteroid-2-earth collisions
  // if an asteroid crashes into earth the game will end
  for (var i = 0; i < asteroids.locations.length; i++) {
    // game ends if an asteroid crashes into earth
    if (
      isInside(
        earthLoc,
        earthSize.y,
        asteroids.locations[i],
        asteroids.diams[i]
      )
    ) {
      gameOver();
    }
  }

  // spaceship-2-earth
  // if the spaceship crashes into earth the game will end
  if (isInside(earthLoc, earthSize.y, spaceship.location, spaceship.size)) {
    gameOver();
  }

  // spaceship-2-atmosphere
  // call setNearEarth() function if spaceship is inside the atmosphere
  if (
    isInside(
      atmosphereLoc,
      atmosphereSize.y,
      spaceship.location,
      spaceship.size
    )
  ) {
    spaceship.setNearEarth();
  }

  // bullet collisions
  // call destroy() on asteroid objects hit by a bullet
  for (var i = 0; i < spaceship.bulletSys.bullets.length; i++) {
    for (var y = 0; y < asteroids.locations.length; y++) {
      if (
        isInside(
          spaceship.bulletSys.bullets[i],
          spaceship.bulletSys.diam,
          asteroids.locations[y],
          asteroids.diams[y]
        )
      ) {
        asteroids.destroy(y); // destroy asteriod if it collides with bullet
        spaceship.bulletSys.bullets.splice(i, 1); // remove bullets that hit an asteroid
        hits++; // increase hit score count by 1

        // increase the difficulty every 10 hits
        if (hits % 10 == 0) {
          difficulty++;
        }
      }
    }
  }
}

//////////////////////////////////////////////////
// helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB) {
  // return true if the 2 circles passed in overlaps, false otherwise
  if (dist(locA.x, locA.y, locB.x, locB.y) < sizeA / 2 + sizeB / 2) {
    return true; // overlap
  } else {
    return false; // no overlap
  }
}

//////////////////////////////////////////////////
function keyPressed() {
  if (keyIsPressed && keyCode === 32) {
    // if spacebar is pressed, fire!
    spaceship.fire();
  }
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver() {
  textAlign(CENTER);

  // display gameover text
  push();
  textSize(100);
  stroke(0);
  strokeWeight(6);
  textFont('Georgia');
  fill(255, 165, 0);
  text('G A M E\nO V E R', width / 2, height / 3);
  noStroke();
  pop();

  // display the final hit score
  textSize(30);
  textStyle(BOLD);
  fill(255);
  text('your final score is: ' + hits, width / 2, height / 2 + 55);
  noLoop();
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky() {
  push();
  while (starLocs.length < 300) {
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (var i = 0; i < starLocs.length; i++) {
    rect(starLocs[i].x, starLocs[i].y, 2, 2);
  }

  if (random(1) < 0.3) starLocs.splice(int(random(starLocs.length)), 1);
  pop();
}

//////////////////////////////////////////////////
// function that displays a score of how many asteroids has been hit
function drawScore() {
  push();
  strokeWeight(4);
  stroke(199, 36, 177);
  fill(211, 211, 211);
  rect(25, 25, 165, 40, 10);

  fill(0);
  strokeWeight(1);
  stroke(0);
  textSize(25);
  textStyle(BOLDITALIC);
  text('SCORE: ' + hits, 45, 55);
  noStroke();
  pop();
}

// function that displays the current difficulty level
function drawDifficultyLevel() {
  fill(255);
  textSize(23);
  textStyle(BOLD);
  text('DIFFICULTY < ' + difficulty + ' >', 30, 95);
}
