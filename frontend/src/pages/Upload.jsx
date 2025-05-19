"use client"

import { useState, useRef } from "react"
import { FileIcon, UploadCloud, X, AlertCircle, CheckCircle } from "lucide-react"

export default function Upload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMessage("")
      setProgress(0)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setMessage("")
      setProgress(0)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setMessage("Please select a file to upload.")
      return
    }

    setUploading(true)
    setMessage("")
    setProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "http://localhost:8000/upload", true)
      xhr.withCredentials = true // send cookies if needed

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded * 100) / event.total))
        }
      }

      xhr.onload = () => {
        setUploading(false)
        if (xhr.status === 200) {
          setMessage("File uploaded successfully!")
          setFile(null)
        } else {
          setMessage("Upload failed.")
        }
      }

      xhr.onerror = () => {
        setUploading(false)
        setMessage("Upload failed. Please try again.")
      }

      xhr.send(formData)
    } catch (error) {
      setUploading(false)
      setMessage("Upload failed. Please try again.")
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  const removeFile = () => {
    setFile(null)
    setProgress(0)
    setMessage("")
  }

  return (
    <div className="w-full">
      <form onSubmit={handleUpload} className="w-full">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : file
                ? "border-gray-300 bg-gray-50"
                : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />

          {!file ? (
            <div className="flex flex-col items-center justify-center py-4">
              <UploadCloud className="h-12 w-12 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Any file type (MAX. 10MB)</p>
              <button
                type="button"
                onClick={handleButtonClick}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Select File
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-md mr-3">
                    <FileIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button type="button" onClick={removeFile} className="p-1 rounded-full hover:bg-gray-200">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {progress > 0 && (
                <div className="w-full mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={uploading || !file}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition ${
              uploading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md flex items-center ${
              message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {message.includes("success") ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span className="text-sm">{message}</span>
          </div>
        )}
      </form>
    </div>
  )
}
