let gl;
const GRID_WIDTH = 10;

// Scene

function run() {
	initWebGL();

	const grid = createGridModel();

	// Create Plane VAO

	render();
}

function createGridModel(gl) {
	const vertices = [];

	// It's going to be a quad for now
	vertices.push(-1, 0, -1);
	vertices.push(-1, 0, 1);
	vertices.push(1, 0, 1);
	vertices.push(-1, 0, -1);
	vertices.push(1, 0, 1);
	vertices.push(1, 0, -1);

	return Model(gl, vertices);

	/*
	for(let i = 0; i < GRID_WIDTH; i++) {
		for(let j = 0; j < GRID_WIDTH; j++) {
			
		}
	}
	*/
}

function initWebGL() {
	canvas = document.getElementById('Display');
	gl = canvas.getContext('webgl');
}

function render() {

	requestAnimationFrame(render);
}

window.onload = () => {
	init();
	render();
}