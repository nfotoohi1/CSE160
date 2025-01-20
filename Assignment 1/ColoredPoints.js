// ColoredPoints.js
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

var canvas;
var gl;
var a_Position;
var u_FragColor;
var u_Size;
var u_Segement;

function setUpWebGL() {
  canvas = document.getElementById('Canvas');
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context.');
    return;
  }
}

function setUpVariables() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initilaize shaders.');
    return;
  }
  // Get the storage location of a_Position variable
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get storage location for a_Position.');
    return;
  }
  // Get the storage location of u_FragColor variable
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get storage location for u_FragColor.');
    return;
  }

  // Get the storage location of u_Size variable
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get storage location for u_Size.');
    return;
  }

  // Get the storage location of u_Segement variable
  u_Segement = gl.getUniformLocation(gl.program, 'u_Segement');
  if (!u_Segement) {
    console.log('Failed to get storage location for u_Segement.');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

var selectedShape = POINT;
var selectedColor = [1.0, 1.0, 1.0, 1.0];
var selectedSize = 20.0
var selectedSegement = 10;

var slideR;
var slideG;
var slideB;
var ctx;

function buttonActions() {
  // Buttons
    // Colors
  document.getElementById('redB').onclick = function() {selectedColor = [1.0, 0.0, 0.0, 1.0];};
  document.getElementById('orangeB').onclick = function() {selectedColor = [1.0, 0.75, 0.0, 1.0];};
  document.getElementById('yellowB').onclick = function() {selectedColor = [1.0, 1.0, 0.0, 1.0];};
  document.getElementById('greenB').onclick = function() {selectedColor = [0.0, 1.0, 0.0, 1.0];};
  document.getElementById('blueB').onclick = function() {selectedColor = [0.0, 0.0, 1.0, 1.0];};
  document.getElementById('purpleB').onclick = function() {selectedColor = [1.0, 0.0, 1.0, 1.0];};
  document.getElementById('pinkB').onclick = function() {selectedColor = [1.0, 0.4, 0.75, 1.0];};
  document.getElementById('brownB').onclick = function() {selectedColor = [0.35, 0.25, 0.0, 1.0];};
  document.getElementById('blackB').onclick = function() {selectedColor = [0.0, 0.0, 0.0, 1.0];};
  document.getElementById('grayB').onclick = function() {selectedColor = [0.5, 0.5, 0.5, 1.0];};
  document.getElementById('whiteB').onclick = function() {selectedColor = [1.0, 1.0, 1.0, 1.0];};
  
  document.getElementById('clearB').onclick = function() {shapesList = []; renderShapes();};

  document.getElementById('pointB').onclick = function() {selectedShape = POINT};
  document.getElementById('triangleB').onclick = function() {selectedShape = TRIANGLE};
  document.getElementById('circleB').onclick = function() {selectedShape = CIRCLE};

  document.getElementById('paintingB').onclick = Painting;

  // Sliders
  slideR = document.getElementById('slideR').addEventListener('mouseup', function() {selectedColor[0] = this.value/100;});
  slideG = document.getElementById('slideG').addEventListener('mouseup', function() {selectedColor[1] = this.value/100;});
  slideB = document.getElementById('slideB').addEventListener('mouseup', function() {selectedColor[2] = this.value/100;});

  document.getElementById('slideSize').addEventListener('mouseup', function() {selectedSize = this.value;});

  document.getElementById('slideSeg').addEventListener('mouseup', function() {selectedSegement = this.value;});

  // Colored Canvas
  var colorCanvas = document.getElementById('colorCanvas');
  ctx = colorCanvas.getContext('2d');
}

function updateCanvasColor() {
  const red = slideR.value;
  const green = slideG.value;
  const blue = slideB.value;

  // Set the canvas background color
  ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
  ctx.fillRect(0, 0, ctx.width, ctx.height);
}

function main() {
  
  setUpWebGL();
  setUpVariables();
  buttonActions();

  // Register function (event handler) to be called on a click
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)}};
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var shapesList = [];

function click(ev) {

  [x, y] = convertCoord(ev);

  var point; //= new Point();
  if (selectedShape == 0){
    point = new Point();
  }
  else if (selectedShape == 1){
    point = new Triangle();
  }
  else if (selectedShape == 2){
    point = new Circle();
  }

  // Add items to new point
  point.position = [x, y];
  point.color = selectedColor.slice();
  point.size = selectedSize;
  point.segement = selectedSegement;

  shapesList.push(point);

  renderShapes();
}

function convertCoord(ev) {
  var x = ev.clientX; // x coordinate of the brush
  var y = ev.clientY; // y coordinate of the brush
  var rect = ev.target.getBoundingClientRect();
  
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y])
}

function renderShapes() {
  
  var start = performance.now();
  
  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  var len = shapesList.length;
  for(var i = 0; i < len; i++) {
    shapesList[i].render();
  }

  var duration = performance.now() - start;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "performance");
}

function sendTextToHTML(text, id) {
  var htmlElem = document.getElementById(id);
  if (!htmlElem) {
    console.log("Failed to get HTML ID information.");
    return;
  }
  htmlElem.innerHTML = text;
}

function Painting() {
  shapesList = [];
  renderShapes();
  // Grass
  var tri1 = new Picture([-1, -1, -1, -0.5, -0.5, -1], [0.0, 1.0, 0.0, 1.0]);
  shapesList.push(tri1);
  var tri2 = new Picture([-1, -0.5, -0.5, -1, 0, -0.5], [0.0, 1.0, 0.0, 1.0]);
  shapesList.push(tri2);
  var tri3 = new Picture([-0.5, -1, 0, -0.5, 0.5, -1], [0.0, 1.0, 0.0, 1.0]);
  shapesList.push(tri3);
  var tri4 = new Picture([0, -0.5, 0.5, -1, 1, -0.5], [0.0, 1.0, 0.0, 1.0]);
  shapesList.push(tri4);
  var tri5 = new Picture([0.5, -1, 1, -0.5, 1, -1], [0.0, 1.0, 0.0, 1.0]);
  shapesList.push(tri5);
  
  // Sky
  var tri6 = new Picture([-1, -0.5, 0, 1, 1, -0.5], [0.0, 0.0, 1.0, 1.0]);
  shapesList.push(tri6);
  var tri7 = new Picture([-1, 1, -1, -0.5, 0, 1], [0.0, 0.0, 1.0, 1.0]);
  shapesList.push(tri7);
  var tri8 = new Picture([1, 1, 1, -0.5, 0, 1], [0.0, 0.0, 1.0, 1.0]);
  shapesList.push(tri8);
  
  // Cat
  var tri9 = new Picture([0, 0.5, 0, -0.75, -0.75, -0.75], [0.0, 0.0, 0.0, 1.0]);
  shapesList.push(tri9);
  var tri10 = new Picture([-0.15, 0.25, -0.15, 0.7, 0.25, 0.45], [0.0, 0.0, 0.0, 1.0]);
  shapesList.push(tri10);
  var tri11 = new Picture([-0.1, 0.8, -0.15, 0.65, -0.07, 0.6], [0.0, 0.0, 0.0, 1.0]);
  shapesList.push(tri11);
  var tri12 = new Picture([-0.9, 0, -0.7, -0.75, -0.85, -0.45], [0.0, 0.0, 0.0, 1.0]);
  shapesList.push(tri12);
  var tri13 = new Picture([-0.7, -0.75, -0.85, -0.45, -0.75, -0.75], [0.0, 0.0, 0.0, 1.0]);
  shapesList.push(tri13);
  var tri14 = new Picture([0, -0.75, 0, -0.65, 0.1, -0.75], [0.0, 0.0, 0.0, 1.0]);
  shapesList.push(tri14);

  // Cat Details
  var tri15 = new Picture([0.23, 0.45, 0.25, 0.43, 0.25, 0.47], [1.0, 0.4, 0.75, 1.0]);
  shapesList.push(tri15);
  var tri16 = new Picture([-0.15, 0.3, 0, 0.25, -0.08, 0.3], [1.0, 0.0, 0.0, 1.0]);
  shapesList.push(tri16);
  var tri17 = new Picture([0, 0.25, -0.08, 0.3, 0, 0.3], [1.0, 0.0, 0.0, 1.0]);
  shapesList.push(tri17);
  var tri18 = new Picture([-0.15, 0.3, -0.15, 0.25, 0, 0.25], [1.0, 0.0, 0.0, 1.0]);
  shapesList.push(tri18);
  var tri17 = new Picture([-0.04, 0.25, 0.03, 0.27, 0.01, 0.2], [1.0, 1.0, 0.0, 1.0]);
  shapesList.push(tri17);
  var tri18 = new Picture([0, 0.55, -0.1, 0.55, -0.05, 0.5], [1.0, 1.0, 1.0, 1.0]);
  shapesList.push(tri18);
  var tri19 = new Picture([-0.05, 0.55, -0.03, 0.5, -0.07, 0.5], [0.0, 0.0, 0.0, 1.0]);
  shapesList.push(tri19);
  var tri20 = new Picture([0.25, 0.43, 0.25, 0.47, 0.27, 0.45], [1.0, 0.4, 0.75, 1.0]);
  shapesList.push(tri20);

  // Sun
  var tri21 = new Picture([0.85, 0.75, 0.65, 0.75, 0.75, 0.85], [1.0, 1.0, 0.0, 1.0]);
  shapesList.push(tri21);
  var tri22 = new Picture([0.85, 0.75, 0.65, 0.75, 0.75, 0.65], [1.0, 1.0, 0.0, 1.0]);
  shapesList.push(tri22);

  renderShapes();
}