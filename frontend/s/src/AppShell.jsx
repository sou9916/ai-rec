import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecommenderPanel from "./components/RecommenderPanel";
import Dashboard from "./pages/Dashboard";
import { Activity, Layers, LogOut } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { toast } from "react-toastify";

export default function AppShell() {
  const [activeTab, setActiveTab] = useState("recommender");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-slate-100 to-neutral-100">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-lg backdrop-blur-lg bg-opacity-90 rounded-b-4xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-950 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-neutral-800 to-cyan-600 bg-clip-text text-transparent">
                  Recom BaaS
                </h1>
                <p className="text-xs text-gray-800 font-medium">by <b>AiREC</b> </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-3xl">
                <button
                  className={`px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === "recommender"
                      ? "bg-white text-cyan-600 shadow-md"
                      : "text-gray-600 cursor-pointer hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("recommender")}
                >
                  <Activity className="w-4 h-4" />
                  <span>Recommender Studio</span>
                </button>
                <button
                  className={`px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === "dashboard"
                      ? "bg-white text-cyan-600 shadow-md"
                      : "text-gray-600 cursor-pointer hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Layers className="w-4 h-4" />
                  <span>Webhook Dashboard</span>
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-gray-600 hover:text-cyan-600 hover:bg-slate-100 transition-all flex items-center gap-2"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="transition-all duration-300 ease-in-out">
        {activeTab === "recommender" ? (
          <RecommenderPanel />
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
}
