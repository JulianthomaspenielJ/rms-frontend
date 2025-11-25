import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import id_photo from '../../assets/passwordsizeimg.png';

export default function App() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');



  // const sessionId = "5d5c5467-3af1-47d8-bc82-b244f77a6ca6";

  // const sessionId = localStorage.getItem("session_id");


  const API_URL = `http://13.203.246.229:8013/upload-passport-photo?email=${userEmail}`;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleUpload = async () => {
    if (!file) {
      showToast("⚠️ Please select a file first.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      showToast("⏳ Uploading...", "info");

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response:", data);

      showToast("✅ Upload successful!", "success");

      setTimeout(() => {
        navigate("/interview");
      }, 1000);
    } catch (err) {
      console.error("Upload error:", err);
      showToast("❌ Upload failed. Please try again.", "error");
    }
  };

  const toastColors = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-indigo-500 via-indigo-600 to-[#4F46E5] p-6">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-[#ffd700] flex items-center gap-3 justify-center">
          {/* <span className="text-blue-600">📘</span> */}
          Candidate Photo Upload
        </h1>
      </header>

      {/* Upload Container */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden">

        {/* Left Column */}
        <div className="flex-1 flex flex-col p-6 gap-4">

          {/* Upload Section */}
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-5 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center cursor-pointer text-gray-600"
            >
              <span className="text-4xl mb-2">📷</span>
              <p className="font-medium">Upload your photo</p>
              <p className="text-xs text-gray-400">JPG/PNG, max 2MB</p>
            </label>
          </div>

          {/* Preview Section */}
          <div className="flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50 h-[150px] p-2">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="object-contain max-h-[140px] rounded-md"
              />
            ) : (
              <span className="text-gray-400 text-sm">No photo uploaded</span>
            )}
          </div>

          {/* Instructions Section */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-md p-3">
            <h2 className="text-sm font-semibold text-indigo-700 mb-1">📌 Instructions:</h2>
            <ul className="text-gray-600 text-xs list-disc list-inside space-y-1">
              <li>Recent passport-size photo</li>
              <li>Plain white background</li>
              <li>Face clearly visible</li>
              <li>No filters or edits</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm transition"
          >
            Submit
          </button>
        </div>

        {/* Right Column (Illustration + Tips) */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-4">
          <img
            src={id_photo}
            alt="Upload Illustration"
            className="w-full max-w-sm"
          />
          <p className="text-gray-600 text-xs mt-2 text-center">
            Ensure good lighting. This photo will be used for ID verification.
          </p>
        </div>
      </div>




      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-6 py-3 text-white rounded-lg shadow-lg ${toastColors[toast.type]} transition-all duration-300`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
