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
    const { address } = req.body;


    User.findOne({ _id: userId })
        .then(user => {
            if (user) {
                let totalCartPrice = 0;
                let cart = user.cart;
                let products = [];

                if (cart.length == 0) {
                    sendResponse(res, false, 'null', "Cart is empty !", 400);
                    return
                } else {
                    cart.forEach((element, index) => {
                        Product.findOne({ _id: element.productId })
                            .then(product => {
                                if (product) {
                                    totalCartPrice += element.quantity * product.price;
                                    products.push({
                                        productId: product._id,
                                        quantity: element.quantity,
                                        basePrice: product.price,
                                        product: product
                                    })

                                    if (products.length == cart.length) {
                                        const newOrder = new Order({
                                            userId: userId,
                                            address,
                                            totalPrice: totalCartPrice,
                                            status: "Accepted",
                                            products: products
                                        })
                                        user.cart = []
                                        user.save()
                                        newOrder.save()
                                            .then(() => sendResponse(res, true, 'newOrder', "Order placed !", 200))
                                            .catch(err => sendResponse(res, false, 'err', "Order not placed !", 400));
                                    }
                                }
                            })
                            .catch(err => sendResponse(res, false, 'err', "Product not found !", 400));
                    })
                }
            } else {
                sendResponse(res, false, 'null', "User not found !", 400);
            }
        })
        .catch(err => sendResponse(res, false, 'err', "User not found !", 400));
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
