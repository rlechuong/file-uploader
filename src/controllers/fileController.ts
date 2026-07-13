import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { createFile } from "../queries/fileQueries.js";

const postFileUpload = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated");
  }

  if (!req.file) {
    return res.status(400).send("File upload failed.");
  }

  const folderId = typeof req.params.id === "string" ? req.params.id : null;
  const fileId = crypto.randomUUID();

  const fileData = {
    id: fileId,
    name: req.file.originalname,
    storageKey: req.file.filename,
    mimeType: req.file.mimetype,
    size: BigInt(req.file.size),
    url: `/files/${fileId}/download`,
    userId: req.user.id,
    folderId,
  };

  try {
    await createFile(fileData);
    return res.redirect(folderId ? `/folders/${folderId}` : "/folders");
  } catch (err) {
    return next(err);
  }
};

export { postFileUpload };
