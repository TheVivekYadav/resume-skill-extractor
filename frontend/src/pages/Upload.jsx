import React, { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setProgress(0);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setMessage("");
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8000/upload", true);
      xhr.withCredentials = true; // send cookies if needed

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded * 100) / event.total));
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          setMessage("File uploaded successfully!");
          setFile(null);
        } else {
          setMessage("Upload failed.");
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setMessage("Upload failed. Please try again.");
      };

      xhr.send(formData);
    } catch (error) {
      setUploading(false);
      setMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleUpload}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-indigo-700">Upload a File</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 block w-full"
        />
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 px-4 rounded text-white font-semibold transition ${
            uploading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {message && (
          <div
            className={`mt-4 text-center ${
              message.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
