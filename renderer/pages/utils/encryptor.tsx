import bcrypt from "bcryptjs";

export function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  return hashedPassword;
}

export async function comparePassword(password1, password2) {
  const res = await bcrypt.compare(password1, password2);

  return res;
}
