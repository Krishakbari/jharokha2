import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
      index: true,
    },
    url:  { type: String, required: true },      // e.g. /img/uploads/123abc.jpg
    alt:  { type: String, default: "" },
    order:{ type: Number, default: 0 },          // 0 = main thumbnail
  },
  { timestamps: true }
);

export default mongoose.model("ProductImage", productImageSchema);
