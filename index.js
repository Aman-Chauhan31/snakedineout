const canva = document.getElementById("game");
const context = canva.getContext("2d");

let speed = 7;

let rectCount = 20;
let rectSize = canva.width / rectCount - 2;
let headX = 10;
let headY = 10;
let xVelocity = 0;
let yVelocity = 0;
let foodX = Math.floor(Math.random() * rectCount);
let foodY = Math.floor(Math.random() * rectCount);
const snakeRemain = [];
let tail = 0;
const eatSound = new Audio("eat.mp3");
const overSound = new Audio("over.mp3");

let score = 0;

class SnakeBody {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

function gameSpace() {
  snakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();

  snake();
  foodFill();

  checkAppleCollison();
  drawScore();
  setTimeout(gameSpace, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  if (headX < 0 || headY < 0) {
    gameOver = true;
  } else if (headX == rectCount || headY == rectCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeRemain.length; i++) {
    let part = snakeRemain[i];
    if (part.a == headX && part.b == headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    context.fillStyle = "white";
    context.font = "50px Verdana";
    overSound.play();
    setTimeout(show, 3500);
    setTimeout(() => {
      document.getElementById("start").innerHTML =
        "Refresh to Restart the Game";
    }, 3500);

    function show() {
      context.fillText("Game Over!", canva.width / 6.5, canva.height / 2);
    }
  }

  return gameOver;
}

function drawScore() {
  context.fillStyle = "white";
  context.font = "13px verdana";
  context.fillText("score " + score, canva.width - 60, 10);
}

function clearScreen() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canva.width, canva.height);
}

function snake() {
  context.fillStyle = "green";
  for (let i = 0; i < snakeRemain.length; i++) {
    let part = snakeRemain[i];
    context.fillRect(
      part.a * rectCount,
      part.b * rectCount,
      rectSize,
      rectSize
    );
  }

  snakeRemain.push(new SnakeBody(headX, headY));
  while (snakeRemain.length > tail) {
    snakeRemain.shift();
  }

  context.fillStyle = "yellow";
  context.fillRect(headX * rectCount, headY * rectCount, rectSize, rectSize);
}

function foodFill() {
  context.fillStyle = "orange";
  context.fillRect(foodX * rectCount, foodY * rectCount, rectSize, rectSize);
}

function checkAppleCollison() {
  if (foodX == headX && foodY == headY) {
    foodX = Math.floor(Math.random() * rectCount);
    foodY = Math.floor(Math.random() * rectCount);
    tail++;
    score++;
    eatSound.play();
  }
}

document.body.addEventListener("keydown", keyFunc);

function keyFunc(event) {
  if (event.keyCode == 40) {
    //down
    if (yVelocity == -1) return;
    yVelocity = 1;
    xVelocity = 0;
  }

  if (event.keyCode == 38) {
    //up
    if (yVelocity == 1) return;
    yVelocity = -1;
    xVelocity = 0;
  }

  if (event.keyCode == 37) {
    //left
    if (xVelocity == 1) return;
    yVelocity = 0;
    xVelocity = -1;
  }

  if (event.keyCode == 39) {
    //right
    if (xVelocity == -1) return;
    yVelocity = 0;
    xVelocity = 1;
  }
}

function snakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

gameSpace();
