import React, { useEffect, useState } from "react";
import {
  CheckCircle2, Circle, MoreVertical, Pencil, Trash2,
  CalendarIcon, Flag, ChevronDown, ChevronUp, AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:4010/api/tasks";

// ── Auth header ──────────────────────────────────────────────────────────────
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Priority config ──────────────────────────────────────────────────────────
const PRIORITY = {
  high:   { label: "High",   color: "#ef4444", bg: "rgba(239,68,68,0.10)"  },
  medium: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
  low:    { label: "Low",    color: "#22c55e", bg: "rgba(34,197,94,0.10)"  },
};
const getPriority = (p) => PRIORITY[p?.toLowerCase()] || PRIORITY.low;

const isTaskCompleted = (val) =>
  [true, 1, "yes", "true"].includes(
    typeof val === "string" ? val.toLowerCase() : val
  );

// ────────────────────────────────────────────────────────────────────────────
const TaskItem = ({ task, onRefresh, showCompleteCheckbox = true, onEdit }) => {
  const [completed, setCompleted]       = useState(isTaskCompleted(task.completed));
  const [showMenu, setShowMenu]         = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [subtasks, setSubtasks]         = useState(task.subtasks || []);

  useEffect(() => {
    setCompleted(isTaskCompleted(task.completed));
    setSubtasks(task.subtasks || []);
  }, [task.completed, task.subtasks]);

  // ── Toggle complete ──────────────────────────────────────────────────────
  const handleComplete = async () => {
    const next = !completed;
    setCompleted(next);
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE}/edittask/${task._id || task.id}`,
        { ...task, completed: next },
        { headers: authHeader() }
      );
      toast.success(next ? "Task marked as completed! 🎉" : "Task marked as pending.");
      onRefresh?.();
    } catch (err) {
      setCompleted(!next);
      toast.error("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    setShowMenu(false);
    setDeleting(true);
    try {
      await axios.delete(
        `${API_BASE}/deltask/${task._id || task.id}`,
        { headers: authHeader() }
      );
      toast.success("Task deleted successfully.");
      onRefresh?.();
    } catch (err) {
      toast.error("Failed to delete task. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const priority    = getPriority(task.priority);
  const hasSubtasks = subtasks.length > 0;
  const dueDate     = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue   = dueDate && !completed && dueDate < new Date();
  const subtaskDone = subtasks.filter((s) => s.completed).length;
  const subtaskPct  = hasSubtasks ? Math.round((subtaskDone / subtasks.length) * 100) : 0;

  return (
    <div
      className={`group relative flex flex-col px-4 py-3.5 border-b border-gray-100 last:border-none transition-all duration-200 hover:bg-gray-50 ${
        deleting ? "opacity-40 pointer-events-none" : ""
      } ${completed ? "opacity-70" : ""}`}
    >
      {/* Left priority accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-3px rounded-r"
        style={{ background: priority.color }}
      />

      <div className="flex items-start gap-3 pl-3">

        {/* ── Checkbox ──────────────────────────────────────────────────── */}
        {showCompleteCheckbox && (
          <button
            onClick={handleComplete}
            disabled={loading}
            className="mt-0.5 shrink-0 transition-transform duration-150 hover:scale-110 disabled:opacity-40"
            title={completed ? "Mark as pending" : "Mark as complete"}
          >
            {completed
              ? <CheckCircle2 size={20} style={{ color: "#7c3aed" }} />
              : <Circle size={20} className="text-gray-300 hover:text-purple-400 transition-colors" />
            }
          </button>
        )}

        {/* ── Content ───────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Title + menu */}
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm font-semibold leading-snug truncate ${
              completed ? "line-through text-gray-400" : "text-gray-800"
            }`}>
              {task.title}
            </h3>

            {/* 3-dot menu */}
            <div className="relative shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                  setShowMenu((p) => !p);
                }}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <MoreVertical size={15} />
              </button>

              {/* Click outside to close */}
              {(showMenu || showDeleteConfirm) && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => { setShowMenu(false); setShowDeleteConfirm(false); }}
                />
              )}

              {/* Dropdown menu */}
              {showMenu && (
                <div
                  className="absolute right-0 z-50 bg-white rounded-xl border border-gray-200 py-1.5 w-44"
                  style={{ top: "calc(100% + 6px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                >
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors text-left"
                    onClick={() => { setShowMenu(false); onEdit?.(); }}
                  >
                    <Pencil size={14} className="text-purple-500 shrink-0" />
                    Edit Task
                  </button>

                  <div className="border-t border-gray-100 mx-3 my-1" />

                  <button
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                    onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
                  >
                    <Trash2 size={14} className="text-red-500 shrink-0" />
                    Delete Task
                  </button>
                </div>
              )}

              {/* Delete confirmation */}
              {showDeleteConfirm && (
                <div
                  className="absolute right-0 z-50 bg-white rounded-xl border border-red-100 p-4 w-56"
                  style={{ top: "calc(100% + 6px)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
                >
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <AlertTriangle size={13} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Delete Task?</p>
                      <p className="text-xs text-gray-400 mt-0.5">This cannot be undone.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-xs font-semibold text-white transition-colors"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{task.description}</p>
          )}

          {/* Meta: priority + due date + status */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: priority.bg, color: priority.color }}
            >
              <Flag size={10} />
              {priority.label}
            </span>

            {dueDate && (
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                isOverdue ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-500"
              }`}>
                <CalendarIcon size={10} />
                {isOverdue && "Overdue · "}
                {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}

            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              completed ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
            }`}>
              {completed ? "Completed" : "Pending"}
            </span>
          </div>

          {/* Subtasks */}
          {hasSubtasks && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${subtaskPct}%`, background: "linear-gradient(135deg, #7c3aed, #1d4ed8)" }}
                  />
                </div>
                <span className="text-xs text-gray-400 shrink-0">{subtaskDone}/{subtasks.length}</span>
                <button
                  onClick={() => setShowSubtasks((p) => !p)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showSubtasks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {showSubtasks && (
                <div className="space-y-1 pl-1">
                  {subtasks.map((st, i) => (
                    <div key={st._id || i} className="flex items-center gap-2">
                      {st.completed
                        ? <CheckCircle2 size={13} style={{ color: "#7c3aed" }} />
                        : <Circle size={13} className="text-gray-300" />
                      }
                      <span className={`text-xs ${st.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;