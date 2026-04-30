import { motion } from 'motion/react';
import { Truck, ShieldCheck, Clock, BadgeCent, ArrowRight, MapPin, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/customer');
    }
  };

  const truckTypes = ['Mini Truck', 'Pickup', 'Container', 'Tanker', 'Trailer'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full text-xs font-bold text-brand-600 uppercase tracking-wider mb-6">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live Logistics Platform
              </div>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-brand-950 mb-8 leading-[0.9]">
                Fast & Reliable <br />
                <span className="text-brand-500">Truck Booking.</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-lg mb-10 leading-relaxed">
                Seamless logistics for businesses and individuals. Move anything, anywhere, anytime with verified professional drivers.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl flex items-center gap-3 shadow-xl shadow-brand-600/20 hover:scale-105 transition-transform"
                >
                  Join ShipSent <ArrowRight size={20} />
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                  </div>
                  <span className="ml-2">5,000+ happy customers</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border border-gray-100 shadow-2xl p-8 rounded-3xl"
            >
              <h3 className="text-xl font-bold mb-6 text-brand-950 flex items-center gap-2">
                <Truck className="text-brand-600" /> Instant Booking
              </h3>
              <form onSubmit={handleBookNow} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Pickup Point</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mt-1 border border-transparent focus-within:border-brand-600 transition-all">
                      <MapPin size={20} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Enter pickup address" 
                        className="bg-transparent border-none outline-none w-full text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Drop Point</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mt-1 border border-transparent focus-within:border-brand-600 transition-all">
                      <MapPin size={20} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Enter delivery address" 
                        className="bg-transparent border-none outline-none w-full text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Truck Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                      {truckTypes.slice(0, 3).map(type => (
                        <button 
                          key={type}
                          type="button"
                          className="p-3 text-xs font-bold border border-gray-100 rounded-xl hover:border-brand-600 hover:bg-brand-600 hover:text-white transition-all text-gray-600"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-brand-950 text-white font-bold rounded-xl hover:bg-brand-900 transition-colors"
                >
                  Check Fare & Book Now
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-black mb-4 italic font-serif">Why choose ShipSent?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We've reinvented logistics to be faster, safer, and more transparent for everyone involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Clock />, title: 'Real-time Tracking', desc: 'Monitor your delivery every step of the way with GPS precision.' },
              { icon: <BadgeCent />, title: 'Affordable Pricing', desc: 'No hidden costs. Get instant quotes based on distance and truck type.' },
              { icon: <ShieldCheck />, title: 'Verified Drivers', desc: 'Every driver undergoes strict background checks and document verification.' },
              { icon: <Star />, title: '24/7 Support', desc: 'Our dedicated team is ready to assist you any hour of the day.' }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow group"
              >
                <div className="w-12 h-12 bg-brand-950 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-600 transition-colors">
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{f.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote / Stats */}
      <section className="py-24 bg-white border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-6 italic leading-snug">"ShipSent has transformed how we manage our supply chain. It's the Uber for trucks we've been waiting for."</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div>
                  <p className="font-bold text-black">Sarah Jenkins</p>
                  <p className="text-sm text-gray-500">Logistics Manager, GlobalTrade Co.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-12 text-center md:text-left">
              <div>
                <p className="text-5xl font-bold font-mono tracking-tighter">10k+</p>
                <p className="text-gray-500 text-sm uppercase tracking-widest font-bold mt-2">Bookings</p>
              </div>
              <div>
                <p className="text-5xl font-bold font-mono tracking-tighter">4.9/5</p>
                <p className="text-gray-500 text-sm uppercase tracking-widest font-bold mt-2">Rating</p>
              </div>
            </div>
         </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-20 bg-green-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex p-4 bg-green-500 text-white rounded-full mb-8">
             <Truck size={32} />
          </div>
          <h2 className="text-4xl font-bold mb-6 italic">Need custom logistics?</h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">For long-term contracts or specific fleet requirements, chat with our experts on WhatsApp.</p>
          <a 
            href="https://wa.me/your-number" 
            target="_blank" 
            rel="noreferrer"
            className="px-8 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors inline-block"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
