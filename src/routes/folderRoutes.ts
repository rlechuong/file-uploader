import { Router } from "express";
import {
  getFolderAndContents,
  postCreateFolder,
  postDeleteFolder,
  postRenameFolder,
} from "../controllers/folderController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { createFolderValidators, renameFolderValidators } from "../validators/folderValidators.js";
import { postCreateShareLink } from "../controllers/shareLinkController.js";

const folderRouter = Router();

folderRouter.get("/folders", requireAuth, getFolderAndContents);
folderRouter.get("/folders/:id", requireAuth, getFolderAndContents);

folderRouter.post("/folders", requireAuth, createFolderValidators, postCreateFolder);
folderRouter.post("/folders/:id/folders", requireAuth, createFolderValidators, postCreateFolder);
folderRouter.post("/folders/:id/rename", requireAuth, renameFolderValidators, postRenameFolder);
folderRouter.post("/folders/:id/delete", requireAuth, postDeleteFolder);
folderRouter.post("/folders/:id/share", requireAuth, postCreateShareLink);

export { folderRouter };
