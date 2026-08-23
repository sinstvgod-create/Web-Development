(function applyProTheme() {
    const loggedEmail = sessionStorage.getItem("loggedInUser");
    if (!loggedEmail) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === loggedEmail);

    if (user && user.isPro) {
        document.documentElement.classList.add("pro-user-theme");
        document.addEventListener("DOMContentLoaded", () => {
            document.body.classList.add("pro-user-theme");
        });
    }
})();

const protectedPages = [
    "dashboard.html",
    "workout.html",
    "diet.html",
    "progress.html",
    "profile.html",
    "pro.html"
];

let currentPage = window.location.pathname.split("/").pop() || "index.html";

if (protectedPages.includes(currentPage)) {
    if (!sessionStorage.getItem("loggedInUser")) {
        window.location.href = "login.html";
    }
}

function getCurrentUser() {
    let email = sessionStorage.getItem("loggedInUser");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(user => user.email === email);
}

window.getCurrentUser = getCurrentUser;

if (currentPage === "diet.html") {
    const user = getCurrentUser();
    if (!user || !user.isPro) {
        window.location.href = "pro.html";
    }
}

function logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

window.logout = logout;

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.classList.add("hide");
        }, 800);
    }
});

function getSelectedPhysique() {
    let email = sessionStorage.getItem("loggedInUser") || "guest";
    let key = `overloadfit_selected_physique_${email}`;
    return localStorage.getItem(key) || "Lean";
}

function setSelectedPhysique(physique) {
    let email = sessionStorage.getItem("loggedInUser") || "guest";
    let key = `overloadfit_selected_physique_${email}`;
    localStorage.setItem(key, physique);
}

window.getSelectedPhysique = getSelectedPhysique;
window.setSelectedPhysique = setSelectedPhysique;

function getWorkoutsForPhysique(physique) {
    let email = sessionStorage.getItem("loggedInUser") || "guest";
    let targetPhysique = physique || getSelectedPhysique();
    let key = `overloadfit_workouts_${email}_${targetPhysique}`;
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveWorkoutsForPhysique(workouts, physique) {
    let email = sessionStorage.getItem("loggedInUser") || "guest";
    let targetPhysique = physique || getSelectedPhysique();
    let key = `overloadfit_workouts_${email}_${targetPhysique}`;
    localStorage.setItem(key, JSON.stringify(workouts));
}

window.getWorkoutsForPhysique = getWorkoutsForPhysique;
window.saveWorkoutsForPhysique = saveWorkoutsForPhysique;

function displayUserName() {
    let user = getCurrentUser();
    let nameElement = document.getElementById("userName");
    if (nameElement && user) {
        nameElement.innerText = user.name;
    }

    let physiqueDisplay = document.getElementById("currentPhysiqueDisplay");
    if (physiqueDisplay) {
        physiqueDisplay.innerText = getSelectedPhysique();
    }
}

displayUserName();

const localExerciseDatabase = [
    { name: "Barbell Bench Press", category: "Chest" },
    { name: "Incline Dumbbell Press", category: "Chest" },
    { name: "Chest Flyes", category: "Chest" },
    { name: "Push Ups", category: "Chest" },
    { name: "Bicep Barbell Curl", category: "Arms" },
    { name: "Dumbbell Hammer Curl", category: "Arms" },
    { name: "Preacher Curl", category: "Arms" },
    { name: "Tricep Pushdown", category: "Arms" },
    { name: "Skull Crushers", category: "Arms" },
    { name: "Barbell Back Squat", category: "Legs" },
    { name: "Leg Press", category: "Legs" },
    { name: "Romanian Deadlift", category: "Legs" },
    { name: "Leg Extension", category: "Legs" },
    { name: "Standing Calf Raise", category: "Legs" },
    { name: "Conventional Deadlift", category: "Back" },
    { name: "Lat Pulldown", category: "Back" },
    { name: "Bent Over Barbell Row", category: "Back" },
    { name: "Seated Cable Row", category: "Back" },
    { name: "Overhead Shoulder Press", category: "Shoulders" },
    { name: "Dumbbell Lateral Raise", category: "Shoulders" },
    { name: "Rear Delt Fly", category: "Shoulders" },
    { name: "Hanging Leg Raise", category: "Core" },
    { name: "Plank Hold", category: "Core" },
    { name: "Ab Wheel Rollout", category: "Core" }
];

const fetchExercisesAPI = async (query) => {
    const resultsContainer = document.getElementById("exerciseResults");
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `<p style="color: #00aaff;"><i class="bi bi-arrow-repeat spin"></i> Searching exercises...</p>`;

    let exercisesToDisplay = [];

    try {
        const response = await fetch(`https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(query)}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data.suggestions && data.suggestions.length > 0) {
                exercisesToDisplay = data.suggestions.slice(0, 6).map(item => ({
                    name: item.value,
                    category: item.data.category || 'Strength Training'
                }));
            }
        }
    } catch (err) {
        console.warn("External API offline. Switching to local database.", err);
    }

    if (exercisesToDisplay.length === 0) {
        exercisesToDisplay = localExerciseDatabase.filter(ex =>
            ex.name.toLowerCase().includes(query.toLowerCase()) ||
            ex.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6);
    }

    if (exercisesToDisplay.length > 0) {
        resultsContainer.innerHTML = exercisesToDisplay.map(item => `
            <div style="background: rgba(13, 19, 29, 0.85); padding: 18px; border-radius: 12px; border: 1px solid rgba(0,170,255,0.2); margin-top: 10px;">
                <h4 style="color: #00aaff; font-family: 'Orbitron'; font-size: 1rem; margin-bottom: 8px;">${item.name}</h4>
                <p style="color: #b5b5b5; font-size: 0.85rem;">Category: ${item.category}</p>
            </div>
        `).join("");
    } else {
        resultsContainer.innerHTML = `<p style="color: #a0a0a0; margin-top: 10px;">No exercises found for "${query}". Try searching "Curl", "Press", or "Squat".</p>`;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUser();
    const isPro = user && user.isPro;

    if (!isPro) {
        document.querySelectorAll(".pro-locked-feature").forEach(el => {
            const badge = el.querySelector(".pro-lock-badge");
            if (badge) {
                badge.style.display = "inline-flex";
                badge.style.alignItems = "center";
                badge.style.gap = "4px";
                badge.style.padding = "3px 10px";
                badge.style.background = "rgba(255, 153, 0, 0.15)";
                badge.style.color = "#ff9900";
                badge.style.border = "1px solid #ff9900";
                badge.style.borderRadius = "20px";
                badge.style.fontSize = "11px";
                badge.style.fontWeight = "700";
            }
        });
    }

    document.querySelectorAll("a[href='diet.html']").forEach(link => {
        link.addEventListener("click", (e) => {
            if (!isPro) {
                e.preventDefault();
                window.location.href = "pro.html";
            }
        });
    });

    const searchForm = document.getElementById("exerciseSearchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = document.getElementById("exerciseQuery").value.trim();
            if (query) fetchExercisesAPI(query);
        });
    }

    const navLinks = document.querySelectorAll(".nav-actions a, .nav-links a");
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (currentPage === "" || currentPage === "index.html") {
            if (href === "index.html" || href === "./") {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        } else {
            if (href === currentPage) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        }
    });

    const logoLink = document.getElementById("logoLink");
    if (logoLink) {
        logoLink.addEventListener("click", (e) => {
            e.preventDefault();
            const loggedInUser = sessionStorage.getItem("loggedInUser");
            if (loggedInUser && loggedInUser !== "null" && loggedInUser !== "") {
                window.location.href = "index.html";
            } else {
                window.location.href = "login.html";
            }
        });
    }

    const elementsToAnimate = document.querySelectorAll(
        ".profile-card, .feature-card, .about-card, .stat-box, .stat-card, .dashboard-card, .physique-card, .workout-card, .macro-card, .meal-card, .chart-card, .team-card, .target-card, .heading, .about-hero-content, .features-hero, .pricing-card, .perk-card"
    );

    elementsToAnimate.forEach((el) => {
        el.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
});