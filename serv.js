var express = require('express');
var parser = require('body-parser');
var worldInterface = require('./public/world.js')
var port = 25565;

var app = express()

app.use(parser.urlencoded({
  extended: false
}));

app.use(express.static("public"));
app.use('/', express.static('public'));

app.post('/switch', function(req, res) {
  console.log(req.body.params);

  jsonRequest = req.body


  // Куча if'ов

  jsonResponse = worldInterface.doIt(jsonRequest)

});

app.listen(port, function() {
  console.log('Example app listening on port 25565!');
});

app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + "/" + "err404.html");
});
