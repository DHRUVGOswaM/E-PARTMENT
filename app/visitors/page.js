export default function VisitorPage() {
  return (
    <div className="p-8 space-y-4 bg-white text-blue-900 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900">Visitor Management</h1>
      <p className="text-gray-700">
        Verify every visitor in real time and keep a secure digital log of
        entries, exits, and deliveries.
      </p>
      <a href="/dashboard" className="text-blue-600 underline hover:text-blue-800">
        ← Back to Dashboard
      </a>
    </div>
  );
}
