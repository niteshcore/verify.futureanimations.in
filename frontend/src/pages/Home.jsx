import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [certId, setCertId] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    if (certId.trim()) {
      navigate(`/verify/${certId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="bg-[var(--color-primary)] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Verify Internship Certificates Instantly
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
          >
            The Future Animations official portal for authenticating and verifying student credentials.
          </motion.p>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleVerify} 
            className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 rounded-lg text-gray-900 bg-white border-0 focus:ring-2 focus:ring-[var(--color-secondary)] outline-none text-lg shadow-lg"
                placeholder="Enter Certificate ID (e.g. TFA-INT-2026-001)"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[var(--color-secondary)] hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg text-lg flex items-center justify-center gap-2"
            >
              Verify Now
            </button>
          </motion.form>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--color-primary)]">Why Verify With Us?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-[var(--color-background)] p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 text-[var(--color-secondary)] rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure & Tamper-Proof</h3>
              <p className="text-gray-600">Our certificates are digitally issued and securely stored, ensuring complete authenticity.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="bg-[var(--color-background)] p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 text-[var(--color-accent)] rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Instant Verification</h3>
              <p className="text-gray-600">Scan the QR code or enter the Certificate ID to verify credentials instantly, 24/7.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="bg-[var(--color-background)] p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Official Recognition</h3>
              <p className="text-gray-600">Certificates issued directly by The Future Animations management and verifiable globally.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
