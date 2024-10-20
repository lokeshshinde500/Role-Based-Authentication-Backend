import bcrypt from "bcrypt";

// encrypt password
export const encryptPassword = async (password) => {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
};

// compare password
export const comparePassword = async (password, hashPassword) => {
  const isValid = await bcrypt.compare(password, hashPassword);
  return isValid;
};
