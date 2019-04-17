require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

var axios = require("axios");
var moment = require("moment");
var command = process.argv[2];
var search = "";

function all() {
    if (command === "concert-this") {
        concertThis();
    }
    else if (command === "spotify-this-song") {
        spotifyThisSong();
    }
    else if (command === 'movie-this') {
        movieThis();
    }
    else if (command === "do-what-it-says") {
        doWhatItSays();
    };
};
all();
//Displays venue info of band. Default: Foo Fighters.
function concertThis() {
    var artist = process.argv.splice(3).join(" ") || "Foo Fighters" || search
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

//Displays song info. Default: "The Sign" by Ace of Base
function spotifyThisSong() {
    var song = process.argv.splice(3).join(" ") || search || "The Sign Ace of Base"
    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            // console.log(response);
            var results = response.tracks.items[0];
            info = `
        Artist: ${results.artists[0].name}
        Song Title: ${results.name}
        Preview Link: ${results.preview_url}
        Album: ${results.album.name}
        `
            // console.log(results);
            console.log(info);
        })
        .catch(function (err) {
            console.log(err);
        })
};

//Displays movie info. Default: Mr. Nobody
function movieThis() {
    var movie = process.argv.splice(3).join(" ") || "Mr. Nobody" || search
    var URL = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`;
    axios.get(URL).then(function (response) {
        var results = response.data;
        var movieInfo = `
        Title: ${results.Title}
        Year: ${results.Year}
        IMBD Rating: ${results.Ratings.imbdRating}
        Rotten Tomatoes Rating: ${results.Ratings[1].Source}
        Country Produced: ${results.Country}
        Language of movie:${results.Language}
        Plot:${results.Plot}
        Actors: ${results.Actors}
        `
        console.log(movieInfo);
    }
    )

};

//Have a command that reads the random.txt file and performs the task inside
function doWhatItSays() {
    fs.readFile("random.txt", "UTF8", function (err, data) {
        if (err) {
            console.log(err);
        }
        var info = data.split(",");
        command = info[0];
        search = info[1]
        all();

    });
};
