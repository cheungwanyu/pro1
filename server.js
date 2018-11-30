var mongoose = require('mongoose');
var express = require('express');
var app = express();
var session = require('cookie-session');
var bodyParser = require('body-parser');
const mongourl = "";

app.set('view engine', 'ejs');
app.use(express.static(__dirname +  '/public'));

var SECRETKEY1 = 'COMPS381F';
var SECRETKEY2 = 'Project';

app.use(session({
  name: 'session',
  keys: [SECRETKEY1,SECRETKEY2]
}));

/* User Account */
var users = new Array(
	{name: 'developer', password: 'developer'},
	{name: 'guest', password: 'guest'}
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/',function(req,res) {
	console.log(req.session);
	if (!req.session.authenticated) {
		res.redirect('/login');
	} else {
		res.status(200);
		res.render('index',{name:req.session.username});
	}
});

app.get('/login',function(req,res) {
	res.status(200);
	res.render('login',{err:""});
});

app.post('/login',function(req,res) {
	for (var i=0; i<users.length; i++) {
		if (users[i].name == req.body.name &&
		    users[i].password == req.body.password) {
			req.session.authenticated = true;
			req.session.username = users[i].name;
		}
	}
	/* Check if user password wrong */
	if(req.session.authenticated == true){
		res.redirect('/');
	}else{
		res.status(200);
		res.render('login',{err:"User Name or Passsword Wrong!"});
	}
});

app.get('/logout',function(req,res) {
	req.session = null;
	res.redirect('/');
});


app.listen(app.listen(process.env.PORT || 8099));