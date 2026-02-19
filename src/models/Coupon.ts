import mongoose, { Schema, model, models } from "mongoose";

const CouponSchema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true }, // 'percentage' or 'fixed'
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    usageLimit: { type: Number, default: null }, // Total times coupon can be used
    usageLimitPerUser: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date, default: null },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const Coupon = models.Coupon || model("Coupon", CouponSchema);

export default Coupon;
