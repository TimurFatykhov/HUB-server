class World {
  constructor() {
    this.devices = [];
  }
  addDevice() {

  }
  removeDevice() {

  }

};

class Device {
  constructor(name, id) {
    this.name = name;
    this.id = id
  }
  reguest() // Запрос
  {

  }
  givMeHistory() {

  }

}

class Light extend Device {

  request() {

  }


}

var world = World()

module.exports = function doIt(jsonRequest) {
  idDevice = jsonRequest["IDDevice"]
  indexAction = jsonRequest["IndexAction"]
  params = jsonRequest["Params"]

}
