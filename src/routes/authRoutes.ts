import { Router } from "express";
import { getSignup, postSignup } from "../controllers/authController.js";
import { signupValidators } from "../validators/authValidators.js";

const authRouter = Router();

authRouter.get("/signup", getSignup);

authRouter.post("/signup", signupValidators, postSignup);

export { authRouter };
