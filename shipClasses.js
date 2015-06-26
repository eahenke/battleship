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

	Ship.prototype.hit = function() {
		this.hitPoints--;
		console.log("Hit " + this.shipType + "! " + this.hitPoints + " hits remaining.");
		/*
		if(! this.checkSink()) {
		}
		*/
	};

	Ship.prototype.checkSink = function() {
		if(this.hitPoints <= 0) {
			console.log(this.shipType + " has sunk!");
			return true;
		}
	};

	Ship.prototype.initialize = function(row, col, dir) {
		this.row = row;
		this.col = col;
		this.direction = dir;
		this.coord = this.getCoord();
	};



	//SHIP SUBCLASSES
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

	Fleet.prototype.checkSink = function(ship) {
		if(ship.hitPoints <= 0) {
			console.log(ship.shipType + " has sunk!");
			this.removeShip(ship);
			return true;
		}	
	}

	Fleet.prototype.checkFleet = function() {
		if(this.activeShips.length === 0) {
			console.log("Game over, you win!");
			$('.game-area .tile').off();
		} else {
			console.log(this.activeShips);			
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
		this.initialize(player);
	}
	window.Board = Board;

	Board.prototype = {
		constructor: Board
	};

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

	Board.prototype.drawShip = function(ship, fleet) {
		fleet.addShip(ship);
		this.removeSpace('available', ship.positions);
		for(var i = 0; i < ship.positions.length; i++) {
			var tile = ship.positions[i];
			$(this.selector + ' .tile[data-coord="' + tile + '"]').addClass('ship ' + ship.shipType);
		}
	}

	//Must pass a DOM object
	Board.prototype.checkHit = function(tile) {			

			//console.log(tile.attr('data-coord'));

			if(tile.hasClass('ship')) {
				return true;
			} else {
				return false;
			}
		}

	Board.prototype.miss = function(tile) {
			tile.addClass('miss');
			this.removeSpace('guessable', tile.attr('data-coord'));
			//this.turns--;
		}

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

	/*
	Board.prototype.checkFleet = function(fleet) {
		console.log(fleet.activeShips);
	}
	*/

	//GAME CLASS
	function Game() {
		this.maxTurns = 20;
		this.turns = this.maxTurns;
		
		this.newGame = function() {
			var fleet = new Fleet();
			var board = new Board();

			board.addShips(fleet);
			this.updateScoreBoard(fleet);
			this.addClicks(board, fleet);

		}

		this.assignEnemy = function(p1, p2) {
			p1.enemy = p2;
			p2.enemy = p1;
		}

		this.updateScoreBoard = function(fleet) {
			$('.turns').text(this.turns);
			var shipsLeft = '';
			for(var i = 0; i < fleet.totalShips.length; i++) {
				var ship = fleet.totalShips[i];
				shipsLeft += '<p>' + ship.shipType + ': ' + ship.hitPoints + '</p>';
				//console.log(ship);
				
			}
			$('.ships-left').empty().append(shipsLeft);

		}

		this.addClicks = function(board, fleet) {
			$('.game-area > .tile').click(function(){
			game.guess($(this), board, fleet);
			});
		}	

		this.guess = function(tile, board, fleet) {
			var tile = $(tile);
			if( !tile.hasClass('miss') && !tile.hasClass('hit') ) {
				if(this.checkHit(tile)) { //hit
					tile.addClass('hit');
					var ship = board.determineShip(tile, fleet);
					ship.hit();
					fleet.checkSink(ship);
					fleet.checkFleet();
				} else { //miss
					tile.addClass('miss');
					this.turns--;
					console.log(this.turns);
					this.checkTurns();
				}
				game.updateScoreBoard(fleet);				
			}

		}

		this.hit = function(ship) {
			ship.hit();
		}

		this.checkTurns = function() {
			if(this.turns == 0) {
				console.log('Game over');
				$('.game-area .tile').off();
				$('.ship').css('background-color', 'red');
			}
		}	
	}

	window.Game = Game;

	Game.prototype = {
		constructor: Game
	};


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

	//Human Subclass
	function Human() {
		Player.call(this, 'human');
	}
	window.Human = Human;
	Human.prototype = Object.create(Player.prototype);
	Human.prototype.constructor = Human;

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
	}

	AI.prototype.boardUpdate = function(tile, tileObj) {
		var board = this.enemy.board;
		tileObj.addClass('hit');
		board.removeSpace('guessable', tile);
	}


	AI.prototype.checkTarget = function(tile, ship) {
		//accidental hit
		if(this.guessInfo['targetShip'] && ship != this.guessInfo['targetShip'] ) {
			alert('diff ship');
			this.guessInfo['knownShips'].push(tile);
			console.log('known ships added: ');
			console.log(this.guessInfo['knownShips']);

			//check it's sink status anyway
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

	AI.prototype.updateGuessInfo = function(tile, ship) {
		this.guessInfo['targetShip'] = this.guessInfo['targetShip'] || ship;					
		this.guessInfo['firstTileHit'] = this.guessInfo['firstTileHit'] || tile;
		this.guessInfo['lastTileHit'] = tile;

		//if there are two hits, find orient if one doesn't already exist
		if(this.guessInfo['firstTileHit'] != this.guessInfo['lastTileHit']) {
			this.guessInfo['lastShipOrientation'] = this.guessInfo['lastShipOrientation'] || this.findOrient();		
		}
	}

	AI.prototype.getTile = function() {
		var tile = this.educatedGuess();
		if(! tile) {
			console.log('out of bounds');
			tile = this.educatedGuess(this.guessInfo['firstTileHit']);
		}

		return tile;
	}

	AI.prototype.findATarget = function() {
		var board = this.enemy.board;

		//find a new target
		if(this.guessInfo['knownShips'].length) {
			alert('searching known ships');

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

	AI.prototype.removeSunkFromMemory = function(ship) {		
		for(var i = 0; i < ship.positions.length; i++) {
			var shipTile = ship.positions[i];
			if(this.guessInfo['knownShips'].indexOf(shipTile) > -1) {
				alert('removing from knownShips');
				alert(shipTile);
				console.log('REMOVING FROM KNOWN SHIPS: ' + shipTile);
				var index = this.guessInfo['knownShips'].indexOf(shipTile);
				this.guessInfo['knownShips'].splice(index, 1);
			}
		}
	}



	//clear all except known ships
	AI.prototype.clearGuessInfo = function() {
		this.guessInfo["firstTileHit"] = null;
		this.guessInfo["lastTileHit"] = null;
		this.guessInfo["lastTileGuessed"] = null;
		this.guessInfo["targetShip"] = null;
		this.guessInfo["lastShipOrientation"] = null;
	}

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
			console.log('bad input!');
		}

		return orient;

	}

	AI.prototype.objectify = function(tile) {
		return $(this.enemy.board.selector + ' .tile[data-coord="' + tile + '"]');
	}

	AI.prototype.randomGuess = function() {
		var tile = getRandom(this.enemy.board.guessableSpaces);
		//var tileObj = $(this.enemy.board.selector + ' .tile[data-coord="' + tile + '"]');
		return tile;		
	}



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


	var game = new Game();
	//game.newGame();

	var ai = new AI();
	var player = new Human();
	game.assignEnemy(player, ai);

	

	for(var i = 0; i < 35; i++) {
		ai.guess();
		console.log(ai.guessInfo);	
	}	

})(window);