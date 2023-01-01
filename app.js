//imports
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//DB declaration
mongoose.set('strictQuery', false);
// in place of 127.0.0.1 we can also use localhost but localhost cause problems relalted to collection 
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true});

const articleSchema=  new mongoose.Schema({
    title:String,
    content:String
});

const Article = mongoose.model("Article",articleSchema);

// routing chaining

//for fetching post and delete all the articles
app.route("/articles")
    .get(function(req,res){
        Article.find(function(err,foundArticles){
            if(!err){
                res.send(foundArticles);
            } else{
                res.send(err);
            }
        });
    })
    .post(function(req,res){
        const newArticle = new Article({
            title:req.body.title,
            content:req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                res.send("Added Successfully");
            }
            else{
                res.send(err);
            }
        });
    })
    .delete(function(req,res){
        Article.deleteMany(function(err){
            if(!err) res.send("Deleted Successfully");
            else res.send(err);
        })
    });


app.route("/articles/:articleTitle")
    .get(function(req,res){
        Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            }
            else{
                res.send("No matching article");
            }
        })
    })
    .put(function(req,res){
        Article.updateOne(
            {title:req.params.articleTitle},
            {title:req.body.title, content:req.body.content},
            {overwrite:true},
            function(err){
                if(!err){
                    res.send("Successfull");
                }
            }
        );
    });




app.listen(3000, function() {
    console.log("Server started on port 3000");
});