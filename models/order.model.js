import mongoose from "mongoose";
import Product from "./product.model";

const Schema = mongoose.Schema;

const orderSchema = Schema({
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true },
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    product : { type: Product, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order