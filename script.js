let gl;

function init() {
    initWebGL();
}

function initWebGL() {
    canvas = document.getElementById('Display');
    gl = canvas.getContext('webgl');
}

function render() {

}

window.onload = () => {
    init();
    render();
}