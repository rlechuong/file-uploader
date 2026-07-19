import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { renderError } from "../utils/errors.js";

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const match = req.originalUrl.match(/^\/folders\/([^/]+)\/files/);
  const folderId = match ? match[1] : null;
  const redirectPath = folderId ? `/folders/${folderId}` : "/folders";

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      req.session.messages = ["Maximum file size is 10 MB"];
      return req.session.save(() => {
        res.redirect(redirectPath);
      });
    }
    req.session.messages = [`Upload Error: ${err.message}`];
    return req.session.save(() => {
      res.redirect(redirectPath);
    });
  }

  if (err instanceof Error && err.message === "File type not allowed.") {
    req.session.messages = [err.message];
    return req.session.save(() => {
      res.redirect(redirectPath);
    });
  }

  return renderError(res, 500, "Something went wrong.");
};

export { errorHandler };
