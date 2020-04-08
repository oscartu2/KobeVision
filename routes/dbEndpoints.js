var express = require('express');
var router = express.Router();

/* GET team seasons. */
router.get('/seasons/:id', function(req, res, next) {
	var db = req.db;
	var collection = db.get('teams');
	collection.find({teamId: Number(req.params.id)}, {projection: {Season: 1, _id: 0}}, function(e, docs) {
		res.json(docs);
	});
});

/* GET team win loss ratio */
router.get('/seasons/:id/:year', function(req, res, next) {
	var db = req.db;
	var collection = db.get('teams');
	collection.find({teamId: Number(req.params.id), Season: req.params.year}, {}, function(e, docs) {
		res.json(docs);
	});
});

module.exports = router;
