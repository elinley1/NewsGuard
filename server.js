console.log("Starting APP Server")
console.log("Loading  Dependencies")
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

console.log("Initializing Express APP")
// Initialize Express
var app = express();

//middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//connect to the Mongo DB
console.log("Connecting to Mongo...")
var mongo_username = "scraping_app_user"
var mongo_password = "password123"
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Articles"
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {user: mongo_username, pass: mongo_password}).then(
    () => { console.log("Connected to Mongo. Yay!") },
    err => { console.error("failed to connect to mongo :(", err) }
  );


//Routes
console.log("Registering Routes")
app.get("/", function (req, res) {
    console.log("Hit Home Handler");
    axios.get("https://www.theguardian.com").then(function (response) {
        let $ = cheerio.load(response.data);
        console.log('Inside the scraping logic');

        let createPromises = $(".fc-item__title").map(function (i, el) {
            var result = {};

            result.title = $(this).find(".fc-item__kicker").text()
            //console.log(result.title)

            result.link = $(this).find(".fc-item__link").attr("href");
            //console.log(result.link);

            result.summary = $(this).find(".js-headline-text").text();
            //console.log(result.summary);

            console.log('result: ',result);

            return db.Article.create(result)
                .then(function (dbArticle) {
                    console.log("Create article", dbArticle);
                })
                .catch(function (err) {
                    console.err("Error creating article", dbArticle);
                });
            });
        Promise.all(createPromises).then(function() {
            console.log("Finished all create articles")
            res.sendFile("./public/my-index.html");
        })
    });
});

app.get("/articles", function (req, res) {
    return db.Article.find({})
        .then(function (dbArticle) {
            return res.json(dbArticle);
        })
        .catch(function (err) {
            return res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    return db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            return res.json(dbArticle);
        })
        .catch(function (err) {
            return res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    return db.Note.create(req.body)
    .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
        .then(function (dbArticle) {
            return res.json(dbArticle);
        })
        .catch(function (err) {
            return res.json(err);
        });
});

console.log("Starting the app listener")
//server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + ".");
});