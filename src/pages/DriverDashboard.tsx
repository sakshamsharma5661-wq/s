import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookingService } from '../services/bookingService';
import { Booking } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, MapPin, CheckCircle2, ChevronRight, Package, Briefcase, History } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DriverDashboard() {
  const { user, profile } = useAuth();
  const [availableJobs, setAvailableJobs] = useState<Booking[]>([]);
  const [myJobs, setMyJobs] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'mine'>('available');

  useEffect(() => {
    if (user) {
      const unsubAvailable = BookingService.subscribeToAvailableBookings(setAvailableJobs);
      const unsubMine = BookingService.subscribeToDriverBookings(user.uid, setMyJobs);
      return () => {
        unsubAvailable();
        unsubMine();
      };
    }
  }, [user]);

  const handleAcceptJob = async (jobId: string) => {
    if (!user) return;
    try {
      await BookingService.updateBookingStatus(jobId, 'accepted', user.uid);
      setActiveTab('mine');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (jobId: string, currentStatus: string) => {
    let nextStatus: any = 'completed';
    if (currentStatus === 'accepted') nextStatus = 'on-transit';
    else if (currentStatus === 'on-transit') nextStatus = 'completed';
    
    try {
      await BookingService.updateBookingStatus(jobId, nextStatus);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-brand-950 italic font-serif">Job <span className="text-brand-500">Board.</span></h1>
            <p className="text-gray-500 mt-2">Driver Panel • {profile?.isVerified ? 'Verified Partner' : 'Verification Pending'}</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm self-start">
            <button 
              onClick={() => setActiveTab('available')}
              className={cn(
                "px-6 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
                activeTab === 'available' ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "text-gray-400 hover:text-brand-950"
              )}
            >
              <Briefcase size={16} /> Available Jobs ({availableJobs.length})
            </button>
            <button 
              onClick={() => setActiveTab('mine')}
              className={cn(
                "px-6 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
                activeTab === 'mine' ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "text-gray-400 hover:text-brand-950"
              )}
            >
              <History size={16} /> My Jobs ({myJobs.filter(j => j.status !== 'completed').length})
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Verification Status</h4>
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "p-2 rounded-lg",
                  profile?.isVerified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                )}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">{profile?.isVerified ? 'Verified' : 'Pending Verification'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Partner Level</p>
                </div>
              </div>

              {profile?.documents && profile.documents.length > 0 && (
                <div className="pt-6 border-t border-gray-50">
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Submitted Documents</h5>
                  <div className="space-y-3">
                    {profile.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Package size={14} className="text-gray-400 shrink-0" />
                          <span className="text-xs font-medium truncate text-gray-600">Document {idx + 1}</span>
                        </div>
                        <a 
                          href={doc} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10px] font-bold text-black hover:underline shrink-0"
                        >
                          VIEW
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8 bg-black text-white rounded-3xl shadow-xl">
               <h3 className="text-xl font-bold mb-4 italic">Safety First.</h3>
               <p className="text-gray-400 text-xs leading-relaxed mb-6">Always verify the customer name and pickup location before starting a trip. ShipSent takes safety seriously.</p>
               <button className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/20 pb-1">Safety Guidelines</button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'available' ? (
              <motion.div 
                key="available"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {availableJobs.length === 0 ? (
                  <div className="p-16 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
                    <Truck size={48} className="mx-auto text-gray-200 mb-6" />
                    <p className="text-gray-400 font-medium italic">No available jobs in your area right now.</p>
                  </div>
                ) : (
                  availableJobs.map(job => (
                    <JobCard key={job.id} job={job} action={() => handleAcceptJob(job.id!)} actionLabel="Accept Job" />
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="mine"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {myJobs.length === 0 ? (
                  <div className="p-16 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
                    <History size={48} className="mx-auto text-gray-200 mb-6" />
                    <p className="text-gray-400 font-medium italic">You haven't accepted any jobs yet.</p>
                  </div>
                ) : (
                  myJobs.map(job => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      action={job.status !== 'completed' ? () => handleUpdateStatus(job.id!, job.status) : undefined}
                      actionLabel={job.status === 'accepted' ? 'Start Transit' : 'Mark Completed'}
                      isAccepted
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
  );
}

function JobCard({ job, action, actionLabel, isAccepted = false }: { job: Booking, action?: () => void, actionLabel: string, isAccepted?: boolean }) {
  return (
    <motion.div 
      layout
      className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-8"
    >
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-gray-50 rounded-2xl">
               <Package size={20} className="text-black" />
             </div>
             <div>
               <p className="text-sm font-bold text-black">{job.truckType}</p>
               <p className="text-[10px] text-gray-400 font-mono tracking-widest">ORDER #{job.id?.slice(-8).toUpperCase()}</p>
             </div>
          </div>
          {isAccepted && (
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
              job.status === 'completed' ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
            )}>
              {job.status}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
           {/* Connecting line */}
           <div className="hidden md:block absolute left-[15px] top-[26px] h-[calc(100%-52px)] w-px bg-dashed bg-gray-200" />
           
           <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Pickup</p>
                <p className="text-sm font-medium text-black leading-tight">{job.pickup.address}</p>
              </div>
           </div>
           
           <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Destination</p>
                <p className="text-sm font-medium text-black leading-tight">{job.drop.address}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-6 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-gray-50 md:pl-8">
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest text-right">Earning</p>
          <p className="text-3xl font-bold font-mono tracking-tighter text-brand-950">₹{job.fare}</p>
        </div>
        {action && (
          <button 
             onClick={action}
             className="px-8 py-3 bg-brand-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-brand-600/20"
          >
            {actionLabel} <ChevronRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
