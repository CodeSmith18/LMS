
import express from "express";
import cookieParser from "cookie-parser";
import {
    signUp,
    login,
    refreshToken,
    logout,
    getProfile
} from "../controllers/userControllers"; 
import authMiddleWare from "../middlewares/authMiddleWare";

const userRouter = express.Router();

userRouter.use(cookieParser());



userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/refresh", refreshToken);
userRouter.post("/logout", logout);
userRouter.get("/me", authMiddleWare, getProfile);

export default userRouter;
