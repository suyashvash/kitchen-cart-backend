import mongoose from "mongoose";
import Product from "./product.model";

const Schema = mongoose.Schema;

const cartItemSchema = Schema({
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
}, { timestamps: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);
export default CartItem