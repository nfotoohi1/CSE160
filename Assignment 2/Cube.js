class Cube {
  constructor(){
    this.type='cube';
    //this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    //this.size = 20.0;
    //this.segement = 10;
    this.matrix = new Matrix4();
  }
  render(){
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;

    // Pass the color of the point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //Front
    drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
    drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);

    //Back
    drawTriangle3D([0,0,1,  1,1,1,  1,0,1]);
    drawTriangle3D([0,0,1,  0,1,1,  1,1,1]);

    gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]*0.75);
    
    //Right
    drawTriangle3D([1,0,0,  1,1,1,  1,0,1]);
    drawTriangle3D([1,0,0,  1,1,0,  1,1,1]);

    //Left
    drawTriangle3D([0,0,0,  0,1,1,  0,0,1]);
    drawTriangle3D([0,0,0,  0,1,0,  0,1,1]);

    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]*0.5);

    //Top
    drawTriangle3D([0,1,0,  1,1,1,  1,1,0]);
    drawTriangle3D([0,1,0,  0,1,1,  1,1,1]);

    //Bottom
    drawTriangle3D([0,0,0,  1,0,1,  1,0,0]);
    drawTriangle3D([0,0,0,  0,0,1,  1,0,1]);

    
  }
}