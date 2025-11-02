import React, { useState, useEffect } from "react";
import RegisterWebhook from "../components/RegisterWebhook";

function Dashboard() {
  const [apps, setApps] = useState([]);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all apps and usage data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [appsRes, usageRes] = await Promise.all([
        fetch("http://localhost:3001/api/apps"),
        fetch("http://localhost:3001/api/apps/usage"),
      ]);

      if (!appsRes.ok || !usageRes.ok) {
        throw new Error("Failed to fetch data from backend");
      }

      const appsData = await appsRes.json();
      const usageData = await usageRes.json();

      console.log("📦 Apps fetched:", appsData);
      console.log("📊 Usage fetched:", usageData);

      setApps(appsData);
      setUsage(usageData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch once on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Refresh when new app registers
  const handleAppRegistered = () => {
    fetchDashboardData();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Webhook Dashboard</h2>

        {/* =================== REGISTER NEW APP =================== */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Register a New Application
          </h3>
          <RegisterWebhook onAppRegistered={handleAppRegistered} />
        </div>

        {/* =================== REGISTERED APPS =================== */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Registered Applications
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading apps...</p>
          ) : apps.length === 0 ? (
            <p className="text-gray-500">No applications registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apps.map((app) => (
                <div
                  key={app.id || app.app_name}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <p className="text-lg font-semibold text-gray-900">
                    {app.app_name}
                  </p>
                  <p className="text-sm text-gray-700">
                    🔑 API Key:{" "}
                    <span className="font-mono break-all">{app.api_key}</span>
                  </p>
                  <p className="text-sm text-gray-700 break-all">
                    🌐 {app.webhook_url}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    🕒 Registered:{" "}
                    {new Date(app.created_at).toLocaleString() || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =================== APP USAGE ANALYTICS =================== */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            App Usage Analytics
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading usage data...</p>
          ) : usage.length === 0 ? (
            <p className="text-gray-500">
              No usage data yet — your apps haven’t made any calls.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {usage.map((u, index) => (
                <li
                  key={index}
                  className="py-2 flex justify-between text-gray-800"
                >
                  <span className="font-medium">{u.app_name}</span>
                  <span className="text-gray-600">{u.usage_count} requests</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
