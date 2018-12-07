var articleCtrl = require('../controllers/articleCtrl.js');
var notesCtrl = require('../controllers/notesCtrl.js');

module.exports = function(app){
  //scrape
  app.get("/scrape", articleCtrl.scrape);

  ////////articles

  // Route for getting all Articles from the db
  app.get("/articles", articleCtrl.getAllArticles );

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", articleCtrl.getArticlesById);
  

  ///////notes
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", notesCtrl.createNote);
}
