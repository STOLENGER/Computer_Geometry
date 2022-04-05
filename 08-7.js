"use strict";
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec3 a_Normal;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform vec3 u_LightColor;\n' +
    'uniform vec3 u_LightPosition;\n' +
    'uniform mat3 u_NormalMatrix;\n' +
    'uniform vec3 u_Kd;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_Position = u_MvpMatrix*a_Position;\n' +
    '   vec3 normal = normalize(u_NormalMatrix*a_Normal);\n' +
    '   vec4 pos = u_ModelMatrix * a_Position;\n' +
    '   vec3 LightDirection = normalize(u_LightPosition - vec3(pos));\n' +
    '   float nDotL = max(dot(LightDirection, normal),0.0);\n' +
    '   vec3 diffuse = u_LightColor*u_Kd*nDotL;\n' +
    '	v_Color = vec4(diffuse, 1.0);\n' +
    '}\n';

const FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' +
    '}\n';
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

function main() {
    const canvas = document.getElementById('webgl');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get WebGl');
        return -1;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return -1;
    }
    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
        console.log('Failed to get Matrix');
        return -1;
    }
    let u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    if (!u_LightColor) {
        console.log('Failed to get Light color');
        return -1;
    }
    let u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    if (!u_LightPosition) {
        console.log('Failed to get Light direction');
        return -1;
    }
    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    let u_Kd = gl.getUniformLocation(gl.program, 'u_Kd');

    let controls = {
        x: 2.8,
        y: 2.6,
        z: 2.9,
    };

    const GUI = new dat.GUI();
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_Kd, 0.7516, 0.6065, 0.2265);
    gl.uniform3f(u_LightPosition, 3.0, 3.0, 3.0);
    let proj = mat4.create();
    mat4.perspective(proj, Math.PI / 2, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 50);
    let view = mat4.create();
    mat4.lookAt(view, [2.8, 2.6, 2.9], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    let mainMatr = mat4.create();
    mat4.multiply(mainMatr, proj, view);
    let modelMatrix = mat4.create();
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
    let NormalMatrix = mat3.create();
    mat3.normalFromMat4(NormalMatrix, modelMatrix);
    gl.uniformMatrix3fv(u_NormalMatrix, false, NormalMatrix);
    console.log(mainMatr);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mainMatr);
    const n = InitCube(gl);
    console.log(n);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

    GUI.add(controls, 'x', -3.0, 3.0).onChange(val => {
        controls.x = val;
        control(controls, u_MvpMatrix, gl, n, proj);
    }).listen();
    GUI.add(controls, 'y', -3.0, 3.0).onChange(val => {
        controls.y = val;
        control(controls, u_MvpMatrix, gl, n, proj);
    }).listen();
    GUI.add(controls, 'z', -3.0, 3.0).onChange(val => {
        controls.z = val;
        control(controls, u_MvpMatrix, gl, n, proj);
    }).listen();
}

function InitCube(gl) {
    var IndVertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
    ]);
    var Indexes = new Uint16Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);

    let Normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
    ]);
    const n = Indexes.length;
    const PSize = IndVertices.BYTES_PER_ELEMENT;
    const PropBuffer = gl.createBuffer();
    if (!PropBuffer) {
        console.log('Failed to create a buffer object for properties');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, PropBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, (IndVertices.length + Normals.length) * PSize, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, IndVertices);
    //gl.bufferSubData(gl.ARRAY_BUFFER, (IndVertices.length)*PSize, IndColors);
    gl.bufferSubData(gl.ARRAY_BUFFER, (IndVertices.length) * PSize, Normals);

    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create a buffer object for properties');
        return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Indexes, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    //   if (a_Color < 0) {
    //     console.log('Failed to get the storage location of a_Position');
    //     return -1;
    // }
    const a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    //gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, (IndVertices.length)*PSize);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, (IndVertices.length) * PSize);

    gl.enableVertexAttribArray(a_Position);
    //gl.enableVertexAttribArray(a_Color);
    gl.enableVertexAttribArray(a_Normal);

    return n;
}

function control(controls, u_MvpMatrix, gl, n, proj) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let view = mat4.create();
    mat4.lookAt(view, [controls.x, controls.y, controls.z], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    let mainMatr = mat4.create();
    mat4.multiply(mainMatr, proj, view);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mainMatr);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}