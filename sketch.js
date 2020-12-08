var PLAY = 1;
var END = 0;
var gameState = PLAY;

var player, playerI;
var ground, groundI;
var obstaclesGroup, obstacle1, obstacle2, meteor;

var score;
var gameOverI, restartI;
var jumpSound, checkPointSound, dieSound;

function preload() {

  playerI = loadImage("player.png");
  groundI = loadImage("ground.jpg");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");

}

function setup() {
  createCanvas(600, 200);

  player = createSprite(50, 127, 20, 50);
  player.addImage(playerI);
  player.scale = 0.08;

  ground = createSprite(150, 265, 400, 20);
  ground.addImage(groundI);
  ground.scale = 4.5;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  obstaclesGroup = createGroup();

  score = 0;

}

function draw() {
  background("black");

  text("Score: " + score, 500, 50);

  if (gameState === PLAY) {

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score / 100);
    score = score + Math.round(getFrameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("space") && player.y >= 100) {
      player.velocityY = -12;
      jumpSound.play();
    }

    player.velocityY = player.velocityY + 0.8

    player.collide(ground);

    spawnObstacles();

    if (obstaclesGroup.isTouching(player)) {
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play()

    }

  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    player.velocityY = 0;
    
    obstaclesGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }

  }

  drawSprites();
}

function reset(){
   gameOver.visible = false;
   restart.visible = false;
  
  gameState = PLAY;
  
  score = 0;
  
  obstaclesGroup.destroyEach();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 125, 10, 40);
    obstacle.velocityX = -(6 + score / 100);

    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      default:
        break;
    }

    obstacle.scale = 0.3;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
  }
}