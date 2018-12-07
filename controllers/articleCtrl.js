var db = require('../models');
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = {
  scrape: function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.ksl.com/").then(function (response) {
      // // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // // Now, we grab every h2 within an article tag, and do the following:
      var articleArray = [];
      $("div.headline").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.headline = $(this)
          .children("h2").children("a")
          .text();
        result.url = "https://www.ksl.com" + $(this).children("h2").children("a").attr("href");
        result.summary = $(this)
          .children("h5")
          .text();
        console.log(result);
        articleArray.push(result)
        // Create a new Article using the `result` object built from scraping
      });
      db.Article.create(articleArray)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });

      // Send a message to the client
      res.send("Scrape Complete");
    });
  },
  getAllArticles: function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  },
  getArticlesById: function(req, res ){
     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
     db.Article.findOne({
         _id: req.params.id
       })
       // ..and populate all of the notes associated with it
       .populate("note")
       .then(function (dbArticle) {
         // If we were able to successfully find an Article with the given id, send it back to the client
         res.json(dbArticle);
       })
       .catch(function (err) {
         // If an error occurred, send it to the client
         res.json(err);
       });
  }
}