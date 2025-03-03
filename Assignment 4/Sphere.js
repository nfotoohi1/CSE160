function sin(x) {
  return Math.sin(x);
}

function cos(x) {
  return Math.cos(x);
}

class Sphere {
  constructor(){
    this.type='sphere';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textNum = -2;
    this.verts32 = [];
    this.uv32 = [];

    var d = Math.PI/25;
    var dd = Math.PI/25;
    for (var i = 0; i < Math.PI; i+=d){
      for (var j = 0; j < (2*Math.PI); j+=d){
        var p1 = [sin(i)*cos(j), sin(i)*sin(j), cos(i)];
        var p2 = [sin(i+dd)*cos(j), sin(i+dd)*sin(j), cos(i+dd)];
        var p3 = [sin(i)*cos(j+dd), sin(i)*sin(j+dd), cos(i)];
        var p4 = [sin(i+dd)*cos(j+dd), sin(i+dd)*sin(j+dd), cos(i+dd)];

        var uv1 = [i/Math.PI, j/(2*Math.PI)];
        var uv2 = [(i+dd)/Math.PI, j/(2*Math.PI)];
        var uv3 = [i/Math.PI, (j+dd)/(2*Math.PI)];
        var uv4 = [(i+dd)/Math.PI, (j+dd)/(2*Math.PI)];

        this.verts32 = this.verts32.concat(p1, p2, p4);
        this.uv32 = this.uv32.concat(uv1, uv2, uv4);
        
        this.verts32 = this.verts32.concat(p1, p4, p3);
        this.uv32 = this.uv32.concat(uv1, uv4, uv3);
      }
    }
  }

  render(){
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textNum);
    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniform4f(u_FragColor, 1, 0, 0, 1);
    drawTriangle3DUVNormal(this.verts32, this.uv32, this.verts32);
  }
}