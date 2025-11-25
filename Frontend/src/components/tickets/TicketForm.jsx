// src/components/tickets/TicketForm.jsx
import { useState } from "react";

export default function TicketForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      alert("Subject and Description are required!");
      return;
    }
    onSubmit(formData);
    setFormData({ subject: "", description: "", priority: "medium", attachment: null });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Enter ticket subject"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Describe your issue"
          required
        ></textarea>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Attachment</label>
        <input
          type="file"
          name="attachment"
          onChange={handleChange}
          className="w-full text-gray-600"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Submit Ticket
        </button>
      </div>
    </form>
  );
}
