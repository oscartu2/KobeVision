var express = require('express');
var router = express.Router();
var request = require("request");

var teamOptions = {
  method: 'GET',
  url: 'https://free-nba.p.rapidapi.com/teams',
  qs: {page: '0'},
  headers: {
    'x-rapidapi-host': 'free-nba.p.rapidapi.com',
    'x-rapidapi-key': '9b33bffed0msh79c7ba3574089adp1341ffjsnbeb1a39b1229'
  }
};

var gameOptions = {
  method: 'GET',
  url: 'https://free-nba.p.rapidapi.com/games',
  qs: {Seasons: '\\[2015\]', page: '0', per_page: '25'},
  qsStringifyOptions: {arrayFormat: 'brackets'},
  headers: {
    'x-rapidapi-host': 'free-nba.p.rapidapi.com',
    'x-rapidapi-key': '9b33bffed0msh79c7ba3574089adp1341ffjsnbeb1a39b1229'
  }
};

var statsOptions = {
  method: 'GET',
  url: 'https://free-nba.p.rapidapi.com/stats',
  qs: {page: '0', per_page: '25', team_ids: ['2']},
  headers: {
    'x-rapidapi-host': 'free-nba.p.rapidapi.com',
    'x-rapidapi-key': '9b33bffed0msh79c7ba3574089adp1341ffjsnbeb1a39b1229'
  }
};

/* GET teams from /teams/allTeams. */
router.get('/allTeams', function(req, res, next) {
	request(teamOptions, function (error, response, body) {
		if (error) throw new Error(error);
    let obj = JSON.parse(body);
		res.json(obj.data);
	});
});

/* GET games from /games. */
router.get('/allGames', function(req, res, next) {
  request(gameOptions, function (error, response, body) {
    console.log(response.req.path);
    if (error) throw new Error(error);
    let obj = JSON.parse(body);
    res.json(obj.data);
  });
});

module.exports = router;
