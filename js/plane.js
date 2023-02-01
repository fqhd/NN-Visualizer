const RESOLUTION = 100;

class Plane {
	constructor(gl) {
		this.gl = gl;
		this.createVBO();
		this.createShader();
		this.nn = new NeuralNetwork(2, 4, 1);
		console.log(this.nn);
		this.training_data = [
			[0, 0],
			[0, 1],
			[1, 0],
			[1, 1]
		];

	}

	createVBO() {
		const vertices = [];

		const w = 1/(RESOLUTION/2); // Cell Width
		for(let i = 0; i < RESOLUTION; i++){
			for(let j = 0; j < RESOLUTION; j++){
				const x = j/RESOLUTION * 2 - 1;
				const y = i/RESOLUTION * 2 - 1;
				vertices.push(x, y);
				vertices.push(x, y+w);
				vertices.push(x+w, y+w);
				vertices.push(x, y);
				vertices.push(x+w, y+w);
				vertices.push(x+w, y);
			}
		}

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
			varying highp float height;

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
				height = y;
				
				gl_Position = projection * view * vec4(aPosition.x, y, aPosition.y, 1.0);
			}
		`;
		
		const fs = `
			varying highp float height;

			highp vec3 hsv2rgb(highp vec3 c)
			{
				highp vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
				highp vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
				return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
			}

			void main(){

				gl_FragColor = vec4(hsv2rgb(vec3(1.0 - (height * 0.7 + 0.3), 0.8, 0.9)), 1.0);
			}
		`;

		this.shader = new Shader(this.gl, vs, fs);
	}

	draw(cam) {
		this.shader.bind();

		for(let i = 0; i < 100; i++){
			const example = this.training_data[Math.floor(Math.random() * 4)];
			let output = 0;
			if(example[0] + example[1] == 1){
				output = 1;
			}
			this.nn.train(example, [output]);
		}

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
		this.gl.drawArrays(this.gl.TRIANGLES, 0, RESOLUTION*RESOLUTION*6);
	}
}