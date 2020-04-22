function initCharts() {
  var ctx = document.getElementById('barChart');
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Simple Rating System", "Offensive Rating (/10)", "Defensive Rating (/10)", "Margin of Victory", "Pace (Poss./48mins) (/10)", "Net Rating "],
      datasets: [{label:"Home"},{label:"Away"}]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    autoSkip: false,
                    maxRotation: 35,
                    minRotation: 35
                }
            }]
        },
        // onHover: function () {
        //   console.log("WEWW");
        // }
        // tooltip: 
    }
  });
  barChart.canvas.parentNode.style.height = '375px';
  barChart.canvas.parentNode.style.width = '375px';
  var radarCtx = document.getElementById('radarChart');
  radarChart = new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ["WLR","FTAr","3PTAr","TS%", "ORB%", "OPP_DRB%", "TOV%"],
      datasets: [{label:"Home"},{label:"Away"}]
    }
  });
  var pieCtx = document.getElementById("pieChart");
  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ["Home", "Away"],
      datasets: [{
        data: [30, 100]
      }]
    },
    options: {
      cutoutPercentage: 0
    }
  });
}

function updateCharts(teamName, stats, id) {
  let bgHoverColor = [id_to_rgba_hover[id],id_to_rgba_hover[id],id_to_rgba_hover[id],id_to_rgba_hover[id],id_to_rgba_hover[id],id_to_rgba_hover[id],id_to_rgba_hover[id]];
  let bgColor = [id_to_rgba_fade[id],id_to_rgba_fade[id],id_to_rgba_fade[id],id_to_rgba_fade[id],id_to_rgba_fade[id],id_to_rgba_fade[id],id_to_rgba_fade[id]];
  let bdColor = [id_to_rgba_border[id],id_to_rgba_border[id],id_to_rgba_border[id],id_to_rgba_border[id],id_to_rgba_border[id],id_to_rgba_border[id],id_to_rgba_border[id]];
  if (currentlySelected === "1") {
    barChart.data.datasets[0] = {
      label: teamName, 
      data: [stats["SRS"], Number(stats["ORTG"]/10).toFixed(3), Number(stats["DRTG"]/10).toFixed(3), Number(stats["MOV"]).toFixed(3), Number(stats["PACE"]/10).toFixed(3), Number(stats["NRTG"]).toFixed(3)],
      backgroundColor: bgColor,
      hoverBackgroundColor: bgHoverColor,
      borderColor: bdColor,
      borderWidth: 1
    };
    radarChart.data.datasets[0] = {
      label: teamName,
      data: [Number(stats["WLR"]).toFixed(3), Number(stats["FTAr"]).toFixed(3), Number(stats["3PTAr"]).toFixed(3), Number(stats["TS%"]).toFixed(3), Number(stats["ORB%"]).toFixed(3), Number(stats["OPP_DRB%"]).toFixed(3), Number(stats["TOV%"]).toFixed(3)],
      backgroundColor: bgColor,
      hoverBackgroundColor: bgHoverColor,
      borderColor: bdColor,
      borderWidth: 1
    }
  } else {
    barChart.data.datasets[1] = {
      label: teamName, 
      data: [stats["SRS"], Number(stats["ORTG"]/10).toFixed(3), Number(stats["DRTG"]/10).toFixed(3), Number(stats["MOV"]).toFixed(3), Number(stats["PACE"]/10).toFixed(3), Number(stats["NRTG"]).toFixed(3)],
      backgroundColor: bgColor,
      hoverBackgroundColor: bgHoverColor,
      borderColor: bdColor,
      borderWidth: 1
    };    
    radarChart.data.datasets[1] = {
      label: teamName,
      data: [Number(stats["WLR"]).toFixed(3), Number(stats["FTAr"]).toFixed(3), Number(stats["3PTAr"]).toFixed(3), Number(stats["TS%"]).toFixed(3), Number(stats["ORB%"]).toFixed(3), Number(stats["OPP_DRB%"]).toFixed(3), Number(stats["TOV%"]).toFixed(3)],
      backgroundColor: bgColor,
      hoverBackgroundColor: bgHoverColor,
      borderColor: bdColor,
      borderWidth: 1
    }
  }
 barChart.update();
 radarChart.update();
}


function pieChartVisibility(visibility, src) {
  $("#pieChart").css({
    "display": "inline-block",
    "position": "absolute",
    "top": "10em",
    "left": "3.5em",
    "max-width": "22em",
    "min-width": "22em",
    "z-index": "100",
    "visibility": visibility
  });

    $("#winnerLogo").css({
    "display": "inline-block",
    "position": "absolute",
    "top": "19.8em",
    "left": "8.67em",
    "max-width": "10.625em",
    "min-width": "10.625em",
    "visibility": visibility
  });

  $("#winnerLogo").attr("src", src);
}

function updatePieChart(pieChart, stats1, stats2, winProbability) {
  pieChart.data.labels[0] = stats1["TEAM"];
  pieChart.data.datasets[0].data[0] = Number(winProbability).toFixed(3);
  pieChart.data.labels[1] = stats2["TEAM"];
  pieChart.data.datasets[0].data[1] = Number(1-winProbability).toFixed(3);
  pieChart.data.datasets[0]["backgroundColor"] = [id_to_rgba_fade[stats1["TEAMID"]],id_to_rgba_fade[stats2["TEAMID"]]];
  pieChart.data.datasets[0]["hoverBackgroundColor"] = [id_to_rgba_hover[stats1["TEAMID"]],id_to_rgba_hover[stats2["TEAMID"]]];
  pieChart.data.datasets[0]["borderColor"] = [id_to_rgba_border[stats1["TEAMID"]],id_to_rgba_border[stats2["TEAMID"]]];
  pieChart.data.datasets[0]["borderWidth"] = 1;
  pieChart.update();
}
