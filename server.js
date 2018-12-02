var expressMongoDb = require("express-mongo-db");
var express = require('express');
var app = express();
var session = require('cookie-session');
var bodyParser = require('body-parser');
const mongourl = "";

//connect the mongoDB
var assert = require("assert");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:ad1234@ds123454.mlab.com:23454/restaurantdb";


app.set('view engine', 'ejs');
app.use(express.static(__dirname +  '/public'));

var SECRETKEY1 = 'COMPS381F';
var SECRETKEY2 = 'Project';

app.use(session({
  name: 'session',
  keys: [SECRETKEY1,SECRETKEY2]
}));







app.get('/createUser',function(req,res) {
	res.status(200);
	res.render('createUser',{err:""});
});

/*create user */
app.post('/usercreate',function(req,res) {
	MongoClient.connect(url, function(err, db) {
	 if (err) throw err;
  var dbo = db.db("restaurantdb");
   var uplaod = {};
   uplaod["restaurant_id"] =req.body.restaurant_id;
   
   console.log(uplaod);
 
 dbo.collection("Restaurant").remove(uplaod, function(err, obj) {
    if (err) throw err;
    
    db.close();
	
	checkAuth(res,req);
	res.status(200);
   res.redirect('/');	
	
  }); 
});
});


/* User Account */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));






/* View the restaurant list*/
app.get('/',function(req,res) {
	MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("restaurantdb");
  dbo.collection("Restaurant").find().toArray(function(err, resu) {
    if (err) throw err;
    console.log(resu);
    db.close();
	
	checkAuth(res,req);
	res.status(200);
	res.render('home',{result:resu, user:req.session.username });	
	
  });
});
});


/* Delete restaurant */
app.post('/cancel',function(req,res) {
	MongoClient.connect(url, function(err, db) {
	 if (err) throw err;
  var dbo = db.db("restaurantdb");
   var uplaod = {};
   uplaod["restaurant_id"] =req.body.restaurant_id;
   
   console.log(uplaod);
 
 dbo.collection("Restaurant").remove(uplaod, function(err, obj) {
    if (err) throw err;
    
    db.close();
	
	checkAuth(res,req);
	res.status(200);
   res.redirect('/');	
	
  }); 
});
});


/* rate restaurant */
app.post('/rate',function(req,res) {
	MongoClient.connect(url, function(err, db) {
	 if (err) throw err;
  var dbo = db.db("restaurantdb");
   var uplaod_restaurant_id = {};
   uplaod_restaurant_id["restaurant_id"] =req.body.restaurant_id;
   
   var uplaod_userScore = {};
  uplaod_userScore["user"] =req.session.username;
  uplaod_userScore["score"] =req.body.score;
  
  var uplaod_grades = {};
  uplaod_grades["grades"] = uplaod_userScore;
  


 dbo.collection("Restaurant").update( uplaod_restaurant_id,{ $push: uplaod_grades }, function(err, obj) {
    if (err) throw err;
    
    db.close();
	
	checkAuth(res,req);
	res.status(200);
   res.redirect('/');	
	
  }); 
});
});


app.get('/login',function(req,res) {
	res.status(200);
	res.render('login',{err:""});
});

app.post('/login',function(req,res) {
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
  var dbo = db.db("restaurantdb");
  var Data = req.body;
  // check the user account
  dbo.collection("User").findOne(Data, function(err, result) {
	  assert.equal(err, null);
	    if (result !== null) {
			
			  req.session.authenticated = true;
			req.session.username = result.userId;
			  console.log("result:" + result.userId);
			  	res.redirect('/');
		  }		  	
    db.close();
	 //Check if user password wrong 
	if(req.session.authenticated == true){
	
	}else{
		res.status(200);
		res.render('login',{err:"User Name or Passsword Wrong!"});
	}
  });
});
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



app.get("/search",function(req,res){
	checkAuth(res,req);
	res.status(200);
	res.render('search',{});
});


/* Query Search */
app.get('/searchRestaurant',function(req,res) {
	MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("restaurantdb");


 /*
var data = "{"+req.query.type+":/"+req.query.keyword+"/}";
	  console.log(data); */

var data = req.query.keyword;
if(req.query.type =="all"){
	
	
	  dbo.collection("Restaurant").find({$or:[{"name": {$regex: ".*" + data + ".*"}},{"cuisine": {$regex: ".*" + data + ".*"}},{"borough":  {$regex: ".*" + data + ".*"}}]}).toArray(function(err, resu) {
    if (err) throw err;
    console.log(resu);
    db.close();
	checkAuth(res,req);
	res.status(200);
	res.render('home',{result:resu, user:req.session.username });	
	
  });
  	
	
}else{
	  dbo.collection("Restaurant").find({[req.query.type]: {$regex: ".*" + data + ".*"}}).toArray(function(err, resu) {
    if (err) throw err;
    console.log(resu);
    db.close();
	checkAuth(res,req);
	res.status(200);
	res.render('home',{result:resu, user:req.session.username });	
	
  });
  
	
}

  
  
  
});
});




app.listen(app.listen(process.env.PORT || 8099));