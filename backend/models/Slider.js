import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  title: { type: String, required: true },  // e.g. "Wedding Collection"
  subtitle: { type: String, required: true }, // e.g. "Celebrate Love..."
  image: { type: String, required: true },   // URL to image
  redirectTo: { type: String, required: true } // e.g. "/collection/wedding"
}, { timestamps: true });

export default mongoose.model("Slider", sliderSchema);
