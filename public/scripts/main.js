function mainReq() {
  var xhr = new XMLHttpRequest();
  var url = "/switch";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
      var data = JSON.parse(xhr.responseText);
      console.log(data);

      //  console.log(data[0]);
      data = JSON.parse(data['Params']);

      for (i = 0; i < data.length; i++) {
        var li = document.createElement('li');
        li.innerHTML = "<a href='#" + data[i].Name + "' id='" + data[i].Name + "-link'><span>" + data[i].Name + "</span></a>";
        list.appendChild(li);
        var section = document.createElement('section');
        section.id = data[i].Name;
        section.className = "dev";
        section.innerHTML = "<header> <h2>" + data[i].Name + "</h2> </header> <p>" + data[i].Type +
          "</p> <br> <input type='button' class='button' id='button' onclick='DeviceReq(" +
          data[i].ID + ")' value='click'>";
        main.appendChild(section);
      }
    }
  };
  var requestData = JSON.stringify({
    IDDevice: 0,
    IndexAction: 0,
    Params: []
  });
  console.log(requestData)
  xhr.send(requestData);
}

function DeviceReq(id) {
  var xhr = new XMLHttpRequest();
  var url = "/switch";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      console.log(data);
    }
  };
  var requestData = JSON.stringify({
    IDDevice: id,
    IndexAction: 0,
    Params: []
  });
  console.log(requestData)
  xhr.send(requestData);
}
