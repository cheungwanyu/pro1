var express = require('express');
var app = express();


const mongourl = "";

app.set('view engine', 'ejs');

app.use(express.static(__dirname +  '/public'));

app.get('/',function(req.res){
	res.render("index.ejs", {
	});
	res.end();
});

app.listen(app.listen(process.env.PORT || 8099));