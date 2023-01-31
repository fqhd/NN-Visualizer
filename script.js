let renderer;

function run() {
    renderer = new Renderer();
	render();
}

function render() {
    renderer.update();
    renderer.render();
	requestAnimationFrame(render);
}

window.onload = run;