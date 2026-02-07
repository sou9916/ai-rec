import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Key, 
  Clock, 
  TrendingUp, 
  Webhook, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Activity,
  Zap,
  Server,
  BarChart3,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { API_WEBHOOK } from "../api";

const API_URL = `${API_WEBHOOK}/api`;

const Card = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden  transition-all duration-500 ${className}`}
  >
    {children}
  </motion.div>
);

const Input = (props) => (
  <motion.input
    whileFocus={{ scale: 1.0 }}
    {...props}
    className="w-full px-4 py-3 border-1 border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:border-cyan-200 transition-all duration-300 bg-white text-sm font-third "
  />
);

const Button = ({ children, variant = "primary", icon: Icon, loading, ...props }) => {
  const variants = {
    primary: "bg-gradient-to-br from-rose-800 via-rose-800 to-cyan-600 hover:from-rose-700 hover:via-rose-600 hover:to-cyan-700 text-white shadow-lg cursor-pointer ",
    secondary: "bg-white border-2 border-slate-200 hover:border-cyan-400 text-slate-700 hover:text-slate-900 shadow-sm hover:shadow-md"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.0, y: 0 }}
      whileTap={{ scale: 0.98 }}
      {...props}
      disabled={loading || props.disabled}
      className={`w-full px-6 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-third relative overflow-hidden ${variants[variant]}`}
    >
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      )}
      {loading ? (
        <motion.div
          animate={{ rotate: 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Activity className="w-5 h-5" />
        </motion.div>
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

function RegisterWebhook({ onAppRegistered }) {
  const [appName, setAppName] = useState("");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 font-third">
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
          <label className="block text-sm font-bold text-gray-700 mb-2 font-third">
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
        icon={loading ? Activity : Plus}
      >
        {loading ? "Registering..." : "Register Application"}
      </Button>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-5 rounded-2xl border-2 flex items-start space-x-3 ${
              messageType === "success" 
                ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-800"
                : messageType === "error"
                ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800"
                : "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800"
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {messageType === "success" ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
            </motion.div>
            <div className="flex-1">
              <p className="font-bold font-third">{message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {apiKey && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative p-6 bg-gradient-to-br from-neutral-50 via-neutral-50 to-rose-50 rounded-2xl border-1 border-cyan-200 overflow-hidden"
          >
            
            
            <div className="relative">
              <div className="flex items-center space-x-2 mb-3">
                
                  <Key className="w-5 h-5 text-rose-600" />
                
                <p className="font-bold text-gray-900 font-third">Your API Key</p>
              </div>
              <div className="relative">
                <code className="block text-sm text-cyan-700 font-mono break-all bg-white p-4 rounded-xl border-2 border-cyan-200 pr-14">
                  {apiKey}
                </code>
                <motion.button
                  whileHover={{ scale: 1.0 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-cyan-100 hover:bg-cyan-200 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckCheck className="w-4 h-4 text-cyan-700" />
                  ) : (
                    <Copy className="w-4 h-4 text-cyan-700" />
                  )}
                </motion.button>
              </div>
              <p className="text-xs text-gray-600 mt-3 italic font-third flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                Save this key securely. You won't be able to see it again.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Dashboard() {
  const [apps, setApps] = useState([]);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [copiedKeys, setCopiedKeys] = useState({});

  const totalUsage = usage.reduce(
    (acc, curr) => acc + (typeof curr.usage_count === "number" ? curr.usage_count : 0),
    0
  );

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

  const copyApiKey = (appId, apiKey) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKeys({ ...copiedKeys, [appId]: true });
    setTimeout(() => {
      setCopiedKeys({ ...copiedKeys, [appId]: false });
    }, 2000);
  };

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 min-h-full bg-gradient-to-br from-neutral-50 via-white to-slate-50">
      <div className="max-w-6xl xl:max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 font-third flex items-center gap-2">
            <span className="w-8 h-[2px] bg-gradient-to-r from-rose-400 to-transparent"></span>
            Webhook Dashboard
          </p>
          <h1 className="text-3xl lg:text-6xl font-bold text-neutral-900 font-main tracking-tight">
            Application Integrations
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl font-third leading-relaxed">
            Manage your webhook applications, API keys, and monitor real-time usage analytics.
          </p>
        </motion.div>

        <AnimatePresence>
          {fetchError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 text-amber-800 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-semibold font-third">{fetchError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.0, y: 0 }}
            className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300"
          >
            <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-rose-400 via-cyan-100 to-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-cyan-400 via-cyan-100 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-600 font-third">Registered Apps</p>
                <Server className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-3xl font-bold text-slate-900 font-main">{apps.length}</p>
              <p className="text-xs text-slate-500 mt-2 font-third flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                Active integrations
              </p>
            </div>
            
            
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.0, y: 0 }}
            className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300"
          >
            <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-rose-400 via-cyan-100 to-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-cyan-400 via-cyan-100 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-600 font-third">Apps with Usage</p>
                <BarChart3 className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 font-main">{usage.length}</p>
              <p className="text-xs text-slate-500 mt-2 font-third flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                With activity
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-rose-400 via-cyan-100 to-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-cyan-400 via-cyan-100 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
            
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.00, y: 0 }}
            className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
          >
           
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-600 font-third">Total Requests</p>
                <TrendingUp className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 font-main">
                {loading ? "—" : totalUsage.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-2 font-third flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                Sample data
              </p>
            </div>
            
           <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-rose-400 via-cyan-100 to-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-cyan-400 via-cyan-100 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
          </motion.div>
        </motion.div>

        {/* Register New App */}
        <Card>
          <div className="relative overflow-hidden">
            
            
            <div className="relative p-8">
              <div className="flex items-center space-x-4 mb-8">
               
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-main">
                    Register New Application
                  </h2>
                  <p className="text-sm text-gray-600 font-third">
                    Connect your application to receive webhooks
                  </p>
                </div>
              </div>
              <RegisterWebhook onAppRegistered={handleAppRegistered} />
            </div>
          </div>
        </Card>

        {/* Registered Apps */}
        <Card>
          <div className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl"></div>
            
            <div className="relative p-8">
              <div className="flex items-center space-x-4 mb-8">
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-main">
                    Registered Applications
                  </h2>
                  <p className="text-sm text-gray-600 font-third">
                    Your connected applications
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="text-center p-16">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Activity className="w-16 h-16 text-cyan-600 mx-auto mb-5" />
                  </motion.div>
                  <p className="text-gray-500 font-semibold font-third text-lg">
                    Loading applications...
                  </p>
                </div>
              ) : apps.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-16 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50 rounded-2xl border-2 border-dashed border-gray-300"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-gray-600 font-semibold font-third text-lg">
                    No applications registered yet
                  </p>
                  <p className="text-sm text-gray-500 mt-2 font-third">
                    Register your first application above
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {apps.map((app, index) => (
                      <motion.div
                        key={app.id || app.app_name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.0, y: 0 }}
                        className="relative p-6 border-2 border-slate-200 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white transition-all duration-300 overflow-hidden"
                      >
                        
                        
                        <div className="relative">
                          <div className="flex items-start justify-between mb-5">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 mb-2 font-main">
                                {app.app_name}
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                                <Globe className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                                <span className="break-all font-third">{app.webhook_url}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="relative p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-cyan-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <Key className="w-4 h-4 text-rose-600" />
                                <span className="text-xs font-bold text-gray-900 font-third">API Key</span>
                              </div>
                              <div className="relative">
                                <code className="text-xs font-mono text-cyan-900 break-all block pr-10">
                                  {app.api_key}
                                </code>
                                <motion.button
                                  whileHover={{ scale: 1.0 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => copyApiKey(app.id || app.app_name, app.api_key)}
                                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5  transition-colors cursor-pointer"
                                  title="Copy API key"
                                >
                                  {copiedKeys[app.id || app.app_name] ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-cyan-700" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-cyan-700" />
                                  )}
                                </motion.button>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-xs text-gray-500 font-third">
                              <Clock className="w-4 h-4" />
                              <span>
                                Registered: {new Date(app.created_at).toLocaleString() || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Usage Analytics */}
        <Card>
          <div className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
            
            <div className="relative p-8">
              <div className="flex items-center space-x-4 mb-8">
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-main">
                    Usage Analytics
                  </h2>
                  <p className="text-sm text-gray-600 font-third">
                    Track your application activity
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="text-center p-16">
                 
                  <p className="text-gray-500 font-semibold font-third text-lg">
                    Loading usage data...
                  </p>
                </div>
              ) : usage.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-16 bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 rounded-2xl border-2 border-dashed border-gray-300"
                >
                  
                  <p className="text-gray-600 font-semibold font-third text-lg">
                    No usage data yet
                  </p>
                  <p className="text-sm text-gray-500 mt-2 font-third">
                    Your apps haven't made any requests
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {usage.map((u, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.0, x: 0 }}
                        className="p-6 border-2 border-slate-200 rounded-3xl  transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                           
                            <div>
                              <p className="font-bold text-gray-900 font-main text-lg">
                                {u.app_name}
                              </p>
                              <p className="text-xs text-gray-500 font-third">
                                Application Activity
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <motion.p
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", duration: 0.6 }}
                              className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-rose-600 bg-clip-text text-transparent font-main"
                            >
                              {u.usage_count.toLocaleString()}
                            </motion.p>
                            <p className="text-xs text-gray-500 font-semibold font-third">
                              requests
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;