
import foods from "../data/foods.js";

import {
  calculateDailyCalories,
  calculateProtein,
  calculateMacros
} from "../utils/calculations.js";

const getFoodsForDiet = (
  dietPreference
) => {
  return foods.filter((food) =>
    food.dietTypes.includes(
      dietPreference
    )
  );
};

const calculateFoodNutrition = (
  food,
  quantity
) => {
  const multiplier =
    quantity / 100;

  return {
    name: food.name,
    quantity: `${Math.round(quantity)} g`,

    calories: Math.round(
      food.calories * multiplier
    ),

    protein: Math.round(
      food.protein * multiplier
    ),

    carbs: Math.round(
      food.carbs * multiplier
    ),

    fat: Math.round(
      food.fat * multiplier
    )
  };
};

const createMeal = (
  type,
  name,
  foodPortions
) => {
  const mealFoods =
    foodPortions.map(
      ({ food, quantity }) =>
        calculateFoodNutrition(
          food,
          quantity
        )
    );

  return {
    type,
    name,
    foods: mealFoods,

    calories:
      mealFoods.reduce(
        (total, food) =>
          total + food.calories,
        0
      ),

    protein:
      mealFoods.reduce(
        (total, food) =>
          total + food.protein,
        0
      ),

    carbs:
      mealFoods.reduce(
        (total, food) =>
          total + food.carbs,
        0
      ),

    fat:
      mealFoods.reduce(
        (total, food) =>
          total + food.fat,
        0
      )
  };
};

const findFood = (
  availableFoods,
  name
) => {
  return availableFoods.find(
    (food) =>
      food.name === name
  );
};

const calculateMealTotals = (
  meals
) => {
  return meals.reduce(
    (total, meal) => {
      const nutrition =
        meal.foods.reduce(
          (mealTotal, item) => {
            const foodNutrition =
              calculateFoodNutrition(
                item.food,
                item.quantity
              );

            return {
              calories:
                mealTotal.calories +
                foodNutrition.calories,

              protein:
                mealTotal.protein +
                foodNutrition.protein,

              carbs:
                mealTotal.carbs +
                foodNutrition.carbs,

              fat:
                mealTotal.fat +
                foodNutrition.fat
            };
          },
          {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          }
        );

      return {
        calories:
          total.calories +
          nutrition.calories,

        protein:
          total.protein +
          nutrition.protein,

        carbs:
          total.carbs +
          nutrition.carbs,

        fat:
          total.fat +
          nutrition.fat
      };
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  );
};

const generateDietPlan = (
  profile
) => {
  const {
    weight,
    height,
    age,
    gender,
    activityLevel,
    physiqueGoal,
    dietPreference
  } = profile;

  /*
   * --------------------------------
   * DAILY TARGETS
   * --------------------------------
   */

  const calorieTarget =
    calculateDailyCalories(
      weight,
      height,
      age,
      gender,
      activityLevel,
      physiqueGoal
    );

  const proteinTarget =
    calculateProtein(
      weight,
      physiqueGoal
    );

  const macros =
    calculateMacros(
      calorieTarget,
      proteinTarget
    );

  /*
   * --------------------------------
   * AVAILABLE FOODS
   * --------------------------------
   */

  const availableFoods =
    getFoodsForDiet(
      dietPreference ||
        "vegetarian"
    );

  /*
   * --------------------------------
   * FIND FOODS
   * --------------------------------
   */

  const oats =
    findFood(
      availableFoods,
      "Oats"
    );

  const milk =
    findFood(
      availableFoods,
      "Milk"
    );

  const banana =
    findFood(
      availableFoods,
      "Banana"
    );

  const greekYogurt =
    findFood(
      availableFoods,
      "Greek Yogurt"
    );

  const apple =
    findFood(
      availableFoods,
      "Apple"
    );

  const chicken =
    findFood(
      availableFoods,
      "Chicken Breast"
    );

  const fish =
    findFood(
      availableFoods,
      "Fish"
    );

  const eggs =
    findFood(
      availableFoods,
      "Eggs"
    );

  const paneer =
    findFood(
      availableFoods,
      "Paneer"
    );

  const tofu =
    findFood(
      availableFoods,
      "Tofu"
    );

  const brownRice =
    findFood(
      availableFoods,
      "Brown Rice"
    );

  const sweetPotato =
    findFood(
      availableFoods,
      "Sweet Potato"
    );

  const roti =
    findFood(
      availableFoods,
      "Whole Wheat Roti"
    );

  const almonds =
    findFood(
      availableFoods,
      "Almonds"
    );

  const peanutButter =
    findFood(
      availableFoods,
      "Peanut Butter"
    );

  const chickpeas =
    findFood(
      availableFoods,
      "Chickpeas"
    );

  const lentils =
    findFood(
      availableFoods,
      "Lentils"
    );

  /*
   * =================================
   * BREAKFAST
   * =================================
   */

  const breakfastFoods = [];

  if (oats) {
    breakfastFoods.push({
      food: oats,
      quantity: 80
    });
  }

  if (milk) {
    breakfastFoods.push({
      food: milk,
      quantity: 250
    });
  }

  if (banana) {
    breakfastFoods.push({
      food: banana,
      quantity: 100
    });
  }

  /*
   * =================================
   * LUNCH
   * =================================
   */

  const lunchFoods = [];

  /*
   * Non-vegetarian protein
   */

  if (chicken) {
    lunchFoods.push({
      food: chicken,
      quantity: 100
    });
  }

  /*
   * Vegetarian protein
   */

  else if (
    dietPreference ===
      "vegetarian" ||
    dietPreference ===
      "eggetarian"
  ) {
    if (paneer) {
      lunchFoods.push({
        food: paneer,
        quantity: 100
      });
    }

    if (chickpeas) {
      lunchFoods.push({
        food: chickpeas,
        quantity: 100
      });
    }
  }

  /*
   * Vegan / fallback protein
   */

  else if (tofu) {
    lunchFoods.push({
      food: tofu,
      quantity: 200
    });
  }

  /*
   * =================================
   * SNACK
   * =================================
   */

  const snackFoods = [];

  if (greekYogurt) {
    snackFoods.push({
      food: greekYogurt,

      /*
       * Greek yogurt is used as a
       * major low-fat protein source.
       */

      quantity:
        dietPreference ===
          "vegetarian" ||
        dietPreference ===
          "eggetarian"
          ? 250
          : 150
    });
  }

  if (apple) {
    snackFoods.push({
      food: apple,
      quantity: 150
    });
  }

  /*
   * Keep fats controlled.
   */

  if (almonds) {
    snackFoods.push({
      food: almonds,
      quantity: 15
    });
  }

  if (
    peanutButter &&
    dietPreference !==
      "vegan"
  ) {
    snackFoods.push({
      food: peanutButter,
      quantity: 10
    });
  }

  /*
   * =================================
   * DINNER
   * =================================
   */

  const dinnerFoods = [];

  /*
   * Non-vegetarian dinner
   */

  if (fish) {
    dinnerFoods.push({
      food: fish,
      quantity: 150
    });
  }

  /*
   * Eggetarian dinner
   */

  else if (eggs) {
    dinnerFoods.push({
      food: eggs,
      quantity: 150
    });
  }

  /*
   * Vegetarian dinner
   */

  else if (
    dietPreference ===
      "vegetarian"
  ) {
    if (tofu) {
      dinnerFoods.push({
        food: tofu,
        quantity: 200
      });
    }

    if (lentils) {
      dinnerFoods.push({
        food: lentils,
        quantity: 150
      });
    }
  }

  /*
   * Vegan dinner
   */

  else if (tofu) {
    dinnerFoods.push({
      food: tofu,
      quantity: 250
    });

    if (lentils) {
      dinnerFoods.push({
        food: lentils,
        quantity: 150
      });
    }
  }

  /*
   * =================================
   * CARBOHYDRATE PORTIONS
   * =================================
   *
   * Use reasonable portions instead
   * of allowing one food to become
   * extremely large.
   */

  const calorieScale =
    Math.max(
      0.85,
      Math.min(
        1.35,
        calorieTarget / 2500
      )
    );

  if (brownRice) {
    lunchFoods.push({
      food: brownRice,
      quantity:
        200 * calorieScale
    });
  }

  if (sweetPotato) {
    dinnerFoods.push({
      food: sweetPotato,
      quantity:
        250 * calorieScale
    });
  } else if (brownRice) {
    dinnerFoods.push({
      food: brownRice,
      quantity:
        200 * calorieScale
    });
  }

  /*
   * =================================
   * ADDITIONAL CARBS
   * =================================
   *
   * Find the actual portion instead
   * of relying on array positions.
   */

  const oatmealPortion =
    breakfastFoods.find(
      (item) =>
        item.food === oats
    );

  const bananaPortion =
    breakfastFoods.find(
      (item) =>
        item.food === banana
    );

  if (
    calorieTarget > 2700 &&
    oatmealPortion
  ) {
    oatmealPortion.quantity +=
      20;
  }

  if (
    calorieTarget > 2700 &&
    bananaPortion
  ) {
    bananaPortion.quantity +=
      50;
  }

  /*
   * =================================
   * BUILD MEALS
   * =================================
   */

  const meals = [
    createMeal(
      "Breakfast",
      "Power Breakfast",
      breakfastFoods
    ),

    createMeal(
      "Lunch",
      "Balanced Lunch",
      lunchFoods
    ),

    createMeal(
      "Snack",
      "Energy Snack",
      snackFoods
    ),

    createMeal(
      "Dinner",
      "Recovery Dinner",
      dinnerFoods
    )
  ];

  /*
   * =================================
   * RETURN PLAN
   * =================================
   */

  return {
    calorieTarget,

    proteinTarget,

    carbTarget:
      macros.carbs,

    fatTarget:
      macros.fat,

    meals
  };
};

export default generateDietPlan;