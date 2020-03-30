// TeamList data array for filling in info box
var teamListData = [];
var gameListData = [];
var currentlySelected = "1";

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the team table on initial page load
  populateTeamTable();

  // Populate the game table on initial page load
  populateGameTable();

  $('#teamCard1').on('click', function() {
    currentlySelected = "1";
    $('.card1').css({"box-shadow": "0 8px 32px 0 rgba(61, 193, 252, 1)"});
    $('.card2').css({"box-shadow": "0 4px 8px 0 rgba(0,0,0,0.2)"});
    $('.card2:hover').css({"box-shadow": "0 8px 16px 0 rgba(0,0,0,0.5)"});
  });

  $('#teamCard2').on('click', function() {
    currentlySelected = "2";
    $('.card2').css({"box-shadow": "0 8px 32px 0 rgba(61, 193, 252, 1)"});
    $('.card1').css({"box-shadow": "0 4px 8px 0 rgba(0,0,0,0.2)"});
    $('.card1:hover').css({"box-shadow": "0 8px 16px 0 rgba(0,0,0,0.5)"});
  });

  $('#teamList table tbody').on('click', 'td a.linkshowteam', fillCard);


  // Predict button click
  $('#btnPredict').on('click', predict);

  // Get Stats button click
  $('#btnGetStats').on('click', getStats);

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

// Fill game table with data
function populateGameTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/games/allGames', function ( data ) {
    gameListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.id + '">' + this.id + '</a></td>';
      tableContent += '<td>'+ this.date.split("T")[0] + '</td>';
      tableContent += '<td>'+ this.home_team.full_name + '</td>';
      tableContent += '<td>'+ this.home_team_score + '</td>';
      tableContent += '<td>'+ this.visitor_team.full_name + '</td>';
      tableContent += '<td>'+ this.visitor_team_score + '</td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#gameList table tbody').html(tableContent);
  });
};

function setCurrentlySelected(cardNumber) {
  currentlySelected = cardNumber;
}

function fillCard(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve username from link rel attribute
  var thisTeamName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = teamListData.map(function(arrayItem) { return arrayItem.fullName; }).indexOf(thisTeamName);

  // Get our Team Object
  var thisTeamObject = teamListData[arrayPosition];

  var teamLogo = '#teamLogo' + currentlySelected;
  var teamName = '#card' + currentlySelected + 'TeamName';
  $(teamLogo).css({"max-width":"200px", "max-height":"200px"});
  $(teamLogo).attr('src', thisTeamObject.logo);
  $(teamName).css({"border": "1px solid #CCC", "background": "rgba(80,120,255,0.05)"});
  $(teamName).text(thisTeamObject.fullName);
};

function predict(event) {

}

function getStats(event) {

  // jQuery AJAX call for JSON
  $.getJSON( '/stats/allGames', function ( data ) {
    gameListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.id + '">' + this.id + '</a></td>';
      tableContent += '<td>'+ this.date.split("T")[0] + '</td>';
      tableContent += '<td>'+ this.home_team.full_name + '</td>';
      tableContent += '<td>'+ this.home_team_score + '</td>';
      tableContent += '<td>'+ this.visitor_team.full_name + '</td>';
      tableContent += '<td>'+ this.visitor_team_score + '</td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#gameList table tbody').html(tableContent);
  });

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve username from link rel attribute
  var thisTeamName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = teamListData.map(function(arrayItem) { return arrayItem.full_name; }).indexOf(thisTeamName);

  // Get our Team Object
  var thisTeamObject = teamListData[arrayPosition];

  

  // Populate Info Box
  $('#teamAbbreviation1').text(thisTeamObject.abbreviation);
  $('#teamCity1').text(thisTeamObject.city);
  $('#teamConference1').text(thisTeamObject.conference);
  $('#teamDivision1').text(thisTeamObject.division);

}




