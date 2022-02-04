//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require("lodash");
const myname = "Hi i am Yash Santani";
const homeStartingContent =
  "Hello welcome to my life i try to post something exciting that happens with me and yes i build this website and will fine tune it. If you find any errors please contact me through Contact us option. Enjoy......";
const aboutContent =
  "I’m interested in AI ,ml and web dev and currently learning web dev. I'm looking to collaborate on projects of ML and web dev";
const contactContent = "";

var whole_content = [];
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("partials"));
mongoose.connect(
  "mongodb+srv://yash:loveme23@blogdb.nfpnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

const contentschema = {
  Title: String,
  Body: String,
};
const Content = mongoose.model("Content", contentschema);

app.get("/", function (req, res) {
  Content.find({}, function (err, contents) {
    res.render("home", {
      content: homeStartingContent,
      whole_content: contents,
    });
  });
  // res.render("home", {
  //   content: homeStartingContent,
  //   whole_content: whole_content,
  // });
});

app.get("/contact", function (req, res) {
  res.render("contact", { content: contactContent });
});

app.get("/about", function (req, res) {
  res.render("about", {
    myname: myname,
    content: aboutContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:post", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.post);
  Content.find({}, function (err, contents) {
    contents.forEach(function (post) {
      const storedTitle = _.lowerCase(post.Title);
      if (storedTitle === requestedTitle) {
        res.render("post", { title: post.Title, body: post.Body });
      }
    });
  });
  // whole_content.forEach(function (post) {
  //   const storedTitle = _.lowerCase(post.Title);
  //   if (storedTitle === requestedTitle) {
  //     res.render("post", { title: post.Title, body: post.Body });
  //   }
  // });
});

app.post("/compose", function (req, res) {
  const post = new Content({
    Title: req.body.posttitle,
    Body: req.body.post_content,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
  // const post = {
  //   Title: req.body.posttitle,
  //   Body: req.body.post_content,
  // };
  //whole_content.push(post);
  // res.redirect("/");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("server started successfully");
});
