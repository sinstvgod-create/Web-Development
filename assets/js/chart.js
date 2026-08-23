if (!sessionStorage.getItem("loggedInUser")) {
    window.location.href = "login.html";
}

const email = sessionStorage.getItem("loggedInUser");
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = users.find(user => user.email === email);

if (!currentUser) {
    window.location.href = "login.html";
}

let volumeChartInstance = null;
let strengthChartInstance = null;
let muscleRadarChartInstance = null;
let frequencyChartInstance = null;
let intensityChartInstance = null;
let loadChartInstance = null;
let activeTimeframe = "all";

function getActivePhysiqueWorkouts() {
    users = JSON.parse(localStorage.getItem("users")) || [];
    currentUser = users.find(u => u.email === email) || currentUser;

    const activePhysique = typeof getSelectedPhysique === "function" 
        ? getSelectedPhysique() 
        : (localStorage.getItem(`overloadfit_selected_physique_${email}`) || currentUser.physique || "Lean");

    const history = currentUser.workoutHistory || [];
    return history.filter(w => !w.physique || w.physique === activePhysique);
}

function filterWorkoutsByTimeframe(workouts) {
    if (activeTimeframe === "all") return workouts;

    const now = new Date();
    return workouts.filter(w => {
        const itemDate = new Date(w.date);
        if (isNaN(itemDate)) return true;

        if (activeTimeframe === "month") {
            return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
        } else if (activeTimeframe === "week") {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return itemDate >= oneWeekAgo;
        }
        return true;
    });
}

function calculateEstimated1RM(weight, reps) {
    const w = parseFloat(weight) || 0;
    const r = parseFloat(reps) || 0;
    if (w <= 0 || r <= 0) return 0;
    if (r === 1) return w;
    return Math.round(w * (1 + r / 30));
}

function computeStreak(workouts) {
    if (!workouts || workouts.length === 0) return 0;

    const uniqueDates = [...new Set(workouts.map(w => new Date(w.date).toDateString()))]
        .map(d => new Date(d))
        .sort((a, b) => b - a);

    if (uniqueDates.length === 0) return 0;

    let streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const diffTime = Math.abs(uniqueDates[i] - uniqueDates[i + 1]);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function updateOverviewStats(workouts) {
    const statTotalWorkouts = document.getElementById("statTotalWorkouts");
    const statMax1RM = document.getElementById("statMax1RM");
    const statTotalVolume = document.getElementById("statTotalVolume");
    const statStreak = document.getElementById("statStreak");

    let totalVolume = 0;
    let max1RM = 0;

    workouts.forEach(w => {
        const s = parseFloat(w.sets) || 0;
        const r = parseFloat(w.reps) || 0;
        const wt = parseFloat(w.weight) || 0;
        totalVolume += s * r * wt;

        const est1RM = calculateEstimated1RM(wt, r);
        if (est1RM > max1RM) max1RM = est1RM;
    });

    if (statTotalWorkouts) statTotalWorkouts.innerText = workouts.length;
    if (statMax1RM) statMax1RM.innerText = `${max1RM} KG`;
    if (statTotalVolume) statTotalVolume.innerText = `${totalVolume.toLocaleString()} KG`;
    if (statStreak) statStreak.innerText = `${computeStreak(workouts)} Days`;
}

function renderProgressTable(workouts) {
    const tbody = document.getElementById("progressTableBody");
    if (!tbody) return;

    if (!workouts || workouts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-table">No performance logs found for this filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = [...workouts].reverse().map(w => {
        const s = parseFloat(w.sets) || 0;
        const r = parseFloat(w.reps) || 0;
        const wt = parseFloat(w.weight) || 0;
        const vol = s * r * wt;
        const est1RM = calculateEstimated1RM(wt, r);

        return `
            <tr>
                <td>${w.date || "Recent"}</td>
                <td style="color: #fff; font-weight: 600;">${w.exercise}</td>
                <td>${s} × ${r}</td>
                <td>${wt} kg</td>
                <td style="color: var(--cyan); font-weight: 600;">${vol.toLocaleString()} kg</td>
                <td style="color: #00e676; font-weight: 600;">${est1RM} kg</td>
            </tr>
        `;
    }).join("");
}

function renderAllCharts(workouts) {
    const isPro = currentUser && currentUser.isPro;
    const accentColor = isPro ? "#ff9900" : "#00f0ff";
    const accentGlow = isPro ? "rgba(255, 153, 0, 0.25)" : "rgba(0, 240, 255, 0.25)";

    const labels = workouts.map((w, idx) => {
        if (!w.date) return `#${idx + 1}`;
        const d = new Date(w.date);
        return isNaN(d) ? `#${idx + 1}` : `${d.getMonth() + 1}/${d.getDate()}`;
    });

    const volumeData = workouts.map(w => {
        const s = parseFloat(w.sets) || 0;
        const r = parseFloat(w.reps) || 0;
        const wt = parseFloat(w.weight) || 0;
        return s * r * wt;
    });

    const strengthData = workouts.map(w => {
        const wt = parseFloat(w.weight) || 0;
        const r = parseFloat(w.reps) || 0;
        return calculateEstimated1RM(wt, r);
    });

    const setsData = workouts.map(w => parseFloat(w.sets) || 0);
    const repsData = workouts.map(w => parseFloat(w.reps) || 0);
    const weightData = workouts.map(w => parseFloat(w.weight) || 0);

    const muscleMap = { Chest: 0, Back: 0, Legs: 0, Shoulders: 0, Arms: 0, Core: 0 };
    workouts.forEach(w => {
        const s = parseFloat(w.sets) || 0;
        const ex = (w.exercise || "").toLowerCase();
        if (ex.includes("bench") || ex.includes("fly") || ex.includes("push up") || ex.includes("dip")) muscleMap.Chest += s;
        else if (ex.includes("deadlift") || ex.includes("row") || ex.includes("pulldown") || ex.includes("pull up")) muscleMap.Back += s;
        else if (ex.includes("squat") || (ex.includes("press") && ex.includes("leg")) || ex.includes("lunge") || (ex.includes("curl") && ex.includes("leg"))) muscleMap.Legs += s;
        else if (ex.includes("shoulder") || ex.includes("lateral") || ex.includes("front raise") || ex.includes("military")) muscleMap.Shoulders += s;
        else if (ex.includes("bicep") || ex.includes("tricep") || ex.includes("curl") || ex.includes("skull")) muscleMap.Arms += s;
        else muscleMap.Core += s;
    });

    const volCtx = document.getElementById("volumeChart")?.getContext("2d");
    if (volCtx) {
        if (volumeChartInstance) volumeChartInstance.destroy();
        volumeChartInstance = new Chart(volCtx, {
            type: "line",
            data: {
                labels: labels.length > 0 ? labels : ["No Data"],
                datasets: [{
                    label: "Total Volume (KG)",
                    data: volumeData.length > 0 ? volumeData : [0],
                    borderColor: accentColor,
                    backgroundColor: accentGlow,
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2,
                    pointBackgroundColor: accentColor,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" } },
                    y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" } }
                }
            }
        });
    }

    const strCtx = document.getElementById("strengthChart")?.getContext("2d");
    if (strCtx) {
        if (strengthChartInstance) strengthChartInstance.destroy();
        strengthChartInstance = new Chart(strCtx, {
            type: "line",
            data: {
                labels: labels.length > 0 ? labels : ["No Data"],
                datasets: [{
                    label: "Est. 1RM (KG)",
                    data: strengthData.length > 0 ? strengthData : [0],
                    borderColor: "#00e676",
                    backgroundColor: "rgba(0, 230, 118, 0.2)",
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2,
                    pointBackgroundColor: "#00e676",
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" } },
                    y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" } }
                }
            }
        });
    }

    const radarCtx = document.getElementById("muscleRadarChart")?.getContext("2d");
    if (radarCtx) {
        if (muscleRadarChartInstance) muscleRadarChartInstance.destroy();
        muscleRadarChartInstance = new Chart(radarCtx, {
            type: "doughnut",
            data: {
                labels: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"],
                datasets: [{
                    data: Object.values(muscleMap).some(v => v > 0) ? Object.values(muscleMap) : [1, 1, 1, 1, 1, 1],
                    backgroundColor: [
                        accentColor,
                        "#00e676",
                        "#9d00ff",
                        "#ff0055",
                        "#0066ff",
                        "#ffd700"
                    ],
                    borderWidth: 1,
                    borderColor: "#060b14"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: { color: "#e0e0e0", font: { family: "Poppins", size: 11 } }
                    }
                }
            }
        });
    }

    const freqCtx = document.getElementById("frequencyChart")?.getContext("2d");
    if (freqCtx) {
        if (frequencyChartInstance) frequencyChartInstance.destroy();
        frequencyChartInstance = new Chart(freqCtx, {
            type: "bar",
            data: {
                labels: labels.length > 0 ? labels : ["No Data"],
                datasets: [{
                    label: "Sets Logged",
                    data: setsData.length > 0 ? setsData : [0],
                    backgroundColor: "rgba(157, 0, 255, 0.45)",
                    borderColor: "#9d00ff",
                    borderWidth: 1.5,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" } },
                    y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" } }
                }
            }
        });
    }

    const intCtx = document.getElementById("intensityChart")?.getContext("2d");
    if (intCtx) {
        if (intensityChartInstance) intensityChartInstance.destroy();
        intensityChartInstance = new Chart(intCtx, {
            type: "line",
            data: {
                labels: labels.length > 0 ? labels : ["No Data"],
                datasets: [{
                    label: "Completed Reps",
                    data: repsData.length > 0 ? repsData : [0],
                    borderColor: "#ff0055",
                    backgroundColor: "rgba(255, 0, 85, 0.2)",
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2,
                    pointBackgroundColor: "#ff0055",
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" } },
                    y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" } }
                }
            }
        });
    }

    const loadCtx = document.getElementById("loadChart")?.getContext("2d");
    if (loadCtx) {
        if (loadChartInstance) loadChartInstance.destroy();
        loadChartInstance = new Chart(loadCtx, {
            type: "line",
            data: {
                labels: labels.length > 0 ? labels : ["No Data"],
                datasets: [{
                    label: "Working Load (KG)",
                    data: weightData.length > 0 ? weightData : [0],
                    borderColor: "#00f0ff",
                    backgroundColor: "rgba(0, 240, 255, 0.18)",
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2,
                    pointBackgroundColor: "#00f0ff",
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" } },
                    y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" } }
                }
            }
        });
    }
}

function refreshAnalytics() {
    const rawWorkouts = getActivePhysiqueWorkouts();
    const filteredWorkouts = filterWorkoutsByTimeframe(rawWorkouts);
    updateOverviewStats(filteredWorkouts);
    renderProgressTable(filteredWorkouts);
    renderAllCharts(filteredWorkouts);
}

function setTimeframe(tf) {
    activeTimeframe = tf;
    document.querySelectorAll(".timeframe-buttons .time-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("onclick").includes(`'${tf}'`)) {
            btn.classList.add("active");
        }
    });
    refreshAnalytics();
}

function exportWorkoutDataCSV() {
    const workouts = getActivePhysiqueWorkouts();
    if (workouts.length === 0) {
        alert("No workout data available to export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Date,Exercise,Sets,Reps,Weight_KG,Total_Volume_KG,Estimated_1RM_KG,Notes\n";

    workouts.forEach(w => {
        const s = parseFloat(w.sets) || 0;
        const r = parseFloat(w.reps) || 0;
        const wt = parseFloat(w.weight) || 0;
        const vol = s * r * wt;
        const est1RM = calculateEstimated1RM(wt, r);
        const notes = (w.notes || "").replace(/,/g, ";");

        csvContent += `${w.date || ""},${w.exercise || ""},${s},${r},${wt},${vol},${est1RM},"${notes}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `overloadfit_progress_${currentUser.name || "user"}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

document.addEventListener("DOMContentLoaded", refreshAnalytics);

window.setTimeframe = setTimeframe;
window.exportWorkoutDataCSV = exportWorkoutDataCSV;