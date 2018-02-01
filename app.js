const express = require("express"),
			bodyParser = require("body-parser"),
			mongoose = require("mongoose"),
			app = express();


mongoose.connect("mongodb://localhost/restful_blog_app");

// App Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


// Mongoose/ Model Config
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now()}
});

let Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=44c04828f0a9b740e1519f7769fe431c&auto=format&fit=crop&w=1050&q=80",
// 	body: "Hello, this is a blog post!"
// });


// Restful Routes

app.get("/", (req, res) => res.redirect("/blogs"));

app.get("/blogs", (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err){
			console.log("ERROR");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

app.get("/blogs/new", (req, res) => {
	res.render("new");
});

app.post("/blogs", (req, res) => {
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err){
			// console.log("Error");
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	})
});

app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err){
			// console.log(err);
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

app.get("/blogs/:id/edit", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
})

// Server Start
app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000!"));

