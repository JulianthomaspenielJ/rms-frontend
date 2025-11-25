import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Instruction = () => {
  const navigate = useNavigate();


  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleStartInterview = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        showToast("❌ No session found. Please login again.", "error");
        navigate("/");
        return;
      }

      const url = `http://13.203.246.229:8013/validate/network?email=${userEmail}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Network validation response:", data);

      // ✅ Dynamically store session_id if it exists
      if (data.session_id) {
        localStorage.setItem("sessionId", data.session_id);
        console.log("Session ID stored:", data.session_id);
      }

      // Validation logic
      if (
        data.status === "pass" ||
        data.status === "success" ||
        data.message === "Network is ready for interview" ||
        data.message.includes("already verified")
      ) {
        showToast("✅ Network validated! Redirecting...", "success");
        setTimeout(() => navigate("/cameraupload"), 1500);
      } else {
        showToast("⚠️ Network validation failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error validating network:", error);
      showToast("❌ Something went wrong. Please try again.", "error");
    }
  };



  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 via-indigo-500 to-[#4F46E5] p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg transform transition-transform duration-500 hover:scale-105">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
            Instructions
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
            <li>Carefully review each question before submitting your answer.</li>
            <li>Manage your time wisely — the interview has a set duration.</li>
            <li>Avoid refreshing or closing the page during the assessment.</li>
            <li>Ensure you have a stable internet connection throughout.</li>
            <li>When prepared, click <strong>"Start Interview"</strong> to begin.</li>

          </ul>
          <div className="flex justify-center mt-8">
            <button
              onClick={handleStartInterview}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105"
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>

      {/* Tailwind Toast */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

export default Instruction;
