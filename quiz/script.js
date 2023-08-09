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
const timerElement = document.querySelector(".timer");
let timeLeft = 30; // Temps initial en secondes
let timerInterval; // Variable pour stocker l'instance de l'intervalle de la minuterie

const quizData = [
    {
        question: "Quel studio de développement est derrière la célèbre série de jeux \"The Elder Scrolls\" ?",
        answers: ["BioWare", "CD Projekt Red", "Bethesda Game Studios", "Blizzard Entertainment"],
        correct: 2,
    },
    {
        question: "Quel langage de programmation est largement utilisé pour créer des jeux vidéo ?",
        answers: ["HTML", "Java", "C++", "Python"],
        correct: 2,
    },
    {
        question: "Quelle année a marqué le lancement du légendaire jeu \"Super Mario Bros.\" sur la console NES de Nintendo ?",
        answers: ["1983", "1985 ", "1990", "1992"],
        correct: 1,
    },
    {
        question: "Quel célèbre jeu de survie pixelisé a été développé par le studio Mojang ?",
        answers: ["Fortnite", "PUBG", "Rust", "Minecraft"],
        correct: 3,
    },
    {
        question: "Quelle entreprise est à l'origine de la réalisation du casque de réalité virtuelle \"Oculus Rift\" ?",
        answers: ["Sony", "Microsoft", "Valve", "Oculus VR"],
        correct: 3,
    },
    // Ajoute d'autres questions et réponses
];

let currentQuestion = 0;
let score = 0; // Score du joueur
const baseScore = 10; // Score de base pour chaque question

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

function startTimer() {
    clearInterval(timerInterval);
    timerElement.textContent = timeLeft;
    timerElement.style.display = "flex"; // Affiche le timer au début de chaque question
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft >= 20) {
            timerElement.style.backgroundColor = "#55ff3e"; // Fond vert entre 10 et 7 secondes
        } else if (timeLeft >= 10) {
            timerElement.style.backgroundColor = "#ffd63e"; // Fond jaune entre 6 et 4 secondes
        } else {
            timerElement.style.backgroundColor = "#ff3e3e"; // Fond rouge entre 3 et 0 secondes
        }

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            timerElement.style.backgroundColor = "";
            if (remainingLives > 1) {
                remainingLives--;
                updateLives();
                currentQuestion++;
                if (currentQuestion < quizData.length) {
                    showQuestion(currentQuestion);
                    updateProgressBar();
                }
            } else {
                showResultMessage("Dommage ! Tu as perdu toutes tes vies. Essaie à nouveau !");
                clearQuizContainer();
            }
        }

        if (currentQuestion === quizData.length) {
            clearInterval(timerInterval);
            timerElement.style.backgroundColor = "";
            timerElement.style.display = "none"; // Masque le timer lorsque le quiz est terminé
        }
    }, 1000);
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
    timeLeft = 30; // Réinitialise le temps pour chaque nouvelle question
    timerElement.style.backgroundColor = "#55ff3e";
    startTimer(); // Lance la minuterie pour la nouvelle question
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
        const timeMultiplier = timeLeft / 10; // Calcul du multiplicateur de temps
        const questionScore = Math.round(baseScore * timeMultiplier);
        updateScore(score + questionScore); // Mise à jour du score avec le bonus de temps
        showFeedbackMessage(true);
    } else {
        showFeedbackMessage(false);
        remainingLives--; // Réduit le nombre de vies en cas de réponse incorrecte
        updateLives(); // Met à jour l'affichage des vies
        if (remainingLives === 0) {
            showResultMessage("Dommage ! Tu as perdu toutes tes vies. Essaie à nouveau !");
            clearQuizContainer();
            clearInterval(timerInterval);
            timerElement.style.backgroundColor = "";
            timerElement.style.display = "none"; // Masque le timer lorsque le quiz est terminé
        }
        return;
    }

    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
        updateProgressBar();
    } else {
        updateScore(score * remainingLives);
        showResultMessage(`Bravo ! Tu as terminé le quiz avec un score de ${score}`);
        clearQuizContainer();
        clearInterval(timerInterval);
        timerElement.style.backgroundColor = "";
        timerElement.style.display = "none"; // Masque le timer lorsque le quiz est terminé
    }
}

restartButton.addEventListener("click", restartQuiz);

showQuestion(currentQuestion);

answerButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        checkAnswer(index);
    });
});