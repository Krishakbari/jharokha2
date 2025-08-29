import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import Slider from "../models/Slider.js";

const router = express.Router();

// Create a new slider
router.post("/slider", upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, redirectTo } = req.body;
    const image = `/img/${req.file.filename}`;

    const newSlider = await Slider.create({ title, subtitle, image, redirectTo });
    res.status(201).json(newSlider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all sliders
router.get("/slider", async (_, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete slider
router.delete("/slider/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Slider.findByIdAndDelete(id);
    res.json({ message: "Slider deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/slider/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, redirectTo } = req.body;
    const updateData = { title, subtitle, redirectTo };

    // If a new image is uploaded
    if (req.file) {
      updateData.image = `/img/${req.file.filename}`;
    }

    const updatedSlider = await Slider.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedSlider) return res.status(404).json({ message: "Slider not found" });
    res.json(updatedSlider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



export default router;
