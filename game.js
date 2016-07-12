var gamePrompt = require('game-prompt'); // node function that loads external library
var colors = require('colors');

//Global Variable

var playerName;
var playerLocation;
var distanceTraveled = 0;
var gasLeft;
var planets = [
	{
		name: "Earth",
		distance: 10, 
		remark: "Earth! What an excellent choice!"
	},
	{
		name: "Mesnides",
		distance: 20,
		remark: "Mesnides! Never heard of it, but it's only 20 lightyears away dawg."
	},
	{
		name: "Laplides",
		distance: 50,
		remark: "Laplides! Rhymes with SlapNSlides..."
	},
	{
		name: "Kiyturn",
		distance: 120,
		remark: "Kiyturn! Is that pronounced like... 'Key turn?'?"
	},
	{
		name: "Aenides",
		distance: 25,
		remark: "Aenides! Home to some of the Galaxy's greatest warriors"
	},
	{
		name: "Cramuthea",
		distance: 200,
		remark: "200 light years is definitely going to cost you some fuel Captain."
	},
	{
		name: "Smeon",
		distance: 400,
		remark: "Smeon Says... touch your toes"
		
	},
	{
		name: "Gleshan 7Z9",
		distance: 85,
		remark: "Aint nuthin but Gleshan thang baybey"
	}
]




var startGame = function(){
	gamePrompt("S.R.S.V. Press Enter to start", intro);
}

var intro = function() {
	gamePrompt("You are the captain of a Solo Research Space Vehicle (S.R.S.V.) on an expedition to explore foreign planets. Your mission is to make contact with three alien life forms, acquire an artifact representative of their culture, and bring back your findings to Earth.", collectInfo);
}

var collectInfo = function(){
	gamePrompt( ["Please state your name for identity verification"], collectName);
}

var collectName = function(name) {
	playerName = name;
	gamePrompt(["Thank you Captain " + playerName + ".", "Please state your vehicle name for identity verification."],collectVehicleName);
}


var collectVehicleName = function(name) {
	gamePrompt( ["Vehicle identified as" + name + ". Identity verifiied. WARNING: SRSV only has 1000 gallons of fuel remaining. Where would you like to travel Captain " + playerName + ": " ],pickLocation);
}

var pickLocation = function() {
	for (var i = 0; i <planets.length; i++) {
			gamePrompt("(" + planets[i].name[0] + ")" + planets[i].name.slice(1,planets[i].name.length) + " ("+ planets[i].distance + " lightyears)", flyToLocation);
		}
	
	}

var flyToLocation = function(name){
	for(var i=0; i<planets.length;i++) {
		if(name === planets[i].name[0]) {
			gamePrompt(" " +planets[i].remark + " ");
		}
	}
}
		
	


startGame();