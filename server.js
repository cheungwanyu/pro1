var expressMongoDb = require("express-mongo-db");
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

var restaurantListRouter = require("./routers/restaurantlist.js");
app.use("/view", restaurantListRouter);

app.get('/',function(req,res) {
	checkAuth(res,req);
	res.status(200);
	res.render('home',{});
});

app.get('/login',function(req,res) {
	res.status(200);
	res.render('login',{err:""});
});

app.post('/login',function(req,res) {
	

var MongoClient = require('mongodb').MongoClient;
//Create a database named "mydb":
var url ="mongodb://admin:ad1234@ds123454.mlab.com:23454/restaurantdb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});
	
	
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

function checkAuth(res,req){
	console.log(req.session);
	if (!req.session.authenticated) {
		res.redirect('/login');
	}
}

/* Create Restaurant */
app.get("/createRestaurant",function(req,res){
	checkAuth(res,req);
	res.status(200);
	res.render('createRestaurant',{});
});
/* Query Ceate Restaurant */
app.post('/createRestaurant',function(req,res) {
	checkAuth(res,req);
	res.redirect('/');
});


/* Search */
app.get("/search",function(req,res){
	checkAuth(res,req);
	res.status(200);
	res.render('search',{});
});
/* Query Search */
app.post('/search',function(req,res) {
	checkAuth(res,req);
	/* Check Search Type */
	switch(req.body.type){
		case "all":
		
		break;
		case "name":
		
		break;
	}
	/* Show result */
	res.status(200);
	res.render('search',{
		keyword : req.body.keyword,
		type: req.body.type
	});
});


app.listen(app.listen(process.env.PORT || 8099));