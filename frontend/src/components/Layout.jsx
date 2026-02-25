import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import Navbar from "./Navbar";
import SideBar from "./Sidebar";
// import Dashboard from "../pages/Dashboard";
import { Outlet } from "react-router-dom";
import axios from "axios";
import {
  TrendingUp,
  Circle,
  CheckCircle,
  Clock,
  Percent
} from "lucide-react";


const BASE_URL = "http://localhost:4010";


const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
    <div className="bg-linear-to-br from-blue-600 to-purple-600 p-3 rounded-lg text-white">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

const Layout = ({ onLogout, user }) => {

  // ================= STATE =================
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================= FETCH TASKS =================
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // ✅ FIX 3: Correct endpoint is /api/tasks/all (confirmed from browser console)
      const { data } = await axios.get(
        `${BASE_URL}/api/tasks/gettasks`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // ✅ FIX 4: Handles all common response shapes from the backend
      const arr =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.tasks)
          ? data.tasks
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setTasks(arr);

    } catch (err) {
      console.error("fetchTasks error:", err);

      const message =
        err.response?.data?.message ||
        (err.message === "Network Error"
          ? "Cannot reach the server. Make sure the backend is running on port 4010."
          : err.message) ||
        "Failed to fetch tasks";

      setError(message);

      if (err.response?.status === 401) {
        onLogout();
      }

    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  // ================= LOAD ON MOUNT =================
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ================= STATISTICS =================
  const stat = useMemo(() => {
    // ✅ FIX 6: Sidebar uses "t.complete" but Layout used "t.completed" — normalized here
    //    to check both field names so either backend field name works
    const completedTasks = tasks.filter((t) =>
      t.completed === true ||
      t.completed === 1 ||
      t.complete === true ||
      t.complete === 1 ||
      (typeof t.completed === "string" && t.completed.toLowerCase() === "true") ||
      (typeof t.complete === "string" && t.complete.toLowerCase() === "true")
    ).length;

    const totalCount = tasks.length;
    const pendingTasks = totalCount - completedTasks;
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return { totalCount, completedTasks, pendingTasks, completionPercentage };
  }, [tasks]);

  // ================= LOADING =================
  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  // ================= ERROR =================
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 max-w-md">
          <p className="font-medium mb-2">Error Loading Tasks</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );

  // ================= MAIN =================
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <SideBar user={user} tasks={tasks} />
      {/* <Dashboard tasks = {tasks}/> */}

      <div className="ml-0 xl:ml-64 md:ml-16 pt-16 p-3 sm:p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">

          {/* MAIN CONTENT */}
          <div className="xl:col-span-2 space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          {/* RIGHT PANEL */}
          <div className="xl:col-span-1 space-y-6">

            {/* STATISTICS */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatCard
                  title="Total Tasks"
                  value={stat.totalCount}
                  icon={<Circle className="w-4 h-4" />}
                />
                <StatCard
                  title="Completed"
                  value={stat.completedTasks}
                  icon={<CheckCircle className="w-4 h-4" />}
                />
                <StatCard
                  title="Pending"
                  value={stat.pendingTasks}
                  icon={<Clock className="w-4 h-4" />}
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stat.completionPercentage}%`}
                  icon={<Percent className="w-4 h-4" />}
                />
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Task Progress</span>
                  <span>{stat.completedTasks} / {stat.totalCount}</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-500"
                    style={{ width: `${stat.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Recent Activity
              </h3>

              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="flex justify-between items-center p-3 hover:bg-blue-50 rounded-lg transition"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString()
                          : "No date"}
                      </p>
                    </div>

                    {/* ✅ FIX 7: Check both "completed" and "complete" field names */}
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.completed || task.complete
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {task.completed || task.complete ? "Completed" : "Pending"}
                    </span>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                      <Clock className="w-7 h-7 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-500">No recent activity</p>
                    <p className="text-xs text-gray-400">Tasks will appear here</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;