(function(window) {
	"use strict";

	//SHIP CLASS
	function Ship(shipType, shipLength) {
		this.shipType = shipType;
		this.shipLength = shipLength;
		this.ID;
		this.row;
		this.col;
		this.direction;
		this.positions = [];
		this.hitPoints = this.shipLength;
	};

	window.Ship = Ship;

	Ship.prototype = {
		constructor: Ship
	};

	Ship.prototype.getCoord = function() {
		return this.row + '-' + this.col;		
	};

	//Add tile coordinate or array of coordinates to ship's position property
	Ship.prototype.addPosition = function(coords) {
		if(coords.constructor === String) {
			this.positions.push(coords);
			//console.log('string');			
		} else if (coords.constructor === Array) {
			this.positions = this.positions.concat(coords);
			//console.log('array');
		} else {
			//for testing, delete later.
			console.log('neither');
		}
	};

	//Decrease hit points in case of hit
	Ship.prototype.hit = function() {
		this.hitPoints--;
		//console.log("Hit " + this.shipType + "! " + this.hitPoints + " hits remaining.");

		var hitPlur;

		//Correct plurals
		if(this.hitPoints == 1) {
			hitPlur = 'hit';
		} else {
			hitPlur = 'hits';
		}

		//Don't output hit points if sunk, sinking message will display instead.
		if(this.hitPoints > 0) {
			gameLog.output("Hit " + this.shipType + "! " + this.hitPoints + " " + hitPlur + " remaining.");			
		}

	};


	Ship.prototype.initialize = function(row, col, dir) {
		this.row = row;
		this.col = col;
		this.direction = dir;
		this.coord = this.getCoord();
	};



	//SHIP SUBCLASSES
	//Instances of Ship, with differing names and lengths.
	
	function Carrier(row, col, dir){
		Ship.call(this, 'Carrier', 5);
		this.initialize(row, col, dir);
	};
	Carrier.prototype = Object.create(Ship.prototype);
	Carrier.prototype.constructor = Carrier;
	window.Carrier = Carrier;


	function Battleship(row, col, dir){
		Ship.call(this, 'Battleship', 4);
		this.initialize(row, col, dir);
		
	};
	Battleship.prototype = Object.create(Ship.prototype);
	Battleship.prototype.constructor = Battleship;
	window.Battleship = Battleship;

	function Cruiser(row, col, dir){
		Ship.call(this, 'Cruiser', 3);
		this.initialize(row, col, dir);
	};
	Cruiser.prototype = Object.create(Ship.prototype);
	Cruiser.prototype.constructor = Cruiser;
	window.Cruiser = Cruiser;

	function Submarine(row, col, dir){
		Ship.call(this, 'Submarine', 3);
		this.initialize(row, col, dir);
	};
	Submarine.prototype = Object.create(Ship.prototype);
	Submarine.prototype.constructor = Submarine;
	window.Submarine = Submarine;

	function Destroyer(row, col, dir){
		Ship.call(this, 'Destroyer', 2);
		this.initialize(row, col, dir);
	};
	Destroyer.prototype = Object.create(Ship.prototype);
	Destroyer.prototype.constructor = Destroyer;
	window.Destroyer = Destroyer;


	//FLEET CLASS
	function Fleet() {

			this.shipsInFleet = {
				'Carrier' : 0,
				'Battleship' : 0, 
				'Submarine' : 0,
				'Cruiser' : 0,
				'Destroyer' : 0 
			};
		
		this.activeShips = [];
		this.totalShips = [];
	}

	window.Fleet = Fleet;

	Fleet.prototype = {
		constructor: Fleet
	};

	//REMOVE
	//Add a new active ship to the fleet, and update totalships property
	Fleet.prototype.addShip = function(ship) {
		this.activeShips.push(ship);
		this.totalShips.push(ship);
		
	}

	Fleet.prototype.addShips = function() {
		var shipCount = 0;
		for(var ship in this.shipsInFleet) {
			var typeOfShip = window[ship];
			console.log(typeOfShip);
			for(var i = 0; i < this.shipsInFleet[ship]; i++) {
				
				var newShip = new typeOfShip();
				newShip.ID = shipCount;
				shipCount++;

				this.activeShips.push(newShip);
				this.totalShips.push(newShip);
			}
		}
	}



	//Remove a ship from activeShips, but keep in totalShips
	Fleet.prototype.removeShip = function(ship) {
		var index = this.activeShips.indexOf(ship);
		if(index > -1) {
			this.activeShips.splice(index, 1);
			console.log("Removed " + ship.shipType);
		} else {
			//for testting only
			console.log('no such ship');
		}
	}

	//mostly test function - change later to have it return active ships
	Fleet.prototype.listActiveShips = function() {
		console.log("Active ships in fleet: ");
		for(var i = 0; i < this.activeShips.length; i++) {
			console.log(this.activeShips[i].shipType);
		}
	}

	//Checks if ship is sunk and removes if so
	Fleet.prototype.checkSink = function(ship) {
		if(ship.hitPoints <= 0) {
			//console.log(ship.shipType + " has sunk!");
			gameLog.output(ship.shipType + ' has sunk!');


			this.removeShip(ship);
			return true;
		}	
	}

	//Checks if active ships still in fleet
	Fleet.prototype.checkFleet = function() {
		if(this.activeShips.length === 0) {
			return false;
		} else {			
			return true;
		}
	}



	//Board Class
	function Board(player) {
		this.rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
		this.cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		this.directions = ['north', 'east', 'south', 'west'];
		this.availableSpaces = [];
		this.guessableSpaces = [];
		this.owner = player;
		this.selector = '.' + this.owner + '-board';

		//Setup
		this.initialize(player);
	}
	window.Board = Board;

	Board.prototype = {
		constructor: Board
	};

	//Sets up new board

	//add rows
	Board.prototype.initialize = function(player) {
		var divs = '';
		for(var i = 0; i < this.rows.length; i++) {
			for(var j = 0; j < this.cols.length; j++) {
				var coord = (this.rows[i] + '-' + this.cols[j]);
				this.availableSpaces.push(coord);
				this.guessableSpaces.push(coord);

				if(i == 0 && j == 0) {
					divs += '<div class="tile clear" data-coord="' + coord + '"></div>';
				} else {
					divs += '<div class="tile" data-coord="' + coord + '"></div>'; 
				}
			}
		}
		$(this.selector + ' .playable-area').append(divs);
	}


	//Removes a space or an array of spaces from the set of available spaces
	Board.prototype.removeSpace = function(list, coord) {
		if(list == 'available') {
			var spacesList = 'availableSpaces';
		} else if (list == 'guessable') {
			var spacesList = 'guessableSpaces';
		}

		if(coord.constructor === String) {
			var index = this[spacesList].indexOf(coord);
			if(index > -1) {
				this[spacesList].splice(index, 1);
				//for testing
				console.log('Removed space: ' + coord);
			}
		} else if(coord.constructor === Array) {
			for(var i = 0; i < coord.length; i++) {
				var index = this[spacesList].indexOf(coord[i]);
				if(index > -1) {
					this[spacesList].splice(index, 1);
					//for testing
					console.log(' Removed space: ' + coord[i]);		
				}
			}
		}
	}

	//For a new ship, gives a random location, and checks if space available on board.
	//If so, returns array of tiles occupied by ship
	Board.prototype.checkSpaces = function(ship) {
		var row = ship.row;
		var col = ship.col;
		var direction = ship.direction;
		var rowNum = letterToNum(row);
		var shipTiles = [];
		switch(direction) {
			case('north'):
				for(var i = 0; i < ship.shipLength; i++) {
					var possibleCoord = numToLetter(rowNum - i) + '-' + col;
					//testing
					//console.log(possibleCoord);
					if( this.availableSpaces.indexOf(possibleCoord) === -1 ) {
						return false;
					} else {
						shipTiles.push(possibleCoord);
					}
				}
			break;

			case('east'):
				for(var i = 0; i < ship.shipLength; i++) {
					var possibleCoord = row + '-' + (col + i);
					if( this.availableSpaces.indexOf(possibleCoord) === -1 ) {
						return false;
					} else {
						shipTiles.push(possibleCoord);
					}	
				}
			break;

			case('south'):
				for(var i = 0; i < ship.shipLength; i++) {
					var possibleCoord = numToLetter(rowNum + i) + '-' + col;
				
					if( this.availableSpaces.indexOf(possibleCoord) === -1 ) {
						return false;
					} else {
						shipTiles.push(possibleCoord);
					}
				}
			break;

			case('west'):
				for(var i = 0; i < ship.shipLength; i++) {
					var possibleCoord = row + '-' + (col - i);
					//console.log(possibleCoord);
					if( this.availableSpaces.indexOf(possibleCoord) === -1 ) {
						return false;
					} else {
						shipTiles.push(possibleCoord);
					}	
				}
			break;
		}
		return shipTiles;			
	}

	//Create new ship objects for each type of ship in fleet.
	//Currently gives random locations to all ships
	//If no space for ship, retries until there is.
	Board.prototype.addShips = function(fleet) {
		for(var ship in fleet.shipsInFleet) {
			var typeOfShip = window[ship];
			for(var i = 0; i < fleet.shipsInFleet[ship]; i++) {		
				var row = getRandom(this.rows);
				var col = getRandom(this.cols);
				var dir = getRandom(this.directions);

				var newShip = new typeOfShip(row, col, dir);
				var shipTiles = this.checkSpaces(newShip);

				//if false, rerun until true
				while(! shipTiles) {
					var row = getRandom(this.rows);
					var col = getRandom(this.cols);
					var dir = getRandom(this.directions);
					var newShip = new typeOfShip(row, col, dir);
					shipTiles = this.checkSpaces(newShip);
				}

				newShip.addPosition(shipTiles);
				this.drawShip(newShip, fleet);
			}
		}
	}

	//Adds ship to fleet, and adds ship class to appropriate board tiles.
	Board.prototype.drawShip = function(ship, fleet) {
		fleet.addShip(ship);
		this.removeSpace('available', ship.positions);
		for(var i = 0; i < ship.positions.length; i++) {
			var tile = ship.positions[i];
			$(this.selector + ' .tile[data-coord="' + tile + '"]').addClass('ship ' + ship.shipType);
		}
	}

	//Check hit vs miss.
	//Must pass a DOM object
	//At some point change to not rely on the html, check based on ship.positions
	Board.prototype.checkHit = function(tileObj) {			

			if(tileObj.hasClass('ship')) {
				return true;
			} else {
				return false;
			}
		}

	//Updates board in case of miss
	Board.prototype.miss = function(tile) {
			tile.addClass('miss');
			this.removeSpace('guessable', tile.attr('data-coord'));

			gameLog.output('Miss!');
		}

	//In case of hit, returns which ship object was hit
	Board.prototype.determineShip = function(tile, fleet) {
		var tileID;

		if(tile.constructor === String) {
			tileID = tile;	
		} else {
			tileID = tileID.attr('data-coord');
		}


		var whichShip;
		for(var i = 0; i < fleet.activeShips.length; i++) {
			var ship = fleet.activeShips[i];
			//testing
			//console.log(ship.positions);
			if(ship.positions.indexOf(tileID) > -1) {
				whichShip = ship;
			}
		}
		return whichShip;
	}


	//PLAYER CLASS
	function Player(playerType) {
		this.playerType = playerType;
		this.enemy;

		this.hits = 0;
		this. misses = 0;
		this.currentStreak = 0;
		this.bestStreak = 0;

		this.currentDrySpell = 0;
		this.longestDrySpell = 0;


		this.board = new Board(this.playerType);
		this.fleet = new Fleet();

		//this.board.addShips(this.fleet);
	}
	window.Player = Player;

	Player.prototype = {
		constructor: Player
	}

	//turns tile string to jQuery tile object.
	Player.prototype.objectify = function(tile) {
		return $(this.enemy.board.selector + ' .tile[data-coord="' + tile + '"]');
	}

	Player.prototype.addHit = function() {
		this.hits++;
	}

	Player.prototype.addMiss = function() {
		this.misses++;
	}

	Player.prototype.getTotalHitPoints = function() {
		var hitPoints = 0;
		var activeShips = this.fleet.activeShips;

		for(var i = 0; i < activeShips.length; i++) {
			// console.log(activeShips[i].shipType, activeShips[i].hitpoints);
			hitPoints += activeShips[i].hitPoints;
		}

		return hitPoints;
	}

	Player.prototype.getHitPercent = function() {
		return Math.round(((this.hits / (this.hits + this.misses)) * 100) * 100) / 100;
	}

	Player.prototype.increaseStreak = function() {
		this.currentStreak++;
	}

	Player.prototype.updateStreak = function() {
		if(this.currentStreak > this.bestStreak) {
			this.bestStreak = this.currentStreak;
		}
	}

	Player.prototype.increaseDrySpell = function() {
		this.currentDrySpell++;
	}

	Player.prototype.updateDrySpell = function() {
		if(this.currentDrySpell > this.longestDrySpell) {
			this.longestDrySpell = this.currentDrySpell;
		}
	}

	Player.prototype.updateStats = function(outcome) {
		if(outcome == 'hit') {
			this.addHit();
			this.increaseStreak();
			this.updateStreak();
			this.currentDrySpell = 0;
		} else {
			this.addMiss();
			this.currentStreak = 0;
			this.increaseDrySpell();
			this.updateDrySpell();
		}
	}


	//Human Subclass
	function Human() {
		Player.call(this, 'human');
		this.turn = true;
	}
	window.Human = Human;
	Human.prototype = Object.create(Player.prototype);
	Human.prototype.constructor = Human;


	
	//Checks hit/miss status of human guess.
	Human.prototype.checkGuess = function(tileObj) {
		console.log(this);
		var self = this;

		var tile = tileObj.attr('data-coord');


		if(!tileObj.hasClass('hit') && !tileObj.hasClass('miss')) {
			
			var board = this.enemy.board;
			

			//REFACTOR WITH BOARDUPDATE - SEE AI CLASS BELOW
			if(board.checkHit(tileObj)) {
				tileObj.addClass('hit');
				var ship = board.determineShip(tile, this.enemy.fleet);
				ship.hit();
				
				//Player stats
				this.updateStats('hit');

				scoreboard.update(ship);

				this.enemy.fleet.checkSink(ship);
				
			} else {
				board.miss(tileObj);
				
				this.updateStats('miss');

			}
			
			console.log(tile);
			board.removeSpace('guessable', tile);
		}

	}


	//AI Subclass
	function AI() {
		Player.call(this, 'ai');
		
		this.guessInfo = {
			"firstTileHit" : null,
			"lastTileHit" : null,
			"lastTileGuessed" : null,
			"targetShip" : null,
			"lastShipOrientation" : null,

			"knownShips": []

		};
	}
	window.AI = AI;
	AI.prototype = Object.create(Player.prototype);
	AI.prototype.constructor = AI;

	//AI turn.  Guesses tiles based on known ship locations, if any, and checks hit/miss status.
	AI.prototype.guess = function() {
		var board = this.enemy.board;

		//no target
		if(this.guessInfo['targetShip'] == null) {

			console.log('known ships');
			console.log(this.guessInfo['knownShips']);

			var tile = this.findATarget();

		} else { //has target
			console.log('has target');
			var tile = this.getTile();
		}

		var tileObj = this.objectify(tile);
		console.log(tile);

			
		if(board.checkHit(tileObj)) { //hit
			//board stuff
			this.boardUpdate(tile, tileObj);

			var ship = board.determineShip(tile, this.enemy.fleet);
			ship.hit();
			
			// Player stats
			this.updateStats('hit');

			this.checkTarget(tile, ship);

		} else { //miss
			board.miss(tileObj);
			
			this.updateStats('miss');
		}		
		this.guessInfo['lastTileGuessed'] = tile;
		
		//Allow human to guess again
		this.enemy.turn = true;
	}

	AI.prototype.getNeighbors = function(tile) {
		var row = tile.split('-')[0];
		var col = tile.split('-')[1];			
		
		var north = numToLetter(letterToNum(row) - 1) + '-' + col;			
		var south = numToLetter(letterToNum(row) + 1) + '-' + col;			
		var east = row + '-' + (parseInt(col) + 1);			
		var west = row + '-' + (parseInt(col) - 1);
		var possibleNeighbors = [north, south, east, west];
		var neighbors = [];

		for(var i = 0; i < possibleNeighbors.length; i++) {
			var targ = possibleNeighbors[i];
			if(this.enemy.board.guessableSpaces.indexOf(targ) > -1) {		
				neighbors.push(targ);
			}
		}
		console.log('neighbors: ' , neighbors);		
		return neighbors;


	}

	//Update game board in case of hit.
	AI.prototype.boardUpdate = function(tile, tileObj) {
		var board = this.enemy.board;
		tileObj.addClass('hit');
		board.removeSpace('guessable', tile);
	}


	//Checks if hit ship was the target ship, or an accidental hit.
	//If so, save ship location for later use.
	AI.prototype.checkTarget = function(tile, ship) {
		//accidental hit
		if(this.guessInfo['targetShip'] && ship != this.guessInfo['targetShip'] ) {
			
			this.guessInfo['knownShips'].push(tile);
			console.log('known ships added: ');
			console.log(this.guessInfo['knownShips']);

			//check its sink status anyway
			if(this.enemy.fleet.checkSink(ship)) {
				this.removeSunkFromMemory(ship);				
			}

		} else { //hit target ship
			this.updateGuessInfo(tile, ship);

			if(this.enemy.fleet.checkSink(ship)) {
				this.removeSunkFromMemory(ship);
				this.clearGuessInfo();
			}
		}
	}

	//Updates the information the AI remembers about ship placement and hits
	AI.prototype.updateGuessInfo = function(tile, ship) {
		this.guessInfo['targetShip'] = this.guessInfo['targetShip'] || ship;					
		this.guessInfo['firstTileHit'] = this.guessInfo['firstTileHit'] || tile;
		this.guessInfo['lastTileHit'] = tile;

		//if there are two hits, find orient if one doesn't already exist
		if(this.guessInfo['firstTileHit'] != this.guessInfo['lastTileHit']) {
			this.guessInfo['lastShipOrientation'] = this.guessInfo['lastShipOrientation'] || this.findOrient();		
		}
	}

	//Get a tile based on educatedGuess.
	//If no possible tile (tile is out of bounds or already taken) guess again in the other direction,
	//based on first tile hit.
	AI.prototype.getTile = function() {
		var tile = this.educatedGuess();
		if(! tile) {
			console.log('out of bounds');
			tile = this.educatedGuess(this.guessInfo['firstTileHit']);
		}

		return tile;
	}

	//If there are knownShips, make first the target ship and update guessInfo and guess based on that ship.
	//Otherwise choose a random tile.
	AI.prototype.findATarget = function() {
		var board = this.enemy.board;

		//find a new target
		if(this.guessInfo['knownShips'].length) {

			var targetTile = this.guessInfo['knownShips'][0];
			var ship = board.determineShip(targetTile, this.enemy.fleet);

			this.guessInfo['knownShips'].splice(0, 1); //remove from known ships so no loop

			this.updateGuessInfo(targetTile, ship);

			var tile = this.educatedGuess();

		} else {
			var tile = this.randomGuess();
			console.log('first try tile:', tile);
			
			//prevents from guessing singletons when random guessing.

			while( !this.getNeighbors(tile).length ) {
				

				var tile = this.randomGuess();
			}				
		}

		return tile;
	}

	//Remove sunk ships from knownShips, in case one is sunk on accidental hits, the AI won't try and hit it again later.
	AI.prototype.removeSunkFromMemory = function(ship) {		
		for(var i = 0; i < ship.positions.length; i++) {
			var shipTile = ship.positions[i];
			if(this.guessInfo['knownShips'].indexOf(shipTile) > -1) {
				//alert('removing from knownShips');
				//alert(shipTile);
				console.log('REMOVING FROM KNOWN SHIPS: ' + shipTile);
				var index = this.guessInfo['knownShips'].indexOf(shipTile);
				this.guessInfo['knownShips'].splice(index, 1);
			}
		}
	}



	//Clear all information except known ships
	AI.prototype.clearGuessInfo = function() {
		this.guessInfo["firstTileHit"] = null;
		this.guessInfo["lastTileHit"] = null;
		this.guessInfo["lastTileGuessed"] = null;
		this.guessInfo["targetShip"] = null;
		this.guessInfo["lastShipOrientation"] = null;
	}

	//Finds the orientation of the current target ship
	AI.prototype.findOrient = function() {
		var firstHit = this.guessInfo['firstTileHit'];
		var newHit = this.guessInfo['lastTileHit'];

		var row1 = firstHit.split("-")[0];
		var row2 = newHit.split("-")[0];

		var col1 = firstHit.split("-")[1];
		var col2 = newHit.split("-")[1];

		var orient;

		if(row1 == row2) {
			orient = 'horizontal';
		} else if (col1 == col2) {
			orient = 'vertical'
		} else {
			//console.log('bad input!');
		}

		return orient;

	}

	
	//Randomly selects an available tile to guess
	AI.prototype.randomGuess = function() {
		var tile = getRandom(this.enemy.board.guessableSpaces);
		//var tileObj = $(this.enemy.board.selector + ' .tile[data-coord="' + tile + '"]');
		return tile;		
	}


	//Selects next tile to guess based on knowledge of current target
	AI.prototype.educatedGuess = function(startFromTile) {
		var lastTile =  startFromTile || this.guessInfo['lastTileHit']; 

		var orient = this.guessInfo['lastShipOrientation'];
		var row = lastTile.split('-')[0];
		var col = lastTile.split('-')[1];			
		
		var north = numToLetter(letterToNum(row) - 1) + '-' + col;			
		var south = numToLetter(letterToNum(row) + 1) + '-' + col;			
		var east = row + '-' + (parseInt(col) + 1);			
		var west = row + '-' + (parseInt(col) - 1);
		var possibleTargets = [];
		var targetList = [];


		//Unsure of ship orientation, randomyly select a tile next to last hit tile
		if(orient == null) {
			possibleTargets = [north, south, east, west];
		} else if (orient == 'vertical') {
			possibleTargets = [north, south];			
		} else if(orient == 'horizontal') {
			possibleTargets = [east, west];			
		}
		console.log(possibleTargets);

		//Cull targets to possible tiles
		for(var i = 0; i < possibleTargets.length; i++) {
			var targ = possibleTargets[i];
			if(this.enemy.board.guessableSpaces.indexOf(targ) > -1) {		
				targetList.push(targ);
			}
		}
		console.log(this.enemy.board.guessableSpaces);
		console.log(targetList);
		var target = getRandom(targetList);
		return target;
	}


	//GAME CLASS
	function Game() {
		this.gameType;
		this.turns = 0;
		this.p1;
		this.p2;

		this.winner;
		this.loser;

		this.shipPlacer = {
			'currentShip' : null,
			'direction' : 'south'
		};
	}
	window.Game = Game;

	Game.prototype = {
		constructor: Game
	};

	
	//Sets up new game
	Game.prototype.newGame = function() {
		this.p1 = new Human();
		this.p2 = new AI();

		this.players = [this.p1, this.p2];

		this.assignEnemy(this.p1, this.p2);

		this.turns = 0;
		//console.log(this.p1);
		//console.log(this.p2);
	}

	//Assigns each player an enemy so they may see opponents board, check fleet status, etc
	Game.prototype.assignEnemy = function(p1, p2) {
		p1.enemy = p2;
		p2.enemy = p1;
	}

	//Checks both player's fleets.  If one is totally destroyed assigns winner and loser and returns true
	Game.prototype.isGameOver = function() {
		if(!this.p1.fleet.checkFleet() || !this.p2.fleet.checkFleet() ) {			

			if(!this.p1.fleet.checkFleet()) {
				this.winner = 'Player 2';
				this.loser = 'Player 1';
			} else {
				this.winner = 'Player 1';
				this.loser = 'Player 2';
			}

			return true;

		} else {
			return false;
		}
	}

	//Ends game and displays winner/loser message
	Game.prototype.endGame = function() {
		var endMsg = '<p>' + this.loser + ' has lost all ships! ' + this.winner + ' wins!</p>';
		$('.board-wrap').empty();
		$('.board-wrap').html(endMsg);

		this.gameStats();
	}

	Game.prototype.gameStats = function() {

		var statsArea = $('<div>').addClass('stats-area');

		var statTitle = '<h2>Stats</h2>';

		statsArea.append(statTitle);

		for(var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			var playerName = '<h3>' + player.playerType + '</h3>';
			var turns = '<p>Turns: ' + this.turns + '</p>';
			var hits = '<p>Hits: ' + player.hits + '</p>';
			var misses = '<p>Misses: ' + player.misses + '</p>';
			var hitPercent = '<p>Hit percentage: ' + player.getHitPercent() + '%</p>';
			var streak = '<p>Best hit streak: ' + player.bestStreak + '</p>';
			var drySpell = '<p>Longest dryspell: ' + player.longestDrySpell + '</p>';
			var hitsRemaining = '<p>Hit points remaining: ' + player.getTotalHitPoints() + '</p>';

			var stats = [playerName, turns, hits, misses, hitPercent, streak, drySpell, hitsRemaining];

			console.log('hp remaining', player.getTotalHitPoints());

			var playerStats = $('<div>').addClass('player-stats');
			statsArea = statsArea.append(playerStats.append(stats.join('')));
			$('.board-wrap').append(statsArea);

		}
	}



	//Main game area.  Assigns click events, runs human and AI turns, checks for winners.
	Game.prototype.gameLoop = function() {
				  
		var self = this;
		console.log(self.turns);

		//Assign click event to all guessable spaces.
		for(var i = 0; i < this.p1.board.guessableSpaces.length; i++) {
			var coord = this.p1.board.guessableSpaces[i];
			var tileObj = this.p1.objectify(coord);
			tileObj.click(function() {
	  			
				//Only allow clicking on player's turn
				if(self.p1.turn) {
					
					
					var tile = $(this);
					
					//turn off events on a clicked tile
					tile.off();

					//Check human's guess
					self.p1.checkGuess(tile);	
					
					self.turns++;
					self.p1.turn = false;

		
					//After human's turn is done, check game status.

					if(self.isGameOver()) {
						setTimeout(function(){
							self.endGame();
						}, 1000);
					} else {
						
						//AI Guess (after pause) and check game
						setTimeout(function() {
							self.p2.guess();

							if(self.isGameOver()) {
								setTimeout(function(){
									self.endGame();
								}, 1000);
							}

						}, 1200);

						
						
						console.log(self.turns);											
					}

					
				}				

				if(self.turns > 6) {
					self.endGame();
				}


			});
	
		}
	
	}
	
	Game.prototype.chooseShips = function() {
		var self = this;
		var shipCount = 0;
		var ships = [];


		$('.ship-choice').click(function() {
			if(shipCount < 5) {

				var choice = $(this).text();
				var li = $('.ship-list li').first();

				while(li.children('p').text() != '') {
					li = li.next();
					
				}

				li.children('p').text(choice);
				ships.push(choice);
				shipCount++;
				
				if(shipCount >= 5) {
					$('.ship-choice').toggleClass('inactive');
					$('.build-fleet button').toggleClass('inactive');
				}		
			}
		});
	

		$('.remove').click(function() {
			var text = $(this).siblings('p');
			if(text.text() != '') {
				var index = ships.indexOf(text.text());
				text.text('');
				shipCount--;

				ships.splice(index, 1);
				self.shiftShipList();

				if(shipCount < 5) {
					$('.ship-choice').removeClass('inactive');
					$('.build-fleet button').addClass('inactive');
				}
			}				
		});

		$('.build-fleet button').click(function() {
			if(shipCount == 5) {
				self.buildFleet(ships);
			}
		});

	}

	Game.prototype.shiftShipList = function() {
		var shipsInList = $($('.ship-list li p').get());

		shipsInList.each(function(idx) {
			var current = $(this);
			if(current.text() == '') {
				for(var i = idx; i < shipsInList.length; i++) {
					//shift text upwards
					shipsInList.eq(i).text(shipsInList.eq(i + 1).text());
				}	
			}
		});
	}

	Game.prototype.buildFleet = function(ships) {
		for(var i = 0; i < ships.length; i++) {
			var shipType = ships[i];
			this.p1.fleet.shipsInFleet[shipType]++;
			console.log(this.p1.fleet.shipsInFleet[shipType]);

			this.p2.fleet.shipsInFleet[shipType]++;

		}
			this.p1.fleet.addShips();

			console.log('shipsinfleet', this.p1.fleet.shipsInFleet);
			console.log('active', this.p1.fleet.activeShips);

		//this.p1.board.addShips(this.p1.fleet);
		//this.p2.board.addShips(this.p2.fleet);


		

		$('.ship-picker').css('display', 'none');
		//$('.ship-placer').css('display', 'block');

		this.placeShips();
	}

	Game.prototype.placeShips = function() {
		var self = this;
		var ship = null;
		var testboard = new Board('placer');
		var count = 0;

		//CREATE THE SHIP CHOICE BUTTONS
		for(var i = 0; i < this.p1.fleet.activeShips.length; i++) {
			var shipChoice = this.p1.fleet.activeShips[i];

			//ID PART POTENTIALLY UNECESSARY?
			$('<li>').text(shipChoice.shipType).attr('id', shipChoice.ID).appendTo($('.ships-to-place ul'));
		}

		// DISPLAY SECTION
		$('.ship-placer').css('display', 'block');

		//CLICK BUTTON TO PICK A SHIP TO PLACE
		$('.ships-to-place ul li').click(function() {
			$('.active').removeClass('active');
			$(this).addClass('active');
			var index = $(this).index();
			ship = self.shipPlacer.currentShip = self.p1.fleet.activeShips[index];
			self.shipPlacer.direction = 'south'; //return to default


			// console.log(ship, ship.ID, ship.positions);
		});

		$('.placer-board .playable-area .tile').hover(function(){

			
			if(self.canPlace()) {
				
				var coord = $(this).attr('data-coord');
				ship.coord = coord;
				
				var possiblePosition = self.getPossibleShipPosition(ship, testboard);
				
				//PAINT POTENTIAL SPOTS
				for(var i = 0; i < possiblePosition.length; i++) {
					var tile = possiblePosition[i];
					$('.tile[data-coord=' + tile + ']').addClass('potential');
				}


				//PLACE SHIP

				// DOUBLE CLICKING IS A PROBLEM SOMETIMES - NOT SURE WHY IT DELETES THE SHIP SPACES SOMETIMES.

				$(this).click(function(){
					// console.log('click', ship);
					// if(ship != null && ship.positions.length == 0 && possiblePosition) {
					if(self.canPlace() && possiblePosition) {
						ship.addPosition(possiblePosition);
						testboard.removeSpace('available', possiblePosition);
						
						//PAINT PLACED SHIP
						for(var i = 0; i < possiblePosition.length; i++) {
							var tile = possiblePosition[i];
							$('.tile[data-coord=' + tile + ']').addClass('placed');
						}

						//inactivate button
						$('.ships-to-place ul li').eq(ship.ID).removeClass('active').addClass('inactive');
						ship = null;

					}
				});



				// ROTATE SHIPS
				$(document).keydown(function(event) {
					
					if(ship && (event.which == 87 || event.which == 65 || 
						event.which == 83 || event.which == 68 )) {

						if(event.which == 87) {
							self.shipPlacer.direction = 'north';
							
						} else if(event.which == 65) {
							self.shipPlacer.direction = 'west';

						} else if(event.which == 83) {
							self.shipPlacer.direction = 'south';

						} else if(event.which == 68) {
							self.shipPlacer.direction = 'east';
						}

						//CLEAR POTENTIAL AND GET NEW POTENTIAL POSITIONS W/ NEW DIRECTION
						$('.potential').removeClass('potential');
						possiblePosition = self.getPossibleShipPosition(ship, testboard);

						//PAINT POTENTIAL SHIPS
						for(var i = 0; i < possiblePosition.length; i++) {
							var tile = possiblePosition[i];
							$('.tile[data-coord=' + tile + ']').addClass('potential');
						}
					}	
				});
				
				
				
			}
		}, function() {
			$('.potential').removeClass('potential');
		});


	}

	// CHECKS IF THERES A CURRENT SHIP THAT HAS NOT BEEN PLACED
	Game.prototype.canPlace = function() {
		var self = this;
		var ship = self.shipPlacer.currentShip;

		if(ship && !ship.positions.length) {
			return true;
		} else {
			return false;
		}
	}

	// GETS POTENTIAL POSITIONS BASED ON LOCATION AND LENGTH
	Game.prototype.getPossibleShipPosition = function(ship, board) {
		//console.log(this);
		var direction = this.shipPlacer.direction;
		var row = ship.coord.split('-')[0];
		//console.log(row);
		var col = parseInt(ship.coord.split('-')[1]);

		var rowNum = letterToNum(row);
		var shipTiles = [];

		switch(direction) {
			case('north'):
				for(var i = 0; i < ship.shipLength; i++) {
					var possibleCoord = numToLetter(rowNum - i) + '-' + col;
					//testing
					//console.log(possibleCoord);
					if( board.availableSpaces.indexOf(possibleCoord) === -1 ) {
						return false;
					} else {
						shipTiles.push(possibleCoord);
					}
				}
			break;

			case('east'):
				for(var i = 0; i < ship.shipLength; i++) {
					
					var possibleCoord = row + '-' + (col + i);
					
					if( board.availableSpaces.indexOf(possibleCoord) === -1 ) {
						return false;
					} else {
						shipTiles.push(possibleCoord);
					}	
				}				
			break;

			case('south'):
				for(var i = 0; i < ship.shipLength; i++) {
					
					var possibleCoord = numToLetter(rowNum + i) + '-' + col;
				
					if( board.availableSpaces.indexOf(possibleCoord) === -1 ) {
						return false;
					} else {
						shipTiles.push(possibleCoord);
					}
				}
			break;

			case('west'):
				for(var i = 0; i < ship.shipLength; i++) {
					var possibleCoord = row + '-' + (col - i);
					//console.log(possibleCoord);
					if( board.availableSpaces.indexOf(possibleCoord) === -1 ) {
						return false;
					} else {
						shipTiles.push(possibleCoord);
					}	
				}
			break;
		}
		return shipTiles;			
	
	}


	function GameLog() {
		this.gameLog = $('<div>');
	}
	window.GameLog = GameLog;

	GameLog.prototype = {
		constructor: GameLog
	}

	GameLog.prototype.initialize = function() {
		
		this.gameLog.addClass('gamelog');
		
		//buffer to allow for top margin on gamelog
		//may no longer be needed
		var clear = $('<div>').addClass('clear');
		//$('.info-area').append(clear);

		//attach gamelog
		$('.gamelog-container').append(this.gameLog);

		
	}

	//Adds new messages to the gameLog
	GameLog.prototype.output = function(message) {
		if(game.p1.turn) {
			var actor = "Human";
		} else {
			var actor = "AI";
		}

		var message = '<p>' + actor + ": " + message + '</p>';
		this.gameLog.append(message);

		//Scroll to bottom when adding new content
		//Access DOM object directly, not the jQuery wrapper
		this.gameLog[0].scrollTop = this.gameLog[0].scrollHeight;
	}

	function Scoreboard() {
		this.scoreboard = $('.scoreboard');
	}
	window.Scoreboard = Scoreboard;

	Scoreboard.prototype = {
		constructor: Scoreboard
	}

	Scoreboard.prototype.initialize = function() {
		var fleet = game.p2.fleet.totalShips;
		//console.log(fleet);
		var html = '';
		for(var i = 0; i < fleet.length; i++) {
			console.log(fleet[i]);
			var ship = fleet[i];
			var shipID = ship.shipType + ship.coord;
			html += '<div class="' + shipID + '">' + ship.shipType + '<div class="hp-wrapper">';
			var HP = ship.hitPoints;

			for(var j = 0; j < HP; j++) {
				html += '<div class="hitpoint hit"></div>';
			}

			html += '</div></div>';
		}

		this.scoreboard.append(html);
	}

	Scoreboard.prototype.update = function(ship) {
		var shipClass = ship.shipType + ship.coord;
		//alert(shipClass + ' hit');
		console.log($('.' + shipClass + ' .hit'));
		$('.' + shipClass + ' .hit').first().removeClass('hit');

	}








	


	var game = new Game();
	game.newGame();
	game.chooseShips();
	

	//WILL HAVE TO MOVE THIS AND FIX
	//SCOREBOARD IS NOT WORKING, CALLED BEFORE SHIPS CHOSEN.
	//GAME LOOP MIGHT HAVE TO BE A CALLBACK IN CHOOSE SHIPS THATS COMES AFTER SHIP CHOOSING AND PLACING
	var gameLog = new GameLog();
	gameLog.initialize();

	var scoreboard = new Scoreboard();
	scoreboard.initialize();
	
	



	game.gameLoop();



})(window);