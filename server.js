var express = require('express');
var app = express();
var session = require('cookie-session');
var bodyParser = require('body-parser');
const mongourl = "";
app.set('view engine', 'ejs');

app.use(express.static(__dirname +  '/public'));

app.use(session({
  name: 'session',
  keys: [SECRETKEY1,SECRETKEY2]
}));



var users = new Array(
	{name: 'developer', password: 'developer'},
	{name: 'guest', password: 'guest'}
);


app.get('/',function(req,res) {
	console.log(req.session);
	if (!req.session.authenticated) {
		res.redirect('/login');
	} else {
		res.status(200);
		res.render('index',{name:req.session.username});
	}
});

app.listen(app.listen(process.env.PORT || 8099));