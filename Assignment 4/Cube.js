class Cube {
  constructor(){
    this.type='cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textNum = -2;
    this.cubeVerts32 = new Float32Array([
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,
      0,0,1, 1,1,1, 1,0,1,
      0,0,1, 0,1,1, 1,1,1,
      1,0,0, 1,1,1, 1,0,1,
      1,0,0, 1,1,0, 1,1,1,
      0,0,0, 0,1,1, 0,0,1,
      0,0,0, 0,1,0, 0,1,1,
      0,1,0, 1,1,1, 1,1,0,
      0,1,0, 0,1,1, 1,1,1,
      0,0,0, 1,0,1, 1,0,0,
      0,0,0, 0,0,1, 1,0,1]);
    this.cubeVerts = [
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,
      0,0,1, 1,1,1, 1,0,1,
      0,0,1, 0,1,1, 1,1,1,
      1,0,0, 1,1,1, 1,0,1,
      1,0,0, 1,1,0, 1,1,1,
      0,0,0, 0,1,1, 0,0,1,
      0,0,0, 0,1,0, 0,1,1,
      0,1,0, 1,1,1, 1,1,0,
      0,1,0, 0,1,1, 1,1,1,
      0,0,0, 1,0,1, 1,0,0,
      0,0,0, 0,0,1, 1,0,1];
  }
  render(){
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textNum);
    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //Front
    drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
    drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);
    //drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
    //drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

    //Back
    drawTriangle3DUVNormal([0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1]);
    drawTriangle3DUVNormal([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);
    //drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
    //drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);

    //Right
    //gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]*0.75);
    drawTriangle3DUVNormal([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0]);
    drawTriangle3DUVNormal([1,0,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);
    //drawTriangle3DUV([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
    //drawTriangle3DUV([1,0,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1]);

    //Left
    drawTriangle3DUVNormal([0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0], [-1,0,0, -1,0,0, -1,0,0]);
    drawTriangle3DUVNormal([0,0,0, 0,1,0, 0,1,1], [0,0, 0,1, 1,1], [-1,0,0, -1,0,0, -1,0,0]);
    //drawTriangle3DUV([0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0]);
    //drawTriangle3DUV([0,0,0, 0,1,0, 0,1,1], [0,0, 0,1, 1,1]);

    //Top
    //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]*0.5);
    drawTriangle3DUVNormal([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);
    drawTriangle3DUVNormal([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
    //drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]);
    //drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);

    //Bottom
    drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);
    drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
    //drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0]);
    //drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1]);
  }

  renderFast(){
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, -2);
    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var allverts = [];

    //Front
    allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0]);
    allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0]);

    //Back
    allverts = allverts.concat([0,0,1, 1,1,1, 1,0,1]);
    allverts = allverts.concat([0,0,1, 0,1,1, 1,1,1]);
    
    //Right
    gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]*0.75);
    allverts = allverts.concat([1,0,0, 1,1,1, 1,0,1]);
    allverts = allverts.concat([1,0,0, 1,1,0, 1,1,1]);

    //Left
    allverts = allverts.concat([0,0,0, 0,1,1, 0,0,1]);
    allverts = allverts.concat([0,0,0, 0,1,0, 0,1,1]);

    //Top
    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]*0.5);
    allverts = allverts.concat([0,1,0, 1,1,1, 1,1,0]);
    allverts = allverts.concat([0,1,0, 0,1,1, 1,1,1]);

    //Bottom
    allverts = allverts.concat([0,0,0, 1,0,1, 1,0,0]);
    allverts = allverts.concat([0,0,0, 0,0,1, 1,0,1]);
  
    drawTriangle3D(allverts);
  }

  renderFaster(){
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, -2);
    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    if (g_vertexBuffer == null) {
      initTriangles3D();
    }
  
    gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32, gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }
}