import { validationResult, matchedData } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import {
  createFolder,
  findFolderById,
  findFolderAndContents,
  findRootFolderContents,
  updateFolder,
  deleteFolder,
} from "../queries/folderQueries.js";

const renderFolderView = async (
  req: Request,
  res: Response,
  next: NextFunction,
  errors: unknown[] = [],
  shareLink: { token: string } | null = null,
) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated.");
  }

  const sessionMessages = req.session.messages ?? [];
  req.session.messages = [];
  const normalizedSessionMessages = sessionMessages.map((message) => ({ msg: message }));
  const allErrors = [...errors, ...normalizedSessionMessages];

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

      return res.render("folders", { folder, allErrors, shareLink });
    }

    const folder = await findRootFolderContents(req.user.id);
    return res.render("folders", { folder, allErrors, shareLink });
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

const postRenameFolder = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated.");
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return renderFolderView(req, res, next, errors.array());
  }

  const { name } = matchedData(req);
  const folderId = req.params.id;

  if (typeof folderId !== "string") {
    return res.status(400).send("Invalid Folder ID.");
  }

  try {
    const folder = await findFolderById(folderId);

    if (!folder) {
      return res.status(404).send("Folder not found.");
    }

    if (folder.userId !== req.user.id) {
      return res.status(403).send("You do not have access to this folder.");
    }

    await updateFolder(folderId, name);
    return res.redirect(`/folders/${folderId}`);
  } catch (err) {
    return next(err);
  }
};

const postDeleteFolder = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated.");
  }

  const folderId = req.params.id;

  if (typeof folderId !== "string") {
    return res.status(400).send("Invalid Folder ID.");
  }

  try {
    const folder = await findFolderById(folderId);

    if (!folder) {
      return res.status(404).send("Folder not found.");
    }

    if (folder.userId !== req.user.id) {
      return res.status(403).send("You do not have access to this folder.");
    }

    await deleteFolder(folderId);
    return res.redirect(folder.parentId ? `/folders/${folder.parentId}` : "/folders");
  } catch (err) {
    return next(err);
  }
};

export {
  renderFolderView,
  getFolderAndContents,
  postCreateFolder,
  postRenameFolder,
  postDeleteFolder,
};
