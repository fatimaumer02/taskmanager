import React, { useMemo, useState } from "react";
import { CheckCircle2Icon, ListFilterIcon, Trash2Icon } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import TaskItem from "../components/TaskItem";

const API_BASE = "http://localhost:4010/api/tasks";

const CompletedTasks = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [filter, setFilter]         = useState("all");
  const [clearing, setClearing]     = useState(false);

  // ── Only completed tasks ───────────────────────────────────────────────
  const completedTasks = useMemo(() =>
    tasks.filter((t) =>
      t.completed === true || t.completed === 1 || t.complete === true || t.complete === 1 ||
      (typeof t.completed === "string" && t.completed.toLowerCase() === "true")
    ), [tasks]
  );

  // ── Stats ──────────────────────────────────────────────────────────────
  const counts = useMemo(() => ({
    total:  completedTasks.length,
    high:   completedTasks.filter((t) => t.priority?.toLowerCase() === "high").length,
    medium: completedTasks.filter((t) => t.priority?.toLowerCase() === "medium").length,
    low:    completedTasks.filter((t) => t.priority?.toLowerCase() === "low").length,
  }), [completedTasks]);

  // ── Filter ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return completedTasks.filter((task) => {
      const dueDate  = task.dueDate ? new Date(task.dueDate) : null;
      const today    = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      switch (filter) {
        case "today":  return dueDate && dueDate.toDateString() === today.toDateString();
        case "week":   return dueDate && dueDate >= today && dueDate <= nextWeek;
        case "high":
        case "medium":
        case "low":    return task.priority?.toLowerCase() === filter;
        default:       return true;
      }
    });
  }, [completedTasks, filter]);

  // ── Clear all completed ────────────────────────────────────────────────
  const handleClearAll = async () => {
    if (!window.confirm(`Delete all ${counts.total} completed tasks?`)) return;
    setClearing(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await Promise.all(
        completedTasks.map((t) =>
          axios.delete(`${API_BASE}/deltask/${t._id || t.id}`, { headers })
        )
      );
      toast.success(`Cleared ${counts.total} completed tasks.`);
      await refreshTasks();
    } catch (err) {
      toast.error("Failed to clear tasks.");
    } finally {
      setClearing(false);
    }
  };

  const filters = ["All", "Today", "Week", "High", "Medium", "Low"];

  return (
    <div className="space-y-4 p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle2Icon className="w-5 h-5 shrink-0" style={{ color: "#22c55e" }} />
            <span className="truncate">Completed Tasks</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 ml-7">Tasks you have finished</p>
        </div>

        {counts.total > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="flex items-center justify-center gap-1.5 w-full md:w-auto px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 shrink-0 bg-red-500 hover:bg-red-600 disabled:opacity-60"
          >
            <Trash2Icon size={15} />
            {clearing ? "Clearing..." : "Clear All"}
          </button>
        )}
      </div>

      {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniCard label="Total Done"    value={counts.total}  color="#22c55e" bg="rgba(34,197,94,0.08)"   />
        <MiniCard label="High Priority" value={counts.high}   color="#ef4444" bg="rgba(239,68,68,0.08)"   />
        <MiniCard label="Medium"        value={counts.medium} color="#f59e0b" bg="rgba(245,158,11,0.08)"  />
        <MiniCard label="Low Priority"  value={counts.low}    color="#22c55e" bg="rgba(34,197,94,0.08)"   />
      </div>

      {/* ── TASK LIST ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">

        {/* Header + filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
            <ListFilterIcon size={15} className="text-gray-400" />
            Completed Tasks
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-600">
              {counts.total}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => {
              const val    = f.toLowerCase();
              const active = filter === val;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(val)}
                  className={`px-3 py-0.5 text-xs rounded-full border font-medium transition-all duration-150 ${
                    active
                      ? "text-white border-transparent"
                      : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-600"
                  }`}
                  style={active ? { background: "linear-gradient(135deg, #22c55e, #16a34a)" } : {}}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks or empty */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(34,197,94,0.10)" }}>
              <CheckCircle2Icon size={26} style={{ color: "#22c55e" }} />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">
              {filter === "all" ? "No completed tasks yet" : `No ${filter} completed tasks`}
            </p>
            <p className="text-gray-400 text-xs">
              {filter === "all"
                ? "Complete a task and it will appear here"
                : "Try a different filter"}
            </p>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox
              onEdit={() => {}}
            />
          ))
        )}
      </div>

      {/* ── Completion progress bar ──────────────────────────────────────── */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600">Overall Progress</p>
            <p className="text-xs font-bold" style={{ color: "#22c55e" }}>
              {counts.total} / {tasks.length} tasks completed
            </p>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.round((counts.total / tasks.length) * 100)}%`,
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-right">
            {Math.round((counts.total / tasks.length) * 100)}% complete
          </p>
        </div>
      )}
    </div>
  );
};

// ── Mini stat card ────────────────────────────────────────────────────────
const MiniCard = ({ label, value, color, bg }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="rounded-xl p-2 shrink-0" style={{ background: bg }}>
      <CheckCircle2Icon size={17} style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold leading-none" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-1 truncate">{label}</p>
    </div>
  </div>
);

export default CompletedTasks;