import User from "../models/User.js";
import DietPlan from "../models/DietPlan.js";
import generateDietPlan from "../services/dietGenerator.js";

const generateDiet = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await User.findById(
        req.userId
      ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Provide robust fallback defaults so the generator never crashes
    const profile = {
      age: user.age || 22,
      height: user.height || 175,
      weight: user.weight || 70,
      gender: user.gender || "male",
      activityLevel:
        user.activityLevel || "moderate",
      physiqueGoal:
        user.physiqueGoal || "lean",
      dietPreference:
        user.dietPreference || "non-vegetarian"
    };

    const generatedPlan =
      generateDietPlan(
        profile
      );

    // Optional: clear old plans or keep history. Let's create a fresh one.
    const dietPlan =
      await DietPlan.create({
        userId: req.userId,
        calorieTarget:
          generatedPlan.calorieTarget || 2000,
        proteinTarget:
          generatedPlan.proteinTarget || 150,
        carbTarget:
          generatedPlan.carbTarget || 200,
        fatTarget:
          generatedPlan.fatTarget || 70,
        meals:
          generatedPlan.meals || []
      });

    res.status(201).json({
      success: true,
      message:
        "Diet plan generated successfully",
      dietPlan
    });
  } catch (error) {
    next(error);
  }
};

const getDietPlan = async (
  req,
  res,
  next
) => {
  try {
    let dietPlan =
      await DietPlan.findOne({
        userId: req.userId
      }).sort({
        createdAt: -1
      });

    // Auto-generate a plan if none exists so the user never gets a 404/500 block on the frontend
    if (!dietPlan) {
      const user = await User.findById(req.userId);
      if (user) {
        const profile = {
          age: user.age || 22,
          height: user.height || 175,
          weight: user.weight || 70,
          gender: user.gender || "male",
          activityLevel: user.activityLevel || "moderate",
          physiqueGoal: user.physiqueGoal || "lean",
          dietPreference: user.dietPreference || "non-vegetarian"
        };
        const generatedPlan = generateDietPlan(profile);
        dietPlan = await DietPlan.create({
          userId: req.userId,
          calorieTarget: generatedPlan.calorieTarget || 2000,
          proteinTarget: generatedPlan.proteinTarget || 150,
          carbTarget: generatedPlan.carbTarget || 200,
          fatTarget: generatedPlan.fatTarget || 70,
          meals: generatedPlan.meals || []
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User not found. Please log in again."
        });
      }
    }

    res.json({
      success: true,
      dietPlan
    });
  } catch (error) {
    next(error);
  }
};

export {
  generateDiet,
  getDietPlan
};