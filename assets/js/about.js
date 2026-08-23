const teamData = {
    member1: {
        name: "Kunal Yadav",
        role: "Leader",
        image: "assets/member1.jpg",
        bio: "Dynamic technical lead focused on robust software architecture, core product development, and turning ambitious concepts into efficient, functional systems.",
        linkedin: "https://www.linkedin.com/in/kunal-yadav-3b680b234",
        github: "https://github.com/Kunal6637"
    },
    member2: {
        name: "Samarvir Singh Sidhu",
        role: "Project Designer",
        image: "assets/member2.jpg",
        bio: "Innovation-driven Project Designer with over 2 years of experience in concept development and design optimization. Focuses on iterative prototyping, interface architecture, and custom design solutions tailored for scalability and project execution.",
        linkedin: "https://www.linkedin.com/in/samarvir-singh-sidhu-7a8b69326",
        github: "https://github.com/SidhuSamar-lab"
    },
    member3: {
        name: "Mridul Chauhan",
        role: "Project Creator",
        image: "assets/member3.jpg",
        bio: "Dynamic Project Creator specializing in concept translation, iterative prototyping, and solution architecture. Focuses on practical engineering strategies that support scalable builds, feature optimization, and long-term viability.",
        linkedin: "https://www.linkedin.com/in/mridul-chauhan-b57240311",
        github: "https://github.com/sinstvgod-create"
    }
};

const showMemberDetails = (memberId) => {
    const data = teamData[memberId];
    if (!data) return;

    const { name, role, image, bio, linkedin, github } = data;

    const imgEl = document.getElementById("modalImage");
    const nameEl = document.getElementById("modalName");
    const roleEl = document.getElementById("modalRole");
    const bioEl = document.getElementById("modalBio");
    const linkedinEl = document.getElementById("modalLinkedIn");
    const githubEl = document.getElementById("modalGithub");

    if (imgEl) imgEl.src = image;
    if (nameEl) nameEl.textContent = name;
    if (roleEl) roleEl.textContent = role;
    if (bioEl) bioEl.textContent = bio;

    if (linkedinEl) {
        const hasLinkedin = Boolean(linkedin && linkedin !== "#");
        linkedinEl.href = hasLinkedin ? linkedin : "#";
        linkedinEl.style.display = hasLinkedin ? "inline-flex" : "none";
        if (hasLinkedin) {
            linkedinEl.target = "_blank";
            linkedinEl.rel = "noopener noreferrer";
        }
    }

    if (githubEl) {
        const hasGithub = Boolean(github && github !== "#");
        githubEl.href = hasGithub ? github : "#";
        githubEl.style.display = hasGithub ? "inline-flex" : "none";
        if (hasGithub) {
            githubEl.target = "_blank";
            githubEl.rel = "noopener noreferrer";
        }
    }

    const modal = document.getElementById("memberModal");
    if (modal) modal.style.display = "flex";
};

const closeMemberDetails = () => {
    const modal = document.getElementById("memberModal");
    if (modal) modal.style.display = "none";
};

window.addEventListener("click", (event) => {
    const modal = document.getElementById("memberModal");
    if (event.target === modal) {
        closeMemberDetails();
    }
});

// REAL-TIME TEAM FILTERING FUNCTION
function filterTeamMembers() {
    const searchInput = document.querySelectorAll("input[placeholder*='Search team']")[0] || document.getElementById("teamSearchInput");
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const teamCards = document.querySelectorAll(".team-card, .profile-card, [onclick*='showMemberDetails']");

    teamCards.forEach(card => {
        const nameText = card.textContent.toLowerCase();
        
        if (nameText.includes(query)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Bind search input dynamically
    const searchInput = document.querySelectorAll("input[placeholder*='Search team']")[0] || document.getElementById("teamSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filterTeamMembers);
    }

    const logoLink = document.getElementById("logoLink");
    if (logoLink) {
        logoLink.addEventListener("click", (e) => {
            e.preventDefault();
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            window.location.href = isLoggedIn ? "index.html" : "login.html";
        });
    }

    const elementsToAnimate = document.querySelectorAll(
        ".profile-card, .feature-card, .about-card, .stat-box, .stat-card, .dashboard-card, .physique-card, .workout-card, .macro-card, .meal-card, .chart-card, .team-card, .target-card, .heading, .value-card, .timeline-item, .history-card, .tips-card, .tracker-card, .faq-item"
    );

    elementsToAnimate.forEach((el) => {
        el.classList.add("reveal");
        const parent = el.parentElement;
        if (
            parent &&
            [
                "features-grid",
                "physique-grid",
                "about-grid",
                "macro-grid",
                "goal-grid",
                "cards-container",
                "values-grid",
                "tips-grid",
                "faq-accordion"
            ].some((className) => parent.classList.contains(className))
        ) {
            const childIndex = Array.from(parent.children).indexOf(el);
            el.style.transitionDelay = `${childIndex * 0.1}s`;
        }
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
});

window.showMemberDetails = showMemberDetails;
window.closeMemberDetails = closeMemberDetails;