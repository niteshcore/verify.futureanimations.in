const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Privacy Policy</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose max-w-none">
        <p className="text-gray-600 text-lg mb-4">
          We respect your privacy. This policy outlines how we handle data collected during the certificate verification process.
        </p>
        <h2 className="text-xl font-bold mt-8 mb-4">Data Collection</h2>
        <p className="text-gray-600 mb-4">
          When you verify a certificate, we log the timestamp, IP address, and browser agent. This is strictly used for security auditing and to prevent abuse.
        </p>
        <h2 className="text-xl font-bold mt-8 mb-4">Data Security</h2>
        <p className="text-gray-600">
          All records are stored in a secure database. We do not sell or share verification logs with any third parties.
        </p>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
