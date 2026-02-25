import React, { useCallback, useMemo, useState } from "react";
import {
  HomeIcon, PlusIcon, LeafIcon, ZapIcon, FlameIcon,
  CalendarIcon, ListFilterIcon,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import TaskModal from "../components/TaskModel";
import TaskItem from "../components/TaskItem";

const API_BASE = "http://localhost:4010/api/tasks";

const Dashboard = () => {
  const { tasks = [], refreshTasks } = useOutletContext();

  const [filter, setFilter]         = useState("all");
  const [showModal, setShowModal]   = useState(false);
  const [selectTask, setSelectTask] = useState(null);

  // ── Stats ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (t) =>
        t.completed === true || t.completed === 1 ||
        t.complete  === true || t.complete  === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "true")
    ).length;
    return {
      total,
      completed,
      pending:        total - completed,
      lowPriority:    tasks.filter((t) => t.priority?.toLowerCase() === "low").length,
      mediumPriority: tasks.filter((t) => t.priority?.toLowerCase() === "medium").length,
      highPriority:   tasks.filter((t) => t.priority?.toLowerCase() === "high").length,
    };
  }, [tasks]);

  // ── Filter ─────────────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
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
  }, [tasks, filter]);

  // ── Save task (create or update) ───────────────────────────────────────
  const handleTaskSave = useCallback(async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not logged in. Please log in again.");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        ...taskData,
        priority: taskData.priority
          ? taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1).toLowerCase()
          : 'Low',
      };

      if (payload._id) {
        await axios.put(`${API_BASE}/edittask/${payload._id}`, payload, { headers });
        toast.success('Task updated successfully!');
      } else {
        await axios.post(`${API_BASE}/createtask`, payload, { headers });
        toast.success('Task created successfully!');
      }

      await refreshTasks();
      setShowModal(false);
      setSelectTask(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error saving task.";
      toast.error(msg);
      console.error("Error saving task:", msg);
    }
  }, [refreshTasks]);

  // ── Close modal ────────────────────────────────────────────────────────
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectTask(null);
  };

  const filters = ["All", "Today", "Week", "High", "Medium", "Low"];

  return (
    <div className="space-y-4 p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HomeIcon className="w-5 h-5 shrink-0" style={{ color: "#7c3aed" }} />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 ml-7">Manage your tasks efficiently</p>
        </div>

        <button
          onClick={() => { setSelectTask(null); setShowModal(true); }}
          onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #1e40af)"}
          onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #1d4ed8)"}
          className="flex items-center justify-center gap-1.5 w-full md:w-auto px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #1d4ed8)" }}
        >
          <PlusIcon size={15} />
          Add New Task
        </button>
      </div>

      {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Tasks"     value={stats.total}          Icon={HomeIcon}  color="#7c3aed" bg="rgba(124,58,237,0.08)" />
        <StatCard label="Low Priority"    value={stats.lowPriority}    Icon={LeafIcon}  color="#22c55e" bg="rgba(34,197,94,0.08)"  />
        <StatCard label="Medium Priority" value={stats.mediumPriority} Icon={ZapIcon}   color="#f59e0b" bg="rgba(245,158,11,0.08)" />
        <StatCard label="High Priority"   value={stats.highPriority}   Icon={FlameIcon} color="#ef4444" bg="rgba(239,68,68,0.08)"  />
      </div>

      {/* ── TASK LIST ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">

        {/* Header + filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
            <ListFilterIcon size={15} className="text-gray-400" />
            All Tasks
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
                      : "bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600"
                  }`}
                  style={active ? { background: "linear-gradient(135deg, #7c3aed, #1d4ed8)" } : {}}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks or empty state */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(124,58,237,0.10)" }}
            >
              <CalendarIcon size={26} style={{ color: "#7c3aed" }} />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">No tasks found</p>
            <p className="text-gray-400 text-xs mb-5">Create your first task to get started</p>
            <button
              onClick={() => { setSelectTask(null); setShowModal(true); }}
              onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #1e40af)"}
              onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #1d4ed8)"}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #7c3aed, #1d4ed8)" }}
            >
              Add New Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
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

      {/* ── ADD NEW TASK CARD ────────────────────────────────────────────── */}
      <button
        onClick={() => { setSelectTask(null); setShowModal(true); }}
        className="w-full group relative overflow-hidden rounded-xl border-2 border-dashed border-purple-200 bg-white hover:border-purple-400 transition-all duration-300 hover:shadow-md"
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.04), rgba(29,78,216,0.04))" }}
        />
        <div className="relative flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #7c3aed, #1d4ed8)" }}
            >
              <PlusIcon size={18} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
                Add New Task
              </p>
              <p className="text-xs text-gray-400">Click to create a new task</p>
            </div>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full text-white shrink-0 transition-all duration-200 group-hover:shadow-md"
            style={{ background: "linear-gradient(135deg, #7c3aed, #1d4ed8)" }}
          >
            + New Task
          </span>
        </div>
      </button>

      {/* ── MODAL ────────────────────────────────────────────────────────── */}
      {showModal && (
        <TaskModal
          isOpen={showModal}
          onClose={handleCloseModal}
          taskToEdit={selectTask}
          onSave={handleTaskSave}
        />
      )}

    </div>
  );
};

// ── Stat Card ────────────────────────────────────────────────────────────
const StatCard = ({ label, value, Icon, color, bg }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="rounded-xl p-2 shrink-0" style={{ background: bg }}>
      <Icon size={17} style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold leading-none" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-1 truncate">{label}</p>
    </div>
  </div>
);

export default Dashboard;