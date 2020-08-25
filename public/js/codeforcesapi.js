//const axios = window.axios;
var maxrank;
const profileurl = "https://codeforces.com/api/user.info?handles=karthikraj3";
axios.get(profileurl).then(function (datas) {
  //console.log(datas.data.result);
  maxrank = JSON.stringify(datas.data.result[0].maxRank);
  maxrating = JSON.stringify(datas.data.result[0].maxRating);
  rank = JSON.stringify(datas.data.result[0].rank);
  rating = JSON.stringify(datas.data.result[0].rating);
  //console.log(maxrank);
  maxrank = "Highest Rank : " + maxrank.slice(1, maxrank.length - 1);
  maxrating = "Highest Rating : " + maxrating;
  rank = "Current Rank : " + rank.slice(1, rank.length - 1);
  rating = "Current Rating : " + rating;
  // document.getElementById("maxrank").innerHTML = maxrank;
  // document.getElementById("maxrating").innerHTML = maxrating;
  // document.getElementById("rank").innerHTML = rank;
  // document.getElementById("rating").innerHTML = rating;
});
