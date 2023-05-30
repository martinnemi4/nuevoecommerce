import { model, Schema } from "mongoose";

const userSchema = Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    phone: { type: Number },
    adress: { type: String },
    age: { type: Number },
    photo: { Type: String }
});

export const User = model("user", userSchema);