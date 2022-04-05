// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Normal;\n' +
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_MvMatrix;\n' +
    'uniform vec3 u_LightColor;\n' +
    'uniform vec3 u_LightPosition;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * u_ModelMatrix * a_Position ;\n' +
    '  vec3 normal = vec3(normalize(a_Normal * u_ModelMatrix));\n' +
    '  vec3 pos = vec3(u_MvMatrix * u_ModelMatrix * a_Position);\n' +
    '  vec3 LightDirection = normalize(u_LightPosition - vec3(pos));\n' +
    '  vec3 ambient = vec3(0.2, 0.2, 0.2);\n' +
    '  float nDotL = max(dot(LightDirection, normal),0.0);\n' +
    '  vec3 diffuse = u_LightColor*a_Color.rgb*nDotL;\n' +
    '  v_Color = vec4(diffuse + ambient, 1);\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

var VSHADER_COORDS =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * u_ModelMatrix * a_Position ;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';
var FSHADER_COORDS =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

function main() {

    controls = {
        x: 2,
        y: 2,
        z: 1,
    };

    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    DrawCoords(gl, controls);

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Set the vertex coordinates, the color and the normal
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    // Set the clear color and enable the depth test


    // Get the storage locations of uniform variables and so on
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
        console.log('Failed to get the storage location');
        return;
    }

    var u_MvMatrix = gl.getUniformLocation(gl.program, 'u_MvMatrix');
    if (!u_MvMatrix) {
        console.log('Failed to get the storage location');
        return;
    }

    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    if (!u_LightColor) {
        console.log('Failed to get the storage location');
        return;
    }

    var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    if (!u_LightPosition) {
        console.log('Failed to get the storage location');
        return;
    }

    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (u_ModelMatrix < 0) {
        console.log('Failed to initialize Color');
        return -1;
    }

    let ModelMatrix = mat4.create();
    gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);

    // Calculate the view projection matrix
    var mvpMatrix = mat4.create();
    mat4.perspective(mvpMatrix, Math.PI / 2, canvas.width / canvas.height, 0.1, 100);
    let view = mat4.create();
    mat4.lookAt(view, [controls.x, controls.y, controls.z], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    gl.uniformMatrix4fv(u_MvMatrix, false, view);
    mat4.multiply(mvpMatrix, mvpMatrix, view);
    // Pass the model view projection matrix to the variable u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);
    gl.uniform3f(u_LightColor, 1., 1., 1.);
    let lightDir = vec3.fromValues(.5, .5, .5);
    vec3.normalize(lightDir, lightDir);
    gl.uniform3fv(u_LightPosition, lightDir);

    // Clear color and depth buffe

    let gui = new dat.GUI();
    gui.add(controls, 'x', -3, 3, 0.1).onChange(val => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        controls.x = val;
        //DrawCoords(gl, controls);
        var mvpMatrix = mat4.create();
        mat4.perspective(mvpMatrix, Math.PI / 2, canvas.width / canvas.height, 0.1, 100);
        let view = mat4.create();
        mat4.lookAt(view, [controls.x, controls.y, controls.z], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
        mat4.multiply(mvpMatrix, mvpMatrix, view);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }).listen();
    gui.add(controls, 'y', -3, 3, 0.1).onChange(val => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        controls.y = val;
        //DrawCoords(gl, controls);
        var mvpMatrix = mat4.create();
        mat4.perspective(mvpMatrix, Math.PI / 2, canvas.width / canvas.height, 0.1, 100);
        let view = mat4.create();
        mat4.lookAt(view, [controls.x, controls.y, controls.z], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
        mat4.multiply(mvpMatrix, mvpMatrix, view);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }).listen();
    gui.add(controls, 'z', -3, 3, 0.1).onChange(val => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        controls.z = val;
        //DrawCoords(gl, controls);
        var mvpMatrix = mat4.create();
        mat4.perspective(mvpMatrix, Math.PI / 2, canvas.width / canvas.height, 0.1, 100);
        let view = mat4.create();
        mat4.lookAt(view, [controls.x, controls.y, controls.z], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
        mat4.multiply(mvpMatrix, mvpMatrix, view);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }).listen();

    const button = document.getElementById('butt1');
    button.addEventListener('click', function () {
        anima_1(gl, n, u_ModelMatrix);
        // MyAnima_1(gl, n, u_ModelMatrix);

    });
    const button2 = document.getElementById('butt2');
    button2.addEventListener('click', function () {
        anima_2(gl, n, u_ModelMatrix);
        // MyAnima_2(gl, n, u_ModelMatrix);

    });
    const button3 = document.getElementById('butt3');
    button3.addEventListener('click', function () {
        anima_3(gl, n, u_ModelMatrix);
        // MyAnima_3(gl, n, u_ModelMatrix);

    });
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);   // Draw
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([   // Coordinates
        0.0, 0.0, 0.0, //0
        1.0, 0.0, 0.0, //1
        0.0, 1.0, 0.0, //2
        0.0, 0.0, 1.0, //3
    ]);


    var colors = new Float32Array([    // Colors
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0,
        0.4, 0.0, 0.7, 0.4, 0.0, 0.7, 0.4, 0.0, 0.7,
        1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0,

    ]);


    var normals = new Float32Array([    // Normal

        0, 0, -1, 0, 0, -1, 0, 0, -1,
        -1, 0, 0, -1, 0, 0, -1, 0, 0,
        0, -1, 0, 0, -1, 0, 0, -1, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1,

    ]);


    // Indices of the vertices
    var indices = new Uint8Array([
        0, 2, 1, //Back
        0, 3, 2, //LEFT
        0, 1, 3, //Down
        1, 2, 3, //Front
    ]);


    // Write the vertex property to buffers (coordinates, colors and normals)
    if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

    // Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, attribute, data, num, type) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return true;
}

function anima_1(gl, n, u_ModelMatrix) {
    let ANGLE_STEP = 1.0;
    let g_last = Date.now();
    let angle = 0;
    let ModelMatrix = mat4.create();
    let ModelMatrix_rotate = mat4.create();
    let check = false;

    requestAnimationFrame(function animate() {
        let elapsed = Math.abs(Date.now() - g_last);
        g_last = Date.now();
        let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
        angle = newAngle;
        if (angle >= 1.0) {
            check = true;
        }
        mat4.fromTranslation(ModelMatrix, [-newAngle, 0.0, 0.0]);
        console.log(ModelMatrix);
        gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);
        if (!check) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
            requestAnimationFrame(animate);
        }
    })


}

function anima_2(gl, n, u_ModelMatrix) {

    let ANGLE_STEP = 1;
    let g_last = Date.now();
    let angle = 0;
    let ModelMatrix = mat4.create();
    let ModelMatrix_rotate = mat4.create();
    let check = false;
    //ModelMatrix.clone(u_ModelMatrix);

    requestAnimationFrame(function animate_2() {
        let elapsed = Date.now() - g_last;
        g_last = Date.now();
        let newAngle = angle + (ANGLE_STEP * elapsed) / (1080.0);
        angle = newAngle;
        if (angle >= Math.PI / 4) {
            check = true;
        }
        mat4.fromTranslation(ModelMatrix, [-1.0, 0.0, 0.0]);
        mat4.fromRotation(ModelMatrix_rotate, newAngle, [-1.0, 1.0, 0.0]);
        mat4.multiply(ModelMatrix, ModelMatrix_rotate, ModelMatrix);


        gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);
        if (!check) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
            requestAnimationFrame(animate_2);
        }

    })


}

function anima_3(gl, n, u_ModelMatrix) {

    let ANGLE_STEP = 0.25;
    let g_last = Date.now();
    let angle = 0;
    let ModelMatrix = mat4.create();
    let ModelMatrix_rotate = mat4.create();
    let check = false;

    requestAnimationFrame(function animate() {
        let elapsed = Math.abs(Date.now() - g_last);
        g_last = Date.now();
        let newAngle = angle + (ANGLE_STEP * elapsed) / 100.0;
        angle = newAngle;
        if (angle >= 1.0) {
            check = true;
        }

        mat4.fromTranslation(ModelMatrix, [-1, 0.0, 0.0]);
        mat4.fromRotation(ModelMatrix_rotate, Math.PI / 4, [-1.0, 1.0, 0.0]);
        mat4.multiply(ModelMatrix, ModelMatrix_rotate, ModelMatrix);
        mat4.fromScaling(ModelMatrix_rotate, [2.0, 2.0, 2.0]);
        mat4.multiply(ModelMatrix, ModelMatrix_rotate, ModelMatrix);
        mat4.fromTranslation(ModelMatrix_rotate, [newAngle, 0.0, 0.0]);
        mat4.multiply(ModelMatrix, ModelMatrix_rotate, ModelMatrix);


        gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);
        if (!check) {

            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
            requestAnimationFrame(animate);
        }
        // mat4.fromScaling(ModelMatrix_rotate, [2.0, 2.0, 2.0]);
        // mat4.multiply(ModelMatrix, ModelMatrix_rotate, ModelMatrix);
        // mat4.fromTranslation(ModelMatrix_rotate, [1.0, -1.0, 0.0]);
        // mat4.multiply(ModelMatrix, ModelMatrix_rotate, ModelMatrix);

    })


}

function MyAnima_1(gl, n, u_ModelMatrix) {
    let ANGLE_STEP = 1.0;
    let g_last = Date.now();
    let angle = 0;
    let ModelMatrix = M4.create();
    let ModelMatrix_1 = mat4.create();
    let ModelMatrix_translation = mat4.create();
    let check = false;
    requestAnimationFrame(function animate() {
        let elapsed = (Date.now() - g_last);
        g_last = Date.now();
        let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
        angle = newAngle;
        if (angle >= 1.0) {
            check = true;
        }
        ModelMatrix_translation = M4.translation(-newAngle, 0, 0);
        gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix_translation);
        if (!check) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
            requestAnimationFrame(animate);
        }
    })
}


function MyAnima_2(gl, n, u_ModelMatrix) {

    let ANGLE_STEP = 1;
    let g_last = Date.now();
    let angle = 0;
    let ModelMatrix = M4.create();
    let ModelMatrix_rotate = M4.create();
    let check = false;
    //ModelMatrix.clone(u_ModelMatrix);

    requestAnimationFrame(function animate_2() {
        let elapsed = Date.now() - g_last;
        g_last = Date.now();
        let newAngle = angle + (ANGLE_STEP * elapsed) / (900.0);
        angle = newAngle;
        if (angle >= Math.PI / 4) {
            check = true;
        }
        ModelMatrix = M4.translation(-1, 0, 0);
        ModelMatrix_rotate = M4.rotation(-1, 1, 0, newAngle);
        ModelMatrix = M4.multiply(ModelMatrix, ModelMatrix_rotate);
        // mat4.fromTranslation(ModelMatrix, [-1.0, 0.0, 0.0]);
        // mat4.fromRotation(ModelMatrix_rotate, newAngle, [-1.0, 1.0, 0.0]);
        // mat4.multiply(ModelMatrix, ModelMatrix_rotate, ModelMatrix);


        gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);
        if (!check) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
            requestAnimationFrame(animate_2);
        }

    })


}

function MyAnima_3(gl, n, u_ModelMatrix) {

    let ANGLE_STEP = 1;
    let g_last = Date.now();
    let angle = 0;
    let ModelMatrix = M4.create();
    let ModelMatrix_rotate = M4.create();
    let check = false;

    requestAnimationFrame(function animate_2() {
        let elapsed = Date.now() - g_last;
        g_last = Date.now();
        let newAngle = angle + (ANGLE_STEP * elapsed) / (900.0);
        angle = newAngle;
        if (angle >= 1) {
            check = true;
        }
        ModelMatrix = M4.translation(-1, 0, 0);
        ModelMatrix_rotate = M4.rotation(-1, 1, 0, Math.PI / 4);
        ModelMatrix = M4.multiply(ModelMatrix, ModelMatrix_rotate);
        ModelMatrix_rotate = M4.scaling(2, 2, 2);
        ModelMatrix = M4.multiply(ModelMatrix_rotate, ModelMatrix);
        ModelMatrix_rotate = M4.translation(newAngle, 0, 0);
        ModelMatrix = M4.multiply(ModelMatrix_rotate, ModelMatrix);

        gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);
        if (!check) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
            requestAnimationFrame(animate_2);
        }

    })


}


var M4 = {


    create: function () {
        let tmp = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
        return tmp;
    },

    translation: function (tx, ty, tz) {
        let tmp = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1,
        ]);
        return tmp;
    },

    multiply: function (a, b) {
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];

        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,//11
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,//12
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,//13
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,//14

            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,//21
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,//22
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,//23
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,//24

            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,//31
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,//32
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,//33
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,//34

            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,//41
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,//42
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,//43
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,//44
        ];
    },

    scaling: function (sx, sy, sz) {

        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1,
        ];
    },

    rotationY: function (Model, theta) {
        var Matrix_tmp = [
            Math.cos(theta), 0, Math.sin(theta), 0,
            0, 1, 0, 0,
            -Math.sin(theta), 0, Math.cos(theta), 0,
            0, 0, 0, 1]
        return M4.multiply(Matrix_tmp, Model);
    },

     rotation: function (ux, uy, uz, theta) {
        let rx = ux / Math.sqrt(ux * ux + uy * uy + uz * uz);
        let ry = uy / Math.sqrt(ux * ux + uy * uy + uz * uz);
        let rz = uz / Math.sqrt(ux * ux + uy * uy + uz * uz);
        return [Math.cos(theta)+rx*rx*(1.0 - Math.cos(theta)), ry*rx*(1.0-Math.cos(theta))+rz*Math.sin(theta),rx*rz*(1.0 - Math.cos(theta)) - ry * Math.sin(theta), 0.0,
            rx*ry*(1.0 - Math.cos(theta))-rz*Math.sin(theta), Math.cos(theta)+ry*ry*(1.0-Math.cos(theta)),ry*rz*(1.0 - Math.cos(theta)) + rx * Math.sin(theta), 0.0,
            rx*rz*(1.0 - Math.cos(theta))+ry*Math.sin(theta), ry*rz*(1.0 - Math.cos(theta))-rx*Math.sin(theta),Math.cos(theta)+ rz * rz * (1.0 - Math.cos(theta)), 0.0,
            0.0, 0.0, 0.0, 1.0,
        ];
    },
}


function DrawCoords(gl, controls) {
    if (!initShaders(gl, VSHADER_COORDS, FSHADER_COORDS)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    let verts = new Float32Array([
        2.0, 0.0, 0.0,
        0.0, 2.0, 0, 0,
        0.0, 0.0, 2.0,
        0.0, 0.0, 0.0,
    ]);

    let color = new Float32Array([
        1.0, .0, .0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
    ]);

    let indices = new Uint8Array([
        3, 0,
        3, 1,
        3, 2,
    ]);

    if (!initArrayBuffer(gl, 'a_Position', verts, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Color', color, 3, gl.FLOAT)) return -1;
    var indexBuffer = gl.createBuffer();

    if (!indexBuffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
        console.log('Failed to get the storage location');
        return;
    }

    var mvpMatrix = mat4.create();
    mat4.perspective(mvpMatrix, Math.PI / 2, window.innerWidth / window.innerHeight, 0.1, 100);
    let view = mat4.create();
    mat4.lookAt(view, [controls.x, controls.y, controls.z], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    mat4.multiply(mvpMatrix, mvpMatrix, view);
    // Pass the model view projection matrix to the variable u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix)

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location');
        return;
    }

    let projMatr = mat4.create();
    gl.uniformMatrix4fv(u_ModelMatrix, false, projMatr);

    gl.drawElements(gl.POINTS, 2, gl.UNSIGNED_BYTE, 2);
}
