<!DOCTYPE html>

<html lang="en">
	<head>
	    <title>Battleship</title>
	    <meta charset="utf-8" />
	    <meta name="author" content="Eric Henke" />
	    <meta name="description" content="" />
	    <meta name="viewport" content="width=device-width" /> 

	 	<link href="battleship.css" rel="stylesheet" type="text/css" />
	</head>

	<body>

		<h1>BATTLESHIP</h1>

		<div class="turn"></div>

		<div class="new">New Game</div>

		<div class="board-wrap">
			<div class="board human-board">
			<!-- <p>Player Board</p>
			<p>AI Board</p> -->
				
				<?php
				$rows = range('A', 'J');
				$columns = range(1, 10);
				?>

				<div class="labels">
					<div class="row-label">
						<?php foreach($rows as $row) { ?>
							<div class="tile label" id="<?php echo $row; ?>"><?php echo $row; ?></div>
						<?php } ?>
					</div>

					<div class="column-label">
						<?php foreach($columns as $col) { ?>
							<div class="tile label" id="<?php echo $col; ?>"><?php echo $col; ?></div>
						<?php } ?>
					</div>
				</div><!--Labels-->

				<div class="game-area">
					
					<?php /* foreach($rows as $row) {
						$count = 0;

						foreach($columns as $col) {
							$coord = $row . '-' . $col;
							if($count == 0) { ?>
								<div class="clear tile" id="<?php echo $coord;?>"></div>	
							 <?php } else { ?>
							 	<div class="tile" id="<?php echo $coord;?>"></div>	
							 <?php }
							 $count++;
						} //end cols 
					} //end rows */ ?>
		
				</div>
			</div>

			<div class="board ai-board">
				
				<?php
				$rows = range('A', 'J');
				$columns = range(1, 10);
				?>

				<div class="labels">
					<div class="row-label">
						<?php foreach($rows as $row) { ?>
							<div class="tile label" id="<?php echo $row; ?>"><?php echo $row; ?></div>
						<?php } ?>
					</div>

					<div class="column-label">
						<?php foreach($columns as $col) { ?>
							<div class="tile label" id="<?php echo $col; ?>"><?php echo $col; ?></div>
						<?php } ?>
					</div>
				</div><!--Labels-->

				<div class="game-area">
					
					<?php /* foreach($rows as $row) {
						$count = 0;

						foreach($columns as $col) {
							$coord = $row . '-' . $col;
							if($count == 0) { ?>
								<div class="clear tile" id="<?php echo $coord;?>"></div>	
							 <?php } else { ?>
							 	<div class="tile" id="<?php echo $coord;?>"></div>	
							 <?php }
							 $count++;
						} //end cols 
					} //end rows */ ?>
		
				</div>
			</div>
		</div>

		<div class="scoreboard">
			<p>SCOREBOARD</p>
			<p>Turns: <span class="turns"></span></p>
			<p>Ships:</p>
			<div class="ships-left"></div>
		</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<script src="functions.js"></script>
	<script src="shipClasses.js"></script>
	<script src="oopbattleship.js"></script>

	</body>
