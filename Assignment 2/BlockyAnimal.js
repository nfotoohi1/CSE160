// ColoredPoints.js
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
var u_ModelMatrix;
var u_GlobalRotateMatrix;

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
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initilaize shaders.');
    return;
  }
  // Get the storage location of a_Position variable
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get storage location for a_Position.');
    //return;
  }
  // Get the storage location of u_FragColor variable
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get storage location for u_FragColor.');
    //return;
  }
  // Get the storage location of u_ModelMatrix variable
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get storage location for u_ModelMatrix.');
    //return;
  }
  // Get the storage location of u_ModelMatrix variable
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get storage location for u_GlobalRotateMatrix.');
    //return;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

var selectedColor = [1.0, 1.0, 1.0, 1.0];
var g_globalAngle = 0;
var angleX = 0;
var angleY = 0;

var animation = false;
var selection = null;
var direction = 'x';

var deliverFLT = 0;
var deliverFLC = 0;
var deliverFLP = 0;
var deliverFRT = 0;
var deliverFRC = 0;
var deliverFRP = 0;
var deliverBLT = 0;
var deliverBLC = 0;
var deliverBLP = 0;
var deliverBRT = 0;
var deliverBRC = 0;
var deliverBRP = 0;

var deliverTail = 0;

var x_angleFLT = 0;
var x_angleFLC = 0;
var x_angleFLP = 0;
var x_angleFRT = 0;
var x_angleFRC = 0;
var x_angleFRP = 0;
var x_angleBLT = 0;
var x_angleBLC = 0;
var x_angleBLP = 0;
var x_angleBRT = 0;
var x_angleBRC = 0;
var x_angleBRP = 0;

var x_angleTail = 0;

var shiftAnim = false;

function buttonActions() {
  // Buttons
  document.getElementById('animationOn').onclick = function() {animation = true;};
  document.getElementById('animationOff').onclick = function() {animation = false; shiftAnim = false;};

  // Sliders
  document.getElementById('slideFLT').addEventListener('mousemove', function() {deliverFLT = this.value; renderShapes();});
  document.getElementById('slideFLC').addEventListener('mousemove', function() {deliverFLC = this.value; renderShapes();});
  document.getElementById('slideFLP').addEventListener('mousemove', function() {deliverFLP = this.value; renderShapes();});

  document.getElementById('slideFRT').addEventListener('mousemove', function() {deliverFRT = this.value; renderShapes();});
  document.getElementById('slideFRC').addEventListener('mousemove', function() {deliverFRC = this.value; renderShapes();});
  document.getElementById('slideFRP').addEventListener('mousemove', function() {deliverFRP = this.value; renderShapes();});

  document.getElementById('slideBLT').addEventListener('mousemove', function() {deliverBLT = this.value; renderShapes();});
  document.getElementById('slideBLC').addEventListener('mousemove', function() {deliverBLC = this.value; renderShapes();});
  document.getElementById('slideBLP').addEventListener('mousemove', function() {deliverBLP = this.value; renderShapes();});

  document.getElementById('slideBRT').addEventListener('mousemove', function() {deliverBRT = this.value; renderShapes();});
  document.getElementById('slideBRC').addEventListener('mousemove', function() {deliverBRC = this.value; renderShapes();});
  document.getElementById('slideBRP').addEventListener('mousemove', function() {deliverBRP = this.value; renderShapes();});

  document.getElementById('slideTail').addEventListener('mousemove', function() {deliverTail = this.value; renderShapes();});

  document.getElementById('slideRotate').addEventListener('mousemove', function() {g_globalAngle = this.value; renderShapes();});

}

var xy = [0, 0];
function main() {
  setUpWebGL();
  setUpVariables();
  buttonActions();
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)}};
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;
function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  updateAnimation();
  renderShapes();
  requestAnimationFrame(tick);
}

function click(ev) {
  if(ev.shiftKey){
    animation = false;
    shiftAnim = true;
  }
  else {
    var [x, y] = convertCoord(ev);
    if (xy[0] == 0){
      xy = [x, y];
    }
    angleX += xy[0] - x;
    angleY += xy[1] + y;
    if (Math.abs(angleX/360) > 1){
      angleX = 0;
    }
    if (Math.abs(angleY/360) > 1){
      angleY = 0;
    }
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

function updateAnimation(){
  if (animation == true){
    x_angleFLT = 10*Math.sin(4*g_seconds);
    x_angleFLC = 15*Math.sin(4*g_seconds);
    x_angleFLP = 25*Math.sin(4*g_seconds);
    x_angleFRT = -10*Math.sin(4*g_seconds);
    x_angleFRC = -15*Math.sin(4*g_seconds);
    x_angleFRP = -25*Math.sin(4*g_seconds);
    x_angleBLT = -20*Math.sin(3*g_seconds);
    x_angleBLC = -25*Math.sin(3*g_seconds);
    x_angleBLP = -20*Math.sin(3*g_seconds);
    x_angleBRT = 20*Math.sin(3*g_seconds);
    x_angleBRC = 25*Math.sin(3*g_seconds);
    x_angleBRP = 20*Math.sin(3*g_seconds);
  }
  else {
    slideSelect();
  }
}

function slideSelect(){
  //direction = selection.value;
  //console.log(direction);
  if (direction == 'x'){
    x_angleFLT = -deliverFLT;
    x_angleFLC = -deliverFLC;
    x_angleFLP = -deliverFLP;
    x_angleFRT = -deliverFRT;
    x_angleFRC = -deliverFRC;
    x_angleFRP = -deliverFRP;
    x_angleBLT = -deliverBLT;
    x_angleBLC = -deliverBLC;
    x_angleBLP = -deliverBLP;
    x_angleBRT = -deliverBRT;
    x_angleBRC = -deliverBRC;
    x_angleBRP = -deliverBRP;

    x_angleTail = -deliverTail;
  }
}

function renderShapes() {
  var start = performance.now();
  var globalRotMat = new Matrix4().rotate(angleX, 0, 1, 0);
  globalRotMat.rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(angleY, -1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var head = new Cube();

  if (shiftAnim == true){
    x_angleTail = 40*Math.sin(6*g_seconds);
    head.matrix.rotate(5*Math.sin(6*g_seconds), 1, 0, 0);
  }

  //Body
  var body = new Cube();
  body.color = [0.5, 0.5, 0.5, 1.0];
  body.matrix.translate(-0.2, -0.25, -0.5);
  var bodyCoordFLT = new Matrix4(body.matrix);
  var bodyCoordFRT = new Matrix4(body.matrix);
  var bodyCoordBLT = new Matrix4(body.matrix);
  var bodyCoordBRT = new Matrix4(body.matrix);
  var bodyCoordT = new Matrix4(body.matrix);
  body.matrix.scale(0.3, 0.42, 1);
  body.render();

  //Head
  head.color = [0.5, 0.5, 0.5, 1.0];
  head.matrix.translate(-0.23, -0, -0.75);
  var headCoordL = new Matrix4(head.matrix);
  var headCoordR = new Matrix4(head.matrix);
  var headCoordS = new Matrix4(head.matrix);
  var headCoordEL = new Matrix4(head.matrix);
  var headCoordER = new Matrix4(head.matrix);
  var headCoordT = new Matrix4(head.matrix);
  head.matrix.scale(0.35, 0.35, 0.35);
  head.render();

  //Left Eye
  var eyeL = new Cube();
  eyeL.color = [1.0, 1.0, 1.0, 1.0];
  eyeL.matrix = headCoordEL;
  eyeL.matrix.translate(0.25, 0.23, -0.02);
  var eyeLCoord = new Matrix4(eyeL.matrix);
  eyeL.matrix.scale(0.075, 0.075, 0.075);
  eyeL.render();

  //Right Eye
  var eyeR = new Cube();
  eyeR.color = [1.0, 1.0, 1.0, 1.0];
  eyeR.matrix = headCoordER;
  eyeR.matrix.translate(0.025, 0.23, -0.02);
  var eyeRCoord = new Matrix4(eyeR.matrix);
  eyeR.matrix.scale(0.075, 0.075, 0.075);
  eyeR.render();

  //Right Pupil
  var pupilR = new Cube();
  pupilR.color = [0.0, 0.0, 0.0, 1.0];
  pupilR.matrix = eyeRCoord;
  pupilR.matrix.translate(0.0125, 0.0125, -0.025);
  pupilR.matrix.scale(0.05, 0.05, 0.05);
  pupilR.render();

  //Left Pupil
  var pupilL = new Cube();
  pupilL.color = [0.0, 0.0, 0.0, 1.0];
  pupilL.matrix = eyeLCoord;
  pupilL.matrix.translate(0.0125, 0.0125, -0.025);
  pupilL.matrix.scale(0.05, 0.05, 0.05);
  pupilL.render();
  
  //Front Left Thigh
  var flt = new Cube();
  flt.color = [0.5, 0.5, 0.5, 1.0];
  flt.matrix = bodyCoordFLT;
  flt.matrix.translate(0.22, 0.1, 0.07);
  flt.matrix.rotate(180, 1, 0, 0);
  flt.matrix.rotate(-45, 1, 0, 0);
  flt.matrix.rotate(x_angleFLT, 1, 0, 0);
  var fltCoord = new Matrix4(flt.matrix);
  flt.matrix.scale(0.1, 0.33, 0.1);
  flt.render();

  //Front Left Calf
  var flc = new Cube();
  flc.color = [0.5, 0.5, 0.5, 1.0];
  flc.matrix = fltCoord;
  flc.matrix.translate(0, 0.24, 0.1);
  flc.matrix.rotate(-30, 1, 0, 0);
  flc.matrix.rotate(x_angleFLC, 1, 0, 0);
  var flcCoord = new Matrix4(flc.matrix);
  flc.matrix.scale(0.1, 0.1, 0.4);
  flc.render();

  //Front Left Paw
  var flp = new Cube();
  flp.color = [0.5, 0.5, 0.5, 1.0];
  flp.matrix = flcCoord;
  flp.matrix.translate(0, 0.1, 0.41);
  flp.matrix.rotate(180, 1, 0, 0);
  flp.matrix.rotate(-20, 1, 0, 0);
  flp.matrix.rotate(x_angleFLP, 1, 0, 0);
  flp.matrix.scale(0.1, 0.15, 0.07);
  flp.render();

  //Front Right Thigh
  var frt = new Cube();
  frt.color = [0.4, 0.4, 0.4, 1.0];
  frt.matrix = bodyCoordFRT;
  frt.matrix.translate(-0.02, 0.1, 0.07);
  frt.matrix.rotate(180, 1, 0, 0);
  frt.matrix.rotate(-45, 1, 0, 0);
  frt.matrix.rotate(x_angleFRT, 1, 0, 0);
  var frtCoord = new Matrix4(frt.matrix);
  frt.matrix.scale(0.1, 0.33, 0.1);
  frt.render();

  //Front Right Calf
  var frc = new Cube();
  frc.color = [0.4, 0.4, 0.4, 1.0];
  frc.matrix = frtCoord;
  frc.matrix.translate(0, 0.24, 0.1);
  frc.matrix.rotate(-30, 1, 0, 0);
  frc.matrix.rotate(x_angleFRC, 1, 0, 0);
  var frcCoord = new Matrix4(frc.matrix);
  frc.matrix.scale(0.1, 0.1, 0.4);
  frc.render();

  //Front Right Paw
  var frp = new Cube();
  frp.color = [0.4, 0.4, 0.4, 1.0];
  frp.matrix = frcCoord;
  frp.matrix.translate(0, 0.1, 0.41);
  frp.matrix.rotate(180, 1, 0, 0);
  frp.matrix.rotate(-20, 1, 0, 0);
  frp.matrix.rotate(x_angleFRP, 1, 0, 0);
  frp.matrix.scale(0.1, 0.15, 0.07);
  frp.render();

  //Back Left Thigh
  var blt = new Cube();
  blt.color = [0.5, 0.5, 0.5, 1.0];
  blt.matrix = bodyCoordBLT;
  blt.matrix.translate(0.2, 0.15, 0.95);
  blt.matrix.rotate(180, 1, 0, 0);
  blt.matrix.rotate(-35, 1, 0, 0);
  blt.matrix.rotate(x_angleBLT, 1, 0, 0);
  var bltCoord = new Matrix4(blt.matrix);
  blt.matrix.scale(0.13, 0.45, 0.15);
  blt.render();

  //Back Left Calf
  var blc = new Cube();
  blc.color = [0.5, 0.5, 0.5, 1.0];
  blc.matrix = bltCoord;
  blc.matrix.translate(0.015, 0.43, 0.03);
  blc.matrix.rotate(60, 1, 0, 0);
  blc.matrix.rotate(x_angleBLC, 1, 0, 0);
  var blcCoord = new Matrix4(blc.matrix);
  blc.matrix.scale(0.1, 0.35, 0.1);
  blc.render();

  //Back Left Paw
  var blp = new Cube();
  blp.color = [0.5, 0.5, 0.5, 1.0];
  blp.matrix = blcCoord;
  blp.matrix.translate(0, 0.35, 0);
  blp.matrix.rotate(90, 1, 0, 0);
  blp.matrix.rotate(-35, 1, 0, 0);
  blp.matrix.rotate(x_angleBLP, 1, 0, 0);
  blp.matrix.scale(0.1, 0.15, 0.07);
  blp.render();

  //Back Right Thigh
  var brt = new Cube();
  brt.color = [0.4, 0.4, 0.4, 1.0];
  brt.matrix = bodyCoordBRT;
  brt.matrix.translate(-0.03, 0.15, 0.95);
  brt.matrix.rotate(180, 1, 0, 0);
  brt.matrix.rotate(-35, 1, 0, 0);
  brt.matrix.rotate(x_angleBRT, 1, 0, 0);
  var brtCoord = new Matrix4(brt.matrix);
  brt.matrix.scale(0.13, 0.45, 0.15);
  brt.render();

  //Back Right Calf
  var brc = new Cube();
  brc.color = [0.4, 0.4, 0.4, 1.0];
  brc.matrix = brtCoord;
  brc.matrix.translate(0.015, 0.43, 0.03);
  brc.matrix.rotate(60, 1, 0, 0);
  brc.matrix.rotate(x_angleBRC, 1, 0, 0);
  var brcCoord = new Matrix4(brc.matrix);
  brc.matrix.scale(0.1, 0.35, 0.1);
  brc.render();

  //Back Right Paw
  var brp = new Cube();
  brp.color = [0.4, 0.4, 0.4, 1.0];
  brp.matrix = brcCoord;
  brp.matrix.translate(0, 0.35, 0);
  brp.matrix.rotate(90, 1, 0, 0);
  brp.matrix.rotate(-35, 1, 0, 0);
  brp.matrix.rotate(x_angleBRP, 1, 0, 0);
  brp.matrix.scale(0.1, 0.15, 0.07);
  brp.render();

  //Left Ear
  var earL = new Cube();
  earL.color = [0.6, 0.6, 0.6, 1.0];
  earL.matrix = headCoordL;
  earL.matrix.translate(0.25, 0.3, 0.02);
  earL.matrix.rotate(-10, 0, 0, 1);
  earL.matrix.scale(0.1, 0.15, 0.1);
  earL.render();

  //Right Ear
  var earR = new Cube();
  earR.color = [0.6, 0.6, 0.6, 1.0];
  earR.matrix = headCoordR;
  earR.matrix.translate(0, 0.285, 0.02);
  earR.matrix.rotate(10, 0, 0, 1);
  earR.matrix.scale(0.1, 0.15, 0.1);
  earR.render();

  //Snout
  var snout = new Cube();
  snout.color = [0.6, 0.6, 0.6, 1.0];
  snout.matrix = headCoordS;
  snout.matrix.translate(0.085, 0.025, -0.125);
  var snoutCoord = new Matrix4(snout.matrix);
  snout.matrix.scale(0.175, 0.175, 0.175);
  snout.render();

  //Nose
  var nose = new Cube();
  nose.color = [1.0, 0.4, 0.75, 1.0];
  nose.matrix = snoutCoord;
  nose.matrix.translate(0.039, 0.15, -0.01);
  nose.matrix.scale(0.1, 0.05, 0.05);
  nose.render();

  //Tail
  var tail = new Pyramid();
  tail.color = [0.5, 0.5, 0.5, 1.0];
  tail.matrix = bodyCoordT;
  tail.matrix.translate(0.145, 0.4, 0.95);
  tail.matrix.rotate(30, 1, 0, 0);
  tail.matrix.rotate(x_angleTail, 0, 0, 1);
  tail.matrix.scale(0.05, 1, 0.05);
  tail.render();

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