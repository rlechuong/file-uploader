import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import path from "node:path";
import { createFile, deleteFile, findFileById } from "../queries/fileQueries.js";
import { formatDate, formatFileSize } from "../utils/formatters.js";
import { streamUpload } from "../config/cloudinary.js";

const postFileUpload = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated");
  }

  if (!req.file) {
    return res.status(400).send("File upload failed.");
  }

  const folderId = typeof req.params.id === "string" ? req.params.id : null;
  const fileId = crypto.randomUUID();

  try {
    const uploadResult = await streamUpload(req.file.buffer);

    const fileData = {
      id: fileId,
      name: req.file.originalname,
      storageKey: uploadResult.public_id,
      mimeType: req.file.mimetype,
      size: BigInt(req.file.size),
      url: uploadResult.secure_url,
      userId: req.user.id,
      folderId,
    };

    await createFile(fileData);
    return res.redirect(folderId ? `/folders/${folderId}` : "/folders");
  } catch (err) {
    return next(err);
  }
};

const getFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated.");
  }

  const fileId = req.params.id;
  if (typeof fileId !== "string") {
    return res.status(400).send("Invalid File ID.");
  }

  try {
    const file = await findFileById(fileId);
    if (!file) {
      return res.status(404).send("File not found.");
    }

    if (file.userId !== req.user.id) {
      return res.status(403).send("You do not have access to this file.");
    }

    return res.render("file", {
      file,
      formattedSize: formatFileSize(file.size),
      formattedCreatedDate: formatDate(file.createdAt),
      formattedUpdatedDate: formatDate(file.updatedAt),
    });
  } catch (err) {
    return next(err);
  }
};

const getFileDownload = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated.");
  }

  const fileId = req.params.id;
  if (typeof fileId !== "string") {
    return res.status(400).send("Invalid File ID.");
  }

  try {
    const file = await findFileById(fileId);
    if (!file) {
      return res.status(404).send("File not found.");
    }

    if (file.userId !== req.user.id) {
      return res.status(403).send("You do not have access to this file.");
    }

    return res.download(path.join("uploads", file.storageKey), file.name);
  } catch (err) {
    return next(err);
  }
};

const postDeleteFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated.");
  }

  const fileId = req.params.id;
  if (typeof fileId !== "string") {
    return res.status(400).send("Invalid File ID.");
  }

  try {
    const file = await findFileById(fileId);
    if (!file) {
      return res.status(404).send("File not found.");
    }

    if (file.userId !== req.user.id) {
      return res.status(403).send("You do not have access to this file.");
    }

    await deleteFile(fileId);
    return res.redirect(file.folderId ? `/folders/${file.folderId}` : "/folders");
  } catch (err) {
    return next(err);
  }
};

export { postFileUpload, getFile, getFileDownload, postDeleteFile };
