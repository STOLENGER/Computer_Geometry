"use strict";
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;
// Vertex shader program
const VSHADER_SOURCE =
    '#version 100\n' +
  'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 t_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ViewMatrix * a_Position;\n' +
  '  gl_PointSize = a_PointSize;\n' +
  '  t_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
const FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 t_Color;\n' +  
  'void main() {\n' +
  '  gl_FragColor = t_Color;\n' +
  '}\n';


function main(){
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl');
  canvas.height = 600;
  canvas.width = 800;
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

  const controls = {
    view: 'Normal',
    x: -0.2,
    y: 0.1,
    z: -0.25,
    position: 'axonometry',
    matrix: 'none',
    chassis: false,
    solid: false,
    node: undefined,
    perspective_mode: 'standart',
    pers_multiply: 1,
    node_mode: undefined,
  };

  const gui = new dat.GUI();
  const Axes = gui.addFolder('AXES');
  const MainProg = gui.addFolder('Controls');
  const mode = gui.addFolder('Mode');
  Axes.open();
  MainProg.open();
  mode.open();
  Axes.add(controls, 'x', -1.0, 1.0).name("camera x").onChange(val=> {
      controls.x = val;
      requestAnimationFrame(render(controls, gl));
  }).listen();
  Axes.add(controls, 'y', -1.0, 1.0).name("camera y").onChange(val=> {
      controls.y = val;
      requestAnimationFrame(render(controls, gl));
  }).listen();
  Axes.add(controls, 'z', -1.0, 1.0).name("camera z").onChange(val=> {
      controls.z = val;
      requestAnimationFrame(render(controls, gl));
  }).listen();


  MainProg.add(controls, 'position',['left', 'right', 'top', 'bottom', 'front', 'back', 'isometry', 'axonometry','2-point']).onChange(val=>{
    controls.position = val;
    requestAnimationFrame(render(controls,gl));
  }).listen();
  MainProg.add(controls, 'matrix',['none', 'orth', 'perspective', 'frustum']).onChange(val=>{
    controls.matrix = val;
    if(val == 'perspective'){
      controls.node_mode = mode.add(controls, 'perspective_mode', ['close', 'standart','far']).name('Perspective Mode').onChange(val1=>{
        controls.perspective_mode = val1;
        requestAnimationFrame(render(controls, gl));
      }).listen();
    }
    else{
      if(controls.node_mode != undefined){
        mode.remove(controls.node_mode);
        controls.node_mode = undefined;
      }
    }
    requestAnimationFrame(render(controls, gl));
  }).listen();


  mode.add(controls, 'chassis').name("Элементы").onChange(val=>{
    controls.chassis = val;
    if(val == true){
      controls.node = mode.add(controls, 'solid').onChange(val1=>{
        controls.solid = val1;
        requestAnimationFrame(render(controls, gl));
      }).listen();
    }
    else{
      mode.remove(controls.node);
    }
    requestAnimationFrame(render(controls, gl));
  }).listen();
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);

  requestAnimationFrame(render(controls, gl));
}


function FrontPointers(gl){ // Желтый
    const n = 4;
    const verticesFront = new Float32Array([
      10.0, 0.4, 0.4, 0.4, 1.0, 1.0, 0.0,
      10.0, -0.4, 0.4, 0.4, 1.0, 1.0, 0.0,
      10.0, -0.4, -0.4, 0.4, 1.0, 1.0, 0.0,
      10.0, 0.4, -0.4, 0.4, 1.0, 1.0, 0.0]);
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Fail!');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesFront, gl.STATIC_DRAW);

    var FSIZE = verticesFront.BYTES_PER_ELEMENT;

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

  const t_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(t_Color < 0){
      console.log('Failed to initialize Color');
      return -1;
  }

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*7, 0);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*7, FSIZE);
  gl.vertexAttribPointer(t_Color, 3, gl.FLOAT, false, FSIZE*7, FSIZE*4);

  gl.enableVertexAttribArray(a_PointSize);
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(t_Color);

  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function BackPointers(gl){ // Зеленый
    const n = 4;
    const verticesBack = new Float32Array([
      10.0, 0.4, 0.4, -0.4, 0.0, 1.0, 0.0,
      10.0, -0.4, 0.4, -0.4, 0.0, 1.0, 0.0,
      10.0, -0.4, -0.4, -0.4, 0.0, 1.0, 0.0,
      10.0, 0.4, -0.4, -0.4, 0.0, 1.0, 0.0]);
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Fail!');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesBack, gl.STATIC_DRAW);

    var FSIZE = verticesBack.BYTES_PER_ELEMENT;

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

  const t_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(t_Color < 0){
      console.log('Failed to initialize Color');
      return -1;
  }

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*7, 0);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*7, FSIZE);
  gl.vertexAttribPointer(t_Color, 3, gl.FLOAT, false, FSIZE*7, FSIZE*4);

  gl.enableVertexAttribArray(a_PointSize);
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(t_Color);

  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function SidePointers(gl){
    const n = 8;
    const verticesSide = new Float32Array([
      10.0, 0.4, 0.4, 0.4, 0.0, 0.0, 1.0,
      10.0, 0.4, 0.4, -0.4, 0.0, 0.0, 1.0,
      10.0, -0.4, 0.4, 0.4, 0.0, 0.0, 1.0,
      10.0, -0.4, 0.4, -0.4, 0.0, 0.0, 1.0,
      10.0, -0.4, -0.4, 0.4, 0.0, 0.0, 1.0,
      10.0, -0.4, -0.4, -0.4, 0.0, 0.0, 1.0,
      10.0, 0.4, -0.4, 0.4, 0.0, 0.0, 1.0,
      10.0, 0.4, -0.4, -0.4, 0.0, 0.0, 1.0]);
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Fail!');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesSide, gl.STATIC_DRAW);

    var FSIZE = verticesSide.BYTES_PER_ELEMENT;

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

  const t_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(t_Color < 0){
      console.log('Failed to initialize Color');
      return -1;
  }

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*7, 0);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*7, FSIZE);
  gl.vertexAttribPointer(t_Color, 3, gl.FLOAT, false, FSIZE*7, FSIZE*4);

  gl.enableVertexAttribArray(a_PointSize);
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(t_Color);

  gl.drawArrays(gl.LINES, 0, n);
}

function render(controls, gl){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  let viewMatrix = mat4.create();
  let Mproj = mat4.create();
  let mainMatr = mat4.create();
  let top = vec3.create();


  switch(controls.matrix){
    case 'none':
      break;
    case 'orth':
      mat4.ortho(Mproj, -2.0*gl.drawingBufferWidth/gl.drawingBufferHeight, 2.0*gl.drawingBufferWidth/gl.drawingBufferHeight, -2.0, 2.0, -1.0, 7.0);
      break;
    case 'perspective':
      switch(controls.perspective_mode){
        case 'close':
          mat4.perspective(Mproj, Math.PI*0.4, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.1, 5.0);
          controls.pers_multiply = 0.8;
          break;
        case 'standart':
          mat4.perspective(Mproj, Math.PI/2, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.1, 5.0);
          controls.pers_multiply = 1;
          break;
        case 'far':
          mat4.perspective(Mproj, Math.PI*3/4, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.1, 5.0);
          controls.pers_multiply = 1.4;
          break;
      }
      break;
    case 'frustum':
      mat4.frustum(Mproj, -0.1*gl.drawingBufferWidth/gl.drawingBufferHeight, 0.1*gl.drawingBufferWidth/gl.drawingBufferHeight, -0.1, 0.1, 0.1, 3);
      break;
  }

  switch(controls.position){
    case 'top':
      top = vec3.fromValues(0.0,0.0,1.0);
      controls.x = 1.0;
      controls.y = .0;
      controls.z = 0.0;
      mat4.lookAt(viewMatrix, [controls.x*controls.pers_multiply, controls.y*controls.pers_multiply, controls.z*controls.pers_multiply], [0.0,0.0,0.0], top);
      break;
    case 'bottom':
      top = vec3.fromValues(0.0,0.0,-1.0);
      controls.x = -1.0;
      controls.y = .0;
      controls.z = 0.0;
      mat4.lookAt(viewMatrix, [controls.x*controls.pers_multiply, controls.y*controls.pers_multiply, controls.z*controls.pers_multiply], [0.0,0.0,0.0], top);
      break;
    case 'left':
      top = vec3.fromValues(0.0,1.0,0.0);
      controls.x = -1.0;
      controls.y = 0.0;
      controls.z = 0.0;
      mat4.lookAt(viewMatrix, [controls.x*controls.pers_multiply, controls.y*controls.pers_multiply, controls.z*controls.pers_multiply], [0.0,0.0,0.0], top);
      break;
    case 'right':
      top = vec3.fromValues(0.0,1.0,0.0);
      controls.x = 1.0;
      controls.y = 0.0;
      controls.z = 0.0;
      mat4.lookAt(viewMatrix, [controls.x*controls.pers_multiply, controls.y*controls.pers_multiply, controls.z*controls.pers_multiply], [0.0,0.0,0.0], top);
      break;
    case 'front':
      top = vec3.fromValues(.0,1.,0.0);
      controls.x = .0;
      controls.y = .0;
      controls.z = .4;
      mat4.lookAt(viewMatrix, [controls.x*controls.pers_multiply, controls.y*controls.pers_multiply, controls.z*controls.pers_multiply], [0.0,0.0,0.0], top);
      break;
    case 'back':
      top = vec3.fromValues(.0,1.,0.0);
      controls.x = .0;
      controls.y = 0.0;
      controls.z = -.4;
      mat4.lookAt(viewMatrix, [controls.x*controls.pers_multiply, controls.y*controls.pers_multiply, controls.z*controls.pers_multiply], [0.0,0.0,0.0], top);
      break;
    case 'isometry':
      top = vec3.fromValues(0.0,1.0,0.0);
      controls.x = 1.0;
      controls.y = 1.0;
      controls.z = 1.0;
      mat4.lookAt(viewMatrix, [controls.x*controls.pers_multiply, controls.y*controls.pers_multiply, controls.z*controls.pers_multiply], [0.0,0.0,0.0], top);
      break;
    case 'axonometry':
      top = vec3.fromValues(0.0,1.0,0.0);
      controls.x = 0.9;
      controls.y = 0.8;
      controls.z = 0.5;
      mat4.lookAt(viewMatrix, [controls.x*controls.pers_multiply, controls.y*controls.pers_multiply, controls.z*controls.pers_multiply], [0.0,0.0,0.0], top);
      break;
    case '2-point':
      top = vec3.fromValues(0.0,1.0,0.0);
      controls.x = 0.6;
      controls.y = 0.0;
      controls.z = 0.5;
      mat4.lookAt(viewMatrix, [controls.x*controls.pers_multiply, controls.y*controls.pers_multiply, controls.z*controls.pers_multiply], [0.0,0.0,0.0], top);                               
  }


  mat4.multiply(mainMatr, Mproj, viewMatrix);
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) { 
      console.log('Failed to get the storage locations of u_ViewMatrix');
      return -1;
  }

  gl.uniformMatrix4fv(u_ViewMatrix, false, mainMatr);

  if(!controls.chassis){
    FrontPointers(gl);
    BackPointers(gl);
    SidePointers(gl);
  }
  else{
    if(!controls.solid){
      const vertices = new Float32Array([
        -0.4, -0.4, -0.4,
        0.4, -0.4, -0.4,
        0.4, 0.4, -0.4,
        -0.4, 0.4, -0.4,
        -0.4, -0.4, 0.4,
        0.4, -0.4, 0.4,
        0.4, 0.4, 0.4,
        -0.4, 0.4, 0.4,
        ]);
  
    const colors = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0, 
        1.0, 1.0, 1.0,
  
        0.6, 0.4, 1.0,
        0.2, 0.2, 1.0,
        0.0, 0.6, 0.5,
        1.0, 1.0, 1.0,
        ]); 
  
    var indices = new Uint8Array([
        0, 1,
        0, 3,
        0, 4,
        1, 2,
        1, 5, 
        2, 3, 
        2, 6, 
        3, 7, 
        4, 7, 
        4, 5, 
        5, 6, 
        6, 7
    ]);
  
    const n = indices.length;
  
    const indexBuffer = gl.createBuffer();
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
  
    const t_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(t_Color < 0){
        console.log('Failed to initialize Color');
        return -1;
    }
    var buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
  
    buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(t_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(t_Color);
  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.drawElements(gl.LINES, 24, gl.UNSIGNED_BYTE, 0);
    }
    else{
      var IndVertices = new Float32Array([
        0.4,0.4,0.4,
        -0.4,0.4,0.4,
        -0.4,0.4,-0.4,
        0.4,0.4,-0.4,
        0.4,-0.4,0.4,
        -0.4,-0.4,0.4,
        -0.4,-0.4,-0.4,
        0.4,-0.4,-0.4,
        ]);	


      var IndSizes = new Float32Array([
       10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0
        ]);			

      var IndColors = new Float32Array([
        0.4, 1.0, 0.5, 1,
        1.0, 0.6, 0.0, 1,
        0.8, 0.0, 0.6, 1,
        0.0, 0.6, 1.0, 1,
        1.0, 1.0, 0.4, 1,
        0.2, 0.6, 0.0, 1,
        0.7, 0.1, 0.8, 1,
        1.0, 0.4, 0.0, 1,
        ]);	
      const n = IndSizes.length;
      const PSize = IndVertices.BYTES_PER_ELEMENT
      const PropBuffer = gl.createBuffer();
      if (!PropBuffer) {
        console.log('Failed to create a buffer object for properties');
        return -1;  
      }
       
      gl.bindBuffer(gl.ARRAY_BUFFER, PropBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, (IndVertices.length + IndSizes.length + IndColors.length)*PSize, gl.STATIC_DRAW);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, IndVertices);
      gl.bufferSubData(gl.ARRAY_BUFFER, (IndVertices.length)*PSize, IndSizes);
      gl.bufferSubData(gl.ARRAY_BUFFER, (IndVertices.length + IndSizes.length)*PSize, IndColors);
      var Indexes = new Uint16Array([
        0,2,1, 0,3,2, // Top
        0,1,5, 0,5,4, // Front
        0,4,7, 0,7,3, // Right
        1,2,6, 1,6,5, // Left
        2,3,7, 2,7,6, // Back
        4,5,6, 4,6,7, // Bottom
      ]);
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

      const a_Size = gl.getAttribLocation(gl.program, 'a_PointSize');
      if (a_Size < 0) {
        console.log('Failed to get the storage location of a_Size');
        return -1;
      }
  
      const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
      if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
      }
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      gl.vertexAttribPointer(a_Size, 1, gl.FLOAT, false, 0, (IndVertices.length)*PSize);
      gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, (IndVertices.length + IndSizes.length)*PSize);

      gl.enableVertexAttribArray(a_Position);
      gl.enableVertexAttribArray(a_Size);
      gl.enableVertexAttribArray(a_Color);

      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
  }
}
