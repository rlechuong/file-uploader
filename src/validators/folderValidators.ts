import { body } from "express-validator";
import { findSiblingFolderByName } from "../queries/folderQueries.js";

const folderValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required.")
    .isLength({ max: 255 })
    .withMessage("Folder name must be no longer than 255 characters.")
    .bail()
    .custom(async (value, { req }) => {
      const parentId = req.params?.id ?? null;
      const existing = await findSiblingFolderByName(value, req.user.id, parentId);
      if (existing) {
        throw new Error("A folder with this name already exists here.");
      }
      return true;
    }),
];

export { folderValidators };
