// src/pages/tickets/AdminTicketList.jsx
import { useEffect, useState } from "react";

export default function AdminTicketList() {
  const [tickets, setTickets] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockTickets = [
      {
        id: "TCK-1001",
        subject: "Login issue",
        status: "open",
        priority: "high",
        assigned_to: "Not Assigned",
        created_at: "2025-08-30",
      },
      {
        id: "TCK-1002",
        subject: "Unable to upload resume",
        status: "in_progress",
        priority: "medium",
        assigned_to: "SubAdmin1",
        created_at: "2025-08-29",
      },
    ];
    setTickets(mockTickets);
  }, []);

  const handleAssign = (ticketId) => {
    // TODO: Call backend API to assign ticket
    alert(`Assigning Ticket ${ticketId} to a Sub Admin`);
  };

  const filteredTickets = filterStatus
    ? tickets.filter((t) => t.status === filterStatus)
    : tickets;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-primary mb-6">All Tickets</h2>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-t">
                  <td className="p-3 font-mono text-sm">{ticket.id}</td>
                  <td className="p-3">{ticket.subject}</td>
                  <td className="p-3 capitalize">{ticket.priority}</td>
                  <td className="p-3 capitalize">{ticket.status}</td>
                  <td className="p-3">{ticket.assigned_to}</td>
                  <td className="p-3">{ticket.created_at}</td>
                  <td className="p-3">
                    {ticket.status === "open" ? (
                      <button
                        onClick={() => handleAssign(ticket.id)}
                        className="bg-primary text-white px-4 py-1 rounded-lg shadow hover:bg-primary/90 transition"
                      >
                        Assign
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan="7">
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
