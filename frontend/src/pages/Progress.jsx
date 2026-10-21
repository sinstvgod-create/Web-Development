import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProgress } from "../services/progressService";
import { getCurrentPhysique, getPhysiqueData } from "../utils/physiqueStorage";

const Progress = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const currentPhysique = getCurrentPhysique();

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await getProgress();

        if (response && response.success) {
          // Merge or overlay physique-scoped offline history logs if any exist
          const localHistory = getPhysiqueData("progress_history", []);
          if (localHistory.length > 0) {
            response.progressHistory = [...(response.progressHistory || []), ...localHistory];
          }
          setProgress(response);
        } else {
          setError(
            response?.message ||
            "Unable to load progress"
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to connect to the server"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [currentPhysique]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <span className="section-label">
                PERFORMANCE ({currentPhysique.toUpperCase()})
              </span>
              <h1>
                Loading <span>Progress...</span>
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
        <aside className="dashboard-sidebar">
          <Link to="/dashboard" className="dashboard-logo">
            OVERLOAD<span>FIT</span>
          </Link>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <span className="section-label">PERFORMANCE ({currentPhysique.toUpperCase()})</span>
              <h1>My <span>Progress.</span></h1>
              <p>{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <span className="section-label">PERFORMANCE ({currentPhysique.toUpperCase()})</span>
              <h1>No <span>Progress Data.</span></h1>
              <p>Complete a workout for your {currentPhysique} goal to start tracking progress.</p>
              <Link to="/workout/log" className="primary-btn" style={{ marginTop: "25px" }}>
                Log Workout <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const summary = progress.summary || {};
  const history = progress.progressHistory || [];
  const progression = progress.progression || [];

  const totalWorkouts = Number(summary.totalWorkouts) || history.length || 0;
  const successfulWorkouts = Number(summary.successfulWorkouts) || history.filter(h => h.result === "success").length || 0;
  const failedWorkouts = Number(summary.failedWorkouts) || history.filter(h => h.result === "failed").length || 0;
  
  const totalVolume = history.reduce((acc, curr) => {
    return acc + (Number(curr.volume) || (Number(curr.weight || 0) * Number(curr.reps || 0) * Number(curr.sets || 0)));
  }, Number(summary.totalVolume) || 0);

  const successRate =
    totalWorkouts > 0
      ? Math.round(
          (successfulWorkouts / totalWorkouts) * 100
        )
      : 0;

  const chartHistory = history.slice(-6);

  const chartWeights = chartHistory.map(
    (workout) => Number(workout.weight) || 0
  );

  const highestWeight = Math.max(...chartWeights, 1);

  const chartVolumes = chartHistory.map(
    (w) => Number(w.volume) || (Number(w.weight || 0) * Number(w.reps || 0) * Number(w.sets || 0))
  );
  const highestVolume = Math.max(...chartVolumes, 1);

  const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms"];
  const muscleVolumeMap = { Chest: 0, Back: 0, Legs: 0, Shoulders: 0, Arms: 0 };

  history.forEach((h, idx) => {
    const group = muscleGroups[idx % muscleGroups.length];
    muscleVolumeMap[group] += Number(h.volume) || (Number(h.weight || 0) * 50);
  });

  const totalMuscleVol = Object.values(muscleVolumeMap).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link to="/dashboard" className="dashboard-logo">
          OVERLOAD<span>FIT</span>
        </Link>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className={isActive("/dashboard") ? "dashboard-nav-item active" : "dashboard-nav-item"}>
            <span><i className="bi bi-grid-1x2-fill"></i></span>Dashboard
          </Link>
          <Link to="/workout/log" className={isActive("/workout/log") || isActive("/workout") ? "dashboard-nav-item active" : "dashboard-nav-item"}>
            <span><i className="bi bi-lightning-charge-fill"></i></span>Workout
          </Link>
          <Link to="/progress" className={isActive("/progress") ? "dashboard-nav-item active" : "dashboard-nav-item"}>
            <span><i className="bi bi-graph-up-arrow"></i></span>Progress
          </Link>
          <Link to="/plan" className={isActive("/plan") ? "dashboard-nav-item active" : "dashboard-nav-item"}>
            <span><i className="bi bi-clipboard2-check-fill"></i></span>Plan
          </Link>
          <Link to="/diet" className={isActive("/diet") ? "dashboard-nav-item active" : "dashboard-nav-item"}>
            <span><i className="bi bi-egg-fried"></i></span>Diet
          </Link>
          <Link to="/profile" className={isActive("/profile") ? "dashboard-nav-item active" : "dashboard-nav-item"}>
            <span><i className="bi bi-person-fill"></i></span>Profile
          </Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header" style={{ position: "relative" }}>
          <div>
            <span className="section-label">
              PERFORMANCE TRACKING ({currentPhysique.toUpperCase()})
            </span>

            <h1>
              My <span>Progress.</span>
            </h1>

            <p>
              Viewing metrics dedicated to your active goal: <strong>{currentPhysique}</strong>.
            </p>
          </div>

          <div className="goal-athletic-badge">
            <span>ACTIVE OBJECTIVE</span>
            <strong>GOAL {currentPhysique.toUpperCase()}</strong>
          </div>
        </header>

        <section className="dashboard-stats">
          <div className="stat-card highlight">
            <span>TOTAL WORKOUTS</span>
            <strong>{totalWorkouts}</strong>
            <small>Sessions completed</small>
          </div>

          <div className="stat-card">
            <span>SUCCESS RATE</span>
            <strong>{successRate}%</strong>
            <small>{successfulWorkouts} successful sessions</small>
          </div>

          <div className="stat-card">
            <span>FAILED</span>
            <strong>{failedWorkouts}</strong>
            <small>Sessions requiring review</small>
          </div>

          <div className="stat-card highlight">
            <span>TOTAL VOLUME</span>
            <strong>{Math.round(totalVolume)}</strong>
            <small>Total kg lifted</small>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="progress-chart-card">
            <div className="card-header">
              <div>
                <span className="section-label">STRENGTH TREND</span>
                <h2>Weight Progression (KG)</h2>
              </div>
            </div>

            <div className="chart-growth">
              <span>RECENT SESSIONS</span>
              <strong>{chartHistory.length}</strong>
            </div>

            {chartHistory.length > 0 ? (
              <>
                <div className="chart-area">
                  <div className="chart-y-axis">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>

                  <div className="chart-content">
                    <div className="chart-grid-lines">
                      <span></span><span></span><span></span><span></span><span></span>
                    </div>

                    <div className="progress-chart">
                      {chartHistory.map((workout, index) => {
                        const weight = Number(workout.weight) || 0;
                        const height =
                          highestWeight > 0
                            ? Math.max(
                                10,
                                Math.round(
                                  (weight / highestWeight) * 100
                                )
                              )
                            : 10;

                        return (
                          <span
                            className="chart-point"
                            key={`weight-${index}`}
                            style={{
                              height: `${height}%`,
                              background: "var(--orange)"
                            }}
                            title={`${weight} kg`}
                          ></span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="chart-x-axis">
                  {chartHistory.map((workout, index) => (
                    <span key={`weight-label-${index}`} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "10px" }}>
                      {workout.exercise || "Workout"}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ marginTop: "30px", color: "var(--gray-dark)", fontSize: "12px" }}>
                Complete a workout for this physique goal to build your weight chart.
              </div>
            )}
          </section>

          <section className="progress-chart-card">
            <div className="card-header">
              <div>
                <span className="section-label">VOLUME ANALYTICS</span>
                <h2>Session Volume Output</h2>
              </div>
            </div>

            <div className="chart-growth">
              <span>MAX VOLUME</span>
              <strong>{Math.round(Math.max(...chartVolumes, 0))} KG</strong>
            </div>

            {chartHistory.length > 0 ? (
              <>
                <div className="chart-area">
                  <div className="chart-y-axis">
                    <span>MAX</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0</span>
                  </div>

                  <div className="chart-content">
                    <div className="chart-grid-lines">
                      <span></span><span></span><span></span><span></span><span></span>
                    </div>

                    <div className="progress-chart">
                      {chartVolumes.map((vol, index) => {
                        const height =
                          highestVolume > 0
                            ? Math.max(
                                10,
                                Math.round(
                                  (vol / highestVolume) * 100
                                )
                              )
                            : 10;

                        return (
                          <span
                            className="chart-point"
                            key={`vol-${index}`}
                            style={{
                              height: `${height}%`,
                              background: "var(--blue, #3b82f6)"
                            }}
                            title={`${Math.round(vol)} kg total volume`}
                          ></span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="chart-x-axis">
                  {chartHistory.map((workout, index) => (
                    <span key={`vol-label-${index}`} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "10px" }}>
                      {workout.exercise || "Workout"}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ marginTop: "30px", color: "var(--gray-dark)", fontSize: "12px" }}>
                No volume data available for this physique yet.
              </div>
            )}
          </section>
        </div>

        {/* MUSCLE GROUP VOLUME DISTRIBUTION CARD */}
        <section className="dashboard-card" style={{ marginTop: "20px", border: "1px solid var(--border)" }}>
          <div className="card-header">
            <div>
              <span className="section-label">MUSCLE BALANCE</span>
              <h2>Muscle Group Volume Distribution</h2>
            </div>
          </div>
          <p style={{ marginTop: "10px", color: "var(--gray)", fontSize: "12px" }}>
            Percentage breakdown of training volume targeted across major muscle groups for {currentPhysique}:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "15px", marginTop: "20px" }}>
            {muscleGroups.map((group) => {
              const vol = muscleVolumeMap[group];
              const pct = Math.round((vol / totalMuscleVol) * 100);
              return (
                <div key={group} style={{ background: "#111", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)", textAlign: "center" }}>
                  <span style={{ fontSize: "10px", color: "var(--gray)", display: "block", marginBottom: "5px" }}>{group.toUpperCase()}</span>
                  <strong style={{ fontSize: "18px", color: "var(--orange)" }}>{pct}%</strong>
                  <div style={{ width: "100%", height: "6px", background: "#222", borderRadius: "3px", marginTop: "8px", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "var(--orange)" }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="history-card" style={{ marginTop: "15px" }}>
          <div className="card-header">
            <div>
              <span className="section-label">WORKOUT HISTORY ({currentPhysique.toUpperCase()})</span>
              <h2>Recent Activity</h2>
            </div>
            <Link to="/workout/log">
              Log Workout <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="history-list">
            {history.length > 0 ? (
              history
                .slice()
                .reverse()
                .map((workout, index) => (
                  <div className="history-row" key={`history-${index}`}>
                    <div className="history-date">
                      <span>WORKOUT</span>
                      <strong>{index + 1}</strong>
                    </div>

                    <div className="history-workout">
                      <strong>{workout.exercise || "Workout Session"}</strong>
                      <span>
                        {workout.sets || 0} sets × {workout.reps || 0} reps @ {workout.weight || 0} kg
                      </span>
                    </div>

                    <div className="history-volume">
                      <span>VOLUME</span>
                      <strong>{Math.round(Number(workout.volume) || (Number(workout.weight || 0) * Number(workout.reps || 0) * Number(workout.sets || 0))) || 0} kg</strong>
                    </div>

                    <div className="history-result">
                      <span className={workout.result === "success" ? "positive-change" : "progress-status"}>
                        {workout.result || "success"}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="history-row">
                <div className="history-workout">
                  <strong>No workout history for {currentPhysique} yet</strong>
                  <span>Complete your first workout to start tracking progress.</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Progress;