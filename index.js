var gamePrompt = require('game-prompt');
var colors = require('colors');

var playerName;
var vehicleName;
var currentPlanet;
var fuel = 1000;
var playerInventory = [];
// For this solution, we'll store a lot more of info about the
// planets so we can reduce the number of different functions
var destinations = [
  {
    name: 'Earth',
    distance: 10,
    handler: approachEarth
  },
  {
    name: 'Mesnides',
    distance: 20,
    occupied: true,
    intro: [
      'You\'ve arrived at Mesnides. As you land, a representative of the Mesnidian people is there to greet you.',
      '"Welcome, traveler, to Mesnides."'
    ],
    prompt: "How can we assist you?",
    artifact: 'Myoin Horn',
    artifactResponse: '"Here, take this Myoin Horn, an ancient Mesnidian instrument."',
    planetAdvice: '"Well, Laplides suffered from atomic war and has been uninhabited ' +
      'for centuries. You would do well to avoid it on your journey."'
  },
  {
    name: 'Laplides',
    distance: 50,
    occupied: false,
    intro: 'You enter orbit around Laplides. Looking down at the planet, you see ' +
      'signs of atomic war and realize there is no option but to turn around.'
  },
  {
    name: 'Kiyturn',
    distance: 120,
    occupied: true,
    intro: 'You\'ve arrived at Kiyturn. As you land, a representative of the Kiyturn people is there to greet you.',
    prompt: '"Hello, what brings you to Kiyturn? You\'re not here to cause trouble are you?"',
    artifact: 'Kiyturn Glass Bowl',
    artifactResponse: '"Here, take this Kiyturn Glass Bowl, a symbol of our civilization."',
    planetAdvice: '"I\'m sorry, but we do not leave our planet. The universe, to us, is a beautiful mystery."'
  },
  {
    name: 'Aenides',
    distance: 25,
    occupied: false,
    intro: [
      'You\'ve arrived at Aenides. As you try to land, the people begin firing on your ship.',
      'You narrowly avoid disaster, but are forced to turn around.'
    ]
  },
  {
    name: 'Cramuthea',
    distance: 200,
    occupied: false,
    intro: [
      'You have arrived at Cramuthea.',
      'The planet is abandoned, but it looks like people were here in the not-too-distant past.',
      'You land on the planet and find fuel for your ship. (+500)',
      'You find a beacon signal.',
      'It appears the people that once lived here have migrated to Smeon T9Q.'
    ],
    fuelBonus: 500
  },
  {
    name: 'Smeon T9Q',
    distance: 400,
    occupied: true,
    intro: [
      'You\'ve arrived at Smeon T9Q. As you land, a representative of the Cramuthean people is there to greet you.',
      '"Welcome to Smeon T9Q."',
      '"The Cramuthean people have lived here since we were forced to leave our home planet 100 years ago."',
      '"The planet was ravaged by droughts, severe weather and foreign invasions."',
      '"We now call Smeon T9Q home."',
      '"You\'ve travelled far, here is some fuel for your journey. (+100)"'
    ],
    fuelBonus: 100,
    prompt: '"What brings you here?"',
    artifact: 'Cramun Flower',
    artifactResponse: '"Here, take this dried Cramun Flower from our home planet."',
    planetAdvice: [
      '"The people of Aenides once tried to take over our home planet by force."',
      '"We fended them off, but they are an aggresive people to be avoided.'
    ]
  },
  {
    name: 'Gleshan 7Z9',
    distance: 85,
    occupied: true,
    intro: [
      'You\'ve arrived at Gleshan 7Z9. As you land, a representative of the Gleshan people is there to greet you.',
      '"Welcome to our humble planet Gleshan 7Z9."',
    ],
    prompt: '"How can we be of service?"',
    artifactResponse: '"I\'m sorry, but we are a poor planet and it is against our custom to part with our precious artifacts."',
    planetAdvice: [
      '"We were once friends with the people of Cramuthea, but it has been years since we have heard from them."',
      '"They are a friendly and generous people."'
    ]
  }
];

function addItemToInventory(item) {
  if (playerInventory.indexOf(item) < 0) {
    playerInventory.push(item);
  }
}

function begin() {
  gamePrompt('S.R.S.V.\nPress ENTER to start'.red, intro);
}

function intro() {
  gamePrompt([
    'You are the captain of a Solo Research Space Vehicle (S.R.S.V.) on an ' +
    'expedition to explore foreign planets. Your mission is to make contact ' +
    'with three alien life forms, acquire an artifact representative of their ' +
    'culture, and bring back your findings to Earth.',
    'A voice comes on over the intercom'.red,
    '"S.R.S.V. captain, please state your name for identity verification."'
  ], saveName);
}

function saveName(name) {
  playerName = name;

  gamePrompt([
    '"Thank you Captain ' + playerName + '."',
    '"Please state your vehicle name for identity verification."'
  ], saveVehicleName);
}

function saveVehicleName(name) {
  vehicleName = name;

  gamePrompt([
    '"Thank you Captain ' + playerName + ' of S.R.S.V. ' + vehicleName + '."',
    '"Your identity has been verified."'
  ], askTravel);
}

function askTravel() {
  // Construct string informing user how much fuel remains.
  var fuelPrompt = 'You have ' + fuel + ' gallons of remaining.';

  // Construct the travel prompt by looping through the possible destinations
  var travelPrompt = 'Choose your destination Captain ' + playerName + '.';
  destinations.forEach(function(destination) {
    travelPrompt += '\n(' + destination.name.charAt(0) + ')' +
      destination.name.substr(1) + ' - ' +
      destination.distance + ' lightyears';
  });

  // Show the prompts and then run the travel function
  gamePrompt([
    fuelPrompt,
    travelPrompt
  ], travel);
}

function travel(planet) {
  // Reset current planet
  currentPlanet = undefined;

  // Search through the destinations array for the planet that starts
  // with the letter the user typed in
  destinations.forEach(function(d) {
    if (planet.toUpperCase() === d.name.charAt(0)) {
      // Assign the planet object to the destination
      // global variable currentPlanet to keep track of
      // where the user is.
      currentPlanet = d;
    }
  });

  if (!currentPlanet) {
    gamePrompt('Sorry, I do not recognize that destination.', askTravel);
  } else {
    // Subtract the appropriate amount of fuel from the global
    // fuel total
    fuel -= currentPlanet.distance;
    // If the fuel has dipped below 0, lose the game
    if (fuel <= 0) {
      lose();
    } else {
      // If the planet defined its own handler (like Earth has) use it, else use
      // the generic one.
      var handler = currentPlanet.handler ? currentPlanet.handler : approachPlanet;

      // Show the user info about their travel and then call the handler
      gamePrompt([
        'Travelling to ' + currentPlanet.name + ' using ' + currentPlanet.distance + ' gallons of fuel',
        'You now have ' + fuel + ' gallons of fuel remaining.'
      ], handler);
    }
  }
}

function approachEarth() {
  if (playerInventory.length === 3) {
    gamePrompt('You\'ve arrived at Earth with 3 artifacts.', win);
  } else {
    fuel += 10;
    gamePrompt([
      'You\'ve arrived at Earth.',
      '"Captain ' + playerName + ', you do not have enough artifacts."',
      '"Take this fuel and get back out there." (+10)'
    ], askTravel);
  }
}

function approachPlanet() {
  // Add fuel bonus to the players fuel if it exists
  if (currentPlanet.fuelBonus) {
    fuel += currentPlanet.fuelBonus;
  }

  if (currentPlanet.occupied) {
    gamePrompt(currentPlanet.intro, askAtPlanet);
  } else {
    gamePrompt(currentPlanet.intro, askTravel);
  }
}

function askAtPlanet() {
  gamePrompt(currentPlanet.prompt + '\nAsk about (A)rtifact.\nAsk about other (P)lanets\n(L)eave', answerAtPlanet);
}

function answerAtPlanet(answer) {
  if (answer.toLowerCase() === 'a') {
    if (currentPlanet.artifact) {
      addItemToInventory(currentPlanet.artifact);
      gamePrompt([
        currentPlanet.artifactResponse,
        currentPlanet.artifact + ' added to your inventory.',
        'You now have ' + playerInventory.length + ' artifact' + (playerInventory.length > 1 ? 's.' : '.')
      ], askAtPlanet);
    } else {
      gamePrompt(currentPlanet.artifactResponse, askAtPlanet);
    }
  } else if (answer.toLowerCase() === 'p') {
    gamePrompt(currentPlanet.planetAdvice, askAtPlanet);
  } else if (answer.toLowerCase() === 'l') {
    askTravel();
  } else {
    gamePrompt('I\'m sorry traveler, but I don\'t understand your question', askAtPlanet);
  }
}

function lose() {
  gamePrompt([
    'You ran out of fuel',
    'Game Over'.red
  ]);
}

function win() {
  gamePrompt([
    '"Great work Captain ' + playerName + '."',
    '"Your mission is complete"'.green
  ]);
}

begin();