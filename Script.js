import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

let coins = parseInt(localStorage.getItem("coins")) || 0;
document.getElementById("coins").innerText = coins;

// Page navigation
window.showPage = function(page) {
    document.getElementById("content").innerHTML = `<h2>Loading ${page}...</h2>`;
    if (page === "subjects") loadSubjects();
    if (page === "wallet") showWallet();
};

// Load subjects from Firebase
async function loadSubjects() {
    const subjectRef = ref(db, "subjects");
    const snapshot = await get(subjectRef);
    if (snapshot.exists()) {
        const subjects = snapshot.val();
        let html = "<h2>Select Subject</h2>";
        for (let key in subjects) {
            html += `<button onclick="startQuiz('${key}')">${subjects[key].name}</button>`;
        }
        document.getElementById("content").innerHTML = html;
    } else {
        document.getElementById("content").innerHTML = "<p>No subjects found</p>";
    }
}

// Referral system
window.showReferral = async function() {
    const referral = prompt("Enter referral code:");
    if (!referral) return;
    const refCheck = ref(db, "referrals/" + referral);
    const snapshot = await get(refCheck);
    if (snapshot.exists()) {
        alert("⚠ Already used!");
    } else {
        coins += 100;
        localStorage.setItem("coins", coins);
        document.getElementById("coins").innerText = coins;
        await set(refCheck, { usedBy: Date.now(), timestamp: Date.now() });
        alert("🎁 100 coins added!");
    }
};

// Wallet
function showWallet() {
    document.getElementById("content").innerHTML = `<h2>Wallet</h2><p>Available Coins: ${coins}</p>`;
}
