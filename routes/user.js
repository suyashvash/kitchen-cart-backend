import { Router } from "express";
import User from "../models/user.model.js";
import { sendResponse } from "../middleware/sendResponse.js";


const userRouter = Router();

userRouter.route('/all').get((req, res) => {

    const user = req.get('user');
    if (user == 'admin@123') {

        User.find()
            .then(users => sendResponse(res, true, users, "Users found !", 200))
            .catch(err => sendResponse(res, false, err, "Users not found !", 400));
    }
    else {
        sendResponse(res, false, null, "You are not authorized to view users !", 401);
    }
})

userRouter.route('/signup').post((req, res) => {

    const { email, password } = req.body;
    const username = email.split('@')[0];
    const newUser = new User({ username, password, fullName: "", email, address: "", cart: [] });

    newUser.save()
        .then(() => sendResponse(res, true, null, "User added !", 200))
        .catch(err => sendResponse(res, false, { email, password }, "User not added !", 400));
});


userRouter.route('/login').post((req, res) => {
    const { email, password } = req.body;

    User.find({ email, password })
        .then((user) => sendResponse(res, true, { token: user[0]._id, loggedIn: true }, "User found !", 200))
        .catch(err => sendResponse(res, false, err, "User not found !", 400));
})


userRouter.route('/update').put((req, res) => {
    const { fullName, address, username } = req.body;

    const _id = req.get('token');

    User.findById({ _id })
        .then((user) => {
            if (!user) {
                sendResponse(res, false, null, "User not found !", 400);
            }

            user.fullName = fullName;
            user.address = address;
            user.username = username;

            user
                .save()
                .then(() => sendResponse(res, true, null, "User updated !", 200))
                .catch((err) => sendResponse(res, false, err, "User not updated !", 400));
        })
        .catch((err) => sendResponse(res, false, err, "User not found !", 400));
});


export default userRouter;