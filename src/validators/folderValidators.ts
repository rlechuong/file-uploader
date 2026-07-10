import { body } from "express-validator";
import { findFolderById, findSiblingFolderByName } from "../queries/folderQueries.js";

const createFolderValidators = [
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

const renameFolderValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required.")
    .isLength({ max: 255 })
    .withMessage("Folder name must be no longer than 255 characters.")
    .bail()
    .custom(async (value, { req }) => {
      const folderId = req.params?.id ?? null;
      const currentFolder = await findFolderById(folderId);
      if (!currentFolder) {
        throw new Error("Folder not found.");
      }

      const existing = await findSiblingFolderByName(value, req.user.id, currentFolder.parentId);
      if (existing && existing.id !== folderId) {
        throw new Error("A folder with this name already exists here.");
      }
      return true;
    }),
];

export { createFolderValidators, renameFolderValidators };
