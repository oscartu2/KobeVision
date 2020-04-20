# KobeVision
Welcome to my CPSC 448 Directed Studies project!

This is a web app built with (currently) Express, JavaScript, and Jade. 
The goal of it is to use open source NBA APIs to gather NBA Game, Team, and Player data and use it to pitch
two teams against each other and predict a winner.

Check it out at: https://kobe-vision.herokuapp.com

# Prediction Methods
- Win/Loss Ratio
-- Takes the Win/Loss Ratio of selected team as a probability, normalizes it between the other team's Win/Loss Ratio, and then selects a team based on its probability
-- TODO (Add slider bar for number of trials)
-- May include number of trials in the future and show number of times each team would win

- Starting 5 PER
-- Similar to Top 12 Team PER but only accounts for the starting 5

- (Top 12) Team PER
-- From https://www.stat.berkeley.edu/~aldous/Research/Ugrad/Stanley_Yang%20_Thesis.pdf
-- Uses Player Efficiency Ratings of the top 12 players in terms of minutes for current team's season
-- First calculate adjusted PER for every player
-- Multiply individual PER by their total minutes played 
-- Sum all of this together to get a team PER

- Simple Rating System
-- Uses the Simple Rating System

- 538 CARM-ELO Rating (only with top 5) 
-- From https://fivethirtyeight.com/methodology/how-our-nba-predictions-work/
-- Below is a paraphrased and slightly modified summary of their CARM-ELO rating system:
-- (For a given lineup), take team’s "average offensive and defensive rating (weighted by each player’s expected minutes)" multiplied by 5 to account for five players being on the court at all times. 
-- This number is then multiplied by a scalar — 0.8 for the regular season and 0.9 for the playoffs — to account for diminishing returns between a team’s individual talent and its on-court results. 
-- Then use team’s pace (relative to league average): using individual ratings that represent each player’s effect on team possessions per 48 minutes. 
-- Those numbers are then converted into expected total points scored and allowed over a full season:
--- Add a team’s offensive rating to the league average rating (or subtracting it from the league average on defense), dividing by 100 and multiplying by 82 times a team’s expected pace factor per 48 minutes. 
-- Finally, we combine those projected points scored and allowed into a generic expected “winning percentage” via the Pythagorean expectation. In the regular season, the exponent used is 14.3:
-- Winning Percentage= (Projected Points Scored^14.3)/(Projected Points Scored^14.3)+(Projected Points Allowed^14.3)
-- In the playoffs, the exponent is 13.2. The league ratings come from NBA.com efficiency and pace data; in 2018-19, the league average offensive efficiency was 108.44 points per 100 possessions and the average pace was 101.91 possessions per 48 minutes. In the playoffs, we multiply the average pace factor by 0.965 to account for the postseason being slightly slower-paced than the regular season.
-- After arriving at an expected winning percentage, that number is then converted into its Elo rating equivalent: Elo Team Rating = 1504.6 − (450xlog10((1/Winning Percentage)−1))
-- From there, we predict a single game’s outcome the same way we did when CARM-Elo was in effect. That means we not only account for each team’s inherent talent level, but we also make adjustments for home-court advantage (the home team gets a boost of about 92 rating points), fatigue (teams that played the previous day are given a penalty of 46 rating points), travel (teams are penalized based on the distance they travel from their previous game) and altitude (teams that play at higher altitudes are given an extra bonus when they play at home, on top of the standard home-court advantage). 
-- Then teams odds of winning: Win Probability = 1/(10^(−((Team Rating Differential+Bonus Differential)/400))+1)
-- Where Team Rating Differential is the team’s Elo talent rating minus the opponent’s, and the bonus differential is just the difference in the various extra adjustments detailed above.

- ML Methods:
-- https://homepages.cae.wisc.edu/~ece539/fall13/project/AmorimTorres_rpt.pdf

# Notes to myself/dev cheatsheet
- Start MongoDB Daemon
`mongod --dbpath ~/Users/username/Desktop/path/to/data`
- Start Mongo shell
`mongo`
- Use database where db is database name
`use db` 
- Show which collections are in the database
`show collections`
- Start mLab shell
`mongo ds033113.mlab.com:33113/heroku_z845v6qz -u <user_name> -p <user_password>`

- Adding something into MongoDB instance
In file_name.csv's directory, open shell and execute:
`mongoimport -d database_name -c collection_name --type CSV --file file_name.csv --headerline`
Or if adding to mLab
`mongoimport -h ds033113.mlab.com:33113 -d heroku_z845v6qz -u <user_name> -p <user_password> -c collection_name --type CSV --file file_name.csv --headerline`
where database_name, collection_name, and file_name are all specified

- Adding a field (column) that satisfies another query
`db.collections.update({"Team": "Atlanta Hawks*"}, {$set: {"teamId":"1"}},false,true)`
where collections is the collection name
