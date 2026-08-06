import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Download, Search, Link as CopyIcon, ExternalLink, QrCode, ClipboardCheck, ArrowUpDown, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Certificates = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/verification/');
      setRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch verification registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const sortedRecords = [...records].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (sortField === 'start_date' || sortField === 'end_date' || sortField === 'created_at') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredRecords = sortedRecords.filter(r => 
    r.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.internship_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVerificationUrl = (token) => {
    const customBase = import.meta.env.VITE_VERIFICATION_URL_BASE || 'https://futureanimations-verify.vercel.app';
    return `${customBase}/verify/${token}`;
  };

  const copyToClipboard = (token) => {
    const url = getVerificationUrl(token);
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(''), 2000);
  };

  const fetchAndDownloadQr = async (token, studentName) => {
    setQrLoading(true);
    try {
      const res = await api.get(`/verification/qr/${token}`);
      const qrDataUri = res.data.qr_image_data;
      
      const link = document.createElement('a');
      link.href = qrDataUri;
      link.download = `verification-qr-${studentName.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Failed to generate and download QR code. Please try again.');
    } finally {
      setQrLoading(false);
    }
  };

  const openQrModal = async (record) => {
    setSelectedRecord(record);
    setQrLoading(true);
    try {
      const res = await api.get(`/verification/qr/${record.verification_token}`);
      setSelectedRecord(prev => prev ? { ...prev, qr_image_data: res.data.qr_image_data } : null);
    } catch (err) {
      alert('Failed to load QR code.');
    } finally {
      setQrLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Registry & Verification Logs</h2>
          <p className="text-slate-500 text-sm">
            View all verified intern records, retrieve official links, and download QR codes for certificates.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex items-center gap-4">
          <div className="text-center border-r border-slate-200 pr-4">
            <span className="block text-2xl font-extrabold text-blue-600">{records.length}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Interns</span>
          </div>
          <div className="text-center">
            <span className="block text-2.5xl font-extrabold text-emerald-600">
              {records.filter(r => r.completion_status === 'Completed').length}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Completed</span>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium placeholder-slate-400"
            placeholder="Search by student name, email, role or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium text-sm">Loading registry records...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-rose-500 font-medium">{error}</div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium">
            {searchTerm ? 'No matching records found.' : 'No verification records in registry yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th onClick={() => handleSort('student_name')} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 select-none">
                    <div className="flex items-center gap-1.5">
                      <span>Intern</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('internship_role')} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 select-none">
                    <div className="flex items-center gap-1.5">
                      <span>Role & Department</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('start_date')} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 select-none">
                    <div className="flex items-center gap-1.5">
                      <span>Duration</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 select-none">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right select-none">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => (
                  <tr key={record.verification_token} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-sm">{record.student_name}</div>
                      <div className="text-xs text-blue-600 font-mono font-bold mt-0.5">{record.certificate_id}</div>
                      <div className="text-xs text-slate-400">{record.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700 text-sm">{record.internship_role}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">{record.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <Calendar className="w-4 h-4 text-slate-300" />
                        <span>{formatDate(record.start_date)} - {formatDate(record.end_date)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Issued: {formatDate(record.issue_date)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        record.completion_status.toLowerCase() === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        {record.completion_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openQrModal(record)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="View QR"
                        >
                          <QrCode className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => fetchAndDownloadQr(record.verification_token, record.student_name)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Download QR"
                          disabled={qrLoading}
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => copyToClipboard(record.verification_token)}
                          className={`p-2 rounded-xl transition-all ${
                            copiedToken === record.verification_token
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}
                          title="Copy Verification Link"
                        >
                          <CopyIcon className="w-5 h-5" />
                        </button>
                        <a 
                          href={getVerificationUrl(record.verification_token)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                          title="Open Public Link"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Viewer Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 border border-slate-100 shadow-2xl flex flex-col items-center text-center space-y-6"
            >
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-800 text-lg">{selectedRecord.student_name}</h4>
                <div className="text-[10px] text-blue-600 font-mono font-bold uppercase tracking-wider bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full inline-block">{selectedRecord.certificate_id}</div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">{selectedRecord.internship_role}</p>
              </div>

              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 relative flex items-center justify-center w-52 h-52 shadow-inner">
                {qrLoading ? (
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : selectedRecord.qr_image_data ? (
                  <img 
                    src={selectedRecord.qr_image_data} 
                    alt="Verification QR" 
                    className="w-48 h-48 rounded-lg bg-white" 
                  />
                ) : (
                  <div className="text-xs text-slate-400">Loading QR...</div>
                )}
              </div>

              <div className="w-full space-y-3">
                <button 
                  onClick={() => fetchAndDownloadQr(selectedRecord.verification_token, selectedRecord.student_name)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code
                </button>
                
                <button 
                  onClick={() => copyToClipboard(selectedRecord.verification_token)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl transition-all"
                >
                  <CopyIcon className="w-4 h-4" />
                  {copiedToken === selectedRecord.verification_token ? 'Copied URL!' : 'Copy Verification URL'}
                </button>
              </div>

              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
              >
                Close Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Certificates;
