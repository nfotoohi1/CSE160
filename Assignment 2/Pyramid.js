class Pyramid {
  constructor(){
    this.type='pyramid';
    this.position = [0.0, 0.0, 0.0];
    this.color = [0.0, 0.0, 0.0, 1.0];
    this.size = 0.5;
    this.matrix = new Matrix4();
  }
  render(){
    var rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //Base
    drawTriangle3D([1,0,1, -1,0,1, -1,0,-1].map(x=>x*this.size));
    drawTriangle3D([1,0,1, 1,0,-1, -1,0,-1].map(x=>x*this.size));

    //Front and Back
    //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]*0.5);
    drawTriangle3D([-1,0,-1, 1,0,-1, 0,1,0].map(x=>x*this.size));
    drawTriangle3D([1,0,1, -1,0,1, 0,1,0].map(x=>x*this.size));
    
    //Left and Right
    gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]*0.75);
    drawTriangle3D([1,0,1, 1,0,-1, 0,1,0].map(x=>x*this.size));
    drawTriangle3D([-1,0,-1, -1,0,1, 0,1,0].map(x=>x*this.size));
  }
}