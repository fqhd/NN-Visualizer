class Grid {
	constructor(gl) {
		this.gl = gl;
		this.createVBO();
		this.createShader();
	}

	createVBO() {
		const vertices = [];

		vertices.push(-1, 0, -1);
		vertices.push(-1, 0, 1);
		vertices.push(1, 0, 1);
		vertices.push(-1, 0, -1);
		vertices.push(1, 0, 1);
		vertices.push(1, 0, -1);

		this.vbo = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
	}

	createShader() {
		const vs = `
			attribute vec3 aPosition;

			uniform mat4 projection;
			uniform mat4 view;

			void main(){
				gl_Position = projection * view * vec4(aPosition, 1.0);
			}
		`;
		
		const fs = `
			void main(){
				gl_FragColor = vec4(1.0);
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
		this.gl.vertexAttribPointer(attribLoc, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(attribLoc);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
	}
}