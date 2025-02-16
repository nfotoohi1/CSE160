// World.js
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectMatrix;
  void main() {
    gl_Position = u_ProjectMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    }
    else if (u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0);  
    }
    else if (u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
    else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else if (u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }
    else {
      gl_FragColor = vec4(1, 0.2, 0.2, 1);
    }
  }`

var canvas;
var gl;
var a_Position;
var a_UV;
var u_FragColor;
var u_Size;
var u_ModelMatrix;
var u_GlobalRotateMatrix;
var u_ViewMatrix;
var u_ProjectMatrix;
var u_Sampler0;
var u_Sampler1;
var u_Sampler2;
var u_whichTexture;

function setUpWebGL() {
  canvas = document.getElementById('Canvas');
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context.');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function setUpVariables() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initilaize shaders.');
    return;
  }
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get storage location for a_Position.');
    return;
  }
  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get storage location for a_UV.');
    return;
  }
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get storage location for u_FragColor.');
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get storage location for u_ModelMatrix.');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get storage location for u_GlobalRotateMatrix.');
    return;
  }
  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get storage location for u_ViewMatrix.');
    return;
  }
  // Get the storage location of u_ProjectMatrix
  u_ProjectMatrix = gl.getUniformLocation(gl.program, 'u_ProjectMatrix');
  if (!u_ProjectMatrix) {
    console.log('Failed to get storage location for u_ProjectMatrix.');
    return;
  }
  
  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get storage location for u_Sampler0.');
    return;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get storage location for u_Sampler1.');
    return;
  }

  // Get the storage location of u_Sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get storage location for u_Sampler2.');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get storage location for u_whichTexture.');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

var selectedColor = [1.0, 1.0, 1.0, 1.0];
var g_globalAngle = 0;
var angleX = 0;
var g_map = new Map();

function buttonActions() {
  document.getElementById('slideRotate').addEventListener('mousemove', function() {g_globalAngle = this.value; renderShapes();});
}

function initTextures(){
  var tex = new Picture();
  
  // Ground Picture
  var groundIMG = new Image();
  if (!groundIMG) {
    console.log("Failed to create the groundIMG object");
    return false;
  }
  // Register the event handler to be called on loading an image
  groundIMG.onload = function(){tex.loadTexture0(groundIMG);}
  // Tell the browser to load an image
  groundIMG.src = './img/ground.jpg';

  // Sky Picture
  var skyIMG = new Image();
  if (!skyIMG) {
    console.log("Failed to create the skyIMG object");
    return false;
  }
  // Register the event handler to be called on loading an image
  skyIMG.onload = function(){tex.loadTexture1(skyIMG);}
  // Tell the browser to load an image
  skyIMG.src = './img/sky.jpg';

  // Wall Picture
  var wallIMG = new Image();
  if (!wallIMG) {
    console.log("Failed to create the wallIMG object");
    return false;
  }
  // Register the event handler to be called on loading an image
  wallIMG.onload = function(){tex.loadTexture2(wallIMG);}
  // Tell the browser to load an image
  wallIMG.src = './img/dirt.jpg';

  return true;
}

function main() {
  setUpWebGL();
  setUpVariables();
  buttonActions();
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) {onMove(ev)}};
  document.onkeydown = keydown;

  initTextures();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;
function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  //updateAnimation();
  renderShapes();
  requestAnimationFrame(tick);
}

var xy = [0, 0];
function onMove(ev) {
  var [x, y] = convertCoord(ev);
  if (xy[0] == 0){
    xy = [x, y];
  }
  angleX += xy[0] - x;
  if (Math.abs(angleX/360) > 1){
    angleX = 0;
  }
}

function convertCoord(ev) {
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x, y])
}

var camera = new Camera();
function keydown(ev) {
  if(ev.keyCode == 87) { // Move forward
    camera.forward();
  }
  else if (ev.keyCode == 83) { // Move back
    camera.back();
  }
  else if (ev.keyCode == 68) { // Move to the right
    camera.right();
  }
  else if (ev.keyCode == 65) { // Move to the left
    camera.left();
  }
  else if (ev.keyCode == 81) { // Pan to the left
    camera.panLeft(2);
  }
  else if (ev.keyCode == 69) { // Pan to the righ
    camera.panRight(2);
  }
  else if (ev.keyCode == 32) { // Jump Up
    camera.jumpUp();
  }
  else if (ev.keyCode == 16) { // Jump Down
    camera.jumpDown();
  }
  else if (ev.keyCode == 79) { // Add Block
    addBlock();
  }
  else if (ev.keyCode == 80) { // Delete Block
    subBlock();
  }
  renderShapes();
}

function addBlock() {
  var x = Math.floor(camera.at.elements[0] + 3.5);
  var z = Math.floor(camera.at.elements[2] + 0.5);

  //console.log(x);
  //console.log(z);

  if (z >= 0 && z < 8 && x >= 0 && x < 8) {
    g_map.map[x][z]++;
    renderShapes();
  }
}

function subBlock() {
  var x = Math.floor(camera.at.elements[0] + 3.5);
  var z = Math.floor(camera.at.elements[2] + -0.5);

  //console.log(x);
  //console.log(z);

  if (z >= 0 && z < 8 && x >= 0 && x < 8) {
    g_map.map[x][z]--;
    renderShapes();
  }
}

function renderShapes() {
  var start = performance.now();
  
  // Pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, 0.1, 1000);
  gl.uniformMatrix4fv(u_ProjectMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = new Matrix4();  //(eye, at, up)
  viewMat.setLookAt(camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
                    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
                    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  
  // Pass the rotation matrix
  var globalRotMat = new Matrix4();
  globalRotMat.rotate(g_globalAngle, 1, 0, 0);
  globalRotMat.rotate(angleX, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);


  g_map.drawMap();

  var anim = new Animal();
  anim.textNum = -2;
  anim.matrix.translate(0, 0.5, 0);
  anim.render();
  
  var ground = new Cube();
  ground.textNum = 0;
  ground.matrix.translate(0, -0.75, 0);
  ground.matrix.scale(30, 0, 30);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.render();

  var sky = new Cube();
  sky.textNum = 1;
  sky.matrix.scale(100, 100, 100);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  //console.log(g_map.map[3][0]);
  //console.log(g_map.map[4][0]);
  if (g_map.map[3][0] == 0 && g_map.map[4][0] == 0) {
    console.log("You freed me!! Thank you!");
  }
  else {
    console.log("Bark! Help me!");
  }

  var duration = performance.now() - start;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "performance");
}

function sendTextToHTML(text, id) {
  var htmlElem = document.getElementById(id);
  if (!htmlElem) {
    console.log("Failed to get HTML ID information.");
    return;
  }
  htmlElem.innerHTML = text;
}