import { Router } from "express";
import { getFolderAndContents, postCreateFolder } from "../controllers/folderController";
import { requireAuth } from "../middleware/requireAuth.js";
import { folderValidators } from "../validators/folderValidators.js";

const folderRouter = Router();

folderRouter.get("/folders", requireAuth, getFolderAndContents);

folderRouter.get("/folders/:id", requireAuth, getFolderAndContents);

folderRouter.post("/folders", requireAuth, folderValidators, postCreateFolder);

folderRouter.post("/folders/:id/folders", requireAuth, folderValidators, postCreateFolder);

export { folderRouter };
