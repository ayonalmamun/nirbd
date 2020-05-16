var mongoose 	= require('mongoose'),
	Ghor	= require('./models/ghor'),
	Comment	= 	  require('./models/comment');

var data = [
	{
		name: "Vlindrel Hall",
		image: "https://www.pinoyhouseplans.com/wp-content/uploads/2018/05/Cover.jpg",
		description: "1500 sq feet, 2 beds, 2 washrooms, 1 beautiful balcony, drawing and dining not attached!",
		price:"5000000",
		contact:"+8801*********",
	},
	{
		name: "Breezehome",
		image: "http://www.homepictures.in/wp-content/uploads/2019/10/1200-Square-Feet-2-Bedroom-Contemporary-Style-Single-Floor-Beautiful-house-1024x576.jpeg",
		description: "1200 Square Feet 2 Bedroom Contemporary Style Single Floor",
		price:"4000000",
		contact:"+8801*********"
	},	
	{
		name: "Severin Manor",
		image: "http://www.homepictures.in/wp-content/uploads/2019/11/1200-Square-Feet-3-Bedroom-Modern-Single-Floor-House-and-Plan-780x470.jpeg",
		description: "1200 Square Feet 3 Bedroom Modern Single Floor House",
		price:"6000000",
		contact:"+8801*********"
	},
	{
		name: "Honeyside",
		image: "https://www.housesbig.com/wp-content/uploads/2019/08/68527945_472465650152598_7214859580499558400_n.jpg",
		description: "This 1965 Ft House is built with all necessary amenities .The house is not too big in size from outside but house is spacious inside . This house includes kitchen, living and dining room, 3 bedoom, car porch, store room and a common toilet. This house is built in a rectangular plot and designed in contemporary style. The roof top is flat. The living room and dining hall is spacious.The combination of red, white and grey merges with the outer greenery .The hall is decorated using gypsum board.There is a interior staircase to the first floor of the house. The living room up and down are spacious. Bedrooms are decorated using gypsum board false ceiling and LED ligh ting . The kitchen is designed  elegantly in modular style. The Kitchen counter is made up korean top. The main door leads to the living room and dining. The Furniture used is readymade, which is cheaper than the ready made . The  Dining table is of eight-seater which fits in large family. The curtain used are blinding.",
		price:"3000000",
		contact:"+8801*********"
	}
]

function seedDB(){
	//remove all flats
	Ghor.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log("Removed flats!");
			//creating flats
			
			data.forEach(function(seed){
				Ghor.create(seed, function(err, flat){
					if (err){
						console.log(err);
					}else{
						console.log("added a flat!")
						//adding comments
						// Comment.create(
						// 	{
						// 		text: "5/5 NICE!",
						// 		author: "Ayon"
						// 	},function(err, comment){
						// 		if(err){
						// 			console.log(err);
						// 		}
						// 		else{
						// 			flat.comments.push(comment);
						// 			flat.save();
						// 			console.log("Comment Created!");
						// 		}
						// 	})
		}
	})
});
		}
	});
}

module.exports = seedDB;

