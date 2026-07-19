import "dotenv/config";
import path from "node:path";
import express from "express";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "passport";
import { prisma } from "./config/prisma.js";
import { authRouter } from "./routes/authRoutes.js";
import { folderRouter } from "./routes/folderRoutes.js";
import { fileRouter } from "./routes/fileRoutes.js";
import { shareLinkRouter } from "./routes/shareLinkRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { renderError } from "./utils/errors.js";

import "./config/passport.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error("SESSION_SECRET environment variable not set.");
}

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "../views"));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(import.meta.dirname, "../public")));

app.use(
  expressSession({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/", authRouter);

app.use("/", folderRouter);

app.use("/", fileRouter);

app.use("/", shareLinkRouter);

app.get("/", (req, res) => {
  res.redirect("/folders");
});

app.use((req, res) => {
  renderError(res, 404, "Page not found.");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Listening On Port ${PORT}`);
});
