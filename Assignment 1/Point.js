class Point {
  constructor(){
    this.type='point';
    this.position = [0.0, 0.0, 0.0];
    this.color = [0.0, 0.0, 0.0, 0.0];
    this.size = 20.0;
    this.segement = 10;
  }
  render(){
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    gl.disableVertexAttribArray(a_Position);
    // Pass the position of the point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of the point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
    // Pass the size of the point to u_Size variable
    gl.uniform1f(u_Size, size);
    
    // Draw the shape
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}