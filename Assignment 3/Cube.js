class Cube {
  constructor(){
    this.type='cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textNum = 0;
  }
  render(){
    var rgba = this.color;

    // Pass the texture number
    gl.uniform1i(u_whichTexture, this.textNum);

    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //Front
    drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

    //Back
    drawTriangle3D([0,0,1,  1,1,1,  1,0,1]);
    drawTriangle3D([0,0,1,  0,1,1,  1,1,1]);
    
    //Right
    gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]*0.75);
    drawTriangle3D([1,0,0,  1,1,1,  1,0,1]);
    drawTriangle3D([1,0,0,  1,1,0,  1,1,1]);

    //Left
    drawTriangle3D([0,0,0,  0,1,1,  0,0,1]);
    drawTriangle3D([0,0,0,  0,1,0,  0,1,1]);

    //Top
    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]*0.5);
    drawTriangle3D([0,1,0,  1,1,1,  1,1,0]);
    drawTriangle3D([0,1,0,  0,1,1,  1,1,1]);

    //Bottom
    drawTriangle3D([0,0,0,  1,0,1,  1,0,0]);
    drawTriangle3D([0,0,0,  0,0,1,  1,0,1]);
  }
}