const BACKEND_URL = "http://localhost:5000";
const RAZORPAY_KEY_ID = "rzp_test_TOylEBNpycMl85";

function getCurrentLoggedEmail() {
    return sessionStorage.getItem("loggedInUser");
}

function getLocalUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveLocalUsers(usersList) {
    localStorage.setItem("users", JSON.stringify(usersList));
}

function activateProLocally(paymentId = "pay_test_success") {
    const email = getCurrentLoggedEmail();
    if (!email) {
        window.location.href = "login.html";
        return;
    }

    let users = getLocalUsers();
    users = users.map(u => {
        if (u.email === email) {
            return { ...u, isPro: true, proPaymentId: paymentId };
        }
        return u;
    });

    saveLocalUsers(users);
    document.documentElement.classList.add("pro-user-theme");
    document.body.classList.add("pro-user-theme");

    alert("🎉 Payment Successful! Welcome to OverloadFit PRO.");
    window.location.href = "dashboard.html";
}

function initiateProSubscription() {
    const email = getCurrentLoggedEmail();
    if (!email) {
        alert("Please log in to purchase OverloadFit Pro.");
        window.location.href = "login.html";
        return;
    }

    const users = getLocalUsers();
    const currentUser = users.find(u => u.email === email) || {};

    const proceedWithRazorpay = () => {
        if (typeof window.Razorpay === "undefined") {
            const fallbackConfirm = confirm("Razorpay checkout script blocked or unavailable.\n\nSimulate successful PRO payment now?");
            if (fallbackConfirm) activateProLocally("pay_simulated_success");
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: 49900,
            currency: "INR",
            name: "OverloadFit",
            description: "Pro Tier Monthly Membership",
            image: "assets/home.jpg",
            prefill: {
                name: currentUser.name || "Athlete",
                email: email,
                contact: currentUser.phone || "9999999999"
            },
            theme: {
                color: "#ff9900"
            },
            handler: function (response) {
                activateProLocally(response.razorpay_payment_id || "pay_rzp_live");
            },
            modal: {
                ondismiss: function () {
                    console.log("Checkout closed");
                }
            }
        };

        try {
            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function () {
                const retry = confirm("Payment failed or declined in test mode.\n\nActivate PRO test access directly?");
                if (retry) activateProLocally("pay_test_override");
            });
            rzp.open();
        } catch (err) {
            console.error("Razorpay Error:", err);
            const fallback = confirm("Could not connect to Razorpay test gateway.\n\nActivate PRO access now?");
            if (fallback) activateProLocally("pay_direct_override");
        }
    };

    if (window.Razorpay) {
        proceedWithRazorpay();
    } else {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = proceedWithRazorpay;
        script.onerror = () => {
            const fallback = confirm("Unable to load Razorpay library.\n\nActivate PRO access directly?");
            if (fallback) activateProLocally("pay_offline_fallback");
        };
        document.body.appendChild(script);
    }
}

function checkSubscriptionStatus() {
    const email = getCurrentLoggedEmail();
    if (!email) return;

    const users = getLocalUsers();
    const user = users.find(u => u.email === email);

    const badge = document.getElementById("userPlanBadge");
    const tierText = document.getElementById("accountTier");
    const subscribeBtn = document.getElementById("subscribeProBtn");
    const buyProMainBtn = document.getElementById("buyProMainBtn");

    if (user && user.isPro) {
        if (badge) {
            badge.innerText = "PRO MEMBER 🔥";
            badge.style.background = "rgba(255, 183, 3, 0.2)";
            badge.style.color = "#ffb703";
            badge.style.borderColor = "#ffb703";
        }
        if (tierText) {
            tierText.innerText = "Pro Athlete";
            tierText.style.color = "#ffb703";
        }
        if (subscribeBtn) {
            subscribeBtn.innerText = "Pro Plan Active";
            subscribeBtn.disabled = true;
            subscribeBtn.style.opacity = "0.7";
            subscribeBtn.style.cursor = "default";
            subscribeBtn.removeAttribute("onclick");
        }
        if (buyProMainBtn) {
            buyProMainBtn.innerText = "PRO Tier Activated";
            buyProMainBtn.disabled = true;
            buyProMainBtn.style.opacity = "0.7";
            buyProMainBtn.style.cursor = "default";
            buyProMainBtn.removeAttribute("onclick");
        }
    }
}

function loadMeasurements() {
    const email = getCurrentLoggedEmail();
    if (!email) return;

    const data = JSON.parse(localStorage.getItem(`measurements_${email}`)) || {};
    const w = document.getElementById("mScaleWeight");
    const waist = document.getElementById("mWaist");
    const chest = document.getElementById("mChest");
    const arms = document.getElementById("mArms");
    const thighs = document.getElementById("mThighs");

    if (w) w.innerText = data.weight ? `${data.weight} kg` : "-- kg";
    if (waist) waist.innerText = data.waist ? `${data.waist} cm` : "-- cm";
    if (chest) chest.innerText = data.chest ? `${data.chest} cm` : "-- cm";
    if (arms) arms.innerText = data.arms ? `${data.arms} cm` : "-- cm";
    if (thighs) thighs.innerText = data.thighs ? `${data.thighs} cm` : "-- cm";
}

function openMeasurementModal() {
    const email = getCurrentLoggedEmail();
    const modal = document.getElementById("measurementModal");
    if (!modal || !email) return;

    const data = JSON.parse(localStorage.getItem(`measurements_${email}`)) || {};
    if (document.getElementById("inputScaleWeight")) document.getElementById("inputScaleWeight").value = data.weight || "";
    if (document.getElementById("inputWaist")) document.getElementById("inputWaist").value = data.waist || "";
    if (document.getElementById("inputChest")) document.getElementById("inputChest").value = data.chest || "";
    if (document.getElementById("inputArms")) document.getElementById("inputArms").value = data.arms || "";
    if (document.getElementById("inputThighs")) document.getElementById("inputThighs").value = data.thighs || "";

    modal.style.display = "flex";
}

function closeMeasurementModal() {
    const modal = document.getElementById("measurementModal");
    if (modal) modal.style.display = "none";
}

function handleMeasurementSubmit(event) {
    event.preventDefault();
    const email = getCurrentLoggedEmail();
    if (!email) return;

    const measurements = {
        weight: document.getElementById("inputScaleWeight").value,
        waist: document.getElementById("inputWaist").value,
        chest: document.getElementById("inputChest").value,
        arms: document.getElementById("inputArms").value,
        thighs: document.getElementById("inputThighs").value,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`measurements_${email}`, JSON.stringify(measurements));
    loadMeasurements();
    closeMeasurementModal();
}

function loadProfile() {
    const email = getCurrentLoggedEmail();
    if (!email) return;

    const users = getLocalUsers();
    const user = users.find(u => u.email === email) || {};
    const activePhysique = localStorage.getItem(`overloadfit_selected_physique_${email}`) || user.physique || "Lean";

    const nameBox = document.getElementById("profileName");
    const emailBox = document.getElementById("profileEmail");
    const ageBox = document.getElementById("profileAge");
    const phoneBox = document.getElementById("profilePhone");
    const dobBox = document.getElementById("profileDOB");
    const physiqueBox = document.getElementById("profilePhysique");
    const workoutBox = document.getElementById("profileWorkout");
    const levelBox = document.getElementById("fitnessLevel");
    const metricsContainer = document.getElementById("profileMetrics");

    if (nameBox) nameBox.innerText = user.name || "None";
    if (emailBox) emailBox.innerText = user.email || "None";
    if (ageBox) ageBox.innerText = user.age || "None";
    if (phoneBox) phoneBox.innerText = user.phone || "None";
    if (dobBox) dobBox.innerText = user.dob || "None";
    if (physiqueBox) physiqueBox.innerText = activePhysique || "None";

    const workouts = (user.workoutHistory || []).filter(w => !w.physique || w.physique === activePhysique);
    if (workoutBox) workoutBox.innerText = workouts.length;

    if (levelBox) {
        if (workouts.length < 10) levelBox.innerText = "Beginner";
        else if (workouts.length < 30) levelBox.innerText = "Intermediate";
        else levelBox.innerText = "Advanced";
    }

    const badges = document.querySelectorAll(".badges-grid .badge-item");
    badges.forEach((b, i) => {
        if (i === 0) b.classList.add("active");
        else if (i === 1) workouts.length >= 1 ? b.classList.add("active") : b.classList.remove("active");
        else if (i === 2) workouts.length >= 10 ? b.classList.add("active") : b.classList.remove("active");
    });

    checkSubscriptionStatus();
    loadMeasurements();

    if (metricsContainer) {
        const questionsMap = {
            Lean: ["Current body fat percentage?", "Main goal?", "Workout experience?"],
            Bulk: ["Current weight?", "Daily calorie intake?", "Gym experience level?"],
            Skinny: ["Current weight?", "Weight gain target?", "Daily meal frequency?"],
            Athletic: ["Favorite sport?", "Performance goal?", "Training frequency?"],
            Cutting: ["Target body fat %?", "Caloric deficit limit?", "Preferred cardio type?"],
            Maingain: ["Maintenance calorie intake?", "Current lifting totals?", "Prior target progression rate?"],
            Powerlifting: ["Current 1RM Squat?", "Current 1RM Bench?", "Current 1RM Deadlift?"],
            Endurance: ["Target weekly distance?", "Current VO2 Max / Zone 2 pace?", "Primary endurance focus?"]
        };

        const key = `overloadfit_answers_${email}_${activePhysique}`;
        const savedAnswers = JSON.parse(localStorage.getItem(key)) || {};
        const questions = questionsMap[activePhysique] || [];

        metricsContainer.innerHTML = "";
        if (questions.length === 0) {
            metricsContainer.innerHTML = `<p style="color: var(--text-secondary);">No metrics configured.</p>`;
        } else {
            questions.forEach((q, idx) => {
                const ans = savedAnswers[`answer${idx}`] || savedAnswers[q] || "None";
                const item = document.createElement("div");
                item.className = "question-box";
                item.innerHTML = `
                    <label style="display: block; color: var(--text-secondary); font-size: 14px; margin-bottom: 5px;">${q}</label>
                    <p style="color: var(--cyan); font-size: 16px; font-weight: 600; margin: 0;">${ans}</p>
                `;
                metricsContainer.appendChild(item);
            });
        }
    }
}

function uploadProfileImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;
        const email = getCurrentLoggedEmail() || "guest";
        localStorage.setItem(`overloadfit_avatar_${email}`, base64Image);
        renderProfileImage(base64Image);
    };
    reader.readAsDataURL(file);
}

function loadProfileImage() {
    const email = getCurrentLoggedEmail() || "guest";
    const savedImage = localStorage.getItem(`overloadfit_avatar_${email}`);
    if (savedImage) renderProfileImage(savedImage);
}

function renderProfileImage(src) {
    const avatarIcon = document.getElementById("avatarIcon");
    const avatarImg = document.getElementById("avatarImg");
    if (avatarImg && avatarIcon) {
        avatarImg.src = src;
        avatarImg.style.display = "block";
        avatarIcon.style.display = "none";
    }
}

function openEditModal() {
    const email = getCurrentLoggedEmail();
    const modal = document.getElementById("editModal");
    if (!modal || !email) return;

    const users = getLocalUsers();
    const user = users.find(u => u.email === email) || {};

    document.getElementById("editName").value = user.name || "";
    document.getElementById("editAge").value = user.age || "";
    document.getElementById("editPhone").value = user.phone || "";
    document.getElementById("editDOB").value = user.dob || "";

    modal.style.display = "flex";
}

function closeEditModal() {
    const modal = document.getElementById("editModal");
    if (modal) modal.style.display = "none";
}

function handleProfileUpdate(event) {
    event.preventDefault();
    const email = getCurrentLoggedEmail();
    if (!email) return;

    let users = getLocalUsers();
    users = users.map(u => {
        if (u.email === email) {
            return {
                ...u,
                name: document.getElementById("editName").value.trim(),
                age: document.getElementById("editAge").value.trim(),
                phone: document.getElementById("editPhone").value.trim(),
                dob: document.getElementById("editDOB").value.trim()
            };
        }
        return u;
    });

    saveLocalUsers(users);
    loadProfile();
    closeEditModal();
}

function exportUserDataJSON() {
    const email = getCurrentLoggedEmail();
    if (!email) return;

    const users = getLocalUsers();
    const user = users.find(u => u.email === email) || {};
    const activePhysique = localStorage.getItem(`overloadfit_selected_physique_${email}`) || user.physique || "Lean";

    const exportData = {
        profile: user,
        measurements: JSON.parse(localStorage.getItem(`measurements_${email}`)) || {},
        metrics: JSON.parse(localStorage.getItem(`overloadfit_answers_${email}_${activePhysique}`)) || {},
        exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `overloadfit_profile_${user.name || "user"}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function resetLocalData() {
    if (confirm("Are you sure you want to clear your local session and profile data? You will be logged out.")) {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "login.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    loadProfileImage();
});

window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.handleProfileUpdate = handleProfileUpdate;
window.uploadProfileImage = uploadProfileImage;
window.exportUserDataJSON = exportUserDataJSON;
window.resetLocalData = resetLocalData;
window.initiateProSubscription = initiateProSubscription;
window.openMeasurementModal = openMeasurementModal;
window.closeMeasurementModal = closeMeasurementModal;
window.handleMeasurementSubmit = handleMeasurementSubmit;