import { validationResult, matchedData } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import {
  createFolder,
  findFolderAndContents,
  findRootFolderContents,
} from "../queries/folderQueries.js";

const renderFolderView = async (
  req: Request,
  res: Response,
  next: NextFunction,
  errors: unknown[] = [],
) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated.");
  }

  const folderId = req.params.id;

  try {
    if (typeof folderId === "string") {
      const folder = await findFolderAndContents(folderId);

      if (!folder) {
        return res.status(404).send("Folder not found.");
      }

      if (folder.userId !== req.user.id) {
        return res.status(403).send("You do not have access to this folder.");
      }

      return res.render("folders", { folder, errors });
    }

    const folder = await findRootFolderContents(req.user.id);
    return res.render("folders", { folder, errors });
  } catch (err) {
    return next(err);
  }
};

const getFolderAndContents = async (req: Request, res: Response, next: NextFunction) => {
  return renderFolderView(req, res, next);
};

const postCreateFolder = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated.");
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return renderFolderView(req, res, next, errors.array());
  }

  const { name } = matchedData(req);
  const parentId = typeof req.params.id === "string" ? req.params.id : null;

  try {
    await createFolder(name, req.user.id, parentId);
    return res.redirect(parentId ? `/folders/${parentId}` : "/folders");
  } catch (err) {
    return next(err);
  }
};

export { getFolderAndContents, postCreateFolder };
