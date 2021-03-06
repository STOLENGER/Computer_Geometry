"use strict";
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec3 a_Normal;\n' +
    'uniform mat3 u_NormalMatrix;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_MvMatrix;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec3 v_Normal;\n' +
    'void main() {\n' +
    '   gl_Position = u_MvpMatrix*a_Position;\n' +
    '   v_Normal = normalize(u_NormalMatrix*a_Normal);\n' +
    '   v_Position = vec3(u_MvMatrix*a_Position);\n' +
    '}\n';

const FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec3 u_LightColor;\n' +
    'uniform vec3 u_LightPosition;\n' +
    'uniform vec3 u_AmbientLight;\n' +
    'uniform vec3 u_Ka;\n' +
    'uniform vec3 u_Kd;\n' +
    'uniform vec3 u_Ks;\n' +
    'uniform float u_m;\n' +
    'uniform vec3 u_ViewPosition;\n' +
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'vec3 phongModel(const in vec3 Position, const in vec3 Normal){\n' +
    '   vec3 normal = normalize(Normal);\n' +
    '   vec3 LightDirection = normalize(u_LightPosition - Position);\n' +
    '   float nDotL = max(dot(LightDirection, normal),0.0);\n' +
    '   vec3 ambient = u_AmbientLight*u_Ka;\n' +
    '   vec3 diffuse = u_LightColor*u_Kd*nDotL;\n' +
    '	vec3 ref = reflect(-LightDirection, normal);\n' +
    '   vec3 tmp = normalize(-Position);\n' +
    '	float spec = pow(max(dot(tmp, ref), 0.0), u_m);\n' +
    '	if (dot(LightDirection, normal) <= 0.0 || dot(tmp, ref) <= 0.0)\n' +
    '		spec = 0.0;\n' +
    '	vec3 specular = u_Ks * spec * u_LightColor;\n' +
    '   return (diffuse + ambient + specular);}\n' +
    'void main() {\n' +
    '	gl_FragColor = vec4(phongModel(v_Position, v_Normal), 1);\n' +
    '}\n';
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

function main() {
    const canvas = document.getElementById('webgl');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
    let u_MvMatrix = gl.getUniformLocation(gl.program, 'u_MvMatrix');
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
    let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_NormalMatrix) {
        console.log('Failed to get Normal Matrix');
        return -1;
    }
    let u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    if (!u_AmbientLight) {
        console.log('Failed to get Ambient Light');
        return -1;
    }
    //111
    // let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    // if (!u_ModelMatrix) {
    //     console.log('Nope');
    //     return -1;
    // }
    let u_ViewPosition = gl.getUniformLocation(gl.program, 'u_ViewPosition');
    //
    let u_Ka = gl.getUniformLocation(gl.program, 'u_Ka');
    let u_Kd = gl.getUniformLocation(gl.program, 'u_Kd');
    let u_Ks = gl.getUniformLocation(gl.program, 'u_Ks');
    let u_m = gl.getUniformLocation(gl.program, 'u_m');

    let controls = {
        x: 0.8,
        y: 0.6,
        z: 0.9,
    };

    const GUI = new dat.GUI();
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
    gl.uniform3f(u_Ka, 0.2473, 0.1995, 0.0745);
    gl.uniform3f(u_Kd, 0.7516, 0.6065, 0.2265);
    gl.uniform3f(u_Ks, 0.6283, 0.5558, 0.3661);
    gl.uniform1f(u_m, 51);
    //1111
    gl.uniform3f(u_ViewPosition, controls.x, controls.y, controls.z);
    //
    let LightPos = vec3.fromValues(3.0, 3.0, 3.0);
    gl.uniform3fv(u_LightPosition, LightPos);
    let proj = mat4.create();
    mat4.perspective(proj, Math.PI / 2, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 50);
    let view = mat4.create();
    mat4.lookAt(view, [0.8, 0.6, 0.9], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    gl.uniformMatrix4fv(u_MvMatrix, false, view);
    let normalMatrix = mat3.create();
    let mainMatr = mat4.create();
    mat4.multiply(mainMatr, proj, view);
    console.log(mainMatr);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mainMatr);
    // let model = mat4.create();
    // gl.uniformMatrix4fv(u_ModelMatrix, false, model);
    mat3.normalFromMat4(normalMatrix, view);
    gl.uniformMatrix3fv(u_NormalMatrix, false, normalMatrix,);
    const n = InitCube(gl);
    console.log(n);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

    GUI.add(controls, 'x', -3.0, 3.0).onChange(val => {
        controls.x = val;
        control(controls, u_MvpMatrix, gl, n, proj, u_NormalMatrix, u_MvMatrix);
        // controlNew(controls, u_MvpMatrix, gl, n, proj, u_ViewPosition);
    }).listen();
    GUI.add(controls, 'y', -3.0, 3.0).onChange(val => {
        controls.y = val;
        control(controls, u_MvpMatrix, gl, n, proj, u_NormalMatrix);
        // controlNew(controls, u_MvpMatrix, gl, n, proj, u_ViewPosition);
    }).listen();
    GUI.add(controls, 'z', -3.0, 3.0).onChange(val => {
        controls.z = val;
        control(controls, u_MvpMatrix, gl, n, proj, u_NormalMatrix);
        // controlNew(controls, u_MvpMatrix, gl, n, proj, u_ViewPosition);
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
    // var IndColors = new Float32Array([
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    //     0.0, 1.0, 0.0, 1,
    // ]);
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

function control(controls, u_MvpMatrix, gl, n, proj, u_NormalMatrix, u_MvMatrix) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let view = mat4.create();
    mat4.lookAt(view, [controls.x, controls.y, controls.z], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    gl.uniformMatrix4fv(u_MvMatrix, false, view);
    let mainMatr = mat4.create();
    mat4.multiply(mainMatr, proj, view);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mainMatr);
    let normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, view);
    gl.uniformMatrix3fv(u_NormalMatrix, false, normalMatrix);
    //gl.uniform3f(View, controls.x, controls.y, controls.z);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}

function controlNew(controls, u_MvpMatrix, gl, n, proj, View) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let view = mat4.create();
    mat4.lookAt(view, [controls.x, controls.y, controls.z], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    let mainMatr = mat4.create();
    mat4.multiply(mainMatr, proj, view);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mainMatr);
    //
    gl.uniform3f(View, controls.x, controls.y, controls.z);
    //
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}
