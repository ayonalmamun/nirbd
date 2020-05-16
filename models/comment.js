var mongoose 	= require('mongoose');
var commentSchema = new mongoose.Schema({
	text: String,
	author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
	created: 
		{
			type: Date, 
			default: new Date().toLocaleString('en-US', {
				timeZone: 'Asia/Calcutta'
				// default: Date.now
			})
			
		}
});

module.exports = mongoose.model("Comment", commentSchema);