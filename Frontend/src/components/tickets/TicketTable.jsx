// src/components/tickets/TicketTable.jsx
import { Link } from "react-router-dom";

export default function TicketTable({ tickets, userRole }) {
  if (!tickets || tickets.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6">
        No tickets found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-primary text-white">
          <tr>
            <th className="px-4 py-2 text-left">Ticket ID</th>
            <th className="px-4 py-2 text-left">Subject</th>
            <th className="px-4 py-2 text-left">Priority</th>
            <th className="px-4 py-2 text-left">Status</th>
            {userRole === "super_admin" && (
              <th className="px-4 py-2 text-left">Assigned To</th>
            )}
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{ticket.id}</td>
              <td className="px-4 py-2">{ticket.subject}</td>
              <td className="px-4 py-2 capitalize">{ticket.priority}</td>
              <td className="px-4 py-2 capitalize">{ticket.status}</td>
              {userRole === "super_admin" && (
                <td className="px-4 py-2">{ticket.assigned_to || "Unassigned"}</td>
              )}
              <td className="px-4 py-2">{ticket.created_at}</td>
              <td className="px-4 py-2 text-center">
                <Link
                  to={`/tickets/${ticket.id}`}
                  className="bg-primary text-white px-3 py-1 rounded-lg shadow hover:bg-primary/90 transition"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
