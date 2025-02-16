class Animal {
  constructor() {
    this.body = new Cube();
    this.head = new Cube();
    this.eyeL = new Cube();
    this.eyeR = new Cube();
    this.pupilR = new Cube();
    this.pupilL = new Cube();
    this.flt = new Cube();
    this.flc = new Cube();
    this.flp = new Cube();
    this.frt = new Cube();
    this.frc = new Cube();
    this.frp = new Cube();
    this.blt = new Cube();
    this.blc = new Cube();
    this.blp = new Cube();
    this.brt = new Cube();
    this.brc = new Cube();
    this.brp = new Cube();
    this.earL = new Cube();
    this.earR = new Cube();
    this.snout = new Cube();
    this.nose = new Cube();
    this.tail = new Pyramid();
    this.matrix = new Matrix4();
  }

  render() {
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Body
    this.body.color = [0.5, 0.5, 0.5, 1.0];
    this.body.textNum = -2;
    this.body.matrix.translate(-0.2, -0.25, -0.5);
    var bodyCoordFLT = new Matrix4(this.body.matrix);
    var bodyCoordFRT = new Matrix4(this.body.matrix);
    var bodyCoordBLT = new Matrix4(this.body.matrix);
    var bodyCoordBRT = new Matrix4(this.body.matrix);
    var bodyCoordT = new Matrix4(this.body.matrix);
    this.body.matrix.scale(0.3, 0.42, 1);
    this.body.render();

    // Head
    this.head.color = [0.5, 0.5, 0.5, 1.0];
    this.head.textNum = -2;
    this.head.matrix.translate(-0.23, -0, -0.75);
    var headCoordL = new Matrix4(this.head.matrix);
    var headCoordR = new Matrix4(this.head.matrix);
    var headCoordS = new Matrix4(this.head.matrix);
    var headCoordEL = new Matrix4(this.head.matrix);
    var headCoordER = new Matrix4(this.head.matrix);
    this.head.matrix.scale(0.35, 0.35, 0.35);
    this.head.render();

    // Left Eye
    this.eyeL.color = [1.0, 1.0, 1.0, 1.0];
    this.eyeL.textNum = -2;
    this.eyeL.matrix = headCoordEL;
    this.eyeL.matrix.translate(0.25, 0.23, -0.02);
    var eyeLCoord = new Matrix4(this.eyeL.matrix);
    this.eyeL.matrix.scale(0.075, 0.075, 0.075);
    this.eyeL.render();

    // Right Eye
    this.eyeR.color = [1.0, 1.0, 1.0, 1.0];
    this.eyeR.textNum = -2;
    this.eyeR.matrix = headCoordER;
    this.eyeR.matrix.translate(0.025, 0.23, -0.02);
    var eyeRCoord = new Matrix4(this.eyeR.matrix);
    this.eyeR.matrix.scale(0.075, 0.075, 0.075);
    this.eyeR.render();

    // Right Pupil
    this.pupilR.color = [0.0, 0.0, 0.0, 1.0];
    this.pupilR.textNum = -2;
    this.pupilR.matrix = eyeRCoord;
    this.pupilR.matrix.translate(0.0125, 0.0125, -0.025);
    this.pupilR.matrix.scale(0.05, 0.05, 0.05);
    this.pupilR.render();

    // Left Pupil
    this.pupilL.color = [0.0, 0.0, 0.0, 1.0];
    this.pupilL.textNum = -2;
    this.pupilL.matrix = eyeLCoord;
    this.pupilL.matrix.translate(0.0125, 0.0125, -0.025);
    this.pupilL.matrix.scale(0.05, 0.05, 0.05);
    this.pupilL.render();

    // Front Left Thigh
    this.flt.color = [0.5, 0.5, 0.5, 1.0];
    this.flt.textNum = -2;
    this.flt.matrix = bodyCoordFLT;
    this.flt.matrix.translate(0.22, 0.1, 0.07);
    this.flt.matrix.rotate(180, 1, 0, 0);
    this.flt.matrix.rotate(-45, 1, 0, 0);
    //this.flt.matrix.rotate(x_angleFLT, 1, 0, 0);
    var fltCoord = new Matrix4(this.flt.matrix);
    this.flt.matrix.scale(0.1, 0.33, 0.1);
    this.flt.render();

    // Front Left Calf
    this.flc.color = [0.5, 0.5, 0.5, 1.0];
    this.flc.textNum = -2;
    this.flc.matrix = fltCoord;
    this.flc.matrix.translate(0, 0.24, 0.1);
    this.flc.matrix.rotate(-30, 1, 0, 0);
    //this.flc.matrix.rotate(x_angleFLC, 1, 0, 0);
    var flcCoord = new Matrix4(this.flc.matrix);
    this.flc.matrix.scale(0.1, 0.1, 0.4);
    this.flc.render();

    // Front Left Paw
    this.flp.color = [0.5, 0.5, 0.5, 1.0];
    this.flp.textNum = -2;
    this.flp.matrix = flcCoord;
    this.flp.matrix.translate(0, 0.1, 0.41);
    this.flp.matrix.rotate(180, 1, 0, 0);
    this.flp.matrix.rotate(-20, 1, 0, 0);
    //this.flp.matrix.rotate(x_angleFLP, 1, 0, 0);
    this.flp.matrix.scale(0.1, 0.15, 0.07);
    this.flp.render();

    // Front Right Thigh
    this.frt.color = [0.4, 0.4, 0.4, 1.0];
    this.frt.textNum = -2;
    this.frt.matrix = bodyCoordFRT;
    this.frt.matrix.translate(-0.02, 0.1, 0.07);
    this.frt.matrix.rotate(180, 1, 0, 0);
    this.frt.matrix.rotate(-45, 1, 0, 0);
    //this.frt.matrix.rotate(x_angleFRT, 1, 0, 0);
    var frtCoord = new Matrix4(this.frt.matrix);
    this.frt.matrix.scale(0.1, 0.33, 0.1);
    this.frt.render();

    // Front Right Calf
    this.frc.color = [0.4, 0.4, 0.4, 1.0];
    this.frc.textNum = -2;
    this.frc.matrix = frtCoord;
    this.frc.matrix.translate(0, 0.24, 0.1);
    this.frc.matrix.rotate(-30, 1, 0, 0);
    //this.frc.matrix.rotate(x_angleFRC, 1, 0, 0);
    var frcCoord = new Matrix4(this.frc.matrix);
    this.frc.matrix.scale(0.1, 0.1, 0.4);
    this.frc.render();

    // Front Right Paw
    this.frp.color = [0.4, 0.4, 0.4, 1.0];
    this.frp.textNum = -2;
    this.frp.matrix = frcCoord;
    this.frp.matrix.translate(0, 0.1, 0.41);
    this.frp.matrix.rotate(180, 1, 0, 0);
    this.frp.matrix.rotate(-20, 1, 0, 0);
    //this.frp.matrix.rotate(x_angleFRP, 1, 0, 0);
    this.frp.matrix.scale(0.1, 0.15, 0.07);
    this.frp.render();

    // Back Left Thigh
    this.blt.color = [0.5, 0.5, 0.5, 1.0];
    this.blt.textNum = -2;
    this.blt.matrix = bodyCoordBLT;
    this.blt.matrix.translate(0.2, 0.15, 0.95);
    this.blt.matrix.rotate(180, 1, 0, 0);
    this.blt.matrix.rotate(-35, 1, 0, 0);
    //this.blt.matrix.rotate(x_angleBLT, 1, 0, 0);
    var bltCoord = new Matrix4(this.blt.matrix);
    this.blt.matrix.scale(0.13, 0.45, 0.15);
    this.blt.render();

    // Back Left Calf
    this.blc.color = [0.5, 0.5, 0.5, 1.0];
    this.blc.textNum = -2;
    this.blc.matrix = bltCoord;
    this.blc.matrix.translate(0.015, 0.43, 0.03);
    this.blc.matrix.rotate(60, 1, 0, 0);
    //this.blc.matrix.rotate(x_angleBLC, 1, 0, 0);
    var blcCoord = new Matrix4(this.blc.matrix);
    this.blc.matrix.scale(0.1, 0.35, 0.1);
    this.blc.render();

    // Back Left Paw
    this.blp.color = [0.5, 0.5, 0.5, 1.0];
    this.blp.textNum = -2;
    this.blp.matrix = blcCoord;
    this.blp.matrix.translate(0, 0.35, 0);
    this.blp.matrix.rotate(90, 1, 0, 0);
    this.blp.matrix.rotate(-35, 1, 0, 0);
    //this.blp.matrix.rotate(x_angleBLP, 1, 0, 0);
    this.blp.matrix.scale(0.1, 0.15, 0.07);
    this.blp.render();

    // Back Right Thigh
    this.brt.color = [0.4, 0.4, 0.4, 1.0];
    this.brt.textNum = -2;
    this.brt.matrix = bodyCoordBRT;
    this.brt.matrix.translate(-0.03, 0.15, 0.95);
    this.brt.matrix.rotate(180, 1, 0, 0);
    this.brt.matrix.rotate(-35, 1, 0, 0);
    //this.brt.matrix.rotate(x_angleBRT, 1, 0, 0);
    var brtCoord = new Matrix4(this.brt.matrix);
    this.brt.matrix.scale(0.13, 0.45, 0.15);
    this.brt.render();

    // Back Right Calf
    this.brc.color = [0.4, 0.4, 0.4, 1.0];
    this.brc.textNum = -2;
    this.brc.matrix = brtCoord;
    this.brc.matrix.translate(0.015, 0.43, 0.03);
    this.brc.matrix.rotate(60, 1, 0, 0);
    //this.brc.matrix.rotate(x_angleBRC, 1, 0, 0);
    var brcCoord = new Matrix4(this.brc.matrix);
    this.brc.matrix.scale(0.1, 0.35, 0.1);
    this.brc.render();

    // Back Right Paw
    this.brp.color = [0.4, 0.4, 0.4, 1.0];
    this.brp.textNum = -2;
    this.brp.matrix = brcCoord;
    this.brp.matrix.translate(0, 0.35, 0);
    this.brp.matrix.rotate(90, 1, 0, 0);
    this.brp.matrix.rotate(-35, 1, 0, 0);
    //this.brp.matrix.rotate(x_angleBRP, 1, 0, 0);
    this.brp.matrix.scale(0.1, 0.15, 0.07);
    this.brp.render();

    // Left Ear
    this.earL.color = [0.6, 0.6, 0.6, 1.0];
    this.earL.textNum = -2;
    this.earL.matrix = headCoordL;
    this.earL.matrix.translate(0.25, 0.3, 0.02);
    this.earL.matrix.rotate(-10, 0, 0, 1);
    this.earL.matrix.scale(0.1, 0.15, 0.1);
    this.earL.render();

    // Right Ear
    this.earR.color = [0.6, 0.6, 0.6, 1.0];
    this.earR.textNum = -2;
    this.earR.matrix = headCoordR;
    this.earR.matrix.translate(0, 0.285, 0.02);
    this.earR.matrix.rotate(10, 0, 0, 1);
    this.earR.matrix.scale(0.1, 0.15, 0.1);
    this.earR.render();

    // Snout
    this.snout.color = [0.6, 0.6, 0.6, 1.0];
    this.snout.textNum = -2;
    this.snout.matrix = headCoordS;
    this.snout.matrix.translate(0.085, 0.025, -0.125);
    var snoutCoord = new Matrix4(this.snout.matrix);
    this.snout.matrix.scale(0.175, 0.175, 0.175);
    this.snout.render();

    // Nose
    this.nose.color = [1.0, 0.4, 0.75, 1.0];
    this.nose.textNum = -2;
    this.nose.matrix = snoutCoord;
    this.nose.matrix.translate(0.039, 0.15, -0.01);
    this.nose.matrix.scale(0.1, 0.05, 0.05);
    this.nose.render();

    // Tail
    this.tail.color = [0.5, 0.5, 0.5, 1.0];
    this.body.textNum = -2;
    this.tail.matrix = bodyCoordT;
    this.tail.matrix.translate(0.145, 0.4, 0.95);
    this.tail.matrix.rotate(30, 1, 0, 0);
    //this.tail.matrix.rotate(x_angleTail, 0, 0, 1);
    this.tail.matrix.scale(0.05, 1, 0.05);
    this.tail.render();
  }
}