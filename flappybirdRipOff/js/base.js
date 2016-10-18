 window.onload = function() {

 	var game = new Phaser.Game(720, 1150, Phaser.AUTO, '', { preload: preload, create: create, update: update });

 	function preload(){

 		game.load.image('pilar', 'assets/pilar.png');
 		game.load.image('pilar2', 'assets/pilar2.png');
 		game.load.image("bird", "assets/bird.png");
 		game.load.text

 	}

 	var pilars = [];
 	var player;
 	var cursors;
 	var scoreText;
 	var score = 0;
 	var gameover;
 	var gameoverInfo;
 

 	function create(){

 		game.physics.startSystem(Phaser.Physics.ARCADE);
 		newPilar();

 		addplayer();

	    cursors = game.input.keyboard.createCursorKeys();


	    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: 'white' });

 	}

 	var canSpawn = true;

 

 	function update(){

 		

 		var PilarToDestroy = null;

 		console.log(pilars.length);

 		for(var i = 0; i< pilars.length; i++){

 			

 			pilars[i].up.body.velocity.x = -150;

 			pilars[i].down.body.velocity.x = -150;

 			

 				if(pilars[i].up.x <= 200 && canSpawn)
 				{	
 				
 					newPilar();
 					canSpawn = false;
 					score++;
 				}
 				
 				if(pilars[i].up.x <= -118)
 				{
 					canSpawn = true;
 					PilarToDestroy = i;

 				}

 				 game.physics.arcade.overlap(player, pilars[i].up, gameOver, null, this);


 				 game.physics.arcade.overlap(player, pilars[i].down, gameOver, null, this);
 				

 		};

 		if(PilarToDestroy != null)
 			 {
 			 	pilars.splice(PilarToDestroy, 1);

 			 }
 	
 			  if (cursors.up.isDown)
		    {

		        player.body.velocity.y = -310;


		    }


    /*  $(document).on("touchstart", function(){
         player.body.velocity.y = -250;
      });*/

 		scoreText.text = "score: " + score;


 		if(gameover)
 		{
 			game.paused = true;

 		}


 			$(document).click(function(){
 		if(gameover)
		        {

		 		 	game.paused = false;
		        	player.kill();
		        	gameover = false;
				    score = 0;
		 		 	GameOverText.text = " ";
		 		 	gameoverInfo.text = " ";
		 		 	deletePilars();
		 		 	newPilar();
		 		 	addplayer();
		 		 	canSpawn=true;
		 		 	

		        }
		    });




 	}

 	function deletePilars(){
 		for(var i = 0; i < pilars.length; i++)
 		{
 			pilars[i].down.destroy();
 			pilars[i].up.destroy();
 			pilars[i] = null;
		}

		pilars = [];

 	}

 	function gameOver(){

	    GameOverText = game.add.text(250,500, " ", { fontSize: '32px', fill: 'white' });
	    gameoverInfo = game.add.text(230,530, " ", { fontSize: '32px', fill: 'white' });
	    gameoverInfo.text = "TAB TO RESTART";
 		GameOverText.text = "GAME OVER : " + score;
 		 player.null;
 		 gameover = true;		
 		
 	}

 	function addplayer(){


 		 player = game.add.sprite(180, game.world.height - 600, 'bird');
 		 game.physics.arcade.enable(player);
	     player.body.gravity.y = 900;
	     player.body.collideWorldBounds = true;

 	}


 	function newPilar(){

 			var pilar  = {};

 			var height = (game.world.height - 200) - Math.random() * 600;

 			pilar.up = game.add.sprite(game.world.width,height, "pilar")

 			var pilarYloc = pilar.up.y;

 			pilar.down =  game.add.sprite(game.world.width, pilarYloc - 800 - 150, "pilar2");


 			game.physics.arcade.enable(pilar.up);
 		
 			pilar.up.body.immovable = true;


 			game.physics.arcade.enable(pilar.down);
 		
 			pilar.down.body.immovable = true;

 			pilars.push(pilar);
	 	
 	
 	}



 };