var express = require('express');
var router = express.Router();

/* GET team stats. */
router.get('/seasons/:teamId', function(req, res, next) {
  var db = req.db;
  var cursor = db.collection('teams').find({}, {Season: 1, _id: 0});
  var result = []
  cursor.each(function(err, doc) {
  	result.push(doc);
  });
  console.log(result);
  // collection.find({query: {teamId: {$eq: req.params.teamId}}},{projection: {Season: 1, _id: 0}}, function(e, data) {
  //   res.json(data);
  // });
});

module.exports = router;
