class Circle {
  constructor(){
    this.type='circle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [0.0, 0.0, 0.0, 0.0];
    this.size = 20.0;
    this.segement = 10;
  }
  render(){
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of the point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);

    var d = size/200.0;

    var angleStep = 360/this.segement;
    for (var angle = 0; angle < 360; angle += angleStep){
      var centerP = [xy[0], xy[1]];
      var angle1 = angle;
      var angle2 = angle + angleStep;
      var vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
      var vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
      var pt1 = [centerP[0]+vec1[0], centerP[1]+vec1[1]];
      var pt2 = [centerP[0]+vec2[0], centerP[1]+vec2[1]];
      
      drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
    }
  }
}