const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const $sprite = document.querySelector("#sprite");
const $bricks = document.querySelector("#bricks");
canvas.width = 448;
canvas.height = 400;

/*variables ball*/
const ballRadius = 4;

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

/*paddle*/
const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

let rightPressed = false;
let leftPressed = false;
const paddleVel = 5;

const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 30;
const brickHeight = 14;
const brickPadding = 0;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = [];

const BRICK_STATUS = {
  ACTIVE: 1,
  BREAKED: 0,
};

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
    const random = Math.floor(Math.random() * 8);
    bricks[c][r] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.ACTIVE,
      color: random,
    };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.drawImage(
    $sprite,
    29,
    174,
    paddleWidth,
    paddleHeight,
    paddleX,
    paddleY,
    paddleWidth,
    paddleHeight
  );
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const clipX = currentBrick.color * 32;

      ctx.drawImage(
        $bricks,
        clipX,
        0,
        32,
        16,
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeight
      );
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const isBallSameXAsBrick =
        x > currentBrick.x && x < currentBrick.x + brickWidth;
      const isBallSameYasBrick =
        y > currentBrick.y && y < currentBrick.y + brickHeight;
      if (isBallSameXAsBrick && isBallSameYasBrick) {
        dy = -dy;
        currentBrick.status = BRICK_STATUS.DESTROYED;
      }
    }
  }
}

function ballMovement() {
  if (
    x + dx > canvas.width - ballRadius || //derecha
    x + dx < ballRadius
  ) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  }

  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;

  const isBallTouchingPaddle = y + dy > paddleY;

  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    dy = -dy; // cambiamos la dirección de la pelota
  } else if (
    // la pelota toca el suelo
    y + dy > canvas.height - ballRadius ||
    y + dy > paddleY + paddleHeight
  ) {
    document.location.reload();
  }
  x += dx;
  y += dy;
}

function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleVel;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleVel;
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener("keydown", keyDowmHandler);
  document.addEventListener("keyup", keyUpHandler);
  function keyDowmHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = true;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = false;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = false;
    }
  }
}

function draw() {
  cleanCanvas();
  drawBall();
  drawPaddle();
  drawBricks();

  collisionDetection();
  ballMovement();
  paddleMovement();
  window.requestAnimationFrame(draw);
}

draw();
initEvents();
