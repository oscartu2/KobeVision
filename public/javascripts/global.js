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
    populatePlayerTable(teamId, teamName, year);
  });

  $('#showPlayers2').on('click', function() {
    var teamName = document.getElementById('card2TeamName').textContent;
    var teamId = teamToId[teamName];
    var yearElement = document.getElementById('card2Year');
    var year = yearElement.options[yearElement.selectedIndex].text;
    populatePlayerTable(teamId, teamName, year);
  });

  $('#predictButton').on('click', function() {
    var card1 = document.getElementById('card1Year').innerHTML;
    var card2 = document.getElementById('card2Year').innerHTML;
    if (card1 === null || card2 === null || card1 === "" || card2 === "") {
      $('#predictionMethod').text("Please choose 2 teams");
    } else {
      var methodElement = document.getElementById('methods');
      var method = methodElement.options[methodElement.selectedIndex].text;
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
        $('#predictionMethod').text(probability[getRandomInt(probability.length)]);
      } else if (methodElement.selectedIndex === 2) {

      }
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
function populatePlayerTable(teamId, teamName, season) {

  $('#playerList h2').html("Players List: " + teamName);

  // Empty content string
  var tableContent = '';
  // jQuery AJAX call for JSON
  $.getJSON( '/db/roster/' + teamId + "/" + season, function ( data ) {
    // teamListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function() {
      console.log(this);
    //   if (this.leagues && this.leagues.standard && this.leagues.standard.active === "1") {
    //     tableContent += '<tr>';
    //     tableContent += '<td>' + this.playerId + '</td>';
    //     tableContent += '<td>' + this.firstName + '</td>';
    //     tableContent += '<td>' + this.lastName + '</td>';
    //     tableContent += '<td>' + this.leagues.standard.jersey + '</td>';
    //     tableContent += '<td>' + this.leagues.standard.pos + '</td>';
    //     tableContent += '<td>' + new Date(this.dateOfBirth).toString().substring(4,15) + ' (' + calculateAge(this.dateOfBirth) + ')</td>';
    //     tableContent += '<td>' + this.heightInMeters + '</td>';
    //     tableContent += '<td>' + this.weightInKilograms + '</td>';
    //     tableContent += '<td>' + this.startNba + '</td>';
    //     tableContent += '<td>' + this.collegeName + '</td>';
    //     tableContent += '<td>' + this.affiliation + '</td>';
    //     tableContent += '</tr>';
    //   }
    // });
  });

    // Inject the whole content string into our existing HTML table
    $('#playerList table tbody').html(tableContent);
  });
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
  var teamInfo = '#card' + currentlySelected + 'Info';
  var teamYear = 'card' + currentlySelected + 'Year';
  $(teamLogo).css({"max-width":"200px", "max-height":"200px"});
  $(teamLogo).attr('src', thisTeamObject.logo);
  $(teamName).text(thisTeamObject.fullName);
  $(teamPlayers).css({'position': 'absolute', 'display': 'inline', 'left': '7em', 'top':'50em'});
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
}

function calculateAge(dob) { 
    var date_array = dob.split('-')
    var years_elapsed = (new Date() - new Date(date_array[0],date_array[1],date_array[2]))/(MILLISECONDS_IN_A_YEAR);
    return parseInt(years_elapsed);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

