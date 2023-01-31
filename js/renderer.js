const GRID_WIDTH = 10;

class Renderer {
	constructor() {
		this.gl = this.initWebGL();
		this.grid = new Grid(this.gl);
	}

	update() {
		// Updates the camera
	}

	render(nn) {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.grid.draw();
		// Draw Neural Network Plane
	}

	initWebGL() {
		const canvas = document.getElementById('Display');
		const gl = canvas.getContext('webgl');
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clearDepth(1.0);
		return gl;
	}
}
