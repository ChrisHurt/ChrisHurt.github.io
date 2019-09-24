var p1start = false;
var isNought = false;
var isCross = true;
var scoreOne = 0;
var scoreTwo = 0;

var p1initials = "P1";
var p2initials = "P2";
var p1mark = "X";
var p2mark = "0";
var turnLength  = 6;

var flickerOn = false;
var soundOn = true;
var gameStarted = false;
var inGame = false;

const zap = new Audio('../audio/shortCircuit.mp3');
const tick = new Audio('../audio/tick.wav');

var A1 = document.querySelector('.A1');
var A2 = document.querySelector('.A2');
var A3 = document.querySelector('.A3');
var B1 = document.querySelector('.B1');
var B2 = document.querySelector('.B2');
var B3 = document.querySelector('.B3');
var C1 = document.querySelector('.C1');
var C2 = document.querySelector('.C2');
var C3 = document.querySelector('.C3');

var boardValues = [['','',''],
                   ['','',''],
                   ['','','']];


var declareWinner = (winner) => {
    spinIndex = 0;
    if(winner == p1mark){
        document.querySelector('.winner').textContent = p1initials + " Wins! (" + p1mark + "'s)";
        spin(true);
        setTimeout(()=>{
            document.querySelector('.gameoptions').classList.remove('hidden');
        },400);
        scoreOne++;
        document.querySelector('.score-one').textContent = scoreOne;
        enterScene(document.querySelector('.score-one'),'inner-glow');
        if(scoreOne == 1){
            document.querySelector('.score-one').textContent += " pt ";
        } else {
            document.querySelector('.score-one').textContent += " pts";
        }
        enterScene(document.querySelector('.score-one'),'inner-glow');
        enterScene(document.querySelector('.winner'),'inner-glow-orange');
    } else if(winner == p2mark){
        document.querySelector('.winner').textContent = p2initials + " Wins! (" + p2mark + "'s)";
        spin(true);
        setTimeout(()=>{
            document.querySelector('.gameoptions').classList.remove('hidden');
        },400);
        scoreTwo++;
        document.querySelector('.score-two').textContent = scoreTwo;
        enterScene(document.querySelector('.score-two'),'inner-glow');
        if(scoreTwo == 1){
            document.querySelector('.score-two').textContent += " pt ";
        } else {
            document.querySelector('.score-two').textContent += " pts";
        }
        enterScene(document.querySelector('.score-two'),'inner-glow');
        enterScene(document.querySelector('.winner'),'inner-glow-orange');
    }
    turnTime = turnLength;
    clearInterval(turnIntervalHandle);
    turnIntervalHandle = '';
    inGame = false;

    document.querySelector('.set-btn').textContent = "Settings ";
    var icon = document.createElement('I');
    icon.classList.add("fas");
    icon.classList.add("fa-cog");
    document.querySelector('.set-btn').appendChild(icon);

};
var checkForWinner = (declare) => {
    // rows
    if(boardValues[0][0] != '' && boardValues[0][0] == boardValues[0][1] && boardValues[0][1] == boardValues[0][2]){
        [A1,B1,C1].forEach((cell)=>{
            cell.classList.add('win-combo');
        });
        if(declare){
            declareWinner(boardValues[0][0]);
        }
        return true;
    } else if (boardValues[1][0] != '' && boardValues[1][0] == boardValues[1][1] && boardValues[1][1] == boardValues[1][2]){
        [A2,B2,C2].forEach((cell)=>{
            cell.classList.add('win-combo');
        });
        if(declare){
            declareWinner(boardValues[1][0]);
        }
        return true;
    } else if (boardValues[2][0] != '' && boardValues[2][0] == boardValues[2][1] && boardValues[2][1] == boardValues[2][2]){
        [A3,B3,C3].forEach((cell)=>{
            cell.classList.add('win-combo');
        });
        if(declare){
            declareWinner(boardValues[2][0]);
        }
        return true;
    // columns
    } else if(boardValues[0][0] != '' && boardValues[0][0] == boardValues[1][0] && boardValues[1][0] == boardValues[2][0]){
        [A1,A2,A3].forEach((cell)=>{
            cell.classList.add('win-combo');
        });
        if(declare){
            declareWinner(boardValues[0][0]);
        }
        return true;
    } else if(boardValues[0][1] != '' && boardValues[0][1] == boardValues[1][1] && boardValues[1][1] == boardValues[2][1]){
        [B1,B2,B3].forEach((cell)=>{
            cell.classList.add('win-combo');
        });
        if(declare){
            declareWinner(boardValues[0][1]);
        }
        return true;
    } else if(boardValues[0][2] != '' && boardValues[0][2] == boardValues[1][2] && boardValues[1][2] == boardValues[2][2]){
        [C1,C2,C3].forEach((cell)=>{
            cell.classList.add('win-combo');
        });
        if(declare){
            declareWinner(boardValues[0][2]);
        }
        return true;
    // diagonals
    } else if(boardValues[0][0] != '' && boardValues[0][0] == boardValues[1][1] && boardValues[1][1] == boardValues[2][2]){
        [A1,B2,C3].forEach((cell)=>{
            cell.classList.add('win-combo');
        });
        if(declare){
            declareWinner(boardValues[0][0]);
        }
        return true;
    } else if(boardValues[0][2] != '' && boardValues[0][2] == boardValues[1][1] && boardValues[1][1] == boardValues[2][0]){
        [C1,B2,A3].forEach((cell)=>{
            cell.classList.add('win-combo');
        });
        if(declare){
            declareWinner(boardValues[0][2]);
        }
        return true;
    } else {
        return false;
    }
    
};

var updateBoard = (noughtOrChar,cell) => {
    var randomNum = Math.random();
    if(randomNum >= 0.5){
        if(flickerOn){
            flicker();
        }
        if(randomNum >= 0.75){
            spin(false);
        }
    }
    // Set Value
    if(cell.classList.contains('nought')){
        if(cell.classList.contains('A1')){
            boardValues[0][0] = noughtOrChar;
        } else if(cell.classList.contains('A2')){
            boardValues[1][0] = noughtOrChar;
        } else if(cell.classList.contains('A3')){
            boardValues[2][0] = noughtOrChar;
        } else if(cell.classList.contains('B1')){
            boardValues[0][1] = noughtOrChar;
        } else if(cell.classList.contains('B2')){
            boardValues[1][1] = noughtOrChar;
        } else if(cell.classList.contains('B3')){
            boardValues[2][1] = noughtOrChar;
        } else if(cell.classList.contains('C1')){
            boardValues[0][2] = noughtOrChar;
        } else if(cell.classList.contains('C2')){
            boardValues[1][2] = noughtOrChar;
        } else if(cell.classList.contains('C3')){
            boardValues[2][2] = noughtOrChar;
        } else {
            console.log("Unhandled Exception in board update.");
        }
    } else if(cell.classList.contains('cross')){
        if(cell.classList.contains('A1')){
            boardValues[0][0] = noughtOrChar;
        } else if(cell.classList.contains('A2')){
            boardValues[1][0] = noughtOrChar;
        } else if(cell.classList.contains('A3')){
            boardValues[2][0] = noughtOrChar;
        } else if(cell.classList.contains('B1')){
            boardValues[0][1] = noughtOrChar;
        } else if(cell.classList.contains('B2')){
            boardValues[1][1] = noughtOrChar;
        } else if(cell.classList.contains('B3')){
            boardValues[2][1] = noughtOrChar;
        } else if(cell.classList.contains('C1')){
            boardValues[0][2] = noughtOrChar;
        } else if(cell.classList.contains('C2')){
            boardValues[1][2] = noughtOrChar;
        } else if(cell.classList.contains('C3')){
            boardValues[2][2] = noughtOrChar;
        } else {
            console.log("Unhandled Exception in board update.");
        }
    }
    checkForWinner(true);
};

var markBoard = (event) => {
    if(gameStarted && inGame){
        if(event.target.textContent == '' && !checkForWinner(false)){
            var noughtOrChar;
            if(isNought){
                noughtOrChar = p2mark;
                event.target.textContent = p2mark;
                event.target.classList.add('nought');
                document.querySelector('.p1').classList.add('active-player');
                document.querySelector('.p2').classList.remove('active-player');
            } else if (isCross){
                noughtOrChar = p1mark;
                event.target.textContent = p1mark;
                event.target.classList.add('cross');
                document.querySelector('.p2').classList.add('active-player');
                document.querySelector('.p1').classList.remove('active-player');
            } else {
                console.log("Unhandled Exception");
                return;
            }
            isNought = !isNought;
            isCross = !isCross;
            updateBoard(noughtOrChar,event.target);
            if(document.querySelectorAll('.cross').length + document.querySelectorAll('.nought').length != 9){
                turnTimer();
            }
        }
        if(checkForWinner(false)){
            turnTime = turnLength;
            clearInterval(turnIntervalHandle);
            turnIntervalHandle = '';
        }
        if(!checkForWinner(false) && (document.querySelectorAll('.cross').length + document.querySelectorAll('.nought').length == 9)){
            document.querySelector('.winner').textContent = "It's a draw!";
            
            inGame = false;
            document.querySelector('.set-btn').textContent = "Settings ";
            var icon = document.createElement('I');
            icon.classList.add("fas");
            icon.classList.add("fa-cog");
            document.querySelector('.set-btn').appendChild(icon);

            enterScene(document.querySelector('.winner'),'inner-glow-orange');
            spin(true);
            setTimeout(()=>{
                document.querySelector('.gameoptions').classList.remove('hidden');
            },400);
            turnTime = turnLength;
            clearInterval(turnIntervalHandle);
            turnIntervalHandle = '';
        }
    }
}

var spinIndex = 0;
var spinPosClasses = {
    0: ['',''],
    1: ['rightrotate','leftrotate'],
    2: ['half-revolution','half-revolution'],
    3: ['leftrotate','rightrotate']
}
var cornerClasses = {
    A1: ['top-left','top-right','bottom-right','bottom-left'],
    A3: ['bottom-left','top-left','top-right','bottom-right'],
    C1: ['top-right','bottom-right','bottom-left','top-left'],
    C3: ['bottom-right','bottom-left','top-left','top-right']
}

var spin = (reset) => {
    if(Math.random() >= 0.5){
        spinIndex++;
        if(spinIndex == 4){
            spinIndex = 0;
        }
    } else {
        spinIndex--;
        if(spinIndex == -1){
            spinIndex = 3;
        }
    }
    if(checkForWinner(false) || reset){
        spinIndex = 0;
    }
    // Border Reallocations
    A1.classList.remove('top-left');
    A1.classList.remove('top-right');
    A1.classList.remove('bottom-left');
    A1.classList.remove('bottom-right');
    A3.classList.remove('top-left');
    A3.classList.remove('top-right');
    A3.classList.remove('bottom-left');
    A3.classList.remove('bottom-right');
    C1.classList.remove('top-left');
    C1.classList.remove('top-right');
    C1.classList.remove('bottom-left');
    C1.classList.remove('bottom-right');
    C3.classList.remove('top-left');
    C3.classList.remove('top-right');
    C3.classList.remove('bottom-left');
    C3.classList.remove('bottom-right');    
    A1.classList.add(cornerClasses.A1[spinIndex]);
    A3.classList.add(cornerClasses.A3[spinIndex]);
    C1.classList.add(cornerClasses.C1[spinIndex]);
    C3.classList.add(cornerClasses.C3[spinIndex]);

    // Board & Cell Rotations
    document.querySelector('.board').classList.remove('rightrotate');
    document.querySelector('.board').classList.remove('leftrotate');
    document.querySelector('.board').classList.remove('half-revolution');
    document.querySelector('.all-settings').classList.remove('rightrotate');
    document.querySelector('.all-settings').classList.remove('leftrotate');
    document.querySelector('.all-settings').classList.remove('half-revolution');
    if(spinIndex){
        document.querySelector('.board').classList.add(spinPosClasses[spinIndex][0]);
        document.querySelector('.all-settings').classList.add(spinPosClasses[spinIndex][1]);
    }
    document.querySelectorAll('.cell').forEach((cell)=>{
        cell.classList.remove('rightrotate');
        cell.classList.remove('leftrotate');
        cell.classList.remove('half-revolution');
        if(spinIndex){
            cell.classList.add(spinPosClasses[spinIndex][1]);
        }
    });
};

var newGame = () => {
    inGame = true;
    document.querySelector('.set-btn').textContent = "In Game";

    if(!p1start){
        isCross = true;
        document.querySelector('.p1').classList.add('active-player');
        document.querySelector('.p2').classList.remove('active-player');
    } else {
        isCross = false;
        document.querySelector('.p2').classList.add('active-player');
        document.querySelector('.p1').classList.remove('active-player');
    }
    isNought = !isCross
    p1start = !p1start;

    boardValues = [['','',''],
                   ['','',''],
                   ['','','']];
    spinIndex = 0;
    document.querySelector('.board').classList.remove('rightrotate');
    document.querySelector('.board').classList.remove('leftrotate');
    document.querySelector('.board').classList.remove('half-revolution');
    document.querySelectorAll('.cell').forEach((cell)=>{
        cell.classList.remove('rightrotate');
        cell.classList.remove('leftrotate');
        cell.classList.remove('half-revolution');
        cell.classList.remove('nought');
        cell.classList.remove('cross');
        cell.classList.remove('win-combo');
        cell.textContent = '';
    });
    document.querySelector('.gameoptions').classList.add('hidden');
    document.querySelector('.winner').classList.remove('inner-glow-orange');
    document.querySelector('.winner').textContent = '';
};

var resetScore = () => {
    scoreOne = 0;
    scoreTwo = 0;
    document.querySelector('.score-one').textContent = scoreOne;
    if(scoreOne == 1){
        document.querySelector('.score-one').textContent += " pt";
    } else {
        document.querySelector('.score-one').textContent += " pts";
    }
    document.querySelector('.score-two').textContent = scoreTwo;
    if(scoreTwo == 1){
        document.querySelector('.score-two').textContent += " pt";
    } else {
        document.querySelector('.score-two').textContent += " pts";
    }
    newGame();
};

var cellArray = [A1,A2,A3,B1,B2,B3,C1,C2,C3];
var behaviourArray = ['','','','','','','','',''];
var timerHandle = [,,,,,,,,];
var behaviours = ['','on','off','flicker','flicker','flicker'];
var state = "off";

var setAllOnOff = () => {
    for(var i = 0; i < cellArray.length; i++){
        if(timerHandle[i]){
            clearTimeout(timerHandle[i]);
        }
        if(state == 'on'){
            cellArray[i].classList.add('inner-glow');
            cellArray[i].classList.remove('blank')
            document.querySelector('h2').textContent = "Lights On";
        } else if(state == 'off'){
            cellArray[i].classList.remove('inner-glow');
            cellArray[i].classList.add('blank')
            document.querySelector('h2').textContent = "Lights Off";
        }
    }
    if(state == 'on'){
        state="off";
    } else if(state == 'off'){
        state="on";
    }
};

var flicker = () => {
    var randomCellCount = Math.floor(Math.random() * 9) + 1;
    for(var i = 0; i < randomCellCount; i++){
        var randomCellIndex = Math.floor(Math.random() * 9);
        var randomBehaviour = Math.floor(Math.random() * 6);
        behaviourArray[randomCellIndex] = behaviours[randomBehaviour];
        // CLEAR Current behaviours
        if(timerHandle[randomCellIndex]){
            clearTimeout(timerHandle[randomCellIndex]);
        }
        // Assign New behaviours
        if(behaviourArray[randomCellIndex] == 'flicker'){
            randomFlicker(cellArray[randomCellIndex],randomCellIndex);
        } else if(behaviourArray[randomCellIndex] == 'on'){
            cellArray[randomCellIndex].classList.add('inner-glow');
            cellArray[randomCellIndex].classList.remove('blank');
        } else if(behaviourArray[randomCellIndex] == 'off'){
            cellArray[randomCellIndex].classList.remove('inner-glow');
            cellArray[randomCellIndex].classList.add('blank');
        } 
    }
};

var turnTime = turnLength;
var turnIntervalHandle = '';
var firstTime = true;

var turnTimer = () => {
    if(checkForWinner(false) && (document.querySelectorAll('.cross').length + document.querySelectorAll('.nought').length == 9)){
        turnTime = turnLength;
        clearInterval(turnIntervalHandle);
        turnIntervalHandle = '';
    } else if(turnIntervalHandle == ''){
        turnIntervalHandle = setInterval(()=>{
            turnTime -= 1;
            if(turnTime > 0){
                playTick();
            } else if(turnTime == 0){
                playTick();
            }
            document.querySelector('.winner').textContent = "Time: " + turnTime;
            document.querySelector('.winner').classList.add('inner-glow-orange');
            if(turnTime <= 0){
                turnTime = turnLength;
                clearInterval(turnIntervalHandle);
                turnIntervalHandle = '';
                
                isNought = !isNought;
                isCross = !isCross;
                if(isNought){
                    document.querySelector('.p2').classList.add('active-player');
                    document.querySelector('.p1').classList.remove('active-player');
                } else {
                    document.querySelector('.p1').classList.add('active-player');
                    document.querySelector('.p2').classList.remove('active-player');
                }

                turnTimer();
            }
        },1000)
    } else {
        turnTime = turnLength;
        clearInterval(turnIntervalHandle);
        turnIntervalHandle = '';
        turnTimer();
    }
};

var randomFlicker = (cell,index) => {
    if(cell.classList.contains('inner-glow')){
        cell.classList.remove('inner-glow');
        cell.classList.add('blank')
    } else {
        cell.classList.add('inner-glow');
        cell.classList.remove('blank')
    }
    timerHandle[index] = setTimeout(randomFlicker.bind(null,cell,index),Math.random()*850 + 150);
};

var enterScene = function(element,className){
    if(!element.classList.contains(className)){
        element.classList.add(className);
    }
    element.classList.remove('inner-glow');
    element.classList.remove('inner-glow-orange');
    element.classList.add(className);
};

var startGame = () => {
    gameStarted = true;
    inGame = true;
    document.querySelector('.set-btn').textContent = "In Game";
    document.querySelector('.start-game').classList.add('hidden');
    document.querySelector('.p1').classList.add('active-player');
};

document.querySelectorAll('.cell').forEach((cell)=>{
    cell.addEventListener('click',markBoard);
});
document.querySelector('.next').addEventListener('click',newGame);
document.querySelector('.start-game').addEventListener('click',startGame);
document.querySelector('.reset').addEventListener('click',resetScore);

setTimeout(()=>{
    enterScene(document.querySelector('h1'),'inner-glow');
    enterScene(document.querySelector('h2'),'inner-glow');
    enterScene(document.querySelector('.p1'),'inner-glow');
    enterScene(document.querySelector('.p2'),'inner-glow');
    enterScene(document.querySelector('.score-one'),'inner-glow');
    enterScene(document.querySelector('.score-two'),'inner-glow');
    enterScene(document.querySelector('.credit'),'inner-glow');
    enterScene(document.querySelector('.set-btn'),'inner-glow-orange');
},600);

var ambienceZap = () => {
    if(soundOn){
        //zap.play();
    }
    setTimeout(ambienceZap,(Math.random()*7000 + 2000));
};

var playTick = () => {
    if(soundOn){
        tick.play();
    }
}

zap.addEventListener('loadeddata',ambienceZap);

var settingsPanel = () => {
    if(!inGame){
        var panel = document.querySelector('.all-settings');
        if(panel.classList.contains('visible')){
            document.querySelector('.set-btn').textContent = "Settings ";
            var icon = document.createElement('I');
            icon.classList.add("fas");
            icon.classList.add("fa-cog");
            document.querySelector('.set-btn').appendChild(icon);
            panel.classList.remove('visible');
            if(document.querySelector('.p1initials').value){
                if(document.querySelector('.p1initials').value.toString().length == 1){
                    document.querySelector('.p1initials').value += " ";
                }
                p1initials = document.querySelector('.p1initials').value[0] + document.querySelector('.p1initials').value[1];
                document.querySelector('.p1initials').value = p1initials;
            }
            if(document.querySelector('.p2initials').value && p1initials != document.querySelector('.p2initials').value){
                if(document.querySelector('.p2initials').value.toString().length == 1){
                    document.querySelector('.p2initials').value += " ";
                }
                p2initials = document.querySelector('.p2initials').value[0] + document.querySelector('.p2initials').value[1];
                document.querySelector('.p2initials').value = p2initials;
            }
            if(p2initials ===  p1initials){
                if(p2initials == "P1"){
                    p2initials = "P2";
                    document.querySelector('.p2initials').value = p2initials;
                } else {
                    p2initials = "P1";
                    document.querySelector('.p2initials').value = p2initials;
                }
            }
            if(document.querySelector('.p1mark').value){
                p1mark = document.querySelector('.p1mark').value[0];
                document.querySelector('.p1mark').value = p1mark;
            }
            if(document.querySelector('.p2mark').value && p1mark != document.querySelector('.p2mark').value){
                p2mark = document.querySelector('.p2mark').value[0];
                document.querySelector('.p2mark').value = p2mark;
            }
            if(p2mark === p1mark){
                if(p2mark = "0"){
                    p2mark = "X";
                    document.querySelector('.p2mark').value = p2mark;
                } else {
                    p2mark = "0";
                    document.querySelector('.p2mark').value = p2mark;
                }
            }
            if(Number(document.querySelector('.turn-time').value && Number(document.querySelector('.turn-time').value >= 1))){

                turnLength = Math.floor(Number(document.querySelector('.turn-time').value) + 1);
                turnTime = turnLength;
                document.querySelector('.turn-time').value = (Math.floor(Number(document.querySelector('.turn-time').value))).toString();
            } else {
                turnLength = 6;
                turnTime = turnLength;
                document.querySelector('.turn-time').value = '5';
            }
            document.querySelector('.p1').textContent = p1initials + " " + p1mark;
            document.querySelector('.p2').textContent = p2initials + " " + p2mark;

        } else {
            panel.classList.add('visible');
            document.querySelector('.set-btn').textContent = "Start";
            document.querySelector('.p1mark').value = p1mark;
            document.querySelector('.p2mark').value = p2mark;
            document.querySelector('.p1initials').value = p1initials;
            document.querySelector('.p2initials').value = p2initials;
            document.querySelector('.turn-time').value = turnLength - 1;
        }
    }
};

var turnSoundOff = () => {
    soundOn = false;
    document.querySelector('.snd-on').classList.remove('inner-glow');
    document.querySelector('.snd-off').classList.add('inner-glow');
}
var turnSoundOn = () => {
    soundOn = true;
    document.querySelector('.snd-on').classList.add('inner-glow');
    document.querySelector('.snd-off').classList.remove('inner-glow');
}
var turnFlickerOff = () => {
    flickerOn = false;
    document.querySelector('.fl-on').classList.remove('inner-glow');
    document.querySelector('.fl-off').classList.add('inner-glow');
    state = "on";
    setAllOnOff();
}
var turnFlickerOn = () => {
    flickerOn = true;
    document.querySelector('.fl-on').classList.add('inner-glow');
    document.querySelector('.fl-off').classList.remove('inner-glow');
}

document.querySelector('.snd-on').addEventListener('click',turnSoundOn);
document.querySelector('.snd-off').addEventListener('click',turnSoundOff);
document.querySelector('.fl-on').addEventListener('click',turnFlickerOn);
document.querySelector('.fl-off').addEventListener('click',turnFlickerOff);

document.querySelector('h2').addEventListener('click',setAllOnOff);
document.querySelector('.set-btn').addEventListener('click',settingsPanel); 