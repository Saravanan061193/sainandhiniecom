import mongoose, { Schema, model, models } from "mongoose";

const ShippingRateSchema = new Schema({
    minWeight: { type: Number, required: true }, // in kg
    maxWeight: { type: Number, required: true }, // in kg
    rate: { type: Number, required: true }, // in currency
}, {
    timestamps: true,
});

const ShippingRate = models.ShippingRate || model("ShippingRate", ShippingRateSchema);

export default ShippingRate;
