var express = require('express');
var router = express.Router();
var request = require("request");

var options = {
  method: 'GET',
  url: 'https://free-nba.p.rapidapi.com/teams',
  qs: {page: '0'},
  headers: {
    'x-rapidapi-host': 'free-nba.p.rapidapi.com',
    'x-rapidapi-key': '9b33bffed0msh79c7ba3574089adp1341ffjsnbeb1a39b1229'
  }
};

/* GET users listing. */
router.get('/allTeams', function(req, res, next) {
	request(options, function (error, response, body) {
		if (error) throw new Error(error);

		console.log(body);
	});
});

module.exports = router;
