import { motion } from 'motion/react';
import { Truck, Users, Map, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-brand-950 italic font-serif mb-8">Moving the world, <br /> <span className="text-brand-500 underline decoration-brand-600/10 decoration-4 underline-offset-8">one trip at a time.</span></h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Founded in 2024, ShipSent is building the infrastructure for the next generation of logistics. We believe moving cargo should be as easy as sending a message.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <div className="aspect-video bg-gray-100 rounded-[3rem] overflow-hidden relative group">
             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Truck size={80} className="text-white opacity-20" />
             </div>
          </div>
          <div className="flex flex-col justify-center space-y-8">
            <h2 className="text-4xl font-bold italic tracking-tight">Our Mission.</h2>
            <p className="text-gray-500 leading-relaxed">
              We connect shippers with a vast network of professional, verified drivers. By digitizing the end-to-end logistics process, we reduce empty miles, lower costs, and ensure faster deliveries for businesses of all sizes.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-3xl font-bold font-mono">1.2M+</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Miles Tracked</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold font-mono">500+</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Partners</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Shield />, title: 'Transparency', desc: 'Real-time updates and clear pricing mean no surprises for anyone.' },
            { icon: <Users />, title: 'Community', desc: 'We empower drivers and small fleet owners with tools to grow.' },
            { icon: <Map />, title: 'Efficiency', desc: 'Optimized routing reduces environmental impact and delivery times.' }
          ].map((v, i) => (
            <div key={i} className="text-center space-y-6">
              <div className="w-16 h-16 bg-brand-950 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-brand-950/20">
                {v.icon}
              </div>
              <h3 className="text-2xl font-bold italic">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
