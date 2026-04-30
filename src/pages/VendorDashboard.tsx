import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TruckService } from '../services/truckService';
import { Truck as TruckType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Plus, XCircle, MoreVertical, ShieldCheck, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function VendorDashboard() {
  const { user, profile } = useAuth();
  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [showAddTruck, setShowAddTruck] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [type, setType] = useState('Mini Truck');
  const [regNumber, setRegNumber] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    if (user) {
      return TruckService.subscribeToOwnerTrucks(user.uid, setTrucks);
    }
  }, [user]);

  const handleAddTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await TruckService.createTruck({
        ownerId: user.uid,
        type,
        regNumber,
        capacity,
        status: 'active'
      });
      setShowAddTruck(false);
      setRegNumber('');
      setCapacity('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (truckId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'maintenance' : 'active';
    try {
      await TruckService.updateTruckStatus(truckId, nextStatus as any);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-brand-950 italic font-serif">Fleet <span className="text-brand-500">Manager.</span></h1>
            <p className="text-gray-500 mt-2">Vendor Panel • {trucks.length} Vehicles Managed</p>
          </div>
          <button 
            onClick={() => setShowAddTruck(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-brand-600/20 self-start"
          >
            <Plus size={20} /> Register Truck
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Fleet Health</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Active</span>
                  <span className="text-xl font-bold font-mono text-green-600">
                    {trucks.filter(t => t.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Maintenance</span>
                  <span className="text-xl font-bold font-mono text-yellow-600">
                    {trucks.filter(t => t.status === 'maintenance').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-black text-white rounded-3xl shadow-xl">
               <h3 className="text-xl font-bold mb-4 italic text-white">Compliance.</h3>
               <p className="text-gray-400 text-xs leading-relaxed mb-6">Ensure all vehicle documents are up to date to avoid fleet suspension.</p>
               <button className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/20 pb-1">Review Docs</button>
            </div>
          </div>

          {/* Truck List */}
          <div className="lg:col-span-3">
            {trucks.length === 0 ? (
              <div className="p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                <Truck size={64} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-xl font-bold text-gray-400 italic">No vehicles registered.</h3>
                <p className="text-gray-400 text-sm mt-2">Start building your fleet by registering your first truck.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {trucks.map((truck) => (
                    <motion.div 
                      key={truck.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-3 rounded-xl",
                            truck.status === 'active' ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                          )}>
                            <Truck size={24} />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-black">{truck.type}</p>
                            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{truck.regNumber}</p>
                          </div>
                        </div>
                        <div className="relative group/menu">
                          <button className="p-2 text-gray-300 hover:text-black transition-colors rounded-lg hover:bg-gray-50">
                            <MoreVertical size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-2xl">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Capacity</p>
                          <p className="text-sm font-bold text-black">{truck.capacity}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                          <p className={cn(
                            "text-sm font-bold capitalize",
                            truck.status === 'active' ? "text-green-600" : "text-yellow-600"
                          )}>{truck.status}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => toggleStatus(truck.id!, truck.status)}
                          className={cn(
                            "flex-1 py-3 text-xs font-bold rounded-xl transition-all border",
                            truck.status === 'active' 
                            ? "border-yellow-200 text-yellow-600 hover:bg-yellow-50" 
                            : "border-green-200 text-green-600 hover:bg-green-50"
                          )}
                        >
                          {truck.status === 'active' ? 'Set to Maintenance' : 'Set to Active'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Truck Modal */}
      <AnimatePresence>
        {showAddTruck && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddTruck(false)}
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
                  <h3 className="text-2xl font-bold tracking-tight italic font-serif text-brand-950">Add <span className="text-gray-400">Vehicle.</span></h3>
                  <button onClick={() => setShowAddTruck(false)} className="text-gray-400 hover:text-black">
                    <XCircle size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddTruck} className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Vehicle Type</label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {['Mini Truck', 'Pickup', 'Container', 'Tanker'].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={cn(
                              "p-4 rounded-2xl border-2 text-xs font-bold transition-all",
                              type === t 
                              ? "border-black bg-black text-white" 
                              : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Registration Number</label>
                      <input 
                        type="text" 
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                        placeholder="MH-12-AB-1234"
                        className="w-full p-4 bg-gray-50 rounded-2xl mt-2 border border-transparent focus:border-black outline-none text-sm font-medium uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Load Capacity</label>
                      <input 
                        type="text" 
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="e.g. 5 Tons"
                        className="w-full p-4 bg-gray-50 rounded-2xl mt-2 border border-transparent focus:border-black outline-none text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 shadow-xl"
                  >
                    {loading ? 'Registering...' : 'Register Vehicle'}
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
