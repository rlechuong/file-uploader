import { validationResult, matchedData } from "express-validator";
import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { createUser } from "../queries/userQueries.js";

const getSignup = (req: Request, res: Response) => {
  res.render("signup", { errors: [], formData: {} });
};

const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render("signup", { errors: errors.array(), formData: { email: req.body.email } });
  }

  const { email, password } = matchedData(req);
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({ email, passwordHash });

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  } catch (err) {
    return next(err);
  }
};

const getLogin = (req: Request, res: Response) => {
  const messages = req.session.messages ?? [];
  const formData = req.session.formData ?? {};
  req.session.messages = [];
  req.session.formData = {};

  res.render("login", { errors: messages, formData });
};

const postLogout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.clearCookie("connect.sid", { path: "/" });
      return res.redirect("/");
    });
  });
};

export { getSignup, postSignup, getLogin, postLogout };
