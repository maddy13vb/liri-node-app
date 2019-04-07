require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

var axios = require("axios");
var moment = require("moment");
var dotenv = require("dotenv");

var command = process.argv[2];
if (command === "concert-this") {
    var artist = process.argv.splice(3).join(" ") || "Foo Fighters";
    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(URL).then(function (response) {
        var results = response.data;
        // console.log(results);
        for (i = 0; i < results.length; i++) {
            var artistInfo = `
Venue Name: ${results[i].venue.name}
Venue Location: ${results[i].venue.city}, ${results[i].venue.region}
Venue Date: ${moment(results[i].datetime).format("MM /DD/YY")}`
            // var artistInfo = results[i].venue.name + " " + results[i].venue.city + ", " + results[i].venue.region
            //     + " " + moment(results[i].datetime).format("MM /DD/YY");
            console.log(artistInfo);
            fs.appendFile("log.txt", artistInfo, function (err) {
                if (err) throw err;
            })
        }
    })
};



