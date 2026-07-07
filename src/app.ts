import "dotenv/config";
import express from "express";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./config/prisma.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error("SESSION_SECRET environment variable not set.");
}

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

app.get("/", (req, res) => {
  res.send("File Uploader is running");
});

app.listen(PORT, () => {
  console.log(`Server Listening On Port ${PORT}`);
});
