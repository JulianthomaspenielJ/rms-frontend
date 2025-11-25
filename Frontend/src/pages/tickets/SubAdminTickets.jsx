// src/pages/tickets/SubAdminTickets.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SubAdminTickets() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with API call (fetch tickets assigned to logged-in sub-admin)
    const mockTickets = [
      {
        id: "TCK-3001",
        subject: "Candidate unable to reset password",
        status: "in_progress",
        priority: "high",
        raised_by: "Candidate",
        created_at: "2025-08-27",
      },
      {
        id: "TCK-3002",
        subject: "HR account access issue",
        status: "open",
        priority: "medium",
        raised_by: "HR",
        created_at: "2025-08-29",
      },
    ];
    setTickets(mockTickets);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-primary mb-6">Assigned Tickets</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Raised By</th>
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
                  <td className="p-3">{ticket.raised_by}</td>
                  <td className="p-3">{ticket.created_at}</td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className="bg-primary text-white px-4 py-1 rounded-lg shadow hover:bg-primary/90 transition"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan="7">
                  No tickets assigned to you.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
