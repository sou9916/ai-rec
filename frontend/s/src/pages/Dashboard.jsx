import React, { useState, useEffect } from "react";
import { Globe, Key, Clock, TrendingUp, Webhook, Plus, AlertCircle, CheckCircle2, Activity } from 'lucide-react';
import { API_WEBHOOK } from "../api";

const API_URL = `${API_WEBHOOK}/api`;

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-4xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
  />
);

const Button = ({ children, variant = "primary", icon: Icon, loading, ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-600 via-cyan-800 to-cyan-600 hover:from-cyan-800 hover:via-cyan-600 hover:to-cyan-800 text-white shadow-lg shadow-blue-500/30 cursor-pointer",
    secondary: "bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-600 cursor-pointer"
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full px-6 py-3.5 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${variants[variant]}`}
    >
      {loading ? (
        <Activity className="w-5 h-5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

function RegisterWebhook({ onAppRegistered }) {
  const [appName, setAppName] = useState("");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!appName || !url) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      return;
    }

    setMessage("");
    setApiKey("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/apps/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_name: appName, webhook_url: url }),
      });

      if (!res.ok) throw new Error("Failed to register app");
      const data = await res.json();

      if (data.api_key) {
        setApiKey(data.api_key);
        setMessage("App registered successfully!");
        setMessageType("success");
        if (onAppRegistered) onAppRegistered();
        setAppName("");
        setUrl("");
      } else {
        setMessage("Registered, but API key not returned.");
        setMessageType("warning");
      }
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Application Name
          </label>
          <Input
            type="text"
            placeholder="My Awesome App"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Webhook URL
          </label>
          <Input
            type="url"
            placeholder="https://example.com/webhook"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        loading={loading}
        icon={Plus}
      >
        {loading ? "Registering..." : "Register Application"}
      </Button>

      {message && (
        <div className={`p-4 rounded-xl border-2 flex items-start space-x-3 ${
          messageType === "success" 
            ? "bg-green-50 border-green-200 text-green-800"
            : messageType === "error"
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-yellow-50 border-yellow-200 text-yellow-800"
        }`}>
          {messageType === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{message}</p>
          </div>
        </div>
      )}

      {apiKey && (
        <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Key className="w-5 h-5 text-rose-900" />
            <p className="font-bold text-gray-900">Your API Key</p>
          </div>
          <code className="block text-sm text-cyan-700 font-mono break-all bg-white p-3 rounded-lg border border-blue-200">
            {apiKey}
          </code>
          <p className="text-xs text-gray-600 mt-2 italic">
            Save this key securely. You won't be able to see it again.
          </p>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [apps, setApps] = useState([]);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchDashboardData = async () => {
    setFetchError(null);
    setLoading(true);
    try {
      const [appsRes, usageRes] = await Promise.all([
        fetch(`${API_URL}/apps`),
        fetch(`${API_URL}/apps/usage`),
      ]);

      let appsData = [];
      let usageData = [];

      if (appsRes.ok) {
        try {
          appsData = await appsRes.json();
          if (!Array.isArray(appsData)) appsData = [];
        } catch {
          appsData = [];
        }
      }

      if (usageRes.ok) {
        try {
          usageData = await usageRes.json();
          if (!Array.isArray(usageData)) usageData = [];
        } catch {
          usageData = [];
        }
      }

      setApps(appsData);
      setUsage(usageData);

      if (!appsRes.ok || !usageRes.ok) {
        setFetchError("Could not load apps or usage. Is the webhook service running on port 3001?");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setApps([]);
      setUsage([]);
      setFetchError("Network error. Is the webhook service running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAppRegistered = () => {
    fetchDashboardData();
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {fetchError && (
          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-800 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{fetchError}</p>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-red-900 to-cyan-600 rounded-4xl flex items-center justify-center shadow-lg">
            <Webhook className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Webhook Dashboard</h2>
            <p className="text-gray-600">Manage your application integrations</p>
          </div>
        </div>

        {/* Register New App */}
        <Card>
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-900 to-cyan-600 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Register New Application
                </h3>
                <p className="text-sm text-gray-600">Connect your application to receive webhooks</p>
              </div>
            </div>
            <RegisterWebhook onAppRegistered={handleAppRegistered} />
          </div>
        </Card>

        {/* Registered Apps */}
        <Card>
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-900 via-lime-800 to-cyan-900 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Registered Applications
                </h3>
                <p className="text-sm text-gray-600">Your connected applications</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center p-12">
                <Activity className="w-12 h-12 text-cyan-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 font-medium">Loading applications...</p>
              </div>
            ) : apps.length === 0 ? (
              <div className="text-center p-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No applications registered yet</p>
                <p className="text-sm text-gray-500 mt-1">Register your first application above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {apps.map((app) => (
                  <div
                    key={app.id || app.app_name}
                    className="p-6 border-2 border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          {app.app_name}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <Globe className="w-4 h-4" />
                          <span className="break-all">{app.webhook_url}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <Key className="w-4 h-4 text-cyan-600" />
                          <span className="text-xs font-bold text-gray-700">API Key</span>
                        </div>
                        <code className="text-xs font-mono text-rose-900 break-all">
                          {app.api_key}
                        </code>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>
                          Registered: {new Date(app.created_at).toLocaleString() || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Usage Analytics */}
        <Card>
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-900 to-cyan-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Usage Analytics
                </h3>
                <p className="text-sm text-gray-600">Track your application activity</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center p-12">
                <Activity className="w-12 h-12 text-cyan-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 font-medium">Loading usage data...</p>
              </div>
            ) : usage.length === 0 ? (
              <div className="text-center p-12 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border-2 border-dashed border-gray-300">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  No usage data yet
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Your apps haven't made any requests
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {usage.map((u, index) => (
                  <div
                    key={index}
                    className="p-5 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-white to-purple-50 hover:border-purple-300 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-900 via-pink-900 to-cyan-600 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.app_name}</p>
                          <p className="text-xs text-gray-500">Application Activity</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-rose-900 bg-clip-text text-transparent">
                          {u.usage_count}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">requests</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;