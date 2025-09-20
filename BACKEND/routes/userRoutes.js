
import express from "express";
import cookieParser from "cookie-parser";
import {
    signUp,
    login,
    refreshToken,
    logout,
    getProfile,
    auth
} from "../controllers/userControllers.js"; 
import authMiddleWare from "../middlewares/authMiddleWare.js";

const userRouter = express.Router();

userRouter.use(cookieParser());



userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/refresh", refreshToken);
userRouter.post("/logout", logout);
userRouter.post("/auth",auth)
userRouter.get("/me", authMiddleWare, getProfile);

export default userRouter;
