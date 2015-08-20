(function(window) {
	"use strict";

	//SHIP CLASS
	function Ship(shipType, shipLength) {
		this.shipType = shipType;
		this.shipLength = shipLength;
		this.ID;
		this.row;
		this.col;
		this.coord;
		this.direction = 'south';
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

	Ship.prototype.setCoord = function(coord) {
		this.coord = coord;
		this.row = coord.split('-')[0];		
		this.col = parseInt(coord.split('-')[1]);
	}

	//Add tile coordinate or array of coordinates to ship's position property
	Ship.prototype.addPosition = function(coords) {
		console.log('add position', coords);
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

		// var hitPlur;

		// //Correct plurals
		// if(this.hitPoints == 1) {
		// 	hitPlur = 'hit';
		// } else {
		// 	hitPlur = 'hits';
		// }

		// //Don't output hit points if sunk, sinking message will display instead.
		// if(this.hitPoints > 0) {
		// 	gameLog.output("Hit " + this.shipType + "! " + this.hitPoints + " " + hitPlur + " remaining.");			
		// }

	};

	Ship.prototype.hitMessage = function() {
		var hitPlur;

		//Correct plurals
		if(this.hitPoints == 1) {
			hitPlur = 'hit';
		} else {
			hitPlur = 'hits';
		}

		//Don't output hit points if sunk, sinking message will display instead.
		if(this.hitPoints > 0) {
			return("Hit " + this.shipType + "! " + this.hitPoints + " " + hitPlur + " remaining.");			
		} else {
			return("Hit " + this.shipType + "! " + this.shipType + " has sunk!");
		}		
	}





	//SHIP SUBCLASSES
	//Instances of Ship, with differing names and lengths.
	
	function Carrier(){
		Ship.call(this, 'Carrier', 5);
	};
	Carrier.prototype = Object.create(Ship.prototype);
	Carrier.prototype.constructor = Carrier;
	window.Carrier = Carrier;


	function Battleship(){
		Ship.call(this, 'Battleship', 4);		
	};
	Battleship.prototype = Object.create(Ship.prototype);
	Battleship.prototype.constructor = Battleship;
	window.Battleship = Battleship;

	function Cruiser(){
		Ship.call(this, 'Cruiser', 3);
	};
	Cruiser.prototype = Object.create(Ship.prototype);
	Cruiser.prototype.constructor = Cruiser;
	window.Cruiser = Cruiser;

	function Submarine(){
		Ship.call(this, 'Submarine', 3);
		
	};
	Submarine.prototype = Object.create(Ship.prototype);
	Submarine.prototype.constructor = Submarine;
	window.Submarine = Submarine;

	function Destroyer(){
		Ship.call(this, 'Destroyer', 2);
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
	//MAYBE UNNECESSARY OR BETTER ELSEWHERE?
	Fleet.prototype.checkSink = function(ship) {
		if(ship.hitPoints <= 0) {
			//gameLog.output(ship.shipType + ' has sunk!');
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

	//Builds standard fleet of 1 ship per type
	Fleet.prototype.standardFleet = function() {
		var self = this;

		for(var ship in self.shipsInFleet) {
			self.shipsInFleet[ship] = 1;
			console.log(ship);
			console.log(self.shipsInFleet);
		}		
		self.addShips();
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


	// GETS POTENTIAL POSITIONS BASED ON LOCATION AND LENGTH

	//TO DO: make it return an object with all positions, and a true/false - to show positions in
	//different color, instead of just return false for preview
	Board.prototype.getPossibleShipPosition = function(ship) {
		
		var direction = ship.direction;		
		var row = ship.row;
		var col = ship.col;

		var rowNum = letterToNum(row);
		var shipTiles = [];

		switch(direction) {
			case('north'):
				for(var i = 0; i < ship.shipLength; i++) {
					var possibleCoord = numToLetter(rowNum - i) + '-' + col;
					
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
				//console.log('Removed space: ' + coord);
			}
		} else if(coord.constructor === Array) {
			for(var i = 0; i < coord.length; i++) {
				var index = this[spacesList].indexOf(coord[i]);
				if(index > -1) {
					this[spacesList].splice(index, 1);
					//for testing
					//console.log(' Removed space: ' + coord[i]);		
				}
			}
		}
	}

	
	//Give ships in fleet random positions
	Board.prototype.addRandomShips = function(fleet) {
		//console.log('ai fleet', fleet);

		for(var i = 0; i < fleet.totalShips.length; i++) {		
			var ship = fleet.totalShips[i];

			//console.log('adding random ship: ', ship)

			var row = getRandom(this.rows);
			var col = getRandom(this.cols);
			var dir = getRandom(this.directions);

			var coord = row + '-' + col;

			ship.setCoord(coord);
			ship.direction = dir;
			
			var positions = this.getPossibleShipPosition(ship);

			//if false, rerun until true
			while(! positions) {
				row = getRandom(this.rows);
				col = getRandom(this.cols);
				dir = getRandom(this.directions);

				//console.log('new row ', row, 'new col ', col, 'new direction ', dir);

				ship.direction = dir;
				ship.setCoord(row + '-' + col);
				
				positions = this.getPossibleShipPosition(ship);
			}

			ship.addPosition(positions);
			this.drawShip(positions, 'ship ' + ship.shipType);
			this.removeSpace('available', positions);
		}
	}

	//Draw all ships in fleet
	Board.prototype.drawAllShips = function(fleet) {
		for(var i = 0; i < fleet.totalShips.length; i++) {
			var ship = fleet.totalShips[i];

			this.drawShip(ship.positions, 'ship ' + ship.shipType);
		}
	}

	//Add ship to a board with given positions
	Board.prototype.drawShip = function(positions, className) {
		console.log(positions);
		for(var i = 0; i < positions.length; i++) {
			var tile = positions[i];
			$(this.selector + ' .tile[data-coord=' + tile + ']').addClass(className);
		}

		//remove spaces from player boards, but not placer board
		if(this.owner != 'placer' ) {
			this.removeSpace('available', positions);
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

			//gameLog.output('Miss!');
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

		//stats
		this.hits = 0;
		this. misses = 0;
		this.currentStreak = 0;
		this.bestStreak = 0;
		this.currentDrySpell = 0;
		this.longestDrySpell = 0;

		//turn info
		this.turnInfo = {
			'result' : null,
			'ship' : null,
			'message' : null,
		}

		this.board = new Board(this.playerType);
		this.fleet = new Fleet();

	}
	window.Player = Player;

	Player.prototype = {
		constructor: Player
	}

	//Resets turn info, call at start of each turn
	Player.prototype.resetTurnInfo = function() {
		for(var prop in this.turnInfo) {
			prop = null;
		}
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

	//Gets remaining hit points of all player's active ships
	Player.prototype.getTotalHitPoints = function() {
		var hitPoints = 0;
		var activeShips = this.fleet.activeShips;

		for(var i = 0; i < activeShips.length; i++) {
			hitPoints += activeShips[i].hitPoints;
		}

		return hitPoints;
	}


	Player.prototype.getHitPercent = function() {
		return Math.round(((this.hits / (this.hits + this.misses)) * 100) * 100) / 100;
	}

	//Increases hit streak
	Player.prototype.increaseStreak = function() {
		this.currentStreak++;
	}

	//If new streak breaks old record, update bestStreak property
	Player.prototype.updateStreak = function() {
		if(this.currentStreak > this.bestStreak) {
			this.bestStreak = this.currentStreak;
		}
	}

	//Increase miss streak
	Player.prototype.increaseDrySpell = function() {
		this.currentDrySpell++;
	}

	//If new miss streak breaks record, update longestDrySpell property
	Player.prototype.updateDrySpell = function() {
		if(this.currentDrySpell > this.longestDrySpell) {
			this.longestDrySpell = this.currentDrySpell;
		}
	}

	//Updates stats each turn
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
	function Human(gamelog) {
		Player.call(this, 'human');
		this.turn = true;
		this.gamelog = gamelog;
	}
	window.Human = Human;
	Human.prototype = Object.create(Player.prototype);
	Human.prototype.constructor = Human;


	
	//Checks hit/miss status of human guess.
	Human.prototype.guess = function(tileObj) {
		//console.log(this);
		//console.log(this.board.availableSpaces);
		var self = this;
		console.log(self);

		self.resetTurnInfo();

		var tile = tileObj.attr('data-coord');


		if(!tileObj.hasClass('hit') && !tileObj.hasClass('miss')) {
			
			var board = this.enemy.board;
			

			//REFACTOR WITH BOARDUPDATE - SEE AI CLASS BELOW
			if(board.checkHit(tileObj)) {
				tileObj.addClass('hit');
				var ship = board.determineShip(tile, this.enemy.fleet);
				ship.hit();

				//update turnInfo
				self.turnInfo.result = 'hit';
				self.turnInfo.ship = ship;
				self.turnInfo.message = ship.hitMessage();


				//this.gamelog.output(ship.hitMessage());
				
				//Player stats
				this.updateStats('hit');


				//SCOREBOARD - FIX NEXT - COULD ALSO USE TURNINFO
				//scoreboard.update(ship);

				this.enemy.fleet.checkSink(ship);
				
			} else {
				board.miss(tileObj);
				
				//this.gamelog.output('Miss!');
				self.turnInfo.result = 'miss';
				self.turnInfo.message = 'Miss!';

				
				self.updateStats('miss');

			}
			
			console.log(tile);
			board.removeSpace('guessable', tile);
		}

	}


	//AI Subclass
	function AI(gamelog) {
		Player.call(this, 'ai');

		this.gamelog = gamelog;
		
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
		var self = this;

		console.log(this);
		this.resetTurnInfo();

		//no target
		if(this.guessInfo['targetShip'] == null) {

			//console.log('known ships');
			//console.log(this.guessInfo['knownShips']);

			var tile = this.findATarget();

		} else { //has target
			//console.log('has target');
			var tile = this.getTile();
		}

		var tileObj = this.objectify(tile);
		//console.log(tile);

			
		if(board.checkHit(tileObj)) { //hit
			//board stuff
			this.boardUpdate(tile, tileObj);

			var ship = board.determineShip(tile, this.enemy.fleet);
			ship.hit();

			//update turnInfo
			self.turnInfo.result = 'hit';
			self.turnInfo.ship = ship;
			self.turnInfo.message = ship.hitMessage();



			//this.gamelog.output(ship.hitMessage());
			
			// Player stats
			this.updateStats('hit');

			this.checkTarget(tile, ship);

		} else { //miss
			board.miss(tileObj);
			//this.gamelog.output('Miss!');

			this.turnInfo.result = 'miss';
			this.turnInfo.message = 'Miss!';
			
			this.updateStats('miss');
		}		
		this.guessInfo['lastTileGuessed'] = tile;
		
		//Allow human to guess again
		this.enemy.turn = true;
	}

	//Gets the neighbors of a tile that are still guessable
		//SIGNIFICANT OVERLAP WITH EDUCATED GUESS - CONSIDER COMBINING
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
		//console.log('neighbors: ' , neighbors);		
		return neighbors;


	}

	//Update game board in case of hit.
	//MAYBE MOVE TO BOARD.PROTOTYPE
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
			//console.log('known ships added: ');
			//console.log(this.guessInfo['knownShips']);

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
			//console.log('out of bounds');
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
				//console.log('REMOVING FROM KNOWN SHIPS: ' + shipTile);
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
		//console.log(possibleTargets);

		//Cull targets to possible tiles
		for(var i = 0; i < possibleTargets.length; i++) {
			var targ = possibleTargets[i];
			if(this.enemy.board.guessableSpaces.indexOf(targ) > -1) {		
				targetList.push(targ);
			}
		}
		//console.log(this.enemy.board.guessableSpaces);
		//console.log(targetList);
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

		this.gamelog = new GameLog();
		//console.log(this.gamelog);


		this.shipPlacer = {
			'currentShip' : null,
		};
	}
	window.Game = Game;

	Game.prototype = {
		constructor: Game
	};

	
	//Sets up new game
	Game.prototype.initialize = function() {
		var self = this;
		this.gamelog.initialize();

		this.p1 = new Human();
		this.p2 = new AI();

		this.players = [this.p1, this.p2];

		this.assignEnemy(this.p1, this.p2);

		this.turns = 0;



		//Game choice
		$('button.custom').click(function() {
			self.chooseShips();
		});

		$('button.standard').click(function() {
			self.standardGame();
		});
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
		var self = this;

		$('.ai-board .ship').addClass('end');

		$('.stats').fadeIn('slow').click(function() {
			//var endMsg = '<p>' + self.loser + ' has lost all ships! ' + self.winner + ' wins!</p>';
			
			$('.board-wrap').empty();
			$('.board-wrap').html(endMsg);

			self.gameStats();
		});

		
		
		
		
	

	}

	//Displays stats after game
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
					self.p1.guess(tile);
					self.gamelog.output('Human', self.p1.turnInfo.message);
					
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
							self.gamelog.output('AI', self.p2.turnInfo.message);

							if(self.isGameOver()) {
								setTimeout(function(){
									self.endGame();
								}, 1000);
							}

						}, 1200);

						
						
						//console.log(self.turns);											
					}					
				}
			});
	
		}
	
	}
	
	//Game section that allows player to choose which ships to use in a custom game
	Game.prototype.chooseShips = function() {
		var self = this;
		var shipCount = 0;
		var ships = [];

		//Hide/display sections
		$('.game-types').css('display', 'none');
		$('.ship-picker').css('display', 'block');


		//Add ships to ship list if space available
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
				
				//activate/inactive buttons
				if(shipCount >= 5) {
					$('.ship-choice').toggleClass('inactive');
					$('.build-fleet button').toggleClass('inactive');
				}		
			}
		});
	
		//Remove ships from list and shift list upwards
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

		//If 5 ships, build the players' fleets, and trigger the ship placement 
		$('.build-fleet button').click(function() {
			if(shipCount == 5) {
				self.buildFleet(ships);
				self.placeShips();
				$('.ship-picker').css('display', 'none');
			}
		});

	}

	//Shifts the ship list up
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

	//Sets up standard fleets (1 per ship type), random boards
	Game.prototype.standardGame = function() {
		this.p1.fleet.standardFleet();
		this.p2.fleet.standardFleet();

		this.buildBoards(false); //not custom
		$('.game-types').css('display', 'none');
	}

	//Constructs each player's fleet based on selected ships
	Game.prototype.buildFleet = function(ships) {
		for(var i = 0; i < ships.length; i++) {
			var shipType = ships[i];
			this.p1.fleet.shipsInFleet[shipType]++;
			console.log(this.p1.fleet.shipsInFleet[shipType]);

			this.p2.fleet.shipsInFleet[shipType]++;

		}
		this.p1.fleet.addShips();
		this.p2.fleet.addShips();

		//$('.ship-picker').css('display', 'none');
	}

	//Event handling allowing players to place their own ships
	Game.prototype.placeShips = function() {		
		var self = this;
		var ship = null;
		var placerBoard = new Board('placer');
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
			$('.ships-to-place .active').removeClass('active');
			$(this).addClass('active');
			var index = $(this).index();
			ship = self.p1.fleet.activeShips[index];
			self.shipPlacer.currentShip = self.p1.fleet.activeShips[index];
		});



		//SHOW PREVIEW OF SHIP PLACEMENT ON HOVER
		$('.placer-board .playable-area .tile').hover(function(){

			
			if(self.canPlace()) {
				
				var coord = $(this).attr('data-coord');
				ship.setCoord(coord);
				
				var possiblePosition = placerBoard.getPossibleShipPosition(ship);
				console.log('current possible positions', possiblePosition);
				
				
				//PAINT POTENTIAL SPOTS
				placerBoard.drawShip(possiblePosition, 'potential');


				//PLACE SHIP
				$(this).click(function(){

					if(self.canPlace()) {
						possiblePosition = placerBoard.getPossibleShipPosition(ship);
						
					
						if(possiblePosition) {
							ship.addPosition(possiblePosition);
							placerBoard.removeSpace('available', possiblePosition);
							
							//PAINT PLACED SHIP
							placerBoard.drawShip(ship.positions, 'placed');

							//inactivate button
							$('.ships-to-place ul li').eq(ship.ID).removeClass('active').addClass('inactive');
							
							//all buttons inactive, all ships placed
							if( $('.ships-to-place ul li.inactive').length == 5) {
								$('.start').removeClass('inactive').addClass('active');

								//Setup player boards, start game
								$('button.start.active').click(function() {
									self.buildBoards(true);
									
								});
							}

							//reset ship
							ship = null;
						}
					}
				});



				// ROTATE SHIPS
				//clean up once you redo the random ship placement function
				$(document).keydown(function(event) {
					
					if(ship && (event.which == 87 || event.which == 65 || 
						event.which == 83 || event.which == 68 )) {

						if(event.which == 87) {
							ship.direction = 'north';
							
						} else if(event.which == 65) {
							ship.direction = 'west';

						} else if(event.which == 83) {
							ship.direction = 'south';

						} else if(event.which == 68) {
							ship.direction = 'east';							

						}

						//CLEAR POTENTIAL AND GET NEW POTENTIAL POSITIONS W/ NEW DIRECTION
						$('.potential').removeClass('potential');						
						possiblePosition = placerBoard.getPossibleShipPosition(ship);
						placerBoard.drawShip(possiblePosition, 'potential');
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


	Game.prototype.buildBoards = function(custom) {
		var self = this;

		if(custom) {
			self.p1.board.drawAllShips(self.p1.fleet);
		} else {
			self.p1.board.addRandomShips(self.p1.fleet);
		}
		
		self.p2.board.addRandomShips(self.p2.fleet);

		$('.ship-placer').css('display', 'none');
		$('.game-area').css('display', 'block');

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
	GameLog.prototype.output = function(actor, message) {
		/*
		if(game.p1.turn) {
			var actor = "Human";
		} else {
			var actor = "AI";
		}
		*/
	
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

	Scoreboard.prototype.initialize = function(game) {
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


newGame();



function newGame() {
	
	var game = new Game();
	game.initialize();
	//game.chooseShips();
	

	//WILL HAVE TO MOVE THIS AND FIX
	//SCOREBOARD IS NOT WORKING, CALLED BEFORE SHIPS CHOSEN.
	//GAME LOOP MIGHT HAVE TO BE A CALLBACK IN CHOOSE SHIPS THATS COMES AFTER SHIP CHOOSING AND PLACING
	//var gameLog = new GameLog();
	//gameLog.initialize();

	//var scoreboard = new Scoreboard();
	//scoreboard.initialize(game);
	
	



	game.gameLoop();
}

	





})(window);