const validateRegistration = (
  req,
  res,
  next
) => {
  const {
    name,
    email,
    password
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Name, email and password are required"
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 6 characters"
    });
  }

  next();
};

const validateLogin = (
  req,
  res,
  next
) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Email and password are required"
    });
  }

  next();
};

const validateProfile = (
  req,
  res,
  next
) => {
  const {
    age,
    height,
    weight
  } = req.body;

  if (
    age !== undefined &&
    (age < 13 || age > 100)
  ) {
    return res.status(400).json({
      success: false,
      message: "Age must be between 13 and 100"
    });
  }

  if (
    height !== undefined &&
    (height < 50 || height > 250)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Height must be between 50 and 250 cm"
    });
  }

  if (
    weight !== undefined &&
    (weight < 20 || weight > 300)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Weight must be between 20 and 300 kg"
    });
  }

  next();
};

export {
  validateRegistration,
  validateLogin,
  validateProfile
};