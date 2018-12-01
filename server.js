var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var session = require('cookie-session');
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
var MongoClient = require('mongodb').MongoClient;

//set the MongoDb path
var url = require("url");
var router = express.Router();
var assert = require("assert");
router.use(
  expressMongoDb(
	"mongodb://admin:ad1234@ds123454.mlab.com:23454/restaurantdb"
  )
);
///

app.set('view engine', 'ejs');
app.use(express.static(__dirname +  '/public'));

var SECRETKEY1 = 'COMPS381F';
var SECRETKEY2 = 'Project';

var mongourl = "mongodb://abc12345:abc12345@ds251332.mlab.com:51332/library"

app.use(session({
  name: 'session',
  keys: [SECRETKEY1,SECRETKEY2]
}));

app.use(
	cookieParser(),
);

/* User Account */
var users = new Array(
	{name: 'developer', password: 'developer'},
	{name: 'guest', password: 'guest'}
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/',function(req,res) {
	checkAuth(res,req);
	MongoClient.connect(mongourl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("library");
		var query = { };
		dbo.collection("restaurant").find(query).toArray(function(err, result) {
			if (err) throw err;
			res.status(200);
			res.render('home',{result : result});
			db.close();
		});
	});
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
		
		
    req.db.collection("User").findOne(formData, function(err, result) {
    assert.equal(err, null);
	});

		 res.end("======"+result +"===="));
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
	console.log(req.body);
	var name = req.body.name;
	var borough = req.body.borough;
	var cuisine = req.body.cuisine;
	var street = req.body.street;
	var building = req.body.building;
	var zipcode = req.body.zipcode;
	var coord = req.body.coord;
	var owner = req.body.owner;
	var photo = req.body.photo;
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

/* View Restaurant */
app.get("/view",function(req,res){
	var id = req.param('id');//restaurant id
	res.status(200);
	res.render('view',{
		
	});
});

app.listen(app.listen(process.env.PORT || 8099));