// src/pages/tickets/TicketDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TicketDetail() {
  const { id } = useParams(); // Ticket ID from URL
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userRole, setUserRole] = useState("sub_admin"); 
  // TODO: Replace with actual logged-in role (candidate/hr/admin/super_admin/sub_admin)

  useEffect(() => {
    // TODO: Replace with API calls
    const mockTicket = {
      id: "TCK-3001",
      subject: "Candidate unable to reset password",
      priority: "high",
      status: "in_progress",
      assigned_to: "SubAdmin1",
      raised_by: "Candidate",
      created_at: "2025-08-27",
    };

    const mockMessages = [
      { sender: "Candidate", message: "I cannot reset my password.", time: "2025-08-27 10:30" },
      { sender: "SubAdmin1", message: "We are looking into this issue.", time: "2025-08-27 11:00" },
    ];

    setTicket(mockTicket);
    setMessages(mockMessages);
  }, [id]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      sender: userRole === "candidate" ? "Candidate" : "SubAdmin1",
      message: newMessage,
      time: new Date().toLocaleString(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // TODO: Send to backend API
  };

  const handleStatusChange = (newStatus) => {
    setTicket({ ...ticket, status: newStatus });
    // TODO: Call backend API to update status
  };

  if (!ticket) return <p className="p-6">Loading ticket...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Ticket Info */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Ticket {ticket.id} – {ticket.subject}
        </h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-semibold">Priority:</span> {ticket.priority}</p>
          <p><span className="font-semibold">Status:</span> {ticket.status}</p>
          <p><span className="font-semibold">Assigned To:</span> {ticket.assigned_to}</p>
          <p><span className="font-semibold">Raised By:</span> {ticket.raised_by}</p>
          <p><span className="font-semibold">Created At:</span> {ticket.created_at}</p>
        </div>

        {/* Status Update for Sub Admin */}
        {userRole === "sub_admin" && (
          <div className="mt-4">
            <label className="font-semibold mr-2">Update Status:</label>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-xl font-bold mb-4">Conversation</h3>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {messages.map((msg, idx) => (
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
          ))}
        </div>
      </div>

      {/* Reply Box */}
      <div className="bg-white p-4 rounded-2xl shadow-md flex gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
