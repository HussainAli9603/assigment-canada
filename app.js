var PORT = process.env.PORT || 3000;
path = require('path');
express = require("express"),
  fs = require('fs'),
  app = require('express')();
var http = require('http');
var server = http.createServer(app);
var exphbs = require('express-handlebars');
var User = require('./user.json');
app.use(express.json())

app.set("view engine", "handlebars");
app.engine("handlebars", exphbs({ layoutsDir: __dirname + "/views", extname: "handlebars", }));

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public', { maxAge: '30 days' }));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(express.json())


app.get('/', function (req, res) {
  res.render('login')
});
app.get('/web-banking', function (req, res) {
    res.render('banking')   
});

app.post('/login', async (req, res) => {
  let errors = [];
  let username;
  const user = await User.user.filter(x => x.username === req.body.username)

  if (user.length === 0) {
    errors.push({ message: 'Not a registered username' });
    res.render('login', {
      errors: errors
    })
  }
  else {

    username = User.user.filter(x => x.username === req.body.username)
    if (username[0].password === req.body.password) {
  
      console.log(username)
      res.render('banking',{
        user:username[0]
      });
    } else {
      errors.push({ message: 'Not a valid password' });
      if (errors.length > 0) {
        res.render('login', {
          errors: errors
        })
      }
    }
  }


});

app.get('/logout', function (req, res) {
  res.redirect('/')
});


//server.listen(3000);
server.listen(PORT, () => {
  console.log("Server is Listening on port :", PORT);
});

