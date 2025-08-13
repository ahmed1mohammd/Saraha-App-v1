import bcrypt from "bcryptjs";

export const generateHash = async ({plaintext ="", saltRound = process.env.SALT}={})=>{
    return bcrypt.hashSync(plaintext, parseInt(saltRound))
}

export const comparHash = async ({ plaintext, hashValue }) => {
  if (!hashValue) return false;
  return bcrypt.compare(plaintext, hashValue);
};
