if (!sessionStorage.getItem("loggedInUser")) {
    window.location.href = "login.html";
}

const loggedEmail = sessionStorage.getItem("loggedInUser");
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = users.find(user => user.email === loggedEmail);

if (!currentUser) {
    window.location.href = "login.html";
}

const physiquePlans = {
    Lean: {
        calories: 2200,
        protein: 160,
        engineStatus: "+5% / -10%",
        engineLabel: "Balanced Hypertrophy",
        cardio: "10,000 Steps Daily + 20 Min Moderate Incline Walking (3x/week)",
        questions: [
            "Current body fat percentage?",
            "Main goal?",
            "Workout experience?"
        ],
        dailyGoals: [
            "Complete 45 min strength workout",
            "Consume 160g protein",
            "Walk 10,000 steps",
            "Sleep 7-8 hours"
        ],
        nextDay: [
            "Increase cardio intensity",
            "Prepare high protein meals",
            "Track calorie intake"
        ],
        workout: [
            "Push Ups",
            "Squats",
            "Bench Press",
            "Pull Ups",
            "Core Training"
        ],
        diet: [
            "Breakfast: Oats Bowl with Chia Seeds & Berries",
            "Lunch: Paneer / Chicken Breast + Brown Rice + Salad",
            "Snack: Greek Yogurt + Almonds",
            "Dinner: Lentil Soup / Fish + Whole Wheat Roti"
        ]
    },
    Bulk: {
        calories: 3200,
        protein: 190,
        engineStatus: "+7.5% / -5%",
        engineLabel: "Aggressive Overload",
        cardio: "6,000 - 8,000 Low Impact Steps Daily (Energy conservation for muscle synthesis)",
        questions: [
            "Current weight?",
            "Daily calorie intake?",
            "Gym experience level?"
        ],
        dailyGoals: [
            "Eat calorie surplus",
            "Consume 180g protein",
            "Progressive overload training",
            "Drink 4L water"
        ],
        nextDay: [
            "Increase workout weight",
            "Meal prep for growth",
            "Track strength gains"
        ],
        workout: [
            "Heavy Squats",
            "Bench Press",
            "Deadlift",
            "Barbell Rows",
            "Bicep Curls"
        ],
        diet: [
            "Breakfast: 4 Whole Eggs / Stuffed Paratha + Smoothie",
            "Lunch: Chicken / Paneer Curry + Rice + Veggies",
            "Snack: Whey / Plant Protein Shake + Dry Fruits",
            "Dinner: Steak / Rajma + Rice + Avocado Salad"
        ]
    },
    Skinny: {
        calories: 3000,
        protein: 170,
        engineStatus: "+5% / -5%",
        engineLabel: "Steady Progression",
        cardio: "5,000 Easy Steps + 10 Min Light Mobility (Keep appetite peak)",
        questions: [
            "Current weight?",
            "Weight gain target?",
            "Daily meal frequency?"
        ],
        dailyGoals: [
            "Eat 5-6 meals",
            "Consume calorie surplus",
            "Strength training",
            "Sleep 8 hours"
        ],
        nextDay: [
            "Increase calories",
            "Add extra protein",
            "Improve recovery"
        ],
        workout: [
            "Compound Exercises",
            "Squats",
            "Deadlift",
            "Bench Press",
            "Shoulder Press"
        ],
        diet: [
            "Breakfast: Milk + Banana + Peanut Butter Shake",
            "Lunch: Rice + Dal + Chicken / Paneer Curry",
            "Snack: Dry Fruit Smoothie + Roasted Chana",
            "Dinner: Mix Veggie / Egg Curry + Roti + Butter"
        ]
    },
    Athletic: {
        calories: 2700,
        protein: 180,
        engineStatus: "+5% / -10%",
        engineLabel: "Explosive Power",
        cardio: "10,000 Steps + 15 Min High-Intensity Interval Sprints (HIIT)",
        questions: [
            "Favorite sport?",
            "Performance goal?",
            "Training frequency?"
        ],
        dailyGoals: [
            "Strength workout",
            "Mobility training",
            "High protein meals",
            "Daily stretching"
        ],
        nextDay: [
            "Improve endurance",
            "Increase explosive power",
            "Recover properly"
        ],
        workout: [
            "Sprints",
            "Plyometrics",
            "Squats",
            "Pull Ups",
            "Core Workout"
        ],
        diet: [
            "Breakfast: Fresh Fruit Bowl + Oatmeal & Chia Seeds",
            "Lunch: Tofu / Chicken Breast + Rice + Broccoli",
            "Snack: Sprouts Salad / Turkey Wrap",
            "Dinner: Salmon / Soy Chunk Curry + Sweet Potato"
        ]
    },
    Cutting: {
        calories: 1800,
        protein: 185,
        engineStatus: "+2.5% / -10%",
        engineLabel: "Strength Preservation",
        cardio: "12,000 - 14,000 Daily Steps + 30 Min Fasted Incline Treadmill Walk",
        questions: [
            "Target body fat %?",
            "Caloric deficit limit?",
            "Preferred cardio type?"
        ],
        dailyGoals: [
            "Burn 600 active calories",
            "Consume high protein (2.0g/kg)",
            "Maintain 12,000 steps",
            "Hydrate with 4L water"
        ],
        nextDay: [
            "Refeed macro review",
            "Incline treadmill LISS session",
            "Electrolyte balance check"
        ],
        workout: [
            "Incline DB Press",
            "Lat Pulldowns",
            "Leg Press",
            "Hanging Leg Raises",
            "20 Min Stairmaster"
        ],
        diet: [
            "Breakfast: Egg Whites / Tofu Scramble + Spinach",
            "Lunch: Grilled Chicken / Paneer + Green Salad",
            "Snack: Whey Isolate in Water + Cucumber Slices",
            "Dinner: White Fish / Paneer + Steamed Asparagus"
        ]
    },
    Maingain: {
        calories: 2500,
        protein: 175,
        engineStatus: "+2.5% / -5%",
        engineLabel: "Micro Progression",
        cardio: "8,500 Steps Daily + 2x 20 Min Steady State Cycling",
        questions: [
            "Maintenance calorie intake?",
            "Current lifting totals?",
            "Prior target progression rate?"
        ],
        dailyGoals: [
            "Hit maintenance calories exactly",
            "Maintain strength performance",
            "Consume 1.8g protein per kg",
            "8 hours quality sleep"
        ],
        nextDay: [
            "Micro-load compound weights",
            "Optimize post-workout recovery",
            "Track daily body weight average"
        ],
        workout: [
            "Barbell Back Squat",
            "Overhead Shoulder Press",
            "Romanian Deadlifts",
            "Incline Bench Press",
            "Cable Face Pulls"
        ],
        diet: [
            "Breakfast: Whole Eggs / Oats + Toast + Fruit",
            "Lunch: Chicken / Paneer + Brown Rice + Veggies",
            "Snack: Greek Yogurt + Almonds + Honey",
            "Dinner: Tofu Stir-Fry / Salmon + Sweet Potato"
        ]
    },
    Powerlifting: {
        calories: 3500,
        protein: 200,
        engineStatus: "+10% / -10%",
        engineLabel: "Maximal Load Progression",
        cardio: "6,000 Low-Impact Walking Steps (Prevent CNS fatigue & joint load)",
        questions: [
            "Current 1RM Squat?",
            "Current 1RM Bench?",
            "Current 1RM Deadlift?"
        ],
        dailyGoals: [
            "Execute low-rep strength sets",
            "Prioritize intra-workout carbs",
            "Perform mobility pre-hab",
            "Complete core stability training"
        ],
        nextDay: [
            "Heavy double/triple progression",
            "CNS recovery protocols",
            "Review lifting technique footage"
        ],
        workout: [
            "Heavy Barbell Squats",
            "Competition Bench Press",
            "Conventional Deadlifts",
            "Heavy Barbell Shrugs",
            "Ab Wheel Rollouts"
        ],
        diet: [
            "Breakfast: Oatmeal + Peanut Butter & Bananas + Milk",
            "Lunch: Steak / Cottage Cheese + Rice + Sweet Potato",
            "Snack: Cream of Rice + Whey / Plant Protein",
            "Dinner: Pasta / Rice Bowl with Heavy Protein Source"
        ]
    },
    Endurance: {
        calories: 2900,
        protein: 150,
        engineStatus: "+5% / -15%",
        engineLabel: "Stamina & Volume Mode",
        cardio: "15,000+ Steps + 45-60 Min Zone 2 Aerobic Running / Cycling Sessions",
        questions: [
            "Target weekly distance?",
            "Current VO2 Max / Zone 2 pace?",
            "Primary endurance focus?"
        ],
        dailyGoals: [
            "Complete 60-min Zone 2 session",
            "Replenish sodium/glycogen",
            "Perform active recovery stretching",
            "Track resting heart rate"
        ],
        nextDay: [
            "High-intensity interval session",
            "Carbohydrate loading preparation",
            "Foam rolling & mobility work"
        ],
        workout: [
            "Interval Sprint Drills",
            "Bodyweight Lunges",
            "Kettlebell Swings",
            "Plank Rotations",
            "Rowing Ergometer Intervals"
        ],
        diet: [
            "Breakfast: Large Oatmeal + Honey + Nuts + Toast",
            "Lunch: Quinoa / Rice Bowl + Black Beans + Avocado",
            "Snack: Energy Bar / Rice Cakes with Peanut Butter",
            "Dinner: Pasta + Tofu / Salmon + Steamed Veggies"
        ]
    }
};

function getSavedAnswers(physique) {
    let key = `overloadfit_answers_${loggedEmail}_${physique}`;
    return JSON.parse(localStorage.getItem(key)) || {};
}

function saveAnswer(physique, questionIndex, value, questionText) {
    let key = `overloadfit_answers_${loggedEmail}_${physique}`;
    let answers = getSavedAnswers(physique);
    answers[`answer${questionIndex}`] = value;
    localStorage.setItem(key, JSON.stringify(answers));

    users = JSON.parse(localStorage.getItem("users")) || [];
    let uIndex = users.findIndex(u => u.email === loggedEmail);
    if (uIndex !== -1) {
        if (!users[uIndex].metrics) users[uIndex].metrics = {};
        users[uIndex].metrics[questionText] = value;
        localStorage.setItem("users", JSON.stringify(users));
        currentUser = users[uIndex];
    }
}

function selectPhysique(type) {
    let plan = physiquePlans[type];
    if (!plan) return;

    if (typeof setSelectedPhysique === "function") {
        setSelectedPhysique(type);
    } else {
        localStorage.setItem(`overloadfit_selected_physique_${loggedEmail}`, type);
    }

    currentUser.physique = type;
    saveUser();

    displayQuestions(plan.questions, type);
    generatePlan(plan, type);
    highlightActivePhysiqueCard(type);
    updateOverviewChips(type, plan);
    renderWorkoutHistory();
}

function updateOverviewChips(type, plan) {
    const profileChip = document.getElementById("activeProfileChip");
    const calChip = document.getElementById("targetCalChip");
    const proteinChip = document.getElementById("proteinRatioChip");
    const engineChip = document.getElementById("engineStatusChip");

    if (profileChip) profileChip.innerText = type;
    if (calChip) calChip.innerText = `${plan.calories.toLocaleString()} kcal`;
    if (proteinChip) proteinChip.innerText = `${plan.protein}g / day`;
    if (engineChip) engineChip.innerText = `Active (${plan.engineStatus})`;

    const cardioBox = document.getElementById("cardioPrescriptionBox");
    if (cardioBox && plan.cardio) {
        cardioBox.innerHTML = `
            <div style="background: #080c13; padding: 15px; border-radius: 12px; border: 1px solid rgba(0, 230, 118, 0.2);">
                <p style="color: #00e676; font-size: 15px; font-weight: 600; margin: 0 0 4px;"><i class="bi bi-activity"></i> ${type} Cardiovascular Target:</p>
                <p style="color: #e0e0e0; font-size: 14px; margin: 0;">${plan.cardio}</p>
            </div>
        `;
    }
}

function highlightActivePhysiqueCard(type) {
    document.querySelectorAll(".physique-card").forEach(card => {
        card.classList.remove("active");
        if (card.getAttribute("onclick") && card.getAttribute("onclick").includes(type)) {
            card.classList.add("active");
        }
    });

    let displayBadge = document.getElementById("currentPhysiqueDisplay");
    if (displayBadge) {
        displayBadge.innerText = type;
    }
}

function displayQuestions(questions, physique) {
    let box = document.getElementById("questions");
    if (!box) return;

    box.innerHTML = "";
    let savedAnswers = getSavedAnswers(physique);

    questions.forEach((question, index) => {
        let savedVal = savedAnswers[`answer${index}`] || "";

        box.innerHTML += `
            <div class="question-box">
                <label>${question}</label>
                <input 
                    type="text" 
                    placeholder="Enter answer" 
                    id="answer${index}" 
                    value="${savedVal}"
                    oninput="saveAnswer('${physique}', ${index}, this.value, '${question}')"
                >
            </div>
        `;
    });
}

function generatePlan(plan, type) {
    let goalBox = document.getElementById("dailyGoals");
    let nextBox = document.getElementById("nextGoals");
    let workoutBox = document.getElementById("workoutPlan");
    let dietBox = document.getElementById("dietPlan");

    let activePhysique = type || currentUser.physique || "Lean";
    let history = (currentUser.workoutHistory || []).filter(item => !item.physique || item.physique === activePhysique);
    let totalSessions = history.length;
    let currentWeek = Math.floor(totalSessions / 3) + 1;
    let currentSessionInWeek = (totalSessions % 3) + 1;

    if (goalBox) {
        goalBox.innerHTML = "";
        plan.dailyGoals.forEach(goal => {
            goalBox.innerHTML += `<div class="goal-item">🔥 ${goal}</div>`;
        });
    }

    if (nextBox) {
        nextBox.innerHTML = "";
        plan.nextDay.forEach(goal => {
            nextBox.innerHTML += `<div class="goal-item">⚡ ${goal}</div>`;
        });
    }

    if (workoutBox) {
        workoutBox.innerHTML = `
            <div style="margin-bottom: 12px; padding: 8px 12px; background: rgba(0, 170, 255, 0.1); border-left: 3px solid #00aaff; border-radius: 4px; font-weight: 600; color: #00aaff;">
                🗓️ Multi-Week Plan: Week ${currentWeek} — Session ${currentSessionInWeek}
            </div>
        `;
        plan.workout.forEach(exercise => {
            workoutBox.innerHTML += `<div class="exercise-item">💪 ${exercise}</div>`;
        });
    }

    if (dietBox && plan.diet) {
        dietBox.innerHTML = `
            <div style="margin-bottom: 12px; padding: 8px 12px; background: rgba(0, 230, 118, 0.1); border-left: 3px solid #00e676; border-radius: 4px; font-weight: 600; color: #00e676;">
                🥗 Target Macros: ${plan.calories.toLocaleString()} kcal | ${plan.protein}g Protein
            </div>
        `;
        plan.diet.forEach(item => {
            dietBox.innerHTML += `<div class="diet-item" style="margin-bottom: 8px; font-size: 14px; color: #ddd;">🥗 ${item}</div>`;
        });
    }
}

function renderWorkoutHistory() {
    let tableBody = document.getElementById("workoutHistoryTableBody") || document.querySelector(".training-history-table tbody");
    if (!tableBody) return;

    let activePhysique = currentUser.physique || "Lean";
    let history = (currentUser.workoutHistory || []).filter(item => !item.physique || item.physique === activePhysique);

    tableBody.innerHTML = "";

    if (history.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No training logs found for ${activePhysique} profile.</td></tr>`;
        return;
    }

    history.forEach(item => {
        let displayVolume = item.volume 
            ? `${item.volume} kg` 
            : (item.sets && item.reps && item.weight ? `${item.sets * item.reps * item.weight} kg` : "Bodyweight");

        tableBody.innerHTML += `
            <tr>
                <td>${item.date || "N/A"}</td>
                <td style="color:#00aaff;">${item.physique || activePhysique}</td>
                <td>${item.exercise || "Workout Session"}</td>
                <td>${displayVolume}</td>
                <td><span style="color:#00ff88;">✔ Logged</span></td>
            </tr>
        `;
    });
}

function saveUser() {
    users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map(user => {
        if (user.email === currentUser.email) {
            return currentUser;
        }
        return user;
    });

    localStorage.setItem("users", JSON.stringify(users));
}

document.addEventListener("DOMContentLoaded", () => {
    let savedPhysique = localStorage.getItem(`overloadfit_selected_physique_${loggedEmail}`);
    let activePhysique = savedPhysique || currentUser.physique || "Lean";
    selectPhysique(activePhysique);

    const oneRmForm = document.getElementById("oneRmForm");
    if (oneRmForm) {
        oneRmForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const weightInput = document.getElementById("calcWeight");
            const repsInput = document.getElementById("calcReps");
            const resultEl = document.getElementById("oneRmResult");

            if (!weightInput || !repsInput) return;

            const weight = parseFloat(weightInput.value);
            const reps = parseInt(repsInput.value);

            if (weight > 0 && reps > 0 && resultEl) {
                const epley1RM = Math.round(weight * (1 + reps / 30));

                resultEl.style.display = "inline-flex";
                resultEl.innerHTML = `<i class="bi bi-trophy-fill" style="color: #00e676;"></i> Estimated 1RM: <strong style="color: #fff; margin-left: 4px;">${epley1RM} kg</strong> <span style="color: #b5b5b5; font-weight: 400; font-size: 13px; margin-left: 6px;">(${weight} kg × ${reps} reps)</span>`;
            }
        });
    }
});

window.selectPhysique = selectPhysique;
window.saveAnswer = saveAnswer;