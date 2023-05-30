import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "./table/user.model.js";

mongoose.set('strictQuery', true);

await mongoose.connect(
  "mongodb+srv://admin:admin123@backend.luoh6dz.mongodb.net/test"
);

const hashPasword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const newUser = {
  username: "agus",
  password: hashPasword("agus"),
  firstname: "agustin",
  lastname: "porlan",
  email: "agustin@mail.com"
};

await User.create(newUser);
