const GRID_WIDTH = 10;

class Renderer {
    constructor() {
        this.gl = this.initWebGL();
        this.grid = this.createGridModel();
    }

    update() {
        // Updates the camera
    }

    draw(nn) {
        // Draw grid
        // Draw Neural Network Plane
    }

    createGridModel() {
        const vertices = [];
    
        // It's going to be a quad for now
        vertices.push(-1, 0, -1);
        vertices.push(-1, 0, 1);
        vertices.push(1, 0, 1);
        vertices.push(-1, 0, -1);
        vertices.push(1, 0, 1);
        vertices.push(1, 0, -1);
    
        return Model(gl, vertices);
    }

    initWebGL() {
        canvas = document.getElementById('Display');
        return canvas.getContext('webgl');
    }
}
