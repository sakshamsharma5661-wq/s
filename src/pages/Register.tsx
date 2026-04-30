import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Mail, Lock, User, UserCheck, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

export default function Register() {
  const [role, setRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [license, setLicense] = useState('');
  const [insurance, setInsurance] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const path = `users`;
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Create profile in Firestore
      const docs = [];
      if (license) docs.push(license);
      if (insurance) docs.push(insurance);

      const userPath = `${path}/${user.uid}`;
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email,
          name,
          role,
          isVerified: false,
          documents: docs,
          createdAt: serverTimestamp()
        });
        navigate('/');
      } catch (err: any) {
        handleFirestoreError(err, OperationType.CREATE, userPath);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-black italic mb-2">Create an account</h1>
            <p className="text-gray-500 text-sm">Join the leading logistics network</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-8">
            {/* Role Selection */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center block mb-4">I want to join as a</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'customer', label: 'Customer', icon: <User /> },
                  { id: 'driver', label: 'Driver', icon: <UserCheck /> },
                  { id: 'vendor', label: 'Vendor', icon: <Building2 /> }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as UserRole)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                      role === r.id 
                      ? 'border-black bg-black text-white shadow-lg lg:scale-105' 
                      : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {r.icon}
                    <span className="font-bold text-sm tracking-tight">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mt-1 border border-transparent focus-within:border-black transition-all">
                  <User size={20} className="text-gray-400" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="bg-transparent border-none outline-none w-full text-sm font-medium"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mt-1 border border-transparent focus-within:border-black transition-all">
                  <Mail size={20} className="text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-transparent border-none outline-none w-full text-sm font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mt-1 border border-transparent focus-within:border-black transition-all">
                <Lock size={20} className="text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none w-full text-sm font-medium"
                  required
                />
              </div>
            </div>

            {role !== 'customer' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Required Documents</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">License Link (URL)</label>
                      <input 
                        type="text" 
                        value={license}
                        onChange={(e) => setLicense(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full p-4 bg-white rounded-xl border border-transparent focus:border-black outline-none text-sm mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Insurance Link (URL)</label>
                      <input 
                        type="text" 
                        value={insurance}
                        onChange={(e) => setInsurance(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full p-4 bg-white rounded-xl border border-transparent focus:border-black outline-none text-sm mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Creating account...' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account? {' '}
            <Link to="/login" className="text-black font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
