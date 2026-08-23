document.addEventListener("DOMContentLoaded", () => {
    const tiltCards = document.querySelectorAll(
        ".feature-card, .macro-card, .about-card, .physique-card, .stat-box, .preview-card, .metric-chip, .action-tile, .pricing-card"
    );

    tiltCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
        });
    });

    const glowTargets = document.querySelectorAll("h1 span, .logo span");
    glowTargets.forEach(target => {
        target.style.transition = "text-shadow 0.4s ease";
        target.addEventListener("mouseover", () => {
            target.style.textShadow = "0 0 25px #00f0ff, 0 0 50px rgba(0, 240, 255, 0.8)";
        });
        target.addEventListener("mouseout", () => {
            target.style.textShadow = "0 0 15px rgba(0, 240, 255, 0.5)";
        });
    });
});