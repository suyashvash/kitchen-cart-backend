import { Router } from "express";
import { sendResponse } from "../middleware/sendResponse";

const routineRouter = Router();


routineRouter.route('/wakeup').get((req, res) => {
    sendResponse(res, true, null, "Server is up and running !", 200);
});



export default routineRouter;