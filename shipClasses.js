(function(window) {
	"use strict";

	//SHIP CLASS
	function Ship(shipType, shipLength) {
		this.shipType = shipType;
		this.shipLength = shipLength;
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
		console.log("Hit " + this.shipType + "! " + this.hitPoints + " hits remaining.");
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
	function Fleet(carriers, battleships, submarines, cruisers, destroyers) {
		//Default fleet values, can be overridden. If statement needed for passing 0 as legit value.
		if(carriers !== 0) {
			this.carriers = carriers || 1;			
		}

		if(battleships !== 0) {
			this.battleships = battleships || 1;
		}

		if(submarines !== 0) {
			this.submarines = submarines || 1;			
		}

		if(cruisers !== 0) {
			this.cruisers = cruisers || 1;			
		}

		if(destroyers !== 0) {
			this.destroyers = destroyers || 1;			
		}

		this.shipsInFleet = {
			'Carrier' : this.carriers,
			'Battleship' : this.battleships,
			'Submarine' : this.submarines,
			'Cruiser' : this.cruisers,
			'Destroyer' : this.destroyers
		};
		this.activeShips = [];
		this.totalShips = [];
	}

	window.Fleet = Fleet;

	Fleet.prototype = {
		constructor: Fleet
	};

	//Add a new active ship to the fleet, and update totalships property
	Fleet.prototype.addShip = function(ship) {
		this.activeShips.push(ship);
		this.totalShips.push(ship);
		console.log("added " + ship.shipType);
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
			console.log(ship.shipType + " has sunk!");
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
		$(this.selector + ' .game-area').append(divs);
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


		this.board = new Board(this.playerType);
		this.fleet = new Fleet();

		this.board.addShips(this.fleet);
	}
	window.Player = Player;

	Player.prototype = {
		constructor: Player
	}

	//turns tile string to jQuery tile object.
	Player.prototype.objectify = function(tile) {
		return $(this.enemy.board.selector + ' .tile[data-coord="' + tile + '"]');
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
				this.enemy.fleet.checkSink(ship);
				
			} else {
				board.miss(tileObj);
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
			this.checkTarget(tile, ship);

		} else { //miss
			board.miss(tileObj);			
		}		
		this.guessInfo['lastTileGuessed'] = tile;
		
		//Allow human to guess again
		this.enemy.turn = true;
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
		this.turns;
		this.p1;
		this.p2;

		this.winner;
		this.loser;
	}
	window.Game = Game;

	Game.prototype = {
		constructor: Game
	};

	
	//Sets up new game
	Game.prototype.newGame = function() {
		this.p1 = new Human();
		this.p2 = new AI();

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
					
					self.p1.turn = false;
					
					var tile = $(this);
					
					//turn off events on a clicked tile
					tile.off();

					//Check human's guess
					self.p1.checkGuess(tile);	

		
					//After human's turn is done, check game status.

					if(self.isGameOver()) {
						setTimeout(function(){
							self.endGame();
						}, 1000);
					}

					//AI Guess (after pause) and check game
					setTimeout(function() {
						self.p2.guess();

						if(self.isGameOver()) {
							setTimeout(function(){
								self.endGame();
							}, 1000);
						}

					}, 1200);
					
					self.turns++;
					console.log(self.turns);											
				}				

			});
	
		}
	
	}
	





	var game = new Game();
	game.newGame();
	
	game.gameLoop();


})(window);