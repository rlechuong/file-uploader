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

export { getSignup, postSignup };
