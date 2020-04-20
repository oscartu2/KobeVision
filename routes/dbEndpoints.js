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
router.get('/statistics/:id/:year', function(req, res, next) {
	var db = req.db;
	var collection = db.get('teams');
	collection.find({teamId: Number(req.params.id), Season: req.params.year}, {}, function(e, docs) {
		res.json(docs);
	});
});

/*GET roster based on team + season*/
router.get('/roster/:id/:year', function(req, res, next) {
	var db = req.db;
	var collection = db.get('roster');
	collection.find({TEAMID: Number(req.params.id), YEAR: req.params.year}, {}, function(e, docs) {
		res.json(docs);
	});
});

/*GET roster based on team + season*/
router.get('/roster/statistics/advanced/:id/:year', function(req, res, next) {
	var db = req.db;
	var collection = db.get('advanced');
	collection.find({TEAMID: Number(req.params.id), YEAR: req.params.year}, {}, function(e, docs) {
		res.json(docs);
	});
});

/*GET roster based on team + season*/
router.get('/roster/statistics/misc/:id/:year', function(req, res, next) {
	var db = req.db;
	var collection = db.get('misc')
	collection.find({TEAMID: Number(req.params.id), YEAR: req.params.year}, {}, function(e, docs) {
		res.json(docs);
	});
});

module.exports = router;
