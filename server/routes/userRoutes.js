import express from "express";
import { getUser, loginUser, registerUser, forgotPassword, googleLogin } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/google-login", googleLogin);


export default userRouter;