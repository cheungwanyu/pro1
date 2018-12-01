var express = require("express");
var router = express.Router();
var expressMongoDb = require("express-mongo-db");
var cookieParser = require("cookie-parser");

var assert = require("assert");
var url = require("url");

/* View Restaurant */
router.get("/",function(req,res){
	var id = req.param('id');//restaurant id
	res.status(200);
	res.render('view',{
		
	});
});

module.exports = router;