"use strict"

var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

function getCommand(commandLine){
   if (commandLine.length < 3){
       return "junk";
    }
    return commandLine[2];
}

function run(commandLine){

var command = getCommand(commandLine);

//Switch function to determine what action to take
switch(command) {
		case 'my-tweets':
			myTweets();
			break;
		case 'spotify-this-song':
			getSong(commandLine);
			break;
		case 'movie-this':
			findMovie(commandLine);
			break;
		case 'do-what-it-says':
			doWhatItSays();
			break;
		default:
			console.log("Enter 'my-tweets', 'spotify-this-song', 'movie-this', or 'do-what-it-says'");
	}
}

//my-tweets
//Twitter Function 
function myTweets() {

	//Grab the keys.js info
	var twitterKeys = require('./keys.js').twitterKeys;

	//Set client to the grabbed key
	var client = new twitter(twitterKeys);

	//Set screen_name (Ellen DeGeneres') and number of tweets to pull 
	var params = {screen_name: '@TheEllenShow', count: 20};

	//Get timeline info
	client.get('statuses/user_timeline', params, function(err, tweets) {
	 	
	 	//If error occurs
	 	if (err) {
		    console.log('Error occurred: ' + err);
		    return;
		}
	 	
		//Display ten current tweets, numbered 1-20
		for (var i = 0; i < tweets.length; i++) {
			console.log((parseInt([i]) + 1) + '. ' + tweets[i].text);
		}    
	});
}

//spotify-this-song
//Spotify Function 
function getSong(commandLine) {
	var parameter = "";

    if (commandLine.length < 4){
        parameter = "the sign";
    }
    else{
        parameter = commandLine[3];

        //This pulls movies with more than one word titles 
        for(var i=4; i < process.argv.length; i++){
            parameter = parameter + "+" + commandLine[i];
        }
    }

	 
	spotify.search({ type: 'track', query: parameter}, function(err, data) {
	    //If error occurs
	    if (err) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	 	
	 	//If no error
		if (!err) {

			//Artist name 
			var artist = data.tracks.items[0].artists[0].name;

			//Song name
			var song = data.tracks.items[0].name;

			//Spotify preview link
			var link = data.tracks.items[0].external_urls.spotify;
			
			//Album name
			var album = data.tracks.items[0].album.name
			
			//Print song info
			console.log(song + ", performed by " + artist + ", on the album " + album + ". Spotify: " + link);
			
			}
			
	});

}

//movie-this
//Movie Function 

function findMovie(commandLine){
    var movieName = "";
    if (commandLine.length < 4){
        movieName = "Mr.+Nobody";
    }
    else{
        movieName = commandLine[3];

        //Pulls movies with more than one word titles 
        for(var i=4; i < commandLine.length; i++){
            movieName = movieName + "+" + commandLine[i];
        }
    }

//Request to the OMDB API with the movie specified 
var queryURL = 'http://www.omdbapi.com/?t=' + movieName + '&tomatoes=true&y=&plot=short&r=json';

//Request to the queryUrl
request(queryURL, function omdbResult(err, resp, body){

	//If no error 
	if(!err && resp.statusCode === 200) {

        //Print movie info
        console.log("Movie Title: " + JSON.parse(body).Title);
        console.log("Year Released: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).Rated);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Movie Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
        console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
        }

    });

}

//do-what-it-says
//Do-What-It-Says Function 
function doWhatItSays() {

	//Get fs
	var fs = require('fs');

	//Stores the contents of the reading inside the var "data"
	fs.readFile("random.txt", "utf8", callback);

    //Callback Function  
    function callback(err, data)
    {
        
	var split = data.split(',');

	//Assign to commandLine
    var commandLine = [];
    commandLine[0] = "node";
    commandLine[1] = "liri.js";
    commandLine[2] = split[0];
    commandLine[3] = split[1];
	run(commandLine);

	}
    

}

//Run function
run(process.argv);