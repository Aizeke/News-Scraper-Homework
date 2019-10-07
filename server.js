const express = require("express");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");
var logger = require("morgan");
var mongoose = require("mongoose");


const app = express();
const PORT = process.env.PORT || 3002;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/animeList";

var db = require("./models");

// Using Morgan for loggin Requests
app.use(logger("dev"));
// Parse Requested JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Handlebars
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");


// Routes

app.get("/", (req, res) => {
    db.Article.find({}).then(dbArticle => {
        console.log(dbArticle);
        res.render("index", dbArticle);
    })
        .catch(err => res.json(err));
});

// Database JSON
app.get("/data", (req, res) => {
    db.Article.find({}, (error, found) => {
        if (error) {
            console.log(error);
        } else {
            res.json(found);
        }
    });
});

// Scrape site then send to database
app.get("/scrape", (req, res) => {

    axios.get("https://livechart.me/").then(response => {

        const $ = cheerio.load(response.data);

        $(".anime-card").each(function (i, element) {
            // Save the text and href of each link enclosed in the current element
            const results = {}
            // console.log(element.children.children.img);

            results.title = $(this).children("h3").text();

            results.img = $(this).children().find("img").attr("data-src");

            results.date = $(this).children().find("div .anime-date").text();

            results.synopsis = $(this).children().find("div .anime-synopsis").text();

            if (results.title) {
                db.Article.create({
                    title: results.title,
                    img: results.img || "https://u.livechart.me/anime/poster_images/3539/94f66800b0a7885ec924c8716d968889:small.jpg",
                    releaseDate: results.date,
                    synopsis: results.synopsis
                },
                    (err, inserted) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(inserted);
                        }
                    });
            }

        });
    });

    res.redirect("/");
});

// Listen on port 3000
app.listen(PORT, () => {
    console.log(`Port: ${PORT}`);
});