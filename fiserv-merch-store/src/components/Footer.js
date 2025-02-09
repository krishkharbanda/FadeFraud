export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-10">
            <div className="container mx-auto text-center">
                <p className="text-lg">© {new Date().getFullYear()} Fiserv Merch. All rights reserved.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <a href="#" className="hover:text-orange-500">Privacy Policy</a>
                    <a href="#" className="hover:text-orange-500">Terms of Service</a>
                    <a href="#" className="hover:text-orange-500">Contact Us</a>
                </div>
            </div>
        </footer>
    );
}