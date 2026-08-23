if (!sessionStorage.getItem("loggedInUser")) {
    window.location.href = "login.html";
}

const email = sessionStorage.getItem("loggedInUser");
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = users.find(user => user.email === email);

if (!currentUser) {
    window.location.href = "login.html";
}

if (!currentUser.isPro) {
    window.location.href = "pro.html";
}

const dietPlans = {
    Lean: {
        description: "Fat loss with muscle preservation and high protein intake.",
        calories: 2200,
        protein: 160,
        carbs: 220,
        fats: 60,
        water: 3.5,
        meals: {
            veg: [
                { text: "6:00 AM - Warm water + Black coffee / Green tea", type: "veg" },
                { text: "8:00 AM - Oats bowl with Chia Seeds & Berries", type: "veg" },
                { text: "1:00 PM - Paneer Tikka / Tofu + Brown Rice + Salad", type: "veg" },
                { text: "4:00 PM - Greek Yogurt + Almonds", type: "veg" },
                { text: "7:00 PM - Lentil Soup (Dal) + Whole Wheat Roti + Vegetables", type: "veg" },
                { text: "10:00 PM - Warm Skimmed Milk with Turmeric", type: "veg" }
            ],
            'non-veg': [
                { text: "6:00 AM - Warm water + Black coffee", type: "non-veg" },
                { text: "8:00 AM - 4 Egg Whites + 1 Whole Egg Scrambled + Toast", type: "non-veg" },
                { text: "1:00 PM - Grilled Chicken Breast + Brown Rice + Vegetables", type: "non-veg" },
                { text: "4:00 PM - Boiled Egg Whites (3-4) + Cucumber Slices", type: "non-veg" },
                { text: "7:00 PM - Grilled Fish / Lean Beef + Mixed Greens Salad", type: "non-veg" },
                { text: "10:00 PM - Casein Protein Shake or Light Skimmed Milk", type: "non-veg" }
            ],
            all: [
                { text: "6:00 AM - Warm water + Black coffee", type: "veg" },
                { text: "8:00 AM - Eggs or Oats Bowl + Fresh Berries", type: "non-veg" },
                { text: "1:00 PM - Chicken / Paneer + Brown Rice + Vegetables", type: "non-veg" },
                { text: "4:00 PM - Greek Yogurt + Roasted Chana or Almonds", type: "veg" },
                { text: "7:00 PM - High Protein Meal (Fish / Dal) + Salad", type: "all" },
                { text: "10:00 PM - Milk before sleep", type: "veg" }
            ]
        }
    },
    Bulk: {
        description: "High calorie nutrition plan for maximum muscle growth.",
        calories: 3200,
        protein: 190,
        carbs: 380,
        fats: 90,
        water: 4,
        meals: {
            veg: [
                { text: "6:00 AM - Oats + Banana + Peanut Butter Smoothie", type: "veg" },
                { text: "8:00 AM - Stuffed Paneer Paratha + Greek Yogurt", type: "veg" },
                { text: "1:00 PM - Cottage Cheese Curry + Rice + Veggies", type: "veg" },
                { text: "4:00 PM - Plant Protein Shake + Dry Fruits", type: "veg" },
                { text: "8:00 PM - Rajma / Chole + Rice + Avocado Salad", type: "veg" },
                { text: "10:30 PM - Whole Milk + Walnuts", type: "veg" }
            ],
            'non-veg': [
                { text: "6:00 AM - Banana Protein Shake with Peanut Butter", type: "non-veg" },
                { text: "8:00 AM - 4 Whole Eggs + Oats + Milk", type: "non-veg" },
                { text: "1:00 PM - Rice + Chicken Breast + Veggies", type: "non-veg" },
                { text: "4:00 PM - Whey Protein Shake + Handful of Nuts", type: "non-veg" },
                { text: "8:00 PM - Steak / Turkey + Rice + Sweet Potato Bowl", type: "non-veg" },
                { text: "10:30 PM - Whole Milk + Boiled Eggs", type: "non-veg" }
            ],
            all: [
                { text: "6:00 AM - Banana Shake + Peanut Butter", type: "veg" },
                { text: "8:00 AM - Eggs / Paneer + Oats + Milk", type: "non-veg" },
                { text: "1:00 PM - Rice + Chicken / Paneer + Vegetables", type: "non-veg" },
                { text: "4:00 PM - Whey Protein Shake + Dry Fruits", type: "veg" },
                { text: "8:00 PM - Heavy Dinner with Carbs + Protein", type: "all" },
                { text: "10:30 PM - Whole Milk + Nuts", type: "veg" }
            ]
        }
    },
    Skinny: {
        description: "Weight gain plan focused on calories and muscle building.",
        calories: 3000,
        protein: 170,
        carbs: 360,
        fats: 85,
        water: 4,
        meals: {
            veg: [
                { text: "7:00 AM - Milk + Banana + Peanut Butter Shake", type: "veg" },
                { text: "9:00 AM - Aloo / Paneer Paratha with Curd", type: "veg" },
                { text: "1:00 PM - Rice + Dal + Paneer Curry", type: "veg" },
                { text: "5:00 PM - Dry Fruit Smoothie + Roasted Chana", type: "veg" },
                { text: "8:30 PM - Mix Veggie Curry + Roti + Butter", type: "veg" },
                { text: "10:30 PM - Full Cream Milk + Almonds", type: "veg" }
            ],
            'non-veg': [
                { text: "7:00 AM - Milk + Whole Eggs + Peanut Butter", type: "non-veg" },
                { text: "9:00 AM - Omelette (3 Eggs) + Whole Wheat Paratha", type: "non-veg" },
                { text: "1:00 PM - Rice + Dal + Chicken Curry", type: "non-veg" },
                { text: "5:00 PM - Chicken Sandwich / Tuna Wrap", type: "non-veg" },
                { text: "8:30 PM - Egg Curry / Fish Curry + Rice + Veggies", type: "non-veg" },
                { text: "10:30 PM - Whole Milk + Boiled Egg Whites", type: "non-veg" }
            ],
            all: [
                { text: "7:00 AM - Milk + Banana + Peanut Butter", type: "veg" },
                { text: "9:00 AM - Paratha + Eggs / Paneer", type: "non-veg" },
                { text: "1:00 PM - Rice + Dal + Chicken / Paneer", type: "non-veg" },
                { text: "5:00 PM - Smoothie + Nuts", type: "veg" },
                { text: "8:30 PM - Full Balanced Dinner", type: "all" },
                { text: "10:30 PM - Full Cream Milk", type: "veg" }
            ]
        }
    },
    Athletic: {
        description: "Balanced nutrition for strength, speed and performance.",
        calories: 2700,
        protein: 180,
        carbs: 300,
        fats: 75,
        water: 4,
        meals: {
            veg: [
                { text: "6:00 AM - Fresh Fruit Bowl + Electrolytes", type: "veg" },
                { text: "8:00 AM - Oatmeal + Chia Seeds + Peanut Butter", type: "veg" },
                { text: "12:30 PM - Tofu Rice Bowl + Roasted Vegetables", type: "veg" },
                { text: "4:00 PM - Sprouts Salad + Rice Cakes with Honey", type: "veg" },
                { text: "8:00 PM - Soy Chunk Curry + Roti + Mixed Salad", type: "veg" },
                { text: "10:00 PM - Turmeric Golden Milk", type: "veg" }
            ],
            'non-veg': [
                { text: "6:00 AM - Fresh Fruit Bowl + Electrolytes", type: "veg" },
                { text: "8:00 AM - Egg White Toast + Avocado", type: "non-veg" },
                { text: "12:30 PM - Chicken Breast + Rice + Broccoli", type: "non-veg" },
                { text: "4:00 PM - Turkey Wrap / Boiled Eggs", type: "non-veg" },
                { text: "8:00 PM - Salmon + Sweet Potato + Asparagus", type: "non-veg" },
                { text: "10:00 PM - Recovery Whey Isolate Shake", type: "non-veg" }
            ],
            all: [
                { text: "6:00 AM - Fruits + Hydration", type: "veg" },
                { text: "8:00 AM - High Protein Breakfast (Eggs / Oats)", type: "all" },
                { text: "12:30 PM - Balanced Lunch (Chicken / Tofu + Rice)", type: "all" },
                { text: "4:00 PM - Pre-Workout Energy Meal", type: "veg" },
                { text: "8:00 PM - Recovery Dinner (Fish / Soy + Veggies)", type: "all" },
                { text: "10:00 PM - Recovery Shake or Milk", type: "veg" }
            ]
        }
    },
    Cutting: {
        description: "Aggressive fat-shredding deficit paired with maximum protein preservation.",
        calories: 1800,
        protein: 185,
        carbs: 130,
        fats: 45,
        water: 4.5,
        meals: {
            veg: [
                { text: "6:00 AM - Green tea + Electrolytes", type: "veg" },
                { text: "8:30 AM - Tofu Scramble + Spinach + Berries", type: "veg" },
                { text: "1:00 PM - Grilled Paneer + Cucumber & Tomato Salad", type: "veg" },
                { text: "4:30 PM - Plant Protein Isolate + Green Tea", type: "veg" },
                { text: "7:30 PM - Soy Chunks / White Paneer + Steamed Vegetables", type: "veg" },
                { text: "10:00 PM - Light Chamomile Tea", type: "veg" }
            ],
            'non-veg': [
                { text: "6:00 AM - Black Coffee + Electrolytes", type: "non-veg" },
                { text: "8:30 AM - Egg Whites Omelette + Spinach + Berries", type: "non-veg" },
                { text: "1:00 PM - Grilled Chicken Breast + Green Salad", type: "non-veg" },
                { text: "4:30 PM - Whey Protein Isolate in Water + Cucumber Slices", type: "non-veg" },
                { text: "7:30 PM - White Fish (Cod/Tilapia) + Steamed Asparagus", type: "non-veg" },
                { text: "10:00 PM - Casein Protein or Light Tea", type: "non-veg" }
            ],
            all: [
                { text: "6:00 AM - Green Tea or Black Coffee + Electrolytes", type: "veg" },
                { text: "8:30 AM - Egg Whites / Tofu + Spinach + Berries", type: "all" },
                { text: "1:00 PM - Chicken / Grilled Paneer + Green Salad", type: "all" },
                { text: "4:30 PM - Whey Protein Isolate + Cucumber", type: "veg" },
                { text: "7:30 PM - Lean Fish / White Paneer + Steamed Broccoli", type: "all" },
                { text: "10:00 PM - Casein Protein or Chamomile Tea", type: "veg" }
            ]
        }
    },
    Maingain: {
        description: "Recomposition diet aimed at building lean muscle at maintenance weight.",
        calories: 2500,
        protein: 175,
        carbs: 260,
        fats: 70,
        water: 3.8,
        meals: {
            veg: [
                { text: "6:30 AM - Green Tea + Hydration", type: "veg" },
                { text: "8:30 AM - Oats bowl with Chia Seeds & Apple", type: "veg" },
                { text: "1:00 PM - Paneer Curry + Brown Rice + Mixed Veggies", type: "veg" },
                { text: "4:30 PM - Greek Yogurt + Almonds + Honey", type: "veg" },
                { text: "8:00 PM - Tofu Stir-Fry + Sweet Potato + Salad", type: "veg" },
                { text: "10:00 PM - Warm Milk + Walnuts", type: "veg" }
            ],
            'non-veg': [
                { text: "6:30 AM - Hydration + Black Coffee", type: "non-veg" },
                { text: "8:30 AM - Whole Eggs + Whole Wheat Toast + Fruit", type: "non-veg" },
                { text: "1:00 PM - Chicken Breast + Brown Rice + Mixed Veggies", type: "non-veg" },
                { text: "4:30 PM - Boiled Egg Whites + Almonds", type: "non-veg" },
                { text: "8:00 PM - Salmon + Sweet Potato + Salad", type: "non-veg" },
                { text: "10:00 PM - Casein Protein Shake or Warm Milk", type: "non-veg" }
            ],
            all: [
                { text: "6:30 AM - Hydration + Green Tea", type: "veg" },
                { text: "8:30 AM - Whole Eggs / Oats + Toast + Fruit", type: "all" },
                { text: "1:00 PM - Chicken / Paneer + Brown Rice + Mixed Veggies", type: "all" },
                { text: "4:30 PM - Greek Yogurt + Almonds", type: "veg" },
                { text: "8:00 PM - Salmon / Tofu + Sweet Potato + Salad", type: "all" },
                { text: "10:00 PM - Warm Milk + Walnuts", type: "veg" }
            ]
        }
    },
    Powerlifting: {
        description: "Nutrient-dense nutrition designed for maximal strength and explosive power production.",
        calories: 3500,
        protein: 200,
        carbs: 420,
        fats: 100,
        water: 4.5,
        meals: {
            veg: [
                { text: "6:00 AM - Hydration Shake + Creatine", type: "veg" },
                { text: "8:00 AM - Oatmeal with Peanut Butter & Bananas + Milk", type: "veg" },
                { text: "12:30 PM - Cottage Cheese (Paneer) + Rice + Sweet Potatoes", type: "veg" },
                { text: "4:00 PM - Pre-Workout Cream of Rice + Plant Protein", type: "veg" },
                { text: "7:30 PM - Large Pasta / Rice Bowl with Soy Chunks & Veggies", type: "veg" },
                { text: "10:30 PM - Whole Milk + Paneer Cubes", type: "veg" }
            ],
            'non-veg': [
                { text: "6:00 AM - Hydration Shake + Creatine", type: "veg" },
                { text: "8:00 AM - 4 Whole Eggs + Oatmeal with Peanut Butter & Bananas", type: "non-veg" },
                { text: "12:30 PM - Steak / Chicken + Rice + Sweet Potatoes", type: "non-veg" },
                { text: "4:00 PM - Pre-Workout Cream of Rice + Whey Protein", type: "non-veg" },
                { text: "7:30 PM - Large Pasta / Rice Bowl with Ground Beef / Chicken", type: "non-veg" },
                { text: "10:30 PM - Whole Milk + Cottage Cheese", type: "non-veg" }
            ],
            all: [
                { text: "6:00 AM - Hydration Shake + Creatine", type: "veg" },
                { text: "8:00 AM - Eggs / Oats + Peanut Butter & Bananas", type: "all" },
                { text: "12:30 PM - Steak / Paneer + Rice + Sweet Potatoes", type: "all" },
                { text: "4:00 PM - Pre-Workout Cream of Rice + Whey Protein", type: "veg" },
                { text: "7:30 PM - Large Pasta / Rice Bowl with Heavy Protein", type: "all" },
                { text: "10:30 PM - Whole Milk + Cottage Cheese / Paneer", type: "veg" }
            ]
        }
    },
    Endurance: {
        description: "Carbohydrate-focused plan built for sustained stamina, hydration, and recovery.",
        calories: 2900,
        protein: 150,
        carbs: 410,
        fats: 65,
        water: 5,
        meals: {
            veg: [
                { text: "5:30 AM - Electrolyte Drink + Banana", type: "veg" },
                { text: "7:30 AM - Large Oatmeal + Honey + Nuts + Toast", type: "veg" },
                { text: "12:30 PM - Quinoa / Rice Bowl + Black Beans + Avocado", type: "veg" },
                { text: "4:00 PM - Energy Bar / Rice Cakes with Peanut Butter", type: "veg" },
                { text: "7:30 PM - Pasta / Sweet Potato + Tofu + Steamed Veggies", type: "veg" },
                { text: "9:30 PM - Tart Cherry Juice + Recovery Protein Smoothie", type: "veg" }
            ],
            'non-veg': [
                { text: "5:30 AM - Electrolyte Drink + Banana", type: "veg" },
                { text: "7:30 AM - Eggs on Whole Wheat Toast + Oats", type: "non-veg" },
                { text: "12:30 PM - Rice Bowl + Chicken Breast + Avocado", type: "non-veg" },
                { text: "4:00 PM - Energy Bar / Tuna Rice Cake", type: "non-veg" },
                { text: "7:30 PM - Pasta / Sweet Potato + Grilled Salmon + Veggies", type: "non-veg" },
                { text: "9:30 PM - Tart Cherry Juice + Recovery Protein Smoothie", type: "veg" }
            ],
            all: [
                { text: "5:30 AM - Electrolyte Drink + Banana", type: "veg" },
                { text: "7:30 AM - Large Oatmeal / Eggs + Honey + Toast", type: "all" },
                { text: "12:30 PM - Quinoa / Rice Bowl + Chicken or Beans + Avocado", type: "all" },
                { text: "4:00 PM - Energy Bar / Rice Cakes with Peanut Butter", type: "veg" },
                { text: "7:30 PM - Pasta / Sweet Potato + Lean Protein + Steamed Veggies", type: "all" },
                { text: "9:30 PM - Tart Cherry Juice + Recovery Protein Smoothie", type: "veg" }
            ]
        }
    }
};

const MEAL_API_BASE = "https://www.themealdb.com/api/json/v1/1";
const DRINK_API_BASE = "https://www.thecocktaildb.com/api/json/v1/1";

const title = document.getElementById("physiqueTitle");
const description = document.getElementById("physiqueDescription");
const caloriesBox = document.getElementById("calories");
const proteinBox = document.getElementById("protein");
const carbsFatsBox = document.getElementById("carbsFats");
const waterBox = document.getElementById("water");
const mealBox = document.getElementById("mealPlan");

let currentLoggedWater = parseFloat(localStorage.getItem(`water_${email}`)) || 0;
let completedMeals = JSON.parse(localStorage.getItem(`meals_${email}`)) || [];
let foodDiary = JSON.parse(localStorage.getItem(`food_diary_${email}`)) || [];
let activeFilter = "all";
let currentType = "Lean";

function getMealsForFilter(plan, filter) {
    if (!plan || !plan.meals) return [];
    if (plan.meals[filter]) {
        return plan.meals[filter];
    }
    return plan.meals.all || [];
}

function renderFoodDiary() {
    const list = document.getElementById("foodDiaryList");
    if (!list) return;

    if (foodDiary.length === 0) {
        list.innerHTML = `<p style="color: var(--text-secondary); font-size: 13.5px; text-align: center; margin: 10px 0;">No manual food entries logged today.</p>`;
        return;
    }

    list.innerHTML = foodDiary.map((item, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #060b14; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(0, 240, 255, 0.15);">
            <div>
                <strong style="color: #fff; font-size: 14px;">${item.name}</strong>
                <span style="color: var(--cyan); font-size: 12.5px; margin-left: 10px;">${item.calories} kcal | ${item.protein}g P | ${item.carbs || 0}g C | ${item.fats || 0}g F</span>
            </div>
            <button onclick="deleteFoodEntry(${idx})" style="background: none; border: none; color: #ff5252; cursor: pointer; font-size: 16px;"><i class="bi bi-trash"></i></button>
        </div>
    `).join("");
}

function handleFoodEntry(event) {
    event.preventDefault();
    const name = document.getElementById("foodItemName").value.trim();
    const calories = parseFloat(document.getElementById("foodCalories").value) || 0;
    const protein = parseFloat(document.getElementById("foodProtein").value) || 0;
    const carbs = parseFloat(document.getElementById("foodCarbs").value) || 0;
    const fats = parseFloat(document.getElementById("foodFats").value) || 0;

    if (!name || calories <= 0) return;

    foodDiary.push({ name, calories, protein, carbs, fats });
    localStorage.setItem(`food_diary_${email}`, JSON.stringify(foodDiary));

    document.getElementById("foodEntryForm").reset();
    renderFoodDiary();
    updateRemainingMacros();
}

function deleteFoodEntry(index) {
    foodDiary.splice(index, 1);
    localStorage.setItem(`food_diary_${email}`, JSON.stringify(foodDiary));
    renderFoodDiary();
    updateRemainingMacros();
}

function clearFoodDiary() {
    foodDiary = [];
    localStorage.setItem(`food_diary_${email}`, JSON.stringify(foodDiary));
    renderFoodDiary();
    updateRemainingMacros();
}

function updateRemainingMacros() {
    const plan = dietPlans[currentType];
    if (!plan) return;

    const totalLoggedCal = foodDiary.reduce((sum, f) => sum + (f.calories || 0), 0);
    const totalLoggedPro = foodDiary.reduce((sum, f) => sum + (f.protein || 0), 0);
    const totalLoggedCarbs = foodDiary.reduce((sum, f) => sum + (f.carbs || 0), 0);
    const totalLoggedFats = foodDiary.reduce((sum, f) => sum + (f.fats || 0), 0);

    const remCal = Math.max(0, plan.calories - totalLoggedCal);
    const remPro = Math.max(0, plan.protein - totalLoggedPro);

    const remCalEl = document.getElementById("remainingCalories");
    const remProEl = document.getElementById("remainingProtein");
    const remCFEl = document.getElementById("remainingCarbsFats");

    if (remCalEl) remCalEl.innerText = `Remaining: ${remCal.toLocaleString()} kcal`;
    if (remProEl) remProEl.innerText = `Remaining: ${remPro} g`;
    if (remCFEl) remCFEl.innerText = `Logged: ${totalLoggedCarbs}g C / ${totalLoggedFats}g F`;
}

function toggleElectrolyteStatus(isChecked) {
    localStorage.setItem(`electrolyte_${email}`, isChecked ? "true" : "false");
    const status = document.getElementById("electrolyteStatus");
    if (status) {
        status.innerText = isChecked ? "Salt/Electrolytes: Optimal & Replenished" : "Salt/Electrolytes: Standard Intake";
        status.style.color = isChecked ? "#00e676" : "var(--text-secondary)";
    }
}

async function fetchRecipeData(query) {
    const resultsContainer = document.getElementById("recipeResults");
    if (!resultsContainer) return;

    if (!query) query = "Chicken";

    resultsContainer.innerHTML = `<p style="color: var(--cyan); grid-column: 1/-1; text-align: center;"><i class="bi bi-arrow-repeat spin"></i> Searching recipes via TheMealDB API...</p>`;

    try {
        let response = await fetch(`${MEAL_API_BASE}/search.php?s=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Network error fetching recipes");
        let data = await response.json();

        if (!data.meals) {
            const fallbackResponse = await fetch(`${MEAL_API_BASE}/filter.php?i=${encodeURIComponent(query)}`);
            const fallbackData = await fallbackResponse.json();
            data.meals = fallbackData.meals;
        }

        if (!data.meals || data.meals.length === 0) {
            resultsContainer.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center;">No recipes found for "${query}". Try searching for chicken, pasta, oats, salmon, or beef.</p>`;
            return;
        }

        resultsContainer.innerHTML = "";

        data.meals.slice(0, 8).forEach(meal => {
            const card = document.createElement("div");
            card.style.background = "#060b14";
            card.style.border = "1px solid var(--hud-border)";
            card.style.borderRadius = "12px";
            card.style.padding = "14px";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.justifyContent = "space-between";
            card.style.transition = "transform 0.2s ease, border-color 0.2s ease";

            card.onmouseover = () => {
                card.style.transform = "translateY(-4px)";
                card.style.borderColor = "var(--cyan)";
            };
            card.onmouseout = () => {
                card.style.transform = "translateY(0)";
                card.style.borderColor = "var(--hud-border)";
            };

            const estimatedCal = 450;
            const estimatedPro = 35;
            const estimatedCarbs = 40;
            const estimatedFats = 12;

            const safeMealName = (meal.strMeal || "Meal").replace(/['"\\]/g, "");

            card.innerHTML = `
                <div onclick="fetchRecipeDetails('${meal.idMeal}')" style="cursor: pointer;">
                    <img src="${meal.strMealThumb}" alt="${safeMealName}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; border: 1px solid rgba(0, 240, 255, 0.2);">
                    <h4 style="color: #fff; font-family: var(--font-cyber); font-size: 14px; font-weight: 600; margin: 0 0 6px;">${safeMealName}</h4>
                    <p style="color: var(--cyan); font-size: 12px; margin-bottom: 10px; font-weight: 600;">~${estimatedCal} kcal | ${estimatedPro}g P | ${estimatedCarbs}g C | ${estimatedFats}g F</p>
                </div>
                <button type="button" onclick="quickAddFoodToDiary('${safeMealName}', ${estimatedCal}, ${estimatedPro}, ${estimatedCarbs}, ${estimatedFats})" class="start-workout-btn" style="padding: 6px 12px; font-size: 12px; width: 100%; justify-content: center;">
                    + Log to Food Diary
                </button>
            `;
            resultsContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Recipe Fetch Error:", err);
        resultsContainer.innerHTML = `<p style="color: #ff5252; grid-column: 1/-1; text-align: center;">Failed to fetch recipes. Check network connection.</p>`;
    }
}

async function fetchPerformanceDrinks(query = "Shake") {
    const resultsContainer = document.getElementById("drinkResults");
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `<p style="color: var(--cyan); grid-column: 1/-1; text-align: center;"><i class="bi bi-arrow-repeat spin"></i> Searching drink telemetry via TheCocktailDB API...</p>`;

    try {
        let response = await fetch(`${DRINK_API_BASE}/search.php?s=${encodeURIComponent(query)}`);
        let data = await response.json();

        if (!data.drinks) {
            let fallbackRes = await fetch(`${DRINK_API_BASE}/filter.php?a=Non_Alcoholic`);
            let fallbackData = await fallbackRes.json();
            data.drinks = fallbackData.drinks;
        }

        if (!data.drinks || data.drinks.length === 0) {
            resultsContainer.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center;">No drinks found for "${query}".</p>`;
            return;
        }

        resultsContainer.innerHTML = "";

        data.drinks.slice(0, 8).forEach(drink => {
            const card = document.createElement("div");
            card.style.background = "#060b14";
            card.style.border = "1px solid var(--hud-border)";
            card.style.borderRadius = "12px";
            card.style.padding = "14px";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.justifyContent = "space-between";
            card.style.transition = "transform 0.2s ease, border-color 0.2s ease";

            card.onmouseover = () => {
                card.style.transform = "translateY(-4px)";
                card.style.borderColor = "var(--cyan)";
            };
            card.onmouseout = () => {
                card.style.transform = "translateY(0)";
                card.style.borderColor = "var(--hud-border)";
            };

            const isShake = (drink.strDrink || "").toLowerCase().includes("shake") || (drink.strDrink || "").toLowerCase().includes("milk");
            const dCal = isShake ? 280 : 110;
            const dPro = isShake ? 24 : 3;
            const dCarbs = isShake ? 30 : 25;
            const dFats = isShake ? 6 : 0;

            const safeDrinkName = (drink.strDrink || "Drink").replace(/['"\\]/g, "");

            card.innerHTML = `
                <div>
                    <img src="${drink.strDrinkThumb}" alt="${safeDrinkName}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; border: 1px solid rgba(0, 240, 255, 0.2);">
                    <h4 style="color: #fff; font-family: var(--font-cyber); font-size: 14px; font-weight: 600; margin: 0 0 6px;">${safeDrinkName}</h4>
                    <p style="color: var(--cyan); font-size: 12px; margin-bottom: 10px; font-weight: 600;">~${dCal} kcal | ${dPro}g P | ${dCarbs}g C | ${dFats}g F</p>
                </div>
                <button type="button" onclick="quickAddFoodToDiary('${safeDrinkName}', ${dCal}, ${dPro}, ${dCarbs}, ${dFats})" class="start-workout-btn" style="padding: 6px 12px; font-size: 12px; width: 100%; justify-content: center;">
                    + Log to Food Diary
                </button>
            `;
            resultsContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Drinks Fetch Error:", err);
        resultsContainer.innerHTML = `<p style="color: #ff5252; grid-column: 1/-1; text-align: center;">Failed to fetch drinks. Check network connection.</p>`;
    }
}

async function fetchRecipeDetails(mealId) {
    const modal = document.getElementById("recipeModal");
    const modalBody = document.getElementById("recipeModalBody");

    if (!modal || !modalBody) return;

    modalBody.innerHTML = `<p style="color: var(--cyan); text-align: center; padding: 40px;"><i class="bi bi-arrow-repeat spin"></i> Loading full recipe plan...</p>`;
    modal.style.display = "flex";

    try {
        const response = await fetch(`${MEAL_API_BASE}/lookup.php?i=${mealId}`);
        const data = await response.json();
        const meal = data.meals ? data.meals[0] : null;

        if (!meal) {
            modalBody.innerHTML = `<p style="color: #ff5252; text-align: center;">Recipe details not found.</p>`;
            return;
        }

        let ingredientsList = "";
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== "") {
                ingredientsList += `
                    <li style="margin-bottom: 8px; color: #d0d0d0; font-size: 14px;">
                        <strong style="color: var(--cyan);">${measure ? measure.trim() : ''}</strong> ${ingredient.trim()}
                    </li>`;
            }
        }

        const instructionsFormatted = meal.strInstructions
            ? meal.strInstructions
                .split('\r\n')
                .filter(step => step.trim().length > 0)
                .map(step => `<p style="margin-bottom: 12px; line-height: 1.6; color: #cccccc; font-size: 14px;">${step}</p>`)
                .join("")
            : "<p style='color: #a0a0a0;'>No instructions available.</p>";

        modalBody.innerHTML = `
            <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 110px; height: 110px; border-radius: 12px; object-fit: cover; border: 1px solid var(--hud-border);">
                <div>
                    <h2 style="font-family: var(--font-cyber); color: #fff; margin: 0 0 6px; font-size: 20px;">${meal.strMeal}</h2>
                    <p style="color: #00e676; margin: 0; font-size: 13px;">Category: ${meal.strCategory || 'General'} | Cuisine: ${meal.strArea || 'International'}</p>
                </div>
            </div>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">

            <h3 style="color: var(--cyan); font-family: var(--font-cyber); font-size: 16px; margin-bottom: 12px;">Ingredients & Portion Sizes</h3>
            <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; padding-left: 20px; margin-bottom: 25px;">
                ${ingredientsList}
            </ul>

            <h3 style="color: var(--cyan); font-family: var(--font-cyber); font-size: 16px; margin-bottom: 12px;">Step-by-Step Cooking Instructions</h3>
            <div style="background: #060b14; padding: 18px; border-radius: 12px; border: 1px solid rgba(0, 240, 255, 0.15);">
                ${instructionsFormatted}
            </div>

            ${meal.strYoutube ? `
                <div style="margin-top: 20px; text-align: right;">
                    <a href="${meal.strYoutube}" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; color: #ff4444; text-decoration: none; font-weight: 600; font-size: 14px;">
                        <i class="bi bi-youtube" style="font-size: 18px;"></i> Watch Video Tutorial
                    </a>
                </div>
            ` : ''}
        `;
    } catch (err) {
        console.error("Recipe Details Fetch Error:", err);
        modalBody.innerHTML = `<p style="color: #ff5252; text-align: center;">Error loading details.</p>`;
    }
}

function closeRecipeModal() {
    const modal = document.getElementById("recipeModal");
    if (modal) modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("recipeModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function generateDiet(type, filter = "all") {
    currentType = type;
    activeFilter = filter;
    let plan = dietPlans[type];

    if (!plan) {
        if (title) title.innerText = "No Physique Selected";
        return;
    }

    if (title) title.innerText = type + " Physique";
    if (description) description.innerText = plan.description;
    if (caloriesBox) caloriesBox.innerText = plan.calories + " kcal";
    if (proteinBox) proteinBox.innerText = plan.protein + "g";
    if (carbsFatsBox) carbsFatsBox.innerText = `${plan.carbs}g / ${plan.fats}g`;
    if (waterBox) waterBox.innerText = plan.water + "L";

    const currentMealsList = getMealsForFilter(plan, filter);

    renderMeals(currentMealsList);
    updateWaterUI(plan.water);
    updateMealProgress(currentMealsList.length);
    checkDoneState(plan.water, currentMealsList.length);
    updateRemainingMacros();
    renderFoodDiary();

    currentUser.dietPlan = plan;
    users = users.map(user => user.email === currentUser.email ? currentUser : user);
    localStorage.setItem("users", JSON.stringify(users));
}

function renderMeals(mealsArr) {
    if (!mealBox) return;
    mealBox.innerHTML = "";

    if (!mealsArr || mealsArr.length === 0) {
        mealBox.innerHTML = `<p style="color: var(--text-secondary); padding: 10px;">No meals found for this filter preference.</p>`;
        return;
    }

    mealsArr.forEach((mealObj, idx) => {
        const isChecked = completedMeals.includes(idx);
        const tagLabel = mealObj.type.toUpperCase();

        mealBox.innerHTML += `
            <div class="meal-item ${isChecked ? 'completed' : ''}" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #060b14; margin-bottom: 8px; border-radius: 8px; border: 1px solid rgba(0, 240, 255, 0.1);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="bi ${isChecked ? 'bi-check-circle-fill' : 'bi-circle'}" style="color: var(--cyan); cursor: pointer;" onclick="toggleMeal(${idx})"></i>
                    <span style="color: ${isChecked ? '#888' : '#fff'}; text-decoration: ${isChecked ? 'line-through' : 'none'}; font-size: 14px;">${mealObj.text}</span>
                </div>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(0, 240, 255, 0.15); color: var(--cyan); text-transform: uppercase; border: 1px solid var(--hud-border);">${tagLabel}</span>
            </div>
        `;
    });
}

function toggleMeal(index) {
    if (completedMeals.includes(index)) {
        completedMeals = completedMeals.filter(i => i !== index);
    } else {
        completedMeals.push(index);
    }
    localStorage.setItem(`meals_${email}`, JSON.stringify(completedMeals));
    generateDiet(currentType, activeFilter);
}

function addWaterAmount(amt) {
    let targetWater = dietPlans[currentType] ? dietPlans[currentType].water : 4;
    currentLoggedWater = Math.min(targetWater, parseFloat((currentLoggedWater + amt).toFixed(2)));
    localStorage.setItem(`water_${email}`, currentLoggedWater);
    generateDiet(currentType, activeFilter);
}

function resetWater() {
    currentLoggedWater = 0;
    localStorage.setItem(`water_${email}`, 0);
    generateDiet(currentType, activeFilter);
}

function checkDoneState(targetWater, totalMeals) {
    const doneBtn = document.getElementById("doneBtn");
    if (!doneBtn) return;

    const waterFull = currentLoggedWater >= targetWater;
    const mealsFull = totalMeals > 0 && completedMeals.length >= totalMeals;

    if (waterFull && mealsFull) {
        doneBtn.disabled = false;
        doneBtn.classList.add("active");
    } else {
        doneBtn.disabled = true;
        doneBtn.classList.remove("active");
    }
}

function resetDayTracker() {
    let plan = dietPlans[currentType];
    let currentMealsList = getMealsForFilter(plan, activeFilter);
    let targetWater = plan ? plan.water : 4;
    let totalMeals = currentMealsList.length;

    const waterFull = currentLoggedWater >= targetWater;
    const mealsFull = totalMeals > 0 && completedMeals.length >= totalMeals;

    if (!waterFull || !mealsFull) return;

    currentLoggedWater = 0;
    completedMeals = [];
    localStorage.setItem(`water_${email}`, 0);
    localStorage.setItem(`meals_${email}`, JSON.stringify([]));
    generateDiet(currentType, activeFilter);
}

function updateWaterUI(targetWater) {
    const waterText = document.getElementById("waterText");
    const waterProgress = document.getElementById("waterProgress");
    if (waterText) waterText.innerText = `${currentLoggedWater} / ${targetWater} L`;
    if (waterProgress) {
        const percentage = Math.min(100, (currentLoggedWater / targetWater) * 100);
        waterProgress.style.width = percentage + "%";
    }
}

function updateMealProgress(totalMeals) {
    const mealText = document.getElementById("mealText");
    const mealProgress = document.getElementById("mealProgress");
    if (mealText) mealText.innerText = `${completedMeals.length} / ${totalMeals} Meals`;
    if (mealProgress) {
        const percentage = totalMeals > 0 ? Math.min(100, (completedMeals.length / totalMeals) * 100) : 0;
        mealProgress.style.width = percentage + "%";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let activePhysique = typeof getSelectedPhysique === "function" ? getSelectedPhysique() : (currentUser.physique || "Lean");
    generateDiet(activePhysique, activeFilter);

    const savedSalt = localStorage.getItem(`electrolyte_${email}`);
    const saltCheck = document.getElementById("saltElectrolyteCheck");
    if (saltCheck && savedSalt === "true") {
        saltCheck.checked = true;
        toggleElectrolyteStatus(true);
    }

    const filterBtns = document.querySelectorAll(".filter-group .filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeFilter = btn.getAttribute("data-type");
            completedMeals = [];
            localStorage.setItem(`meals_${email}`, JSON.stringify([]));
            generateDiet(currentType, activeFilter);
        });
    });

    fetchRecipeData("Chicken");
    fetchPerformanceDrinks("Shake");
});

window.addWaterAmount = addWaterAmount;
window.resetWater = resetWater;
window.toggleMeal = toggleMeal;
window.resetDayTracker = resetDayTracker;
window.fetchRecipeData = fetchRecipeData;
window.fetchRecipeDetails = fetchRecipeDetails;
window.fetchPerformanceDrinks = fetchPerformanceDrinks;
window.closeRecipeModal = closeRecipeModal;
window.handleFoodEntry = handleFoodEntry;
window.deleteFoodEntry = deleteFoodEntry;
window.clearFoodDiary = clearFoodDiary;
window.toggleElectrolyteStatus = toggleElectrolyteStatus;