SIZE = 30;

canvas = document.getElementById("game");
canvas.width = SIZE * SIZE; // 900
canvas.height = SIZE * SIZE;
ctx = canvas.getContext("2d");

ctx.fillStyle = 'rgb(30, 30, 30)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function xyToIndex(x, y) {
	return y * SIZE + x;
}

function indexToXY(i) {
	y = Math.floor(i / SIZE);
	x = i % SIZE;
	return [x, y];
}

let snake = [xyToIndex(10, 11), xyToIndex(10, 12), xyToIndex(10, 13)]; // array of x,y tuples
let apple = Math.floor(Math.random() * SIZE * SIZE);

function draw() {
	ctx.fillStyle = 'rgb(30, 30, 30)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// draw snake only
	function drawRect(x, y, color = 'rgb(10, 230, 10)') {
		offset = 1; // 1px
		ctx.fillStyle = color;
		sx = x * SIZE + offset;
		sy = y * SIZE + offset;
		ctx.fillRect(
			sx, sy,
			SIZE - 2 * offset, SIZE - 2 * offset
		)
	}
	snake.forEach(e => {
		drawRect(...indexToXY(e));
	});

	drawRect(...indexToXY(apple), color = 'rgb(230, 10, 10)');
}

let direction = {
	UP: -SIZE,
	DOWN: SIZE,
	LEFT: -1,
	RIGHT: 1
}

let currentDirection = direction.UP;

function checkBoundaries(oldHead, newHead) {
	// check left/right walls
	[x, y] = indexToXY(oldHead);
	if (currentDirection == direction.LEFT && x == 0 || currentDirection == direction.RIGHT && x == SIZE - 1) {
		return false;
	}
	// check top/bottom walls
	if (newHead < 0 || newHead >= SIZE * SIZE) {
		return false;
	}
	// check if crashes into itself
	if (snake.includes(newHead)) {
		return false;
	}
	return true;
}

function eatenApple(newHead, apple) {
	return newHead == apple;
}

function moveSnake(grow = false) {
	newHead = snake[0] + currentDirection;
	if (!grow) {
		snake.pop();
	}
	snake.unshift(newHead);
}

this.addEventListener("keypress", e => {
	switch (e.code) {
		case "KeyW": currentDirection = direction.UP; break;
		case "KeyA": currentDirection = direction.LEFT; break;
		case "KeyS": currentDirection = direction.DOWN; break;
		case "KeyD": currentDirection = direction.RIGHT; break;
	}
})

function reset() {
	snake = [xyToIndex(10, 11), xyToIndex(10, 12), xyToIndex(10, 13)]; // array of x,y tuples
}

async function animate() {
	await new Promise(r => setTimeout(r, 100)); // bad sleep
	requestAnimationFrame(animate);

	newHead = snake[0] + currentDirection; // calc new head location
	if (!checkBoundaries(snake[0], newHead)) { // CRASHED ----- RESET
		reset();
	}
	if (eatenApple(newHead, apple)) {
		apple = Math.floor(Math.random() * SIZE * SIZE);
		moveSnake(true);
	}
	else {
		moveSnake(false);
	}


	draw();
}

animate();