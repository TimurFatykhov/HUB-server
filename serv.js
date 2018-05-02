// import { conditionalExpression } from 'babel-types';

var express = require('express');
var parser = require('body-parser');
var worldInterface = require('./public/world.js')
var loki = require('lokijs'); 
var session = require('express-session');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

// Random state
var salt = bcrypt.genSaltSync(10);

var port = 25565;

var app = express()

app.set('view engine', 'pug');

app.use(parser.urlencoded({extended: false}));
app.use(express.static("public"));
app.use('/', express.static('public'));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

// Data base
var db = new loki('loki.json');
var users = db.addCollection('users');

var hardCodePass = bcrypt.hashSync("w", salt);
users.insert({'login': 'h', 'password': hardCodePass});

function findUser(login, callback)
{
    var searchParameters = {login : login};
    console.log("at findUser")
    var results = users.find(searchParameters);  // search in db

    if (results.length > 0)
    {
        var user = results[0];
        return callback(null, user);  // user is found
    }
    return callback(null);          // incorrect login: user does not exist
};

passport.serializeUser(function(user, done) 
{
    console.log("serialize start");
    done(null, user.login);
    console.log("serialize end");
});
  
passport.deserializeUser(function(login, done) 
{
console.log("DEserialize start");
findUser(login, function(err, user) 
{
    done(err, user);
});
console.log("DEserialize end");
});

// make our strategy
passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
  },
function(login, password, done) 
{
    findUser(login, function(err, user) 
            {
                if (err) 
                { 
                    return done(err); 
                }

                if (!user) 
                {
                    return done(null, false, { message: 'Incorrect login.' });
                    console.log('incorrect login');
                }

                if (!bcrypt.compareSync(password, user.password)) 
                {
                    return done(null, false, { message: 'Incorrect password.' });
                    console.log('incorrect password');
                }

                return done(null, user);
            });
}
));

app.get('/logIn', 
        passport.authenticate('local', { successRedirect: '/home',
                                         failureRedirect: '/?message=Ivalid username or password'})
);


app.all(/\/(home|user)/, function(req,res,next)
{
    if(req.isAuthenticated)
    {
        next();
    }
    else
    {
        res.redirect('/');
    }
});

app.get('/', function(req, res){
    res.render('logIn')
});

app.get('/home', function(req, res){
    res.render('home')
});

app.post('/switch', function(req, res) {
    console.log('###)');
    console.log(req.body.param)
    console.log('###');

    jsonRequest = JSON.parse(req.body.param);

    console.log(jsonRequest.IDDevice);
    console.log('###');
    // console.log(jsonRequest);
    // Куча if'ов

    jsonResponse = worldInterface(jsonRequest)
    console.log(jsonResponse)
    res.send(JSON.stringify(jsonResponse))
});

app.listen(port, function() {
    var ans = worldInterface({
        IDDevice: 0,
        IndexAction: 0,
        Params: []
      });
    console.log(ans);
    console.log('Example app is listening on port 25565!');
});

app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + "/" + "err404.html");
});
