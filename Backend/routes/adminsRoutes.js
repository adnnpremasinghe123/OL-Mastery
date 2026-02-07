import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* --------------------------------------------------
   GET ALL ADMINS (admin + superadmin)
-------------------------------------------------- */
router.get("/view", async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: ["admin", "superadmin"] }
    }).select("-password"); // Remove password

    res.json(admins);
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* --------------------------------------------------
   EDIT ADMIN
-------------------------------------------------- */
router.put("/edit/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updatedAdmin = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    console.error("Error updating admin:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* --------------------------------------------------
   DELETE ADMIN
-------------------------------------------------- */
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedAdmin = await User.findByIdAndDelete(req.params.id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
