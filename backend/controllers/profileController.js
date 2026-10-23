import User from "../models/User.js";

const getProfile = async (
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

    res.json({
      success: true,
      profile: user
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      age,
      height,
      weight,
      gender,
      experience,
      activityLevel,
      workoutDays,
      equipment,
      physiqueGoal,
      dietPreference
    } = req.body;

    const user =
      await User.findById(
        req.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (age !== undefined) {
      user.age = age;
    }

    if (height !== undefined) {
      user.height = height;
    }

    if (weight !== undefined) {
      user.weight = weight;
    }

    if (gender !== undefined) {
      user.gender = gender;
    }

    if (experience !== undefined) {
      user.experience =
        experience;
    }

    if (
      activityLevel !== undefined
    ) {
      user.activityLevel =
        activityLevel;
    }

    if (
      workoutDays !== undefined
    ) {
      user.workoutDays =
        workoutDays;
    }

    if (equipment !== undefined) {
      user.equipment =
        equipment;
    }

    if (
      physiqueGoal !== undefined
    ) {
      user.physiqueGoal =
        physiqueGoal;
    }

    if (
      dietPreference !== undefined
    ) {
      user.dietPreference =
        dietPreference;
    }

    await user.save();

    const updatedUser =
      user.toObject();

    delete updatedUser.passwordHash;

    res.json({
      success: true,

      message:
        "Profile updated successfully",

      profile:
        updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProfile,
  updateProfile
};