const TARGET_REPS_DEFAULT = 10;
const WEIGHT_INCREMENT_PCT = 0.05;
const DELOAD_PCT = 0.10;
const BODYWEIGHT_REP_INCREMENT = 2;

const bodyweightExercises = [
    "Push Ups (Bodyweight)", "Push Ups",
    "Pull Ups (Bodyweight)", "Pull Ups",
    "Dips (Bodyweight)", "Dips",
    "Plank (Core Bodyweight)", "Plank",
    "Crunches (Bodyweight)", "Crunches",
    "Leg Raises (Bodyweight)", "Leg Raises",
    "Burpees (Bodyweight)", "Burpees",
    "Mountain Climbers"
];

const plateColorMap = {
    25: { color: "#dc2626", height: "70px", width: "16px", label: "25" },
    20: { color: "#2563eb", height: "65px", width: "16px", label: "20" },
    15: { color: "#eab308", height: "58px", width: "14px", label: "15" },
    10: { color: "#16a34a", height: "50px", width: "13px", label: "10" },
    5:  { color: "#ffffff", height: "40px", width: "11px", label: "5", text: "#000" },
    2.5: { color: "#1e293b", height: "32px", width: "9px", label: "2.5" },
    1.25: { color: "#64748b", height: "26px", width: "8px", label: "1.25" }
};

function getCurrentEmail() {
    return sessionStorage.getItem("loggedInUser") || "guest";
}

function getCurrentUser() {
    const email = getCurrentEmail();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(u => u.email === email) || null;
}

function updateCurrentUser(updatedUser) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.email === updatedUser.email);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));
    }
}

function getActivePhysique() {
    const email = getCurrentEmail();
    const user = getCurrentUser();
    return localStorage.getItem(`overloadfit_selected_physique_${email}`) 
        || (user ? user.physique : null) 
        || "Lean";
}

function getWorkoutsForUser(physique) {
    const user = getCurrentUser();
    if (!user || !user.workoutHistory) return [];
    return user.workoutHistory.filter(w => w.physique === physique);
}

function saveWorkoutsForUser(workouts, physique) {
    const user = getCurrentUser();
    if (!user) return;

    const otherWorkouts = (user.workoutHistory || []).filter(w => w.physique && w.physique !== physique);
    const taggedWorkouts = workouts.map(w => ({ ...w, physique }));

    user.workoutHistory = [...otherWorkouts, ...taggedWorkouts];
    updateCurrentUser(user);
}

function getExerciseStateKey(email, physique, exercise) {
    return `overloadfit_state_${email}_${physique}_${exercise.replace(/\s+/g, '_')}`;
}

function getExerciseState(exercise) {
    const email = getCurrentEmail();
    const physique = getActivePhysique();
    const key = getExerciseStateKey(email, physique, exercise);
    
    const savedState = localStorage.getItem(key);
    if (savedState) {
        return JSON.parse(savedState);
    }

    return {
        targetSets: 3,
        targetReps: TARGET_REPS_DEFAULT,
        targetWeight: 0,
        failCount: 0,
        lastStatus: "INITIAL"
    };
}

function saveExerciseState(exercise, state) {
    const email = getCurrentEmail();
    const physique = getActivePhysique();
    const key = getExerciseStateKey(email, physique, exercise);
    localStorage.setItem(key, JSON.stringify(state));
}

function handleExerciseChange(exerciseName, category = "General") {
    if (!exerciseName) return;

    const state = getExerciseState(exerciseName);
    const weightInput = document.getElementById("weight");
    const weightNote = document.getElementById("weightNote");
    const weightLabel = document.getElementById("weightLabel");

    const isBodyweight = bodyweightExercises.includes(exerciseName);

    if (isBodyweight) {
        if (weightNote) weightNote.style.display = "block";
        if (weightLabel) weightLabel.innerText = "Added Weight (KG) [Optional]";
    } else {
        if (weightNote) weightNote.style.display = "none";
        if (weightLabel) weightLabel.innerText = "Weight (KG)";
    }

    if (weightInput) {
        if (state.targetWeight > 0) {
            weightInput.value = state.targetWeight;
        } else if (!isBodyweight) {
            weightInput.value = 20;
        } else {
            weightInput.value = 0;
        }

        if (typeof updateWarmupAndPlates === "function") {
            updateWarmupAndPlates(weightInput.value);
        }
    }

    displayTargetForExercise(exerciseName, state);
}

function displayTargetForExercise(exerciseName, state) {
    const nextTargetDiv = document.getElementById("nextTarget");
    if (!nextTargetDiv) return;

    const isBodyweight = bodyweightExercises.includes(exerciseName);
    
    let statusBadge = "";
    if (state.lastStatus === "PROGRESSION") {
        statusBadge = `<span style="color: #00ff88; font-weight: bold;">[Target Increased +5%]</span>`;
    } else if (state.lastStatus === "DELOAD") {
        statusBadge = `<span style="color: #ff4444; font-weight: bold;">[Auto-Deload Triggered -10%]</span>`;
    } else if (state.lastStatus === "FAILED_ONCE") {
        statusBadge = `<span style="color: #ffbb00; font-weight: bold;">[Warning: 1 Strike - Hit target to prevent deload]</span>`;
    }

    let targetDetails = isBodyweight && state.targetWeight === 0
        ? `<strong>${state.targetSets}</strong> Sets x <strong>${state.targetReps}</strong> Reps (Bodyweight)`
        : `<strong>${state.targetSets}</strong> Sets x <strong>${state.targetReps}</strong> Reps @ <strong>${state.targetWeight} KG</strong>`;

    nextTargetDiv.innerHTML = `
        <div style="padding: 12px; background: rgba(0, 170, 255, 0.1); border-left: 4px solid #00aaff; border-radius: 6px;">
            <p style="margin-bottom: 5px; font-size: 16px;">Target for <strong>${exerciseName}</strong>:</p>
            <p style="font-size: 18px;">${targetDetails}</p>
            ${statusBadge ? `<p style="margin-top: 5px; font-size: 13px;">${statusBadge}</p>` : ""}
        </div>
    `;
}

function processProgressionEngine(exercise, loggedSets, loggedReps, loggedWeight) {
    let currentState = getExerciseState(exercise);
    const isBodyweight = bodyweightExercises.includes(exercise);

    if (currentState.lastStatus === "INITIAL" && !isBodyweight && currentState.targetWeight === 0) {
        currentState.targetWeight = loggedWeight > 0 ? loggedWeight : 20;
    }

    const metThreshold = (loggedReps >= currentState.targetReps) && 
                         (isBodyweight || loggedWeight >= currentState.targetWeight);

    let resultStatus = "";
    let nextState = { ...currentState };

    if (metThreshold) {
        nextState.failCount = 0;
        nextState.lastStatus = "PROGRESSION";
        resultStatus = "PASSED";

        if (isBodyweight && loggedWeight === 0) {
            nextState.targetReps += BODYWEIGHT_REP_INCREMENT;
        } else {
            const baseWeight = loggedWeight > 0 ? loggedWeight : (currentState.targetWeight || 20);
            const newWeight = Math.round((baseWeight * (1 + WEIGHT_INCREMENT_PCT)) * 2) / 2;
            nextState.targetWeight = newWeight;
        }
    } else {
        nextState.failCount += 1;

        if (nextState.failCount >= 2) {
            nextState.failCount = 0;
            nextState.lastStatus = "DELOAD";
            resultStatus = "DELOAD";

            if (isBodyweight && loggedWeight === 0) {
                nextState.targetReps = Math.max(5, nextState.targetReps - BODYWEIGHT_REP_INCREMENT);
            } else {
                const baseWeight = loggedWeight > 0 ? loggedWeight : (currentState.targetWeight || 20);
                const newWeight = Math.max(5, Math.round((baseWeight * (1 - DELOAD_PCT)) * 2) / 2);
                nextState.targetWeight = newWeight;
            }
        } else {
            nextState.lastStatus = "FAILED_ONCE";
            resultStatus = "FAILED (1/2)";
        }
    }

    saveExerciseState(exercise, nextState);
    return { resultStatus, nextState };
}

function calculatePlateLoad() {
    const user = getCurrentUser();
    if (!user || !user.isPro) {
        window.location.href = "pro.html";
        return;
    }

    const targetInput = document.getElementById("targetBarLoad");
    const target = parseFloat(targetInput ? targetInput.value : 0);
    const resultBox = document.getElementById("plateCalcResult");
    const renderBox = document.getElementById("platesRenderBox");

    if (isNaN(target) || target < 20) {
        if (resultBox) {
            resultBox.style.display = "block";
            resultBox.innerText = "Minimum Olympic load is 20 kg (Empty Barbell).";
        }
        if (renderBox) {
            renderBox.innerHTML = `<span style="color: #64748b; font-size: 13px;">Empty Barbell (20kg)</span>`;
        }
        return;
    }

    let remainder = (target - 20) / 2;
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const platesUsed = [];

    for (let plate of availablePlates) {
        while (remainder >= plate) {
            platesUsed.push(plate);
            remainder = parseFloat((remainder - plate).toFixed(2));
        }
    }

    if (resultBox) {
        resultBox.style.display = "block";
        if (platesUsed.length === 0) {
            resultBox.innerHTML = "<strong>Load Per Side:</strong> Empty Barbell (0 kg added)";
        } else {
            resultBox.innerHTML = `<strong>Plates Per Side:</strong> ${platesUsed.map(p => `${p}kg`).join(", ")} | Total side load: ${(target - 20) / 2} kg`;
        }
    }

    if (renderBox) {
        if (platesUsed.length === 0) {
            renderBox.innerHTML = `<span style="color: #64748b; font-size: 13px;">Empty Barbell (20kg)</span>`;
        } else {
            renderBox.innerHTML = platesUsed.map(p => {
                const conf = plateColorMap[p] || { color: "#fff", height: "40px", width: "10px", label: p };
                return `
                    <div style="background: ${conf.color}; height: ${conf.height}; width: ${conf.width}; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; color: ${conf.text || '#fff'}; border: 1px solid rgba(0,0,0,0.5); box-shadow: 0 2px 4px rgba(0,0,0,0.5);" title="${p}kg plate">
                    </div>
                `;
            }).join("");
        }
    }
}

let proTimerInterval = null;

function speakRestPrompt(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

function startProRestTimer(seconds) {
    const user = getCurrentUser();
    if (!user || !user.isPro) {
        window.location.href = "pro.html";
        return;
    }

    clearInterval(proTimerInterval);
    let timeLeft = seconds;
    const timerDisplay = document.getElementById("timerCountdown");

    function updateDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        if (timerDisplay) {
            timerDisplay.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }

    updateDisplay();
    speakRestPrompt(`Rest started. ${seconds} seconds.`);

    proTimerInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft === 30) {
            speakRestPrompt("30 seconds remaining.");
        } else if (timeLeft === 10) {
            speakRestPrompt("10 seconds. Prepare for your next set.");
        }

        if (timeLeft <= 0) {
            clearInterval(proTimerInterval);
            if (timerDisplay) timerDisplay.innerText = "TIME UP!";
            speakRestPrompt("Time up. Begin your set.");
            playTimerBeep();
        } else {
            updateDisplay();
        }
    }, 1000);
}

function resetProRestTimer() {
    clearInterval(proTimerInterval);
    const timerDisplay = document.getElementById("timerCountdown");
    if (timerDisplay) timerDisplay.innerText = "00:00";
}

function playTimerBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
        console.error(e);
    }
}

function openReadinessModal() {
    const modal = document.getElementById("readinessModal");
    if (modal) modal.style.display = "flex";
}

function closeReadinessModal() {
    const modal = document.getElementById("readinessModal");
    if (modal) modal.style.display = "none";
}

function handleReadinessSubmit(event) {
    event.preventDefault();
    const sleep = parseInt(document.getElementById("sleepInput").value) || 4;
    const energy = parseInt(document.getElementById("energyInput").value) || 4;
    const soreness = parseInt(document.getElementById("sorenessInput").value) || 4;

    const total = sleep + energy + soreness;
    const percentage = Math.round((total / 15) * 100);

    const banner = document.getElementById("readinessScoreBanner");
    const scoreVal = document.getElementById("readinessScoreVal");
    const adviceText = document.getElementById("readinessAdvice");

    if (banner && scoreVal && adviceText) {
        banner.style.display = "flex";
        scoreVal.innerText = `${percentage}%`;

        if (percentage >= 80) {
            scoreVal.style.color = "#00e676";
            adviceText.innerText = "Prime recovery state. Green light to push progressive overload (+5%) and heavy compound targets.";
        } else if (percentage >= 60) {
            scoreVal.style.color = "#00aaff";
            adviceText.innerText = "Moderate readiness. Maintain planned working sets; avoid forced failure reps.";
        } else {
            scoreVal.style.color = "#ffbb00";
            adviceText.innerText = "Fatigue detected. Consider reducing volume by 1 set per exercise or focus on form and tempo.";
        }
    }

    const email = getCurrentEmail();
    localStorage.setItem(`readiness_${email}`, JSON.stringify({ score: percentage, date: new Date().toLocaleDateString() }));
    closeReadinessModal();
}

function calculateMuscleRecovery() {
    const user = getCurrentUser();
    const history = user ? (user.workoutHistory || []) : [];
    
    const muscles = {
        Chest: { sets: 0, lastDate: null, elemVal: "recValChest", elemBar: "recBarChest" },
        Back: { sets: 0, lastDate: null, elemVal: "recValBack", elemBar: "recBarBack" },
        Legs: { sets: 0, lastDate: null, elemVal: "recValLegs", elemBar: "recBarLegs" },
        Shoulders: { sets: 0, lastDate: null, elemVal: "recValShoulders", elemBar: "recBarShoulders" },
        Arms: { sets: 0, lastDate: null, elemVal: "recValArms", elemBar: "recBarArms" }
    };

    const mapping = {
        "Bench Press": "Chest", "Incline Dumbbell Press": "Chest", "Chest Fly": "Chest", "Push Ups": "Chest",
        "Pull Ups": "Back", "Deadlift": "Back", "Lat Pulldown": "Back", "Barbell Row": "Back", "Seated Cable Row": "Back", "T Bar Row": "Back",
        "Squats": "Legs", "Leg Press": "Legs", "Lunges": "Legs", "Leg Extension": "Legs", "Leg Curl": "Legs", "Calf Raises": "Legs",
        "Shoulder Press": "Shoulders", "Lateral Raise": "Shoulders", "Front Raise": "Shoulders", "Rear Delt Fly": "Shoulders", "Clean and Press": "Shoulders",
        "Bicep Curl": "Arms", "Hammer Curl": "Arms", "Preacher Curl": "Arms", "Tricep Pushdown": "Arms", "Skull Crushers": "Arms", "Dips": "Arms",
        "Plank": "Arms", "Crunches": "Arms", "Leg Raises": "Arms"
    };

    history.forEach(item => {
        const m = mapping[item.exercise];
        if (m && !muscles[m].lastDate) {
            muscles[m].lastDate = new Date(item.date);
            muscles[m].sets = Number(item.sets) || 3;
        }
    });

    const now = new Date();

    Object.keys(muscles).forEach(k => {
        const item = muscles[k];
        let pct = 100;

        if (item.lastDate && !isNaN(item.lastDate.getTime())) {
            const diffHours = Math.abs(now - item.lastDate) / 36e5;
            if (diffHours < 24) pct = 45;
            else if (diffHours < 48) pct = 75;
            else pct = 100;
        }

        const vEl = document.getElementById(item.elemVal);
        const bEl = document.getElementById(item.elemBar);

        if (vEl && bEl) {
            vEl.innerText = `${pct}%`;
            bEl.style.width = `${pct}%`;
            if (pct === 100) {
                vEl.style.color = "#00e676";
                bEl.style.background = "#00e676";
            } else if (pct >= 70) {
                vEl.style.color = "#00aaff";
                bEl.style.background = "#00aaff";
            } else {
                vEl.style.color = "#ffbb00";
                bEl.style.background = "#ffbb00";
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const workoutForm = document.getElementById("workoutForm");
    if (workoutForm) {
        workoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const exercise = document.getElementById("exercise").value;
            const setsInput = document.getElementById("sets");
            const repsInput = document.getElementById("reps");
            const weightInput = document.getElementById("weight");
            const notesInput = document.getElementById("workoutNotes");

            const sets = parseInt(setsInput.value) || 0;
            const reps = parseInt(repsInput.value) || 0;
            const weight = parseFloat(weightInput.value) || 0;
            const notes = notesInput ? notesInput.value.trim() : "";

            const exerciseError = document.getElementById("exerciseError");
            const setsError = document.getElementById("setsError");
            const repsError = document.getElementById("repsError");
            const weightError = document.getElementById("weightError");

            const clearErrors = () => {
                [exerciseError, setsError, repsError, weightError].forEach(err => {
                    if (err) err.style.display = "none";
                });
            };

            clearErrors();
            let isValid = true;

            if (!exercise) {
                if (exerciseError) exerciseError.style.display = "block";
                isValid = false;
            }
            if (sets <= 0 || isNaN(sets)) {
                if (setsError) setsError.style.display = "block";
                isValid = false;
            }
            if (reps <= 0 || isNaN(reps)) {
                if (repsError) repsError.style.display = "block";
                isValid = false;
            }
            if (weight < 0 || isNaN(weight)) {
                if (weightError) weightError.style.display = "block";
                isValid = false;
            }

            if (!isValid) return;

            const engineResult = processProgressionEngine(exercise, sets, reps, weight);
            const activePhysique = getActivePhysique();
            const currentWorkouts = getWorkoutsForUser(activePhysique);

            const newEntry = {
                id: Date.now(),
                exercise: exercise,
                sets: sets,
                reps: reps,
                weight: weight,
                notes: notes,
                result: engineResult.resultStatus,
                date: new Date().toLocaleDateString(),
                physique: activePhysique
            };

            currentWorkouts.unshift(newEntry);
            saveWorkoutsForUser(currentWorkouts, activePhysique);

            renderWorkoutHistory();
            displayTargetForExercise(exercise, engineResult.nextState);
            calculateMuscleRecovery();

            workoutForm.reset();
            document.getElementById("exercise").value = exercise;
        });
    }

    renderWorkoutHistory();
    calculateMuscleRecovery();

    const activePhysique = getActivePhysique();
    const workouts = getWorkoutsForUser(activePhysique);

    if (workouts.length > 0) {
        const lastLoggedExercise = workouts[0].exercise;
        const state = getExerciseState(lastLoggedExercise);
        displayTargetForExercise(lastLoggedExercise, state);
    }
});

function renderWorkoutHistory() {
    const historyBody = document.getElementById("workoutHistory");
    if (!historyBody) return;

    const activePhysique = getActivePhysique();
    const workouts = getWorkoutsForUser(activePhysique);

    if (workouts.length === 0) {
        historyBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #aaa;">No workout logs found for ${activePhysique} profile.</td></tr>`;
        return;
    }

    historyBody.innerHTML = workouts.map(item => {
        let resultColor = "#00ff88";
        if (item.result && item.result.includes("DELOAD")) resultColor = "#ff4444";
        if (item.result && item.result.includes("FAILED")) resultColor = "#ffbb00";

        const noteText = item.notes ? `<span style="font-size: 12.5px; color: #94a3b8;"><i class="bi bi-chat-left-dots"></i> ${item.notes}</span>` : `<span style="color: #475569;">—</span>`;

        return `
            <tr>
                <td><strong>${item.exercise}</strong></td>
                <td>${item.sets}</td>
                <td>${item.reps}</td>
                <td>${item.weight} KG</td>
                <td><span style="color: ${resultColor}; font-weight: 600;">${item.result || "PASSED"}</span></td>
                <td>${noteText}</td>
                <td>${item.date}</td>
                <td>
                    <button onclick="deleteWorkoutLog(${item.id})" class="delete-btn" title="Delete Log">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function deleteWorkoutLog(id) {
    const activePhysique = getActivePhysique();
    let workouts = getWorkoutsForUser(activePhysique);

    workouts = workouts.filter(item => item.id !== id);
    saveWorkoutsForUser(workouts, activePhysique);

    renderWorkoutHistory();
    calculateMuscleRecovery();
}

window.handleExerciseChange = handleExerciseChange;
window.deleteWorkoutLog = deleteWorkoutLog;
window.calculatePlateLoad = calculatePlateLoad;
window.startProRestTimer = startProRestTimer;
window.resetProRestTimer = resetProRestTimer;
window.openReadinessModal = openReadinessModal;
window.closeReadinessModal = closeReadinessModal;
window.handleReadinessSubmit = handleReadinessSubmit;