import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number },
    brand: { type: String, required: true },
    category: { type: String, required: true },

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product