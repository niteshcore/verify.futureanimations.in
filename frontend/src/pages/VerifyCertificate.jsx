import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Download, Calendar, User, Briefcase, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [certId, setCertId] = useState(id || '');
  const [loading, setLoading] = useState(!!id);
  const [result, setResult] = useState(null);
  const [qrDetails, setQrDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encodedDetails = params.get('details');

    if (encodedDetails) {
      try {
        const decodedDetails = JSON.parse(decodeURIComponent(encodedDetails));
        setQrDetails(decodedDetails);
        setCertId(decodedDetails.certificate_id || id || '');
      } catch {
        setQrDetails(null);
      }
    } else {
      setQrDetails(null);
    }
  }, [location.search, id]);

  useEffect(() => {
    if (id) {
      verifyId(id);
    }
  }, [id]);

  const verifyId = async (certificateId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || '/api/v1'}/certificates/verify/${certificateId}`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to verify certificate. It may not exist or has been revoked.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (certId.trim()) {
      navigate(`/verify/${certId.trim()}`);
      verifyId(certId.trim());
    }
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  const displayData = result || qrDetails;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">Certificate Verification</h1>
        <p className="text-gray-600">Enter a Certificate ID below to verify its authenticity.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-10">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-secondary)] outline-none"
            placeholder="e.g. TFA-INT-2026-001"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--color-primary)] hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-secondary)]"></div>
        </div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl flex flex-col items-center text-center shadow-sm">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
          <p>{error}</p>
        </motion.div>
      )}

      {displayData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-green-50 p-6 flex items-center gap-4 border-b border-green-100">
            <CheckCircle className="w-10 h-10 text-[var(--color-accent)]" />
            <div>
              <h2 className="text-2xl font-bold text-green-800">Certificate Verified</h2>
              <p className="text-green-600">{qrDetails?.message || 'This is a valid and authentic certificate.'}</p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Intern Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-lg text-[var(--color-primary)]">{displayData.student_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-semibold text-[var(--color-primary)]">{displayData.internship_role}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-semibold text-[var(--color-primary)]">{displayData.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Certificate Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Certificate ID</p>
                      <p className="font-mono font-semibold text-[var(--color-primary)]">{displayData.certificate_id}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-[var(--color-primary)]">
                        {formatDate(displayData.start_date)} - {formatDate(displayData.end_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Issue Date</p>
                      <p className="font-semibold text-[var(--color-primary)]">{formatDate(displayData.issue_date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Issued by <span className="font-semibold">{displayData.company_name || 'The Future Animations'}</span>
              </div>
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors cursor-not-allowed opacity-50" title="PDF generation coming soon">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VerifyCertificate;
