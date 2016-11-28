var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

function getCommand(){
    if (process.argv.length < 3){
        return "junk";
    }
    return process.argv[2];
}

function run(command)
{

//Switch function to determine what action to take
switch(command) {
		case 'my-tweets':
			myTweets();
			break;
		case 'spotify-this-song':
			getSong();
			break;
		case 'movie-this':
			findMovie();
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
	client.get('statuses/user_timeline', params, function(error, tweets) {
	 	
	 	//If error occurs
	 	if (error) {
		    console.log('Error occurred: ' + error);
		    return;
		}
	 	
	 	//If no error
	 	if (!error) {
		
			//Display ten current tweets, numbered 1-20
			for (var i = 0; i < tweets.length; i++) {
				console.log((parseInt([i]) + 1) + '. ' + tweets[i].text);
			}    
		}
	});

}

//spotify-this-song
//Spotify Function 
function getSong() {
	var parameter = "";
    if (process.argv.length < 4){
        parameter = "the sign";
    }
    else{
        parameter = process.argv[3];

        //This pulls movies with more than one word titles 
        for(var i=4; i < process.argv.length; i++)
        {
            parameter = parameter + "+" + process.argv[i];
        }
    }

	 
	spotify.search({ type: 'track', query: parameter}, function(error, data) {
	    //If error occurs
	    if (error) {
	        console.log('Error occurred: ' + error);
	        return;
	    }
	 	
	 	//If no error
		if (!error) {

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
function findMovie(){

//If user doesn't provide movie title
var movieName = "";
if (process.argv.length < 4){
    movieName = "Mr.+Nobody";
}
else{
    movieName = process.argv[3];

//Pulls movies with more than one word titles 
for(var i=4; i < process.argv.length; i++)
{
    movieName = movieName + "+" + process.argv[i];
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
    function callback(error, data)
    {
        
	var split = data.split(',');

	//Assign to user input
	action = split[0];
	parameter = split[1];

    run(action);

	}
    

}

//Run function
run();

