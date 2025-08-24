// src/pages/Results.jsx
import { useLocation, Link } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const results = location.state?.results || { message: "No results yet!" };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Screening Results
        </h1>

        <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800">
          {JSON.stringify(results, null, 2)}
        </pre>

        <Link
          to="/"
          className="mt-6 block text-center py-2 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Upload Again
        </Link>
      </div>
    </div>
  );
}
