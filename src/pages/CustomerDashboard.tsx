import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, MapPin, Clock, CheckCircle2, XCircle, Package, Plus, Send } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';

export default function CustomerDashboard() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [truckType, setTruckType] = useState('Mini Truck');

  useEffect(() => {
    if (user) {
      return BookingService.subscribeToCustomerBookings(user.uid, setBookings);
    }
  }, [user]);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await BookingService.createBooking({
        customerId: user.uid,
        pickup: { address: pickup },
        drop: { address: drop },
        truckType,
        status: 'pending',
        fare: Math.floor(Math.random() * 2000) + 500 // Mock fare calculation
      });
      setShowNewBooking(false);
      setPickup('');
      setDrop('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await BookingService.updateBookingStatus(bookingId, 'cancelled');
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'on-transit': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-brand-950 italic font-serif">Dash<span className="text-brand-500">board.</span></h1>
            <p className="text-gray-500 mt-2">Welcome back, {profile?.name}</p>
          </div>
          <button 
            onClick={() => setShowNewBooking(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-brand-600/20"
          >
            <Plus size={20} /> New Booking
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Summary</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Total Bookings</span>
                  <span className="text-xl font-bold font-mono">{bookings.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">In Transit</span>
                  <span className="text-xl font-bold font-mono text-purple-600">
                    {bookings.filter(b => b.status === 'on-transit').length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-brand-950 text-white rounded-3xl shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                 <Truck size={120} />
               </div>
               <h3 className="text-xl font-bold mb-2 relative z-10 text-white">Premium Plan</h3>
               <p className="text-gray-400 text-sm mb-6 relative z-10">Upgrade to unlock priority drivers and business credit.</p>
               <button className="px-6 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg relative z-10 hover:bg-brand-500 transition-colors">Upgrade Now</button>
            </div>
          </div>

          {/* Middle/Right Column: Bookings List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-black italic">Recent Bookings</h3>
            
            {bookings.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package size={24} />
                </div>
                <p className="text-gray-400 font-medium italic">No bookings yet. Start your first shipment!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <motion.div 
                    layout
                    key={booking.id}
                    className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gray-50 rounded-xl text-black">
                          <Truck size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black">{booking.truckType}</p>
                          <p className="text-xs text-gray-400 font-mono">#{booking.id?.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStatusColor(booking.status)
                      )}>
                        {booking.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-green-500 mt-1" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pickup</p>
                          <p className="text-sm font-medium">{booking.pickup.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-red-500 mt-1" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Drop</p>
                          <p className="text-sm font-medium">{booking.drop.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-gray-400">
                          {formatDate(booking.createdAt)}
                        </div>
                        {(booking.status === 'pending' || booking.status === 'accepted') && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id!)}
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                      <div className="text-xl font-bold font-mono">
                        ₹{booking.fare}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Booking Modal */}
      <AnimatePresence>
        {showNewBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewBooking(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold tracking-tight italic font-serif">Quick <span className="text-gray-400">Booking.</span></h3>
                  <button onClick={() => setShowNewBooking(false)} className="text-gray-400 hover:text-black">
                    <XCircle size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateBooking} className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Pickup Information</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mt-2 border border-transparent focus-within:border-black transition-all">
                        <MapPin size={20} className="text-green-500" />
                        <input 
                          type="text" 
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          placeholder="Current location or city"
                          className="bg-transparent border-none outline-none w-full text-sm font-medium"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Destination</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mt-2 border border-transparent focus-within:border-black transition-all">
                        <MapPin size={20} className="text-red-500" />
                        <input 
                          type="text" 
                          value={drop}
                          onChange={(e) => setDrop(e.target.value)}
                          placeholder="Where do we deliver?"
                          className="bg-transparent border-none outline-none w-full text-sm font-medium"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Vehicle Selection</label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {['Mini Truck', 'Pickup', 'Container', 'Tanker'].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setTruckType(type)}
                            className={cn(
                              "p-4 rounded-2xl border-2 text-xs font-bold transition-all",
                              truckType === type 
                              ? "border-black bg-black text-white" 
                              : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Send size={18} /> {loading ? 'Booking...' : 'Confirm Shipment'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
