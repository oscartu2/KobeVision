var express = require('express');
var router = express.Router();
var request = require("request");

var teamOptions = {
  method: 'GET',
  url: 'https://api-nba-v1.p.rapidapi.com/teams/league/standard',
  headers: {
    'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
    'x-rapidapi-key': '9b33bffed0msh79c7ba3574089adp1341ffjsnbeb1a39b1229'
  }
};

/* GET teams from /teams/allTeams. */
router.get('/allTeams', function(req, res, next) {
	request(teamOptions, function (error, response, body) {
		if (error) throw new Error(error);
    let obj = JSON.parse(body);
		res.json(obj.api.teams);
	});
});

module.exports = router;
