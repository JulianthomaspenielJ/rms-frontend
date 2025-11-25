// src/pages/tickets/MyTickets.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with actual API call for logged-in user
    const mockTickets = [
      {
        id: "TCK-2001",
        subject: "Issue with profile update",
        status: "open",
        priority: "medium",
        created_at: "2025-08-28",
      },
      {
        id: "TCK-2002",
        subject: "Job application error",
        status: "resolved",
        priority: "high",
        created_at: "2025-08-25",
      },
    ];
    setTickets(mockTickets);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-primary mb-6">My Tickets</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t">
                  <td className="p-3 font-mono text-sm">{ticket.id}</td>
                  <td className="p-3">{ticket.subject}</td>
                  <td className="p-3 capitalize">{ticket.priority}</td>
                  <td className="p-3 capitalize">{ticket.status}</td>
                  <td className="p-3">{ticket.created_at}</td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className="bg-primary text-white px-4 py-1 rounded-lg shadow hover:bg-primary/90 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan="6">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
