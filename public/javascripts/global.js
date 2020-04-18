// TeamList data array for filling in info box
var currentlySelected = "1";
var currentTeamId = "";
var currentTeamName = "";
var currentSeason = "";
var stats1 = {};
var stats2 = {};
var teamToId = {};
const MILLISECONDS_IN_A_YEAR = 1000*60*60*24*365;

var probability = [];


// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the team table on initial page load
  populateTeamTable();

  drawRadar();
  $('#teamCard1').on('click', function() {
    currentlySelected = "1";
    $('.card1').css({"border":"5px solid #CCC"});
    $('.card2').css({"border":"0px solid #CCC"});
    $('.card2:hover').css({"box-shadow": "0 8px 16px 0 rgba(0,0,0,0.5)"});
  });

  $('#teamCard2').on('click', function() {
    currentlySelected = "2";
    $('.card2').css({"border":"5px solid #CCC"});
    $('.card1').css({"border":"0px solid #CCC"});
    $('.card1:hover').css({"box-shadow": "0 8px 16px 0 rgba(0,0,0,0.5)"});
  });

  $(document).on('change','.dropdown-content', function() {
    var methodElement = document.getElementById('methods');
    var method = methodElement.options[methodElement.selectedIndex].text;
    $('#predictionMethod').text(this.value);
  });

  $(document).on('change', '.card1Years', function () {
    var yearElement = document.getElementById('card1Year');
    var year = yearElement.options[yearElement.selectedIndex].text;
    var id = teamToId[document.getElementById('card1TeamName').textContent];
    getStatistics('1', '#card1Info', id, year);
  });

  $(document).on('change', '.card2Years', function () {
    var yearElement = document.getElementById('card2Year');
    var year = yearElement.options[yearElement.selectedIndex].text;
    var id = teamToId[document.getElementById('card2TeamName').textContent];
    getStatistics('2', '#card2Info', id, year);
  });

  $('#teamList table tbody').on('click', 'td a.linkshowteam', fillCard);


  // Show Players button click
  $('#showPlayers1').on('click', function() {
    var teamName = document.getElementById('card1TeamName').textContent;
    var teamId = teamToId[teamName];
    var yearElement = document.getElementById('card1Year');
    var year = yearElement.options[yearElement.selectedIndex].text;
    populateInfoTable('ROSTER',teamId, teamName, year);
  });

  $('#showPlayers2').on('click', function() {
    var teamName = document.getElementById('card2TeamName').textContent;
    var teamId = teamToId[teamName];
    var yearElement = document.getElementById('card2Year');
    var year = yearElement.options[yearElement.selectedIndex].text;
    populateInfoTable('ROSTER',teamId, teamName, year);
  });

  // Show Advanced stats button click
  $('#showAdvancedStats1').on('click', function() {
    var teamName = document.getElementById('card1TeamName').textContent;
    var teamId = teamToId[teamName];
    var yearElement = document.getElementById('card1Year');
    var year = yearElement.options[yearElement.selectedIndex].text;
    populateInfoTable('ADVANCED',teamId, teamName, year);
  });
  
  $('#showAdvancedStats2').on('click', function() {
    var teamName = document.getElementById('card2TeamName').textContent;
    var teamId = teamToId[teamName];
    var yearElement = document.getElementById('card2Year');
    var year = yearElement.options[yearElement.selectedIndex].text;
    populateInfoTable('ADVANCED',teamId, teamName, year);
  });


  $('#predictButton').on('click', function() {
    var card1 = document.getElementById('card1Year').innerHTML;
    var card2 = document.getElementById('card2Year').innerHTML;
    if (card1 === null || card2 === null || card1 === "" || card2 === "") {
      $('#predictionMethod').text("Please choose 2 teams");
    } else {
      var methodElement = document.getElementById('methods');
      var method = methodElement.options[methodElement.selectedIndex].text;
      let winner = "";
      if (methodElement.selectedIndex === 1) {
        probability = [];
        var total = Number((stats1["WLR"]*1000).toFixed(0)) + Number((stats2["WLR"]*1000).toFixed(0));
        for (var i = 0; i < Number((stats1["WLR"]*1000).toFixed(0)); i++) {
          probability.push(stats1["NAME"]);
        }
        for (var i = probability.length - 1; i < total; i++) {
          probability.push(stats2["NAME"]);
        }
        console.log(stats1);
        console.log(stats2);
        $('#predictionMethod').empty();
        winner = probability[getRandomInt(probability.length)];
      } else if (methodElement.selectedIndex === 2) {
        $('#predictionMethod').empty();
        if (stats1["top5per"] > stats2["top5per"]) {
          winner = stats1["NAME"];
        } else if (stats2["top5per"] > stats1["top5per"]) {
          winner = stats2["NAME"]
        } else {
          winner = "Tie! Lol";
        }
      } else if (methodElement.selectedIndex === 3) {
        $('#predictionMethod').empty();
        if (stats1["top12per"] > stats2["top12per"]) {
          winner = stats1["NAME"];
        } else if (stats2["top12per"] > stats1["top12per"]) {
          winner = stats2["NAME"]
        } else {
          winner = "Tie! Lol";
        }
      }
      $('#predictionMethod').text(winner);
    }
  })

});

// Functions =============================================================

// Fill Team table with data
function populateTeamTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/teams/allTeams', function ( data ) {
    teamListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function() {
      if (this.nbaFranchise === "1" && this.teamId !== "37") {
        teamToId[this.fullName] = this.teamId;
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.teamId + '">' + this.teamId + '</a></td>';
        tableContent += '<td><a href="#" class="linkshowteam" rel="' + this.fullName + '">' + this.fullName + '</a></td>';
        if (this.teamId === "10") {
          this.logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Pistons_logo17.svg/1024px-Pistons_logo17.svg.png";
        };
        tableContent += '<td><img src=' + this.logo + ' alt="Team Logo"></td>';
        tableContent += '</tr>';
      };
    });

    // Inject the whole content string into our existing HTML table
    $('#teamList table tbody').html(tableContent);
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
    /*Maybe update to 
    ['Rk', 'Name', 'Age', 'G', 'MP', 'PER', 'TS%', '3PAr', 'FTr', 'ORB%',
     'DRB%', 'TRB%', 'AST%', 'STL%', 'BLK%', 'TOV%', 'USG%', 'Unnamed: 17', 
     'OWS', 'DWS', 'WS', 'WS/48','Unnamed: 22', 'OBPM', 'DBPM', 'BPM', 'VORP']*/
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
  $('#infoList h2').html(title);
  $('#infoList table thead').html(tableHeaders);
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
        tableContent += '<tr>';
        if (!this.NUMBER) {
          tableContent += '<td>' + 'N/A' + '</td>';
        } else {
          tableContent += '<td>' + this.NUMBER + '</td>';
        }
        tableContent += '<td>' + this.PLAYER + '</td>';
        tableContent += '<td>' + this.POS + '</td>';
        tableContent += '<td>' + new Date(this.BIRTH_DATE).toString().substring(4,15) + ' (' + calculateAge(this.BIRTH_DATE) + ')</td>';
        tableContent += '<td>' + this.HEIGHT + '</td>';
        tableContent += '<td>' + this.WEIGHT + '</td>';
        if (this.EXPERIENCE === "R") {
          tableContent += '<td>' + 'Rookie' + '</td>';
        } else {
          tableContent += '<td>' + this.EXPERIENCE + '</td>';
        }
        tableContent += '<td>' + this.COLLEGE + '</td>';
        tableContent += '<td>' + this.NATIONALITY + '</td>';
        tableContent += '</tr>';
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
    $('#infoList table tbody').html(tableContent);
  });
  
  // Sorttable sorting on string not number
  let tableObject = document.getElementById("infoTable");
  sorttable.makeSortable(tableObject);
};

function fillCard(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve username from link rel attribute
  var thisTeamName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = teamListData.map(function(arrayItem) { return arrayItem.fullName; }).indexOf(thisTeamName);

  // Get our Team Object
  var thisTeamObject = teamListData[arrayPosition];


  currentTeamId = thisTeamObject.teamId;
  currentTeamName = thisTeamObject.fullName;

  var teamLogo = '#teamLogo' + currentlySelected;
  var teamName = '#card' + currentlySelected + 'TeamName';
  var teamPlayers = '#showPlayers' + currentlySelected;
  var teamAdvanced = '#showAdvancedStats' + currentlySelected;
  var teamInfo = '#card' + currentlySelected + 'Info';
  var teamYear = 'card' + currentlySelected + 'Year';
  $(teamLogo).css({"max-width":"200px", "max-height":"200px"});
  $(teamLogo).attr('src', thisTeamObject.logo);
  $(teamName).text(thisTeamObject.fullName);
  $(teamPlayers).css({'position': 'absolute', 'display': 'inline', 'left': '1.25em', 'top':'28.2em'});
  $(teamAdvanced).css({'position': 'absolute', 'display': 'inline', 'left': '9.8em', 'top':'28.2em'});
  $('.container' + currentlySelected).css({"border": "1px solid #CCC", "background": "rgba(80,120,255,0.05)"});

  var yearElement = document.getElementById(teamYear);
  var seasons = [];

  // Get seasons;
  $.getJSON('/db/seasons/' + currentTeamId, function (data) {
    $('#'+teamYear).empty();
    // Get all the seasons
    for (var row of data) {
      seasons.push(row.Season);
    }

    // Sort it by most recent season
    seasons.sort(function(a, b) {
      return Number(b.substring(0,4)) - Number(a.substring(0,4));
    });

    getStatistics(currentlySelected, teamInfo, currentTeamId, seasons[0]);

    $.each(seasons, function() {
      var newOption = document.createElement("option");
      newOption.text = this;
      yearElement.add(newOption);
    });
  });
};

function getStatistics(cardNumber, teamElement, id, season) {
  $.getJSON('/db/statistics/' + id + '/' + season, function (val) {
    // For some reason getJSON returns an array of one Object
    res = val[0];
    $(teamElement).empty();
    var wlr = "<p>Win Loss Ratio: " + res["W/L%"] + "</p>";
    var srs = "<p>Simple Rating: " + res["SRS"] + "</p>";
    var ortg = "<p>Offensive Rating: " + res["ORtg"] + " (" + res["Rel ORtg"] + ")" + "</p>";
    var drtg = "<p>Defensive Rating: " + res["DRtg"] + " (" + res["Rel DRtg"] + ")" + "</p>";
    if (cardNumber === "1") {
      stats1 = {"NAME": res["Team"].replace("*",""), "WLR": Number(res["W/L%"]), "SRS": Number(res["SRS"]), "ORtg": Number(res["ORtg"]), "DRtg": Number(res["DRtg"])}
    }
    if (cardNumber === "2") {
      stats2 = {"NAME": res["Team"].replace("*",""), "WLR": Number(res["W/L%"]), "SRS": Number(res["SRS"]), "ORtg": Number(res["ORtg"]), "DRtg": Number(res["DRtg"])}
    }
    $(teamElement).append(wlr, srs, ortg, drtg);
    probability = [];
  });

  $.getJSON("/db/roster/statistics/advanced/" + id + "/" + season, function(val) {

    let top5per = 0;
    let top12per = 0;
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

    // For Stanley Yang's paper of Top 12
    sortByMinutes.sort(function(a, b) {
      return Number(a["MINUTES_PLAYED"]) - Number(b["MINUTES_PLAYED"]);
    });

    for (let i = 0; i < 12; i++) {
      if (i < 5) {
        top5per += Number(sortByStarting[i]["PER"]) * Number(sortByStarting[i]["MINUTES_PLAYED"])
      }
      top12per += Number(sortByMinutes[i]["PER"]) * Number(sortByMinutes[i]["MINUTES_PLAYED"])
    }

    let per5 = "<p>Starting 5 PER: " + top5per.toFixed(2) + "</p>";
    let per12 = "<p>Top 12 Adjusted PER: " + top12per.toFixed(2) + "</p>";
    

    if (cardNumber === "1") {
      stats1["top5per"] = top5per;
      stats1["top12per"] = top12per;
    }
    if (cardNumber === "2") {
      stats2["top5per"] = top5per;
      stats2["top12per"] = top12per;
    }
    $(teamElement).append(per5, per12);
  });
}

function calculateAge(dob) { 
    var date_array = dob.split('-')
    var years_elapsed = (new Date() - new Date(date_array[0],date_array[1],date_array[2]))/(MILLISECONDS_IN_A_YEAR);
    return parseInt(years_elapsed);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function drawRadar() {
  /* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */
      
  ////////////////////////////////////////////////////////////// 
  //////////////////////// Set-Up ////////////////////////////// 
  ////////////////////////////////////////////////////////////// 
  var marginVals = 150
  var margin = {top: marginVals, right: marginVals, bottom: marginVals, left: marginVals},
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
      
  ////////////////////////////////////////////////////////////// 
  ////////////////////////// Data ////////////////////////////// 
  ////////////////////////////////////////////////////////////// 
  // To make it all fit on a radar chart, scale data:
  // WLR = WLR * 1000
  // SRS = SRS * 100
  // Last 2: FTr and 3ptr from Team-misc, multiply by 1000
  // Normalize data to be out of 100%
  var data = [
        [//2019-20 Lakers
        {axis:"Win Loss Ratio",value:0.778},
        {axis:"Simple Rating System",value:7.75/10},
        //{axis:"Pace factor (Pos/48min)",value:100.9},
        //{axis:"Offensive Rating",value:113.0},
        //{axis:"Defensive Rating",value:105.6},
        {axis:"Free Throw Attempt Rate",value:0.268},
        {axis:"3-Pt Attempt Rate",value:0.355}   
        ],[//2019-20 Raptors
        {axis:"Win Loss Ratio",value:0.719},
        {axis:"Simple Rating System",value:5.88/10},
        // {axis:"Pace factor (Pos/48min)",value:100.6},
        // {axis:"Offensive Rating",value:111.6},
        // {axis:"Defensive Rating",value:105.2},
        {axis:"Free Throw Attempt Rate",value:0.256},
        {axis:"3-Pt Attempt Rate",value:0.418}
        ]
      ];
  ////////////////////////////////////////////////////////////// 
  //////////////////// Draw the Chart ////////////////////////// 
  ////////////////////////////////////////////////////////////// 

  var color = d3.scale.ordinal()
    .range(["#EDC951","#CC333F","#00A0B0"]);
    
  var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 1,
    levels: 5,
    roundStrokes: true,
    color: color
  };
  //Call function to draw the Radar chart
  RadarChart(".radarChart", data, radarChartOptions);
}
