const GRID_WIDTH = 10;
let is_mouse_down = false;

class Renderer {
	constructor() {
		this.gl = this.initWebGL();
		this.grid = new Grid(this.gl);
		this.camera = create_camera(30, 90, 8/6);
	}

	update() {
		// Updates the camera
		update_camera(this.camera);
	}

	render(nn) {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.grid.draw(this.camera);
		// Draw Neural Network Plane
	}

	initWebGL() {
		const canvas = document.getElementById('Display');
		const gl = canvas.getContext('webgl');
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clearDepth(1.0);
		canvas.addEventListener('mousemove', this.on_mouse_move.bind(this));
		canvas.addEventListener('wheel', this.on_mouse_wheel.bind(this));
		canvas.addEventListener('mousedown', () => is_mouse_down = true);
		canvas.addEventListener('mouseup', () => is_mouse_down = false);
		return gl;
	}

	on_mouse_move(event){
		if(!is_mouse_down) return;
		this.camera.target_pitch += event.movementY * 0.6;
		this.camera.target_yaw -= event.movementX * 0.6;
	
		// Clamping
		if(this.camera.target_pitch > 89) this.camera.target_pitch = 89;
		if(this.camera.target_pitch < -89) this.camera.target_pitch = -89;
	}
	
	on_mouse_wheel(event){
		this.camera.target_distance += event.deltaY * 0.02;
	
		// Clamping
		if(this.camera.target_distance < 1.4) this.camera.target_distance = 1.4;
		if(this.camera.target_distance > 20) this.camera.target_distance = 20;
	
	}
}

