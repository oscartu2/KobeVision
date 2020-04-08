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

- (Top 12) Team PER
-- From https://www.stat.berkeley.edu/~aldous/Research/Ugrad/Stanley_Yang%20_Thesis.pdf
-- Uses Player Efficiency Ratings of the top 12 players in terms of minutes for current team's season
-- First calculate adjusted PER for every player
-- Multiply individual PER by their total minutes played 
-- Sum all of this together to get a team PER

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
where database_name, collection_name, and file_name are all specified

- Adding a field (column) that satisfies another query
`db.collections.update({"Team": "Atlanta Hawks*"}, {$set: {"teamId":"1"}},false,true)`
where collections is the collection name
