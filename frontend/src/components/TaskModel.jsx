import React, { useState, useEffect } from "react";
import {
  PlusCircleIcon, AlignLeftIcon, TagIcon,
  CalendarIcon, CircleIcon, XIcon,
} from "lucide-react";
import { toast } from "react-toastify";

const API_URL = "http://localhost:4010/api/tasks";

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const [form, setForm] = useState({
    title:       "",
    description: "",
    priority:    "Low",
    dueDate:     "",
    status:      "In Progress",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // ── Populate form when editing an existing task ──────────────────────────
  useEffect(() => {
    if (taskToEdit) {
      setForm({
        title:       taskToEdit.title       || "",
        description: taskToEdit.description || "",
        priority:    taskToEdit.priority
                       ? taskToEdit.priority.charAt(0).toUpperCase() + taskToEdit.priority.slice(1)
                       : "Low",
        dueDate:     taskToEdit.dueDate
                       ? taskToEdit.dueDate.slice(0, 10)   // format to yyyy-mm-dd
                       : "",
        status:      (taskToEdit.completed || taskToEdit.complete) ? "Completed" : "In Progress",
      });
    } else {
      // Reset form for new task
      setForm({ title: "", description: "", priority: "Low", dueDate: "", status: "In Progress" });
    }
    setError("");
  }, [taskToEdit, isOpen]);

  // ── Don't render anything if modal is closed ─────────────────────────────
  if (!isOpen) return null;

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError("Task title is required."); return; }
    setError("");
    setLoading(true);

    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      // ✅ Always capitalize to match backend enum: Low / Medium / High
      priority:    form.priority.charAt(0).toUpperCase() + form.priority.slice(1).toLowerCase(),
      dueDate:     form.dueDate || null,
      completed:   form.status === "Completed",
    };

    // ── Check token before sending ───────────────────────────────────────
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      if (onSave) {
        // ── Let parent (Dashboard) handle the API call ───────────────────
        await onSave({ ...payload, ...(taskToEdit ? { _id: taskToEdit._id || taskToEdit.id } : {}) });
        toast.success(taskToEdit ? "Task updated successfully!" : "Task created successfully!");
      } else {
        // ── Standalone: call API directly ────────────────────────────────
        const isEdit = taskToEdit?._id || taskToEdit?.id;
        const url    = isEdit
          ? `${API_URL}/edittask/${taskToEdit._id || taskToEdit.id}`
          : `${API_URL}/createtask`;

        const res = await fetch(url, {
          method:  isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          // Show exact backend error message
          throw new Error(data?.message || `Server error ${res.status}`);
        }

        toast.success(isEdit ? "Task updated successfully!" : "Task created successfully!");
        onClose();
      }
    } catch (err) {
      const msg = err.message || "Something went wrong.";
      setError(msg);
      toast.error(msg);
      console.error("TaskModal error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <PlusCircleIcon size={20} style={{ color: "#7c3aed" }} />
            <h2 className="text-lg font-bold text-gray-800">
              {taskToEdit ? "Edit Task" : "Create New Task"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-4">

          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
              <AlignLeftIcon size={12} className="text-gray-400" />
              Description
            </label>
            <textarea
              placeholder="Add details about your task"
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition resize-none"
            />
          </div>

          {/* Priority + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
                <TagIcon size={12} className="text-gray-400" />
                Priority
              </label>
              <select
                value={form.priority}
                onChange={e => set("priority", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition bg-white"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
                <CalendarIcon size={12} className="text-gray-400" />
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => set("dueDate", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2">
              <CircleIcon size={12} className="text-gray-400" />
              Status
            </label>
            <div className="flex items-center gap-6">
              {["Completed", "In Progress"].map(s => (
                <label
                  key={s}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => set("status", s)}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: form.status === s ? "#7c3aed" : "#d1d5db",
                      background:  form.status === s ? "#7c3aed" : "white",
                    }}
                  >
                    {form.status === s && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600 select-none">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #1e40af)"}
            onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #1d4ed8)"}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #7c3aed, #1d4ed8)" }}
          >
            {loading ? "Saving..." : taskToEdit ? "Save Changes" : "Create Task"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TaskModal;