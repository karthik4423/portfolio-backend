const axios = window.axios;

var datas;
const url = "http://157.245.109.70:80/getdata";
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
  var totallines = [];
  for (var i = 0; i < languages.length; i++) {
    var count = 0;
    for (var j = 0; j < languages[i].length; j++) {
      count += languages[i][j][1];
    }
    totallines.push(count);
  }
  console.log(totallines);
  for (var i = 0; i < languages.length; i++) {
    console.log("from earlyier fn", languages[i]);
    for (var j = 0; j < languages[i].length; j++) {
      var percentage = (languages[i][j][1] / totallines[i]) * 100;
      if (percentage < 10) {
        languages[i][j].push(percentage.toPrecision(3));
      } else {
        languages[i][j].push(percentage.toPrecision(4));
      }
    }
  }
  console.log(languages);
  //console.log("from githubapi", reponames, languages);
  setTimeout(addElement, 120);
}

//attempting new card design
function addElement() {
  for (var i = 0; i < 4; i++) {
    reponames[i][0] = reponames[i][0].toString().slice(0, 16);
    reponames[i][1] = reponames[i][1].replace(/-/g, " ");
    reponames[i][1] = reponames[i][1].replace(/_/g, " ");
    reponames[i][0] = reponames[i][0].replace(" ", ", ");
    newElem = document.createElement("div");
    newElem.setAttribute("id", divId);
    newElem.setAttribute("class", " flip-card-container");
    newElem.style = "--hue: 220";
    flipcard = document.createElement("div");
    flipcard.setAttribute("id", divId + "in");
    flipcard.setAttribute("class", "flip-card");
    front = document.createElement("div");
    front.setAttribute("class", "card-front");
    ul = document.createElement("ul");
    li = document.createElement("li");
    li.innerHTML =
      "<div>" +
      '<h5 class="card-title text-center"> Repo Name : ' +
      reponames[i][1] +
      "</h5>" +
      '<hr class="red"/>' +
      "<p><b> Description : </b>" +
      reponames[i][3] +
      "</p>" +
      "</div>";
    //lines = document.createElement("div");
    //lines.setAttribute("class", "img-bg");
    ul.appendChild(li);
    //front.appendChild(lines);
    front.appendChild(ul);
    flipcard.appendChild(front);
    back = document.createElement("div");
    back.setAttribute("class", "card-back");
    ul = document.createElement("ul");
    li = document.createElement("li");
    lastupd = new Date(reponames[i][0]).toDateString();
    lastupd = lastupd.slice(0, 3) + "," + lastupd.slice(3);
    li.innerHTML =
      "<div>" +
      "<p><b> Primary Language(s) : </b>" +
      reponames[i][2] +
      "</p>" +
      "<p><b> Last Updated : </b>" +
      lastupd +
      "</p>" +
      "</div>" +
      '<div style="height:inherit;width:100%">' +
      '<div id="chart' +
      divId +
      '" style="height:inherit;width:100%">' +
      "</div>";
    ul.appendChild(li);
    back.appendChild(ul);
    flipcard.appendChild(back);

    newElem.appendChild(flipcard);
    document.getElementById("repos").appendChild(newElem);
    divId += 1;
  }
  console.log(languages);
  for (i = 0; i < 4; i++) {
    addLangData(languages[i], i + 1, i);
  }
}

function addLangData(langarray, id, i) {
  console.log(langarray);
  id = "chart" + id;
  elem = document.getElementById(id);
  newelem = document.createElement("ul");
  for (var p = 0; p < langarray.length; p++) {
    newli = document.createElement("li");
    newli.innerHTML = langarray[p][0] + " : " + langarray[p][2];
    newelem.appendChild(newli);
  }
  elem.appendChild(newelem);
}
