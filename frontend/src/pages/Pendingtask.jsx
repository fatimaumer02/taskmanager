import React, { useMemo, useState } from "react";
import { ClockIcon, ListFilterIcon, CalendarIcon, PlusIcon } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModel";

const PendingTasks = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [filter, setFilter]         = useState("all");
  const [showModal, setShowModal]   = useState(false);
  const [selectTask, setSelectTask] = useState(null);

  // ── Only pending tasks ─────────────────────────────────────────────────
  const pendingTasks = useMemo(() =>
    tasks.filter((t) =>
      !(t.completed === true || t.completed === 1 || t.complete === true || t.complete === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "true"))
    ), [tasks]
  );

  // ── Stats ──────────────────────────────────────────────────────────────
  const counts = useMemo(() => ({
    total:  pendingTasks.length,
    high:   pendingTasks.filter((t) => t.priority?.toLowerCase() === "high").length,
    medium: pendingTasks.filter((t) => t.priority?.toLowerCase() === "medium").length,
    low:    pendingTasks.filter((t) => t.priority?.toLowerCase() === "low").length,
  }), [pendingTasks]);

  // ── Filter ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return pendingTasks.filter((task) => {
      const dueDate  = task.dueDate ? new Date(task.dueDate) : null;
      const today    = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      switch (filter) {
        case "today":  return dueDate && dueDate.toDateString() === today.toDateString();
        case "week":   return dueDate && dueDate >= today && dueDate <= nextWeek;
        case "overdue": return dueDate && dueDate < today;
        case "high":
        case "medium":
        case "low":    return task.priority?.toLowerCase() === filter;
        default:       return true;
      }
    });
  }, [pendingTasks, filter]);

  const filters = ["All", "Today", "Week", "Overdue", "High", "Medium", "Low"];

  const handleCloseModal = () => { setShowModal(false); setSelectTask(null); };

  return (
    <div className="space-y-4 p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 shrink-0" style={{ color: "#f59e0b" }} />
            <span className="truncate">Pending Tasks</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 ml-7">Tasks that are still in progress</p>
        </div>
        <button
          onClick={() => { setSelectTask(null); setShowModal(true); }}
          onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #1e40af)"}
          onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #1d4ed8)"}
          className="flex items-center justify-center gap-1.5 w-full md:w-auto px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #1d4ed8)" }}
        >
          <PlusIcon size={15} /> Add New Task
        </button>
      </div>

      {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniCard label="Total Pending" value={counts.total}  color="#f59e0b" bg="rgba(245,158,11,0.08)"  />
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
            Pending Tasks
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-600">
              {counts.total}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => {
              const val = f.toLowerCase();
              const active = filter === val;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(val)}
                  className={`px-3 py-0.5 text-xs rounded-full border font-medium transition-all duration-150 ${
                    active
                      ? "text-white border-transparent"
                      : "bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600"
                  }`}
                  style={active ? { background: "linear-gradient(135deg, #f59e0b, #ef4444)" } : {}}
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
              style={{ background: "rgba(245,158,11,0.10)" }}>
              <ClockIcon size={26} style={{ color: "#f59e0b" }} />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">
              {filter === "all" ? "No pending tasks!" : `No ${filter} pending tasks`}
            </p>
            <p className="text-gray-400 text-xs mb-5">
              {filter === "all" ? "You're all caught up 🎉" : "Try a different filter"}
            </p>
            {filter === "all" && (
              <button
                onClick={() => { setSelectTask(null); setShowModal(true); }}
                onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #1e40af)"}
                onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #1d4ed8)"}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #7c3aed, #1d4ed8)" }}
              >
                Add New Task
              </button>
            )}
          </div>
        ) : (
          filtered.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox
              onEdit={() => { setSelectTask(task); setShowModal(true); }}
            />
          ))
        )}
      </div>

      {/* ── MODAL ────────────────────────────────────────────────────────── */}
      {showModal && (
        <TaskModal
          isOpen={showModal}
          onClose={handleCloseModal}
          taskToEdit={selectTask}
          onSave={async (taskData) => {
            const token = localStorage.getItem("token");
            if (!token) return;
            const { default: axios } = await import("axios");
            const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
            const payload = { ...taskData, priority: taskData.priority ? taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1).toLowerCase() : "Low" };
            if (payload._id) {
              await axios.put(`http://localhost:4010/api/tasks/edittask/${payload._id}`, payload, { headers });
            } else {
              await axios.post(`http://localhost:4010/api/tasks/createtask`, payload, { headers });
            }
            await refreshTasks();
            setShowModal(false);
            setSelectTask(null);
          }}
        />
      )}
    </div>
  );
};

// ── Mini stat card ────────────────────────────────────────────────────────
const MiniCard = ({ label, value, color, bg }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="rounded-xl p-2 shrink-0" style={{ background: bg }}>
      <ClockIcon size={17} style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold leading-none" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-1 truncate">{label}</p>
    </div>
  </div>
);

export default PendingTasks;