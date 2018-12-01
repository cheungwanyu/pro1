var express = require("express");
var url = require("url");
var expressMongoDb = require("express-mongo-db");
var assert = require("assert");
var cookieParser = require("cookie-parser");
var router = express.Router();



router.use(
  cookieParser(),
  expressMongoDb(
	"mongodb://admin:ad1234@ds123454.mlab.com:23454/restaurantdb"
  ),
  function(req, res, next) {
    console.log("use");
    console.log(req.session.userID + "is logined");
    next();
  }
);


//go to Login page
router.get("/", function(req, res, next) {
  console.log(req.session.authenticated);
  if (req.session.authenticated) {
    console.log(req.session.userID + "is logined");
    res.redirect("/");
  } else {
    res.render("login");
  }
});

//Login
router.post("/", function(req, res, next) {
  var formData = req.body;
  req.db.collection("User").findOne(formData, function(err, result) {
    assert.equal(err, null);
    if (result !== null) {
      console.log("result:" + result);
      req.session.authenticated = true;
      req.session.userID = result.userID;
      res.redirect("/");
    } else {
      res.send("fail");
    }
  });
});

module.exports = router;