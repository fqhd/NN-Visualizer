let gl;

const GRID_WIDTH = 10;

function run() {
    initWebGL();

    // Create Grid VAO

    // Create Plane VAO

    render();
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