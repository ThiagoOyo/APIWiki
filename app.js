const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");



const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);


////////////////////////// Request targetting all articles

app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if (!err){
        res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res){

    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if (!err){
            res.send("Succesfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if (!err){
            res.send("Succesfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});

//////////////////////////// Request targetting SPECIFIC article

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.");
        }
    })
})


.put(function(req, res){

    Article.replaceOne(
        {title: req.params.articleTitle},
        req.body,
        function(err){
            if (!err){
                res.send("Succesfully updated article.");
            } else {
                res.send(err);
            }
        }
    );
})


.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        req.body,
        function(err){
            if(!err){
                res.send("Succesfully updated article field(s).");
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Succesfully deleted the specific article.");
            } else {
                res.send(err);
            }
        });
        });

// app.get("/articles", function(req, res){
//     Article.find(function(err, foundArticles){
//         if (!err){
//         res.send(foundArticles);
//         } else {
//             res.send(err);
//         }
//     });
// });


// app.post("/articles", function(req, res){

//     const newArticle = new Article ({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save(function(err){
//         if (!err){
//             res.send("Succesfully added a new article.");
//         } else {
//             res.send(err);
//         }
//     });
// });


// app.delete("/articles", function(req, res){
//     Article.deleteMany(function(err){
//         if (!err){
//             res.send("Succesfully deleted all articles.");
//         } else {
//             res.send(err);
//         }
//     });
// });













app.listen(3000, function(){
    console.log("Server started on port 3000");
});