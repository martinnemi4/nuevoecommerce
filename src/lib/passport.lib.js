import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";
import { Carts } from "../table/car.model.js";
import { User }from '../table/user.model.js';

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const validatePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

const loginStrategy = new LocalStrategy(async (username, password, done) => {
  try {

    const user = await User.findOne({ username });

    if (!user || !validatePassword(password, user.password)) {
      return done("Invalid credentials", null);
    }

    return done(null, user);

  } catch (err) {

    return done("Error while login in", err);
  }
});

const registerStrategy = new LocalStrategy( { passReqToCallback: true }, async (req, username, password, done) => {

  try {
    
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return done("Username already in use", null);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      username,
      password: hashedPassword,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      adress: req.body.adress,
      age: req.body.age,
      photo: req.body.photo
    };

    const createdUser = await User.create(newUser);

    await Carts.create({ username: username, products: [] });

    return done(null, createdUser);

  } catch (err) {
    console.error(err);
    return done("Error while registering", null);
  }
}
);

export const passportStrategies = { loginStrategy, registerStrategy };