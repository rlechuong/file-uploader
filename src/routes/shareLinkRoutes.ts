import { Router } from "express";
import { getSharedFileDownload, getSharedView } from "../controllers/shareLinkViewController.js";

const shareLinkRouter = Router();

shareLinkRouter.get("/shared/:token", getSharedView);
shareLinkRouter.get("/shared/:token/:id", getSharedView);
shareLinkRouter.get("/shared/:token/files/:fileId/download", getSharedFileDownload);

export { shareLinkRouter };
