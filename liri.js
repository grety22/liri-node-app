//To load the real keys
require("dotenv").config();
//To load the enviroment variables for keys
const keys = require('./keys.js');
//To color text
const chalk = require('chalk');
//File System Module
const fs = require('fs');
//Request Module
var request = require('request');
//ALL API Keys
var spotifyKey = keys.spotify;
var twitterKey = keys.twitter;
// REQUIRED TO THE LOG.TXT FILE
var util = require('util');

//TO LOG EVERY COMMAND
var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

var commands = ['my-tweets','spotify-this-song','movie-this','do-what-it-says'];
var argumCommand = process.argv[2];
var argumTres = process.argv[3];

/****** TWITTER ******/
var Twitter = require('twitter');
 
var twitter = new Twitter({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
  access_token_key: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret
});

function show14(tw){
    for (var i = 0; i<14; i++){
         console.log('Tweet text: '+tw[i].text+' **** Created at: '+tw[i].created_at);
    }
}

/****** SPOTIFY ******/
var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

var resp = new Object;

function artist(ar){
    for (var i = 0; i<ar.length; i++){
        console.log(chalk.green.bold("The artist's name: ")+ar[i].name);
    }
}
//// IF command equal to 'my-tweets' 
if (argumCommand === commands[0]){
 //    SHOW MY LAST 14 TWEETS 'I dont have 20 tweets in my account just 14'
       twitter.get('statuses/user_timeline', function(error, tweets, response){ 
          if (!error) {
              console.log(chalk.rgb(29, 202, 255).underline('                       ** MY LAST 14 TWEETS **                          '));
              show14(tweets);    
          }
       });
//// IF command equal to 'spotify-this-song'    
 } else if (argumCommand === commands[1]){
        if (argumTres){
            console.log(chalk.rgb(132, 189, 0).underline('                        ** SPOTIFY API **                         '));
            spotify.search({ type: 'track', query: argumTres, limit: 1 }, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                artist(data.tracks.items[0].artists);
                console.log(chalk.green.bold("The song's name: ")+data.tracks.items[0].name);
                console.log(chalk.green.bold("Preview url: ")+data.tracks.items[0].preview_url);
                console.log(chalk.green.bold("The album's name: ")+data.tracks.items[0].album.name);
            });    
        } else {
                spotify.request('https://api.spotify.com/v1/search?query=track%3Athe+sign+artist%3Aace+of+base&type=track&market=US&offset=0&limit=1')
                  .then(function(data) {
                    console.log(chalk.green.bold('Track Name: ')+data.tracks.items[0].name); 
                    console.log(chalk.green.bold('Group or Artist Name: ')+data.tracks.items[0].album.artists[0].name); 
                    console.log(chalk.green.bold("Preview url: ")+data.tracks.items[0].preview_url);
                    console.log(chalk.green.bold("The album's name: ")+data.tracks.items[0].album.name);

                  })
                  .catch(function(err) {
                    console.error('Error occurred: ' + err); 
                  });  
        }
//// IF command equal to 'movie-this' // OMDB   
} else if (argumCommand === commands[2]){
    if (argumTres){
        var query = 'http://www.omdbapi.com/?t='+argumTres+'&apikey=8c79a932';
        request(query, function (error, response, body) {
            var dataOmdb = JSON.parse(body);
            console.log(chalk.rgb(145, 115, 189)('Title: ')+dataOmdb.Title);
            console.log(chalk.rgb(145, 115, 190)('Year: ')+dataOmdb.Year);
            console.log(chalk.rgb(145, 115, 191)('IMDB Ratings: ')+dataOmdb.imdbRating);
//          Get the Rotten Tomatoes Rating:
            for (let item of dataOmdb.Ratings) {
                if (item.Source == 'Rotten Tomatoes'){
                     console.log(chalk.rgb(145, 115, 193)('Rotten Tomatoes Rating: ')+item.Value);
                } 
            };
            console.log(chalk.rgb(145, 115, 193)('Country: ')+dataOmdb.Country);
            console.log(chalk.rgb(145, 115, 194)('Language: ')+dataOmdb.Language);
            console.log(chalk.rgb(145, 115, 194)('Plot of the movie: ')+dataOmdb.Plot);
            console.log(chalk.rgb(145, 115, 194)('Actors: ')+dataOmdb.Actors);
        });
    } else {
        var query = 'http://www.omdbapi.com/?t=Mr.+Nobody&apikey=8c79a932';
        request(query, function (error, response, body) {
            var dataOmdb = JSON.parse(body);
            console.log(chalk.rgb(145, 115, 189)('Title: ')+dataOmdb.Title);
            console.log(chalk.rgb(145, 115, 190)('Year: ')+dataOmdb.Year);
            console.log(chalk.rgb(145, 115, 191)('IMDB Ratings: ')+dataOmdb.imdbRating);
            console.log(chalk.rgb(145, 115, 192)('Rotten Tomatoes Rating: ')+dataOmdb.imdbRating);
            console.log(chalk.rgb(145, 115, 193)('Country: ')+dataOmdb.Country);
            console.log(chalk.rgb(145, 115, 194)('Language: ')+dataOmdb.Language);
            console.log(chalk.rgb(145, 115, 194)('Plot of the movie: ')+dataOmdb.Plot);
            console.log(chalk.rgb(145, 115, 194)('Actors: ')+dataOmdb.Actors);
        });
    }
//// IF command equal to 'do-what-it-says'
} else if (argumCommand === commands[3]){
    fs.readFile('./random.txt','utf8',(err,data)=>{
        var stringArray = data.split(',');
//        var commandPart = stringArray[0];
        var songPart = stringArray[1];
        spotify.search({ type: 'track', query: songPart, limit: 1 }, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                artist(data.tracks.items[0].artists);
                console.log(chalk.green.bold("The song's name: ")+data.tracks.items[0].name);
                console.log(chalk.green.bold("Preview url: ")+data.tracks.items[0].preview_url);
                console.log(chalk.green.bold("The album's name: ")+data.tracks.items[0].album.name);
            });    
    }) 
}
else {
 	  console.log(chalk.red.bold('please type a command after "liri.js"'));
 	  console.log(('type ')+chalk.cyan.bold("my-tweets")+(' to get a list of your last 14 tweets from twitter'));
 	  console.log(('type ')+chalk.green.bold("spotify-this-song")+(' to get info about that track from spotify'));
 	  console.log(('type ')+chalk.magenta.bold("movie-this")+(' to get info about that movie from OMdb'));
 	  console.log(('type ')+chalk.yellow.bold("do-what-it-says")+(' to get info about that movie from OMdb'));
}

 







