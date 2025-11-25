// src/components/CameraUploadUI.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CameraUpload() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const flashRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false); // loader state
  const userEmail = localStorage.getItem('userEmail');

  // const sessionId = localStorage.getItem("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStreaming(true);
      setCapturedPhoto(null);
    } catch (err) {
      console.error("Camera error:", err);
      showToast("❌ Camera not accessible", "error");
    }
  };

  const stopCamera = () => {
    const tracks = videoRef.current?.srcObject?.getTracks() ?? [];
    tracks.forEach((t) => t.stop());
    setStreaming(false);
  };

  const capturePhoto = () => {
    if (flashRef.current) {
      flashRef.current.classList.remove("opacity-0");
      flashRef.current.classList.add("opacity-100");
      setTimeout(() => {
        flashRef.current.classList.remove("opacity-100");
        flashRef.current.classList.add("opacity-0");
      }, 200);
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedPhoto(canvas.toDataURL("image/png"));
    // 🚀 Keep camera running
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const uploadPhoto = async () => {
    if (!capturedPhoto) return;
    setLoading(true); // start loader
    try {
      const blob = await (await fetch(capturedPhoto)).blob();
      const formData = new FormData();
      formData.append("file", blob, "id-proof.png");

      const response = await fetch(
        `http://13.203.246.229:8013/upload-id-proof?email=${userEmail}`,
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.status === "VERIFIED") {
          showToast("✅ Document verified successfully!", "success");
          stopCamera();
          setTimeout(() => navigate("/photoupload"), 1500);
        } else {
          showToast(`❌ Verification failed: ${data.message}`, "error");
        }
      } else {
        showToast(
          "❌ Upload failed: " + (data.message || "Unknown error"),
          "error"
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("❌ Upload error: " + error.message, "error");
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-500 via-indigo-600 to-[#4F46E5] p-4 relative">
      <h2 className="text-2xl font-bold mb-2 text-[#ffd700]">
        ID Proof Verification
      </h2>
      <p className="text-center text-white mb-6 max-w-md">
        Place your ID card inside the frame and ensure details are clear before
        capturing.
      </p>

      {/* Video / Captured Image */}
      <div className="relative w-[90vw] max-w-3xl h-[60vh] rounded-xl overflow-hidden border border-white shadow-2xl bg-black">
        {!capturedPhoto ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-40 border-4 border-[#ffd700] rounded-md animate-pulse flex items-center justify-center text-yellow-200 font-semibold">
                Place ID here
              </div>
            </div>
          </>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover absolute inset-0 opacity-40"
              playsInline
              muted
            />
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full h-full object-contain relative z-10 transition-transform duration-300 transform scale-100"
            />
          </>
        )}
        {/* Camera Flash */}
        <div
          ref={flashRef}
          className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-200"
        />
      </div>

      {/* Buttons - Vertical Column */}
      <div className="flex flex-col gap-4 mt-6 items-center">
        {!capturedPhoto ? (
          <button
            onClick={capturePhoto}
            disabled={!streaming}
            className="w-16 h-16 pb-3 flex items-center justify-center rounded-full bg-[#ffd700] text-3xl hover:bg-yellow-600 active:scale-90 transition-transform disabled:opacity-50 shadow-lg"
          >
            📸
          </button>
        ) : (
          <>
            <button
              onClick={retakePhoto}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-600 text-2xl hover:bg-gray-700 active:scale-90 transition-transform shadow-lg"
            >
              🔄
            </button>
            <button
              onClick={uploadPhoto}
              className="w-32 py-2 bg-[#ffd700] text-white rounded-lg hover:bg-[#fef900] active:scale-95 transition-transform shadow-md"
            >
              Upload
            </button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-indigo-500 border-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-xl text-sm font-medium backdrop-blur-sm transition-all duration-500 ${toast.type === "success"
            ? "bg-green-600 text-white animate-slideInRight"
            : "bg-red-600 text-white animate-slideInRight"
            }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
