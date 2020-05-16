var mongoose 	= require('mongoose');
var ghorSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	price: String,
	contact: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments : [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Ghor", ghorSchema);