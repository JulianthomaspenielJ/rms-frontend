// src/components/Interview.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import aiimg from "../assets/aiimg.jpg";
import rmslogo from "../assets/logo.png";

const TOTAL_QUESTIONS = 5;
const LEVEL_TO_COLOR = {
  warning: "bg-yellow-500 text-black",
  error: "bg-red-600 text-white",
  success: "bg-green-600 text-white",
  info: "bg-blue-600 text-white",
};

const WsUrl = "ws://15.206.190.73:8000/ws/interview";

const Interview = () => {
  const navigate = useNavigate();

  // Refs
  const candidateVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const blinkIntervalRef = useRef(null);

  // State
  const [chatHistory, setChatHistory] = useState([]);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Start Interview Fields
  const [studentId, setStudentId] = useState("");
  const [skill, setSkill] = useState("");
  const [interviewId, setInterviewId] = useState("");

  // Basic helper: show toast
  const showToast = (text, level = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text, level }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  /* ========================= CHAT HELPERS ========================= */
  const addOrUpdateCandidateMessage = (text) => {
    setChatHistory((prev) => {
      if (prev.length && prev[prev.length - 1].sender === "You" && !prev[prev.length - 1].final) {
        const updated = [...prev];
        updated[updated.length - 1].text = text;
        return updated;
      }
      return [...prev, { sender: "You", text, time: new Date().toLocaleTimeString(), final: false }];
    });
  };

  const finalizeCandidateMessage = (text) => {
    setChatHistory((prev) => {
      if (prev.length && prev[prev.length - 1].sender === "You") {
        const updated = [...prev];
        updated[updated.length - 1].text = text;
        updated[updated.length - 1].final = true;
        return updated;
      }
      return [...prev, { sender: "You", text, time: new Date().toLocaleTimeString(), final: true }];
    });
    setInterimTranscript("");
  };

  const addMessage = (sender, text) => {
    if (!text || !text.toString().trim()) return;
    setChatHistory((prev) => [...prev, { sender, text: text.toString(), time: new Date().toLocaleTimeString(), final: true }]);
  };

  /* ========================= AUDIO CONVERSION ========================= */
  const floatTo16BitPCM = (float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  };

  /* ========================= AGENT BLINK ========================= */
  const startBlinking = () => {
    if (blinkIntervalRef.current) return;
    blinkIntervalRef.current = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 400);
  };
  const stopBlinking = () => {
    clearInterval(blinkIntervalRef.current);
    blinkIntervalRef.current = null;
    setIsBlinking(false);
  };

  /* ========================= CAMERA ========================= */
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (candidateVideoRef.current) candidateVideoRef.current.srcObject = stream;
      setCameraError(null);
    } catch (err) {
      console.error("Camera error:", err?.name, err?.message);
      const messages = {
        NotAllowedError: "🚫 Camera access denied.",
        NotFoundError: "📷 No camera detected.",
        NotReadableError: "⚠️ Camera in use.",
        SecurityError: "🔒 HTTPS required.",
      };
      setCameraError(messages[err?.name] || `⚠️ Camera error: ${err?.message || "Unknown"}`);
    }
  };

  useEffect(() => {
    setupCamera();
    // cleanup on unmount: stop camera tracks
    return () => {
      try {
        const video = candidateVideoRef.current;
        const stream = video?.srcObject;
        stream?.getTracks?.().forEach((t) => t.stop());
      } catch (e) {
        /* ignore */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ========================= AUDIO RECORDING (Seamless) ========================= */
  const startRecording = async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);

      // ScriptProcessor is deprecated but widely supported; keeping for compatibility with original logic
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      processorRef.current.onaudioprocess = (e) => {
        const float32Data = e.inputBuffer.getChannelData(0);
        const pcm16Buffer = floatTo16BitPCM(float32Data);
        if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(pcm16Buffer);
      };

      setIsRecording(true);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "control", action: "start" }));
      }
    } catch (err) {
      console.error("Audio recording error:", err);
      showToast("Microphone access failed", "error");
    }
  };

  const stopRecording = () => {
    try {
      processorRef.current?.disconnect();
      mediaStreamRef.current?.getTracks?.forEach((t) => t.stop());
      audioContextRef.current?.close();
    } catch (e) {
      /* ignore cleanup errors */
    }
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: "control", action: "stop" }));
      } catch (e) {
        /* ignore */
      }
    }
    setIsRecording(false);
  };

  /* ========================= WEBSOCKET SETUP ========================= */
  useEffect(() => {
    const ws = new WebSocket(WsUrl);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      if (!cameraError) startRecording();
      startSendingFrames(); // start sending periodic frames
    };

    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        // ignore non-json messages
        return;
      }

      switch (data.type) {
        case "agent":
          addMessage("Agent", data.text);
          setCurrentQuestion((prev) => {
            const next = Math.min(prev + 1, TOTAL_QUESTIONS);
            if (next === TOTAL_QUESTIONS) setTimeout(() => setShowCompletionModal(true), 500);
            return next;
          });

          if (data.audio) {
            try {
              const audioBytes = Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0));
              const blob = new Blob([audioBytes], { type: "audio/mp3" });
              const url = URL.createObjectURL(blob);
              const audio = new Audio(url);
              audio.addEventListener("play", startBlinking);
              audio.addEventListener("ended", stopBlinking);
              audio.play().catch(() => console.warn("Audio play blocked by browser autoplay policy"));
            } catch (e) {
              console.warn("Failed to decode agent audio", e);
            }
          } else {
            // small blink animation when agent text arrives without audio
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 300);
          }
          break;

        case "candidate_interim":
          setInterimTranscript(data.text);
          addOrUpdateCandidateMessage(data.text);
          break;

        case "candidate_final":
          finalizeCandidateMessage(data.text);
          break;

        case "evaluation_done":
          addMessage("Evaluation", typeof data.result === "string" ? data.result : JSON.stringify(data.result));
          break;

        case "popup":
          const msg = (data.text || "").toLowerCase();
          if (msg.includes("multiple faces")) showToast(data.text.trim(), "error");
          else if (msg.includes("no face")) showToast(data.text.trim(), "warning");
          break;

        default:
          break;
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      showToast("WebSocket connection error", "error");
    };

    // cleanup
    return () => {
      stopRecording();
      try {
        ws.close();
      } catch (e) {
        /* ignore */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraError]);

  /* ========================= VIDEO FRAMES SENDER ========================= */
  const startSendingFrames = () => {
    const ws = wsRef.current;
    const video = candidateVideoRef.current;
    if (!video || !ws) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const sendFrame = () => {
      if (!video || video.readyState < 2 || ws.readyState !== WebSocket.OPEN) {
        setTimeout(sendFrame, 1000);
        return;
      }

      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result.split(",")[1];
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "frame", data: base64data }));
          };
          reader.readAsDataURL(blob);
        }, "image/jpeg", 0.5);
      } catch (err) {
        // drawImage may throw if video not ready; ignore and try later
      }

      setTimeout(sendFrame, 3000);
    };

    if (video.readyState >= 2) sendFrame();
    else video.onloadedmetadata = sendFrame;
  };

  /* ========================= AUTO SCROLL CHAT ========================= */
  /* ========================= WEBSOCKET SETUP ========================= */
  useEffect(() => {
    const ws = new WebSocket(WsUrl);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      showToast("WebSocket connected", "success");
      // 🚫 Do NOT start recording/frames here
    };

    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return; // ignore non-json
      }

      switch (data.type) {
        case "error":
          console.error("❌ Server error:", data.message);
          showToast(data.message || "Server error", "error");
          break;
        // ... keep your other cases (agent, candidate_interim, etc.)
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      showToast("WebSocket connection error", "error");
    };

    return () => {
      stopRecording();
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraError]);

  /* ========================= START INTERVIEW ACTION ========================= */
  const handleStartInterview = () => {
    const sid = studentId.trim();
    const skl = skill.trim();

    if (!sid || !skl) {
      showToast("Please fill all fields", "warning");
      return;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        type: "start",
        student_id: sid,   // keep snake_case
        skill: skl,
      };

      console.log("👉 Sending payload:", payload);
      wsRef.current.send(JSON.stringify(payload));

      // ✅ only now start streams
      if (!cameraError) startRecording();
      startSendingFrames();

      showToast("Interview started successfully!", "success");
      setCurrentQuestion(1);
    } else {
      showToast("WebSocket not ready. Please wait...", "error");
    }
  };




  /* ========================= RENDER ========================= */
  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-2 pr-7">
        <div className="flex items-center">
          <img src={rmslogo} alt="RMS Logo" className="h-[50px] sm:h-[60px] w-auto" />
          <span className="font-bold text-base sm:text-lg ml-2.5">Hi Narayanan</span>
        </div>
        <span className="text-xs sm:text-sm md:text-base">⏱ Interview: 15:00</span>
      </div>

      {/* Main */}
      <div className="flex flex-1 flex-col lg:flex-row gap-4 lg:gap-6 p-3 sm:p-5 overflow-hidden">
        {/* Agent */}
        <div className="flex-1 rounded-2xl flex flex-col items-center bg-gray-100 justify-center p-4">
          <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-[300px] lg:h-[300px]">
            {isBlinking && <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-green-400 animate-ping"></div>}
            <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
              <img
                src={aiimg}
                alt="Agent"
                className={`w-full h-full object-cover transition-transform duration-150 transform ${isBlinking ? "scale-x-95 scale-y-80" : "scale-100"}`}
              />
            </div>
          </div>
        </div>

        {/* Candidate + Chat */}
        <div className="flex-1 w-full lg:w-[600px] rounded-2xl flex flex-col gap-3 overflow-hidden bg-white">
          <div className="flex justify-center py-3">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden w-36 h-24 sm:w-56 sm:h-32 md:w-64 md:h-40 lg:w-56 lg:h-32 flex-shrink-0 flex items-center justify-center">
              {cameraError ? (
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <p className="text-red-600 text-xs sm:text-sm mb-2">{cameraError}</p>
                  <button onClick={setupCamera} className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm">Retry Camera</button>
                </div>
              ) : (
                <video ref={candidateVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="px-3 sm:px-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Question {currentQuestion} of {TOTAL_QUESTIONS}</span>
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-500">{Math.round((currentQuestion / TOTAL_QUESTIONS) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(currentQuestion / TOTAL_QUESTIONS) * 100}%` }} />
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 p-3 sm:p-4 rounded-lg overflow-y-auto scroll-smooth flex flex-col justify-start relative" style={{ maxHeight: "370px", minHeight: "200px" }}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} className="flex flex-col mb-1.5">
                <span className="text-[10px] sm:text-xs text-gray-400">{msg.time}</span>
                <p className={`mt-1 p-1.5 rounded-lg max-w-[90%] break-words text-xs sm:text-sm md:text-base ${msg.sender === "Agent" ? "bg-teal-600 text-white self-start" : "bg-indigo-600 text-white self-end"}`}>
                  <span className="font-semibold">{msg.sender}: </span>{msg.text}
                </p>
              </div>
            ))}
            {interimTranscript && (
              <div className="flex flex-col mb-1.5">
                <span className="text-[10px] sm:text-xs text-gray-400">{new Date().toLocaleTimeString()}</span>
                <p className="mt-1 p-1.5 rounded-lg max-w-[90%] self-end text-white opacity-80 italic break-words text-xs sm:text-sm md:text-base flex items-center">
                  You: {interimTranscript}
                  <span className="typing-dots ml-1 flex"><span>.</span><span>.</span><span>.</span></span>
                </p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 px-2 w-full sm:w-auto">
        {toasts.map((t) => (
          <div key={t.id} className={`px-3 py-2 rounded-lg shadow-lg text-xs sm:text-sm md:text-base animate-bounce text-center ${LEVEL_TO_COLOR[t.level] || "bg-blue-600 text-white"}`}>
            {t.text}
          </div>
        ))}
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-3">🎉 Interview Completed</h2>
            <p className="text-sm text-gray-600 mb-5">Thank you for completing all {TOTAL_QUESTIONS} questions.</p>
            <button onClick={() => navigate("/login")} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700">Go to Login</button>
          </div>
        </div>
      )}

      {/* Start Interview Panel (modal) */}
      {currentQuestion === 0 && !showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 sm:w-96 text-center">
            <img src={aiimg} alt="AI Agent" className="w-32 h-32 mx-auto rounded-full shadow-lg mb-4 object-cover" />
            <h2 className="text-xl font-bold mb-2 text-gray-800">Welcome to Your Interview</h2>
            <p className="text-sm text-gray-500 mb-4">Enter your details below</p>

            <div className="flex flex-col gap-2 mb-4">
              <input
                type="text"
                placeholder="Student ID"
                className="border rounded-lg px-3 py-2 text-sm"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Skill (e.g. python)"
                className="border rounded-lg px-3 py-2 text-sm"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />
              {/* <input
                  type="text"
                  placeholder="Interview ID"
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={interviewId}
                  onChange={(e) => setInterviewId(e.target.value)}
                /> */}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleStartInterview}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300"
              >
                Start Interview
              </button>
              <button
                onClick={() => {
                  setStudentId("");
                  setSkill("");
                  setInterviewId("");
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200"
              >
                Reset
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3">Make sure your camera and mic are enabled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;
