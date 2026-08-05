import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, Plus, Trash2, Eye, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    student_name: '', email: '', phone: '', internship_role: '', department: '',
    start_date: '', end_date: '', issue_date: new Date().toISOString().split('T')[0],
    completion_status: 'Completed', signatory_name: '', signatory_designation: ''
  });

  useEffect(() => {
    fetchCertificates();
  }, [page, search]);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/certificates/?page=${page}&search=${search}`);
      setCertificates(res.data.certificates);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/certificates/', formData);
      setIsModalOpen(false);
      fetchCertificates();
      // Reset form
      setFormData({
        student_name: '', email: '', phone: '', internship_role: '', department: '',
        start_date: '', end_date: '', issue_date: new Date().toISOString().split('T')[0],
        completion_status: 'Completed', signatory_name: '', signatory_designation: ''
      });
    } catch (err) {
      alert(err.response?.data?.msg || 'Error creating certificate');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await api.delete(`/certificates/${id}`);
        fetchCertificates();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const viewQr = async (id) => {
    try {
      const res = await api.get(`/certificates/${id}`);
      setSelectedCert(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const getQrUrl = (qrCodePath) => {
    if (!qrCodePath) return '';
    const baseUrl = import.meta.env.VITE_API_URL || '/api/v1';
    const filename = qrCodePath.replace('qrcodes/', '');
    return `${baseUrl.replace('/api/v1', '')}/public/qrcodes/${filename}`;
  };

  const downloadQr = (qrCodePath) => {
    const url = getQrUrl(qrCodePath);
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = qrCodePath.split('/').pop() || 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--color-primary)] hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Issue Certificate
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
              ) : certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-secondary)]">{cert.certificate_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cert.student_name}</div>
                    <div className="text-sm text-gray-500">{cert.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cert.internship_role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(cert.issue_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button onClick={() => viewQr(cert.id)} className="text-blue-600 hover:text-blue-900" title="View Details & QR"><Eye className="w-5 h-5 inline" /></button>
                    <button onClick={() => handleDelete(cert.id)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2 className="w-5 h-5 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages || totalPages === 0} 
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >Next</button>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
              <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
                <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative"
              >
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h3 className="text-xl font-bold text-gray-900">Issue New Certificate</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500"><X className="w-6 h-6"/></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Student Name</label><input required className="w-full p-2 border rounded" value={formData.student_name} onChange={e=>setFormData({...formData, student_name: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" required className="w-full p-2 border rounded" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Phone (Optional)</label><input className="w-full p-2 border rounded" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Internship Role</label><input required className="w-full p-2 border rounded" value={formData.internship_role} onChange={e=>setFormData({...formData, internship_role: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Department</label><input required className="w-full p-2 border rounded" value={formData.department} onChange={e=>setFormData({...formData, department: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Start Date</label><input type="date" required className="w-full p-2 border rounded" value={formData.start_date} onChange={e=>setFormData({...formData, start_date: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">End Date</label><input type="date" required className="w-full p-2 border rounded" value={formData.end_date} onChange={e=>setFormData({...formData, end_date: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Issue Date</label><input type="date" required className="w-full p-2 border rounded" value={formData.issue_date} onChange={e=>setFormData({...formData, issue_date: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Signatory Name</label><input required className="w-full p-2 border rounded" value={formData.signatory_name} onChange={e=>setFormData({...formData, signatory_name: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Signatory Designation</label><input required className="w-full p-2 border rounded" value={formData.signatory_designation} onChange={e=>setFormData({...formData, signatory_designation: e.target.value})} /></div>
                  </div>
                  <div className="pt-4 border-t flex justify-end gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-gray-800">Issue Certificate</button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* View QR Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
              <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedCert(null)}>
                <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Certificate Details</h3>
                  <button onClick={() => setSelectedCert(null)} className="text-gray-400 hover:text-gray-500"><X className="w-6 h-6"/></button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Certificate ID</p>
                  <p className="font-mono font-bold text-lg text-[var(--color-primary)] mb-4">{selectedCert.certificate_id}</p>
                  
                  <div className="border border-gray-200 p-2 rounded-xl inline-block mb-6 bg-white">
                    <img src={getQrUrl(selectedCert.qr_code_path)} alt="QR Code" className="w-48 h-48 mx-auto" />
                  </div>

                  <div className="flex justify-center mb-6">
                    <button
                      type="button"
                      onClick={() => downloadQr(selectedCert.qr_code_path)}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-gray-800"
                    >
                      Download QR
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-2">
                    <p><strong>Name:</strong> {selectedCert.student_name}</p>
                    <p><strong>Role:</strong> {selectedCert.internship_role}</p>
                    <p><strong>Issue Date:</strong> {new Date(selectedCert.issue_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Certificates;
