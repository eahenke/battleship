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

		<!-- <h1>BATTLESHIP</h1> -->

		<!-- To center title relative to boards, put in boardwrap, then change info-area margin-top -->

		<div class="board-wrap">
			<h1>BATTLESHIP</h1>
			<div class="single-board-wrap">
				<h2>Human Board</h2>
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
			</div> <!--single board wrapper-->

			<div class="single-board-wrap">
				<h2>AI Board</h2>
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
			</div><!--single board wrapper-->
		</div>

		<div class="info-area">
			<h2>SCOREBOARD</h2>
			<div class="scoreboard">
				<div class="ships-left">
					<p>Enemy ships remaining:</p>
				</div>
			</div>
			
			<div class="gamelog-container">
				<h2>GAME LOG</h2>
			</div>	


		</div>
		
		<div class="clear"></div>
		<div class="new">New Game</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<script src="functions.js"></script>
	<script src="shipClasses.js"></script>
	<!--<script src="oopbattleship.js"></script> -->

	</body>
