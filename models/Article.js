var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title:{
        type: String,
        required: false
    },
    link: {
        type: String,
        require: true
    },
    summary: {
        type: String,
        required: true
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
}, { _id: false });

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;