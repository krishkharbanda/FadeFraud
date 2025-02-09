"use client"

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
    { id: 1, name: "Fiserv T-Shirt", price: "24.99", image: "/tshirt.jpg" },
    { id: 2, name: "Fiserv Ladies T-Shirt", price: "$24.99", image: "/ladies-shirt.jpg" },
    { id: 3, name: "Fiserv Hat", price: "$26.99", image: "/hat.jpg" },
];

export default function Home() {
    const [showPopup, setShowPopup] = useState(false);
    const [buyingProduct, setBuyingProduct] = useState(null);
    const [bought, setBought] = useState(false);

    const handleBuyClick = (product) => {
        setBuyingProduct(product);
        setShowPopup(true);
    };

    const confirmPurchase = () => {
        setShowPopup(false);
        setBought(true);
        setTimeout(() => setBought(false), 2000); // Reset animation after 2 seconds
    };

    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white py-20 px-6 text-center">
                <h1 className="text-5xl font-bold">Official Fiserv Merch</h1>
                <p className="mt-4 text-lg text-gray-300">Exclusive hoodies, t-shirts, and more.</p>
                <button className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-md text-lg hover:bg-orange-600 transition">
                    Shop Now
                </button>
            </div>

            {/* Product Grid */}
            <div className="container mx-auto py-12 px-6">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Shop Our Collection</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="bg-black rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            {/* Product Image */}
                            <div className="relative w-full h-64">
                                <Image src={product.image} layout="fill" objectFit="cover" className="rounded-t-lg" alt={product.name} />
                            </div>

                            {/* Gray Section Below Image */}
                            <div className="bg-gray-200 p-6 text-center">
                                <h3 className="text-2xl font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-lg text-gray-700">{product.price}</p>
                                <button
                                    className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
                                    onClick={() => handleBuyClick(product)}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />

            {/* Confirmation Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center">
                        <h3 className="text-xl font-semibold">Are you sure you want to buy {buyingProduct?.name}?</h3>
                        <p className="text-gray-200 mt-2">Using credit card: <span className="font-bold">******1423</span></p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                                onClick={() => setShowPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                                onClick={confirmPurchase}
                            >
                                Yes, Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bought Animation */}
            {bought && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="text-white text-4xl font-bold animate-bounce">
                        Bought!
                    </div>
                </div>
            )}
        </div>
    );
}
