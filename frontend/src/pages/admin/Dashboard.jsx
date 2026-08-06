import { useState } from 'react';
import api from '../../services/api';
import { Download, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    student_name: '',
    email: '',
    internship_role: '',
    department: '',
    start_date: '',
    end_date: '',
    issue_date: new Date().toISOString().split('T')[0],
    completion_status: 'Completed',
    signatory_name: '',
    signatory_designation: ''
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGenerated(null);

    try {
      const res = await api.post('/verification/generate', formData);
      setGenerated(res.data);
      // Reset form but preserve signatory details for convenience
      setFormData(prev => ({
        ...prev,
        student_name: '',
        email: '',
        internship_role: '',
        department: '',
        start_date: '',
        end_date: '',
        issue_date: new Date().toISOString().split('T')[0],
        completion_status: 'Completed'
      }));
    } catch (err) {
      setError(err.response?.data?.msg || 'Unable to generate verification QR.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQr = (dataUri, filename) => {
    if (!dataUri) return;
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = filename || 'verification-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Create Verification QR</h2>
        <p className="text-slate-500 text-sm">
          Submit the intern's details to generate an official QR code. This QR should be printed on their certificate and will redirect to the public verification portal when scanned.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Internship Details</h3>
          
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Student Name</label>
                <input 
                  type="text"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium"
                  placeholder="e.g. John Doe"
                  value={formData.student_name} 
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                <input 
                  type="email"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium"
                  placeholder="e.g. john@example.com"
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Internship Role</label>
                <input 
                  type="text"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium"
                  placeholder="e.g. Frontend Developer Intern"
                  value={formData.internship_role} 
                  onChange={(e) => setFormData({ ...formData, internship_role: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Department</label>
                <input 
                  type="text"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium"
                  placeholder="e.g. Engineering"
                  value={formData.department} 
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Start Date</label>
                <input 
                  type="date"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium"
                  value={formData.start_date} 
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">End Date</label>
                <input 
                  type="date"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium"
                  value={formData.end_date} 
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Issue Date</label>
                <input 
                  type="date"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium"
                  value={formData.issue_date} 
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Completion Status</label>
                <input 
                  type="text"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium"
                  value={formData.completion_status} 
                  onChange={(e) => setFormData({ ...formData, completion_status: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Signatory Name</label>
                <input 
                  type="text"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium"
                  placeholder="e.g. Jane Smith"
                  value={formData.signatory_name} 
                  onChange={(e) => setFormData({ ...formData, signatory_name: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Signatory Designation</label>
                <input 
                  type="text"
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium"
                  placeholder="e.g. Director"
                  value={formData.signatory_designation} 
                  onChange={(e) => setFormData({ ...formData, signatory_designation: e.target.value })} 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={loading} 
                className="px-6 py-3 bg-[var(--color-secondary)] hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center min-w-[150px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : 'Generate QR'}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* QR Preview Panel */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          {generated ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6 w-full"
            >
              <div className="flex flex-col items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-12 h-12" />
                <h4 className="font-bold text-lg text-slate-800">QR Code Ready</h4>
              </div>

              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 inline-block shadow-inner">
                <img 
                  src={generated.qr_image_data} 
                  alt="Verification QR" 
                  className="w-44 h-44 rounded-lg bg-white" 
                />
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => downloadQr(generated.qr_image_data, generated.qr_filename)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-secondary)] hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download QR
                </button>
                
                <div className="text-[10px] text-slate-400 font-mono break-all bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {generated.verification_token}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="py-12 space-y-3">
              <div className="w-20 h-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
                QR
              </div>
              <h4 className="font-semibold text-slate-400 text-sm">QR Code Preview</h4>
              <p className="text-xs text-slate-400 max-w-[200px]">Fill the form and click "Generate QR" to see preview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
