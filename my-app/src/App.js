// src/App.jsx
import { useState } from "react";

export default function App() {
  const [jobFile, setJobFile] = useState(null);
  const [resumes, setResumes] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job description file:", jobFile);
    console.log("Resumes:", resumes);
    alert("Files uploaded! (Backend connection coming soon)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome to Smart Resume Screener
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Description Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Job Description
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setJobFile(e.target.files[0])}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                         file:rounded-full file:border-0 file:text-sm file:font-semibold 
                         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resumes
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              onChange={(e) => setResumes(Array.from(e.target.files))}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                         file:rounded-full file:border-0 file:text-sm file:font-semibold 
                         file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

