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






/* User Account */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));



/*go to login page */

app.get('/login',function(req,res) {
	res.status(200);
	res.render('login',{err:""});
});



  /* login the user account*/
app.post('/login',function(req,res) {
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
  var dbo = db.db("restaurantdb");
  var Data = req.body;
  dbo.collection("User").findOne(Data, function(err, result) {
	  assert.equal(err, null);
	    if (result !== null) {
			
			  req.session.authenticated = true;
			req.session.username = result.userId;
			  console.log("result:" + result.userId);
			  	res.redirect('/');
		  }		  	
    db.close();
	/* Check if user password wrong 
	if(req.session.authenticated == true){
	
	}else{
		res.status(200);
		res.render('login',{err:"User Name or Passsword Wrong!"});
	}
*/
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



/*go to create user page */
app.get('/createuser',function(req,res) {
	res.status(200);
	res.render('createUser',{err:""});
});



/*create user */
app.post('/createuser',function(req,res) {
	MongoClient.connect(url, function(err, db) {
	 if (err) throw err;
  var dbo = db.db("restaurantdb");
  var data={};
   data['userId'] = req.body.userId;
   data['password'] = req.body.password;
  	  console.log(data);
 dbo.collection("User").insert(data, function(err, obj) {
    if (err) throw err;  
    db.close();
	checkAuth(res,req);
	res.status(200);
	console.log(obj);
	
  });
});
});



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


/* go to Create Restaurant page */
app.get("/createRestaurant",function(req,res){
	checkAuth(res,req);
	res.status(200);
	res.render('createRestaurant',{});
});


/*  Ceate the Restaurant document */
app.post('/createRest',function(req,res) {

	
  MongoClient.connect(url, function(err, db) {
	 if (err) throw err;
  var dbo = db.db("restaurantdb");
  var check =false;
  var  restaurantID ;
  do {  
    restaurantID = ""+Math.floor(Math.random() * 99999)+ "";
    dbo.collection("Restaurant").findOne({restaurant_id:restaurantID}, function(err, result) {
	  assert.equal(err, null);
	    if (result !== null) {
		 check =true;
		  console.log(restaurantID);
		 }	  	
    db.close();	
  });
  
  }while(check)
	  
  	 var data={};
    data['restaurant_id'] = restaurantID;
   data['name'] = req.body.name;
   data['borough'] = req.body.borough ;
   data['cuisine'] = req.body.cuisine ;
   data['photo'] = req.body.photo ;
   data['photo mimetype'] = "png" ;
   var subdata1 ={};
       subdata1['street'] = req.body.street ;
	   subdata1['building'] = req.body.building ;
	   subdata1['zipcode'] = req.body.zipcode ;
	   subdata1['coord'] = req.body.coord ;
   data['address'] = subdata1;
   data['grades'] = [];
   data['owner'] = req.session.username;
	   console.log(data);
	 
 dbo.collection("Restaurant").insert(data, function(err, obj) {
    if (err) throw err;  
    db.close();
	checkAuth(res,req);
	res.status(200);
	 res.redirect('/');
  }); 
});
	
});


/* go to Edit Restaurant page */

app.get("/edit",function(req,res){

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("restaurantdb");
  dbo.collection("Restaurant").find().toArray(function(err, resu) {
    if (err) throw err;
    console.log(resu);
    db.close();
	
	checkAuth(res,req);
	res.status(200);
	res.render('eRestaurant',{result:resu[0] });
	
  });
});

		
});




/*  Create the Restaurant document */
app.post('/editRest',function(req,res) {

	
  MongoClient.connect(url, function(err, db) {
	 if (err) throw err;
  var dbo = db.db("restaurantdb");
  var check =false;
  var  restaurantID ;
  do {  
    restaurantID = ""+Math.floor(Math.random() * 99999)+ "";
    dbo.collection("Restaurant").findOne({restaurant_id:restaurantID}, function(err, result) {
	  assert.equal(err, null);
	    if (result !== null) {
		 check =true;
		  console.log(restaurantID);
		 }	  	
    db.close();	
  });
  
  }while(check)
	  
  	 var data={};
    data['restaurant_id'] = restaurantID;
   data['name'] = req.body.name;
   data['borough'] = req.body.borough ;
   data['cuisine'] = req.body.cuisine ;
   data['photo'] = req.body.photo ;
   data['photo mimetype'] = "png" ;
   var subdata1 ={};
       subdata1['street'] = req.body.street ;
	   subdata1['building'] = req.body.building ;
	   subdata1['zipcode'] = req.body.zipcode ;
	   subdata1['coord'] = req.body.coord ;
   data['address'] = subdata1;
   data['grades'] = [];
   data['owner'] = req.session.username;
	   console.log(data);
	 
 dbo.collection("Restaurant").insert(data, function(err, obj) {
    if (err) throw err;  
    db.close();
	checkAuth(res,req);
	res.status(200);
	 res.redirect('/');
  }); 
});
	
});




/* go to search pgae */
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

/* API Service */
app.post("/api/restaurant/",function(req,res){
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("restaurantdb");
		var check =false;
		var  restaurantID ;
		do {  
			restaurantID = ""+Math.floor(Math.random() * 99999)+ "";
			dbo.collection("Restaurant").findOne({restaurant_id:restaurantID}, function(err, result) {
				assert.equal(err, null);
				if (result !== null) {
					check =true;
					console.log(restaurantID);
				}	  	
				db.close();	
			});
		}while(check)

 
		dbo.collection("Restaurant").insert(req.body, function(err, obj) {
			if (err) throw err;  
			db.close();
			var result = {status: ok, _id: obj._id};
			res.status(200).json(result).end();
		});
	});
});

app.get("/api/restaurant/name/*",function(req,res){
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var criteria = {};
		var dbo = db.db("restaurantdb");
		
		criteria.name = req.url.split("/").pop();
		var cursor = dbo.collection("Restaurant").find(criteria);
		var restaurants = [];
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				restaurants.push(doc);
			} else {
				res.json(restaurants);
			}
		});
	});
});

app.get("/api/restaurant/borough/*",function(req,res){
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var criteria = {};
		var dbo = db.db("restaurantdb");
		
		criteria.name = req.url.split("/").pop();
		var cursor = dbo.collection("Restaurant").find(criteria);
		var restaurants = [];
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				restaurants.push(doc);
			} else {
				res.json(restaurants);
			}
		});
	});
});

app.get("/api/restaurant/cuisine/*",function(req,res){
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var criteria = {};
		var dbo = db.db("restaurantdb");
		
		criteria.name = req.url.split("/").pop();
		var cursor = dbo.collection("Restaurant").find(criteria);
		var restaurants = [];
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				restaurants.push(doc);
			} else {
				res.json(restaurants);
			}
		});
	});
});

app.listen(app.listen(process.env.PORT || 8099));