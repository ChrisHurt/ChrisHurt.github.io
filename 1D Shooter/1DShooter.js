console.log("-----------1D Shooter------------");
console.log("------A Game by Chris Hurt-------");
console.log("-----Press 'A' to move left------");
console.log("-----Press 'D' to move left------");
console.log("-----Press 'J' to shoot left-----");
console.log("-----Press 'L' to shoot right----");
console.log("-----Make sure you uncheck-------");
console.log("--group similar & click to play--")

// Starting Board & Position Data
var score = 0;
var highScore = 0;
var board = "-------------------------------------\n|_________________◊_________________|\t";
var playerPos = board.indexOf('◊');
var gameTicks = 0;
var ticksToShoot = 0;
var ticksToMove  = 0;
var leftEdgePos = board.indexOf('|');
var rightEdgePos = board.slice(leftEdgePos+1).indexOf('|') + leftEdgePos;
var endScreen = "-------------------\n-----GAME OVER-----\n-------------------";

// Booleans for player controls
var movedLeft = false;
var movedRight = false;
var shotLeft = false;
var shotRight = false;

// Booleans for managing game states
var gameRunning = false;
var setup = true;
var mobile = false;

// Walker Data
var UID = 0;
var walkers = [];
var currentWalkerUIDs = [];

// Bullet Data
var bulletUID = 0;
var bullets = [];
var currentBulletsUIDs = [];

// Timer Handles for clearing timers
var timers = {
    runGame: -1,
    spawnWalkers: -1
}

// Allows for only one instance
function setupGame(){
    if(setup){
        score = 0;
        gameTicks = 0;
        board = "-------------------------------------\n|_________________◊_________________|\t";
        playerPos = board.indexOf('◊');
        leftEdgePos = board.indexOf('|');
        rightEdgePos = board.slice(leftEdgePos+1).indexOf('|') + leftEdgePos;
        ticksToShoot = 0;
        ticksToMove  = 0;
        document.querySelector(".start_game").removeEventListener('click',runGame);
        randomWalkers();
        gameRunning = true;
        setup = false;
        runGame();
    }
}

function runGame(){
    if(gameRunning){
        console.log(" ");
        tick();
        if(board.includes('\t')){
            board = board.slice(0,board.length-1);
        } else {
            board += '\t';
        }
        console.log(board);
        updateScore();
        renderGame();
        clearBulletPops();
        timers.runGame = setTimeout(runGame,30);
    }
}

var endGame = () => {
    gameRunning = false;
    setup = true;
    Object.keys(timers).forEach((timer)=>{
        if(timer){
            clearTimeout(timers[timer]);
        }
        timers[timer] = -1;
    });
    walkers = [];
    currentWalkerUIDs = [];
    leftEdgePos = 0;
    updateHighScore();
    document.querySelector('.start_game').addEventListener('click',runGame);
};

var tick = () =>{
    gameTicks++;
    score++;
    if(movedLeft && (ticksToMove <= 0)){
        playerMoveLeft();
        ticksToMove = 2;
    } else if (movedRight && (ticksToMove <= 0)){
        playerMoveRight();
        ticksToMove = 2;
    } else {
        ticksToMove--;
    }
    bulletTravel();
    if(shotLeft && ticksToShoot <= 0){
        playerShootLeft();
        ticksToShoot = 3;
    } else if(shotRight && ticksToShoot <= 0){
        playerShootRight();
        ticksToShoot = 3;
    } else {
        ticksToShoot--;
    }
    walkerMove();
    if (mobile){
        relaxMobileStates();
    }
}

/* Player move logic */
var playerMoveLeft = () => {
    if(board[playerPos-1] != '|'){
        playerPos -= 1;
        board = board.slice(0,playerPos) + '◊_' + board.slice(playerPos+2);
    }
};
var playerMoveRight = () => {
    if(playerPos < board.length-3){
        playerPos += 1;
        board = board.slice(0,playerPos-1) + '_◊' + board.slice(playerPos+1);
    }
};
/* Player shoot logic */
var playerShootLeft = () => {
        // if player fires point-blank
        for(var i = 0; i < walkers.length;i++){
            if(walkers[i].pos == playerPos + 1){
                deleteWalker(walkers[i].uid);
                board = board.slice(0,playerPos-1) + '*' + board.slice(playerPos);
                return;
            }
        }
        if((playerPos - (leftEdgePos+1)) !== 0){
        board = board.slice(0,playerPos-1) + '•◊' + board.slice(playerPos+1);
        bullets.push({uid:bulletUID,pos:playerPos-1,nextMove:1,range:5,dir:"left"})
        currentBulletsUIDs.push(bulletUID);
        bulletUID++;
    }
};
var playerShootRight = () => {
    for(var i = 0; i < walkers.length;i++){
        if(walkers[i].pos == playerPos + 1){
            deleteWalker(walkers[i].uid);
            board = board.slice(0,playerPos+1) + '*' + board.slice(playerPos+2);
            return;
        }
    }

    if((rightEdgePos - playerPos) !== 0){
        board = board.slice(0,playerPos) + '◊•' + board.slice(playerPos+2);
        bullets.push({uid:bulletUID,pos:playerPos+2,nextMove:1,range:5,dir:"right"})
        currentBulletsUIDs.push(bulletUID);
        bulletUID++;
    }
};

/* Walker Spawn Logic & Behaviour */
var spawnWalkerLeft = () => {
    board = board.slice(0,leftEdgePos+1) + 'Ω' + board.slice(leftEdgePos+2);
    walkers.push({uid:UID,pos:leftEdgePos+1,nextMove:5});
    currentWalkerUIDs.push(UID);
    UID++;
};

var spawnWalkerRight = () => {
    board = board.slice(0,rightEdgePos) + 'Ω' + board.slice(rightEdgePos+1);
    walkers.push({uid:UID,pos:rightEdgePos,nextMove:5});
    currentWalkerUIDs.push(UID);
    UID++;
};

var randomWalkers = () => {
    var randomValue = Math.random();
    if(randomValue >= 0.50){
        spawnWalkerLeft();
    } else {
        spawnWalkerRight();
    }
    // timers.spawnWalkers = setTimeout(randomWalkers,Math.random()*50 + 6300000 / (7000 +  gameTicks));
    timers.spawnWalkers = setTimeout(randomWalkers,Math.random()*50 + 315000 / (350 +  gameTicks));
}

var walkerMove = () => {
    walkers.forEach(walker=>{
        walker.nextMove--;
        if((walker.pos-playerPos)===0){
            board = board.slice(0,walker.pos) + 'Ω' + board.slice(walker.pos + 1);
            console.log(board);
            endGame();
        }
        if(walker.nextMove === 0){
            if((walker.pos-playerPos)===0){
                board = board.slice(0,walker.pos) + 'Ω' + board.slice(walker.pos + 1);
                console.log(board);
                endGame();
            } else if (walker.pos < playerPos){
                board = board.slice(0,walker.pos) + '_Ω' + board.slice(walker.pos+2);
                walker.pos++;
            } else if (walker.pos > playerPos){
                board = board.slice(0,walker.pos-1) + 'Ω_' + board.slice(walker.pos+1);
                walker.pos--;
            }
            walker.nextMove = 10;
        }
    });
};
var clearBulletPops = () => {
    while(board.indexOf('*') != -1){
        board = board.slice(0,board.indexOf('*')) + '_' + board.slice(board.indexOf('*')+1);
    }
};
var bulletTravel = () => {
    bullets.forEach(bullet=>{
        bullet.nextMove--;
        var exitBool = false;
        walkers.forEach(walker=>{
            if(walker.pos === bullet.pos){
                deleteWalker(walker.uid);
                deleteBullet(bullet.uid,"walker");
                exitBool = true;
                return;
            }
        });
        if(exitBool){
            return;
        }
        if(bullet.range === 0){
            deleteBullet(bullet.uid,"range");
            return;
        }
        if(bullet.nextMove === 0 && bullet.range > 0){
            if(bullet.dir === "left"){

                walkers.forEach(walker=>{
                    if(walker.pos == bullet.pos  || (walker.pos + 1 == bullet.pos && walker.nextMove == 1)){
                        deleteWalker(walker.uid);
                        deleteBullet(bullet.uid,"walker");
                        exitBool = true;
                        return;
                    }
                });
                if(exitBool){
                    return;
                }
                if ((bullet.pos - 1 - (leftEdgePos)) <= 1){
                    deleteBullet(bullet.uid,"edge");
                    return;
                } else if(playerPos - bullet.pos === 1){
                    board = board.slice(0,bullet.pos-1) + '•_' + board.slice(bullet.pos+1);
                } else {
                    board = board.slice(0,bullet.pos-1) + '•_' + board.slice(bullet.pos+1);
                }
                bullet.pos--;
            } else if(bullet.dir === "right"){

                walkers.forEach(walker=>{
                    if(walker.pos == bullet.pos || (walker.pos - 1 == bullet.pos && walker.nextMove == 1)){
                        deleteWalker(walker.uid);
                        deleteBullet(bullet.uid,"walker");
                        exitBool = true;
                        return;
                    }
                });
                if(exitBool){
                    return;
                }
                if (Math.abs(rightEdgePos + 1 - bullet.pos) < 1){
                    deleteBullet(bullet.uid,"edge");
                    return;
                } else if(playerPos - bullet.pos === 1){
                    board = board.slice(0,bullet.pos-1) + '_•' + board.slice(bullet.pos+1);
                } else {
                    board = board.slice(0,bullet.pos-1) + '_•' + board.slice(bullet.pos+1);
                }
                
                bullet.pos++;
            }
            bullet.nextMove = 1;
            bullet.range--;
        }
    });
};

var deleteWalker = (walkerToDelete) => {
    score += 1000;
    for(var i = 0; i < walkers.length; i++){
        if(walkers[i].uid === walkerToDelete){
            board = board.slice(0,walkers[i].pos) + '_' + board.slice(walkers[i].pos+1);
            walkers.splice(i,1);
        }
    }
}

var deleteBullet = (bulletToDelete,context) => {
    score -= 500;
    for(var i = 0; i < bullets.length; i++){
        if(bullets[i].uid === bulletToDelete){
            if(bullets[i].dir === "left"){
                if(context == "edge"){
                    if(board[bullets[i].pos - 1] == '|'){
                        board = board.slice(0,bullets[i].pos) + '*' + board.slice(bullets[i].pos+1);
                    } else {
                        board = board.slice(0,bullets[i].pos-1) + '*_' + board.slice(bullets[i].pos+1);
                    }
                } else if(context == "range"){
                    board = board.slice(0,bullets[i].pos-1) + '*_' + board.slice(bullets[i].pos+1);
                } else if(context == "walker"){
                    board = board.slice(0,bullets[i].pos) + '*' + board.slice(bullets[i].pos+1);
                    bullets[i].range = 0;
                } else {
                    board = board.slice(0,bullets[i].pos-1) + '*_' + board.slice(bullets[i].pos+1);
                }
            } else if (bullets[i].dir === "right"){
                if(context == "edge"){
                    board = board.slice(0,bullets[i].pos-1) + '*' + board.slice(bullets[i].pos);
                } else if(context == "range"){
                    board = board.slice(0,bullets[i].pos-1) + '*' + board.slice(bullets[i].pos);
                } else if(context == "walker"){
                    board = board.slice(0,bullets[i].pos-1) + '_*' + board.slice(bullets[i].pos+1);
                    bullets[i].range = 0;
                } else {
                    board = board.slice(0,bullets[i].pos-1) + '_*' + board.slice(bullets[i].pos+1);
                }
            }
            bullets.splice(i,1);
        }
    }
};

document.addEventListener('keydown',(event)=>{
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    switch(event.keyCode){
        case 65:
            movedLeft = true;
            mobile = false;
            break;
        case 68:
            movedRight = true;
            mobile = false;
            break;
        case 74:
            shotLeft = true;
            mobile = false;
            break;
        case 76:
            shotRight = true;
            mobile = false;
            break;
    }
});

document.addEventListener('keyup',(event)=>{

    switch(event.keyCode){
        case 65:
            movedLeft = false;
            mobile = false;
            break;
        case 68:
            movedRight = false;
            mobile = false;
            break;
        case 74:
            shotLeft = false;
            mobile = false;
            break;
        case 76:
            shotRight = false;
            mobile = false;
            break;
    }
});

var renderGame = () => {
    if(gameRunning){
        document.querySelector('.render').textContent = board.slice(leftEdgePos);
    } else {
        document.querySelector('.render').textContent = endScreen;
    }
};

var updateScore = () => {
    document.querySelector('.current_score').textContent = "Score: " + score;
}

var updateHighScore = () => {
    if(highScore < score){
        highScore = score;
    }
    document.querySelector('.high_score').textContent = "High Score: " + highScore;
}


document.querySelector('.start_game').addEventListener('click',setupGame);

var mobileMoveLeft = (event) => {
    mobile = true;
    movedLeft = true;
}
var mobileMoveRight = () => {
    mobile = true;
    movedRight = true;
}
var mobileShootLeft = () => {
    mobile = true;
    shotLeft = true;
}
var mobileShootRight = () => {
    mobile = true;
    shotRight = true;
}

var relaxMobileStates = () => {
    movedLeft =  false;
    movedRight =  false;
    shotLeft = false;
    shotRight = false;
}

// Mobile Controls
document.querySelector('.move_left').addEventListener('touchstart',mobileMoveLeft);
document.querySelector('.move_left').addEventListener('click',mobileMoveLeft);
document.querySelector('.move_right').addEventListener('touchstart',mobileMoveRight);
document.querySelector('.move_right').addEventListener('click',mobileMoveRight);
document.querySelector('.shoot_left').addEventListener('touchstart',mobileShootLeft);
document.querySelector('.shoot_left').addEventListener('click',mobileShootLeft);
document.querySelector('.shoot_right').addEventListener('touchstart',mobileShootRight);
document.querySelector('.shoot_right').addEventListener('click',mobileShootRight);