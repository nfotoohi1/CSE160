var ctx;
var v1;
var v2;

// DrawRectangle.js
function main() {
  // Retrieve <canvas> element                                          <- (1)
  var canvas = document.getElementById('Canvas');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  // Get the rendering context for 2DCG                                 <- (2)
  ctx = canvas.getContext('2d');
  
  // Draw a blue rectangle                                              <- (3) 
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
  ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color
}

function drawVector(v, color) {
  ctx.beginPath();
  ctx.moveTo(200, 200);
  ctx.lineTo((v.elements[0] * 20) + 200, 200 - (v.elements[1] * 20));
  ctx.strokeStyle = color;
  ctx.stroke();
}

function handleDrawEvent() {
  ctx.fillRect(0, 0, 400, 400);
  
  //Draw Vector 1
  element_v1x = document.getElementById('v1x');
  v1x = element_v1x.value;
  element_v1y = document.getElementById('v1y');
  v1y = element_v1y.value;
  v1 = new Vector3([v1x, v1y, 0]);
  drawVector(v1, "red");

  //Draw Vector 2
  element_v2x = document.getElementById('v2x');
  v2x = element_v2x.value;
  element_v2y = document.getElementById('v2y');
  v2y = element_v2y.value;
  v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
  ctx.fillRect(0, 0, 400, 400);

  //Draw Vector 1
  element_v1x = document.getElementById('v1x');
  v1x = element_v1x.value;
  element_v1y = document.getElementById('v1y');
  v1y = element_v1y.value;
  v1 = new Vector3([v1x, v1y, 0]);
  drawVector(v1, "red");

  //Draw Vector 2
  element_v2x = document.getElementById('v2x');
  v2x = element_v2x.value;
  element_v2y = document.getElementById('v2y');
  v2y = element_v2y.value;
  v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v2, "blue");

  //Draw Vector 3 (and 4)
  element_op = document.getElementById('op');
  op = element_op.value;
  element_scalar = document.getElementById('scalar');
  scalar = element_scalar.value;
  if (op == 'add'){
    v3 = v1.add(v2);
    drawVector(v3, "green");
  }
  else if (op == 'sub'){
    v3 = v1.sub(v2);
    drawVector(v3, "green");
  }
  else if (op == 'mul'){
    v3 = v1.mul(scalar);
    v4 = v2.mul(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
  else if (op == 'div'){
    v3 = v1.div(scalar);
    v4 = v2.div(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
  else if (op == 'mag'){
    var v1m = v1.magnitude();
    var v2m = v2.magnitude();
    console.log("Magnitude of Vector 1: ", v1m);
    console.log("Magnitude of Vector 2: ", v2m);
  }
  else if (op == 'nor'){
    v3 = v1.normalize();
    v4 = v2.normalize();
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
  else if (op == 'ang'){
    angleBetween(v1, v2);
  }
  else if (op == 'cro'){
    areaTriangle(v1, v2)
  }
}

function angleBetween(v1, v2) {
  var dot = Vector3.dot(v1, v2);
  var v1m = v1.magnitude();
  var v2m = v2.magnitude();
  var angle = Math.acos(dot / (v1m * v2m)) * 180 / Math.PI;
  console.log('Angle in between Vector 1 and Vector 2:', angle);
}

function areaTriangle(v1, v2) {
  var v_cross = Vector3.cross(v1, v2);
  var area = v_cross.magnitude() / 2;
  console.log('Area within Vector 1 and Vector 2:', area);
}

const s_element = document.getElementById('op');
const i_element = document.getElementById('scalarBox');

s_element.addEventListener("change", function() {
  if (this.value === 'mul' || this.value === 'div'){
    i_element.style.display = "block";
  }
  else {
    i_element.style.display = "none";
  }
});