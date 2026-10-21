const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
};

const isValidPassword = (password) => {
  return password && password.length >= 6;
};

const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

const isValidAge = (age) => {
  const numericAge = Number(age);

  return numericAge >= 13 && numericAge <= 100;
};

const isValidHeight = (height) => {
  const numericHeight = Number(height);

  return numericHeight >= 50 && numericHeight <= 250;
};

const isValidWeight = (weight) => {
  const numericWeight = Number(weight);

  return numericWeight >= 20 && numericWeight <= 300;
};

export {
  isValidEmail,
  isValidPassword,
  passwordsMatch,
  isValidAge,
  isValidHeight,
  isValidWeight
};