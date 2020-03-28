// TeamList data array for filling in info box
var teamListData = [];
var gameListData = [];
var currentlySelected = 1;
// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the team table on initial page load
  populateTeamTable();

  // Populate the game table on initial page load
  populateGameTable();

  $('#teamInfo1 p').on('click', console.log("team1"));
  $('#teamInfo2 p').on('click', console.log("team2"));

  // Select team 1
  $('#teamList table tbody').on('click', 'td a.linkshowteam', showTeamInfo);


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
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.id + '">' + this.id + '</a></td>';
      tableContent += '<td><a href="#" class="linkshowteam" rel="' + this.full_name + '">' + this.full_name + '</a></td>';
      tableContent += '</tr>';
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

// Show Team Info
function showTeamInfo(event) {

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
};

// Show Team Info
function showTeamInfo2(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve username from link rel attribute
  var thisTeamName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = teamListData.map(function(arrayItem) { return arrayItem.full_name; }).indexOf(thisTeamName);

  // Get our Team Object
  var thisTeamObject = teamListData[arrayPosition];

  // Populate Info Box
  $('#teamAbbreviation2').text(thisTeamObject.abbreviation);
  $('#teamCity2').text(thisTeamObject.city);
  $('#teamConference2').text(thisTeamObject.conference);
  $('#teamDivision2').text(thisTeamObject.division);
};

function predict(team1, team2) {
  console.log("ADAM!");
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




