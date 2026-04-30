import { Link } from 'react-router-dom';
import { Truck, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-black text-white rounded-lg">
                <Truck size={20} />
              </div>
              <span className="text-xl font-bold tracking-tighter">ShipSent</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Fast, reliable truck booking for all your logistics needs. We connect you with verified drivers and vendors across the country.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-black mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-black">How it works</Link></li>
              <li><Link to="/" className="hover:text-black">Truck Types</Link></li>
              <li><Link to="/" className="hover:text-black">Pricing</Link></li>
              <li><Link to="/" className="hover:text-black">Safety</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-black">About Us</Link></li>
              <li><Link to="/" className="hover:text-black">Newsroom</Link></li>
              <li><Link to="/" className="hover:text-black">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-black">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-black">Help Center</Link></li>
              <li><Link to="/" className="hover:text-black">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-black">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-black">Cookie Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} ShipSent Logistics. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-400">
            <Link to="#" className="hover:text-black transition-colors"><Twitter size={20} /></Link>
            <Link to="#" className="hover:text-black transition-colors"><Instagram size={20} /></Link>
            <Link to="#" className="hover:text-black transition-colors"><Facebook size={20} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
