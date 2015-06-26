/*

(function() {
	"use strict";

	//var rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	var rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var MAX_TURNS = 10;
	var SHIPS = ['carrier', 'battleship', 'destroyer', 'cruiser', 'cruiser'];


	$(document).ready(function() {
		startGame();
		cheater();
		$('.new').click(startGame);
	});

	function startGame() {
		//alert('new game!');
		$('.tile').removeClass('ship miss hit');
		$('.game-area .tile').off();
		
		$('.turn').text(MAX_TURNS);
		
		shipsInit();		
		gameLoop();
	}

	function gameLoop() {
		var tiles = $('.game-area .tile');
		var turns = parseInt($('.turn').text());
		
		tiles.click(function() {
			turns = parseInt($('.turn').text());
			if(checkTurn(turns)) {				
				guess($(this), turns);
			}
		});
	}

	function guess(tile, turns) {
		if( tile.hasClass('ship') ) {
			//alert('hit!');
			tile.addClass('hit');
		} else {
			//alert('miss!');

			tile.addClass('miss');
			turns --;
		}
		$('.turn').text(turns);
		if(turns == 0) {
			alert('you lose');
			$('.tile').off();
		}
	}

	function checkTurn(turns) {
		if(turns > 0) {
			return true;
		} else {
			return false;
		}
	}

	function checkDirection(direction, shipLength) {
		
		var row = getRandom(rows);
		var col = getRandom(cols);
		var shipTiles = [];
		switch(direction) {
			case('north'):
				//alert('north');
				for(var i = 0; i < shipLength; i++) {
					var tile = '#' + (row - i) + '-' + col;
					if($(tile).hasClass('ship') || (row - i) <= 0) {
						//alert('false');
						return false;
					} else {
						shipTiles.push(tile);
					}					
				}
			break;

			case('east'):
				//alert('east');
				for(var i = 0; i < shipLength; i++) {
					var tile = '#' + row + '-' + (col + i);
					if($(tile).hasClass('ship') || (col + i) > cols.length) {
						//alert('false');
						return false;
					} else {
						shipTiles.push(tile);
					}					
				}
			break;

			case('south'):
				//alert('south');
				for(var i = 0; i < shipLength; i++) {
					var tile = '#' + (row + i) + '-' + col;
					if($(tile).hasClass('ship') || (row + i) > rows.length) {
						//alert('false');
						return false;
					} else {
						shipTiles.push(tile);
					}					
				}
			break;				

			case('west'):
				//alert('west');
				for(var i = 0; i < shipLength; i++) {
					var tile = '#' + row + '-' + (col - i);
					if($(tile).hasClass('ship') || (col - i) <= 0) {
						//alert('false');
						return false;
					} else {
						shipTiles.push(tile);
					}					
				}
			break;
		}
		for(var j = 0; j < shipTiles.length; j++) {
			var shipTile = $(shipTiles[j]);
			shipTile.addClass('ship');
		}
		return true;

	}

	function shipsInit() {
		for(var i = 0; i < SHIPS.length; i++) {
			var shipLength;
			var directions = ['north', 'east', 'south', 'west']
			if(SHIPS[i] == 'destroyer') {
				shipLength = 2;

			} else if (SHIPS[i] == 'cruiser') {
				shipLength = 1;

			} else if (SHIPS[i] == 'battleship') {
				shipLength = 4;
			} else if (SHIPS[i] == 'carrier') {
				shipLength = 5;
			}

			var direction = getRandom(directions);
			var shipPlacement = checkDirection(direction, shipLength);
			
			while(!shipPlacement) {
				direction = getRandom(directions);
				shipPlacement = checkDirection(direction, shipLength);		
			}			
		}


	}

	function getRandom(items) {
		var item = items[Math.floor(Math.random() * items.length)];
		return item;
	}

	function cheater() {
		$('h1').click(function(){
			$('.ship').toggleClass('hit');
		});
	}

	//returns alphanumeral for capital letters
	function letterToNum(letter) {
		if(letter.length === 1 ) {			
			var num = letter.charCodeAt(0) - 64;			
			return num;
		} else {
			console.log("Not a single letter: " + letter);
			return letter;
		}
	}

	function numToLetter(num) {
		var letter = String.fromCharCode(64 + num);
		return letter;
	}

	//console.log(numToLetter(2));

})(); */