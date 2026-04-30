import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-bold tracking-tight text-brand-950 italic font-serif mb-8 max-w-sm">Get in touch with our <span className="text-brand-500">team.</span></h1>
            <p className="text-gray-500 text-lg mb-12 leading-relaxed">
              We're here to help with your logistics questions, fleet management, or any technical support you need.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gray-50 text-black rounded-2xl flex items-center justify-center shrink-0">
                  <Mail />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-gray-500 text-sm">support@shipsent.com</p>
                  <p className="text-gray-500 text-sm">sales@shipsent.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gray-50 text-black rounded-2xl flex items-center justify-center shrink-0">
                  <Phone />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Phone</h4>
                  <p className="text-gray-500 text-sm">+1 (555) 000-LOGI</p>
                  <p className="text-gray-500 text-sm">Mon-Fri 9am to 6pm</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                  <MessageSquare />
                </div>
                <div>
                  <h4 className="font-bold mb-1">WhatsApp Support</h4>
                  <p className="text-gray-500 text-sm">Instant response for active shipments.</p>
                  <a href="#" className="text-green-600 text-xs font-bold uppercase tracking-widest mt-2 block">Chat now</a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                  <input type="text" className="w-full p-4 bg-white rounded-xl border border-transparent focus:border-black outline-none text-sm transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input type="text" className="w-full p-4 bg-white rounded-xl border border-transparent focus:border-black outline-none text-sm transition-all shadow-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" className="w-full p-4 bg-white rounded-xl border border-transparent focus:border-black outline-none text-sm transition-all shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                <textarea rows={4} className="w-full p-4 bg-white rounded-xl border border-transparent focus:border-black outline-none text-sm transition-all shadow-sm resize-none"></textarea>
              </div>
              <button className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-brand-500 transition-colors shadow-lg shadow-brand-600/20">
                Send Message <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
