import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { upload } from "../config/multer.js";
import { postFileUpload } from "../controllers/fileController.js";

const fileRouter = Router();

fileRouter.post("/files", requireAuth, upload.single("file"), postFileUpload);
fileRouter.post("/folders/:id/files", requireAuth, upload.single("file"), postFileUpload);

export { fileRouter };
