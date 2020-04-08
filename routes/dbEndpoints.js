var express = require('express');
var router = express.Router();

/* GET team stats. */
router.get('/seasons/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('teams');
  console.log(req.params.id);
  collection.find({teamId: req.params.id}, {projection: {Season: 1, _id: 0}}, function(e,docs){
    res.json(docs);
  });
});

module.exports = router;
