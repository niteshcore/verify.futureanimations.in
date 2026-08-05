const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Contact Support</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
        <p className="text-gray-600 mb-6 text-lg">
          If you have any issues verifying a certificate or need administrative support, please reach out to us.
        </p>
        <div className="space-y-4">
          <div className="flex gap-4">
            <span className="font-semibold w-24">Email:</span>
            <a href="mailto:support@futureanimations.in" className="text-[var(--color-secondary)] hover:underline">support@futureanimations.in</a>
          </div>
          <div className="flex gap-4">
            <span className="font-semibold w-24">Phone:</span>
            <span className="text-gray-600">+91 (800) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
