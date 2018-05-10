var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

//middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Articles"
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


//Routes
app.get("/", function (req, res) {
    axios.get("https://www.theguardian.com").then(function (response) {
        let $ = cheerio.load(response.data);
        console.log('application');

        $(".fc-item__title").each(function (i, el) {
            
            var result = {};

            result.title = $(this).find(".fc-item__kicker").text()
            //console.log(result.title)

            result.link = $(this).find(".fc-item__link").attr("href");
            //console.log(result.link);

            result.summary = $(this).find(".js-headline-text").text();
            //console.log(result.summary);

            console.log('result: ',result);

            db.Article.create(result)
                .then(function (dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
            });

        res.send("Scrape success!");
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
    .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});
//server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + ".");
});