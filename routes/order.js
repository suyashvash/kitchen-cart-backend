import { Router } from "express";
import Order from "../models/order.model.js";
import { sendResponse } from "../middleware/sendResponse.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";


const orderRouter = Router();


orderRouter.route('/').get((req, res) => {

    const userId = req.get('token');

    User.findOne({ _id: userId })
        .then(user => {
            if (user) {
                Order.find({ userId: userId })
                    .then(orders => sendResponse(res, true, orders, "Orders found !", 200))
                    .catch(err => sendResponse(res, false, null, "Orders not found !", 400));
            } else {
                sendResponse(res, false, null, "User not found !", 400);
            }
        })
        .catch(err => sendResponse(res, false, err, "User not found !", 400));
})


orderRouter.route("/add").post((req, res) => {
    const userId = req.get('token');
    const { productId, quantity, address } = req.body;


    User.findOne({ _id: userId })
        .then(user => {
            if (user) {
                Product.findOne({ _id: productId })
                    .then(product => {
                        if (product) {

                            const newOrder = new Order({
                                productId,
                                userId: userId,
                                quantity,
                                address,
                                totalPrice: quantity * product.price,
                                product,
                                status: "Accepted"
                            })

                            newOrder.save()
                                .then(() => sendResponse(res, true, newOrder, "Order placed !", 200))
                                .catch(err => sendResponse(res, false, err, "Order not placed !", 400));
                        } else {
                            sendResponse(res, false, null, "Product not found !", 400);
                        }
                    })
                    .catch(err => sendResponse(res, false, err, "Product not found !", 400));
            } else {
                sendResponse(res, false, null, "User not found !", 400);
            }
        })
        .catch(err => sendResponse(res, false, err, "User not found !", 400));
})

orderRouter.route("/markDelivered").put((req, res) => {
    const userId = req.get('token');
    const { orderId } = req.body;

    Order.findOne({ _id: orderId, userId })
        .then(order => {
            if (order) {
                order.status = "Delivered";
                order.save()
                    .then(() => sendResponse(res, true, null, "Order marked as delivered !", 200))
                    .catch(err => sendResponse(res, false, err, "Order not marked as delivered !", 400));
            } else {
                sendResponse(res, false, null, "Order not found !", 400);
            }
        })
        .catch(err => sendResponse(res, false, err, "Order not found !", 400));
})

export default orderRouter;
