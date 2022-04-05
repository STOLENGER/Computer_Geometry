// 02.js

"use strict";
function RandomNumber(min, max)
{
  return Math.random() * (max-min) + min;
}
//// Vertex shader program
const VSHADER_SOURCE =
//'precision highp float;\n' +
'attribute vec4 a_Position;\n' + // attribute variable
'attribute float a_Size;\n' +
'attribute vec4 a_Color;\n' +
'varying vec4 the_Color;\n' +
  'void main() {\n' +
'  gl_Position = a_Position;\n' +
 '  gl_PointSize = a_Size;\n' +                    // Set the point size
 'the_Color = a_Color;\n' +
 '}\n';

//// Fragment shader program
const FSHADER_SOURCE =
'precision highp float;\n' +
 'varying vec4 the_Color;\n' +
 'void main() {\n' +
 'gl_FragColor = the_Color;\n' +
 '}\n';

function main() {
  // Retrieve <canvas> element
    const canvas = document.getElementById('mycanvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // Set clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
     console.log('Failed to intialize shaders.');
     return;
   }

  ////  // Get the storage location of a_Position
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
     console.log('Failed to get the storage location of a_Position');
     return;
  }
  const a_Size = gl.getAttribLocation(gl.program, 'a_Size');
  if(a_Size < 0)
  {
    console.log('Fail');
    return;
  }
  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0)
  {
    console.log('Fail color');
    return;
  }
  ////  // Pass vertex position to attribute variable
  

  //  // Draw a point
  
  for(let i = 0; i < 35; ++i)
  {
    gl.vertexAttrib3f(a_Position, RandomNumber(-0.9, 0.9),RandomNumber(-0.9, 0.9) , RandomNumber(-0.9, 0.9));
    gl.vertexAttrib1f(a_Size, RandomNumber(4.0, 15.0));
    gl.vertexAttrib3f(a_Color, RandomNumber(0.0, 1.0), RandomNumber(0.0, 1.0), RandomNumber(0.0, 1.0));
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}