import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://13.203.205.115:8000/verify-login?username=${username}&password=${password}`,
        { method: "POST" }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        // save sessionId dynamically
        if (data.session_id) {
          localStorage.setItem("session_id", data.session_id);
        }

        showToast("Login successful!", "success");
        setTimeout(() => navigate("/instructions"), 1000);
      } else {
        showToast(data.message || "Invalid credentials!", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("Something went wrong!", "error");
    }
  };


  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 via-indigo-500 to-[#4F46E5]">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm transform transition-transform duration-500 hover:scale-105">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold">
              🌟
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Sign in to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-md hover:from-blue-500 hover:to-purple-500 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Tailwind CSS Toast */}
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

export default Login;
