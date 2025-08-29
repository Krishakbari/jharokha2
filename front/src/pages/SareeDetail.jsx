import { useParams } from "react-router-dom";
import p1 from "../assets/dd1.jpg";
import p2 from "../assets/dd2.jpg";
import p3 from "../assets/dd3.jpg";
import p4 from "../assets/dd4.jpg";

const products = [
  {
    id: 1,
    title: "Amazing Pink Blooming Fox Georgette Digital Print With Pearl Work Gown Set",
    price: "₹2,999.00",
    originalPrice: "₹3,499.00",
    images: [p1, p2, p3, p4],
    colors: ["#d6c0b3", "#f4b740"],
    sizes: ["S", "M", "L"],
    description: "Beautiful georgette saree with pearl work and digital print."

  },
  {
    id: 2,
    title: "Amazing Pink Blooming Fox Georgette Digital Print With Pearl Work Gown Set",
    price: "₹2,999.00",
    originalPrice: "₹3,499.00",
    images: [p1, p2, p3, p4],
    colors: ["#d6c0b3", "#f4b740"],
    sizes: ["S", "M", "L"],
    description: "Beautiful georgette saree with pearl work and digital print."
    
  },
  {
    id: 3,
    title: "Amazing Pink Blooming Fox Georgette Digital Print With Pearl Work Gown Set",
    price: "₹2,999.00",
    originalPrice: "₹3,499.00",
    images: [p1, p2, p3, p4],
    colors: ["#d6c0b3", "#f4b740"],
    sizes: ["S", "M", "L"],
    description: "Beautiful georgette saree with pearl work and digital print."

  },
  {
    id: 4,
    title: "Amazing Pink Blooming Fox Georgette Digital Print With Pearl Work Gown Set",
    price: "₹2,999.00",
    originalPrice: "₹3,499.00",
    images: [p1, p2, p3, p4],
    colors: ["#d6c0b3", "#f4b740"],
    sizes: ["S", "M", "L"],
    description: "Beautiful georgette saree with pearl work and digital print."

  },

];

const SareeDetails = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-[1450px] mx-auto flex gap-10 px-4 py-8">
      
      {/* LEFT: Scrollable Images */}
      <div className="w-[1450px] h-[90vh] overflow-y-auto">
        {product.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Saree ${idx}`}
            className="w-full mb-4 object-cover"
          />
        ))}
      </div>

      {/* RIGHT: Sticky Product Info */}
      <div className="w-full sticky top-4 self-start">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xl font-bold">{product.price}</span>
          <span className="line-through text-gray-500">{product.originalPrice}</span>
        </div>

        {/* Size Selector */}
        <div className="mt-6">
          <p className="mb-2 font-medium">Select Your Size</p>
          <div className="flex gap-2">
            {product.sizes.map(size => (
              <button key={size} className="w-10 h-10 border rounded-full hover:bg-black hover:text-white transition">
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div className="mt-6">
          <p className="mb-2 font-medium">Select Color</p>
          <div className="flex gap-2">
            {product.colors.map((color, i) => (
              <span
                key={i}
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color }}
              ></span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="bg-green-900 text-white py-3 px-6 rounded-full w-full">Add to Cart</button>
          <button className="bg-black text-white py-3 px-6 rounded-full w-full">Buy Now</button>
        </div>

        {/* Description */}
        <div className="mt-6">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default SareeDetails;
