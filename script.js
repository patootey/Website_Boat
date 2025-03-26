function init() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("#background");
    const gameWonElement = document.querySelector("#game-won");
    const gameOverElement = document.querySelector("#game-over");

    //To draw things in the canvas
    let ctx = canvas.getContext("2d");
    let deltaTime = 0;
    let gameTime = 0;
    let gameCountdown = 15;
    let previousTime = 0;
    let score = 0;
    let requiredScore = 13;
    let gameOver = false;
    let gameWon = false;
    let keyUp = false;
    let keyDown = false;
    let keyLeft = false;
    let keyRight = false;


    //let backgroundImg = new Image();
    let backgroundMusic = new Audio("sound/AMBIENCE Huge Waves 1m Away From Impact Point 2.wav");
    let barrelNoise = new Audio("sound/Potion and Alchemy 04.wav");
    let isStarted = false;
    const BOAT1 = "boat1";
    const BOAT2 = "boat2";
    let player = {
        filename: "image/Boats.png",
        boatType: "",
        x: 285,
        y: 170,
        width: 30,
        height: 20,
        /** Walking speed in pixels/seconds */
        walkSpeed: 120,
        directionX: 1,
        speedX: 0,
        speedY: 0,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: 0,
        sourceHeight: 0,
    };

    let backgroundTile = {
        filename: "image/TILES JAPANESE VILLAGE.png",
        width: (415 - 256),
        height: (255 - 224),
    };

    let barrelSprite = {
        filename: "image/barrel.png",
        width: 16,
        height: 20,
    };

    //Sets the x and y coordinate for each barrel
    let barrel1 = {
        x: 20,
        y: 25,
        isActive: true,
    };
    let barrel2 = {
        x: 50,
        y: 70,
        isActive: true,
    };
    let barrel3 = {
        x: 300,
        y: 100,
        isActive: true,
    };
    let barrel4 = {
        x: 500,
        y: 80,
        isActive: true,
    };
    let barrel5 = {
        x: 38,
        y: 205,
        isActive: true,
    };
    let barrel6 = {
        x: 101,
        y: canvas.height - 30,
        isActive: true,
    };
    let barrel7 = {
        x: 370,
        y: 100,
        isActive: true,
    };
    let barrel8 = {
        x: 560,
        y: 80,
        isActive: true,
    };
    let barrel9 = {
        x: 600 - 35,
        y: 300,
        isActive: true,
    };
    let barrel10 = {
        x: 200,
        y: 260,
        isActive: true,
    };
    let barrel11 = {
        x: 30,
        y: 330,
        isActive: true,
    };
    let barrel12 = {
        x: 40,
        y: 300,
        isActive: true,
    };
    let barrel13 = {
        x: 50,
        y: 50,
        isActive: true,
    };

    // Background image
    let backgroundTileImg = new Image();
    backgroundTileImg.src = backgroundTile.filename;
    backgroundTileImg.onload = function () { };

    // Player image
    let boatImg = new Image();
    boatImg.src = player.filename;
    boatImg.onload = function () { };

    // Barrel image
    let barrelImg = new Image();
    barrelImg.src = barrelSprite.filename;
    barrelImg.onload = function () { };

    function chooseBoat() {
        //Style the "choose a boat" page
        canvas.removeEventListener("click", chooseBoat);
        ctx.fillStyle = "#112B3C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#EFEFEF";
        let boxWidth = (canvas.width / 2) - 60;
        let boxHeight = (canvas.height) - 200;
        let boxX = 30;
        let boxY = 100;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)
        ctx.drawImage(boatImg, 3, 12, 30, 20, ((boxWidth - 30 * 3) / 2) + boxX, boxY + 82, 30 * 3, 20 * 3);

        ctx.fillStyle = "#EFEFEF";
        ctx.font = "bold 40px Arial";
        let text = "Choose a boat";
        let measureText = ctx.measureText(text)
        ctx.fillText(text, (canvas.width - measureText.width) / 2, 50);

        ctx.strokeStyle = "#EFEFEF";
        boxWidth = (canvas.width / 2) - 60;
        boxHeight = (canvas.height) - 200;
        boxX = boxX + 300;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)
        ctx.drawImage(boatImg, 64, 0, 32, 32, ((boxWidth - 32 * 3) / 2) + boxX, boxY + 30, 32 * 3, 32 * 3);

        ctx.lineWidth = "4";
        ctx.strokeStyle = "#000";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        canvas.addEventListener("click", onBoatClicked);
    }

    /** @param {MouseEvent} event */
    function onBoatClicked(event) {

        //Choose the left boat
        if (event.offsetX < canvas.width / 2) {
            player.boatType = BOAT1;
            player.width = 30;
            player.height = 20;
            player.sourceX = 3;
            player.sourceY = 12;
            player.sourceWidth = 30;
            player.sourceHeight = 20;
            player.walkSpeed = 130;
            requiredScore = 13;
            gameCountdown = 11;
        } else {
            //Choose the right boat
            player.boatType = BOAT2;
            player.width = 32;
            player.height = 32;
            player.sourceX = 64;
            player.sourceY = 0;
            player.sourceWidth = 32;
            player.sourceHeight = 32;
            player.walkSpeed = 97;
            requiredScore = 9;
            gameCountdown = 12;
        }
        //Starts the game after the boat is choosen
        startGame();
        //Eventlister can only happen once
        canvas.removeEventListener("click", onBoatClicked);
    }

    function startGame() {
        if (isStarted) {
            return;
        }
        isStarted = true;
        previousTime = Date.now();
        requestAnimationFrame(gameLoop);
        backgroundMusic.play();
        //backgroundMusic.currentTime = 240;
        console.log("Music has started.");
    }

    function playMusic() {
        console.log("Music is ready to play.");
    }

    function onMusicEnd() {
        backgroundMusic.play();
        console.log("Music has ended, playing again.");
    }

    function onKeyDown(event) {
        //Turns the background music on/off.
        //Help: Dont need to find the exact case
        if (event.key == "w") {
            keyUp = true;
            //Works with all keyboard layouts.
        } else if (event.key == "s") {
            keyDown = true;
        } else if (event.key == "a") {
            keyLeft = true;
        } else if (event.key == "d") {
            keyRight = true;
        } else {
            return;
        }
        // Stop keyboard processing
        return false;
    }

    function onKeyUp(event) {
        //Turns the background music on/off.
        if (event.key == "w") {
            keyUp = false;
        } else if (event.key == "s") {
            keyDown = false;
        } else if (event.key == "a") {
            keyLeft = false;
        } else if (event.key == "d") {
            keyRight = false;
        } else {
            return;
        }
        // Stop keyboard processing
        return false;
    }

    function onKeyPressed(event) {
        //Music play/pause
        if (event.key == "m") {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
            } else {
                backgroundMusic.pause();
            }
        }
        // Stop keyboard processing
        return false;
    }

    function keyCheck() {
        //Check whitch directon player is + if playerImg is to be flipped.
        player.speedX = 0;
        player.speedY = 0;
        if (keyUp) {
            player.speedY = -player.walkSpeed * deltaTime;
        }
        if (keyDown) {
            player.speedY = player.walkSpeed * deltaTime;
        }
        if (keyLeft) {
            player.speedX = -player.walkSpeed * deltaTime;
            player.directionX = -1;
        }
        if (keyRight) {
            player.speedX = player.walkSpeed * deltaTime;
            player.directionX = 1;
        }

        //Collision with border
        if (player.speedX < 0) {
            player.x += player.speedX;
            if (player.x < 1) {
                player.x = 1;
            }
        } else {
            player.x += player.speedX;
            if (player.x > canvas.width - player.width) {
                player.x = canvas.width - player.width;
            }
        }

        if (player.speedY < 0) {
            player.y += player.speedY;
            if (player.y < 20) {
                player.y = 20;
            }
        } else {
            player.y += player.speedY;
            if (player.y > canvas.height - player.height) {
                player.y = canvas.height - player.height;
            }
        }

        checkBarrelCollision(barrel1);
        checkBarrelCollision(barrel2);
        checkBarrelCollision(barrel3);
        checkBarrelCollision(barrel4);
        checkBarrelCollision(barrel5);
        checkBarrelCollision(barrel6);
        checkBarrelCollision(barrel7);
        checkBarrelCollision(barrel8);
        checkBarrelCollision(barrel9);
        checkBarrelCollision(barrel10);
        checkBarrelCollision(barrel11);
        checkBarrelCollision(barrel12);
        checkBarrelCollision(barrel13);
    }

    function checkBarrelCollision(barrel) {
        //Barrel collison
        if (barrel.isActive) {
            if (isCollide(player, { x: barrel.x, y: barrel.y, width: barrelSprite.width, height: barrelSprite.height })) {
                barrel.isActive = false;
                score += 1;
                barrelNoise.volume = 0.2;
                barrelNoise.currentTime = 0;
                barrelNoise.play();
            }
        }
    }

    function drawScreen() {
        //Resets scaling
        ctx.resetTransform();
        drawBackground();
        drawAllBarrels();
        drawPlayer();

        ctx.strokeStyle = "#000";
        ctx.strokeRect(1, 20, canvas.width - 2, 0);
        ctx.fillStyle = "#EFEFEF";
        ctx.fillRect(1, 1, canvas.width - 2, 19)

        drawUi();
        drawTimer();


        //Border around canvas frame
        ctx.strokeStyle = "#000";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    function gameLoop() {
        //Calculate delta time
        //Help: How to set up a time system
        let time = Date.now();
        deltaTime = (time - previousTime) / 1000;
        gameTime += deltaTime;
        previousTime = time;

        //"Game Over" check
        if (!gameOver && !gameWon) {
            keyCheck();
            if (score >= requiredScore) {
                gameWon = true;
                //Shows hidden html tag
                gameWonElement.classList.remove("hidden");
                backgroundMusic.pause();
            }
            if (!gameWon) {
                gameCountdown = gameCountdown - deltaTime;
                if (gameCountdown <= 0) {
                    gameCountdown = 0;
                    gameOver = true;
                    //Shows hidden html tag
                    gameOverElement.classList.remove("hidden");
                    console.log("test");
                    backgroundMusic.pause();
                }
            }
        }

        drawScreen();
        if (gameOver) {
            let gameOverText = "Game Over";
            ctx.fillStyle = "#000";
            ctx.font = "bold 40px Arial";
            measureText = ctx.measureText(gameOverText)
            ctx.fillText(gameOverText, (canvas.width - measureText.width) / 2, ((canvas.height - measureText.actualBoundingBoxAscent - measureText.actualBoundingBoxDescent) / 2) + measureText.actualBoundingBoxAscent);

        }
        if (gameWon) {
            ctx.fillStyle = "#000";
            ctx.font = "bold 40px Arial";
            let gameWonText = "Game Won";
            let measureText = ctx.measureText(gameWonText)
            ctx.fillText(gameWonText, (canvas.width - measureText.width) / 2, ((canvas.height - measureText.actualBoundingBoxAscent - measureText.actualBoundingBoxDescent) / 2) + measureText.actualBoundingBoxAscent);

        }

        requestAnimationFrame(gameLoop);
    }

    function drawBackground() {
        //Draw background tiles
        for (let row = 0; row < 12; row++) {
            for (let column = 0; column < 4; column++) {
                ctx.drawImage(backgroundTileImg, 256, 224, backgroundTile.width, backgroundTile.height, column * backgroundTile.width, row * backgroundTile.height, backgroundTile.width, backgroundTile.height);
            }
        }
    }

    function drawPlayer() {
        // Draw the character at correct position and direction
        ctx.save();
        if (player.directionX >= 0) {
            ctx.translate(player.x, player.y);
        } else {
            ctx.translate(player.x + player.width, player.y);
        }

        ctx.scale(player.directionX, 1);
        ctx.drawImage(boatImg, player.sourceX, player.sourceY, player.sourceWidth, player.sourceHeight, 0, 0, player.width, player.height);
        ctx.restore();
    }

    function drawAllBarrels() {
        //If active then draw, if not dont draw
        if (barrel1.isActive) {
            drawBarrel(barrel1);
        }
        if (barrel2.isActive) {
            drawBarrel(barrel2);
        }
        if (barrel3.isActive) {
            drawBarrel(barrel3);
        }
        if (barrel4.isActive) {
            drawBarrel(barrel4);
        }
        if (barrel5.isActive) {
            drawBarrel(barrel5);
        }
        if (barrel6.isActive) {
            drawBarrel(barrel6);
        }
        if (barrel7.isActive) {
            drawBarrel(barrel7);
        }
        if (barrel8.isActive) {
            drawBarrel(barrel8);
        }
        if (barrel9.isActive) {
            drawBarrel(barrel9)
        }
        if (barrel10.isActive) {
            drawBarrel(barrel10)
        }
        if (barrel11.isActive) {
            drawBarrel(barrel11)
        }
        if (barrel12.isActive) {
            drawBarrel(barrel12)
        }
        if (barrel13.isActive) {
            drawBarrel(barrel13)
        }
    }

    function drawBarrel(barrel) {
        ctx.drawImage(barrelImg, barrel.x, barrel.y);
    }
        function drawTimer() {
            // Frames 
            //ctx.fillStyle = "#000";
            //ctx.font = "15px Arial";
            //ctx.fillText(deltaTime.toFixed(3), 450, 15);
        }
    
    function drawUi() {
        // Timer
        ctx.fillStyle = "#000";
        ctx.font = "15px Arial";
        ctx.fillText("Time: " + gameCountdown.toFixed(1), 10, 15);

        // Score
        ctx.fillStyle = "#000";
        ctx.font = "15px Arial";
        ctx.fillText("Score: " + score + "/" + requiredScore, canvas.width - 90, 15);
    }

    //Reusable collison function
    //Code from "https://stackoverflow.com/questions/2440377/javascript-collision-detection"
    function isCollide(a, b) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }

    backgroundMusic.addEventListener("canplay", playMusic);
    backgroundMusic.volume = 0.1;

    canvas.addEventListener("keydown", onKeyDown, false);
    canvas.addEventListener("keyup", onKeyUp, false);
    canvas.addEventListener("keypress", onKeyPressed, false);
    backgroundMusic.addEventListener("ended", onMusicEnd);
    canvas.addEventListener("click", chooseBoat);



    console.log("Init finish");
    //Draw start screen
    ctx.fillStyle = "#112B3C";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#EFEFEF";
    ctx.font = "bold 40px Arial";
    let startText = "Click to start";
    let measureText = ctx.measureText(startText)
    ctx.fillText(startText, (canvas.width - measureText.width) / 2, ((canvas.height - measureText.actualBoundingBoxAscent - measureText.actualBoundingBoxDescent) / 2) + measureText.actualBoundingBoxAscent);

    //Draw border
    ctx.lineWidth = "4";
    ctx.strokeStyle = "#000";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("load", init);
