import { Router } from "express";
import CartItem from "../models/cartItem.model.js";
import { sendResponse } from "../middleware/sendResponse.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";


const cartRouter = Router();


cartRouter.route('/').get((req, res) => {
    const userId = req.get('token');

    User.findOne({ _id: userId })
        .then(user => {
            if (user) {
                let cart = user.cart;
                let temp = []
                cart.forEach((element, index) => {
                    Product.findOne({ _id: element.productId })
                        .then(product => {
                            if (product) {

                                element.product = product;
                                temp.push(element)
                                console.log(temp.length);
                                console.log(cart.length);

                                if (temp.length == cart.length) {
                                    sendResponse(res, true, temp, "Cart found !", 200)
                                }
                            }
                        })
                        .catch(err => sendResponse(res, false, err, "Product not found !", 400));


                })

            } else {
                sendResponse(res, false, null, "Cart not found !", 400);
            }
        })
        .catch(err => sendResponse(res, false, err, "User not found !", 400));
})

cartRouter.route("/add").post((req, res) => {
    const userId = req.get('token');
    const { productId, quantity } = req.body;


    Product.findOne({ _id: productId })
        .then(product => {
            if (product) {

                const newCartItem = new CartItem({
                    productId,
                    userId,
                    quantity,
                    totalPrice: quantity * product.price,
                    basePrice: product.price,

                })

                User.findOne({ _id: userId })
                    .then(user => {
                        if (user) {
                            user.cart.push(newCartItem);
                            user.save()
                                .then(() => sendResponse(res, true, newCartItem, "Item added to cart !", 200))
                                .catch(err => sendResponse(res, false, null, "Item not added to cart !", 400));
                        } else {
                            sendResponse(res, false, null, "User not found !", 400);
                        }
                    })
                    .catch(err => sendResponse(res, false, err, "User not found !", 400));
            } else {
                sendResponse(res, false, null, "Product not found !", 400);
            }
        })
        .catch(err => sendResponse(res, false, err, "Product not found !", 400));
})


cartRouter.route("/updateQuantity").put((req, res) => {
    const userId = req.get('token');
    const { quantity, cartItemId } = req.body;

    User.findOne({ _id: userId })
        .then(user => {
            if (user) {
                let thisItem = user.cart.find(item => item._id == cartItemId);
                if (thisItem) {
                    thisItem.quantity = quantity;
                    thisItem.totalPrice = quantity * thisItem.basePrice;
                    user.save()
                        .then(() => sendResponse(res, true, thisItem, "Cart item updated !", 200))
                        .catch(err => sendResponse(res, false, err, "Cart item not updated !", 400));
                } else {
                    sendResponse(res, false, null, "Cart item not found !", 400);
                }

            } else {
                sendResponse(res, false, null, "User not found !", 400);
            }
        })
        .catch(err => sendResponse(res, false, err, "User not found !", 400));
})


cartRouter.route("/delete").delete((req, res) => {
    const userId = req.get('token');
    const { cartItemId } = req.body;

    User.findOne({ _id: userId })
        .then(user => {
            if (user) {
                let thisItem = user.cart.find(item => item._id == cartItemId);
                if (thisItem) {
                    user.cart = user.cart.filter(item => item._id != cartItemId);
                    user.save()
                        .then(() => sendResponse(res, true, null, "Cart item deleted !", 200))
                        .catch(err => sendResponse(res, false, err, "Cart item not deleted !", 400));
                } else {
                    sendResponse(res, false, null, "Cart item not found !", 400);
                }

            } else {
                sendResponse(res, false, null, "User not found !", 400);
            }
        })
        .catch(err => sendResponse(res, false, err, "User not found !", 400));
})

export default cartRouter;