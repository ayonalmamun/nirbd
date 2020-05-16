var express 			= require ("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
	mongoose 			= require('mongoose'),
	Ghor				= require('./models/ghor'),
	seedDB				= require('./seeds'),
	Comment				= require('./models/comment'),
	passport			= require("passport"),
	LocalStrategy		= require("passport-local"),
	User				= require('./models/user'),
	methodOverride 		= require('method-override'),
	expressSanitizer 	= require('express-sanitizer'),
	flash        		= require("connect-flash");

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/ghorbariv1', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
// seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
// passport config

app.use(require("express-session")({
	secret: "Dog bad",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());




app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware we will use in every route that will show if we are logged in or not

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.get("/", function(req, res){
		
	res.render("home");
});

app.get("/about", function(req, res){
		
	res.render("about");
});

//INDEX
app.get("/flats", function(req, res){
	Ghor.find({},function(err,allflats){
		if (err){
			console.log("Error");
		}
		else{
			res.render("flats/index",{flats:allflats});
		}
	});
	
});

// CREATE

app.get("/flats/new",isLoggedIn, function(req, res){
		
	res.render("flats/createNewFlat");
});

app.post("/flats",isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var contact = req.body.contact;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newFlat = {name : name, image: image, description: desc, price: price, contact: contact, author: author};
	Ghor.create(newFlat,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/flats");
		}
	});
	
});



//SHOW
app.get("/flats/:id", function(req, res){
	
	Ghor.findById(req.params.id).populate("comments").exec(function(err,foundflat){
		if(err || !foundflat){
			req.flash("error", "Not found");
			res.redirect("back");
		}
		else{
			// console.log(foundflat);
			res.render("flats/show", {flat:foundflat});
		}
	});
});
//comment create
app.get("/flats/:id/comments/new",isLoggedIn, function(req, res){
	Ghor.findById(req.params.id,function(err, flat){
		if(err){
			console.log(err);
		}else{
			res.render("comments/newComments", {flat: flat});
		}
	})
});

app.post("/flats/:id/comments",isLoggedIn, function(req, res){
	Ghor.findById(req.params.id,function(err, flat){
		if(err){
			console.log(err);
			res.redirect("/flats");
		}else{
			Comment.create(req.body.comment,function(err, comment){
				if(err){
					console.log(err);
				}else{
					comment.author.id = req.user._id;
				   	comment.author.username = req.user.username;
				   	//save comment
				   	comment.save();
				   	flat.comments.push(comment);
				   	flat.save();
				   	// console.log(comment);
					res.redirect("/flats/" + flat._id);
				}
			})
		}
	})
});
//comment edit
app.get("/flats/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
	Ghor.findById(req.params.id, function(err, foundFlat){
		if(err || !foundFlat){
			req.flash("error","Ghor does not exist!");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}
			else{
				res.render("comments/edit", {flat_id: req.params.id, comment: foundComment});
			}
		});
	});
});
app.put("/flats/:id/comments/:comment_id", checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, UpdatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/flats/" + req.params.id);
		}
	})
});
//comment delete
app.delete("/flats/:id/comments/:comment_id", checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/flats/" + req.params.id);
		}
	}); 
});

//auth routes
//show sign up form
app.get("/signup", function(req, res){
	res.render("auth/signup");
});

app.post("/signup", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("auth/signup",{error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully Signed Up! " + req.body.username);
			res.redirect("/flats");
		})
	});
});
//login routes
//show login form
app.get("/login", function(req, res){
	res.render("auth/login");
});
//login logic
//passport.authenticate(middleware)
app.post("/login",passport.authenticate("local",{
	successFlash: 'Welcome to Ghorbari!',
	successRedirect: "/flats",
	failureFlash: true,
	failureRedirect: "/login"
}) ,function(req, res){
});

//logout

app.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully Logged You Out!");
	res.redirect("/flats");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}	
	res.redirect("/login");
};

//edit
app.get("/flats/:id/edit",checkGhorOwnership, function(req, res){
	Ghor.findById(req.params.id, function(err,foundFlat){
		res.render("flats/edit", {flat:foundFlat});
	});	
});
app.put("/flats/:id",checkGhorOwnership, function(req, res){

	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var contact = req.body.contact;
	var updateFlat = {name : name, image: image, description: desc, price: price, contact: contact};
	Ghor.findByIdAndUpdate(req.params.id, updateFlat,function(err, updatedFlat){
		if(err){
			res.redirect("/flats");
		}
		else{
			res.redirect("/flats/" + req.params.id);
		}
	});
});

//delete
app.delete("/flats/:id",checkGhorOwnership, function(req, res){
	Ghor.findByIdAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/flats");
		}
		else{
			res.redirect("/flats");
		}
	});
	
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}	
	req.flash("error", "Please Login First!");
	res.redirect("/login");
};

function checkGhorOwnership(req, res, next){
	//is User Logged in?
	if(req.isAuthenticated()){
		Ghor.findById(req.params.id, function(err, foundFlat){
			if(err || !foundFlat){
				req.flash("error", "Not found");
				res.redirect("back");
			} else{
				// does user own a post?
				if(foundFlat.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}
function checkCommentOwnership(req, res, next){
	//is User Logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else{
				// does user own comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}
app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Ghorbari v1 Started!");
});