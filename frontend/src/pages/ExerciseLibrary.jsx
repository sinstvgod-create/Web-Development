import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function ExerciseLibrary() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("All");
  const [equipment, setEquipment] = useState("All");

  // NEW FEATURE: Bookmarked favorite exercises persisted locally
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("overload_favorite_exercises");
    return saved ? JSON.parse(saved) : [];
  });

  // NEW FEATURE: Selected exercise for detail modal view
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    localStorage.setItem("overload_favorite_exercises", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (exerciseName, e) => {
    e.stopPropagation();
    setFavorites((prev) => 
      prev.includes(exerciseName) 
        ? prev.filter(name => name !== exerciseName)
        : [...prev, exerciseName]
    );
  };

  const exercises = [
    {
      name: "Bench Press",
      muscle: "Chest",
      equipment: "Barbell",
      difficulty: "Intermediate",
      sets: 3,
      reps: 10,
      tips: "Keep your shoulder blades retracted and feet firmly planted on the floor. Lower the bar to mid-chest level with controlled elbows.",
      mistakes: "Bouncing the bar off your chest or flaring elbows past 75 degrees."
    },
    {
      name: "Squat",
      muscle: "Legs",
      equipment: "Barbell",
      difficulty: "Intermediate",
      sets: 3,
      reps: 10,
      tips: "Break at the hips and knees simultaneously, keeping your chest up and knees tracking over your toes.",
      mistakes: "Allowing knees to cave inward or failing to reach parallel depth."
    },
    {
      name: "Lat Pulldown",
      muscle: "Back",
      equipment: "Machine",
      difficulty: "Beginner",
      sets: 3,
      reps: 12,
      tips: "Drive your elbows down and back while keeping your chest lifted towards the bar.",
      mistakes: "Using excessive momentum or pulling with your biceps instead of lats."
    },
    {
      name: "Shoulder Press",
      muscle: "Shoulders",
      equipment: "Dumbbell",
      difficulty: "Intermediate",
      sets: 3,
      reps: 10,
      tips: "Brace your core tightly and press overhead in a slight arc, locking out arms without hyperextending elbows.",
      mistakes: "Arching your lower back excessively or using leg drive."
    },
    {
      name: "Bicep Curl",
      muscle: "Arms",
      equipment: "Dumbbell",
      difficulty: "Beginner",
      sets: 3,
      reps: 12,
      tips: "Keep your elbows pinned to your sides and squeeze hard at the peak contraction.",
      mistakes: "Swinging your torso or moving your elbows forward during the lift."
    },
    {
      name: "Tricep Pushdown",
      muscle: "Arms",
      equipment: "Cable",
      difficulty: "Beginner",
      sets: 3,
      reps: 12,
      tips: "Stand upright with a slight forward lean, fully extending your arms downward with locked elbows.",
      mistakes: "Allowing elbows to drift backward or shrugging shoulders."
    },
    {
      name: "Romanian Deadlift",
      muscle: "Legs",
      equipment: "Barbell",
      difficulty: "Advanced",
      sets: 3,
      reps: 8,
      tips: "Hinge backward at your hips with a soft bend in your knees while keeping the bar close to your shins.",
      mistakes: "Rounding your lower back or squatting down instead of hinging."
    },
    {
      name: "Seated Row",
      muscle: "Back",
      equipment: "Machine",
      difficulty: "Beginner",
      sets: 3,
      reps: 12,
      tips: "Maintain a neutral spine and pull the handle towards your lower abdomen.",
      mistakes: "Excessive forward rounding of shoulders at full extension."
    }
  ];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesMuscle =
      muscle === "All" ||
      exercise.muscle === muscle;

    const matchesEquipment =
      equipment === "All" ||
      exercise.equipment === equipment;

    return (
      matchesSearch &&
      matchesMuscle &&
      matchesEquipment
    );
  });

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          OVERLOAD<span>FIT</span>
        </div>

        <nav className="dashboard-nav">

          <Link
            to="/dashboard"
            className={isActive("/dashboard") ? "dashboard-nav-item active" : "dashboard-nav-item"}
          >
            <span>
              <i className="bi bi-grid-1x2-fill"></i>
            </span>
            Dashboard
          </Link>

          <Link
            to="/workout/log"
            className={isActive("/workout/log") || isActive("/workout") ? "dashboard-nav-item active" : "dashboard-nav-item"}
          >
            <span>
              <i className="bi bi-lightning-charge-fill"></i>
            </span>
            Workout
          </Link>

          <Link
            to="/progress"
            className={isActive("/progress") ? "dashboard-nav-item active" : "dashboard-nav-item"}
          >
            <span>
              <i className="bi bi-graph-up-arrow"></i>
            </span>
            Progress
          </Link>

          <Link
            to="/plan"
            className={isActive("/plan") ? "dashboard-nav-item active" : "dashboard-nav-item"}
          >
            <span>
              <i className="bi bi-clipboard2-check-fill"></i>
            </span>
            Plan
          </Link>

          <Link
            to="/diet"
            className={isActive("/diet") ? "dashboard-nav-item active" : "dashboard-nav-item"}
          >
            <span>
              <i className="bi bi-egg-fried"></i>
            </span>
            Diet
          </Link>

          <Link
            to="/profile"
            className={isActive("/profile") ? "dashboard-nav-item active" : "dashboard-nav-item"}
          >
            <span>
              <i className="bi bi-person-fill"></i>
            </span>
            Profile
          </Link>

        </nav>

      </aside>

      {/* Main */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div>
            <span className="section-label">
              EXERCISE LIBRARY
            </span>

            <h1>
              Explore <span>Exercises</span>
            </h1>

            <p>
              Find exercises, learn proper execution form, and build your training knowledge. Click any card for pro tips!
            </p>
          </div>

          <div className="dashboard-date">
            <span>DATABASE</span>
            <strong>
              {filteredExercises.length} AVAILABLE
            </strong>
          </div>

        </header>

        {/* Filters */}
        <section className="dashboard-card">

          <div className="card-header">

            <div>
              <span className="section-label">
                FILTER & SEARCH
              </span>

              <h2>
                Find an Exercise
              </h2>
            </div>
            
            <span className="target-status" style={{ color: "var(--orange)" }}>
              {favorites.length} Saved Favorites
            </span>

          </div>

          <div
            className="dashboard-grid"
            style={{ marginTop: "25px" }}
          >

            <div className="form-group">
              <label>SEARCH</label>

              <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>MUSCLE GROUP</label>

              <select
                value={muscle}
                onChange={(event) =>
                  setMuscle(event.target.value)
                }
              >
                <option value="All">All Muscles</option>
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Legs">Legs</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Arms">Arms</option>
              </select>
            </div>

            <div className="form-group">
              <label>EQUIPMENT</label>

              <select
                value={equipment}
                onChange={(event) =>
                  setEquipment(event.target.value)
                }
              >
                <option value="All">All Equipment</option>
                <option value="Barbell">Barbell</option>
                <option value="Dumbbell">Dumbbell</option>
                <option value="Machine">Machine</option>
                <option value="Cable">Cable</option>
              </select>
            </div>

          </div>

        </section>

        {/* Exercise List */}
        <section
          className="dashboard-grid"
          style={{ marginTop: "15px" }}
        >

          {filteredExercises.map((exercise) => {
            const isFav = favorites.includes(exercise.name);
            return (
              <div
                className="dashboard-card"
                key={exercise.name}
                onClick={() => setSelectedExercise(exercise)}
                style={{ cursor: "pointer", position: "relative", transition: "var(--transition)" }}
              >

                {/* Favorite Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(exercise.name, e)}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "transparent",
                    border: "none",
                    color: isFav ? "var(--orange)" : "var(--gray-dark)",
                    fontSize: "18px",
                    cursor: "pointer"
                  }}
                  title={isFav ? "Remove Favorite" : "Save Favorite"}
                >
                  <i className={isFav ? "bi bi-bookmark-fill" : "bi bi-bookmark"}></i>
                </button>

                {/* Exercise Header */}
                <div className="card-header">
                  <div>
                    <span className="section-label">
                      {exercise.muscle.toUpperCase()}
                    </span>
                    <h2>
                      {exercise.name}
                    </h2>
                  </div>
                </div>

                {/* Exercise Details */}
                <div
                  className="target-details"
                  style={{ marginTop: "25px" }}
                >
                  <div>
                    <span>SETS</span>
                    <strong>{exercise.sets}</strong>
                  </div>

                  <div>
                    <span>REPS</span>
                    <strong>{exercise.reps}</strong>
                  </div>

                  <div>
                    <span>EQUIPMENT</span>
                    <strong>{exercise.equipment}</strong>
                  </div>
                </div>

                {/* Exercise Footer */}
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span style={{ color: "var(--orange)", fontSize: "10px", fontWeight: "700" }}>
                    Click for Form Tips →
                  </span>
                  <span className="target-status" style={{ fontSize: "9px" }}>
                    {exercise.difficulty}
                  </span>
                </div>

              </div>
            );
          })}

        </section>

        {/* EXERCISE DETAIL MODAL POPUP */}
        {selectedExercise && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", display: "grid", placeItems: "center", zIndex: 1000, padding: "20px" }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--orange)", borderRadius: "8px", maxWidth: "500px", width: "100%", padding: "30px", position: "relative" }}>
              <span className="section-label" style={{ color: "var(--orange)" }}>{selectedExercise.muscle.toUpperCase()} • {selectedExercise.equipment.toUpperCase()}</span>
              <h2 style={{ fontSize: "24px", marginTop: "5px", marginBottom: "15px" }}>{selectedExercise.name}</h2>
              
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ fontSize: "11px", color: "var(--white)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Pro Execution Tips:</strong>
                <p style={{ fontSize: "12px", color: "var(--gray)", lineHeight: "1.6" }}>{selectedExercise.tips}</p>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <strong style={{ fontSize: "11px", color: "var(--red)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Common Mistakes to Avoid:</strong>
                <p style={{ fontSize: "12px", color: "var(--gray)", lineHeight: "1.6" }}>{selectedExercise.mistakes}</p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setSelectedExercise(null)}
                  className="primary-btn"
                  style={{ padding: "0 25px", minHeight: "38px" }}
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredExercises.length === 0 && (
          <div
            className="dashboard-card"
            style={{
              marginTop: "15px",
              textAlign: "center"
            }}
          >
            <span className="section-label">
              NO RESULTS
            </span>

            <h2>
              No exercises found
            </h2>

            <p
              style={{
                marginTop: "10px",
                color: "var(--gray)"
              }}
            >
              Try changing your search or filters.
            </p>
          </div>
        )}

      </main>

    </div>
  );
}

export default ExerciseLibrary;