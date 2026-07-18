import type { Request, Response, NextFunction } from "express";
import { findFolderById } from "../queries/folderQueries.js";
import { getExpiresAt } from "../utils/duration.js";
import { createShareLink } from "../queries/shareLinkQueries.js";
import { renderFolderView } from "./folderController.js";

const postCreateShareLink = async (req: Request, res: Response, next: NextFunction) => {
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

    const shareLinkDuration = req.body.shareLinkDuration;
    const expiresAt = getExpiresAt(shareLinkDuration);
    if (!expiresAt) {
      return res.status(400).send("Invalid share link duration.");
    }

    const shareLink = await createShareLink(folderId, expiresAt);

    return renderFolderView(req, res, next, [], shareLink);
  } catch (err) {
    return next(err);
  }
};

export { postCreateShareLink };
