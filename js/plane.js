const RESOLUTION = 10;

class Plane {
	constructor(gl) {
		this.gl = gl;
		this.createVBO();
		this.createShader();
		this.nn = new NeuralNetwork(2, 4, 1);
		console.log(this.nn);
		const training_data = [
			[0, 0],
			[0, 1],
			[1, 0],
			[1, 1]
		];

		for(let i = 0; i < 100000; i++) {
			const example = training_data[Math.floor(Math.random() * 4)];
			let output = 0;
			if(example[0] + example[1] == 1){
				output = 1;
			}
			this.nn.train(example, [output]);
		}

		console.log(this.nn.predict([0, 0]));
		console.log(this.nn.predict([1, 0]));
		console.log(this.nn.predict([0, 1]));
		console.log(this.nn.predict([1, 1]));
	}

	createVBO() {
		const vertices = [];

		vertices.push(-1, -1);
		vertices.push(-1, 1);
		vertices.push(1, 1);
		vertices.push(-1, -1);
		vertices.push(1, 1);
		vertices.push(1, -1);

		this.vbo = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
	}

	createShader() {
		const vs = `
			attribute vec2 aPosition;

			uniform mat4 projection;
			uniform mat4 view;

			uniform mat4 wh;
			uniform vec4 bh;
			uniform vec4 wo;
			uniform float bo;

			float sigmoid(float x) {
				return 1.0 / (1.0 + exp(-x));
			}

			vec4 activate(vec4 v) {
				return vec4(
					sigmoid(v.x),
					sigmoid(v.y),
					sigmoid(v.z),
					sigmoid(v.w)
				);
			}

			void main(){
				vec4 x = vec4((aPosition + 1.0) / 2.0, 0.0, 0.0);
				x = wh * x + bh;
				x = activate(x);
				float y = sigmoid(dot(wo, x) + bo);
				
				gl_Position = projection * view * vec4(aPosition.x, y, aPosition.y, 1.0);
			}
		`;
		
		const fs = `
			void main(){
				gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
			}
		`;

		this.shader = new Shader(this.gl, vs, fs);
	}

	draw(cam) {
		this.shader.bind();

		// Upload neural network
		const data = [];
		this.nn.weights_ih.data.forEach(t => {
			t.forEach(v => {
				data.push(v);
			});
			data.push(0);
			data.push(0);
		});

		const wh = mat4.fromValues(...data);
		const whLoc = this.gl.getUniformLocation(this.shader.program, 'wh');
		this.gl.uniformMatrix4fv(whLoc, true, wh);
		const bhLoc = this.gl.getUniformLocation(this.shader.program, 'bh');
		this.gl.uniform4fv(bhLoc, new Float32Array(this.nn.bias_h.data));
		const woLoc = this.gl.getUniformLocation(this.shader.program, 'wo');
		this.gl.uniform4fv(woLoc, new Float32Array(this.nn.weights_ho.data[0]));
		const boLoc = this.gl.getUniformLocation(this.shader.program, 'bo');
		this.gl.uniform1f(boLoc, this.nn.bias_o.data[0][0]);

		const projMatLoc = this.gl.getUniformLocation(this.shader.program, 'projection');
		this.gl.uniformMatrix4fv(projMatLoc, false, cam.projection);
		const viewMatLoc = this.gl.getUniformLocation(this.shader.program, 'view');
		this.gl.uniformMatrix4fv(viewMatLoc, false, cam.view);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		const attribLoc = this.gl.getAttribLocation(this.shader.program, 'aPosition');
		this.gl.vertexAttribPointer(attribLoc, 2, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(attribLoc);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
	}
}