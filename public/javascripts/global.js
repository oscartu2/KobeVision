// TeamList data array for filling in info box
var teamListData = [];
var gameListData = [];
var currentlySelected = "1";
var currentTeamId = "";
var currentTeamName = "";
var MILLISECONDS_IN_A_YEAR = 1000*60*60*24*365;

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

  $('#teamCard1').on('click', )

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

  $('#teamList table tbody').on('click', 'td a.linkshowteam', fillCard);


  // Predict button click
  $('#showPlayers1').on('click', function() {
    populatePlayerTable(currentTeamId);

  });

  $('#showPlayers2').on('click', function() {
    populatePlayerTable(currentTeamId);
  });

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

// Fill Team table with data
function populatePlayerTable(teamId) {

  $('#playerList h2').html("Players List: " + currentTeamName);

  // Empty content string
  var tableContent = '';
  // jQuery AJAX call for JSON
  $.getJSON( '/teams/allPlayers/' + teamId, function ( data ) {
    // teamListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function() {
      if (this.leagues && this.leagues.standard && this.leagues.standard.active === "1") {
        tableContent += '<tr>';
        tableContent += '<td>' + this.playerId + '</td>';
        tableContent += '<td>' + this.firstName + '</td>';
        tableContent += '<td>' + this.lastName + '</td>';
        tableContent += '<td>' + this.leagues.standard.jersey + '</td>';
        tableContent += '<td>' + this.leagues.standard.pos + '</td>';
        tableContent += '<td>' + new Date(this.dateOfBirth).toString().substring(4,15) + ' (' + calculateAge(this.dateOfBirth) + ')</td>';
        tableContent += '<td>' + this.heightInMeters + '</td>';
        tableContent += '<td>' + this.weightInKilograms + '</td>';
        tableContent += '<td>' + this.startNba + '</td>';
        tableContent += '<td>' + this.collegeName + '</td>';
        tableContent += '<td>' + this.affiliation + '</td>';
        tableContent += '</tr>';
      }
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
  $(teamPlayers).css({'position': 'absolute', 'display': 'inline', 'left': '7em', 'top':'42em'});
  $('.container' + currentlySelected).css({"border": "1px solid #CCC", "background": "rgba(80,120,255,0.05)"});
  $(teamInfo).text("TEAM EFFICIENCY RATING: 50\n WIN AVG \n LOSE AVG");
  
  var yearElement = document.getElementById(teamYear);
  var seasons = 20;
  for (var i = 0; i < seasons; i++) {
    var newOption = document.createElement("option");
    if (i < 10) {
      newOption.text = "200" + i;
    } else {
      newOption.text = "20" + i;
    }
    yearElement.add(newOption);
  };
};

function predict(event) {

}

function calculateAge(dob) { 
    var date_array = dob.split('-')
    var years_elapsed = (new Date() - new Date(date_array[0],date_array[1],date_array[2]))/(MILLISECONDS_IN_A_YEAR);
    return parseInt(years_elapsed);
}


