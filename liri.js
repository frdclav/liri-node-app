require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var fs = require('fs');
// console.log(keys.spotify)
var spotify = new Spotify(keys.spotify);

// var liri_request = process.argv[2];
// var liri_search_term = process.argv[3];

// switch
var main = function (liri_request, liri_search_term) {
    switch (liri_request) {
        case "concert-this":

            // bands in town takes artist with spaces as + so lets make sure its correct
            var artist = liri_search_term.split(" ").join("+")
            // create the url
            var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
            // start axios
            axios
                .get(url)
                .then(function (response) {
                    console.log("Here are concerts coming up for", liri_search_term, ":")
                    const res = response.data;
                    res.forEach(event => {
                        console.log("\n++++____++++\n")
                        console.log(event.venue.name);
                        console.log(event.venue.city, event.venue.region, event.venue.country)
                        console.log(moment(event.datetime).format("dddd, MMMM DD YYYY, h:mm a"))
                    });
                })
                .catch(function (error) {
                    console.log(error);
                })

            break;
        case "spotify-this-song":
            // start spotify search
            // default search
            if (!liri_search_term) {
                liri_search_term = "The Sign Ace of Base"
            }
            spotify
                .search(
                    {
                        type: 'track', query: liri_search_term
                    }).then(function (response) {
                        console.log("More CHUNES fo ya head-top, :", liri_search_term)
                        const res = response.tracks.items[0];
                        // console.log(response)
                        let artist = []
                        res.artists.forEach(element => {
                            artist.push(element.name)
                        });
                        console.log("\n++++____++++\n")

                        console.log('Artist:', artist.join(', '))
                        console.log('Song Title:', res.name)
                        console.log('Link:', res.external_urls.spotify)
                        console.log('Album Name:', res.album.name)
                        console.log("\n++++____++++\n")

                    }
                    )
                .catch(function (err) {
                    console.log(err);
                });


            break;
        case "movie-this":

            // omdb takes movie with spaces as + so lets make sure its correct
            // set default movie to Mr.Nobody
            var movie = "Mr.Nobody"
            if (liri_search_term) {
                movie = liri_search_term.split(" ").join("+")
            }
            // create the url
            var url = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie
            // start axios
            axios
                .get(url)
                .then(function (response) {
                    console.log(liri_search_term, " is a great movie, heres the info: ")
                    const res = response.data;
                    // res.forEach(event => {
                    console.log("\n++++____++++\n");
                    console.log(res.Title);
                    console.log(res.Year);
                    console.log(res.Ratings[0].Source, res.Ratings[0].Value);
                    console.log(res.Ratings[1].Source, res.Ratings[1].Value);
                    console.log(res.Country);
                    console.log(res.Language);
                    console.log(res.Plot);
                    console.log(res.Actors)
                    console.log("\n++++____++++\n");

                })
                .catch(function (error) {
                    console.log(error);
                })
            break;
        // lets try to use recursion here
        case "do-what-it-says":
            fs.readFile('random.txt', 'utf8', (err, data) => {
                if (err) { return console.log(err) }
                var firstSplit = data.split('\n') //some reason this worked differently on mac and windows
                var secSplit = []
                firstSplit.forEach(element => {
                    secSplit.push(element.replace(/"/g, '').split(','))
                })
                // console.log(data)
                // console.log(firstSplit)
                secSplit.forEach(element => {
                    // console.log(element[0],element[1])
                    main(element[0], element[1])
                });
            })
            break;

        // default case 


        default:
            console.log("\n\nThis program takes in two arguements:\n\nThe first is a command such as concert-this. The second is a search term for the command. So a proper example is: \n\n node liri concert-this 'Kanye West' \n\n")
            break;
    }
}
main(process.argv[2],process.argv[3])