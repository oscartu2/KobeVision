# KobeVision
Welcome to my CPSC 448 Directed Studies project!

This is a web app built with (currently) Express, JavaScript, and Jade. 
The goal of it is to use open source NBA APIs to gather NBA Game, Team, and Player data and use it to pitch
two teams against each other and predict a winner.

# Starting MongoDB
`mongod --dbpath ~/Users/username/Desktop/path/to/data`

# Adding something into MongoDB instance
In data/ directory, open shell and execute:
`mongoimport -d database_name -c collection_name --type CSV --file file_name.csv --headerline`
where database_name, collection_name, and file_name are all specified

# Adding a field (column) that satisfies another query
`db.teams.update({"Team": "Atlanta Hawks*"}, {$set: {"teamId":"1"}},false,true)`