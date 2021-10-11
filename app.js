var PORT = process.env.PORT || 3000;
path = require('path');
express = require("express"),
  fs = require('fs'),
  app = require('express')();
var http = require('http');
var cookieParser = require('cookie-parser');
var server = http.createServer(app);
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var User = require('./user.json');
const session = require('express-session');
app.use(express.json())

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))
app.set("view engine", "handlebars");
app.engine("handlebars", exphbs({ layoutsDir: __dirname + "/views", extname: "handlebars", }));

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public', { maxAge: '30 days' }));
app.use('/uploads', express.static(__dirname + '/uploads'));
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(express.json())
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
  res.render('login')
});
app.get('/web-banking', function (req, res) {
  console.log(req.session)
  if (req.session && req.session.user && req.session.user.u_name) {
    res.render('banking', {
      user: {
        u_name: req.session.user.u_name
      }
    })
  } else {
    res.redirect('/');
  }
});

app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  let errors = [];

  if (User.user[0].username != req.body.username) {
    errors.push({ message: 'Not a registered username' });
  }
  if (User.user[0].password != req.body.password) {
    errors.push({ message: 'Invalid password' });
  }
  if (errors.length > 0) {
    res.render('login', {
      errors: errors
    })
  } else {
    if (req.session) {
      req.session.user = {
        u_name: User.user[0].username
      }
    }
    req.session.save();
    res.redirect('/web-banking');
  }
});
app.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/')
});


//server.listen(3000);
server.listen(PORT, () => {
  console.log("Server is Listening on port :", PORT);
});
