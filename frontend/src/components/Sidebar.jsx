import React, { useState } from 'react'
import { SIDEBAR_CLASSES } from '../assets/dummy'
import { LayoutDashboard, Clock, CheckCircle, Lightbulb, X, Menu } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",       path: "/layout"           },
  { icon: Clock,           label: "Pending Tasks",   path: "/layout/pending"   },
  { icon: CheckCircle,     label: "Completed Tasks", path: "/layout/completed" },
]

// ── SIDEBAR CONTENT (shared between desktop + mobile drawer) ──
const SidebarContent = ({ user, tasks, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const totalTasks     = tasks?.length || 0
  const completedTasks = tasks?.filter((t) => t.complete || t.completed).length || 0
  const productivity   = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const username       = user?.name || "User"
  const initial        = username.charAt(0).toUpperCase()

  return (
    <div className="mt-6 flex flex-col h-full bg-white text-gray-800">

      {/* ── AVATAR + NAME ── */}
      <div className="p-5 border-b border-blue-100">

        {/* Close button — mobile drawer only */}
        {onClose && (
          <div className="flex justify-end mb-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Avatar circle */}
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500
            flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
            {initial}
          </div>

          {/* Name + tagline — always visible */}
          <div>
            <h2 className="text-base font-bold text-gray-800 leading-tight">Hey, {username}</h2>
            <p className="text-xs text-gray-500 mt-0.5">✦ Let's crush some tasks!</p>
          </div>
        </div>
      </div>

      {/* ── PRODUCTIVITY BAR ── */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Productivity
          </span>
          <span className="text-xs font-bold text-purple-500">{productivity}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-purple-400 to-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${productivity}%` }}
          />
        </div>
      </div>

      {/* ── NAV ITEMS ── */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path
          return (
            <button
              key={label}
              onClick={() => {
                navigate(path)
                onClose?.()
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group relative
                ${isActive
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-0 transition-colors
                ${isActive
                  ? "bg-white shadow-sm"
                  : "bg-gray-100 group-hover:bg-purple-100"
                }`}>
                <Icon className={`w-4 h-4 ${isActive ? "text-purple-500" : "text-gray-600 group-hover:text-purple-500"}`} />
              </div>
              <span className="text-sm font-semibold">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* ── PRO TIP CARD ── */}
      {/* <div className="mx-4 mb-5 p-4 rounded-2xl bg-purple-50 border border-purple-100">
        <div className="flex items-center gap-2 mb-1.5">
          <Lightbulb className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-gray-700">Pro Tip</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-2">
          Use keyboard shortcuts to boost productivity!
        </p>
        <a
          href="#"
          className="text-xs font-semibold text-purple-500 hover:text-purple-700
            underline underline-offset-2 transition-colors"
        >
          Visit Hexagon Digital Services
        </a>
      </div> */}

    </div>
  )
}

// ── MAIN SIDEBAR ──
const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* DESKTOP SIDEBAR — starts below navbar (pt-16 matches navbar height) */}
      <div className="hidden md:flex flex-col fixed top-16 left-0 z-40
        h-[calc(100vh-64px)] w-20 lg:w-64
        bg-white border-r border-blue-100 shadow-sm overflow-y-auto">
        <SidebarContent user={user} tasks={tasks} />
      </div>

      {/* MOBILE TOGGLE BUTTON — floating, below navbar */}
      <button
        className="fixed md:hidden top-20 left-4 z-50
          bg-linear-to-br from-purple-600 to-indigo-600 text-white
          p-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE DRAWER — starts below navbar */}
      <div className={`fixed top-16 left-0 z-50 md:hidden
        w-72 h-[calc(100vh-64px)]
        bg-white border-r border-blue-100 shadow-2xl
        transition-transform duration-300 ease-in-out overflow-y-auto
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent
          user={user}
          tasks={tasks}
          onClose={() => setMobileOpen(false)}
        />
      </div>
    </>
  )
}

export default Sidebar