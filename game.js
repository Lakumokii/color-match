// Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Spielvariablen
let square_size = 200;
let ball_radius = 20;
let ball_speed = 5;
let score = 0;
let highscore = 0;
let game_over = false;
let rotation_angle = 0;

// Farben
const COLORS = ["red", "green", "blue", "yellow"];  // Rot, Grün, Blau, Gelb
let ball_color = COLORS[Math.floor(Math.random() * COLORS.length)];
let ball_x = canvas.width / 2;
let ball_y = -ball_radius;

// Quadrateinstellungen
const square_center = [canvas.width / 2, canvas.height * 5 / 6];

// Partikel-Array
let particles = [];

// Schneeflocken-Effekt
let snowflakes = [];

function generate_snowflakes() {
    if (Math.random() < 0.1) {
        snowflakes.push({
            pos: [Math.random() * canvas.width, 0],
            velocity: [Math.random() * 4 - 2, Math.random() * 3 + 1],
            size: Math.random() * 3 + 3,
        });
    }
}

function draw_snowflakes() {
    for (const snowflake of snowflakes) {
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

// Partikel um den Ball
function generate_ball_particles() {
    for (let i = 0; i < 5; i++) {
        particles.push({
            pos: [ball_x, ball_y],
            velocity: [Math.random() * 4 - 2, Math.random() * -3 - 1],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: Math.random() * 3 + 3,
        });
    }
}

function draw_ball_particles() {
    for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.pos[0], particle.pos[1], particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        particle.pos[0] += particle.velocity[0];
        particle.pos[1] += particle.velocity[1];
        particle.size = Math.max(1, particle.size - 0.1);
        if (particle.size <= 0) {
            particles.splice(particles.indexOf(particle), 1);
        }
    }
}

// Quadratisches Rotieren
function draw_square() {
    const center = square_center;
    const half_size = square_size / 2;

    // Rotiere das Quadrat
    const rad_angle = Math.radians(rotation_angle);
    const corners = [
        [center[0] - half_size, center[1] - half_size],
        [center[0] + half_size, center[1] - half_size],
        [center[0] + half_size, center[1] + half_size],
        [center[0] - half_size, center[1] + half_size],
    ];

    const rotated_corners = corners.map(([x, y]) => {
        const rel_x = x - center[0];
        const rel_y = y - center[1];
        const rotated_x = rel_x * Math.cos(rad_angle) - rel_y * Math.sin(rad_angle);
        const rotated_y = rel_x * Math.sin(rad_angle) + rel_y * Math.cos(rad_angle);
        return [center[0] + rotated_x, center[1] + rotated_y];
    });

    // Zeichne das Quadrat mit seinen Farben
    for (let i = 0; i < 4; i++) {
        const next_i = (i + 1) % 4;
        ctx.beginPath();
        ctx.moveTo(center[0], center[1]);
        ctx.lineTo(rotated_corners[i][0], rotated_corners[i][1]);
        ctx.lineTo(rotated_corners[next_i][0], rotated_corners[next_i][1]);
        ctx.closePath();
        ctx.fillStyle = COLORS[i];
        ctx.fill();
    }
}

function draw_ball() {
    generate_ball_particles();
    draw_ball_particles();
    ctx.beginPath();
    ctx.arc(ball_x, ball_y, ball_radius, 0, Math.PI * 2);
    ctx.fillStyle = ball_color;
    ctx.fill();
}

// Spiellogik
function check_collision() {
    const top_index = Math.floor(-rotation_angle / 90) % 4;

    if (COLORS[top_index] === ball_color) {
        score++;
        if (score > highscore) highscore = score;
        if (score % 5 === 0) ball_speed += 1;

        ball_x = canvas.width / 2;
        ball_y = -ball_radius;
    } else {
        game_over = true;
    }
}

// Hauptschleife
function game_loop() {
    if (!game_over) {
        ball_y += ball_speed;
        if (ball_y + ball_radius > square_center[1] - square_size / 2) {
            check_collision();
        }
        draw_background();
        generate_snowflakes();
        draw_snowflakes();
        draw_square();
        draw_ball();

        // Score anzeigen
        ctx.font = "36px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`Score: ${score}`, 10, 50);
        ctx.fillText(`Highscore: ${highscore}`, 10, 100);

        if (game_over) {
            ctx.fillText("Game Over! Press ESC to Retry", canvas.width / 2 - 150, canvas.height / 2);
        }
    }

    requestAnimationFrame(game_loop);
}

// Hintergrund zeichnen
function draw_background() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Hauptmenü
function main_menu() {
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.fillText("Color Match Game", canvas.width / 2 - 150, canvas.height / 2 - 100);
    ctx.font = "36px Arial";
    ctx.fillText("Start Game", canvas.width / 2 - 75, canvas.height / 2);
    ctx.fillText("Quit", canvas.width / 2 - 40, canvas.height / 2 + 50);

    canvas.addEventListener("click", (event) => {
        if (event.offsetX > canvas.width / 2 - 75 && event.offsetX < canvas.width / 2 + 75 && event.offsetY > canvas.height / 2 - 30 && event.offsetY < canvas.height / 2 + 30) {
            game_loop();
        }
        if (event.offsetX > canvas.width / 2 - 40 && event.offsetX < canvas.width / 2 + 40 && event.offsetY > canvas.height / 2 + 20 && event.offsetY < canvas.height / 2 + 70) {
            // Quit game
            window.close();
        }
    });
}

main_menu();

// Utility-Funktion für radian
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};
