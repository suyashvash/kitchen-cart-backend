import mongoose from "mongoose";
import Product from "./product.model.js";

const Schema = mongoose.Schema;

const orderSchema = Schema({
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true },
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    product : { type: Object, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order