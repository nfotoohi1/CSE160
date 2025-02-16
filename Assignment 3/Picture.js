class Picture {
  constructor() {}

  loadTexture0(image) {
    // Create a Texture Object
    var texture = gl.createTexture();
    if (!texture) {
      console.log("Failed to create the texture object");
      return false;
    }
  
    // Flip the image's y-axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Set the texture unit0 to the sampler
    gl.uniform1i(u_Sampler0, 0);
  }

  loadTexture1(image) {
    // Create a Texture Object
    var texture = gl.createTexture();
    if (!texture) {
      console.log("Failed to create the texture object");
      return false;
    }
  
    // Flip the image's y-axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Set the texture unit0 to the sampler
    gl.uniform1i(u_Sampler1, 1);
  }

  loadTexture2(image) {
    // Create a Texture Object
    var texture = gl.createTexture();
    if (!texture) {
      console.log("Failed to create the texture object");
      return false;
    }
  
    // Flip the image's y-axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE2);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Set the texture unit0 to the sampler
    gl.uniform1i(u_Sampler2, 2);
  }
}