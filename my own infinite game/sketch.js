 //add variables to store the objects
 var ghost, ghostImage;

 var ground, groundImage, invisbleGround, cloudsImage;

 var objects1,objects2,objects3, objects4, objects5, objects6, birds, bull;

 // groups
 var objectG, birdsG, cloudsG, bulletsG;

 //ballons
 var ballon1, ballon2, ballon3;

 //States
 var gameOver, restart
 var gameoverImg, restartImg;

 //sounds
 var jumpSound, checkPointSound, dieSound;

//score varibale
var score = 0;
var eaten = 0;


 // gamestate
 var PLAY = 1;
 var END = 0;
 var START = 3
 var gameState = START;

 function preload(){
   
  //preload animations and images
  ghostImage =  loadAnimation("ghost1.png","ghost2.png","ghost3.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  objects1 = loadImage("obstacle1.png");
  objects2 = loadImage("obstacle2.png");
  objects3 = loadImage("obstacle3.png");
  objects4 = loadImage("obstacle4.png");
  objects5 = loadImage("obstacle5.png");
  objects6 = loadImage("obstacle6.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  bull = loadImage("arrow0.png");
  ballon1 = loadImage("red_balloon0.png");
  ballon2 = loadImage("pink_balloon0.png");
  ballon3 = loadImage("green_balloon0.png");

  //preload the sounds
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");

 }
 
 function setup(){
   createCanvas(600,200);
   
   //create a ghost sprite
   ghost = createSprite(540,140,10,10);
   ghost.addAnimation("good",ghostImage);
   ghost.scale=0.3;
   ghost.visible = false;
   
   console.log(getFrameRate());
   console.log(frameCount);
   
   

   //add the ground sprite
   ground = createSprite(600,190,600,10);
   ground.addImage(groundImage);
   ground.scale=1.2;
   //make it look like the ground is infite
   ground.x = ground.width /2;
   ground.visible = false;

   // Add the gameover and the restart as sprties
   gameOver = createSprite(300,100);
   gameOver.addImage(gameOverImg);
   gameOver.scale = 0.5;

   restart = createSprite(300,140);
   restart.addImage(restartImg);
   restart.scale = 0.5;

   //creating a invisable ground
   invisbleGround = createSprite(300,190,600,10);
   invisbleGround.visible = false;

   // create groups
   objectG = new Group;
   birdsG = new Group;
   cloudsG = new Group;
   bulletsG = new Group;

   //debug the ghost
   ghost.debug = true;
   ghost.setCollider("circle",0,0,120);

 }
 
 function draw(){

   background(180);

  //display a scoring system
  fill(20);
  textSize(14);
  text("Score: " + score, 500, 50);

  //For the birds eaten
  fill(20);
  textSize(14);
  text("Ballons Popped: " + eaten, 50 ,54);

  // stop the ghost from falling down
  ghost.collide(invisbleGround);

  // add the gamestates
  if(gameState === START){
    background("black");

    gameOver.visible = false;
    restart.visible = false;
    //ground.visible = true;
    //ghost.visible = true;

    fill("white");
    stroke("black");
    strokeWeight(5);
    text("Press 'Spacebar' to jump and 'P' key to shoot",75,100);
    text("Try to make it to the end!",75,120);
    text("To start press 'D' key!",80,140);

  if(keyDown("d")){
    gameState = PLAY;
  }
}
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    ground.visible = true;
    ghost.visible = true;
    
    // if you see this, the problem is that the road can only go that way
    if(ground.x < 0){
      ground.x = ground.width/2;
    }

    // give the ground a velocity and let it speed up when score is increased
    ground.velocityX = -(6 + score/100);

    // add the score
    score = score + Math.round(getFrameRate()/60);

    // birds eaten
    if(birdsG.isTouching(bulletsG)){
      eaten = eaten + 1;
      birdsG.destroyEach();
      bulletsG.destroyEach();
    }

    if(score>0 && score % 100 === 0){
      checkPointSound.play();
    }
  
   //add space key action
   if(keyDown("space") && ghost.y >= 135){
     ghost.velocityY = -12;
     jumpSound.play();
   }
   
   // create the bullets
   if(keyWentDown("p")){
     var bu = bullets();
     bu.addImage(bull);
     bu.y = ghost.y;
     
   }

   //add gravity
   ghost.velocityY = ghost.velocityY + 0.8;

   // spawn the functions
   spawnObjects();
   //spawnBirds();
   spawnClouds();
   //bullets();

   //add the birds when score is = 200
   if(score>200){
    spawnBirds();
  }

  if(objectG.isTouching(ghost)){
    dieSound.play();
    gameState = END;
  }
}
  if(gameState === END){
    
    //add the game over signs
    gameOver.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart) || keyDown("r")){
      reset();
    }

    // let the objects and cloud freeze
    objectG.setLifetimeEach(-1);
    cloudsG.setLifetimeEach(-1);
    objectG.setVelocityXEach(0);
    cloudsG.setVelocityXEach(0);
    birdsG.setVelocityXEach(0);
    birdsG.setLifetimeEach(-1);
    bulletsG.setLifetimeEach(-1);
    bulletsG.setVelocityXEach(0);
    ground.velocityX = 0;
    ghost.visible = false;
    //ghost.lifetime = 0;
  }

   drawSprites();
   // to see the axis of y and x
   //text(mouseX+","+mouseY,mouseX,mouseY);
 }


 // add functions

 function reset(){
 objectG.destroyEach();
 cloudsG.destroyEach();
 gameState = PLAY;
 score = 0;
 eaten = 0;
 ghost.visible = true;
 //ghost.lifetime = -1;

 }
 
 function spawnObjects(){
   if(frameCount % 60 === 0){
     var objects = createSprite(0, 175, 10, 40);
     
     // speed which increaes with score
     objects.velocityX = +(6 + score/100);

     //generate random objects
     var rand = Math.round(random(1,6));
     switch(rand){
       case 1: objects.addImage(objects1);
              break;
       case 2: objects.addImage(objects2);
              break;
       case 3: objects.addImage(objects3);
              break;
       case 3: objects.addImage(objects3);
              break;
       case 4: objects.addImage(objects4);
              break;
       case 5: objects.addImage(objects5);
              break;
       case 6: objects.addImage(objects6);
              break;
       default: break;
     }
     objects.scale = 0.5;

     objects.lifetime = 300;

     // add it to a group
     objectG.add(objects);
   }
 }

 function spawnClouds(){
  if (frameCount % 60 === 0) {
    var cloud = createSprite(0,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = +3;
    cloud.lifetime = 200;
    
    // adjust the depth
    cloud.depth = ghost.depth;
    ghost.depth = ghost.depth + 1;

    cloudsG.add(cloud);
  }
 }
 
 function spawnBirds(){
  if(frameCount % 80===0){
    var bird = createSprite(0,150,20,20);
    bird.y=Math.round(random(70,100));
    bird.velocityX=+(6 + score/100);
    bird.lifetime=200;
    bird.depth= ghost.depth;
    bird.depth= ghost.depth +1;
    birdsG.add(bird);

    var rand1 = Math.round(random(1,3));
    switch(rand1){
      case 1: bird.addImage(ballon1);
            break;
      case 2: bird.addImage(ballon2);
            break;
      case 3: bird.addImage(ballon3);
            break;
      default: break;
    }
    bird.scale = 0.1;
    bird.lifetime = 200;
  }
 }

 function bullets(){
   var bullet = createSprite(580, 150, 20, 20);
   bullet.velocityX=-6;
   bullet.addImage(bull);
   bullet.scale = 0.3
   bullet.lifetime = 200;
   bulletsG.add(bullet);
   return bullet;
 }