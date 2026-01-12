// routes/resourceRoutes.js
import express from "express";
import multer from "multer";
import Resource from "../models/Resource.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// ----------------- Configure Multer -----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads/resources";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// ----------------- Upload Resource -----------------
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, description, uploadedBy, role } = req.body;

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newResource = new Resource({
      title,
      description,
      uploadedBy,
      role,
      fileUrl: `/uploads/resources/${req.file.filename}`,
    });

    await newResource.save();
    res.json({ message: "Resource uploaded successfully", resource: newResource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading resource" });
  }
});

// ----------------- Get All Resources -----------------
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching resources" });
  }
});

export default router;
