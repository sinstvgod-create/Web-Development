import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { getExercises } from "../services/exerciseService";
import { logWorkout } from "../services/workoutService";
import { getNextTarget } from "../services/planService";
import { getCurrentPhysique, getPhysiqueData, setPhysiqueData } from "../utils/physiqueStorage";

const LogWorkout = () => {
  const location = useLocation();
  const [exercises, setExercises] = useState([]);
  const [nextTarget, setNextTarget] = useState(null);

  const currentPhysique = getCurrentPhysique();

  const [formData, setFormData] = useState({
    exerciseId: "",
    sets: 3,
    reps: 10,
    weight: 0
  });

  const [message, setMessage] = useState("");
  const [resultType, setResultType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Barbell Plate Calculator input weight state
  const [plateInputWeight, setPlateInputWeight] = useState(100);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const loadTarget = async () => {
    try {
      const response = await getNextTarget();

      if (response.success && response.nextTarget) {
        const target = response.nextTarget;

        setNextTarget(target);

        setFormData((previous) => ({
          ...previous,
          exerciseId:
            target.exerciseId?._id ||
            previous.exerciseId,
          sets:
            target.targetSets ??
            target.sets ??
            previous.sets,
          reps:
            target.targetReps ??
            target.reps ??
            previous.reps,
          weight:
            target.currentWeight ??
            target.weight ??
            previous.weight
        }));
        
        if (target.currentWeight || target.weight) {
          setPlateInputWeight(target.currentWeight ?? target.weight);
        }
      } else {
        setNextTarget(null);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to load current target"
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const exerciseResponse = await getExercises();

        if (exerciseResponse.success) {
          setExercises(
            exerciseResponse.exercises || []
          );
        }

        await loadTarget();
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Unable to load workout data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPhysique]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "exerciseId"
          ? value
          : Number(value)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setResultType("");
    setSubmitting(true);

    try {
      const response = await logWorkout(formData);

      if (!response.success) {
        setError(
          response.message ||
          "Unable to log workout"
        );
        return;
      }

      // Save workout locally into active physique's isolated history
      const existingHistory = getPhysiqueData("progress_history", []);
      const selectedExerciseObj = exercises.find(ex => ex._id === formData.exerciseId);
      const exerciseName = nextTarget?.exerciseId?.name || selectedExerciseObj?.name || "Workout Session";

      const newLogEntry = {
        exercise: exerciseName,
        sets: formData.sets,
        reps: formData.reps,
        weight: formData.weight,
        volume: formData.sets * formData.reps * formData.weight,
        result: "success",
        createdAt: new Date().toISOString()
      };

      setPhysiqueData("progress_history", [...existingHistory, newLogEntry]);

      setMessage(
        response.message ||
        `Workout logged successfully for ${currentPhysique.toUpperCase()}.`
      );

      if (
        response.message?.toLowerCase().includes("deload")
      ) {
        setResultType("deload");
      } else if (
        response.message?.toLowerCase().includes("repeat")
      ) {
        setResultType("repeat");
      } else {
        setResultType("success");
      }

      await loadTarget();

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to connect to the server"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getResultTitle = () => {
    if (resultType === "deload") {
      return "Target Deloaded";
    }

    if (resultType === "repeat") {
      return "Target Repeated";
    }

    return "Progression Updated";
  };

  const getResultIcon = () => {
    if (resultType === "deload") {
      return "bi-arrow-down-circle";
    }

    if (resultType === "repeat") {
      return "bi-arrow-repeat";
    }

    return "bi-check-circle";
  };

  // Barbell Plate Breakdown Algorithm (assuming standard 20kg bar and metric plates: 25, 20, 10, 5, 2.5, 1.25)
  const calculatePlates = (totalWeight) => {
    const barWeight = 20;
    if (totalWeight <= barWeight) return "Just the bar (20 kg)";
    let remaining = (totalWeight - barWeight) / 2; // per side
    const standardPlates = [25, 20, 10, 5, 2.5, 1.25];
    const breakdown = [];

    for (let plate of standardPlates) {
      const count = Math.floor(remaining / plate);
      if (count > 0) {
        breakdown.push(`${count} × ${plate}kg`);
        remaining -= count * plate;
      }
    }
    return breakdown.length > 0 ? breakdown.join(", ") : "Just the bar";
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <span className="section-label">
                WORKOUT ({currentPhysique.toUpperCase()})
              </span>
              <h1>
                Loading <span>Workout...</span>
              </h1>
              <p>
                Preparing your training session.
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
              TRAINING SESSION ({currentPhysique.toUpperCase()})
            </span>

            <h1>
              Log Your <span>Workout.</span>
            </h1>

            <p>
              Record your performance for your <strong>{currentPhysique}</strong> goal.
            </p>
          </div>

          <div className="dashboard-date">
            <span>
              WORKOUT LOG
            </span>

            <strong>
              TODAY
            </strong>
          </div>
        </header>

        {nextTarget && (
          <section className="current-target-card">
            <div className="current-target-heading">
              <div>
                <span className="section-label">
                  CURRENT TARGET
                </span>

                <h2>
                  {nextTarget.exerciseId?.name ||
                    nextTarget.exercise ||
                    "Current Exercise"}
                </h2>
              </div>

              <span className="target-status">
                {nextTarget.status || "active"}
              </span>
            </div>

            {nextTarget.exerciseId && (
              <p
                style={{
                  color: "var(--gray-dark)",
                  fontSize: "10px",
                  marginTop: "10px"
                }}
              >
                {nextTarget.exerciseId.muscleGroup}
                {" • "}
                {nextTarget.exerciseId.equipment}
              </p>
            )}

            <div className="current-target-values">
              <div>
                <span>
                  WEIGHT
                </span>

                <strong>
                  {nextTarget.currentWeight ??
                    nextTarget.weight ??
                    0}
                  <small> KG</small>
                </strong>
              </div>

              <div>
                <span>
                  SETS
                </span>

                <strong>
                  {nextTarget.targetSets ??
                    nextTarget.sets ??
                    0}
                </strong>
              </div>

              <div>
                <span>
                  REPS
                </span>

                <strong>
                  {nextTarget.targetReps ??
                    nextTarget.reps ??
                    0}
                </strong>
              </div>

              <div>
                <span>
                  FAILURES
                </span>

                <strong>
                  {nextTarget.failureCount ?? 0}
                </strong>
              </div>
            </div>
          </section>
        )}

        {/* BARBELL PLATE CALCULATOR TOOL */}
        <section className="dashboard-card" style={{ marginBottom: "20px", border: "1px solid var(--border)" }}>
          <div className="card-header">
            <div>
              <span className="section-label">EQUIPMENT TOOL</span>
              <h2>Barbell Plate Breakdown Calculator</h2>
            </div>
          </div>
          <p style={{ marginTop: "10px", color: "var(--gray)", fontSize: "12px" }}>
            Calculate the exact plates needed on each side of a standard 20kg barbell for your target weight:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginTop: "15px", alignItems: "center" }}>
            <div>
              <label style={{ fontSize: "10px", color: "var(--gray)", display: "block", marginBottom: "5px" }}>TOTAL TARGET WEIGHT (KG)</label>
              <input
                type="number"
                value={plateInputWeight}
                onChange={(e) => setPlateInputWeight(Number(e.target.value))}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid var(--border)", color: "var(--white)", borderRadius: "4px" }}
              />
            </div>
            <div style={{ background: "rgba(255, 94, 20, 0.1)", padding: "10px", borderRadius: "4px", border: "1px solid var(--orange)" }}>
              <span style={{ fontSize: "9px", color: "var(--orange)", display: "block", fontWeight: "700" }}>PLATES PER SIDE (20KG BAR)</span>
              <strong style={{ fontSize: "14px", fontFamily: "Poppins, sans-serif", color: "var(--white)" }}>{calculatePlates(plateInputWeight)}</strong>
            </div>
          </div>
        </section>

        <section className="workout-log-card">
          <div className="card-header">
            <div>
              <span className="section-label">
                PERFORMANCE
              </span>

              <h2>
                Record Workout
              </h2>
            </div>

            <span className="log-date">
              <i className="bi bi-calendar3"></i>
              {" "}
              Today
            </span>
          </div>

          <form
            className="workout-log-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>
                EXERCISE
              </label>

              <select
                name="exerciseId"
                value={formData.exerciseId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Exercise
                </option>

                {exercises.map((exercise) => (
                  <option
                    key={exercise._id}
                    value={exercise._id}
                  >
                    {exercise.name}
                  </option>
                ))}
              </select>

              <small
                style={{
                  display: "block",
                  marginTop: "8px",
                  color: "var(--gray-dark)",
                  fontSize: "10px"
                }}
              >
                Current target is selected automatically, but you can change it anytime.
              </small>
            </div>

            <div className="log-table">
              <div className="log-table-header">
                <span>
                  SETS
                </span>

                <span>
                  REPS
                </span>

                <span>
                  WEIGHT (KG)
                </span>
              </div>

              <div className="log-table-row">
                <div className="set-number">
                  01
                </div>

                <input
                  type="number"
                  name="sets"
                  value={formData.sets}
                  onChange={handleChange}
                  min="1"
                  required
                />

                <input
                  type="number"
                  name="reps"
                  value={formData.reps}
                  onChange={handleChange}
                  min="1"
                  required
                />

                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                />

                <div className="set-complete">
                  <i className="bi bi-check2"></i>
                </div>
              </div>
            </div>

            {message && (
              <div
                className="workout-result-card"
                style={{
                  borderColor:
                    resultType === "deload"
                      ? "rgba(245, 158, 11, 0.3)"
                      : resultType === "repeat"
                      ? "rgba(0, 170, 255, 0.3)"
                      : "rgba(34, 197, 94, 0.3)"
                }}
              >
                <strong
                  style={{
                    color:
                      resultType === "deload"
                        ? "var(--yellow)"
                        : resultType === "repeat"
                        ? "var(--blue)"
                        : "var(--green)"
                  }}
                >
                  <i
                    className={`bi ${getResultIcon()}`}
                  ></i>
                  {" "}
                  {getResultTitle()}
                </strong>

                <p>
                  {message}
                </p>

                {nextTarget && (
                  <p
                    style={{
                      marginTop: "10px",
                      color: "var(--white)"
                    }}
                  >
                    Next target:{" "}
                    <strong>
                      {nextTarget.currentWeight ??
                        nextTarget.weight ??
                        0}
                      {" kg "}
                      ×{" "}
                      {nextTarget.targetSets ??
                        nextTarget.sets ??
                        0}
                      {" sets × "}
                      {nextTarget.targetReps ??
                        nextTarget.reps ??
                        0}
                      {" reps"}
                    </strong>
                  </p>
                )}
              </div>
            )}

            {error && (
              <div
                className="workout-result-card"
                style={{
                  borderColor:
                    "rgba(239, 68, 68, 0.3)"
                }}
              >
                <strong
                  style={{
                    color: "var(--red)"
                  }}
                >
                  <i className="bi bi-exclamation-circle"></i>
                  {" "}
                  Unable to Log Workout
                </strong>

                <p>
                  {error}
                </p>
              </div>
            )}

            <div className="workout-submit">
              <div>
                <span className="section-label">
                  READY?
                </span>

                <p>
                  Submit your performance to update
                  your progressive overload target.
                </p>
              </div>

              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Logging..."
                  : "Log Workout"}

                {!submitting && (
                  <i className="bi bi-arrow-right"></i>
                )}
              </button>
            </div>
          </form>
        </section>

      </main>

    </div>
  );
};

export default LogWorkout;