const GRID_WIDTH = 16;

class Grid {
	constructor(gl) {
		this.gl = gl;
		this.createVBO();
		this.createShader();
	}

	createVBO() {
		const vertices = [];

		const step = (1 / GRID_WIDTH) * 2;
		let x = -1;
		for(let i = 0; i < GRID_WIDTH; i++){
			vertices.push(x, -1);
			vertices.push(x, 1);
			x += step;
		}
		vertices.push(x, -1);
		vertices.push(x, 1);

		x = -1;
		for(let i = 0; i < GRID_WIDTH; i++){
			vertices.push(-1, x);
			vertices.push(1, x);
			x += step;
		}
		vertices.push(-1, x);
		vertices.push(1, x);

		this.vbo = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
	}

	createShader() {
		const vs = `#version 300 es
			in vec2 aPosition;

			uniform mat4 projection;
			uniform mat4 view;

			void main(){
				gl_Position = projection * view * vec4(aPosition.x, 0.0, aPosition.y, 1.0);
			}
		`;
		
		const fs = `#version 300 es
			out highp vec4 outColor;

			void main(){
				outColor = vec4(1.0);
			}
		`;

		this.shader = new Shader(this.gl, vs, fs);
	}

	draw(cam) {
		this.shader.bind();
		const projMatLoc = this.gl.getUniformLocation(this.shader.program, 'projection');
		this.gl.uniformMatrix4fv(projMatLoc, false, cam.projection);
		const viewMatLoc = this.gl.getUniformLocation(this.shader.program, 'view');
		this.gl.uniformMatrix4fv(viewMatLoc, false, cam.view);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		const attribLoc = this.gl.getAttribLocation(this.shader.program, 'aPosition');
		this.gl.vertexAttribPointer(attribLoc, 2, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(attribLoc);
		this.gl.drawArrays(this.gl.LINES, 0, GRID_WIDTH * 4 + 4);
	}
}