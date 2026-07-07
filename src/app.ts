import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  res.send("File Uploader is running");
});

app.listen(PORT, () => {
  console.log(`Server Listening On Port ${PORT}`);
});
