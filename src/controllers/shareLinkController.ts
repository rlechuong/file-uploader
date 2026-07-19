import type { Request, Response, NextFunction } from "express";
import { findFolderById } from "../queries/folderQueries.js";
import { getExpiresAt } from "../utils/duration.js";
import { createShareLink } from "../queries/shareLinkQueries.js";
import { renderFolderView } from "./folderController.js";
import { renderError } from "../utils/errors.js";

const postCreateShareLink = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return renderError(res, 401, "Not authenticated.");
  }

  const folderId = req.params.id;
  if (typeof folderId !== "string") {
    return renderError(res, 400, "Invalid Folder ID.");
  }

  try {
    const folder = await findFolderById(folderId);
    if (!folder) {
      return renderError(res, 404, "Folder not found.");
    }

    if (folder.userId !== req.user.id) {
      return renderError(res, 403, "You do not have access to this folder.");
    }

    const shareLinkDuration = req.body.shareLinkDuration;
    const expiresAt = getExpiresAt(shareLinkDuration);
    if (!expiresAt) {
      return renderError(res, 400, "Invalid share link duration.");
    }

    const shareLink = await createShareLink(folderId, expiresAt);

    return renderFolderView(req, res, next, [], shareLink);
  } catch (err) {
    return next(err);
  }
};

export { postCreateShareLink };
