let id_to_color = {
				"1":"#E03A3E",
				"2":"#007A33",
				"4":"#000000",
				"5":"#00788C",
				"6":"#CE1141",
				"7":"#860038",
				"8":"#00538C",
				"9":"#FEC524",
				"10":"#C8102E",
				"11":"#1D428A",
				"14":"#CE1141",
				"15":"#FDBB30",
				"16":"#BEC0C2",
				"17":"#552583",
				"19":"#5D76A9",
				"20":"#98002E",
				"21":"#00471B",
				"22":"#236192",
				"23":"#0C2340",
				"24":"#F58426",
				"25":"#007AC1",
				"26":"#0077C0",
				"27":"#006BB6",
				"28":"#1D1160",
				"29":"#E03A3E",
				"30":"#5A2D81",
				"31":"#C4CED4",
				"38":"#CE1141",
				"40":"#002B5C",
				"41":"#E31837"
}
let welcomeMessage = "Welcome to KobeVision! To start, click on the home card, then select a team. Then, click on the away card, and select another team. Change the years in the drop down if you wish, and then choose a prediction method!";
let methodDescriptions = {
						0: welcomeMessage,
						1: "Predicts the winning team by using each team's win loss ratio as their chances of winning",
						2: "Selects the winning team by summing up the top 5 players per team by minutes multiplied by their <a href=\"https://en.wikipedia.org/wiki/Player_efficiency_rating\">Player Efficiency Ratings</a>",
						3: "Selects the winning team by summing up the top 12 players per team by minutes multiplied by their <a href=\"https://en.wikipedia.org/wiki/Player_efficiency_rating\">Player Efficiency Ratings</a>",
						4: "Selects the winning team with the higher <a href=\"https://www.basketball-reference.com/blog/indexba52.html?p=39\">Simple Rating System</a> score. <br><br>The SRS is defined as: a team rating that takes into account average point differential and strength of schedule. The rating is denominated in points above/below average, where zero is average.",
						5: "Predicts the winning team by using <a href=\"https://fivethirtyeight.com/methodology/how-our-nba-predictions-work/\">538's CARM-ELO rating</a>. <br><br>The CARM-ELO rating uses each team's Offensive Rating and Defensive Rating with some calculation to get Projected Points Scored and Projected Points Allowed, respectively, which then produces a generic expected \"winning percentage\" via the <a href=\"https://en.wikipedia.org/wiki/Pythagorean_expectation#Use_in_basketball\">Pythagorean expectation</a>. <br><br>This is then converted into an <a href=\"https://en.wikipedia.org/wiki/Elo_rating_system#Mathematical_details\">ELO rating</a> and then calculating the winning probability of the home team."
					}

