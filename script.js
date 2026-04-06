const levels = [
    { clue: "I speak without a mouth and hear without ears.", answer: "echo", hint: "You hear it in mountains" },
    { clue: "I have keys but no locks. I have space but no room.", answer: "keyboard", hint: "Used for typing" },
    { clue: "What runs but never walks?", answer: "river", hint: "Nature" },
    { clue: "The more you take, the more you leave behind.", answer: "footsteps", hint: "Walking" },
    { clue: "I’m tall when I’m young, and short when I’m old.", answer: "candle", hint: "Melts" },

    { clue: "What has to be broken before you can use it?", answer: "egg", hint: "Breakfast" },
    { clue: "I have branches, but no fruit, trunk, or leaves.", answer: "bank", hint: "Money" },
    { clue: "What can travel around the world while staying in the same corner?", answer: "stamp", hint: "Post" },
    { clue: "What has one eye but cannot see?", answer: "needle", hint: "Sewing" },

    { clue: "Forward I am heavy, backward I am not.", answer: "ton", hint: "Reverse it" },
    { clue: "What disappears as soon as you say its name?", answer: "silence", hint: "Sound related" },
    { clue: "I shave every day, but my beard stays the same.", answer: "barber", hint: "Profession" },
    {clue: "I have cities but no houses, rivers but no water, and roads but no cars. What am I?", answer: "map", hint: "You use it for navigation"},

    { clue: "Boat full of people, yet there is not a single person. Why?", answer: "married", hint: "No one is single 😉" },
    { clue: "What gets wetter the more it dries?", answer: "towel", hint: "Bathroom" },
    { clue: "Drop me and I crack, smile at me and I smile back.", answer: "mirror", hint: "Reflection" },

    { clue: "Decode: 3-15-4-5 (1=A)", answer: "code", hint: "Alphabet positions" },
    {
    clue: "What comes next: J, F, M, A, M, J, J, ?",
    answer: "A",
    hint: "Think calendar"
    },
    {clue: "A man looks at a picture and says: 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the picture?",
    answer: "his son",
    hint: "Break the sentence slowly"
    },
    { clue: "Not alive but grows, needs air but no lungs.", answer: "fire", hint: "Danger" }
];

let currentLevel = 0;
let score = 0;
let lives = 3;
let timeLeft = 30;
let timer = null;
let hintUsed = false;

function startGame() {
    toggleScreen("home", false);
    toggleScreen("game", true);

    currentLevel = 0;
    score = 0;
    lives = 3;

    loadLevel();
}

function loadLevel() {
    clearInterval(timer);

    if (currentLevel >= levels.length) {
        return winGame();
    }

    const level = levels[currentLevel];
    hintUsed = false;

    setText("level", `Level ${currentLevel + 1} / ${levels.length}`);
    setText("clue", level.clue);
    setText("result", "");
    setValue("answer", "");

    updateUI();
    startTimer();

    document.getElementById("answer")?.focus();
}

function startTimer() {
    timeLeft = 30;

    timer = setInterval(() => {
        timeLeft--;
        updateTimerUI();

        if (timeLeft <= 0) {
            clearInterval(timer);
            loseLife("⏱ Time's up!");
        }
    }, 1000);
}

function updateTimerUI() {
    const timerEl = document.getElementById("timer");
    if (!timerEl) return;

    timerEl.innerText = `Time: ${timeLeft}s`;

    if (timeLeft <= 10) {
        timerEl.style.color = "red";
        timerEl.style.transform = "scale(1.2)";
    } else {
        timerEl.style.color = "white";
        timerEl.style.transform = "scale(1)";
    }
}

function checkAnswer() {
    let userAns = getValue("answer")
        .toLowerCase()
        .replace(/\s/g, "");

    let correctAns = levels[currentLevel].answer
        .toLowerCase()
        .replace(/\s/g, "");

    if (userAns.includes(correctAns)) {
        handleCorrect();
    } else {
        handleWrong();
    }
}

function handleCorrect() {
    clearInterval(timer);

    score += 10;

    setText("result", "✅ Correct!");
    flashResult("lightgreen");

    setTimeout(() => {
        transition(() => {
            currentLevel++;
            loadLevel();
        });
    }, 500);
}

function handleWrong() {
    loseLife("❌ Wrong!");
    flashResult("red");
}

function loseLife(msg) {
    lives--;
    setText("result", msg);

    if (lives <= 0) {
        gameOver();
    } else {
        updateUI();
    }
}

function useHint() {
    let hint = levels[currentLevel].hint;
    setText("result", "💡 Hint: " + hint);
    if (!hintUsed) {
        score -= 5;
        hintUsed = true;
    }
    updateUI();
}

function updateUI() {
    setText("score", `Score: ${score}`);
    setText("lives", `Lives: ${"❤️".repeat(lives)}`);
}

function gameOver() {
    clearInterval(timer);

    setHTML("game", `
        <h2>💀 Game Over</h2>
        <p>Score: ${score}</p>
        <button onclick="restartGame()">Restart</button>
    `);
}

function winGame() {
    clearInterval(timer);

    setHTML("game", `
        <h2>🏆 You Won!</h2>
        <p>Final Score: ${score}</p>
        <button onclick="restartGame()">Play Again</button>
    `);
}

function restartGame() {
    location.reload();
}

function transition(callback) {
    const game = document.getElementById("game");
    if (!game) return callback();

    game.style.opacity = "0";

    setTimeout(() => {
        callback();
        game.style.opacity = "1";
    }, 300);
}

function flashResult(color) {
    const el = document.getElementById("result");
    if (!el) return;

    el.style.color = color;
    el.style.transform = "scale(1.2)";

    setTimeout(() => {
        el.style.transform = "scale(1)";
    }, 200);
}

function toggleScreen(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? "block" : "none";
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
}

function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        checkAnswer();
    }
});