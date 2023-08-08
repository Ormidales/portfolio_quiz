const questionElement = document.querySelector(".question");
const answerButtons = document.querySelectorAll(".answer");
const scoreElement = document.querySelector(".score");
const questionNumberElement = document.querySelector(".question-number");
const totalQuestionsElement = document.querySelector(".total-questions");
const resultMessageContainer = document.querySelector(".result-message");
const resultMessageElement = document.querySelector(".message");
const restartButton = document.querySelector(".restart-button");
const feedbackElement = document.querySelector(".feedback");
const progressBar = document.querySelector(".progress");
const progressPercentage = document.querySelector(".progress-percentage");
const maxLives = 3; // Nombre maximum de vies
let remainingLives = maxLives; // Vies restantes du joueur
const livesElement = document.querySelector(".lives");

const quizData = [
    {
        question: "En quête d'aventure et de gloire brillante, Dans quelle saga de jeux pouvez-vous plonger, Où Geralt de Riv, en terres de tourment, Chasse monstres féroces et secrets profonds ?",
        answers: ["The Witcher", "Elder Scrolls", "Dragon Age", "Dark Souls"],
        correct: 0,
    },
    {
        question: "Quel studio de développement est responsable de la série de jeux The Elder Scrolls et Fallout ?",
        answers: ["Ubisoft", "Blizzard Entertainment", "Bethesda Game Studios", "Square Enix"],
        correct: 2,
    },
    {
        question: "Quel célèbre jeu de construction et de survie a été créé par Markus Persson et plus tard développé par Mojang Studios ?",
        answers: ["Minecraft", "Terraria", "Roblox", "The Sims"],
        correct: 0,
    },
    {
        question: "Quel est le symbole chimique de l'oxygène ?",
        answers: ["O", "Ox", "O2", "Oz"],
        correct: 0,
    },
    {
        question: "Quel est le symbole chimique de l'oxygène ?",
        answers: ["O", "Ox", "O2", "Oz"],
        correct: 0,
    },
    // Ajoute d'autres questions et réponses
];

let currentQuestion = 0;
let score = 0;

function updateScore(newScore) {
    score = newScore;
    scoreElement.textContent = score;
}

function updateProgressBar() {
    const percentage = (currentQuestion / (quizData.length - 1)) * 100;
    progressBar.style.width = `${percentage}%`;

    // Modifie la couleur de la barre de progression en vert lorsque le quiz est terminé
    if (currentQuestion === quizData.length - 1) {
        progressBar.style.backgroundColor = "green";
    }
}

function updateLives() {
    livesElement.textContent = remainingLives;
}

function showQuestion(questionIndex) {
    const currentQuestionData = quizData[questionIndex];
    questionElement.textContent = currentQuestionData.question;
    currentQuestionData.answers.forEach((answer, index) => {
        answerButtons[index].textContent = answer;
    });
    questionNumberElement.textContent = questionIndex + 1;
    totalQuestionsElement.textContent = quizData.length;
    updateProgressBar();
}

function showResultMessage(message) {
    resultMessageElement.textContent = message;
    resultMessageContainer.style.display = "block";
}

function restartQuiz() {
    currentQuestion = 0;
    updateScore(0);
    progressBar.style.backgroundColor = "";
    resultMessageContainer.style.display = "none";
    remainingLives = maxLives; // Réinitialise les vies à leur valeur maximale
    updateLives(); // Met à jour l'affichage des vies
    showQuestions();
    showQuestion(currentQuestion);
    updateProgressBar();
}

function showFeedbackMessage(isCorrect) {
    feedbackElement.textContent = isCorrect ? "Bonne réponse !" : "Dommage, essaie encore.";
    feedbackElement.style.color = isCorrect ? "green" : "red";
    feedbackElement.style.display = "block";
    
    // Ajoute la classe pour l'animation de montée et le fondu
    feedbackElement.classList.add("show-feedback");
    
    setTimeout(() => {
        feedbackElement.classList.remove("show-feedback");
        feedbackElement.style.display = "none";
    }, 1500); // Affiche le message pendant 1,5 seconde puis le masque
}

function showQuestions(){
    answerButtons.forEach(button => {
        button.style.display = "block";
    });
}

function clearQuizContainer() {
    questionElement.textContent = "";
    answerButtons.forEach(button => {
        button.textContent = "";
        button.style.display = "none";
    });
}

function checkAnswer(selectedAnswer) {
    const currentQuestionData = quizData[currentQuestion];
    if (selectedAnswer === currentQuestionData.correct) {
        updateScore(score + 1);
        showFeedbackMessage(true);
    } else {
        showFeedbackMessage(false);
        remainingLives--; // Réduit le nombre de vies en cas de réponse incorrecte
        updateLives(); // Met à jour l'affichage des vies
        if (remainingLives === 0) {
            showResultMessage("Dommage ! Tu as perdu toutes tes vies. Essaie à nouveau !");
            clearQuizContainer();
        }
        return;
    }

    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
        updateProgressBar();
    } else {
        showResultMessage(`Bravo ! Tu as terminé le quiz avec un score de ${score}/${quizData.length}`);
        clearQuizContainer();
    }
}

restartButton.addEventListener("click", restartQuiz);

showQuestion(currentQuestion);

answerButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        checkAnswer(index);
    });
});