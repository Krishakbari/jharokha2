import express from "express"
import { loginController, profile, registerController, updateProfileController} from "../controllers/userConrtroller.js"
import {requiredSignIn,isAdmin} from "../middleware/authMiddleware.js"
// router obj
const router=express.Router()

// register || post
router.post("/register",registerController )

// login || post
router.post("/login",loginController )

// update route
router.put("/update-profile", requiredSignIn, updateProfileController);

// profile
router.get("/user-profile", requiredSignIn, profile);


export default router