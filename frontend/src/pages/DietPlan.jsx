import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDietPlan } from "../services/dietService";
import { getCurrentPhysique, getPhysiqueData, setPhysiqueData, getPhysiqueNutritionModifiers } from "../utils/physiqueStorage";

const DietPlan = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dietPlan, setDietPlan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Active physique goal tracking
  const currentPhysique = getCurrentPhysique();

  // Interactive daily hydration tracker scoped to active physique
  const [waterGlasses, setWaterGlasses] = useState(() => {
    return Number(getPhysiqueData("water_glasses", 0));
  });

  // Smart Grocery List generator toggle state
  const [showGroceryList, setShowGroceryList] = useState(false);

  // Custom Calorie Target Simulation Override
  const [calorieOverride, setCalorieOverride] = useState("");

  // Meal Nutrition Notes Scratchpad scoped to active physique
  const [mealNotes, setMealNotes] = useState(() => {
    return getPhysiqueData("diet_notes", "");
  });
  const [savedNotes, setSavedNotes] = useState(getPhysiqueData("diet_notes", ""));

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    setPhysiqueData("water_glasses", waterGlasses);
  }, [waterGlasses, currentPhysique]);

  useEffect(() => {
    const loadDietPlan = async () => {
      try {
        const response = await getDietPlan();

        if (response && response.success) {
          setDietPlan(response.dietPlan);
        } else {
          setError(
            response?.message || "Unable to load diet plan"
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

    loadDietPlan();
  }, []);

  const firstName = user?.name?.split(" ")[0] || "User";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    setSavedNotes(mealNotes);
    setPhysiqueData("diet_notes", mealNotes);
    alert(`Diet notes saved successfully for ${currentPhysique.toUpperCase()}!`);
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <Link to="/dashboard" className="dashboard-logo">
            OVERLOAD<span>FIT</span>
          </Link>
        </aside>
        <main className="dashboard-main">Loading diet plan...</main>
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
        <main className="dashboard-main">{error}</main>
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <Link to="/dashboard" className="dashboard-logo">
            OVERLOAD<span>FIT</span>
          </Link>
        </aside>
        <main className="dashboard-main">No diet plan found.</main>
      </div>
    );
  }

  const baseCalories = Number(dietPlan.calorieTarget) || 2000;
  const modifiers = getPhysiqueNutritionModifiers(baseCalories);
  
  // Automatically adjust base target based on selected physique modifier unless overridden
  const physiqueBaseCalories = Math.round(baseCalories * modifiers.calorieMultiplier);
  const activeCalories = calorieOverride ? Number(calorieOverride) : physiqueBaseCalories;
  
  const calorieRatio = activeCalories / baseCalories;

  const pGrams = Math.round((Number(dietPlan.proteinTarget) || 150) * modifiers.proteinMultiplier * calorieRatio);
  const cGrams = Math.round((Number(dietPlan.carbTarget) || 200) * calorieRatio);
  const fGrams = Math.round((Number(dietPlan.fatTarget) || 70) * calorieRatio);

  const proteinCals = pGrams * 4;
  const carbCals = cGrams * 4;
  const fatCals = fGrams * 9;
  const calcTotal = proteinCals + carbCals + fatCals || 1;

  const proteinPct = Math.round((proteinCals / calcTotal) * 100);
  const carbPct = Math.round((carbCals / calcTotal) * 100);
  const fatPct = Math.round((fatCals / calcTotal) * 100);

  // Safe extraction of all food items for the smart grocery list generator
  const allFoodItems = [];
  if (dietPlan.meals && Array.isArray(dietPlan.meals)) {
    dietPlan.meals.forEach((meal) => {
      if (meal.foods && Array.isArray(meal.foods)) {
        meal.foods.forEach((food) => {
          if (typeof food === "string") {
            allFoodItems.push(food);
          } else if (food && typeof food === "object") {
            const name = food.name || food.item || "Food Item";
            const qty = food.quantity || food.amount || food.serving || "";
            allFoodItems.push(qty ? `${name} (${qty})` : name);
          }
        });
      }
    });
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
        <div className="dashboard-header">
          <div>
            <span className="section-label">NUTRITION PLAN ({currentPhysique.toUpperCase()})</span>

            <h1>
              My <span>Diet Plan</span>
            </h1>

            <p>
              Tailored nutrition strategy for your active goal: <strong>{modifiers.label}</strong>.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setShowGroceryList(!showGroceryList)}
              className="secondary-btn"
              style={{ minHeight: "38px", padding: "0 15px", fontSize: "11px" }}
            >
              <i className="bi bi-cart-check-fill"></i> {showGroceryList ? "Hide Grocery List" : "Smart Grocery List"}
            </button>
            <div className="nutrition-goal-badge">
              {currentPhysique.toUpperCase()}
            </div>
          </div>
        </div>

        {/* SMART GROCERY LIST GENERATOR PANEL */}
        {showGroceryList && (
          <div className="dashboard-card" style={{ marginBottom: "20px", border: "1px solid var(--orange)", background: "rgba(255, 94, 20, 0.03)" }}>
            <div className="card-header">
              <div>
                <span className="section-label">AUTOMATED SHOPPING</span>
                <h2>Smart Grocery List</h2>
              </div>
              <span className="target-status" style={{ color: "var(--orange)" }}>
                {allFoodItems.length} Items Total
              </span>
            </div>
            <p style={{ marginTop: "10px", color: "var(--gray)", fontSize: "12px" }}>
              Here is your consolidated shopping list generated automatically from your daily meal plan:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginTop: "15px" }}>
              {allFoodItems.map((item, i) => (
                <div key={`grocery-${i}`} style={{ background: "#111", padding: "10px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <i className="bi bi-check2-square" style={{ color: "var(--orange)" }}></i>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOM CALORIE TARGET SIMULATOR */}
        <div className="dashboard-card" style={{ marginBottom: "20px", border: "1px solid var(--border)" }}>
          <div className="card-header">
            <div>
              <span className="section-label">SIMULATION TOOL</span>
              <h2>Macro & Calorie Simulator</h2>
            </div>
          </div>
          <p style={{ marginTop: "10px", color: "var(--gray)", fontSize: "12px" }}>
            Test a custom daily calorie target to preview how your macros scale for your current physique objective:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginTop: "15px", alignItems: "center" }}>
            <div>
              <label style={{ fontSize: "10px", color: "var(--gray)", display: "block", marginBottom: "5px" }}>TEST CALORIE TARGET (KCAL)</label>
              <input
                type="number"
                value={calorieOverride}
                onChange={(e) => setCalorieOverride(e.target.value)}
                placeholder={`Default: ${physiqueBaseCalories}`}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid var(--border)", color: "var(--white)", borderRadius: "4px" }}
              />
            </div>
            {calorieOverride && (
              <button
                type="button"
                onClick={() => setCalorieOverride("")}
                className="secondary-btn"
                style={{ minHeight: "36px", padding: "0 15px", fontSize: "11px", alignSelf: "flex-end" }}
              >
                Reset to Default
              </button>
            )}
          </div>
        </div>

        {/* DAILY TARGETS */}
        <div className="nutrition-targets">

          <div className="nutrition-target-card">
            <span>CALORIES</span>

            <strong>
              {activeCalories}
            </strong>

            <small>kcal / day</small>

            <div className="target-bar">
              <div style={{ width: "100%" }}></div>
            </div>

            <p>{modifiers.label}</p>
          </div>

          <div className="nutrition-target-card">
            <span>PROTEIN ({proteinPct}%)</span>

            <strong>
              {pGrams}
            </strong>

            <small>g / day</small>

            <div className="target-bar">
              <div style={{ width: `${Math.min(proteinPct, 100)}%` }}></div>
            </div>

            <p>Daily protein target</p>
          </div>

          <div className="nutrition-target-card">
            <span>CARBS ({carbPct}%)</span>

            <strong>
              {cGrams}
            </strong>

            <small>g / day</small>

            <div className="target-bar">
              <div style={{ width: `${Math.min(carbPct, 100)}%` }}></div>
            </div>

            <p>Daily carbohydrate target</p>
          </div>

          <div className="nutrition-target-card">
            <span>FAT ({fatPct}%)</span>

            <strong>
              {fGrams}
            </strong>

            <small>g / day</small>

            <div className="target-bar">
              <div style={{ width: `${Math.min(fatPct, 100)}%` }}></div>
            </div>

            <p>Daily fat target</p>
          </div>

        </div>

        {/* HYDRATION & WATER TRACKER */}
        <div className="dashboard-card" style={{ marginBottom: "20px", border: "1px solid var(--orange)" }}>
          <div className="card-header">
            <div>
              <span className="section-label">DAILY HYDRATION</span>
              <h2>Water Intake Tracker ({currentPhysique.toUpperCase()})</h2>
            </div>
            <span className="target-status" style={{ color: waterGlasses >= 8 ? "var(--green)" : "var(--orange)" }}>
              {waterGlasses}/8 Glasses
            </span>
          </div>
          <p style={{ marginTop: "10px", color: "var(--gray)", fontSize: "12px" }}>
            Proper hydration is critical for muscle recovery and performance. Tap glasses below to track your water intake today:
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap", alignItems: "center" }}>
            {[...Array(8)].map((_, idx) => (
              <button
                key={`water-${idx}`}
                type="button"
                onClick={() => setWaterGlasses(idx < waterGlasses ? idx : idx + 1)}
                style={{
                  width: "45px",
                  height: "55px",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                  background: idx < waterGlasses ? "rgba(255, 94, 20, 0.2)" : "var(--card)",
                  borderColor: idx < waterGlasses ? "var(--orange)" : "var(--border)",
                  color: idx < waterGlasses ? "var(--orange)" : "var(--gray)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "var(--transition)"
                }}
              >
                <i className="bi bi-droplet-fill" style={{ fontSize: "16px" }}></i>
                <span style={{ fontSize: "9px", marginTop: "3px" }}>{idx + 1}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setWaterGlasses(0)}
              className="secondary-btn"
              style={{ marginLeft: "auto", minHeight: "40px", padding: "0 15px", fontSize: "10px" }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* MEAL PLAN */}
        <div className="diet-plan-section">

          <div className="card-header">
            <div>
              <span className="section-label">
                DAILY MEALS
              </span>

              <h2>Meal Plan</h2>
            </div>

            <span className="diet-preference">
              {currentPhysique.toUpperCase()} TARGETED
            </span>
          </div>

          <div className="meal-list">

            {dietPlan.meals && Array.isArray(dietPlan.meals) && dietPlan.meals.map((meal, index) => {
              const scaledMealCals = Math.round((Number(meal.calories) || 0) * calorieRatio);
              return (
                <div className="meal-card" key={`meal-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: "15px 0" }}>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="meal-time">
                      {meal.type || `Meal ${index + 1}`}
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--orange)", fontWeight: "700" }}>
                      {scaledMealCals} kcal
                    </span>
                  </div>

                  <div>
                    <div className="meal-title">
                      <h3>{meal.name || "Balanced Meal"}</h3>
                    </div>

                    <div className="meal-foods" style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {meal.foods && Array.isArray(meal.foods) ? (
                        meal.foods.map((food, foodIndex) => {
                          const foodName = typeof food === "string" ? food : (food?.name || food?.item || "Food");
                          const foodQty = typeof food === "object" ? (food?.quantity || food?.amount || food?.serving || "") : "";
                          const foodCals = typeof food === "object" && food?.calories ? Math.round(food.calories * calorieRatio) : null;
                          const foodProtein = typeof food === "object" && food?.protein ? Math.round(food.protein * calorieRatio) : null;

                          return (
                            <div key={`food-${index}-${foodIndex}`} style={{ display: "flex", justifyContent: "space-between", background: "#111", padding: "8px 12px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "12px" }}>
                              <span>{foodName} {foodQty ? `— ${foodQty}` : ""}</span>
                              {foodCals !== null && (
                                <span style={{ color: "var(--gray)", fontSize: "11px" }}>
                                  {foodCals} kcal {foodProtein !== null ? `(P: ${foodProtein}g)` : ""}
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <span>No items listed</span>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* NUTRITION & MEAL TIMING SCRATCHPAD */}
        <div className="dashboard-card" style={{ marginTop: "20px", border: "1px solid var(--border)" }}>
          <div className="card-header">
            <div>
              <span className="section-label">SCRATCHPAD</span>
              <h2>Nutrition & Supplement Timing Notes ({currentPhysique.toUpperCase()})</h2>
            </div>
          </div>
          <form onSubmit={handleSaveNotes} style={{ marginTop: "15px" }}>
            <textarea
              value={mealNotes}
              onChange={(e) => setMealNotes(e.target.value)}
              placeholder="Record meal timings, pre-workout snack ideas, or supplement reminders..."
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
              <button type="submit" className="primary-btn" style={{ minHeight: "38px", padding: "0 20px", fontSize: "11px" }}>
                Save Diet Notes
              </button>
            </div>
          </form>
          {savedNotes && (
            <div style={{ marginTop: "15px", padding: "12px", background: "rgba(255, 94, 20, 0.05)", borderLeft: "3px solid var(--orange)" }}>
              <strong style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--orange)" }}>Saved Nutrition Notes:</strong>
              <p style={{ marginTop: "5px", color: "var(--gray)", fontSize: "12px", whiteSpace: "pre-wrap" }}>{savedNotes}</p>
            </div>
          )}
        </div>

        {/* NUTRITION TIPS */}
        <div className="nutrition-tips" style={{ marginTop: "20px" }}>

          <span className="section-label">
            NUTRITION GUIDE
          </span>

          <h2>
            Fuel Your <span>Progress</span>
          </h2>

          <div className="tips-grid">

            <div className="tip-card">
              <strong>01</strong>

              <h3>Stay Consistent</h3>

              <p>
                Follow your daily calorie and macronutrient
                targets consistently to support your training.
              </p>
            </div>

            <div className="tip-card">
              <strong>02</strong>

              <h3>Prioritize Protein</h3>

              <p>
                Spread your protein intake across your meals
                to support muscle recovery and growth.
              </p>
            </div>

            <div className="tip-card">
              <strong>03</strong>

              <h3>Stay Hydrated</h3>

              <p>
                Drink enough water throughout the day,
                especially before and after your workouts.
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default DietPlan;