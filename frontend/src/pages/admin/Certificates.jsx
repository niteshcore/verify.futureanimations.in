import { useState } from 'react';
import api from '../../services/api';
import { Download, X } from 'lucide-react';

const Certificates = () => {
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
      const res = await api.post('/certificates/', formData);
      setGenerated(res.data);
      setFormData({
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
    } catch (err) {
      setError(err.response?.data?.msg || 'Unable to generate verification QR.');
    } finally {
      setLoading(false);
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Generate Verification QR</h2>
        <p className="text-sm text-gray-600">Add the intern details below and generate a QR that links to the public verification page.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student Name</label>
              <input required className="w-full p-2 border rounded" value={formData.student_name} onChange={(e) => setFormData({ ...formData, student_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" required className="w-full p-2 border rounded" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Internship Role</label>
              <input required className="w-full p-2 border rounded" value={formData.internship_role} onChange={(e) => setFormData({ ...formData, internship_role: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input required className="w-full p-2 border rounded" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" required className="w-full p-2 border rounded" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" required className="w-full p-2 border rounded" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Issue Date</label>
              <input type="date" required className="w-full p-2 border rounded" value={formData.issue_date} onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Completion Status</label>
              <input required className="w-full p-2 border rounded" value={formData.completion_status} onChange={(e) => setFormData({ ...formData, completion_status: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Signatory Name</label>
              <input required className="w-full p-2 border rounded" value={formData.signatory_name} onChange={(e) => setFormData({ ...formData, signatory_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Signatory Designation</label>
              <input required className="w-full p-2 border rounded" value={formData.signatory_designation} onChange={(e) => setFormData({ ...formData, signatory_designation: e.target.value })} />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-gray-800 disabled:opacity-50">
              {loading ? 'Generating...' : 'Generate QR'}
            </button>
          </div>
        </form>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        {generated && (
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Verification QR Ready</h3>
                <p className="text-sm text-gray-600">Verification ID: <span className="font-mono">{generated.certificate_id}</span></p>
              </div>
              <button onClick={() => downloadQr(generated.qr_code_path)} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-gray-800">
                <Download className="w-4 h-4" />
                Download QR
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 inline-block bg-white">
              <img src={getQrUrl(generated.qr_code_path)} alt="Verification QR" className="w-48 h-48" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
