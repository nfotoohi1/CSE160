// World.js
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectMatrix;
  varying vec4 v_vertPos;
  void main() {
    gl_Position = u_ProjectMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_vertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
/*
float spotFactor = 1.0;
    if (u_spotPos){
      vec3 spotL = normalize(vec3(v_vertPos) - vec3(u_spotPos));
      if (u_spotCutoff > 0.0){
        vec3 spotD = normalize(vec3(u_spotDirection));
        float spotCos = dot(-spotL, spotD);
        if (spotCos >= u_spotCutoff){
          spotFactor = pow(spotCos, u_spotExp);
        }
        else {
          spotFactor = 0.0;
        }
      }
    }
    else {
      vec3 spotL = normalize(vec3(u_spotPos));
    }




    vec3 spotVector = vec3(u_spotPos) - vec3(v_vertPos);
    vec3 spotL = length(spotVector);
    vec3 spotD = normalize(u_spotDirection);
    float spotCos = dot(spotD, -spotL);
    if (spotCos > 0.5){
      gl_FragColor = vec4(vec3((specular + diffuse + ambient) * pow(spotCos, 2)), 1.0);
    }
    else {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }



    if (u_lightOn){
      if (u_whichTexture == 0){
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      }
      else {
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    }


    
    gl_FragColor = vec4((spotS + spotD + spotA), 1.0);


    

*/
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_vertPos;
  uniform bool u_lightOn;
  uniform vec3 u_lightColor;
  uniform bool u_spotOn;
  uniform vec3 u_spotPos;
  uniform vec3 u_spotDirection;
  uniform float u_spotCutoff;
  uniform float u_spotExp;
  void main() {
    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal + 1.0)/2.0, 1.0);
    }
    else if (u_whichTexture == -2){
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

    vec3 lightVector = normalize(u_lightPos-vec3(v_vertPos));
    
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N, L), 0.0);

    vec3 R = reflect(-L, N);
    vec3 E = normalize(u_cameraPos-vec3(v_vertPos));
    float specular = pow(max(dot(E, R), 0.0), 64.0) * 0.8;

    vec3 diffuse = vec3(u_lightColor) * vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.2;
    

    
    vec3 spotVector = normalize(u_spotPos-vec3(v_vertPos));

    vec3 spotL = normalize(spotVector);
    vec3 spotN = normalize(v_Normal);
    float spotDot = max(dot(spotN, spotL), 0.0);

    vec3 spotR = reflect(-spotL, spotN);
    vec3 spotE = normalize(u_cameraPos-vec3(v_vertPos));
    float spotS = pow(max(dot(spotE, spotR), 0.0), 64.0) * 0.8;

    vec3 spotDif = vec3(u_lightColor) * vec3(gl_FragColor) * spotDot * 0.7;
    vec3 spotA = vec3(gl_FragColor) * 0.2;











    float spotFactor = 1.0;
    if(u_spotOn) {
      vec3 spotL = normalize(vec3(v_vertPos) - u_spotPos);
      vec3 spotD = normalize(vec3(u_spotDirection));
      float spotCos = dot(spotD, -spotL);
      if(spotCos > u_spotCutoff) {
        spotFactor = pow(spotCos, u_spotExp);
      } else {
        spotFactor = 0.0;
      }
    } else {
      spotFactor = 1.0;
    }


    if(u_lightOn) {
      if(u_whichTexture == 0) {
        gl_FragColor = vec4((specular + diffuse + ambient + spotS + spotDif + spotA), 1.0);
      } else {
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    }




  }`

var canvas;
var gl;
var a_Position;
var a_UV;
var a_Normal;
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
var u_lightPos;
var u_cameraPos;
var u_lightOn;
var u_lightColor;
var u_spotOn;
var u_spotPos;
var u_spotDirection;
var u_spotCutoff;
var u_spotExp;

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
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get storage location for a_UV.');
    return;
  }
  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get storage location for a_Normal.');
    return;
  }
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get storage location for u_FragColor.');
    return;
  }
  // Get the storage location of u_lightPos
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get storage location for u_lightPos.');
    //return;
  }
  // Get the storage location of u_cameraPos
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get storage location for u_cameraPos.');
    return;
  }
  // Get the storage location of u_lightOn
  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get storage location for u_lightOn.');
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
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get storage location for u_ViewMatrix.');
    return;
  }
  u_ProjectMatrix = gl.getUniformLocation(gl.program, 'u_ProjectMatrix');
  if (!u_ProjectMatrix) {
    console.log('Failed to get storage location for u_ProjectMatrix.');
    return;
  }
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get storage location for u_Sampler0.');
    return;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get storage location for u_Sampler1.');
    return;
  }
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
  // Get the storage location of u_lightColor
  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get storage location for u_lightColor.');
    return;
  }
  // Get the storage location of u_spotOn
  u_spotOn = gl.getUniformLocation(gl.program, 'u_spotOn');
  if (!u_spotOn) {
    console.log('Failed to get storage location for u_spotOn.');
    return;
  }
  // Get the storage location of u_spotPos
  u_spotPos = gl.getUniformLocation(gl.program, 'u_spotPos');
  if (!u_spotPos) {
    console.log('Failed to get storage location for u_spotPos.');
    return;
  }
  // Get the storage location of u_spotDirection
  u_spotDirection = gl.getUniformLocation(gl.program, 'u_spotDirection');
  if (!u_spotDirection) {
    console.log('Failed to get storage location for u_spotDirection.');
    return;
  }
  // Get the storage location of u_spotCutoff
  u_spotCutoff = gl.getUniformLocation(gl.program, 'u_spotCutoff');
  if (!u_spotCutoff) {
    console.log('Failed to get storage location for u_spotCutoff.');
    return;
  }
  // Get the storage location of u_spotExp
  u_spotExp = gl.getUniformLocation(gl.program, 'u_spotExp');
  if (!u_spotExp) {
    console.log('Failed to get storage location for u_spotExp.');
    return;
  }


  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

var selectedColor = [1.0, 1.0, 1.0, 1.0];
var g_globalAngle = 0;
var angleX = 0;
var norm = false;
var g_lightPos = [0, 1, 2];
var g_lightOn = true;

function buttonActions() {
  document.getElementById('slideRotate').addEventListener('mousemove', function() {g_globalAngle = this.value; renderShapes();});

  document.getElementById('normOn').onclick = function() {norm = true;};
  document.getElementById('normOff').onclick = function() {norm = false;};

  document.getElementById('lightOn').onclick = function() {g_lightOn = true;};
  document.getElementById('lightOff').onclick = function() {g_lightOn = false;};

  document.getElementById('slideLightX').addEventListener('mousemove', function(ev) {if (ev.buttons == 1){g_lightPos[0] = this.value/100; renderShapes();}});
  document.getElementById('slideLightY').addEventListener('mousemove', function(ev) {if (ev.buttons == 1){g_lightPos[1] = this.value/100; renderShapes();}});
  document.getElementById('slideLightZ').addEventListener('mousemove', function(ev) {if (ev.buttons == 1){g_spotPos[2] = this.value/100; renderShapes();}});

  slideR = document.getElementById('slideR').addEventListener('mouseup', function() {selectedColor[0] = this.value/100;});
  slideG = document.getElementById('slideG').addEventListener('mouseup', function() {selectedColor[1] = this.value/100;});
  slideB = document.getElementById('slideB').addEventListener('mouseup', function() {selectedColor[2] = this.value/100;});
}

function initTextures(){
  var tex = new Picture();
  
  // Ground Picture
  var groundIMG = new Image();
  if (!groundIMG) {
    console.log("Failed to create the groundIMG object");
    return false;
  }
  groundIMG.onload = function(){tex.loadTexture0(groundIMG);}
  groundIMG.src = './img/ground.jpg';

  // Sky Picture
  var skyIMG = new Image();
  if (!skyIMG) {
    console.log("Failed to create the skyIMG object");
    return false;
  }
  skyIMG.onload = function(){tex.loadTexture1(skyIMG);}
  skyIMG.src = './img/sky.jpg';

  // Wall Picture
  var wallIMG = new Image();
  if (!wallIMG) {
    console.log("Failed to create the wallIMG object");
    return false;
  }
  wallIMG.onload = function(){tex.loadTexture2(wallIMG);}
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
  //updateAnimationAngles();
  renderShapes();
  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  g_lightPos[0] = Math.cos(g_seconds*2);
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
  renderShapes();
}


var g_spotPos = [-0.5, 0.75, -0.5];
function renderShapes() {
  var start = performance.now();
  
  // Pass the matrices
  var projMat = new Matrix4();
  projMat.setPerspective(90, 1*canvas.width/canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectMatrix, false, projMat.elements);
  var viewMat = new Matrix4();  //(eye, at, up)
  viewMat.setLookAt(camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2], camera.at.elements[0], camera.at.elements[1], camera.at.elements[2], camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  var globalRotMat = new Matrix4();
  globalRotMat.rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(angleX, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);
  gl.uniform1i(u_lightOn, g_lightOn);

  gl.uniform3f(u_lightColor, selectedColor[0], selectedColor[1], selectedColor[2]);

  gl.uniform1i(u_spotOn, true);
  gl.uniform3f(u_spotPos, g_spotPos[0], g_spotPos[1], g_spotPos[2]);
  gl.uniform3f(u_spotDirection, 0, 1, 0);
  gl.uniform1f(u_spotCutoff, 0.8);
  gl.uniform1f(u_spotExp, 2.0);

  var ground = new Cube();
  ground.color = [0.5, 0.5, 0.5, 1.0];
  if (norm == true){
    ground.textNum = -3;
  }
  ground.matrix.translate(0, -2.5, 0);
  ground.matrix.scale(-5, 0, -5);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.render();

  var sky = new Cube();
  sky.color = [0.25, 0.25, 0.25, 1.0];
  if (norm == true){
    sky.textNum = -3;
  }
  sky.matrix.scale(-5, -5, -5);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  var block = new Cube();
  block.color = [0.0, 0.0, 1.0, 1.0];
  if (norm == true){
    block.textNum = -3;
  }
  block.matrix.translate(-2.25, -2.25, 1.5);
  block.render();

  var ball = new Sphere();
  if (norm == true){
    ball.textNum = -3;
  }
  ball.matrix.translate(1.25, -1.25, 1.5);
  ball.render();

  var light = new Cube();
  light.color = [2, 2, 0, 1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-0.1, -0.1, -0.1);
  light.matrix.translate(-0.5, -0.5, -0.5);
  light.render();

  var spot = new Cube();
  spot.color = [0, 2, 0, 1];
  spot.matrix.translate(g_spotPos[0], g_spotPos[1], g_spotPos[2]);
  spot.matrix.scale(-0.1, -0.1, -0.1);
  spot.render();


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