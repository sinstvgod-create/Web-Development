import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { getWorkoutPlan } from "../services/planService";

const WorkoutPlan = () => {
  const location = useLocation();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Interactive exercise checklist state persisted locally
  const [completedExercises, setCompletedExercises] = useState(() => {
    const saved = localStorage.getItem("overload_completed_exercises");
    return saved ? JSON.parse(saved) : {};
  });

  // Filter by muscle group
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState("All");

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    localStorage.setItem("overload_completed_exercises", JSON.stringify(completedExercises));
  }, [completedExercises]);

  useEffect(() => {
    const loadWorkoutPlan = async () => {
      try {
        const response = await getWorkoutPlan();

        if (response.success) {
          setWorkoutPlan(response.workoutPlan);
        } else {
          setError(
            response.message ||
            "Unable to load workout plan"
          );
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Unable to connect to the server"
        );
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutPlan();
  }, []);

  const toggleExerciseComplete = (dayKey, exerciseIndex) => {
    const key = `${dayKey}-${exerciseIndex}`;
    setCompletedExercises((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper to check if all exercises for a given day are completed
  const isDayCompleted = (day) => {
    if (!day.exercises || day.exercises.length === 0) return false;
    return day.exercises.every((_, index) => completedExercises[`${day.day}-${index}`]);
  };

  // Master box click: if all are completed, reset them; otherwise, mark all as complete
  const handleMasterDayToggle = (day) => {
    const allDone = isDayCompleted(day);
    setCompletedExercises((prev) => {
      const updated = { ...prev };
      day.exercises.forEach((_, index) => {
        updated[`${day.day}-${index}`] = !allDone; // Toggle off if already all done, or toggle on if not
      });
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <span className="section-label">
                TRAINING PLAN
              </span>

              <h1>
                Loading <span>Plan...</span>
              </h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <span className="section-label">
                TRAINING PLAN
              </span>

              <h1>
                My <span>Workout Plan.</span>
              </h1>

              <p>{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!workoutPlan) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <span className="section-label">
                TRAINING PLAN
              </span>

              <h1>
                No <span>Plan Found.</span>
              </h1>

              <p>
                Complete your assessment to generate
                your personalized workout plan.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <aside className="dashboard-sidebar">

        <Link
          to="/dashboard"
          className="dashboard-logo"
        >
          OVERLOAD<span>FIT</span>
        </Link>

        <nav className="dashboard-nav">

          <Link
            to="/dashboard"
            className={
              isActive("/dashboard")
                ? "dashboard-nav-item active"
                : "dashboard-nav-item"
            }
          >
            <span>
              <i className="bi bi-grid-1x2-fill"></i>
            </span>
            Dashboard
          </Link>

          <Link
            to="/workout/log"
            className={
              isActive("/workout/log") || isActive("/workout")
                ? "dashboard-nav-item active"
                : "dashboard-nav-item"
            }
          >
            <span>
              <i className="bi bi-lightning-charge-fill"></i>
            </span>
            Workout
          </Link>

          <Link
            to="/progress"
            className={
              isActive("/progress")
                ? "dashboard-nav-item active"
                : "dashboard-nav-item"
            }
          >
            <span>
              <i className="bi bi-graph-up-arrow"></i>
            </span>
            Progress
          </Link>

          <Link
            to="/plan"
            className={
              isActive("/plan")
                ? "dashboard-nav-item active"
                : "dashboard-nav-item"
            }
          >
            <span>
              <i className="bi bi-clipboard2-check-fill"></i>
            </span>
            Plan
          </Link>

          <Link
            to="/diet"
            className={
              isActive("/diet")
                ? "dashboard-nav-item active"
                : "dashboard-nav-item"
            }
          >
            <span>
              <i className="bi bi-egg-fried"></i>
            </span>
            Diet
          </Link>

          <Link
            to="/profile"
            className={
              isActive("/profile")
                ? "dashboard-nav-item active"
                : "dashboard-nav-item"
            }
          >
            <span>
              <i className="bi bi-person-fill"></i>
            </span>
            Profile
          </Link>

        </nav>

      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <span className="section-label">
              PERSONALIZED TRAINING
            </span>

            <h1>
              My Workout <span>Plan.</span>
            </h1>

            <p>
              Your personalized training plan built
              around your goals, experience, and
              available training days.
            </p>
          </div>

          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {["All", "Chest", "Back", "Legs", "Shoulders", "Arms"].map((muscle) => (
              <button
                key={muscle}
                onClick={() => setSelectedMuscleFilter(muscle)}
                className={selectedMuscleFilter === muscle ? "primary-btn" : "secondary-btn"}
                style={{ padding: "4px 10px", fontSize: "10px", minHeight: "30px" }}
              >
                {muscle}
              </button>
            ))}
          </div>

        </header>

        <section className="plan-summary">

          <div className="plan-summary-item">
            <span>
              GOAL
            </span>

            <strong>
              {workoutPlan.goal}
            </strong>
          </div>

          <div className="plan-summary-item">
            <span>
              WORKOUT DAYS
            </span>

            <strong>
              {workoutPlan.workoutDays}
            </strong>
          </div>

          <div className="plan-summary-item">
            <span>
              TRAINING PLAN
            </span>

            <strong>
              {workoutPlan.plan?.length || 0} DAYS
            </strong>
          </div>

          <div className="plan-summary-item">
            <span>
              STATUS
            </span>

            <strong>
              ACTIVE
            </strong>
          </div>

        </section>

        <section className="progression-notice">
          <div className="notice-icon">
            <i className="bi bi-arrow-up-right"></i>
          </div>

          <div>
            <strong>
              PROGRESSIVE OVERLOAD ACTIVE
            </strong>

            <p>
              Complete your workouts consistently.
              Check off exercises below as you finish them during your gym session.
            </p>
          </div>
        </section>

        <section className="workout-plan-list">

          {workoutPlan.plan?.map((day) => {
            const filteredExercises = day.exercises?.filter((ex) => {
              if (selectedMuscleFilter === "All") return true;
              return ex.muscleGroup?.toLowerCase().includes(selectedMuscleFilter.toLowerCase());
            });

            if (filteredExercises && filteredExercises.length === 0) return null;

            const estimatedVolume = day.exercises?.reduce((acc, ex) => {
              const setsNum = Number(ex.sets) || 3;
              const repsNum = Number(ex.reps) || 10;
              const weightNum = Number(ex.weight) || 50;
              return acc + (setsNum * repsNum * weightNum);
            }, 0) || 0;

            const dayDone = isDayCompleted(day);

            return (
              <div
                className="workout-day-card"
                key={day.day}
                style={{ marginBottom: "25px" }}
              >

                <div className="workout-day-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {/* MASTER CHECKBOX / RESET BUTTON FOR THE DAY */}
                    <button
                      type="button"
                      onClick={() => handleMasterDayToggle(day)}
                      title={dayDone ? "All exercises complete! Click to reset." : "Click to mark all complete"}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "6px",
                        border: dayDone ? "1px solid var(--green)" : "1px solid var(--orange)",
                        background: dayDone ? "var(--green)" : "rgba(255, 94, 20, 0.1)",
                        color: dayDone ? "#000" : "var(--orange)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "var(--transition)"
                      }}
                    >
                      {dayDone ? "✓" : "○"}
                    </button>

                    <div className="workout-day-title">
                      <span>
                        TRAINING DAY {day.day} • EST. VOLUME: {estimatedVolume} KG {dayDone ? "• (COMPLETED)" : ""}
                      </span>

                      <h2>
                        {day.title}
                      </h2>

                      <p>
                        {day.description}
                      </p>
                    </div>
                  </div>

                  <div className="workout-day-number">
                    {String(day.day).padStart(2, "0")}
                  </div>
                </div>

                <div className="exercise-table-header">
                  <span>
                    EXERCISE & CHECK
                  </span>

                  <span>
                    SETS
                  </span>

                  <span>
                    REPS
                  </span>

                  <span>
                    TARGET
                  </span>
                </div>

                {filteredExercises?.map(
                  (exercise, index) => {
                    const isDone = completedExercises[`${day.day}-${index}`];
                    return (
                      <div
                        className="exercise-row"
                        key={index}
                        style={{
                          background: isDone ? "rgba(34, 197, 94, 0.04)" : "transparent",
                          opacity: isDone ? 0.7 : 1,
                          transition: "var(--transition)"
                        }}
                      >
                        <div className="exercise-info" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <button
                            type="button"
                            onClick={() => toggleExerciseComplete(day.day, index)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "4px",
                              border: isDone ? "1px solid var(--green)" : "1px solid var(--border)",
                              background: isDone ? "var(--green)" : "transparent",
                              color: isDone ? "#000" : "transparent",
                              display: "grid",
                              placeItems: "center",
                              fontSize: "12px",
                              cursor: "pointer"
                            }}
                          >
                            ✓
                          </button>
                          <div>
                            <strong style={{ textDecoration: isDone ? "line-through" : "none" }}>
                              {exercise.name}
                            </strong>

                            <span>
                              {exercise.muscleGroup}
                              {" • "}
                              {exercise.equipment}
                            </span>
                          </div>
                        </div>

                        <strong className="exercise-target">
                          {exercise.sets}
                        </strong>

                        <strong className="exercise-target">
                          {exercise.reps}
                        </strong>

                        <div>
                          <strong>
                            {exercise.target}
                          </strong>

                          <span
                            style={{
                              display: "block",
                              marginTop: "4px",
                              color: "var(--gray-dark)",
                              fontSize: "9px"
                            }}
                          >
                            {exercise.weight} kg
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}

              </div>
            );
          })}

        </section>

        <section className="workout-start-section">
          <div>
            <span className="section-label">
              READY TO TRAIN?
            </span>

            <h2>
              Start Your <span>Workout.</span>
            </h2>

            <p>
              Log your performance after completing
              each exercise and let GymFit track
              your progression.
            </p>
          </div>

          <Link
            to="/workout/log"
            className="primary-btn"
          >
            Log Workout
            <i className="bi bi-arrow-right"></i>
          </Link>
        </section>

      </main>

    </div>
  );
};

export default WorkoutPlan;