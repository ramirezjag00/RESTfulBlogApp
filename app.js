//SET UP START
var bodyParser 	= require("body-parser"), 
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose 	= require("mongoose"),
	express 	= require("express"),
	app 		= express();

//APP CONFIG
	//connect mongoose to mongodb, db=restful_blog_app
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient:true});
	//set ejs to automatically run ejs files without .ejs file extention
app.set("view engine", "ejs");
	//tells app.js to serve files like custome stylesheet inside public
app.use(express.static("public"));
	//to use body parser, gets data from forms
app.use(bodyParser.urlencoded({extended:true}));
	//tell app to use express-sanitizer
app.use(expressSanitizer());
	//to use method-override
	//whatever the value of the _method will be used as the method
app.use(methodOverride("_method"));



//MONGOOSE/MODEL CONFIG
	//SCHEMA
var blogSchema = new mongoose.Schema({
	title:String,

	//{type:String, default:"placeholderimage.jpg"}
	//format of value is string but if user did not input an image, it will show the default value jpg
	image:String,
	body:String,
	//type is date but to specify which date, we set default to date when the blog was created "Date.now"
	//this will automatically generated
	created:{type:Date, default: Date.now}
});
	//MODEL
var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

	//usually, in the root path like in fb, you'll get redirected to posts
app.get("/", function(req,res){
	res.redirect("/blogs");
});

	//INDEX ROUTE
	//we used find() method to view all blogs in db to /blogs path
app.get("/blogs", function(req,res){
	Blog.find({}, function(err, blogs){
		if (err){
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

	//NEW ROUTE
app.get("/blogs/new", function(req,res){
	res.render("new");
});	


	//CREATE ROUTE	
app.post("/blogs", function(req, res){
		//create blog
		req.body.blog.body = req.sanitize(req.body.blog.body)
		//req.body.blog from input name attribute "blog[title]"
	Blog.create(req.body.blog, function(err, newBlog){
		if(err) {
			res.render("new");
		} else { 
			//then redirect to the index
			res.redirect("/blogs")
		}
	});
});

	//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("index");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

	//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

	//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

	//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			//redirect somewhere
			res.redirect("/blogs");
		}
	});
});

//to make sure the app is working type in CMD: node app.js
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("SERVER IS RUNNING");
});

//check browser: localhost:27017
app.listen(27017);