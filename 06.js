// 06.js

"use strict";
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;
// Vertex shader program
const VSHADER_SOURCE =
    '#version 100\n' +
  'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = a_PointSize;\n' +
  '}\n';

// Fragment shader program
const FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 t_Color;\n' +  
  'void main() {\n' +
  '  gl_FragColor = t_Color;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
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

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  let animat = {
    start: false,
    animates: false,
  };
  CreateTriangle(gl, true);
  const button = document.getElementById('butt1');
  button.addEventListener('click', function(){
    animat.start = true;
    anima(gl, animat)});
  const button2 = document.getElementById('butt2');
  button2.addEventListener('click',function(){
    if(animat.start == true){
      animat.animates = true;
      animat.start = false;
    }
    setTimeout(()=>
    {if(animat.animates == true){
      CreateTriangle(gl, true);
      animat.animates = false;
    }
    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(u_ModelMatrix < 0){
    console.log('Failed to initialize Color');
    return -1;
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    let ModelMatrix = mat4.create();
    gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);    // Creates a new identity mat4
    gl.drawArrays(gl.LINE_LOOP, 0, 3);
    mat4.fromTranslation(ModelMatrix, [0.3, 0.2, 0.0]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);
    gl.drawArrays(gl.LINE_LOOP, 0, 3);}
    , 500);
  });
  const button3 = document.getElementById('butt3');
  button3.addEventListener('click',function(){
    if(animat.start == true){
      animat.animates = true;
      animat.start = false;
    }
    setTimeout(()=>{
      if(animat.animates == true){
        CreateTriangle(gl, true);
        animat.animates = false;
      }
      const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
      if(u_ModelMatrix < 0){
      console.log('Failed to initialize Color');
      return -1;
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      let ModelMatrix = mat4.create();
      gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);    
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
      mat4.fromZRotation(ModelMatrix, 1);
      gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
    },500);
  });
  const button4 = document.getElementById('butt4');
  button4.addEventListener('click',function(){
    if(animat.start == true){
      animat.animates = true;
      animat.start = false;
    }
    setTimeout(()=>{
      if(animat.animates == true){
        CreateTriangle(gl, true);
        animat.animates = false;
      }
      const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
      if(u_ModelMatrix < 0){
      console.log('Failed to initialize Color');
      return -1;
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      let ModelMatrix = mat4.create();    // Creates a new identity mat4
      gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);    
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
      mat4.fromScaling(ModelMatrix, [0.5, 0.5, 0.0]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);    
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
    },500);
  });
  const button5 = document.getElementById('butt5');
  button5.addEventListener('click',function(){
    if(animat.start == true){
      animat.animates = true;
      animat.start = false;
    }
    setTimeout(()=>{
      if(animat.animates == true){
        CreateTriangle(gl, true);
        animat.animates = false;
      }
      const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
      if(u_ModelMatrix < 0){
      console.log('Failed to initialize Color');
      return -1;
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      let ModelMatrix = mat4.create();    // Creates a new identity mat4
      gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);    
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
      mat4.fromZRotation(ModelMatrix, 1);
      gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);    
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
      mat4.fromTranslation(ModelMatrix, [-0.3, 0.0, 0.0]);
      let Mdx = mat4.create(); 
      mat4.rotateZ(Mdx,ModelMatrix, 1); 
      gl.uniformMatrix4fv(u_ModelMatrix, false, Mdx);    
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
    },500);
  });
  const button6 = document.getElementById('butt6');
  button6.addEventListener('click',function(){
    if(animat.start == true){
      animat.animates = true;
      animat.start = false;
    }
    setTimeout(()=>{
      if(animat.animates == true){
        CreateTriangle(gl, true);
        animat.animates = false;
      }
      const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
      if(u_ModelMatrix < 0){
      console.log('Failed to initialize Color');
      return -1;
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      let ModelMatrix = mat4.create();   
      gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);    
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
      mat4.fromTranslation(ModelMatrix, [-0.3, 0.0, 0.0]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);    
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
      mat4.fromZRotation(ModelMatrix, 1);
      let Mdx = mat4.create();
      mat4.translate(Mdx,ModelMatrix, [-0.3, 0.0, 0.0]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, Mdx);    
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
    },500);
  });
}

function CreateTriangle(gl, original)
{
    const n = 3; // The number of vertices

  const verticesSizes = new Float32Array([20.0, -0.5, 0.5, 20.0, -0.5, -0.5, 20.0, 0.5, 0.5]);
    // Creates a new identity mat4  

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

  const t_Color = gl.getUniformLocation(gl.program, 't_Color');
  if(t_Color < 0){
      console.log('Failed to initialize Color');
      return -1;
  }
  const vertexSizeBuffer = gl.createBuffer();
  if(!vertexSizeBuffer)
  {
    console.log("Cannot set a new Buffer of sizes and coordinates");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

  const FSIZE = verticesSizes.BYTES_PER_ELEMENT;

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*3, 0);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*3, FSIZE);

  gl.enableVertexAttribArray(a_PointSize);
  gl.enableVertexAttribArray(a_Position);

  if(original){
    gl.uniform4f(t_Color, 1.0, 0.0, 0.0, 1.0);
  }
  else{
    gl.uniform4f(t_Color, .3, .5, .8, 1.0);
  }
  return n;
}

function anima(gl, animat)
{
  alert('button Clicked');
  const n = 3; // The number of vertices

  const verticesSizes = new Float32Array([10.0, -0.1, 0.1, 10.0, -0.1, -0.1, 10.0, 0.1, 0.1]);
   // Creates a new identity mat4

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

  const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(u_ModelMatrix < 0){
    console.log('Failed to initialize Color');
    return -1;
}

  const t_Color = gl.getUniformLocation(gl.program, 't_Color');
  if(t_Color < 0){
      console.log('Failed to initialize Color');
      return -1;
  }
  const vertexSizeBuffer = gl.createBuffer();
  if(!vertexSizeBuffer)
  {
    console.log("Cannot set a new Buffer of sizes and coordinates");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

  const FSIZE = verticesSizes.BYTES_PER_ELEMENT;
  let ModelMatrix = mat4.create(); 

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*3, 0);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*3, FSIZE);

  gl.enableVertexAttribArray(a_PointSize);
  gl.enableVertexAttribArray(a_Position);

  gl.uniform4f(t_Color, 0.4, 0.8, 1.0, 1.0);
  // gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);
  // gl.drawArrays(gl.LINE_LOOP, 0, n);

  let ANGLE_STEP = 1;
  let g_last = Date.now();
  let angle = 0;

  requestAnimationFrame(function animate(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    let elapsed = Date.now() - g_last;
    g_last = Date.now();
    let newAngle = angle + (ANGLE_STEP*elapsed)/1000.0;
    angle = newAngle;
    mat4.fromRotation(ModelMatrix, newAngle, [0.0, 0.0, 1.0]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, ModelMatrix);
    gl.drawArrays(gl.LINE_LOOP, 0, n);
    if(animat.start){
      //console.log(animat);
      requestAnimationFrame(animate);
    }
  })
}