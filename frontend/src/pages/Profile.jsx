import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getProfile,
  updateProfile
} from "../services/profileService";
import { getCurrentPhysique, setPhysiqueData } from "../utils/physiqueStorage";

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Toggle between View Mode and Edit Mode
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "male",
    experience: "beginner",
    activityLevel: "moderate",
    workoutDays: 4,
    equipment: "gym",
    physiqueGoal: getCurrentPhysique(),
    dietPreference: "non-vegetarian"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentPhysique = getCurrentPhysique();

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();

        // Check and pull assessment profile data from backend response
        const profileData = response.user || response.profile || response;

        if (profileData) {
          const fetchedGoal = profileData.physiqueGoal || getCurrentPhysique();
          
          setFormData({
            age: profileData.age || "",
            height: profileData.height || "",
            weight: profileData.weight || "",
            gender: profileData.gender || "male",
            experience: profileData.experience || "beginner",
            activityLevel: profileData.activityLevel || "moderate",
            workoutDays: profileData.workoutDays || 4,
            equipment: profileData.equipment || "gym",
            physiqueGoal: fetchedGoal,
            dietPreference: profileData.dietPreference || "non-vegetarian"
          });
          
          localStorage.setItem("gymfit_physique_goal", fetchedGoal);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Unable to load profile assessment data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = { ...previous, [name]: value };
      if (name === "physiqueGoal") {
        localStorage.setItem("gymfit_physique_goal", value);
      }
      return updated;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const assessmentPayload = {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        workoutDays: Number(formData.workoutDays)
      };

      localStorage.setItem("gymfit_physique_goal", formData.physiqueGoal);

      const response = await updateProfile(
        assessmentPayload
      );

      if (response.success || response) {
        setMessage("Assessment data updated successfully.");
        setTimeout(() => {
          setIsEditing(false);
          setMessage("");
          window.location.reload(); // Reload to sync physique data across app
        }, 1000);
      } else {
        setError(
          response.message ||
          "Unable to update profile assessment"
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to connect to the server"
      );
    } finally {
      setSaving(false);
    }
  };

  // Real-time BMI calculation helper
  const calculateBMI = () => {
    const hM = Number(formData.height) / 100;
    const wKg = Number(formData.weight);
    if (!hM || !wKg || hM <= 0) return { bmi: "--", category: "Enter height & weight" };
    const bmiVal = (wKg / (hM * hM)).toFixed(1);
    let cat = "Normal weight";
    if (bmiVal < 18.5) cat = "Underweight";
    else if (bmiVal >= 25 && bmiVal < 30) cat = "Overweight";
    else if (bmiVal >= 30) cat = "Obese";
    return { bmi: bmiVal, category: cat };
  };

  const bmiResult = calculateBMI();

  const inputFieldStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "#141414",
    border: "1px solid var(--border)",
    color: "var(--white)",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    marginTop: "6px"
  };

  const labelStyle = {
    fontSize: "10px",
    fontWeight: "700",
    color: "var(--gray)",
    letterSpacing: "0.5px"
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <span className="section-label">ASSESSMENT PROFILE</span>
              <h1>Loading <span>Assessment Data...</span></h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

        <header className="dashboard-header" style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <span className="section-label">ASSESSMENT METRICS</span>
            <h1>My <span>Assessment Profile.</span></h1>
            <p>Review the exact parameters and information provided during your fitness assessment.</p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="primary-btn"
              style={{ padding: "0 20px", minHeight: "40px" }}
            >
              <i className="bi bi-pencil-square"></i> Edit Assessment
            </button>
          )}
        </header>

        {/* PROFILE OVERVIEW CARD */}
        <section className="profile-overview" style={{ border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div className="profile-avatar" style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,94,20,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--orange)", fontSize: "24px", border: "1px solid var(--orange)" }}>
              <i className="bi bi-person-fill"></i>
            </div>
            <div>
              <span className="section-label">ASSESSED ATHLETE</span>
              <h2 style={{ fontSize: "18px", marginTop: "2px" }}>{user?.name || "OverloadFit Member"}</h2>
              <span style={{ fontSize: "11px", color: "var(--gray)" }}>{user?.email || "member@overloadfit.com"}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ background: "#111", padding: "10px 15px", borderRadius: "6px", border: "1px solid var(--border)", textAlign: "center" }}>
              <span style={{ fontSize: "9px", color: "var(--gray)", display: "block" }}>LIVE BMI</span>
              <strong style={{ fontSize: "16px", color: "var(--orange)" }}>{bmiResult.bmi}</strong>
              <small style={{ display: "block", fontSize: "9px", color: "var(--gray-dark)" }}>{bmiResult.category}</small>
            </div>
            <div className="profile-goal" style={{ background: "#111", padding: "10px 15px", borderRadius: "6px", border: "1px solid var(--border)", textAlign: "center" }}>
              <span style={{ fontSize: "9px", color: "var(--gray)", display: "block" }}>PHYSIQUE GOAL</span>
              <strong style={{ fontSize: "16px", color: "var(--white)" }}>
                {formData.physiqueGoal.toUpperCase()}
              </strong>
            </div>
          </div>
        </section>

        {!isEditing ? (
          /* VIEW MODE: ASSESSMENT DATA DISPLAY CARD */
          <div className="dashboard-card" style={{ marginTop: "20px", border: "1px solid var(--border)" }}>
            <div className="card-header">
              <div>
                <span className="section-label">RECORDED DATA</span>
                <h2>Assessment Questionnaire Details</h2>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" }}>
              <div style={{ background: "#111", padding: "15px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "10px", color: "var(--gray)", display: "block" }}>AGE</span>
                <strong style={{ fontSize: "16px", color: "#fff" }}>{formData.age ? `${formData.age} Years` : "Not specified"}</strong>
              </div>
              <div style={{ background: "#111", padding: "15px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "10px", color: "var(--gray)", display: "block" }}>HEIGHT</span>
                <strong style={{ fontSize: "16px", color: "#fff" }}>{formData.height ? `${formData.height} cm` : "Not specified"}</strong>
              </div>
              <div style={{ background: "#111", padding: "15px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "10px", color: "var(--gray)", display: "block" }}>WEIGHT</span>
                <strong style={{ fontSize: "16px", color: "#fff" }}>{formData.weight ? `${formData.weight} kg` : "Not specified"}</strong>
              </div>
              <div style={{ background: "#111", padding: "15px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "10px", color: "var(--gray)", display: "block" }}>GENDER</span>
                <strong style={{ fontSize: "16px", color: "#fff", textTransform: "capitalize" }}>{formData.gender}</strong>
              </div>
              <div style={{ background: "#111", padding: "15px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "10px", color: "var(--gray)", display: "block" }}>EXPERIENCE LEVEL</span>
                <strong style={{ fontSize: "16px", color: "#fff", textTransform: "capitalize" }}>{formData.experience}</strong>
              </div>
              <div style={{ background: "#111", padding: "15px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "10px", color: "var(--gray)", display: "block" }}>ACTIVITY LEVEL</span>
                <strong style={{ fontSize: "16px", color: "#fff", textTransform: "capitalize" }}>{formData.activityLevel}</strong>
              </div>
              <div style={{ background: "#111", padding: "15px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "10px", color: "var(--gray)", display: "block" }}>WEEKLY WORKOUT DAYS</span>
                <strong style={{ fontSize: "16px", color: "#fff" }}>{formData.workoutDays} Days / Week</strong>
              </div>
              <div style={{ background: "#111", padding: "15px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "10px", color: "var(--gray)", display: "block" }}>EQUIPMENT ACCESS</span>
                <strong style={{ fontSize: "16px", color: "#fff", textTransform: "capitalize" }}>{formData.equipment}</strong>
              </div>
              <div style={{ background: "#111", padding: "15px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "10px", color: "var(--gray)", display: "block" }}>DIET PREFERENCE</span>
                <strong style={{ fontSize: "16px", color: "#fff", textTransform: "capitalize" }}>{formData.dietPreference}</strong>
              </div>
            </div>
          </div>
        ) : (
          /* EDIT MODE: ASSESSMENT FORM WITH PRE-FILLED DATA */
          <form
            className="profile-card"
            onSubmit={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            <div className="card-header">
              <div>
                <span className="section-label">MODIFY ASSESSMENT</span>
                <h2>Update Assessment Questionnaire</h2>
              </div>
            </div>

            <div className="profile-grid" style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px" }}>
              <div className="profile-field">
                <label style={labelStyle}>AGE</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="13"
                  max="100"
                  required
                  style={inputFieldStyle}
                />
              </div>

              <div className="profile-field">
                <label style={labelStyle}>HEIGHT (CM)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="50"
                  max="250"
                  required
                  style={inputFieldStyle}
                />
              </div>

              <div className="profile-field">
                <label style={labelStyle}>WEIGHT (KG)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="20"
                  max="300"
                  required
                  style={inputFieldStyle}
                />
              </div>

              <div className="profile-field">
                <label style={labelStyle}>GENDER</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={inputFieldStyle}
                >
                  <option value="male" style={{ background: "#141414" }}>Male</option>
                  <option value="female" style={{ background: "#141414" }}>Female</option>
                  <option value="other" style={{ background: "#141414" }}>Other</option>
                </select>
              </div>
            </div>

            <div
              className="profile-two-column"
              style={{ marginTop: "35px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}
            >
              {/* TRAINING PREFERENCES */}
              <div className="profile-card" style={{ background: "#111", padding: "20px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <div className="card-header" style={{ marginBottom: "15px" }}>
                  <div>
                    <span className="section-label">TRAINING</span>
                    <h2>Workout Preferences</h2>
                  </div>
                </div>

                <div className="profile-grid" style={{ display: "grid", gap: "12px" }}>
                  <div className="profile-field">
                    <label style={labelStyle}>EXPERIENCE</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      style={inputFieldStyle}
                    >
                      <option value="beginner" style={{ background: "#141414" }}>Beginner</option>
                      <option value="intermediate" style={{ background: "#141414" }}>Intermediate</option>
                      <option value="advanced" style={{ background: "#141414" }}>Advanced</option>
                    </select>
                  </div>

                  <div className="profile-field">
                    <label style={labelStyle}>ACTIVITY LEVEL</label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleChange}
                      style={inputFieldStyle}
                    >
                      <option value="sedentary" style={{ background: "#141414" }}>Sedentary</option>
                      <option value="light" style={{ background: "#141414" }}>Light</option>
                      <option value="moderate" style={{ background: "#141414" }}>Moderate</option>
                      <option value="very-active" style={{ background: "#141414" }}>Very Active</option>
                    </select>
                  </div>

                  <div className="profile-field">
                    <label style={labelStyle}>WORKOUT DAYS</label>
                    <select
                      name="workoutDays"
                      value={formData.workoutDays}
                      onChange={handleChange}
                      style={inputFieldStyle}
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <option key={d} value={d} style={{ background: "#141414" }}>{d} Days</option>
                      ))}
                    </select>
                  </div>

                  <div className="profile-field">
                    <label style={labelStyle}>EQUIPMENT</label>
                    <select
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleChange}
                      style={inputFieldStyle}
                    >
                      <option value="gym" style={{ background: "#141414" }}>Gym</option>
                      <option value="home" style={{ background: "#141414" }}>Home</option>
                      <option value="dumbbells" style={{ background: "#141414" }}>Dumbbells</option>
                      <option value="bodyweight" style={{ background: "#141414" }}>Bodyweight</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* GOAL & NUTRITION */}
              <div className="profile-card" style={{ background: "#111", padding: "20px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <div className="card-header" style={{ marginBottom: "15px" }}>
                  <div>
                    <span className="section-label">GOAL & NUTRITION</span>
                    <h2>Personalization</h2>
                  </div>
                </div>

                <div className="profile-grid" style={{ display: "grid", gap: "12px" }}>
                  <div className="profile-field">
                    <label style={labelStyle}>PHYSIQUE GOAL</label>
                    <select
                      name="physiqueGoal"
                      value={formData.physiqueGoal}
                      onChange={handleChange}
                      style={inputFieldStyle}
                    >
                      <option value="lean" style={{ background: "#141414" }}>1. Lean Shredded</option>
                      <option value="bulk" style={{ background: "#141414" }}>2. Hypertrophy Bulk</option>
                      <option value="power" style={{ background: "#141414" }}>3. Powerlifting Strength</option>
                      <option value="toned" style={{ background: "#141414" }}>4. Aesthetic Toned</option>
                      <option value="athletic" style={{ background: "#141414" }}>5. Athletic Functional</option>
                      <option value="recomp" style={{ background: "#141414" }}>6. Lean Recomp</option>
                      <option value="endurance" style={{ background: "#141414" }}>7. Stamina Endurance</option>
                      <option value="bodybuilder" style={{ background: "#141414" }}>8. Pro Bodybuilder</option>
                      <option value="crossfit" style={{ background: "#141414" }}>9. CrossFit Competitor</option>
                      <option value="calisthenics" style={{ background: "#141414" }}>10. Calisthenics Master</option>
                    </select>
                  </div>

                  <div className="profile-field">
                    <label style={labelStyle}>DIET PREFERENCE</label>
                    <select
                      name="dietPreference"
                      value={formData.dietPreference}
                      onChange={handleChange}
                      style={inputFieldStyle}
                    >
                      <option value="vegetarian" style={{ background: "#141414" }}>Vegetarian</option>
                      <option value="non-vegetarian" style={{ background: "#141414" }}>Non-Vegetarian</option>
                      <option value="vegan" style={{ background: "#141414" }}>Vegan</option>
                      <option value="eggetarian" style={{ background: "#141414" }}>Eggetarian</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <p style={{ color: "var(--green)", fontSize: "11px", marginTop: "25px" }}>
                <i className="bi bi-check-circle"></i> {message}
              </p>
            )}

            {error && (
              <p style={{ color: "var(--red)", fontSize: "11px", marginTop: "25px" }}>
                <i className="bi bi-exclamation-circle"></i> {error}
              </p>
            )}

            <div className="account-actions" style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
              <div>
                <span className="section-label">ASSESSMENT SETTINGS</span>
                <p style={{ fontSize: "11px", color: "var(--gray)", marginTop: "2px" }}>
                  Click save to apply changes to your assessment data.
                </p>
              </div>

              <div className="account-action-buttons" style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="secondary-btn"
                  style={{ padding: "0 20px", minHeight: "40px" }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                  style={{ padding: "0 20px", minHeight: "40px" }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                  {!saving && <i className="bi bi-check2"></i>}
                </button>
              </div>
            </div>
          </form>
        )}

      </main>

    </div>
  );
};

export default Profile;