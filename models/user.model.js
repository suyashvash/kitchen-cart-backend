import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String },
    email: { type: String },
    address: { type: String },
    cart: { type: Array },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User