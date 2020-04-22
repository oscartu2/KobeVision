// TeamList data array for filling in info box
var currentlySelected = "1";
var currentTeamId = "";
var currentTeamName = "";
var currentSeason = "";
var stats1 = {};
var stats2 = {};
var leagueAvgStats = {};
var teamToId = {};
const MILLISECONDS_IN_A_YEAR = 1000*60*60*24*365;
var probability = [];
var radarChart = null;
var barChart = null;
var pieChart = null;


// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the team table on initial page load
  populateTeamTable();
  // alert(welcomeMessage);
  $("#predictionMethod").html(welcomeMessage);
  initCharts();
  $("#teamCard1").on("click", function() {
    currentlySelected = "1";
    $(".card1").css({"border":"5px solid #CCC"});
    $(".card2").css({"border":"0px solid #CCC"});
    $(".card2:hover").css({"box-shadow": "0 8px 16px 0 rgba(0,0,0,0.5)"});
  });

  $("#teamCard2").on("click", function() {
    currentlySelected = "2";
    $(".card2").css({"border":"5px solid #CCC"});
    $(".card1").css({"border":"0px solid #CCC"});
    $(".card1:hover").css({"box-shadow": "0 8px 16px 0 rgba(0,0,0,0.5)"});
  });

  $(document).on("change",".dropdown-content", function() {
    var methodElement = document.getElementById("methods");
    let idx = methodElement.selectedIndex;
    var method = methodElement.options[methodElement.selectedIndex].text;
    $("#predictionMethod").empty();
    pieChartVisibility("hidden", "");
    $("#predictionMethod").html(methodDescriptions[idx]);
  });

  $(document).on("change", ".card1Years", function () {
    currentlySelected = "1";
    $(".card1").css({"border":"5px solid #CCC"});
    $(".card2").css({"border":"0px solid #CCC"});
    $(".card2:hover").css({"box-shadow": "0 8px 16px 0 rgba(0,0,0,0.5)"});
    var yearElement = document.getElementById("card1Year");
    var year = yearElement.options[yearElement.selectedIndex].text;
    var id = teamToId[document.getElementById("card1TeamName").textContent];
    getStatistics(stats1, "#card1Info", id, year);
  });

  $(document).on("change", ".card2Years", function () {
    currentlySelected = "2";
    $(".card2").css({"border":"5px solid #CCC"});
    $(".card1").css({"border":"0px solid #CCC"});
    $(".card1:hover").css({"box-shadow": "0 8px 16px 0 rgba(0,0,0,0.5)"});
    var yearElement = document.getElementById("card2Year");
    var year = yearElement.options[yearElement.selectedIndex].text;
    var id = teamToId[document.getElementById("card2TeamName").textContent];
    getStatistics(stats2, "#card2Info", id, year);
  });

  $("#teamList table tbody").on("click", "td a.linkshowteam", fillCard);


  // Show Players button click
  $("#showPlayers1").on("click", function() {
    var teamName = document.getElementById("card1TeamName").textContent;
    var teamId = teamToId[teamName];
    var yearElement = document.getElementById("card1Year");
    var year = yearElement.options[yearElement.selectedIndex].text;
    populateInfoTable("ROSTER",teamId, teamName, year);
  });

  $("#showPlayers2").on("click", function() {
    var teamName = document.getElementById("card2TeamName").textContent;
    var teamId = teamToId[teamName];
    var yearElement = document.getElementById("card2Year");
    var year = yearElement.options[yearElement.selectedIndex].text;
    populateInfoTable("ROSTER",teamId, teamName, year);
  });

  // Show Advanced stats button click
  $("#showAdvancedStats1").on("click", function() {
    var teamName = document.getElementById("card1TeamName").textContent;
    var teamId = teamToId[teamName];
    var yearElement = document.getElementById("card1Year");
    var year = yearElement.options[yearElement.selectedIndex].text;
    populateInfoTable("ADVANCED",teamId, teamName, year);
  });
  
  $("#showAdvancedStats2").on("click", function() {
    var teamName = document.getElementById("card2TeamName").textContent;
    var teamId = teamToId[teamName];
    var yearElement = document.getElementById("card2Year");
    var year = yearElement.options[yearElement.selectedIndex].text;
    populateInfoTable("ADVANCED",teamId, teamName, year);
  });


  $("#predictButton").on("click", function() {
    var card1 = document.getElementById("card1Year").innerHTML;
    var card2 = document.getElementById("card2Year").innerHTML;
    if (card1 === null || card2 === null || card1 === "" || card2 === "") {
      alert("Please choose 2 teams")
    } else {
      $("#predictionMethod").empty();
      var methodElement = document.getElementById("methods");
      var method = methodElement.options[methodElement.selectedIndex].text;
      let winner = "";
      let winProbability = 0;
      let probability = [];
      if (methodElement.selectedIndex === 0) {
        alert("Please select a prediction method");
      } else if (methodElement.selectedIndex === 1) {
        var total = Number((stats1["WLR"]*1000).toFixed(0)) + Number((stats2["WLR"]*1000).toFixed(0));
        for (var i = 0; i < Number((stats1["WLR"]*1000).toFixed(0)); i++) {
          probability.push(stats1);
        }
        winProbability = (probability.length - 1)/total;
        for (var i = probability.length - 1; i < total; i++) {
          probability.push(stats2);
        }
        winner = probability[getRandomInt(probability.length)];
      } else if (methodElement.selectedIndex === 2) {
        if (stats1["PER5"] > stats2["PER5"]) {
          winner = stats1;
        } else if (stats2["PER5"] > stats1["PER5"]) {
          winner = stats2;
        } else {
          winner = [stats1, stats2][getRandomInt(1)];
        }
      } else if (methodElement.selectedIndex === 3) {
        if (stats1["PER12"] > stats2["PER12"]) {
          winner = stats1
        } else if (stats2["PER12"] > stats1["PER12"]) {
          winner = stats2;
        } else {
          winner = [stats1, stats2][getRandomInt(1)];
        }
      } else if (methodElement.selectedIndex === 4) {
        if (stats1["SRS"] > stats2["SRS"]) {
          winner = stats1;
        } else if (stats2["SRS"] > stats1["SRS"]) {
          winner = stats2;
        } else {
          winner = [stats1, stats2][getRandomInt(1)];
        }
      } else if (methodElement.selectedIndex === 5) {
        let regularSeason = true;
        let pythagoreanExponent = 14.3;
        let homeTeamORTG = stats1["ORTG"]*5;
        let homeTeamDRTG = stats1["DRTG"]*5;
        let awayTeamORTG = stats2["ORTG"]*5;
        let awayTeamDRTG = stats2["DRTG"]*5;
        if (regularSeason) {
          homeTeamORTG *= 0.8;
          homeTeamDRTG *= 0.8;
          awayTeamORTG *= 0.8;
          awayTeamDRTG *= 0.8;
        } else {
          homeTeamORTG *= 0.9;
          homeTeamDRTG *= 0.9;
          awayTeamORTG *= 0.8;
          awayTeamDRTG *= 0.8;
        }

        let homeProjectedPointsScored = (homeTeamORTG + leagueAvgStats["ORTG"])/100 * (82*stats1["PACE"]);
        let homeProjectedPointsAllowed = (leagueAvgStats["DRTG"] + homeTeamDRTG)/100 * (82*stats1["PACE"]);

        let homeWinningPct = Math.pow(homeProjectedPointsScored, pythagoreanExponent)/(Math.pow(homeProjectedPointsScored, pythagoreanExponent) + Math.pow(homeProjectedPointsAllowed, pythagoreanExponent));
        let homeCARMELO = 1504.6 - (450 * getBaseLog(10, ((1/homeWinningPct)-1)));
        
        let awayProjectedPointsScored = (awayTeamORTG + leagueAvgStats["ORTG"])/100 * (82*stats2["PACE"]);
        let awayProjectedPointsAllowed = (leagueAvgStats["DRTG"] + awayTeamDRTG)/100 * (82*stats2["PACE"]);
        let awayWinningPct = Math.pow(awayProjectedPointsScored, pythagoreanExponent)/(Math.pow(awayProjectedPointsScored, pythagoreanExponent) + Math.pow(awayProjectedPointsAllowed, pythagoreanExponent))
        let awayCARMELO = 1504.6 - (450 * getBaseLog(10, ((1/awayWinningPct)-1)));

        // From 538: but we also make adjustments for home-court advantage 
        // (the home team gets a boost of about 92 rating points), fatigue 
        // (teams that played the previous day are given a penalty of 46 rating points), 
        // travel (teams are penalized based on the distance they travel from their previous game) 
        // and altitude (teams that play at higher altitudes are given an extra bonus when they 
        // play at home, on top of the standard home-court advantage)
        // if (playedYesterday) += 46, if (higherAltitude) += altitudeDiff?
        let homeBonus = 92;
        let awayBonus = 0;
        let teamRatingDifferential = homeCARMELO - awayCARMELO;
        let bonusDifferential = homeBonus - awayBonus;
        winProbability = 1/(Math.pow(10,(((-1)*(teamRatingDifferential+bonusDifferential))/400))+1);
        var total = Number((winProbability*1000).toFixed(0)) + Number(((1-winProbability)*1000).toFixed(0));
        for (var i = 0; i < Number((winProbability*1000).toFixed(0)); i++) {
          probability.push(stats1);
        }
        for (var i = probability.length - 1; i < total; i++) {
          probability.push(stats2);
        }
        winner = probability[getRandomInt(probability.length)];
      }
      updatePieChart(pieChart, stats1, stats2, winProbability);
      var winnerId = winner["TEAMID"];
      var winnerLogo = document.getElementById("team" + winner["TEAMID"] + "Logo").src;
      var canvas = document.getElementById("pieChart");
      pieChartVisibility("visible", winnerLogo);
      $("#predictionMethod").text("Predicted winner: " + winner["TEAM"]);
    }
  });

});

// Functions =============================================================

// Fill Team table with data
function populateTeamTable() {

  // Empty content string
  var tableContent = "";

  // jQuery AJAX call for JSON
  $.getJSON( "/teams/allTeams", function ( data ) {
    teamListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function() {
      if (this.nbaFranchise === "1" && this.teamId !== "37") {
        teamToId[this.fullName] = this.teamId;
        tableContent += "<tr>";
        tableContent += "<td>" + this.teamId + "</td>";
        tableContent += "<td><a href=\"#\" class=\"linkshowteam\" rel=\"" + this.fullName + "\">" + this.fullName + "</a></td>";
        if (this.teamId === "10") {
          this.logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Pistons_logo17.svg/1024px-Pistons_logo17.svg.png";
        };
        tableContent += "<td><img src=" + this.logo + " id=\"team" + this.teamId + "Logo\" alt=\"Team Logo\"></td>";
        tableContent += "</tr>";
      };
    });

    // Inject the whole content string into our existing HTML table
    $("#teamList table tbody").html(tableContent);
  });
};

// Fill Team table with data
function populateInfoTable(option, teamId, teamName, season) {
  let endpointBase = "";
  let title = "";
  let tableHeaders = "";
  if (option === "ROSTER") {
    endpointBase = "/db/roster/";
    title = season + " " + teamName + " Roster";
    tableHeaders = "<tr>";
    tableHeaders += "<th>Number</th>";
    tableHeaders += "<th>Name</th>";
    tableHeaders += "<th>Position</th>";
    tableHeaders += "<th>Date of Birth (Age)</th>";
    tableHeaders += "<th>Height (ft)</th>";
    tableHeaders += "<th>Weight (lbs)</th>";
    tableHeaders += "<th>Experience</th>";
    tableHeaders += "<th>College</th>";
    tableHeaders += "<th>Nationality</th>";
    tableHeaders += "</tr>";
  } else if (option === "ADVANCED") {
    endpointBase = "/db/roster/statistics/advanced/";
    title = season + " " + teamName + " Advanced Stats";
    tableHeaders = "<tr>";
    tableHeaders += "<th>Rank</th>";
    tableHeaders += "<th>Name</th>";
    tableHeaders += "<th>Player Efficiency Rating (PER)</th>";
    tableHeaders += "<th>True Shooting Pct.</th>";
    tableHeaders += "<th>Total Rebound Pct.</th>";
    tableHeaders += "<th>Usage Pct.</th>";
    tableHeaders += "<th>Box Plus/Minus</th>";
    tableHeaders += "<th>Win Shares</th>";
    tableHeaders += "<th>Minutes Played</th>";
    tableHeaders += "</tr>";
  }
  $("#infoList h2").html(title);
  $("#infoList table thead").html(tableHeaders);
  // Empty content string
  let tableContent = "";
  // jQuery AJAX call for JSON
  $.getJSON(endpointBase + teamId + "/" + season, function (data) {
    if (option === "ADVANCED") {
      let players = [];
      for (var row of data) {
        players.push(row);
      }
      // Sort it by most recent season
      players.sort(function(a, b) {
        return Number(a["RANK"]) - Number(b["RANK"]);
      });
      data = players;
    }
    $.each(data, function() {
      if (option === "ROSTER") {
        tableContent += "<tr>";
        if (!this.NUMBER) {
          tableContent += "<td>" + "N/A" + "</td>";
        } else {
          tableContent += "<td>" + this.NUMBER + "</td>";
        }
        tableContent += "<td>" + this.PLAYER + "</td>";
        tableContent += "<td>" + this.POS + "</td>";
        tableContent += "<td>" + new Date(this.BIRTH_DATE).toString().substring(4,15) + " (" + calculateAge(this.BIRTH_DATE) + ")</td>";
        tableContent += "<td>" + this.HEIGHT + "</td>";
        tableContent += "<td>" + this.WEIGHT + "</td>";
        if (this.EXPERIENCE === "R") {
          tableContent += "<td>" + "Rookie" + "</td>";
        } else {
          tableContent += "<td>" + this.EXPERIENCE + "</td>";
        }
        tableContent += "<td>" + this.COLLEGE + "</td>";
        tableContent += "<td>" + this.NATIONALITY + "</td>";
        tableContent += "</tr>";
      } else if (option === "ADVANCED") {
        tableContent += "<tr>";
        tableContent += "<td>" + Number(this.RANK) + "</td>";
        tableContent += "<td>" + this.NAME + "</td>";
        tableContent += "<td>" + Number(this.PER) + "</td>";
        tableContent += "<td>" + (Number(this.TRUE_SHOOTING_PCT)*100).toFixed(1) + "%</td>";
        tableContent += "<td>" + this["TOTAL_RB%"] + "%</td>";
        tableContent += "<td>" + this["USG%"]+ "%</td>";
        tableContent += "<td>" + Number(this.BPM) + "</td>";
        tableContent += "<td>" + Number(this.WS) + "</td>";
        tableContent += "<td>" + Number(this.MINUTES_PLAYED) + "</td>";
        tableContent += "</tr>";
      }
  });
    // Inject the whole content string into our existing HTML table
    $("#infoList table tbody").html(tableContent);
  });
  
  // Sorttable sorting on string not number
  let tableObject = document.getElementById("infoTable");
  sorttable.makeSortable(tableObject);
};

function fillCard(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve username from link rel attribute
  var thisTeamName = $(this).attr("rel");

  // Get Index of object based on id value
  var arrayPosition = teamListData.map(function(arrayItem) { return arrayItem.fullName; }).indexOf(thisTeamName);

  // Get our Team Object
  var thisTeamObject = teamListData[arrayPosition];


  currentTeamId = thisTeamObject.teamId;
  currentTeamName = thisTeamObject.fullName;

  var teamLogo = "#teamLogo" + currentlySelected;
  var teamName = "#card" + currentlySelected + "TeamName";
  var teamPlayers = "#showPlayers" + currentlySelected;
  var teamAdvanced = "#showAdvancedStats" + currentlySelected;
  var teamInfo = "#card" + currentlySelected + "Info";
  var teamYear = "card" + currentlySelected + "Year";
  $(teamLogo).css({"max-width":"200px", "max-height":"200px"});
  $(teamLogo).attr("src", thisTeamObject.logo);
  $(teamName).text(thisTeamObject.fullName);
  $(teamPlayers).css({"position": "absolute", "display": "inline", "left": "1.25em", "top":"28.2em"});
  $(teamAdvanced).css({"position": "absolute", "display": "inline", "left": "9.8em", "top":"28.2em"});
  // $(".container" + currentlySelected).css({"border": "1px solid #CCC", "background": "rgba(80,120,255,0.05)"});

  var yearElement = document.getElementById(teamYear);
  var seasons = [];

  // Get seasons;
  $.getJSON("/db/seasons/" + currentTeamId, function (data) {
    $("#"+teamYear).empty();
    // Get all the seasons
    for (var row of data) {
      seasons.push(row.Season);
    }

    // Sort it by most recent season
    seasons.sort(function(a, b) {
      return Number(b.substring(0,4)) - Number(a.substring(0,4));
    });

    $.each(seasons, function() {
      var newOption = document.createElement("option");
      newOption.text = this;
      yearElement.add(newOption);
    });
    let stats = null;
    if (currentlySelected === "1") {
      stats = stats1;
    } else {
      stats = stats2;
    }
    getStatistics(stats, teamInfo, currentTeamId, seasons[0]);
  });
};

function getStatistics(stats, teamElement, id, season) {
  $.getJSON("/db/statistics/" + id + "/" + season, function (val) {
    // For some reason getJSON returns an array of one Object
    res = val[0];
    $(teamElement).empty();
    var wlr = "<p>Win Loss Ratio: " + res["W/L%"] + "</p>";
    var srs = "<p>Simple Rating: " + res["SRS"] + "</p>";
    var ORTG = "<p>Offensive Rating: " + res["ORtg"] + " (" + res["Rel ORtg"] + ")" + "</p>";
    var DRTG = "<p>Defensive Rating: " + res["DRtg"] + " (" + res["Rel DRtg"] + ")" + "</p>";
    var stats = null;
    $(teamElement).append(wlr, srs, ORTG, DRTG);
  });

  $.getJSON("/db/roster/statistics/misc/" + id + "/" + season, function(val) {
    res = val[0]; // res may have to be val[0][0] ???
    if (val[0][0] === undefined) {
      res = val[0];
    } else {
      res = val[0][0];
    }
    stats["TEAM"] = res["TEAM"].replace("*","");
    stats["WLR"] = (Number(res["WIN"])/(Number(res["WIN"])+Number(res["LOSS"])));
    stats["SRS"] = Number(res["SIMPLE_RATING_SYSTEM"]);
    stats["ORTG"] = Number(res["ORTG"]);
    stats["DRTG"] = Number(res["DRTG"]);
    stats["TS%"] = Number(res["TRUE_SHOOTING%"]);
    stats["ORB%"] = Number(res["ORB%"])/100;
    stats["OPP_DRB%"] = Number(res["OPP_DRB%"])/100;
    stats["3PTAr"] = Number(res["3PT_ATTEMPT_RATE"]);
    stats["FTAr"] = Number(res["FT_ATTEMPT_RATE"]);
    stats["PACE"] = Number(res["PACE"]);
    stats["TOV%"] = Number(res["TOV%"])/100;
    stats["FTFGA%"] = Number(res["FT_PER_FIELDGOALATTEMPT%"]);
    stats["OPP_FTFGA%"] = Number(res["OPP_FT_PER_FIELDGOALATTEMPT%"]);
    stats["MOV"] = Number(res["MARGIN_OF_VICTORY"]);
    stats["NRTG"] = Number(res["NETRTG"]);
    stats["TEAMID"] = ""+res["TEAMID"];
  });
  // Get league avg
  $.getJSON("/db/roster/statistics/misc/0/" + season, function(val) {
    res = val[0]; // res may have to be val[0][0] ???
    if (val[0][0] === undefined) {
      res = val[0];
    } else {
      res = val[0][0];
    }
    leagueAvgStats["ORTG"] = Number(res["ORTG"]);
    leagueAvgStats["DRTG"] = Number(res["DRTG"]);
  });

  $.getJSON("/db/roster/statistics/advanced/" + id + "/" + season, function(val) {

    let PER5 = 0;
    let PER12 = 0;
    let sortByStarting = [];
    let sortByMinutes = [];
    for (var row of val) {
      sortByMinutes.push(row);
      sortByStarting.push(row);
    }

    // For starting 5 PER
    sortByStarting.sort(function(a, b) {
      return Number(a["PER"]) - Number(b["PER"]);
    });

    // For Stanley Yang"s paper of Top 12
    sortByMinutes.sort(function(a, b) {
      return Number(a["MINUTES_PLAYED"]) - Number(b["MINUTES_PLAYED"]);
    });

    for (let i = 0; i < 12; i++) {
      if (i < 5) {
        PER5 += Number(sortByStarting[i]["PER"]) * Number(sortByStarting[i]["MINUTES_PLAYED"])
      }
      PER12 += Number(sortByMinutes[i]["PER"]) * Number(sortByMinutes[i]["MINUTES_PLAYED"])
    }

    let per5 = "<p>Starting 5 PER: " + PER5.toFixed(2) + "</p>";
    let per12 = "<p>Top 12 Adjusted PER: " + PER12.toFixed(2) + "</p>";
    

    stats["PER5"] = PER5;
    stats["PER12"] = PER12;
    updateCharts(currentTeamName, stats, id);
    $(teamElement).append(per5, per12);
  });
}
