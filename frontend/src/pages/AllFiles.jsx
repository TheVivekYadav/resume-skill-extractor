import React, { useEffect, useState } from "react";

const API_URL = "https://52.20.217.81:8000"

// Helper: Modal for interactive step-by-step skill review
function InteractiveSkillModal({ rawResult, onClose }) {
  // Parse stringified JSON if needed
  function parseSkillResult(result) {
    if (!result) return {};
    if (typeof result === "string") {
      try {
        return JSON.parse(result);
      } catch (e) {
        return {};
      }
    }
    return result;
  }

  const skillResult = parseSkillResult(rawResult.result ? rawResult.result : rawResult);
  const { feedback, ...categories } = skillResult;
  const categoryEntries = Object.entries(categories);
  const [step, setStep] = useState(0);

  if (categoryEntries.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-bold mb-4 text-indigo-700">Skills Extracted</h3>
        <div className="text-gray-500 mb-4">No skills found.</div>
        {feedback && <FeedbackBox feedback={feedback} />}
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded" onClick={onClose}>Close</button>
      </div>
    );
  }

  const [currentCategory, skills] = categoryEntries[step];

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-indigo-700">Skills Extracted</h3>
      <div className="mb-4">
        <div className="font-semibold mb-1 capitalize">
          {currentCategory.replace(/_/g, " ")}:
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(skills) && skills.length > 0 ? (
            skills.map((skill, idx) => (
              <span
                key={idx}
                className={
                  currentCategory.toLowerCase().includes("soft")
                    ? "bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                    : "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                }
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-500">None</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          Back
        </button>
        <button
          className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
          onClick={() => setStep((s) => s + 1)}
          disabled={step === categoryEntries.length - 1}
        >
          Next
        </button>
      </div>
      {/* Show feedback only at the end */}
      {step === categoryEntries.length - 1 && feedback && (
        <FeedbackBox feedback={feedback} />
      )}
      <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

function FeedbackBox({ feedback }) {
  return (
    <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
      <strong>Feedback:</strong>
      <div className="mt-2 whitespace-pre-line">{feedback}</div>
    </div>
  );
}

export default function AllFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("_id");
    const fetchFiles = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/files`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": userId,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleViewResult = async (fileId) => {
    const token = localStorage.getItem("access_token");
    setModalOpen(true);
    setModalLoading(true);
    setModalContent(null);
    try {
      const response = await fetch(`${API_URL}/file/${fileId}`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch file result");
      }
      const data = await response.json();
      setModalContent(data);
    } catch (err) {
      setModalContent({ error: err.message });
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">My Uploaded Files</h2>
      {loading && <div className="text-gray-600">Loading files...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!loading && files.length === 0 && (
        <div className="text-gray-500">No files found.</div>
      )}
      {!loading && files.length > 0 && (
        <table className="bg-white shadow rounded w-full max-w-3xl">
          <thead>
            <tr className="bg-indigo-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Path</th>
              <th className="p-3 text-left">View Result</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="border-b last:border-none">
                <td className="p-3">{file.name}</td>
                <td className="p-3">{file.status}</td>
                <td className="p-3 font-mono text-xs break-all">
                  {file.file_path}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleViewResult(file.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition"
                  >
                    View Result
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Interactive Result */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-2xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            {modalLoading && <div>Loading result...</div>}
            {!modalLoading && modalContent && modalContent.error && (
              <div className="text-red-600">{modalContent.error}</div>
            )}
            {!modalLoading && modalContent && !modalContent.error && (
              <InteractiveSkillModal rawResult={modalContent} onClose={closeModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

