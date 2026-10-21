import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  getProfile,
  updateProfile
} from "../services/profileService";

const Assessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "",
    experience: "",
    activityLevel: "",
    workoutDays: 4,
    equipment: "",
    physiqueGoal: "",
    dietPreference: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // SPECIAL FEATURE: Real-time BMI Calculator derived from height and weight
  const bmiValue =
    formData.height && formData.weight
      ? (
          formData.weight /
          Math.pow(formData.height / 100, 2)
        ).toFixed(1)
      : null;

  const getBmiCategory = (bmi) => {
    if (!bmi) return "";
    if (bmi < 18.5) return "Underweight (Bulking recommended)";
    if (bmi >= 18.5 && bmi < 25) return "Normal Weight (Optimal)";
    if (bmi >= 25 && bmi < 30) return "Overweight (Lean cutting recommended)";
    return "High BMI (Structured athletic training recommended)";
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();

        if (response.success && response.user) {
          const profile = response.user;

          setFormData({
            age: profile.age || "",
            height: profile.height || "",
            weight: profile.weight || "",
            gender: profile.gender || "",
            experience: profile.experience || "",
            activityLevel: profile.activityLevel || "",
            workoutDays: profile.workoutDays || 4,
            equipment: profile.equipment || "",
            physiqueGoal: profile.physiqueGoal || "",
            dietPreference: profile.dietPreference || ""
          });
        }
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Unable to load your profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "age" ||
        name === "height" ||
        name === "weight" ||
        name === "workoutDays"
          ? Number(value)
          : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const response = await updateProfile(formData);

      if (response.success) {
        setMessage("Fitness assessment saved successfully.");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError(
          response.message ||
          "Unable to save assessment"
        );
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to save assessment"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="assessment-page">
        <div className="assessment-main">
          <p>Loading fitness assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-page">

      {/* HEADER */}
      <header className="assessment-header">

        <div className="auth-brand">
          GYM<span>FIT</span>
        </div>

        <div className="assessment-progress">
          <span>FITNESS ASSESSMENT</span>

          <div className="assessment-progress-line">
            <div className="assessment-progress-fill"></div>
          </div>

          <span>COMPLETE</span>
        </div>

      </header>

      {/* MAIN */}
      <main className="assessment-main">

        {/* INTRO */}
        <div className="assessment-intro">

          <span className="section-label">
            PERSONALIZED FITNESS
          </span>

          <h1>
            Fitness <span>Assessment</span>
          </h1>

          <p>
            Tell us about yourself so GymFit can
            create your personalized workout and diet plan.
          </p>

        </div>

        {/* FORM */}
        <form
          className="assessment-form"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}
          <section className="assessment-section">

            <div className="assessment-section-heading">

              <span>01</span>

              <div>
                <h2>Basic Information</h2>

                <p>
                  Tell us about your body measurements.
                </p>
              </div>

            </div>

            <div className="assessment-grid">

              <div className="form-group">
                <label>AGE</label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="13"
                  max="100"
                  placeholder="Enter your age"
                  required
                />
              </div>

              <div className="form-group">
                <label>HEIGHT (CM)</label>

                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="50"
                  max="250"
                  placeholder="Enter your height"
                  required
                />
              </div>

              <div className="form-group">
                <label>WEIGHT (KG)</label>

                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="20"
                  max="300"
                  step="0.1"
                  placeholder="Enter your weight"
                  required
                />
              </div>

              <div className="form-group">
                <label>GENDER</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

            </div>

            {/* SPECIAL FEATURE: LIVE BMI PREVIEW CARD */}
            {bmiValue && (
              <div style={{ marginTop: "20px", padding: "15px", background: "rgba(255, 94, 20, 0.08)", border: "1px solid var(--orange)", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <span style={{ color: "var(--orange)", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>Live Body Composition Preview</span>
                  <strong style={{ fontSize: "18px", fontFamily: "Poppins, sans-serif" }}>BMI: {bmiValue}</strong>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: "var(--gray)", fontSize: "11px", display: "block" }}>{getBmiCategory(Number(bmiValue))}</span>
                </div>
              </div>
            )}

          </section>

          {/* TRAINING INFORMATION */}
          <section className="assessment-section">

            <div className="assessment-section-heading">

              <span>02</span>

              <div>
                <h2>Training Information</h2>

                <p>
                  Help us understand your current training level.
                </p>
              </div>

            </div>

            <div className="assessment-grid">

              <div className="form-group">
                <label>EXPERIENCE</label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Experience
                  </option>

                  <option value="beginner">
                    Beginner
                  </option>

                  <option value="intermediate">
                    Intermediate
                  </option>

                  <option value="advanced">
                    Advanced
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>ACTIVITY LEVEL</label>

                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Activity Level
                  </option>

                  <option value="sedentary">
                    Sedentary
                  </option>

                  <option value="light">
                    Light
                  </option>

                  <option value="moderate">
                    Moderate
                  </option>

                  <option value="very-active">
                    Very Active
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>WORKOUT DAYS PER WEEK</label>

                <select
                  name="workoutDays"
                  value={formData.workoutDays}
                  onChange={handleChange}
                  required
                >
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={4}>4 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={6}>6 Days</option>
                </select>
              </div>

            </div>

          </section>

          {/* EQUIPMENT */}
          <section className="assessment-section">

            <div className="assessment-section-heading">

              <span>03</span>

              <div>
                <h2>Equipment</h2>

                <p>
                  Select the equipment available to you.
                </p>
              </div>

            </div>

            <div className="option-grid">

              <label className="option-card">

                <input
                  type="radio"
                  name="equipment"
                  value="Gym"
                  checked={formData.equipment === "Gym"}
                  onChange={handleChange}
                  required
                />

                <div className="option-content">
                  <strong>FULL GYM</strong>
                  <span>
                    Barbells, machines and free weights
                  </span>
                </div>

              </label>

              <label className="option-card">

                <input
                  type="radio"
                  name="equipment"
                  value="Dumbbell"
                  checked={formData.equipment === "Dumbbell"}
                  onChange={handleChange}
                />

                <div className="option-content">
                  <strong>DUMBBELLS</strong>
                  <span>
                    Dumbbells and basic equipment
                  </span>
                </div>

              </label>

              <label className="option-card">

                <input
                  type="radio"
                  name="equipment"
                  value="Home"
                  checked={formData.equipment === "Home"}
                  onChange={handleChange}
                />

                <div className="option-content">
                  <strong>HOME</strong>
                  <span>
                    Bodyweight and home workouts
                  </span>
                </div>

              </label>

            </div>

          </section>

          {/* GOAL */}
          <section className="assessment-section">

            <div className="assessment-section-heading">

              <span>04</span>

              <div>
                <h2>Fitness Goal</h2>

                <p>
                  What physique are you working towards?
                </p>
              </div>

            </div>

            <div className="goal-option-grid">

              <label className="goal-option">

                <input
                  type="radio"
                  name="physiqueGoal"
                  value="lean"
                  checked={formData.physiqueGoal === "lean"}
                  onChange={handleChange}
                  required
                />

                <div>
                  <strong>LEAN</strong>
                  <span>
                    Build a lean and defined physique
                  </span>
                </div>

              </label>

              <label className="goal-option">

                <input
                  type="radio"
                  name="physiqueGoal"
                  value="bulk"
                  checked={formData.physiqueGoal === "bulk"}
                  onChange={handleChange}
                />

                <div>
                  <strong>BULK</strong>
                  <span>
                    Focus on muscle and strength
                  </span>
                </div>

              </label>

              <label className="goal-option">

                <input
                  type="radio"
                  name="physiqueGoal"
                  value="athletic"
                  checked={formData.physiqueGoal === "athletic"}
                  onChange={handleChange}
                />

                <div>
                  <strong>ATHLETIC</strong>
                  <span>
                    Improve strength and performance
                  </span>
                </div>

              </label>

              <label className="goal-option">

                <input
                  type="radio"
                  name="physiqueGoal"
                  value="toned"
                  checked={formData.physiqueGoal === "toned"}
                  onChange={handleChange}
                />

                <div>
                  <strong>TONED</strong>
                  <span>
                    Build definition and fitness
                  </span>
                </div>

              </label>

            </div>

          </section>

          {/* DIET */}
          <section className="assessment-section">

            <div className="assessment-section-heading">

              <span>05</span>

              <div>
                <h2>Diet Preference</h2>

                <p>
                  Select your preferred diet.
                </p>
              </div>

            </div>

            <div className="option-grid">

              <label className="option-card">

                <input
                  type="radio"
                  name="dietPreference"
                  value="vegetarian"
                  checked={
                    formData.dietPreference === "vegetarian"
                  }
                  onChange={handleChange}
                  required
                />

                <div className="option-content">
                  <strong>VEGETARIAN</strong>
                  <span>
                    No meat or fish
                  </span>
                </div>

              </label>

              <label className="option-card">

                <input
                  type="radio"
                  name="dietPreference"
                  value="non-vegetarian"
                  checked={
                    formData.dietPreference === "non-vegetarian"
                  }
                  onChange={handleChange}
                />

                <div className="option-content">
                  <strong>NON-VEGETARIAN</strong>
                  <span>
                    Includes meat and fish
                  </span>
                </div>

              </label>

              <label className="option-card">

                <input
                  type="radio"
                  name="dietPreference"
                  value="vegan"
                  checked={
                    formData.dietPreference === "vegan"
                  }
                  onChange={handleChange}
                />

                <div className="option-content">
                  <strong>VEGAN</strong>
                  <span>
                    Plant-based diet
                  </span>
                </div>

              </label>

              <label className="option-card">

                <input
                  type="radio"
                  name="dietPreference"
                  value="eggetarian"
                  checked={
                    formData.dietPreference === "eggetarian"
                  }
                  onChange={handleChange}
                />

                <div className="option-content">
                  <strong>EGGETARIAN</strong>
                  <span>
                    Vegetarian with eggs
                  </span>
                </div>

              </label>

            </div>

          </section>

          {/* SUBMIT */}
          <div className="assessment-submit">

            <div>

              {error && (
                <p style={{ color: "var(--red)" }}>
                  {error}
                </p>
              )}

              {message && (
                <p style={{ color: "var(--green)" }}>
                  {message}
                </p>
              )}

              {!error && !message && (
                <p>
                  Your answers will be used to personalize
                  your workout and nutrition plan.
                </p>
              )}

            </div>

            <button
              className="primary-btn assessment-submit-btn"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Assessment →"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
};

export default Assessment;