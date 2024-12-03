// Hole das Canvas und den Kontext
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Spielvariablen
let ballRadius = 20;
let ballSpeed = 5;
let ballColor = "red";
let ballX = canvas.width / 2;
let ballY = -ballRadius;
let gameStarted = false;
let score = 0;
let highscore = 0;
let rotationAngle = 0;

// Quadrat- und Ballfarben
const squareColors = ["red", "green", "blue", "yellow"];
let squareSize = 200;
let squareCenter = { x: canvas.width / 2, y: canvas.height * 5 / 6 };

// Schneeflocken- und Partikel-Effekte
let snowflakes = [];
let ballParticles = [];

// Funktionen zum Erzeugen der Schneeflocken
function generateSnowflakes() {
    if (Math.random() < 0.1) {
        snowflakes.push({
            pos: [Math.random() * canvas.width, 0],
            velocity: [Math.random() * 2 - 1, Math.random() * 3 + 1],
            size: Math.random() * 3 + 3
        });
    }
}

function drawSnowflakes() {
    for (let snowflake of snowflakes) {
        ctx.beginPath();
        ctx.arc(snowflake.pos[0], snowflake.pos[1], snowflake.size, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        snowflake.pos[0] += snowflake.velocity[0];
        snowflake.pos[1] += snowflake.velocity[1];
        if (snowflake.pos[1] > canvas.height) {
            snowflakes.splice(snowflakes.indexOf(snowflake), 1);
        }
    }
}

// Partikel um den Ball erzeugen
function generateBallParticles() {
    for (let i = 0; i < 5; i++) {
        ballParticles.push({
            pos: [ballX, ballY],
            velocity: [Math.random() * 4 - 2, Math.random() * -3 - 1],
            color: squareColors[Math.floor(Math.random() * squareColors.length)],
            size: Math.random() * 3 + 3
        });
    }
}

function drawBallParticles() {
    for (let particle of ballParticles) {
        ctx.beginPath();
        ctx.arc(particle.pos[0], particle.pos[1], particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        particle.pos[0] += particle.velocity[0];
        particle.pos[1] += particle.velocity[1];
        particle.size = Math.max(1, particle.size - 0.1); // Partikel schrumpfen
        if (particle.size <= 0) {
            ballParticles.splice(ballParticles.indexOf(particle), 1);
        }
    }
}

// Spiel starten
function startGame() {
    gameStarted = true;
    score = 0;
    ballSpeed = 5;
    resetBall();
    requestAnimationFrame(gameLoop);
}

// Ball zurücksetzen
function resetBall() {
    ballX = canvas.width / 2;
    ballY = -ballRadius;
    ballColor = squareColors[Math.floor(Math.random() * squareColors.length)];
}

// Spiel-Schleife
function gameLoop() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Bildschirm löschen

    // Schneeflocken und Partikel
    generateSnowflakes();
    drawSnowflakes();
    generateBallParticles();
    drawBallParticles();

    // Ball fallen lassen
    ballY += ballSpeed;
    if (ballY + ballRadius > squareCenter.y - squareSize / 2) {
        checkCollision();
    }

    drawSquare();
    drawBall();

    // Score anzeigen
    ctx.fillStyle = "black";
    ctx.font = "36px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Highscore: ${highscore}`, 10, 70);

    // Weiterhin die Animation laufen lassen
    requestAnimationFrame(gameLoop);
}

// Quadrat zeichnen
function drawSquare() {
    const halfSize = squareSize / 2;
    const center = squareCenter;
    const radAngle = Math.radians(rotationAngle);

    // Quadrat rotieren
    const rotatedCorners = [];
    for (let i = 0; i < 4; i++) {
        const x = center.x + halfSize * Math.cos(radAngle + (i * Math.PI / 2));
        const y = center.y + halfSize * Math.sin(radAngle + (i * Math.PI / 2));
        rotatedCorners.push({ x, y });
    }

    ctx.beginPath();
    ctx.moveTo(rotatedCorners[0].x, rotatedCorners[0].y);
    for (let i = 1; i < rotatedCorners.length; i++) {
        ctx.lineTo(rotatedCorners[i].x, rotatedCorners[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = squareColors[Math.floor(rotationAngle / 90) % 4];
    ctx.fill();
}

// Ball zeichnen
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
}

// Kollision überprüfen
function checkCollision() {
    const topIndex = Math.floor(rotationAngle / 90) % 4;
    if (squareColors[topIndex] === ballColor) {
        score++;
        if (score > highscore) {
            highscore = score;
        }
        resetBall();
        generateBallParticles(); // Partikel nach Kollision erzeugen
    } else {
        gameOver();
    }
}

// Spiel beenden
function gameOver() {
    gameStarted = false;
    alert("Game Over! Drücke 'Start Game' um erneut zu spielen.");
}

// Grad in Radiant umwandeln
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Initiales Setup
document.querySelector("button").addEventListener("click", startGame);
