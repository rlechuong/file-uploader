import { body } from "express-validator";
import { findUserByEmail } from "../queries/userQueries.js";

const signupValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .isLength({ max: 255 })
    .withMessage("Email must be no longer than 255 characters.")
    .bail()
    .normalizeEmail()
    .custom(async (value) => {
      const existingUser = await findUserByEmail(value);
      if (existingUser) {
        throw new Error("An account with this email already exists.");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 16, max: 64 })
    .withMessage("Password must be between 16 and 64 characters."),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Please confirm password.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password.");
      }
      return true;
    }),
];

export { signupValidators };
