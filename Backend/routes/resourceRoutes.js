import express from "express";
import multer from "multer";
import Resource from "../models/Resource.js";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

// ----------------- Middleware: verify user from token -----------------
const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return res.status(401).json({ message: "Invalid token" });

    req.currentUser = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ----------------- Upload Resource -----------------
router.post("/upload", verifyUser, upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newResource = new Resource({
      title,
      description,
      uploadedBy: req.currentUser.name,
      role: req.currentUser.role,
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
router.get("/", verifyUser, async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching resources" });
  }
});

// ----------------- Delete Resource -----------------
router.delete("/:id", verifyUser, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    // Only admin or uploader can delete
    if (
      !["admin", "superadmin"].includes(req.currentUser.role) &&
      resource.uploadedBy !== req.currentUser.name
    ) {
      return res.status(403).json({ error: "You are not allowed to delete this resource" });
    }

    const filePath = path.join("./uploads/resources", path.basename(resource.fileUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting resource" });
  }
});

// ----------------- Edit Resource -----------------
router.put("/:id", verifyUser, upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    // Only admin or uploader can edit
    if (
      !["admin", "superadmin"].includes(req.currentUser.role) &&
      resource.uploadedBy !== req.currentUser.name
    ) {
      return res.status(403).json({ error: "You are not allowed to edit this resource" });
    }

    // If new file uploaded, delete old file and update
    if (req.file) {
      const oldFilePath = path.join("./uploads/resources", path.basename(resource.fileUrl));
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      resource.fileUrl = `/uploads/resources/${req.file.filename}`;
    }

    resource.title = title || resource.title;
    resource.description = description || resource.description;

    await resource.save();
    res.json({ message: "Resource updated successfully", resource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating resource" });
  }
});

export default router;
