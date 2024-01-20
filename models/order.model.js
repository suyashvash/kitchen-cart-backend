import mongoose from "mongoose";
import Product from "./product.model.js";

const Schema = mongoose.Schema;

const orderSchema = Schema({
    userId: { type: String, required: true },
    status: { type: String, required: true },
    address: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    products: { type: Array, required: true },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order