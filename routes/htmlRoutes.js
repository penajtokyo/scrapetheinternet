var db = require('../models');

module.exports = function(app){
  //home route for all articles
  db.Article.find({})
  .populate("notes")
  .then(function(dbData){
    var articles = dbData
    app.get("/", function(req, res){
  
      res.render('index', {articles: articles})
    })
  })
}