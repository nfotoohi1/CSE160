class Camera {
  constructor() {
    this.eye = new Vector3([0, 0, -2]);
    this.at = new Vector3([0, 0, -1]);
    this.up = new Vector3([0, 1, 0]);
    this.fov = 60.0;
  }

  forward() {
    var temp = new Vector3();
    temp = temp.set(this.at);
    temp = temp.sub(this.eye);
    temp = temp.normalize();
    temp = temp.mul(0.2);
    this.at = this.at.add(temp);
    this.eye = this.eye.add(temp);
  }

  back() {
    var temp = new Vector3();
    temp = temp.set(this.eye);
    temp = temp.sub(this.at);
    temp = temp.normalize();
    temp = temp.mul(0.2);
    this.at = this.at.add(temp);
    this.eye = this.eye.add(temp);
  }

  left() {
    var temp1 = new Vector3();
    temp1 = temp1.set(this.at);
    temp1 = temp1.sub(this.eye);
    
    var temp2 = new Vector3();
    temp2 = Vector3.cross(this.up, temp1);
    temp2 = temp2.normalize();
    temp2 = temp2.mul(0.1);
    
    this.at = this.at.add(temp2);
    this.eye = this.eye.add(temp2);
  }

  right() {
    var temp1 = new Vector3();
    temp1 = temp1.set(this.at);
    temp1 = temp1.sub(this.eye);
    
    var temp2 = new Vector3();
    temp2 = Vector3.cross(temp1, this.up);
    temp2.normalize();
    temp2.mul(0.1);
    
    this.at = this.at.add(temp2);
    this.eye = this.eye.add(temp2);
  }

  panLeft(alpha) {
    var temp = new Vector3();
    temp = temp.set(this.at);
    temp = temp.sub(this.eye);

    var rotMat = new Matrix4();
   rotMat.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    
    var tempPrime = rotMat.multiplyVector3(temp);
    tempPrime.normalize();
    
    this.at = this.at.set(this.eye);
    this.at = this.at.add(tempPrime);
  }

  panRight(alpha) {
    var temp = new Vector3();
    temp = temp.set(this.at);
    temp = temp.sub(this.eye);
    
    var rotMat = new Matrix4();
    rotMat.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    
    var tempPrime = rotMat.multiplyVector3(temp);
    tempPrime.normalize();
    
    this.at = this.at.set(this.eye);
    this.at = this.at.add(tempPrime);
  }

  jumpUp() {
    var temp = new Vector3();
    temp = temp.set(this.up);
    temp = temp.normalize();
    temp = temp.mul(0.2);
    this.at = this.at.add(temp);
    this.eye = this.eye.add(temp);
  }

  jumpDown() {
    var temp = new Vector3();
    temp = temp.set(this.up);
    temp = temp.normalize();
    temp = temp.mul(0.2);
    this.at = this.at.sub(temp);
    this.eye = this.eye.sub(temp);
  }
}