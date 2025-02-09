"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-black py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-6">

                {/* Fiserv Logo */}
                <Link href="/">
                    <Image src="/fiserv.png" alt="Fiserv Logo" width={120} height={40} />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-white text-lg font-medium hover:text-orange-500 transition">Home</Link>
                    <Link href="/shop" className="text-white text-lg font-medium hover:text-orange-500 transition">Shop</Link>
                    <Link href="/about" className="text-white text-lg font-medium hover:text-orange-500 transition">About</Link>
                    <Link href="/cart" className="bg-orange-500 text-white px-5 py-2 rounded-md text-lg font-medium hover:bg-orange-600 transition">
                        Cart (0)
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-black py-4">
                    <div className="flex flex-col items-center space-y-4">
                        <Link href="/" className="text-white text-lg font-medium hover:text-orange-500 transition">Home</Link>
                        <Link href="/shop" className="text-white text-lg font-medium hover:text-orange-500 transition">Shop</Link>
                        <Link href="/about" className="text-white text-lg font-medium hover:text-orange-500 transition">About</Link>
                        <Link href="/cart" className="bg-orange-500 text-white px-5 py-2 rounded-md text-lg font-medium hover:bg-orange-600 transition">
                            Cart (0)
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
