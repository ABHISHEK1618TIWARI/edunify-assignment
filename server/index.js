import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN?.split(",") || "*",
  })
);


const imagesDir = path.join(__dirname, "schoolImages");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}


app.use("/schoolImages", express.static(imagesDir));


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  },
});
const upload = multer({ storage });


const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  connectionLimit: 10,
});


app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});


app.post("/api/schools", upload.single("image"), async (req, res) => {
  try {
    const { name, address, city, state, contact, email_id } = req.body;
    if (!name || !address || !city || !state || !contact || !email_id) {
      
      return res.status(400).json({ error: "All fields are required." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Image is required." });
    }

    const imageFilename = req.file.filename;

    const sql = `
      INSERT INTO schools (name, address, city, state, contact, image, email_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const vals = [name, address, city, state, contact, imageFilename, email_id];
    const [result] = await pool.execute(sql, vals);

    res.status(201).json({
      id: result.insertId,
      name,
      address,
      city,
      state,
      contact,
      email_id,
      image: imageFilename,
      imageUrl: `${process.env.BASE_URL}/schoolImages/${imageFilename}`,
    });
  } catch (err) {
    console.error("Create school error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



app.get("/api/schools", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, address, city, image FROM schools ORDER BY id DESC"
    );

    const list = rows.map((r) => ({
      ...r,
      imageUrl: `${process.env.BASE_URL}/schoolImages/${r.image}`,
    }));
    res.json(list);
  } catch (err) {
    console.error("Fetch schools error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
