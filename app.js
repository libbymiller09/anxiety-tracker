// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "This is a great place to begin by taking note of when, where and perhaps why your anxiety has flaired up. Please click the compose link to begin. Please include as many details as you can in order to help determine patterns and be prepared for future anxiety attacks. Also include the date so as to better track the frequency of anxiety attacks.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-libby:test123@cluster0-6ycbr.mongodb.net/anxietyDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const postsSchema = {
  title: String,
  date: String,
  content: String
};

const Post = mongoose.model("Post", postsSchema);

const commentsSchema = {
  name: String,
  email: String,
  comment: String
};

const Comment = mongoose.model("Comment", commentsSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    date: req.body.postDate,
    content: req.body.postContent
  });

  post.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  console.log(req.params);
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post) {
    res.render("post", {
      title: post.title,
      date: post.date,
      content: post.content
    });
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
