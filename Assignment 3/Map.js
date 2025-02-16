class Map {
  constructor() {
    this.map = [
      [1, 1, 1, 3, 3, 3, 1, 1],
      [3, 0, 0, 0, 0, 0, 0, 1],
      [3, 0, 2, 2, 3, 4, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 2, 1],
      [1, 0, 0, 3, 3, 0, 2, 1],
      [3, 0, 0, 0, 0, 0, 1, 1],
      [2, 2, 1, 1, 3, 1, 3, 1]
    ];
  }

  drawMap() {
    var body = new Cube();
    body.color = [1.0, 1.0, 1.0, 1.0];
    body.textNum = 2;
    for (var x = 0; x < 8; x++){
      for (var y = 0; y < 8; y++){
        var inc = 0;
        for (var z = 0; z < this.map[x][y]; z++){
          body.matrix.setIdentity();
          //body.matrix.scale(0.5, 0.5, 0.5);
          body.matrix.translate(0, -0.75, 0);
          body.matrix.translate(x-4, 0+inc, y-2);
          body.render();
          inc += z;
        }
      }
    }
  }
}




/*
[1, 1, 1, 2, 3, 0, 1, 1],
      [3, 0, 0, 0, 0, 0, 0, 1],
      [1, 3, 0, 0, 1, 2, 2, 1],
      [1, 0, 2, 0, 0, 0, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 3],
      [3, 0, 2, 0, 0, 2, 0, 3],
      [3, 0, 2, 0, 0, 0, 2, 3],
      [1, 1, 1, 1, 1, 1, 1, 1]

*/