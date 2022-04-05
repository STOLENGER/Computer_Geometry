// 05.js

"use strict";

// Vertex shader program
const VSHADER_SOURCE =
    '#version 100\n' +
    'precision highp float;\n' +
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 the_Color;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = a_PointSize;\n' +
    'the_Color = a_Color;\n' +
    '}\n';

// Fragment shader program
const FSHADER_SOURCE =
    'precision highp float;\n' +
    'varying vec4 the_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = the_Color;\n' +
    // 'gl_FragColor = vec4(gl_FragCoord.x/400.0, 0.0, gl_FragCoord.y/400.0, 1.0);\n' +
    '}\n';

function main() {
    // Retrieve <canvas> element
    const canvas = document.getElementById('webgl');
//   canvas.height = window.innerHeight;
//   canvas.width = window.innerWidth;
    // Get the rendering context for WebGL
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

   const n = PointsDatas(gl); // 5.1
    if (n < 0) {
        console.log("Failed");
        return;
    }

    // const n = Square(gl); // 5.2
    // if(n < 0)
    // {
    //   console.log('Cannot create this Figure');
    //   return;
    // }
    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function PointsDatas(gl) {
    const n = 3;

    const MainData = new Float32Array([-0.2, 0.1, 14.0, 1.0, 1.0, 0.0, 1.0, 0.3, 0.5, 10.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 24.0, 1.0, 0.0, 1.0, 1.0]); //first
    //const MainData = new Float32Array([-0.1, 0.0, 1.0, 0.0, 0.0, 1.0, 25.0, 0.1, 0.3, 0.0, 1.0, 0.0, 1.0, 15.0, 0.7, -0.3, 0.0, 0.0, 1.0, 1.0, 30.0]); //second

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize');
        return -1;
    }

    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to manage a_Color');
        return -1;
    }

    const vertexSizeBuffer = gl.createBuffer();
    if (!vertexSizeBuffer) {
        console.log("Cannot set a new Buffer of sizes and coordinates");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, MainData, gl.STATIC_DRAW);

    const FSIZE = MainData.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 7, 0); // 1 способ
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 7, FSIZE * 2); // first
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 3); // first
    // gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*7, 0); //second
    // gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*7, FSIZE*6); //second
    // gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE*7, FSIZE*2); //second

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_PointSize);
    gl.enableVertexAttribArray(a_Color);

    return n;
}

function Square(gl) {
    const n = 4;

    const pos = new Float32Array([-1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0]);

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    const vertexSizeBuffer = gl.createBuffer();
    if (!vertexSizeBuffer) {
        console.log("Cannot set a new Buffer of sizes and coordinates");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}