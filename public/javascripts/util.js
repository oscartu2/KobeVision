// Variables and lookup tables

let id_to_hex = {
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

let id_to_rgba_fade = {
				"1":"rgba(224, 58, 62, 0.2)",
				"2":"rgba(0, 122, 51, 0.2)",
				"4":"rgba(0, 0, 0, 0.2)",
				"5":"rgba(0, 120, 140, 0.2)",
				"6":"rgba(206, 17, 65, 0.2)",
				"7":"rgba(134, 0, 56, 0.2)",
				"8":"rgba(0, 83, 140, 0.2)",
				"9":"rgba(254, 197, 36, 0.2)",
				"10":"rgba(200, 16, 46, 0.2)",
				"11":"rgba(29, 66, 138, 0.2)",
				"14":"rgba(206, 17, 65, 0.2)",
				"15":"rgba(253, 187, 48, 0.2)",
				"16":"rgba(190, 192, 194, 0.2)",
				"17":"rgba(85, 37, 131, 0.2)",
				"19":"rgba(93, 118, 169, 0.2)",
				"20":"rgba(152, 0, 46, 0.2)",
				"21":"rgba(0, 71, 27, 0.2)",
				"22":"rgba(35, 97, 146, 0.2)",
				"23":"rgba(12, 35, 64, 0.2)",
				"24":"rgba(245, 132, 38, 0.2)",
				"25":"rgba(0, 122, 193, 0.2)",
				"26":"rgba(0, 119, 192, 0.2)",
				"27":"rgba(0, 107, 182, 0.2)",
				"28":"rgba(29, 17, 96, 0.2)",
				"29":"rgba(224, 58, 62, 0.2)",
				"30":"rgba(90, 45, 129, 0.2)",
				"31":"rgba(196, 206, 212, 0.2)",
				"38":"rgba(206, 17, 65, 0.2)",
				"40":"rgba(0, 43, 92, 0.2)",
				"41":"rgba(227, 24, 55, 0.2)"
}

let id_to_rgba_hover = {
				"1":"rgba(224, 58, 62, 0.8)",
				"2":"rgba(0, 122, 51, 0.8)",
				"4":"rgba(0, 0, 0, 0.8)",
				"5":"rgba(0, 120, 140, 0.8)",
				"6":"rgba(206, 17, 65, 0.8)",
				"7":"rgba(134, 0, 56, 0.8)",
				"8":"rgba(0, 83, 140, 0.8)",
				"9":"rgba(254, 197, 36, 0.8)",
				"10":"rgba(200, 16, 46, 0.8)",
				"11":"rgba(29, 66, 138, 0.8)",
				"14":"rgba(206, 17, 65, 0.8)",
				"15":"rgba(253, 187, 48, 0.8)",
				"16":"rgba(190, 192, 194, 0.8)",
				"17":"rgba(85, 37, 131, 0.8)",
				"19":"rgba(93, 118, 169, 0.8)",
				"20":"rgba(152, 0, 46, 0.8)",
				"21":"rgba(0, 71, 27, 0.8)",
				"22":"rgba(35, 97, 146, 0.8)",
				"23":"rgba(12, 35, 64, 0.8)",
				"24":"rgba(245, 132, 38, 0.8)",
				"25":"rgba(0, 122, 193, 0.8)",
				"26":"rgba(0, 119, 192, 0.8)",
				"27":"rgba(0, 107, 182, 0.8)",
				"28":"rgba(29, 17, 96, 0.8)",
				"29":"rgba(224, 58, 62, 0.8)",
				"30":"rgba(90, 45, 129, 0.8)",
				"31":"rgba(196, 206, 212, 0.8)",
				"38":"rgba(206, 17, 65, 0.8)",
				"40":"rgba(0, 43, 92, 0.8)",
				"41":"rgba(227, 24, 55, 0.8)"
}

let id_to_rgba_border = {
				"1":"rgba(224, 58, 62, 1)",
				"2":"rgba(0, 122, 51, 1)",
				"4":"rgba(0, 0, 0, 1)",
				"5":"rgba(0, 120, 140, 1)",
				"6":"rgba(206, 17, 65, 1)",
				"7":"rgba(134, 0, 56, 1)",
				"8":"rgba(0, 83, 140, 1)",
				"9":"rgba(254, 197, 36, 1)",
				"10":"rgba(200, 16, 46, 1)",
				"11":"rgba(29, 66, 138, 1)",
				"14":"rgba(206, 17, 65, 1)",
				"15":"rgba(253, 187, 48, 1)",
				"16":"rgba(190, 192, 194, 1)",
				"17":"rgba(85, 37, 131, 1)",
				"19":"rgba(93, 118, 169, 1)",
				"20":"rgba(152, 0, 46, 1)",
				"21":"rgba(0, 71, 27, 1)",
				"22":"rgba(35, 97, 146, 1)",
				"23":"rgba(12, 35, 64, 1)",
				"24":"rgba(245, 132, 38, 1)",
				"25":"rgba(0, 122, 193, 1)",
				"26":"rgba(0, 119, 192, 1)",
				"27":"rgba(0, 107, 182, 1)",
				"28":"rgba(29, 17, 96, 1)",
				"29":"rgba(224, 58, 62, 1)",
				"30":"rgba(90, 45, 129, 1)",
				"31":"rgba(196, 206, 212, 1)",
				"38":"rgba(206, 17, 65, 1)",
				"40":"rgba(0, 43, 92, 1)",
				"41":"rgba(227, 24, 55, 1)"
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

// Functions

function calculateAge(dob) { 
    var date_array = dob.split("-")
    var years_elapsed = (new Date() - new Date(date_array[0],date_array[1],date_array[2]))/(MILLISECONDS_IN_A_YEAR);
    return parseInt(years_elapsed);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}