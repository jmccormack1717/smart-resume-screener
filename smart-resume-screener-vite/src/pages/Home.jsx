import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function App() {
  const [jobFile, setJobFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("job_description", jobFile);
  resumes.forEach((resume) => {
    formData.append("resumes", resume);
  });

  const response = await fetch("https://smart-resume-screener-backend.onrender.com/upload", {
  method: "POST",
  body: formData,
});


  const data = await response.json();
  console.log("Backend response:", data);
  alert("Upload successful! Check console for response.")
  navigate("/results", { state: { results: data } });
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
<div className="flex flex-col items-start">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Upload Resumes
  </label>

  {/* Upload button */}
  <input
    type="file"
    accept=".pdf,.doc,.docx,.txt"
    multiple
    onChange={(e) => {
      const newFiles = Array.from(e.target.files);
      // Keep only most recent 5
      setResumes((prev) => [...newFiles, ...prev].slice(0, 5));
    }}
    className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
               file:rounded-full file:border-0 file:text-sm file:font-semibold 
               file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
  />

  {/* Display uploaded resumes */}
  {resumes.length > 0 && (
    <div className="mt-3 w-full flex flex-col gap-2">
      {resumes.map((file, idx) => (
        <div
          key={idx}
          className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm shadow-sm"
        >
          {file.name}
        </div>
      ))}
    </div>
  )}
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

