var mongoose = require('mongoose');

var restaurantSchema = mongoose.Schema({
	restaurant_id: String,
	name: String,
	borough: String,
	photo:Buffer,
	photo_nimetype: String,
	address : {
		 street: String,
		 zipcode: String,
		 building: String,
		 coord: [Number,Number]
		 },
	grades: [{grade: String, score: Number}],
	onwer: String
});

module.exports = restaurantSchema;