import type { Request, Response, NextFunction } from "express";
import path from "node:path";
import { findShareLinkByToken } from "../queries/shareLinkQueries.js";
import { findFolderAndContents, isDescendantOf } from "../queries/folderQueries.js";
import { findFileById } from "../queries/fileQueries.js";
import { sanitizeForUrl } from "../utils/formatters.js";
import { cloudinary } from "../config/cloudinary.js";

const getSharedView = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.token;
  if (typeof token !== "string") {
    return res.status(400).send("Invalid share link token.");
  }

  try {
    const shareLink = await findShareLinkByToken(token);
    if (!shareLink) {
      return res.status(404).send("Share link not found.");
    }

    if (shareLink.expiresAt < new Date()) {
      return res.status(410).send("This link has expired.");
    }

    const requestedFolderId =
      typeof req.params.id === "string" ? req.params.id : shareLink.folderId;

    if (req.params.id) {
      const isAllowed = await isDescendantOf(requestedFolderId, shareLink.folderId);
      if (!isAllowed) {
        return res.status(403).send("You do not have access to this folder.");
      }
    }

    const folder = await findFolderAndContents(requestedFolderId);
    if (!folder) {
      return res.status(404).send("Folder not found.");
    }
    return res.render("sharedFolder", {
      folder,
      sharedToken: token,
      sharedRootFolderId: shareLink.folderId,
    });
  } catch (err) {
    return next(err);
  }
};

const getSharedFileDownload = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.token;
  if (typeof token !== "string") {
    return res.status(400).send("Invalid share link token.");
  }

  const fileId = req.params.fileId;
  if (typeof fileId !== "string") {
    return res.status(400).send("Invalid File ID.");
  }

  try {
    const shareLink = await findShareLinkByToken(token);
    if (!shareLink) {
      return res.status(404).send("Share link not found.");
    }
    if (shareLink.expiresAt < new Date()) {
      return res.status(410).send("This link has expired.");
    }

    const file = await findFileById(fileId);
    if (!file) {
      return res.status(404).send("File not found.");
    }
    if (!file.folderId) {
      return res.status(403).send("You do not have access to this file.");
    }

    const isAllowed = await isDescendantOf(file.folderId, shareLink.folderId);
    if (!isAllowed) {
      return res.status(403).send("You do not have access to this file.");
    }

    const extension = path.extname(file.name);
    const nameWithoutExtension = path.basename(file.name, extension);
    const safeName = sanitizeForUrl(nameWithoutExtension);

    const downloadUrl = cloudinary.url(file.storageKey, {
      resource_type: file.resourceType,
      flags: `attachment:${safeName}`,
    });

    return res.redirect(downloadUrl);
  } catch (err) {
    return next(err);
  }
};

export { getSharedView, getSharedFileDownload };
