import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Truck, ShieldCheck } from "lucide-react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { PiShoppingBagLight } from "react-icons/pi";
import axios from "axios";
import { API } from "../constant.js";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";
import toast from "react-hot-toast";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { cart, addToCart } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    // const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [expandedSections, setExpandedSections] = useState({
        details: false,
        materialsAndCare: false,
        shippingAndReturns: false
    });

    // Scroll to top when component mounts or id changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API}/product/${id}`);
                setProduct(data);

                // FIXED: Fetch related products using categoryId instead of category name
                if (data.category?._id) {
                    const relatedRes = await axios.get(
                        `${API}/products/by-category?categoryId=${data.category._id}`
                    );


                    // Filter out current product and limit to 4 products
                    const filteredRelated = relatedRes.data
                        .filter((p) => p._id !== data._id)
                        .slice(0, 4);

                    setRelatedProducts(filteredRelated);
                }
            } catch (err) {
                console.error("Failed to fetch product", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // FIXED: Navigation function with scroll to top
    const handleRelatedProductClick = (prod) => {

        navigate(`/${prod?.slug}/${prod._id}`);

        // Scroll to top after navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (!product) return <p className="text-center py-10">Product not found</p>;

    // FIXED: Check if product is in cart with proper matching
    const isProductInCart = () => {
        return cart.some(item => {
            const itemProductId = item.product?._id || item.productId;
            // const sizeMatch = (item.size === selectedSize) || (!item.size && !selectedSize);
            const colorMatch = (item.color === selectedColor) || (!item.color && !selectedColor);

            return itemProductId === product._id  && colorMatch;
            // return itemProductId === product._id && sizeMatch && colorMatch;
        });
    };

    const handleAddToCart = () => {
        if ( !selectedColor) {
        // if (!selectedSize || !selectedColor) {
            toast.error("Please color before adding to cart");
            // toast.error("Please select size and color before adding to cart");
            return;
        }

        if (isProductInCart()) {
            navigate("/cart");
            return;
        }

        addToCart(product._id, quantity, selectedColor);
        // addToCart(product._id, quantity, selectedSize, selectedColor);
        // toast.success("Item added to cart!");
    };

    // Handle wishlist toggle
    const handleWishlistToggle = () => {
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product._id);
        }
    };

    const productInWishlist = isInWishlist(product._id);
    const productInCart = isProductInCart();

    return (
        <>
            {/* PRODUCT DETAILS SECTION */}
            <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 py-8">

                {/* LEFT: Scrollable Images */}
                <div className="w-full lg:h-[90vh] lg:overflow-y-auto">
                    {product.images?.map((img, idx) => (
                        <img
                            key={idx}
                            src={`${API}${img.url}`}
                            alt={product.name}
                            className="w-full mb-4 object-cover rounded-lg"
                        />
                    ))}
                </div>

                {/* RIGHT: Product Info */}
                <div className="w-full lg:sticky lg:top-4 self-start">
                    {/* Category Badge */}
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-gray-500 uppercase tracking-wide">
                            {product.category?.name}
                        </span>
                        <button
                            onClick={handleWishlistToggle}
                            className="flex items-center gap-1 text-gray-700 hover:text-red-500 transition-colors"
                        >
                            {productInWishlist ? (
                                <FaHeart size={16} className="text-red-500" />
                            ) : (
                                <FaRegHeart size={16} />
                            )}
                            <span className="text-xs">
                                {productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            </span>
                        </button>
                    </div>

                    {/* Name & Price */}
                    <h1 className="text-xl sm:text-2xl font-semibold">{product.name}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-lg sm:text-xl font-bold">₹{product.price}</span>
                        {product.priceBeforeDiscount && (
                            <span className="line-through text-gray-500">
                                ₹{product.priceBeforeDiscount}
                            </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        (M.R.P. incl. of all taxes)
                    </p>

                    {/* Stock Status */}
                    <div className="mt-2">
                        {product.totalStock > 0 ? (
                            <p className="text-green-600 font-semibold">
                                In Stock: {product.totalStock}
                            </p>
                        ) : (
                            <p className="text-red-600 font-semibold">OUT OF STOCK</p>
                        )}
                    </div>


                    {/* Size Selector */}
                    {/* {product.sizes?.length > 0 && (
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-medium">Select Your Size</p>
                                <button className="text-sm text-gray-600 underline">Size Guide</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-10 h-10 border rounded-full transition ${selectedSize === size
                                            ? "bg-black text-white border-black"
                                            : "hover:bg-black hover:text-white"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* Color Selector */}
                    {product.colors?.length > 0 && (
                        <div className="mt-6">
                            <p className="mb-2 font-medium">Select Color</p>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color, i) => (
                                    <span
                                        key={i}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-6 h-6 rounded-full border cursor-pointer transition ${selectedColor === color ? "ring-2 ring-blue-500" : ""
                                            }`}
                                        style={{ backgroundColor: color }}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Quantity Selector */}
                    <div className="mt-6">
                        <p className="mb-2 font-medium">Quantity</p>
                        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden w-fit">
                            <button
                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-semibold"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                className="w-12 text-center focus:outline-none border-x border-gray-300"
                            />
                            <button
                                onClick={() => setQuantity((prev) => prev + 1)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-semibold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.totalStock === 0}
                            className={`py-3 px-6 rounded-full w-full text-white transition ${product.totalStock === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : isProductInCart()
                                        ? "bg-gray-600 hover:bg-gray-700"
                                        : "bg-green-900 hover:bg-green-800"
                                }`}
                        >
                            {product.totalStock === 0
                                ? "OUT OF STOCK"
                                : isProductInCart()
                                    ? "Item is already in cart"
                                    : "Add to Cart"}
                        </button>



                        {/* Add to Wishlist */}
                        <button
                            onClick={handleWishlistToggle}
                            className={`mt-2 sm:mt-0 py-3 px-6 rounded-full w-full flex items-center justify-center gap-2 text-white transition ${productInWishlist
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-pink-500 hover:bg-pink-600"
                                }`}
                        >
                            {productInWishlist ? (
                                <FaHeart size={16} />
                            ) : (
                                <FaRegHeart size={16} />
                            )}
                            {productInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                        </button>
                    </div>

                    {/* Digital Concierge */}
                    <div className="mt-4 text-sm text-gray-600">
                        Our Digital Concierge is available if you have any question on this product.{" "}
                        <button className="text-black underline">Contact us</button>
                    </div>

                    {/* Expandable Sections */}
                    <div className="mt-6 space-y-4">
                        {/* Details */}
                        <div className="border-b border-gray-200 pb-4">
                            <button
                                onClick={() => toggleSection('details')}
                                className="flex justify-between items-center w-full text-left"
                            >
                                <span className="font-medium">Details</span>
                                {expandedSections.details ? (
                                    <ChevronUp size={20} />
                                ) : (
                                    <ChevronDown size={20} />
                                )}
                            </button>
                            {expandedSections.details && (
                                <div className="mt-3 text-sm text-gray-600 space-y-2">
                                    {product.details && <p>{product.details}</p>}
                                    {product.fabric && <p><strong>Fabric:</strong> {product.fabric}</p>}
                                    {product.workDetails && <p><strong>Work Details:</strong> {product.workDetails}</p>}
                                    {product.description && <p>{product.description}</p>}
                                </div>
                            )}
                        </div>

                        {/* Materials & Care */}
                        <div className="border-b border-gray-200 pb-4">
                            <button
                                onClick={() => toggleSection('materialsAndCare')}
                                className="flex justify-between items-center w-full text-left"
                            >
                                <span className="font-medium">Materials & Care</span>
                                {expandedSections.materialsAndCare ? (
                                    <ChevronUp size={20} />
                                ) : (
                                    <ChevronDown size={20} />
                                )}
                            </button>
                            {expandedSections.materialsAndCare && (
                                <div className="mt-3 text-sm text-gray-600">
                                    {product.materialAndCare ? (
                                        <p>{product.materialAndCare}</p>
                                    ) : (
                                        <div className="space-y-1">
                                            <p>• Dry clean only</p>
                                            <p>• Store in a cool, dry place</p>
                                            <p>• Avoid direct sunlight</p>
                                            <p>• Handle with care</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Shipping & Returns */}
                        <div className="border-b border-gray-200 pb-4">
                            <button
                                onClick={() => toggleSection('shippingAndReturns')}
                                className="flex justify-between items-center w-full text-left"
                            >
                                <span className="font-medium">Shipping & Returns</span>
                                {expandedSections.shippingAndReturns ? (
                                    <ChevronUp size={20} />
                                ) : (
                                    <ChevronDown size={20} />
                                )}
                            </button>
                            {expandedSections.shippingAndReturns && (
                                <div className="mt-3 text-sm text-gray-600">
                                    {product.shippingAndReturn ? (
                                        <p>{product.shippingAndReturn}</p>
                                    ) : (
                                        <div className="space-y-2">
                                            <p><strong>Free Shipping:</strong> On all orders over ₹499</p>
                                            <p><strong>Delivery Time:</strong> 3-7 business days</p>
                                            <p><strong>Returns:</strong> 30 days return policy</p>
                                            <p><strong>Exchange:</strong> Size exchange available within 7 days</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Info Icons */}
                    {/* Bottom Info Icons */}
                    <div className="mt-8 flex justify-center gap-16 py-6">
                        <div className="flex items-center gap-4 text-lg">
                            <Truck size={32} className="text-green-700" />
                            <div>
                                <p className="font-semibold text-xl">Free Shipping</p>
                                <p className="text-gray-600 text-base">On all orders over ₹499</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-lg">
                            <ShieldCheck size={32} className="text-green-700" />
                            <div>
                                <p className="font-semibold text-xl">Secure Checkout</p>
                                <p className="text-gray-600 text-base">with credit and debit card</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* RELATED PRODUCTS SECTION */}
            {relatedProducts.length > 0 && (
                <div className="max-w-[1450px] mx-auto px-4 my-10">
                    <h2
                        className="text-center text-xl font-semibold mb-8"
                        style={{ fontFamily: "'Trirong', serif" }}
                    >
                        You May Also Like
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map((prod) => (
                            <div
                                key={prod._id}
                                className="relative group cursor-pointer"
                                onClick={() => handleRelatedProductClick(prod)}
                            >
                                <div className="relative">
                                    <img
                                        src={`${API}${prod.images?.[0]?.url}`}
                                        alt={prod.name}
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="bg-white p-2 rounded-full shadow"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <PiShoppingBagLight size={18} />
                                        </button>
                                        <button
                                            className={`p-2 rounded-full shadow ${isInWishlist(prod._id) ? "bg-red-100" : "bg-white"
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isInWishlist(prod._id)) {
                                                    removeFromWishlist(prod._id);
                                                } else {
                                                    addToWishlist(prod._id);
                                                }
                                            }}
                                        >
                                            {isInWishlist(prod._id) ? (
                                                <FaHeart size={18} className="text-red-500" />
                                            ) : (
                                                <FaRegHeart size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm mt-2">{prod.name}</p>
                                <p className="font-medium">₹{prod.price}</p>
                                {prod.colors?.length > 0 && (
                                    <div className="flex gap-2 mt-1">
                                        {prod.colors.map((color, index) => (
                                            <span
                                                key={index}
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: color }}
                                            ></span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetails;