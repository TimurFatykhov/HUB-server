var net = require('net');
var sleeper = require('deasync');



function hardRequest(ip, port, msg) // отправляет запрпрос на устройство и возвращает ответ
{
  var client = new net.Socket();
  var buf = "ERR"
  var isConnected = false;

  client.connect(port, ip, function() {
    isConnected = true
  });
  client.on('data', function(data) {
    buf = data;
  });

  var i = 0
  while (isConnected == false) {
    //console.log(i);
    sleeper.sleep(10)
    i++;
    if (i >= 200) // Ждем 2 секунды
    {
      client.destroy()
      return "ERR"
    }
  }

  client.write(msg);

  var i = 0
  while (buf == "ERR") {
    //console.log(i);
    sleeper.sleep(10)
    i++;

    if (i >= 200) // Ждем 2 секунды
      break
  }
  client.destroy()

  return buf.toString()
}


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
  constructor(name = "name", id = "id", typeStr = "SystemClock", ip, port) {
    this.name = name;
    this.id = id
    this.type = typeStr
    this.ip = ip
    this.port = port
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

  request(idAction, params) {
    var result = {}
    switch (idAction) { // В зависимости от того, что пришло, выполняем нужную
      case 0: //           функцию
        result = this.get_state();

        result = {
          IDDevice: this.id,
          Params: [result]
        }
        break;
      case 1:
        result = this.set_state(params[0]);
        result = {
          IDDevice: this.id,
          Params: [result]
        }
    }
    return result
  }
  get_state() {
    var state = hardRequest(this.ip, this.port, "[0]")
    if (state == "[1]")
      return "on"
    if (state == "[0]")
      return "off"

    return "ERR"
  }
  set_state(state) {
    if (state == "on")
      state = 1
    else if (state = "off")
      state = 0
    else return "ERR"

    var newState = hardRequest(this.ip, this.port, "[1," + state + "]")
    if (newState == '[' + state + ']')
      return "OK"
    else
      return "ERR"


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
world.addDevice(new SystemClock("clock1Name", 1, "SystemClock", "127.0.0.1", 3000))
world.addDevice(new SystemClock("clock2Name", 2, "SystemClock", "127.0.0.1", 3000))
world.addDevice(new Light("light1Name", 3, "Light", "192.168.43.124", 21))

function doIt(jsonRequest) {
  idDevice = jsonRequest["IDDevice"];
  indexAction = jsonRequest["IndexAction"];
  params = jsonRequest["Params"];

  if (idDevice == 0) // 0 - команды к самому серверу
    return processServerComand(indexAction, params)


  var device = world.getDeviceFromId(idDevice) // Находим устройство в списке
  if (device == "ERR") // Если такого устройства нет
    return {
      IDDevice: device,
      Params: ["ERR"]
    } // Возвращаем ошибку
  return device.request(indexAction, params) // Обращаемся к устройству и
  //                                                       возваращаем ответ
}

function processServerComand(indexAction, params) { // Обработчик команд к серверу

  switch (indexAction) {
    case 0:
      return {
        idDevice: 0,
        Params: world.getAllDevicesJson()
      }
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

console.log(doIt({
  IDDevice: 3,
  IndexAction: 1,
  Params: ['on']
}))

//console.log(hardRequest('192.168.43.124', 21, "Test msg"))
