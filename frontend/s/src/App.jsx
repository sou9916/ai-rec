import React, { useState } from 'react';
import RecommenderPanel from './components/RecommenderPanel';
import Dashboard from './pages/Dashboard';
import { Activity, Layers } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState("recommender");

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-slate-100 to-neutral-100">
      {/* nkn Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-lg backdrop-blur-lg bg-opacity-90 rounded-b-4xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* branduuu */}
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

            {/* Tab Navigation */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-3xl">
              <button
                className={`px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center  space-x-2 ${
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
          </div>
        </div>
      </nav>

      {/* Tab Content with Transition */}
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

export default App;