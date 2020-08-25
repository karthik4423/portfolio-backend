const axios = window.axios;

var reponames = [];
var commitlengths = [];
var divId = 1;
var languages = [];
var commitDates = [];
const url = "https://api.github.com/users/karthik4423/repos";
axios.get(url, {}).then(function (datas) {
  //console.log(datas.data);
  for (var i = 0; i < datas.data.length; i++) {
    if (JSON.stringify(datas.data[i].fork) == "false") {
      reponames.push([
        datas.data[i].updated_at,
        datas.data[i].name,
        datas.data[i].language,
        datas.data[i].description,
        datas.data[i].languages_url,
      ]);
    }
  }

  setTimeout(dateFormatter, 100);
  setTimeout(addElement, 1200);
});

function dateFormatter() {
  for (i = 0; i < reponames.length; i++) {
    reponames[i][0] = new Date(reponames[i][0]);
  }
  reponames.sort(function (a, b) {
    return b[0] - a[0];
  });
  // console.log(reponames);
  getLanguages();
}

function getLanguages() {
  for (i = 0; i < 4; i++) {
    // console.log("entered for");
    // console.log(reponames[i][1]);
    axios.get(reponames[i][4], {}).then(function (datas) {
      // console.log("yo : ", datas.data);
      languages.push(Object.entries(datas.data));
    });
  }
}

function addElement() {
  for (var i = 0; i < 4; i++) {
    reponames[i][0] = reponames[i][0].toString().slice(0, 16);
    reponames[i][1] = reponames[i][1].replace(/-/g, " ");
    reponames[i][1] = reponames[i][1].replace(/_/g, " ");
    reponames[i][0] = reponames[i][0].replace(" ", ", ");
    newElem = document.createElement("div");
    newElem.setAttribute("id", divId);
    newElem.setAttribute("class", "card col-8 card-style");
    innerElem = document.createElement("div");
    innerElem.setAttribute("id", divId + "in");
    innerElem.setAttribute("class", "card-body");
    innerElem.innerHTML =
      "<div>" +
      '<h5 class="card-title text-center"> Repo Name : ' +
      reponames[i][1] +
      "</h5>" +
      '<hr class="red"/>' +
      "<p><b> Description : </b>" +
      reponames[i][3] +
      "</p>" +
      "<p><b> Languages : </b>" +
      reponames[i][2] +
      "</p>" +
      "<p><b> Last Updated : </b>" +
      reponames[i][0] +
      "</p>" +
      "</div>" +
      '<div style="height:inherit;width:auto">' +
      '<div id="chart' +
      divId +
      '" >' +
      //style="width: 75%; height: 50%"
      //Object.entries(languages[i]) +

      "</div>" +
      "</div>";
    // setTimeout(drawPieChart(divId, i), 200);

    newElem.appendChild(innerElem);
    document.getElementById("repos").appendChild(newElem);
    // console.log(newElem);
    // console.log(languages);
    divId += 1;
  }

  for (i = 0; i < 4; i++) {
    drawPieChart(languages[i], i + 1, i);
    //console.log(reponames[i][1], languages[i]);
  }
}

function drawPieChart(langarray, id, i) {
  id = "chart" + id;
  //console.log(id);
  //langarray = [];
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
  // langarray = Object.entries(languages[i]);
  //langarray = languages[i];
  langarray.unshift(["Language", "lines"]);
  //console.log(langarray);
  // Draw the chart and set the chart values

  function drawChart() {
    let data = google.visualization.arrayToDataTable(langarray);
    //console.log(data);

    // Optional; add a title and set the width and height of the chart
    let options = {
      title: "Language Split",
      pieHole: 0.4,
      height: 50 + "%",
      width: 75 + "%",
    };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById(id));
    chart.draw(data, options);
    //chart.draw(data, options);
  }
}
