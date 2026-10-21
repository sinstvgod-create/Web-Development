import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getProgress } from "../services/progressService";
import { getNextTarget } from "../services/planService";
import { getCurrentPhysique } from "../utils/physiqueStorage";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [progress, setProgress] = useState(null);
  const [nextTarget, setNextTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // NEW FEATURE: Dashboard Physique Goal Selector (10 Options) Scoped via Utility
  const [selectedPhysique, setSelectedPhysique] = useState(() => {
    return getCurrentPhysique();
  });

  // Interactive Rest Timer States
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Quick Notes Scratchpad State
  const [quickNotes, setQuickNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState(() => {
    return localStorage.getItem(`overload_${getCurrentPhysique()}_quick_notes`) || "";
  });

  // Sleep / Recovery Tracker States
  const [sleepHours, setSleepHours] = useState(() => {
    return localStorage.getItem(`overload_${getCurrentPhysique()}_sleep_hours`) || "7";
  });
  const [sorenessLevel, setSorenessLevel] = useState(() => {
    return localStorage.getItem(`overload_${getCurrentPhysique()}_soreness`) || "Low";
  });

  // 1-Rep Max (1RM) Calculator States
  const [calcWeight, setCalcWeight] = useState(100);
  const [calcReps, setCalcReps] = useState(5);

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [progressResponse, targetResponse] =
          await Promise.all([
            getProgress(),
            getNextTarget()
          ]);

        if (progressResponse.success) {
          setProgress(progressResponse);
        }

        if (targetResponse.success) {
          setNextTarget(targetResponse.nextTarget);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handlePhysiqueChange = (goalKey) => {
    setSelectedPhysique(goalKey);
    localStorage.setItem("gymfit_physique_goal", goalKey);
    // Reload page to instantly apply independent data pools for the newly selected physique
    window.location.reload();
  };

  const startRestTimer = (seconds) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const stopRestTimer = () => {
    setIsTimerRunning(false);
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    setSavedNotes(quickNotes);
    localStorage.setItem(`overload_${getCurrentPhysique()}_quick_notes`, quickNotes);
    alert("Workout notes saved successfully!");
  };

  const handleSaveRecovery = (e) => {
    e.preventDefault();
    localStorage.setItem(`overload_${getCurrentPhysique()}_sleep_hours`, sleepHours);
    localStorage.setItem(`overload_${getCurrentPhysique()}_soreness`, sorenessLevel);
    alert("Daily recovery check-in saved!");
  };

  // Epley Formula for 1RM: Weight * (1 + Reps / 30)
  const estimated1RM = Math.round(calcWeight * (1 + calcReps / 30));

  const summary = progress?.summary || {};
  const progressHistory = progress?.progressHistory || [];

  const totalWorkouts = summary.totalWorkouts || 0;
  const successfulWorkouts = summary.successfulWorkouts || 0;
  const failedWorkouts = summary.failedWorkouts || 0;
  const totalVolume = summary.totalVolume || 0;

  const successRate =
    totalWorkouts > 0
      ? Math.round(
          (successfulWorkouts / totalWorkouts) * 100
        )
      : 0;

  const firstName =
    user?.name?.split(" ")[0] || "User";

  const today = new Date();

  const formattedDate = today.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric"
    }
  );

  const targetProgress =
    nextTarget?.status === "completed"
      ? 100
      : nextTarget
      ? 50
      : 0;

  const recentActivity = [...progressHistory]
    .reverse()
    .slice(0, 3);

  const formatActivityDate = (date) => {
    if (!date) return "Recent";

    const activityDate = new Date(date);

    if (Number.isNaN(activityDate.getTime())) {
      return "Recent";
    }

    return activityDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const getActivityStatus = (activity) => {
    if (
      activity?.status === "completed" ||
      activity?.success === true ||
      activity?.result === "success"
    ) {
      return "SUCCESS";
    }

    if (
      activity?.status === "failed" ||
      activity?.success === false ||
      activity?.result === "failed"
    ) {
      return "FAILED";
    }

    return "LOGGED";
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const physiqueOptions = [
    { key: "lean", title: "1. Lean Shredded", desc: "Low body fat, sharp definition & extreme vascularity." },
    { key: "bulk", title: "2. Hypertrophy Bulk", desc: "Maximum muscle mass & raw size expansion." },
    { key: "power", title: "3. Powerlifting Strength", desc: "Absolute raw power on squat, bench & deadlift." },
    { key: "toned", title: "4. Aesthetic Toned", desc: "Balanced physique with clean, model-like lines." },
    { key: "athletic", title: "5. Athletic Functional", desc: "Agility, speed, stamina & explosive core power." },
    { key: "recomp", title: "6. Lean Recomp", desc: "Simultaneous body fat loss and muscle gain." },
    { key: "endurance", title: "7. Stamina Endurance", desc: "High cardiovascular capacity & sustained output." },
    { key: "bodybuilder", title: "8. Pro Bodybuilder", desc: "Extreme mass, symmetry & peak stage proportions." },
    { key: "crossfit", title: "9. CrossFit Competitor", desc: "Mixed modal conditioning, power & high work capacity." },
    { key: "calisthenics", title: "10. Calisthenics Master", desc: "Bodyweight mastery, relative strength & planche control." }
  ];

  if (loading) {
    return (
      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <Link
            to="/dashboard"
            className="dashboard-logo"
          >
            OVERLOAD<span>FIT</span>
          </Link>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <span className="section-label">
                TRAINING OVERVIEW
              </span>
              <h1>
                Loading <span>Dashboard...</span>
              </h1>
              <p>
                Preparing your training overview.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* SIDEBAR */}
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

        {isActive("/dashboard") && (
          <div className="sidebar-bottom">
            <div className="sidebar-user">
              <div className="user-avatar">
                {firstName.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>
                  {user?.name || "User"}
                </strong>
                <span>
                  {user?.email || "Member"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="logout-link"
            >
              <i className="bi bi-box-arrow-right"></i>
              {" "}
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <span className="section-label">
              TRAINING OVERVIEW
            </span>
            <h1>
              Welcome, {firstName}!
            </h1>
            <p>
              Track your workouts, monitor your progress, and build progressive strength.
            </p>
          </div>

          <div className="dashboard-date">
            <span>
              TODAY
            </span>
            <strong>
              {formattedDate}
            </strong>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="progression-notice">
            <div className="notice-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <div>
              <strong>
                DASHBOARD ERROR
              </strong>
              <p>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* 10-OPTION PHYSIQUE GOAL SELECTOR ON DASHBOARD */}
        <section className="dashboard-card" style={{ marginBottom: "20px", border: "1px solid var(--orange)", background: "rgba(255, 94, 20, 0.02)" }}>
          <div className="card-header">
            <div>
              <span className="section-label">GOAL CUSTOMIZATION</span>
              <h2>Select Your Target Physique (10 Options)</h2>
            </div>
            <span className="target-status" style={{ color: "var(--orange)" }}>
              {selectedPhysique.toUpperCase()} ACTIVE
            </span>
          </div>
          <p style={{ marginTop: "10px", color: "var(--gray)", fontSize: "12px" }}>
            Choose your desired target physique below. OverloadFit dynamically synchronizes your progressive workout plans and calorie targets according to your selection:
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginTop: "20px" }}>
            {physiqueOptions.map((opt) => {
              const isSelected = selectedPhysique === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => handlePhysiqueChange(opt.key)}
                  style={{
                    background: isSelected ? "rgba(255, 94, 20, 0.15)" : "#111",
                    border: isSelected ? "1px solid var(--orange)" : "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "15px",
                    cursor: "pointer",
                    transition: "var(--transition)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "13px", color: isSelected ? "var(--orange)" : "var(--white)" }}>
                      {opt.title}
                    </strong>
                    {isSelected && <i className="bi bi-check-circle-fill" style={{ color: "var(--orange)", fontSize: "14px" }}></i>}
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--gray)", margin: 0, lineHeight: "1.4" }}>{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* INTERACTIVE REST TIMER WIDGET */}
        <section className="dashboard-card" style={{ marginBottom: "20px", border: "1px solid var(--border)" }}>
          <div className="card-header">
            <div>
              <span className="section-label">BUILT-IN TOOLS</span>
              <h2>Live Rest Timer</h2>
            </div>
            <span className="target-status" style={{ color: isTimerRunning ? "var(--orange)" : "var(--green)" }}>
              {isTimerRunning ? "RUNNING" : "READY"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <strong style={{ fontSize: "36px", fontFamily: "Poppins, sans-serif" }}>
                {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, "0")}
              </strong>
              <span style={{ display: "block", color: "var(--gray)", fontSize: "10px" }}>TIME REMAINING BETWEEN SETS</span>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="button" onClick={() => startRestTimer(60)} className="secondary-btn" style={{ minHeight: "38px", padding: "0 15px" }}>60s</button>
              <button type="button" onClick={() => startRestTimer(90)} className="secondary-btn" style={{ minHeight: "38px", padding: "0 15px" }}>90s</button>
              <button type="button" onClick={() => startRestTimer(120)} className="secondary-btn" style={{ minHeight: "38px", padding: "0 15px" }}>120s</button>
              {isTimerRunning ? (
                <button type="button" onClick={stopRestTimer} className="primary-btn" style={{ minHeight: "38px", padding: "0 15px", background: "var(--red)", borderColor: "var(--red)" }}>Pause</button>
              ) : (
                <button type="button" onClick={() => setIsTimerRunning(true)} className="primary-btn" style={{ minHeight: "38px", padding: "0 15px" }}>Start</button>
              )}
            </div>
          </div>
        </section>

        {/* 1-REP MAX (1RM) CALCULATOR TOOL */}
        <section className="dashboard-card" style={{ marginBottom: "20px", border: "1px solid var(--border)" }}>
          <div className="card-header">
            <div>
              <span className="section-label">STRENGTH ANALYTICS</span>
              <h2>1-Rep Max (1RM) Calculator</h2>
            </div>
          </div>
          <p style={{ marginTop: "10px", color: "var(--gray)", fontSize: "12px" }}>
            Estimate your absolute maximum strength using the Epley formula based on your working weight and reps:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "15px", marginTop: "15px", alignItems: "center" }}>
            <div>
              <label style={{ fontSize: "10px", color: "var(--gray)", display: "block", marginBottom: "5px" }}>WEIGHT LIFTED (KG)</label>
              <input
                type="number"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value))}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid var(--border)", color: "var(--white)", borderRadius: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "10px", color: "var(--gray)", display: "block", marginBottom: "5px" }}>REPS PERFORMED</label>
              <input
                type="number"
                value={calcReps}
                onChange={(e) => setCalcReps(Number(e.target.value))}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid var(--border)", color: "var(--white)", borderRadius: "4px" }}
              />
            </div>
            <div style={{ background: "rgba(255, 94, 20, 0.1)", padding: "10px", borderRadius: "4px", border: "1px solid var(--orange)", textAlign: "center" }}>
              <span style={{ fontSize: "9px", color: "var(--orange)", display: "block", fontWeight: "700" }}>ESTIMATED 1RM</span>
              <strong style={{ fontSize: "20px", fontFamily: "Poppins, sans-serif" }}>{estimated1RM} KG</strong>
            </div>
          </div>
        </section>

        {/* DAILY SLEEP & RECOVERY TRACKER */}
        <section className="dashboard-card" style={{ marginBottom: "20px", border: "1px solid var(--border)" }}>
          <div className="card-header">
            <div>
              <span className="section-label">RECOVERY METRICS</span>
              <h2>Sleep & Readiness Check-In</h2>
            </div>
          </div>
          <form onSubmit={handleSaveRecovery} style={{ marginTop: "15px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
              <div>
                <label style={{ fontSize: "10px", color: "var(--gray)", display: "block", marginBottom: "5px" }}>SLEEP HOURS LAST NIGHT</label>
                <select
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid var(--border)", color: "var(--white)", borderRadius: "4px" }}
                >
                  <option value="Under 5">Under 5 Hours</option>
                  <option value="5-6">5 - 6 Hours</option>
                  <option value="7-8">7 - 8 Hours (Optimal)</option>
                  <option value="9+">9+ Hours</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "10px", color: "var(--gray)", display: "block", marginBottom: "5px" }}>MUSCLE SORENESS (DOMS)</label>
                <select
                  value={sorenessLevel}
                  onChange={(e) => setSorenessLevel(e.target.value)}
                  style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid var(--border)", color: "var(--white)", borderRadius: "4px" }}
                >
                  <option value="Low">Low / Fresh</option>
                  <option value="Moderate">Moderate / Normal</option>
                  <option value="High">High / Heavy Fatigue</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: "15px", display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="secondary-btn" style={{ minHeight: "35px", padding: "0 20px", fontSize: "11px" }}>Save Check-In</button>
            </div>
          </form>
        </section>

        {/* HERO BANNER */}
        <section className="dashboard-banner">
          <div>
            <span>
              PROGRESSIVE OVERLOAD
            </span>
            <h2>
              Keep pushing.
              <br />
              <strong>
                Keep progressing.
              </strong>
            </h2>
            <p>
              Every completed workout helps
              OverloadFit understand your performance
              and adjust your training targets.
            </p>
          </div>

          <Link
            to="/workout/log"
            className="primary-btn"
          >
            Start Workout
            <i className="bi bi-arrow-right"></i>
          </Link>
        </section>

        {/* STATISTICS */}
        <section className="dashboard-stats">
          <div className="stat-card highlight">
            <span>
              TOTAL WORKOUTS
            </span>
            <strong>
              {totalWorkouts}
            </strong>
            <small>
              Sessions completed
            </small>
          </div>

          <div className="stat-card">
            <span>
              SUCCESS RATE
            </span>
            <strong>
              {successRate}%
            </strong>
            <small>
              {successfulWorkouts} successful sessions
            </small>
          </div>

          <div className="stat-card">
            <span>
              FAILED
            </span>
            <strong>
              {failedWorkouts}
            </strong>
            <small>
              Sessions requiring review
            </small>
          </div>

          <div className="stat-card highlight">
            <span>
              TOTAL VOLUME
            </span>
            <strong>
              {totalVolume}
            </strong>
            <small>
              kg lifted
            </small>
          </div>
        </section>

        {/* TODAY + TARGET */}
        <section className="dashboard-grid">
          {/* TODAY'S WORKOUT */}
          <div className="dashboard-card workout-preview">
            <div className="card-header">
              <div>
                <span className="section-label">
                  TODAY'S FOCUS
                </span>
                <h2>
                  Today's Workout
                </h2>
              </div>

              <Link to="/plan">
                View Plan
                {" "}
                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </div>

            <div className="workout-list">
              {nextTarget ? (
                <div className="workout-item">
                  <div>
                    <strong>
                      {nextTarget.exerciseId?.name ||
                        "Next Exercise"}
                    </strong>
                    <span>
                      {nextTarget.targetSets || 0}
                      {" sets × "}
                      {nextTarget.targetReps || 0}
                      {" reps"}
                    </span>
                  </div>

                  <div className="workout-target">
                    <strong>
                      {nextTarget.currentWeight || 0} kg
                    </strong>
                    <span>
                      Current Target
                    </span>
                  </div>
                </div>
              ) : (
                <div className="workout-item">
                  <div>
                    <strong>
                      No active target
                    </strong>
                    <span>
                      Complete your assessment or
                      generate a workout plan.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {nextTarget && (
              <Link
                to="/workout/log"
                className="secondary-btn"
                style={{
                  marginTop: "20px"
                }}
              >
                Log This Workout
                <i className="bi bi-arrow-right"></i>
              </Link>
            )}
          </div>

          {/* NEXT TARGET */}
          <div className="dashboard-card next-target-card">
            <div className="card-header">
              <div>
                <span className="section-label">
                  NEXT TARGET
                </span>
                <h2>
                  Progressive Goal
                </h2>
              </div>

              <span className="target-status">
                {nextTarget
                  ? nextTarget.status || "ACTIVE"
                  : "READY"}
              </span>
            </div>

            {nextTarget ? (
              <div className="next-target-content">
                <span>
                  EXERCISE
                </span>
                <strong>
                  {nextTarget.exerciseId?.name ||
                    "Exercise"}
                </strong>

                <div className="target-details">
                  <div>
                    <span>
                      WEIGHT
                    </span>
                    <strong>
                      {nextTarget.currentWeight || 0} kg
                    </strong>
                  </div>

                  <div>
                    <span>
                      TARGET
                    </span>
                    <strong>
                      {nextTarget.targetSets || 0}
                      {" × "}
                      {nextTarget.targetReps || 0}
                    </strong>
                  </div>

                  <div>
                    <span>
                      FAILURES
                    </span>
                    <strong>
                      {nextTarget.failureCount || 0}
                    </strong>
                  </div>
                </div>

                <div className="target-progress">
                  <div className="target-progress-bar">
                    <div
                      style={{
                        width: `${targetProgress}%`
                      }}
                    ></div>
                  </div>
                  <span>
                    {targetProgress}% target progress
                  </span>
                </div>

                <Link
                  to="/workout/log"
                  className="primary-btn"
                  style={{
                    marginTop: "25px"
                  }}
                >
                  Start Workout
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            ) : (
              <div className="next-target-content">
                <span>
                  STATUS
                </span>
                <strong>
                  Ready
                </strong>
                <small>
                  Your next progressive overload
                  target will appear here.
                </small>

                <Link
                  to="/plan"
                  className="primary-btn"
                  style={{
                    marginTop: "25px"
                  }}
                >
                  View Plan
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* QUICK GYM NOTES SCRATCHPAD */}
        <section
          className="dashboard-card"
          style={{
            marginTop: "15px"
          }}
        >
          <div className="card-header">
            <div>
              <span className="section-label">SCRATCHPAD</span>
              <h2>Quick Gym Notes</h2>
            </div>
          </div>
          <form onSubmit={handleSaveNotes} style={{ marginTop: "20px" }}>
            <textarea
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              placeholder="Jot down quick thoughts, PR goals, or machine settings for today..."
              rows="3"
              style={{
                width: "100%",
                padding: "12px",
                background: "#111",
                border: "1px solid var(--border)",
                color: "var(--white)",
                borderRadius: "4px",
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit"
              }}
            ></textarea>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
              <small style={{ color: "var(--gray)" }}>
                {savedNotes ? "Notes saved locally." : "No notes saved yet."}
              </small>
              <button type="submit" className="primary-btn" style={{ minHeight: "40px", padding: "0 20px" }}>
                Save Notes
              </button>
            </div>
          </form>
          {savedNotes && (
            <div style={{ marginTop: "15px", padding: "12px", background: "rgba(255, 94, 20, 0.05)", borderLeft: "3px solid var(--orange)" }}>
              <strong style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--orange)" }}>Saved Scratchpad:</strong>
              <p style={{ marginTop: "5px", color: "var(--gray)", fontSize: "12px", whiteSpace: "pre-wrap" }}>{savedNotes}</p>
            </div>
          )}
        </section>

        {/* PROGRESS SNAPSHOT */}
        <section
          className="dashboard-card"
          style={{
            marginTop: "15px"
          }}
        >
          <div className="card-header">
            <div>
              <span className="section-label">
                PERFORMANCE
              </span>
              <h2>
                Progress Snapshot
              </h2>
            </div>

            <Link to="/progress">
              Full Progress
              {" "}
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>

          <div className="dashboard-progress-grid">
            <div className="progress-summary-item">
              <div className="progress-summary-icon">
                <i className="bi bi-trophy-fill"></i>
              </div>
              <div>
                <span>
                  Successful Workouts
                </span>
                <strong>
                  {successfulWorkouts}
                </strong>
              </div>
            </div>

            <div className="progress-summary-item">
              <div className="progress-summary-icon">
                <i className="bi bi-activity"></i>
              </div>
              <div>
                <span>
                  Success Rate
                </span>
                <strong>
                  {successRate}%
                </strong>
              </div>
            </div>

            <div className="progress-summary-item">
              <div className="progress-summary-icon">
                <i className="bi bi-bar-chart-fill"></i>
              </div>
              <div>
                <span>
                  Total Volume
                </span>
                <strong>
                  {totalVolume} kg
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section
          className="dashboard-card"
          style={{
            marginTop: "15px"
          }}
        >
          <div className="card-header">
            <div>
              <span className="section-label">
                ACTIVITY
              </span>
              <h2>
                Recent Workouts
              </h2>
            </div>

            <Link to="/progress">
              View History
              {" "}
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>

          <div className="workout-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div
                  className="workout-item"
                  key={
                    activity._id ||
                    activity.id ||
                    index
                  }
                >
                  <div>
                    <strong>
                      {activity.exerciseId?.name ||
                        activity.exercise?.name ||
                        activity.exercise ||
                        "Workout Session"}
                    </strong>
                    <span>
                      {formatActivityDate(
                        activity.createdAt ||
                        activity.date ||
                        activity.completedAt
                      )}
                    </span>
                  </div>

                  <div className="workout-target">
                    <strong>
                      {getActivityStatus(activity)}
                    </strong>
                    <span>
                      {activity.weight
                        ? `${activity.weight} kg`
                        : "Training session"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="workout-item">
                <div>
                  <strong>
                    No recent workouts
                  </strong>
                  <span>
                    Start logging your workouts to
                    see your activity here.
                  </span>
                </div>

                <Link to="/workout/log">
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section
          className="dashboard-card"
          style={{
            marginTop: "15px"
          }}
        >
          <div className="card-header">
            <div>
              <span className="section-label">
                SHORTCUTS
              </span>
              <h2>
                Quick Actions
              </h2>
            </div>
          </div>

          <div className="workout-list">
            <Link
              to="/workout/log"
              className="workout-item"
            >
              <div>
                <strong>
                  Start Workout
                </strong>
                <span>
                  Log today's training session
                </span>
              </div>
              <i className="bi bi-lightning-charge-fill"></i>
            </Link>

            <Link
              to="/plan"
              className="workout-item"
            >
              <div>
                <strong>
                  Workout Plan
                </strong>
                <span>
                  View your personalized training plan
                </span>
              </div>
              <i className="bi bi-clipboard2-check-fill"></i>
            </Link>

            <Link
              to="/progress"
              className="workout-item"
            >
              <div>
                <strong>
                  Progress
                </strong>
                <span>
                  Review your training performance
                </span>
              </div>
              <i className="bi bi-graph-up-arrow"></i>
            </Link>

            <Link
              to="/profile"
              className="workout-item"
            >
              <div>
                <strong>
                  Profile
                </strong>
                <span>
                  Update your fitness information
                </span>
              </div>
              <i className="bi bi-person-fill"></i>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;