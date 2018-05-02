class World {
  constructor() {
    this.devices = [];
  }
  addDevice(device) { // Добавить новое устройство
    if (device instanceof Device) // Если переданная переменная типа Device
    {
      this.devices.push(device) // Добавляем ее
      return "OK"
    }
    return "ERR" // Иначе возвращаем ошибку
  }
  removeDevice() {

  }
  getDeviceFromId(id) { // Получить устройство по его id
    for (var i in this.devices) { // Ищем в списке всех устройств
      if (this.devices[i].id == id) // Если id совпадает
        return this.devices[i] // Возвращаем это устройство
    }
    return "ERR" // Если устройства не нашли - возвращаем ошбку
  }
  getAllDevicesJson() { // возвращает Json со всеми устройствами
    var json = []
    for (var i in this.devices) {
      var dev = {}
      dev.ID = this.devices[i].id
      dev.Name = this.devices[i].name
      dev.Type = this.devices[i].type
      json.push(dev)
    }
    return JSON.stringify(json)
  }

};

class Device {
  constructor(name = "name", id = "id", typeStr = "SystemClock") {
    this.name = name;
    this.id = id
    this.type = typeStr
  }

  request() { // Запрос на выполнение действий / на информацию
    console.log("Default request function") // Функция по умолчанию
    return "ERR"
  }
  giveMeHistory() {
    console.log("Default history function")
    return "ERR"
  }

}

class Light extends Device {

  request() {
    console.log("req Light")
  }


}

class SystemClock extends Device { // Системные часы

  request(idAction) {
    var result = -1
    switch (idAction) { // В зависимости от того, что пришло, выполняем нужную
      case 0: //           функцию
        result = this.getTime();
        result = {
          IDDevice: this.id,
          Params: [result]
        }
        break;
    }
    return result
  }

  getTime() { // Возвращает текущее время в формате Часы:Минуты:Секунды
    var date = new Date();
    var time = +date.getHours() + ":"
    time += date.getMinutes() + ":"
    time += date.getSeconds()
    return time
  }
}

var world = new World()
world.addDevice(new SystemClock("clock1Name", 1, "SystemClock"))
world.addDevice(new SystemClock("clock2Name", 2, "SystemClock"))

function doIt(jsonRequest) {
  idDevice = jsonRequest["IDDevice"];
  indexAction = jsonRequest["IndexAction"];
  params = jsonRequest["Params"];

console.log('hello' + idDevice)
console.log(indexAction)
console.log(params)

  if (idDevice == 0) // 0 - команды к самому серверу
    return processServerComand(indexAction, params)

  var device = world.getDeviceFromId(idDevice) // Находим устройство в списке
  if (device == "ERR") // Если такого устройства нет
    return "ERR" // Возвращаем ошибку
  return device.request(indexAction, params) // Обращаемся к устройству и
  //                                                       возваращаем ответ
}

function processServerComand(indexAction, params) { // Обработчик команд к серверу
  switch (indexAction) {
    case 0:
      return world.getAllDevicesJson()
      break;
  }
  return "ERR"
}

module.exports = doIt



console.log(doIt({
  IDDevice: 0,
  IndexAction: 0,
  Params: []
}))

console.log(doIt({
  IDDevice: 1,
  IndexAction: 0,
  Params: []
}))
