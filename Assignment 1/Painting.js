class Picture{
  constructor(coord, rgba){
    this.type = 'triangle';
    this.position = coord;
    this.color = rgba;
    this.size = 5.0;
    this.segement = 10;
  }
  render(){
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;
    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
    gl.uniform1f(u_Size, size);
    
    // Draw the triangle
    drawTriangle([xy[0], xy[1], xy[2], xy[3], xy[4], xy[5]]);
  }
}