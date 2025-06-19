export default function Section({ title, description }) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  }
  