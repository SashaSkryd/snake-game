const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const width = canvas.width;
const height = canvas.height;

const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlock = height / blockSize;

let score = 0;

const drawBorder = function () {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};

const drawScore = function () {
  ctx.font = "20px Arial";
  ctx.fillStyle = "Black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score: " + score, blockSize, blockSize);
};

const gameOver = function () {
  clearInterval(intervalId);
  ctx.font = "60px Arial";
  ctx.fillStyle = "Black";
  ctx.textAlign = "centr";
  ctx.textBaseline = "middle";
  ctx.fillText("Game Over", width / 10, height / 2);
};

const Block = function (col, row) {
  this.col = col;
  this.row = row;
};

Block.prototype.drawSquare = function (color) {
  const x = this.col * blockSize;
  const y = this.row * blockSize;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
  const centerX = this.col * blockSize + blockSize / 2;
  const centerY = this.row * blockSize + blockSize / 2;

  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};

const circle = function (x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI * 2, false);
  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

Block.prototype.equal = function (outherBlock) {
  return this.col === outherBlock.col && this.row === outherBlock.row;
};

const Snake = function () {
  this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];

  this.direction = "right";
  this.nextDirection = "right";
};

Snake.prototype.draw = function () {
  for (let i = 0; i < this.segments.length; i++) {
    this.segments[i].drawSquare("Blue");
  }
};

Snake.prototype.move = function () {
  const head = this.segments[0];
  let newHead;
  // console.log(this.direction);
  this.direction = this.nextDirection;
  //    console.log(this.nextDirection);
  if (this.direction === "right") {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === "down") {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === "left") {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === "up") {
    newHead = new Block(head.col, head.row - 1);
  }
  // console.log(newHead);
  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }

  this.segments.unshift(newHead);

  if (newHead.equal(apple.position)) {
    score++;
    apple.move();
  } else {
    this.segments.pop();
  }
};

Snake.prototype.checkCollision = function (head) {
  const leftCollision = head.col === 0;
  const topCollision = head.row === 0;
  const rightCollision = head.col === widthInBlocks - 1;
  const bottomCollision = head.row === heightInBlock - 1;

  const wallCollision =
    leftCollision || topCollision || rightCollision || bottomCollision;

  let selfCollision = false;

  for (let i = 0; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollision = true;
    }
  }

  return wallCollision || selfCollision;
};

Snake.prototype.setDirection = function (newDirection) {
  // console.log(newDirection);
  if (this.direction === "up" && newDirection === "down") {
    return;
  } else if (this.direction === "right" && newDirection === "left") {
    return;
  } else if (this.direction === "down" && newDirection === "up") {
    return;
  } else if (this.direction === "left" && newDirection === "right") {
    return;
  }

  this.nextDirection = newDirection;
  // console.log(this.direction);
};

const Apple = function () {
  this.position = new Block(10, 10);
};

Apple.prototype.draw = function () {
  this.position.drawCircle("LimeGreen");
};

Apple.prototype.move = function () {
  const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
  const randomRow = Math.floor(Math.random() * (heightInBlock - 2)) + 1;

  this.position = new Block(randomCol, randomRow);
};

const apple = new Apple();
const cobra = new Snake();

const intervalId = setInterval(() => {
  ctx.clearRect(0, 0, width, height);

  drawScore();
  cobra.move();
  cobra.draw();
  apple.draw();
  drawBorder();
}, 100);

const directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};

const body = document.querySelector("body");
body.addEventListener("keydown", function () {
  const newDirection = directions[event.keyCode];
  // console.log(newDirection);
  if (newDirection !== undefined) {
    cobra.setDirection(newDirection);
  }
});
