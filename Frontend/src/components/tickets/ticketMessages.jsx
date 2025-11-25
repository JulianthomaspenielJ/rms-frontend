// src/components/tickets/TicketMessages.jsx
import { useState } from "react";

export default function TicketMessages({ messages, userRole, onSend }) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSend(newMessage);
    setNewMessage("");
  };

  return (
    <div className="space-y-4">
      {/* Messages Thread */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl shadow-sm max-w-lg ${
                msg.sender.toLowerCase().includes("subadmin")
                  ? "bg-primary text-white ml-auto"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm font-semibold">{msg.sender}</p>
              <p>{msg.message}</p>
              <p className="text-xs opacity-70 mt-1">{msg.time}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
      </div>

      {/* Reply Box */}
      <div className="flex gap-3 pt-3 border-t border-gray-200">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
