const axios = window.axios;

var datas;
const url = "https://localhost:8000/getdata";
axios
  .get(url, {})
  .then((datas) => {
    //console.log(datas);
    addData(datas);
  })
  .catch((err) => {
    console.log("oops. server down.");
  });

p = 0;
q = 1;
reponames = [];
languages = [];
var divId = 1;

function addData(datas) {
  len = datas.data.length / 2;
  for (var i = 0; i < len; i++) {
    // console.log("inloop");
    // console.log(datas.data[p], p, q);
    reponames.push(datas.data[p]);
    languages.push(datas.data[q]);
    p += 2;
    q += 2;
  }
  //console.log(reponames, languages);
  setTimeout(addElement, 120);
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
      new Date(reponames[i][0]) +
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
