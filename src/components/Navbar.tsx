import { Link, useNavigate } from 'react-router-dom';
import { Truck, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  if (user && profile) {
    if (profile.role === 'customer') navLinks.push({ name: 'My Bookings', path: '/customer' });
    if (profile.role === 'driver') navLinks.push({ name: 'Job Board', path: '/driver' });
    if (profile.role === 'vendor') navLinks.push({ name: 'Fleet', path: '/vendor' });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-brand-600 text-white rounded-lg group-hover:scale-110 transition-transform">
              <Truck size={24} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-brand-950">ShipSent</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-brand-950">
                   <User size={18} />
                   <span>{profile?.name || user.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-950">Log in</Link>
                <Link to="/register" className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-full hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/20">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-gray-800"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-100" />
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-gray-800">
                    <User size={18} />
                    <span>{profile?.name || user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 font-medium"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800">Log in</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="px-6 py-3 bg-black text-white text-center font-medium rounded-xl">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
