var mongoose = require("mongoose");

var ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    releaseDate: {
        type: String,
        required: true
    },
    synopsis: {
        type: String,
        required: true
    }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
