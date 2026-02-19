import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin", "staff"], default: "customer" },
    phone: { type: String },
    address: {
        street: String,
        city: String,
        pincode: String,
        state: String,
    }
}, {
    timestamps: true,
});

const User = models.User || model("User", UserSchema);

export default User;
