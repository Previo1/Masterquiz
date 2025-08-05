import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyD0KSh__yrwZYDOKU85ltV-zOBpF6gLvm0",
    authDomain: "quizapp-f1224.firebaseapp.com",
    databaseURL: "https://quizapp-f1224-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quizapp-f1224",
    storageBucket: "quizapp-f1224.appspot.com",
    messagingSenderId: "432922180972",
    appId: "1:432922180972:web:e816869f5efc03f32f4749"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentSubject = "";
let questions = [];
let currentIndex = 0;
let coins = 0;

// Show different sections
window.showSection = function (sectionId) {
    document.querySelectorAll("main section").forEach(sec => sec.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
};

// Load subjects from Firebase
async function loadSubjects() {
    const snapshot = await get(ref(db, "questions"));
    const subjectList = document.getElementById("subject-list");
    subjectList.innerHTML = "";

    if (snapshot.exists()) {
        const data = snapshot.val();
        for (let subject in data) {
            const btn = document.createElement("button");
            btn.textContent = subject;
            btn.onclick = () => startQuiz(subject);
            subjectList.appendChild(btn);
        }
    } else {
        subjectList.innerHTML = "<p>No subjects available</p>";
    }
}
loadSubjects();

// Start quiz
async function startQuiz(subject) {
    currentSubject = subject;
    const snapshot = await get(ref(db, `questions/${subject}`));

    if (snapshot.exists()) {
        questions = Object.values(snapshot.val());
        currentIndex = 0;
        showQuestion();
        showSection("quiz-section");
    } else {
        alert("No questions available for this subject!");
    }
}

// Show question
function showQuestion() {
    const q = questions[currentIndex];
    document.getElementById("quiz-question").textContent = q.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(opt, q.answer);
        optionsDiv.appendChild(btn);
    });
}

// Check answer
function checkAnswer(selected, correct) {
    if (selected === correct) {
        coins += 10;
        document.getElementById("coins").textContent = coins;
        document.getElementById("wallet-coins").textContent = coins;
        alert("✅ Correct!");
    } else {
        alert("❌ Wrong!");
    }
}

// Next button
document.getElementById("next-btn").onclick = () => {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        showQuestion();
    } else {
        alert("Quiz completed!");
        showSection("subject-section");
    }
};

// Back button
document.getElementById("back-btn").onclick = () => {
    showSection("subject-section");
};

// Referral system
window.generateReferral = function () {
    const referralLink = `${window.location.origin}?ref=${Math.floor(Math.random() * 100000)}`;
    document.getElementById("referral-link").textContent = referralLink;
};
