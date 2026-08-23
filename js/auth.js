let users = JSON.parse(localStorage.getItem("users")) || [];

function updateNavbarAuthUI() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    const navDashboardLink = document.getElementById("nav-dashboard-link");
    const navLoginBtn = document.getElementById("nav-login-btn");
    const navRegisterBtn = document.getElementById("nav-register-btn");
    const heroLoginBtn = document.querySelector(".hero-buttons a[href='login.html']");
    const heroRegisterBtn = document.querySelector(".hero-buttons a[href='register.html']");
    const loggedInLinks = document.querySelectorAll(".logged-in-link");
    const staticLogoutBtns = document.querySelectorAll(".logout-btn, #nav-static-logout-btn");

    if (loggedInUser) {
        if (navLoginBtn) navLoginBtn.style.setProperty("display", "none", "important");
        if (navRegisterBtn) navRegisterBtn.style.setProperty("display", "none", "important");

        document.querySelectorAll("nav a, .nav-actions a, .nav-links a").forEach(el => {
            const href = el.getAttribute("href") || "";
            if (href.includes("register.html") || href.includes("login.html") || el.classList.contains("register-btn")) {
                el.style.setProperty("display", "none", "important");
            }
        });

        if (heroLoginBtn) heroLoginBtn.style.display = "none";
        if (heroRegisterBtn) {
            heroRegisterBtn.href = "dashboard.html";
            heroRegisterBtn.innerHTML = '<i class="bi bi-grid-fill"></i> Go to Dashboard';
        }
        if (navDashboardLink) navDashboardLink.style.setProperty("display", "inline-flex", "important");

        loggedInLinks.forEach(link => {
            link.style.setProperty("display", "inline-flex", "important");
        });

        staticLogoutBtns.forEach(btn => {
            btn.style.setProperty("display", "inline-flex", "important");
        });
    } else {
        if (navLoginBtn) navLoginBtn.style.setProperty("display", "inline-flex", "important");
        if (navRegisterBtn) navRegisterBtn.style.setProperty("display", "inline-flex", "important");
        if (heroLoginBtn) heroLoginBtn.style.display = "inline-flex";
        if (navDashboardLink) navDashboardLink.style.setProperty("display", "none", "important");

        loggedInLinks.forEach(link => {
            link.style.setProperty("display", "none", "important");
        });

        staticLogoutBtns.forEach(btn => {
            btn.style.setProperty("display", "none", "important");
        });
    }
}

updateNavbarAuthUI();
document.addEventListener("DOMContentLoaded", updateNavbarAuthUI);
window.addEventListener("load", updateNavbarAuthUI);

const logoLink = document.getElementById("logoLink");
if (logoLink) {
    logoLink.addEventListener("click", (e) => {
        e.preventDefault();
        const loggedInUser = sessionStorage.getItem("loggedInUser");
        window.location.href = loggedInUser ? "index.html" : "login.html";
    });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const nameInput = document.getElementById("name");
        const ageInput = document.getElementById("age");
        const phoneInput = document.getElementById("phone");
        const genderInput = document.getElementById("gender");
        const dobInput = document.getElementById("dob");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const terms = document.getElementById("registerTerms");
        const message = document.getElementById("registerMessage");

        const nameError = document.getElementById("nameError");
        const ageError = document.getElementById("ageError");
        const phoneError = document.getElementById("phoneError");
        const genderError = document.getElementById("genderError");
        const dobError = document.getElementById("dobError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");

        const clearErrors = () => {
            [nameError, ageError, phoneError, genderError, dobError, emailError, passwordError].forEach(err => {
                if (err) {
                    err.innerText = "";
                    err.style.display = "none";
                }
            });
            if (message) message.innerText = "";
        };

        clearErrors();

        let name = nameInput ? nameInput.value.trim() : "";
        let age = ageInput ? ageInput.value : "";
        let phone = phoneInput ? phoneInput.value.trim() : "";
        let gender = genderInput ? genderInput.value : "";
        let dob = dobInput ? dobInput.value : "";
        let email = emailInput ? emailInput.value.trim() : "";
        let password = passwordInput ? passwordInput.value : "";

        let isValid = true;

        if (!name) {
            if (nameError) { nameError.innerText = "Name is required"; nameError.style.display = "block"; }
            isValid = false;
        }

        if (!age || age < 10 || age > 120) {
            if (ageError) { ageError.innerText = "Enter valid age (10-120)"; ageError.style.display = "block"; }
            isValid = false;
        }

        if (phone.length !== 10 || isNaN(phone)) {
            if (phoneError) { phoneError.innerText = "Phone number must be 10 digits"; phoneError.style.display = "block"; }
            isValid = false;
        }

        if (!gender) {
            if (genderError) { genderError.innerText = "Please select gender"; genderError.style.display = "block"; }
            isValid = false;
        }

        if (!dob) {
            if (dobError) { dobError.innerText = "Date of birth is required"; dobError.style.display = "block"; }
            isValid = false;
        }

        if (!email || !email.includes("@")) {
            if (emailError) { emailError.innerText = "Enter a valid email address"; emailError.style.display = "block"; }
            isValid = false;
        }

        if (password.length < 6) {
            if (passwordError) { passwordError.innerText = "Password must contain minimum 6 characters"; passwordError.style.display = "block"; }
            isValid = false;
        }

        if (terms && !terms.checked) {
            if (message) {
                message.innerText = "You must agree to the Terms and Conditions";
                message.style.color = "#ff5252";
            }
            isValid = false;
        }

        if (!isValid) return;

        users = JSON.parse(localStorage.getItem("users")) || [];
        let existingUser = users.find(user => user.email === email);

        if (existingUser) {
            if (emailError) { emailError.innerText = "Account already exists"; emailError.style.display = "block"; }
            if (message) {
                message.innerText = "Account already exists";
                message.style.color = "#ff5252";
            }
            return;
        }

        let newUser = {
            name: name,
            age: age,
            phone: phone,
            gender: gender,
            dob: dob,
            email: email,
            password: password,
            physique: "",
            workoutHistory: [],
            dietPlan: {}
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        if (message) {
            message.innerText = "Account Created Successfully";
            message.style.color = "#00f0ff";
        }

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
    });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");
        const terms = document.getElementById("loginTerms");
        const message = document.getElementById("loginMessage");

        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");

        if (emailError) { emailError.innerText = ""; emailError.style.display = "none"; }
        if (passwordError) { passwordError.innerText = ""; passwordError.style.display = "none"; }
        if (message) message.innerText = "";

        let email = emailInput ? emailInput.value.trim() : "";
        let password = passwordInput ? passwordInput.value : "";

        let isValid = true;

        if (!email) {
            if (emailError) { emailError.innerText = "Email is required"; emailError.style.display = "block"; }
            isValid = false;
        }

        if (!password) {
            if (passwordError) { passwordError.innerText = "Password is required"; passwordError.style.display = "block"; }
            isValid = false;
        }

        if (terms && !terms.checked) {
            if (message) {
                message.innerText = "You must agree to the Terms and Conditions";
                message.style.color = "#ff5252";
            }
            isValid = false;
        }

        if (!isValid) return;

        users = JSON.parse(localStorage.getItem("users")) || [];
        let user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            if (message) {
                message.innerText = "Invalid email or password";
                message.style.color = "#ff5252";
            }
            return;
        }

        sessionStorage.setItem("loggedInUser", email);

        if (message) {
            message.innerText = "Login Successful";
            message.style.color = "#00f0ff";
        }

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);
    });
}

function logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

window.logout = logout;
window.updateNavbarAuthUI = updateNavbarAuthUI;