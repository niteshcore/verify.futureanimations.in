import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, ShieldAlert, Calendar, User, Briefcase, Building, ClipboardCheck, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyCertificate = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(!!id);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      verifyToken(id);
    }
  }, [id]);

  const verifyToken = async (token) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || '/api/v1'}/verification/${token}`);
      setResult(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Verification Record Not Found.');
      } else {
        setError('❌ Invalid Verification QR. Please try scanning again or contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium text-sm">Authenticating verification credentials...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl text-center space-y-6"
          >
            <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-500 shadow-sm">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Verification Failed</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                {error}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
              The Future Animations Certificate Verification Portal
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {!loading && result && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
          >
            {/* Verified Header Banner */}
            <div className="bg-emerald-50 border-b border-emerald-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm animate-pulse">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Verified Genuine
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">Internship Authenticated</h2>
                <p className="text-xs text-emerald-700">This certificate record has been verified as authentic.</p>
              </div>
            </div>

            {/* Verification Content */}
            <div className="p-8 sm:p-10 space-y-8">
              
              {/* branding header */}
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base leading-tight">The Future Animations</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Official Internship Verification Portal</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">Intern Name</label>
                    <p className="font-bold text-slate-800 text-base">{result.student_name}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">Internship Role</label>
                    <p className="font-bold text-slate-800 text-base">{result.internship_role}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">Department</label>
                    <p className="font-bold text-slate-800 text-base">{result.department}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">Internship Duration</label>
                    <p className="font-bold text-slate-800 text-base">
                      {formatDate(result.start_date)} - {formatDate(result.end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">Certificate Issue Date</label>
                    <p className="font-bold text-slate-800 text-base">{formatDate(result.issue_date)}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">Completion Status</label>
                    <p className="font-bold text-slate-800 text-base">{result.completion_status}</p>
                  </div>
                </div>

                <div className="flex gap-3 sm:col-span-2 border-t border-slate-100 pt-6">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">Authorized Signatory</label>
                    <p className="font-bold text-slate-800 text-base">
                      {result.signatory_name} <span className="font-normal text-slate-500 text-sm">({result.signatory_designation})</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamp & Meta */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Scan Verified: {formatDate(result.verified_at)} {new Date(result.verified_at).toLocaleTimeString()}</span>
                </div>
                <div className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                  Certificate ID: <span className="font-mono text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">{result.certificate_id}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
