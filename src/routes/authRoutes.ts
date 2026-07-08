import { Router } from "express";
import passport from "passport";
import { getLogin, getSignup, postSignup, postLogout } from "../controllers/authController.js";
import { signupValidators } from "../validators/authValidators.js";

const authRouter = Router();

authRouter.get("/signup", getSignup);

authRouter.post("/signup", signupValidators, postSignup);

authRouter.get("/login", getLogin);

authRouter.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (err: Error | null, user: Express.User | false, info: { message?: string } | undefined) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        req.session.messages = info?.message ? [info.message] : [];
        req.session.formData = { email: req.body.email };
        return res.redirect("/login");
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    },
  )(req, res, next);
});

authRouter.post("/logout", postLogout);

export { authRouter };
