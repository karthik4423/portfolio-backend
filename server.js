const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
// const fs = require("fs");
// const https = require("https");
// const privatekey = fs.readFileSync("key.pem");
// const certificate = fs.readFileSync("cert.pem");
// const credentials = { key: privatekey, cert: certificate };

//const { Mongos } = require("mongodb");
//const bodyParser = require("body-parser");
const url = "https://api.github.com/users/karthik4423/repos";

const app = express();
require("dotenv").config();

//app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.DB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

var repoSchema = new mongoose.Schema(
  {
    updated_at: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    language_url: {
      type: String,
      required: true,
    },
  },
  { _id: true, timestamps: true }
);

var languageSchema = new mongoose.Schema(
  {
    langdat: [],
  },
  { _id: true }
);

var repoData = mongoose.model("repodata", repoSchema);
var langData = mongoose.model("langdata", languageSchema);

var reponames = [];
var languages = [];

var corsOptions = {
  origin: [
    "http://localhost:4200",
    "http://localhost:4000",
    "http://192.168.1.2:4200",
  ],
};
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  //res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use(cors(corsOptions));

//var httpsServer = https.createServer(credentials, app);
app.listen(8000, () => {
  console.log("App is listening at port 8000");
});
// repoData
//   .deleteMany()
//   .then((result) => console.log(`Deleted ${result.deletedCount} item(s).`))
//   .catch((err) => console.error(`outside Delete failed with error: ${err}`));
getGitData();

setTimeout(getGitData, 36000000);

function getGitData() {
  repoData
    .deleteMany()
    .then((result) => console.log(`Deleted ${result.deletedCount} item(s).`))
    .catch((err) => console.error(`inside Delete failed with error: ${err}`));
  langData
    .deleteMany()
    .then((result) => console.log(`Deleted ${result.deletedCount} item(s).`))
    .catch((err) => console.error(`inside Delete failed with error: ${err}`));
  axios
    .get(url, {})
    .then(function (datas) {
      for (var i = 0; i < datas.data.length; i++) {
        if (JSON.stringify(datas.data[i].fork) == "false") {
          if (
            datas.data[i].name != "karthik4423.github.io" &&
            datas.data[i].name != "karthik4423"
          ) {
            reponames.push([
              datas.data[i].updated_at,
              datas.data[i].name,
              datas.data[i].language,
              datas.data[i].description,
              datas.data[i].languages_url,
            ]);
          }
        }
      }
      setTimeout(dateFormatter, 100);
    })
    .catch((error) => {
      //console.log(error);
    });

  setTimeout(addtodb, 8000);
}

function dateFormatter() {
  for (i = 0; i < reponames.length; i++) {
    reponames[i][0] = new Date(reponames[i][0]);
  }
  reponames.sort(function (a, b) {
    return b[0] - a[0];
  });
  getLanguages();
}

function getLanguages() {
  for (i = 0; i < reponames.length; i++) {
    axios.get(reponames[i][4], {}).then(function (datas) {
      languages.push(Object.entries(datas.data));
    });
  }
}

function addtodb() {
  for (var i = 0; i < reponames.length; i++) {
    //console.log(reponames[i]);
    const updated_at = reponames[i][0];
    const name = reponames[i][1];
    const language = reponames[i][2];
    var description = reponames[i][3];
    if (description == null) {
      description = "dummy desc";
    }
    const language_url = reponames[i][4];
    const landat = languages[i];
    console.log(landat);

    const repo = new repoData({
      updated_at,
      name,
      language,
      description,
      language_url,
    });

    const land = new langData({
      landat,
    });
    //console.log(repo);
    //console.log(land);
    repo.save().then(() => console.log("Repodata added"));
    //.catch((err) => console.log("Error : " + err));

    land.save().then(() => console.log("langdata added"));
    //.catch((err) => console.log("Error : " + err));
  }
}

app.get("/", function (req, res) {
  res.send("./index.html");
});

app.get("/getdata", function (req, res) {
  data = [];
  for (var i = 0; i < reponames.length; i++) {
    data.push(reponames[i], languages[i]);
  }

  res.send(data);
});
app.get("/getlang", function (req, res) {
  res.send(languages);
});
//app.get("/github", function (req, res) {});
