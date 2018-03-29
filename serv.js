var express = require('express');
var parser = require('body-parser');
var port = 25565;

var app = express()

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json())
app.use(express.static("public"));

var fs = require('fs');
app.use('/', express.static('public'));

app.post('/switch', function(req, res){
    console.log(req.body.params);
});

app.listen(port, function () {
    console.log('Example app listening on port 25565!');
});

app.use(function (req, res, next) {
    res.status(404).sendFile(__dirname + "/" + "err404.html");
});
