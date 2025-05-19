import React, { useEffect, useState } from "react";

export default function AllFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:8000/files", {
          credentials: "include", // Send cookies for authentication
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
    setModalOpen(true);
    setModalLoading(true);
    setModalContent(null);
    try {
      const response = await fetch(`http://localhost:8000/file/${fileId}`, {
        credentials: "include",
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

      {/* Modal for Result */}
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
            {!modalLoading && modalContent && !modalContent.error && (() => {
              // Parse skills from stringified JSON if needed
              let techSkills = [];
              let softSkills = [];
              if (modalContent) {
                if (typeof modalContent.result === "string") {
                  try {
                    const parsed = JSON.parse(modalContent.result);
                    techSkills = parsed.technical_skills || [];
                    softSkills = parsed.soft_skills || [];
                  } catch (e) {
                    // parsing failed, leave arrays empty
                  }
                } else {
                  techSkills = modalContent.technical_skills || [];
                  softSkills = modalContent.soft_skills || [];
                }
              }
              return (
                <div>
                  <h3 className="text-lg font-bold mb-4 text-indigo-700">Skills Extracted</h3>
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Technical Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {techSkills.length > 0 ? (
                        techSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Soft Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {softSkills.length > 0 ? (
                        softSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

