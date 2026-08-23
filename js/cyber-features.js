const WGER_API_BASE = "https://wger.de/api/v2";

const offlineMuscleExercises = {
    "1": [
        { name: "Barbell Bicep Curl", category: "Arms", description: "Stand with feet shoulder-width apart, curl the barbell upwards contracting the biceps, then lower with a controlled eccentric tempo." },
        { name: "Dumbbell Hammer Curl", category: "Arms", description: "Keep palms facing inward throughout the movement to emphasize the brachialis and forearm flexors." },
        { name: "Incline Dumbbell Curl", category: "Arms", description: "Sit on an inclined bench for full stretch on the long head of the bicep. Avoid swinging the shoulders." },
        { name: "Preacher Curl", category: "Arms", description: "Isolate the short head of the bicep against the pad, keeping the elbows locked in position." },
        { name: "Cable Rope Hammer Curl", category: "Arms", description: "Maintain constant tension throughout the range of motion by spreading the rope at peak contraction." },
        { name: "Concentration Curl", category: "Arms", description: "Rest the elbow against the inner thigh and curl slowly to maximize mind-muscle peak contraction." }
    ],
    "2": [
        { name: "Overhead Dumbbell Press", category: "Shoulders", description: "Press dumbbells overhead from ear level, locking out without arching the lower spine." },
        { name: "Barbell Military Press", category: "Shoulders", description: "Strict standing press engaging the core and pushing the head through the window at top extension." },
        { name: "Dumbbell Lateral Raise", category: "Shoulders", description: "Raise arms out laterally until parallel to the floor with elbows slightly bent and pinkies tilted." },
        { name: "Cable Front Raise", category: "Shoulders", description: "Pull cable upwards to shoulder level maintaining constant tension on the anterior deltoid." },
        { name: "Face Pulls", category: "Shoulders", description: "Pull the rope toward the eyes while externally rotating the shoulders to target rear delts and rotator cuffs." },
        { name: "Arnold Press", category: "Shoulders", description: "Rotate the wrists from supinated at the bottom to pronated at the lockout overhead." }
    ],
    "4": [
        { name: "Barbell Flat Bench Press", category: "Chest", description: "Drive feet into the floor, retract the scapula, lower bar to mid-chest, and press upwards explosively." },
        { name: "Incline Dumbbell Press", category: "Chest", description: "Set bench to 30 degrees to bias the clavicular head of the pectoralis major." },
        { name: "Cable Crossover Fly", category: "Chest", description: "Bring hands together in a hugging motion, crossing wrists slightly for maximal pec shortening." },
        { name: "Weighted Chest Dips", category: "Chest", description: "Lean forward 30 degrees to emphasize lower chest fibers over the triceps." },
        { name: "Dumbbell Pullover", category: "Chest", description: "Lie perpendicular to the bench and lower the dumbbell behind the head to expand the ribcage." },
        { name: "Decline Barbell Press", category: "Chest", description: "Target the sternal head of the chest with reduced shoulder joint impingement." }
    ],
    "10": [
        { name: "Barbell Back Squat", category: "Legs", description: "Hinge hips back, track knees in line with toes, reach parallel or below, and drive through midfoot." },
        { name: "Leg Press (45 Degree)", category: "Legs", description: "Place feet shoulder-width in the center of the sled, lower slowly to 90 degrees without rounding the pelvis." },
        { name: "Bulgarian Split Squat", category: "Legs", description: "Elevate the rear foot on a bench and drop the hips vertically to load the front quad and glute." },
        { name: "Leg Extensions", category: "Legs", description: "Sit firmly against the back pad, extend knees fully, and pause for 1 second at top contraction." },
        { name: "Hack Squat", category: "Legs", description: "Maintain back flush against the pad to remove spinal load while forcing quad knee-flexion." },
        { name: "Walking Dumbbell Lunges", category: "Legs", description: "Step forward keeping the front shin vertical, tapping the rear knee lightly to the floor." }
    ],
    "12": [
        { name: "Conventional Deadlift", category: "Back", description: "Pull bar tight against the shins, hinge hips back, engage the lats, and drive the floor away." },
        { name: "Wide Grip Lat Pulldown", category: "Back", description: "Pull the bar down toward the upper chest while driving the elbows down and back." },
        { name: "Bent Over Barbell Row", category: "Back", description: "Hinge to a 45-degree torso angle, pull the bar to the navel, and squeeze the shoulder blades." },
        { name: "Seated Cable Row", category: "Back", description: "Keep the chest tall, avoid excessive torso swinging, and pull the handle directly to the midsection." },
        { name: "Chest Supported T-Bar Row", category: "Back", description: "Isolate the upper back and lat thickness while eliminating lower back fatigue." },
        { name: "Neutral Grip Pull-Up", category: "Back", description: "Grip parallel bars, pull until chin clears the bar, and lower under complete control." }
    ]
};

function quickAddFoodToDiary(name, cal, pro, carbs, fat) {
    const userEmail = sessionStorage.getItem("loggedInUser");
    if (!userEmail) {
        alert("Please log in to save to your Food Diary.");
        return;
    }

    let userDiary = JSON.parse(localStorage.getItem(`food_diary_${userEmail}`)) || [];
    userDiary.push({
        name: name,
        calories: Number(cal) || 0,
        protein: Number(pro) || 0,
        carbs: Number(carbs) || 0,
        fats: Number(fat) || 0
    });

    localStorage.setItem(`food_diary_${userEmail}`, JSON.stringify(userDiary));

    if (typeof renderFoodDiary === "function") {
        renderFoodDiary();
    }
    if (typeof updateRemainingMacros === "function") {
        updateRemainingMacros();
    }

    const diaryElement = document.getElementById("foodDiaryList");
    if (diaryElement) {
        diaryElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    alert(`⚡ ${name} successfully logged into Food Diary!`);
}

function resolveExerciseName(item, fallbackItem) {
    let name = item.name ? item.name.trim() : "";
    if (!name || name.toLowerCase() === "exercise") {
        if (Array.isArray(item.translations) && item.translations.length > 0) {
            const enTr = item.translations.find(t => (t.language === 2 || t.language?.id === 2 || t.language?.code === "en") && t.name && t.name.trim().toLowerCase() !== "exercise");
            if (enTr && enTr.name) name = enTr.name.trim();
            else {
                const anyTr = item.translations.find(t => t.name && t.name.trim().toLowerCase() !== "exercise" && t.name.trim() !== "");
                if (anyTr && anyTr.name) name = anyTr.name.trim();
            }
        }
    }
    if (!name || name.toLowerCase() === "exercise") {
        if (Array.isArray(item.aliases) && item.aliases.length > 0) {
            const aliasObj = item.aliases.find(a => a.alias && a.alias.trim().toLowerCase() !== "exercise");
            if (aliasObj) name = aliasObj.alias.trim();
        }
    }
    if (!name || name.toLowerCase() === "exercise") {
        name = fallbackItem?.name || "Target Exercise";
    }
    return name;
}

function resolveExerciseDesc(item, fallbackItem) {
    let desc = item.description ? item.description : "";
    if (!desc || desc.trim() === "") {
        if (Array.isArray(item.translations) && item.translations.length > 0) {
            const enTr = item.translations.find(t => (t.language === 2 || t.language?.id === 2 || t.language?.code === "en") && t.description);
            if (enTr && enTr.description) desc = enTr.description;
            else {
                const anyTr = item.translations.find(t => t.description && t.description.trim() !== "");
                if (anyTr) desc = anyTr.description;
            }
        }
    }
    desc = desc.replace(/<[^>]*>?/gm, "").trim();
    if (!desc || desc.length < 5) {
        desc = fallbackItem?.description || "Perform with controlled cadence and progressive overload.";
    }
    return desc.length > 120 ? desc.substring(0, 120) + "..." : desc;
}

function renderWgerCards(exercisesList, container, muscleKey = "4") {
    if (!container) return;

    const fallbackList = offlineMuscleExercises[muscleKey] || offlineMuscleExercises["4"];

    container.innerHTML = exercisesList.map((item, idx) => {
        const fallbackItem = fallbackList[idx % fallbackList.length];
        const exerciseName = resolveExerciseName(item, fallbackItem);
        const exerciseDesc = resolveExerciseDesc(item, fallbackItem);
        
        let categoryName = "Hypertrophy";
        if (item.category) {
            categoryName = typeof item.category === "object" ? (item.category.name || fallbackItem.category) : item.category;
        } else if (fallbackItem.category) {
            categoryName = fallbackItem.category;
        }

        const safeName = exerciseName.replace(/['"\\]/g, "");

        return `
            <div style="background: #060b14; border: 1px solid var(--hud-border); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 8px;">
                        <h4 style="color: #fff; font-family: var(--font-cyber); font-size: 15px; font-weight: 800; margin: 0; line-height: 1.3;">${safeName}</h4>
                        <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(0, 240, 255, 0.15); color: var(--cyan); border: 1px solid var(--hud-border); white-space: nowrap;">${categoryName}</span>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.5; margin-bottom: 14px;">${exerciseDesc}</p>
                </div>
                <button type="button" onclick="insertExerciseIntoWorkout('${safeName}')" class="start-workout-btn" style="padding: 8px 12px; font-size: 12px; width: 100%; justify-content: center;">
                    + Load into Workout
                </button>
            </div>
        `;
    }).join("");
}

async function fetchWgerExercisesByMuscle(muscleId = "4") {
    const container = document.getElementById("wgerMuscleResults");
    if (!container) return;

    const muscleKey = String(muscleId);
    container.innerHTML = `<p style="color: var(--cyan); grid-column: 1/-1; text-align: center; padding: 20px;"><i class="bi bi-arrow-repeat spin"></i> Querying exercise database...</p>`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
        const response = await fetch(`${WGER_API_BASE}/exerciseinfo/?language=2&muscles=${muscleKey}&limit=6`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                renderWgerCards(data.results, container, muscleKey);
                return;
            }
        }
    } catch (err) {
        clearTimeout(timeoutId);
    }

    const fallbackList = offlineMuscleExercises[muscleKey] || offlineMuscleExercises["4"];
    renderWgerCards(fallbackList, container, muscleKey);
}

function insertExerciseIntoWorkout(exerciseName) {
    const exerciseInput = document.getElementById("exercise");
    if (exerciseInput) {
        exerciseInput.value = exerciseName;
        if (typeof handleExerciseChange === "function") {
            handleExerciseChange(exerciseName);
        }
        window.scrollTo({ top: document.querySelector(".workout-card")?.offsetTop - 100, behavior: "smooth" });
    } else {
        localStorage.setItem("selectedWorkoutExercise", exerciseName);
        window.location.href = "workout.html";
    }
}

function calculateWilksScore(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const bw = parseFloat(document.getElementById("wilksBodyweight").value) || 0;
    const total = parseFloat(document.getElementById("wilksTotal").value) || 0;
    const gender = document.getElementById("wilksGender").value;
    const resultBox = document.getElementById("wilksResult");

    if (bw <= 0 || total <= 0 || !resultBox) return;

    let coeff = 0;
    if (gender === "Male") {
        const a = -216.0475144, b = 16.2606339, c = -0.002388645, d = -0.00113732, e = 7.01863E-06, f = -1.291E-08;
        coeff = 500 / (a + b * bw + c * Math.pow(bw, 2) + d * Math.pow(bw, 3) + e * Math.pow(bw, 4) + f * Math.pow(bw, 5));
    } else {
        const a = 594.31747775582, b = -27.23842536447, c = 0.82112226871, d = -0.00930733913, e = 4.731582E-05, f = -9.054E-08;
        coeff = 500 / (a + b * bw + c * Math.pow(bw, 2) + d * Math.pow(bw, 3) + e * Math.pow(bw, 4) + f * Math.pow(bw, 5));
    }

    const wilks = (total * coeff).toFixed(1);
    resultBox.style.display = "flex";
    resultBox.innerHTML = `<i class="bi bi-lightning-charge-fill" style="color: var(--cyan);"></i> Wilks Strength Score: <strong style="color: #fff; margin-left: 6px;">${wilks} PTS</strong>`;
}

let metronomeInterval = null;
let isMetronomeActive = false;

function toggleCyberMetronome(bpm = 60) {
    const btn = document.getElementById("metronomeToggleBtn");
    const indicator = document.getElementById("metronomePulseIndicator");

    if (isMetronomeActive) {
        clearInterval(metronomeInterval);
        isMetronomeActive = false;
        if (btn) btn.innerHTML = '<i class="bi bi-play-fill"></i> Start Tempo Metronome';
        if (indicator) indicator.style.background = "#334155";
        return;
    }

    isMetronomeActive = true;
    if (btn) btn.innerHTML = '<i class="bi bi-stop-fill"></i> Stop Tempo Metronome';

    const intervalMs = (60 / bpm) * 1000;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    metronomeInterval = setInterval(() => {
        if (indicator) {
            indicator.style.background = "var(--cyan)";
            indicator.style.boxShadow = "0 0 15px var(--cyan)";
            setTimeout(() => {
                indicator.style.background = "#060b14";
                indicator.style.boxShadow = "none";
            }, 100);
        }

        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } catch (e) {
            console.error(e);
        }
    }, intervalMs);
}

function loadCyberCoachAdvice() {
    const coachContainer = document.getElementById("cyberCoachBox");
    if (!coachContainer) return;

    const email = sessionStorage.getItem("loggedInUser");
    const currentPhysique = localStorage.getItem(`overloadfit_selected_physique_${email}`) || "Lean";

    const adviceMatrix = {
        Lean: "Prioritize multi-joint compounds first, then sustain strict 90s rest intervals to maximize metabolic output.",
        Bulk: "Mechanical tension is priority #1. Avoid missing required caloric surplus by pre-logging post-workout meals.",
        Powerlifting: "CNS potentiation requires full 3-5 minute recovery on Squat and Deadlift top sets. Never rush warmup ramp-ups.",
        Cutting: "Preserve lifting intensity while adjusting accessory volume if readiness check score drops below 60%.",
        Athletic: "Incorporate plyometric transitions directly prior to your compound strength sets to activate motor unit firing.",
        Endurance: "Maintain electrolyte hydration parity throughout training to prevent early intracellular cramping.",
        Maingain: "Micro-load 1.25kg plates systematically once 3 sets of top-end reps are fully completed.",
        Skinny: "Limit cardio expenditure prior to lifting; maximize intra-workout carb replenishment."
    };

    const advice = adviceMatrix[currentPhysique] || "Consistent progressive overload is the foundation of physical adaptation.";

    coachContainer.innerHTML = `
        <div style="display: flex; gap: 14px; align-items: flex-start;">
            <i class="bi bi-robot" style="font-size: 28px; color: var(--cyan); filter: drop-shadow(0 0 10px var(--cyan-glow));"></i>
            <div>
                <strong style="color: var(--cyan); font-family: var(--font-cyber); font-size: 14px; display: block; margin-bottom: 4px;">CYBER COACH INTEL [PROFILE: ${currentPhysique.toUpperCase()}]</strong>
                <p style="color: var(--text-secondary); font-size: 13.5px; margin: 0; line-height: 1.6;">${advice}</p>
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    loadCyberCoachAdvice();

    const wilksForm = document.getElementById("wilksForm");
    if (wilksForm) {
        wilksForm.addEventListener("submit", calculateWilksScore);
    }

    const muscleFilter = document.getElementById("wgerMuscleFilter");
    if (muscleFilter) {
        muscleFilter.addEventListener("change", (e) => fetchWgerExercisesByMuscle(e.target.value));
        fetchWgerExercisesByMuscle(muscleFilter.value || "4");
    }
});

window.fetchWgerExercisesByMuscle = fetchWgerExercisesByMuscle;
window.insertExerciseIntoWorkout = insertExerciseIntoWorkout;
window.quickAddFoodToDiary = quickAddFoodToDiary;
window.calculateWilksScore = calculateWilksScore;
window.toggleCyberMetronome = toggleCyberMetronome;