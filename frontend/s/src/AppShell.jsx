import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import RecommenderPanel from "./components/RecommenderPanel";
import Dashboard from "./pages/Dashboard";
import { motion } from "framer-motion";
import {
  Activity,
  Layers,
  LogOut,
  Webhook,
  BarChart3,
  CreditCard,
  Settings,
  Home as HomeIcon,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { toast } from "react-toastify";
import { API_BACKEND, API_WEBHOOK, getBackendAuthHeaders } from "./api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    icon: HomeIcon,
    description: "Overview of your workspace",
  },
  {
    id: "recommender",
    label: "Recommender Studio",
    icon: Activity,
    description: "Create projects & train models",
  },
  {
    id: "dashboard",
    label: "Webhook Dashboard",
    icon: Webhook,
    description: "Apps, API keys & webhooks",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Traffic & usage",
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    description: "Plan & consumption",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Workspace configuration",
  },
];

const ShellSection = ({ title, eyebrow, description, children }) => (
  <div className="px-6 py-8 lg:px-10 lg:py-10 bg-linear-160 from-white to-neutral-200">
    <div className="max-w-6xl xl:max-w-7xl mx-auto space-y-8 ">
      <div className="space-y-3">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 font-third">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl lg:text-6xl font-bold text-neutral-950 font-main">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-500 max-w-2xl font-third">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  </div>
);

const StatCard = ({ label, value, hint }) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5  border-b-rose-200 border-b-1  border-t-cyan-200 border-t-1 ">
    <p className="text-sm font-semibold text-slate-800">{label}</p>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
  </div>
);

const StatusRow = ({ label, status = "ok" }) => (
  <div className="flex items-center justify-between text-xs">
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${
          status === "ok" ? "bg-emerald-500" : "bg-amber-400"
        }`}
      />
      <span className="text-slate-700">{label}</span>
    </div>
    <span className="text-slate-500">
      {status === "ok" ? "Operational" : "Degraded"}
    </span>
  </div>
);

const HomeOverview = ({ onNavigate, summary }) => {
  const {
    projects = [],
    apps = [],
    totalRequests = 0,
    readyProjects = 0,
    loading = true,
  } = summary || {};
 const { user } = useAuth(); // Get user from AuthContext
  
  const userName = user?.name || user?.firstName || user?.username || "User";
  // State for service health checks
  const [serviceHealth, setServiceHealth] = useState({
    mlBackend: { status: "checking", latency: null },
    webhook: { status: "checking", latency: null },
    auth: { status: "checking", latency: null },
  });

  // Health check function using existing endpoints
  useEffect(() => {
    const checkServiceHealth = async () => {
      const results = {
        mlBackend: { status: "degraded", latency: null },
        webhook: { status: "degraded", latency: null },
        auth: { status: "degraded", latency: null },
      };

      // Check ML Backend - using /projects/ endpoint
      try {
        const startML = Date.now();
        const backendHeaders = getBackendAuthHeaders();
        const mlRes = await fetch(`${API_BACKEND}/projects/`, {
          method: "GET",
          headers: backendHeaders,
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        const latencyML = Date.now() - startML;
        results.mlBackend = {
          status: mlRes.ok ? "ok" : "degraded",
          latency: `${latencyML}ms`,
        };
      } catch (error) {
        results.mlBackend = { status: "degraded", latency: "offline" };
      }

      // Check Webhook Service - using /api/apps endpoint
      try {
        const startWebhook = Date.now();
        const webhookRes = await fetch(`${API_WEBHOOK}/api/apps`, {
          method: "GET",
          signal: AbortSignal.timeout(5000),
        });
        const latencyWebhook = Date.now() - startWebhook;
        results.webhook = {
          status: webhookRes.ok ? "ok" : "degraded",
          latency: `${latencyWebhook}ms`,
        };
      } catch (error) {
        results.webhook = { status: "degraded", latency: "offline" };
      }

      // Check Auth Service - using a basic endpoint or just mark as ok if we got here
      // Since we're already authenticated, we can assume auth is working
      try {
        const startAuth = Date.now();
        const backendHeaders = getBackendAuthHeaders();
        const authRes = await fetch(`${API_BACKEND}/projects/`, {
          method: "GET",
          headers: backendHeaders,
          signal: AbortSignal.timeout(5000),
        });
        const latencyAuth = Date.now() - startAuth;
        results.auth = {
          status: authRes.ok ? "ok" : "degraded",
          latency: `${latencyAuth}ms`,
        };
      } catch (error) {
        results.auth = { status: "degraded", latency: "offline" };
      }

      setServiceHealth(results);
    };

    checkServiceHealth();

    // Re-check every 30 seconds
    const interval = setInterval(checkServiceHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  // Calculate real metrics from your DB data
  const activeApps = apps.filter(
    (app) => app.status === "active" || !app.status,
  ).length;
  const avgRequestsPerApp =
    apps.length > 0 ? Math.floor(totalRequests / apps.length) : 0;

  const handleProjectClick = (project) => {
    // Store project info in sessionStorage to pass to RecommenderPanel
    sessionStorage.setItem(
      "selectedProject",
      JSON.stringify({
        id: project.id,
        name: project.name,
        status: project.status,
      }),
    );
    // Navigate to recommender tab
    onNavigate("recommender");
  };

  return (
    <ShellSection
      eyebrow="Workspace"
      title="Welcome"
      description="Real-time operational status and performance metrics for your BaaS infrastructure."
    >
      {/* LIVE METRICS FROM DB */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-third ">
        <StatCard
          label="Total Projects"
          value={loading ? "—" : projects.length}
          hint={`${readyProjects} ready to serve`}
        />
        <StatCard
          label="Registered Apps"
          value={loading ? "—" : apps.length}
          hint={`${activeApps} active applications`}
        />
        <StatCard
          label="Total Requests"
          value={loading ? "—" : totalRequests.toLocaleString()}
          hint="All-time API calls"
        />
        <StatCard
          label="Avg per App"
          value={loading ? "—" : avgRequestsPerApp.toLocaleString()}
          hint="Request distribution"
        />
      </div>

      {/* SYSTEM STATUS - NOW DYNAMIC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 font-third ">
        <StatusCard
          name="ML Backend"
          status={serviceHealth.mlBackend.status}
          endpoint={API_BACKEND}
          latency={serviceHealth.mlBackend.latency}
        />
        <StatusCard
          name="Webhook Service"
          status={serviceHealth.webhook.status}
          endpoint={API_WEBHOOK}
          latency={serviceHealth.webhook.latency}
        />
        <StatusCard
          name="Auth Service"
          status={serviceHealth.auth.status}
          endpoint="Auth verified"
          latency={serviceHealth.auth.latency}
        />
      </div>

      {/* MAIN AREA */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mt-6">
        {/* PROJECT STATUS */}
        <div className="relative bg-gradient-to-br from-white via-slate-50 to-cyan-50/30 rounded-3xl border border-slate-200 p-6  transition-all overflow-hidden">
          

          {/* Header */}
          <div className="relative flex items-center justify-between mb-5">
            
            <div className="flex items-center gap-3">
              
              <div className="relative">
                 <div className="w-1 h-5 bg-gradient-to-br from-rose-700 to-cyan-500 rounded-full"></div>
                {/* Pulse effect */}
                {!loading && projects.length > 0 && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-500 to-cyan-600 animate-ping opacity-20"></div>
                )}
              </div>
              <div>
                
                <p className="font-third text-m font-bold text-slate-900 tracking-tight">
                  Project Status
                </p>
                
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-gradient-to-br from-rose-100 to-cyan-100 border border-rose-200/50 rounded-full text-xs font-bold text-slate-700 ">
                {projects.length} total
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-rose-500 animate-spin"></div>
                  <p className="text-sm text-slate-500 font-medium">
                    Loading projects...
                  </p>
                </div>
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-2.5">
                {projects.slice(0, 5).map((project, index) => (
                  <div
                    key={project.id}
                    className="animate-slideIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProjectActivityItem
                      project={project}
                      onClick={() => handleProjectClick(project)}
                    />
                  </div>
                ))}
                {projects.length > 5 && (
                  <button
                    onClick={() => onNavigate("recommender")}
                    className="group w-full mt-4 relative overflow-hidden bg-gradient-to-r from-rose-50 to-cyan-50 hover:from-rose-100 hover:to-cyan-100 border-2 border-dashed border-slate-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-cyan-500/5 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <span className="text-sm font-bold bg-gradient-to-br from-rose-600 to-cyan-600 bg-clip-text text-transparent">
                        View all {projects.length} projects
                      </span>
                      <ArrowRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                
                <p className="text-sm text-slate-500 font-third mb-4">
                  No projects yet
                </p>
                <button
                  onClick={() => onNavigate("recommender")}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-rose-600 to-cyan-600 hover:from-rose-700 hover:to-cyan-700 text-white font-third text-sm rounded-3xl cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] "></div>
                 
                  <span className="relative z-10">
                    Create your first project
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-rose-700 to-cyan-500 rounded-full"></div>
              <p className="text-m font-semibold text-slate-900 ">
                Quick Actions
              </p>
            </div>
           
          </div>

          <div className="grid grid-cols-1 gap-3 font-third">
            <QuickActionCard
              title="Create Project"
              description="Train a new recommender model"
              Icon={Zap}
              onClick={() => onNavigate("recommender")}
              gradient="from-rose-700 to-cyan-600"
              hoverGradient="from-rose-800 to-cyan-900"
            />
            <QuickActionCard
              title="Register App"
              description="Generate API keys & webhook"
              Icon={Webhook}
              onClick={() => onNavigate("dashboard")}
              gradient="from-rose-700 to-cyan-600"
              hoverGradient="from-rose-800 to-cyan-900"
            />
            <QuickActionCard
              title="View Analytics"
              description="Inspect usage and traffic trends"
              Icon={BarChart3}
              onClick={() => onNavigate("analytics")}
              gradient="from-rose-700 to-cyan-600"
              hoverGradient="from-rose-800 to-cyan-900"
            />
          </div>
        </div>
      </div>

      {/* WORKSPACE SUMMARY */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg mt-6">
        <p className="text-sm font-semibold font-third mb-6 text-slate-200">
          Workspace Summary
        </p>
        <div className="grid grid-cols-3 gap-6">
          <SummaryItemPro
            label="Active Projects"
            value={loading ? "—" : projects.length}
            subtitle={`${readyProjects} ready`}
          />
          <SummaryItemPro
            label="Registered Apps"
            value={loading ? "—" : apps.length}
            subtitle={`${activeApps} active`}
          />
          <SummaryItemPro
            label="Total Requests"
            value={loading ? "—" : totalRequests.toLocaleString()}
            subtitle="All-time"
          />
        </div>
      </div>
    </ShellSection>
  );
};

const StatusCard = ({ name, status = "checking", endpoint, latency }) => {
  const statusConfig = {
    ok: {
      badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      dot: "bg-emerald-300",
      text: "Operational",
    },
    degraded: {
      badge: "bg-amber-100 text-amber-700 border border-amber-200",
      dot: "bg-amber-300",
      text: "Degraded",
    },
    checking: {
      badge: "bg-slate-100 text-slate-700 border border-slate-200",
      dot: "bg-slate-300 animate-pulse",
      text: "Checking...",
    },
  };

  const config = statusConfig[status] || statusConfig.checking;

  return (
    <div className="bg-white rounded-lg border-b-rose-200 border-b-1  border-t-cyan-200 border-t-1 border-slate-100 p-5 ">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-900">{name}</span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.badge}`}
        >
          {config.text}
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2 truncate flex-1">
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          <span className="truncate">{endpoint}</span>
        </div>
        {latency && status !== "checking" && (
          <span
            className={`ml-2 font-semibold whitespace-nowrap ${
              status === "ok" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {latency}
          </span>
        )}
      </div>
    </div>
  );
};

const ProjectActivityItem = ({ project, onClick }) => {
  const statusConfig = {
    ready: {
      color: "from-emerald-500 to-emerald-600",
      text: "Ready",
      bgClass: "bg-emerald-50 text-emerald-700 ",
      icon: "✓",
    },
    training: {
      color: "from-blue-500 to-blue-600",
      text: "Training",
      bgClass: "bg-blue-50 text-blue-700 ",
      icon: "↻",
    },
    failed: {
      color: "from-red-500 to-red-600",
      text: "Failed",
      bgClass: "bg-red-50 text-red-700 ",
      icon: "✕",
    },
    pending: {
      color: "from-amber-900 to-rose-200",
      text: "Pending",
      bgClass: "bg-rose-50 text-amber-900 ",
      icon: "⋯",
    },
  };

  const config = statusConfig[project.status] || statusConfig.pending;

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden bg-white hover:bg-gradient-to-r hover:from-rose-50/50 hover:to-cyan-50/50 border-1 border-slate-200  rounded-3xl p-4 transition-all cursor-pointer hover:shadow-sm "
    >
      

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

      <div className="relative flex items-center gap-3">
        {/* Status indicator with icon */}
        <div className="relative flex-shrink-0">
        
          {project.status === "training" && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan -500 to-blue-600 animate-ping opacity-30"></div>
          )}
        </div>

        {/* Project info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 font-third">
            <h4 className="text-sm font-bold text-slate-900   truncate">
              {project.name || project.project_name || "Unnamed Project"}
            </h4>
            <ArrowRight className="w-3.5 h-3.5 text-slate-800 flex-shrink-0" />
          </div>
          <p className="text-xs text-slate-500 font-mono">
            ID: {project.id || project.project_id || "N/A"}
          </p>
        </div>

        {/* Status badge */}
        <div
          className={`px-3 py-1.5 font-third text-xs font-bold `}
        >
          {config.text}
        </div>
      </div>
    </div>
  );
};

const SummaryItemPro = ({ label, value, subtitle }) => (
  <div className="text-center">
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-xs text-slate-400 mb-2">{label}</p>
    <span className="text-[10px] text-slate-500">{subtitle}</span>
  </div>
);

const QuickActionCard = ({
  title,
  description,
  Icon,
  onClick,
  gradient = "from-cyan-500 to-rose-600",
  hoverGradient = "from-indigo-600 to-indigo-700",
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden bg-white border-2 border-slate-200 rounded-3xl hover:border-transparent transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
    >
      {/* Animated background gradient on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Content */}
      <div className="relative flex items-center gap-4 p-4">
        {/* Icon container with animation */}
        <div
          className={`relative p-3 bg-gradient-to-br ${gradient} rounded-3xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0`}
        >
          <Icon className="w-5 h-5 text-white rounded-xl relative z-10" />
          {/* Pulse ring effect */}
          <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-white transition-colors duration-300 truncate">
              {title}
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
          </div>
          <p className="text-xs text-slate-600 group-hover:text-white/90 transition-colors duration-300 line-clamp-1">
            {description}
          </p>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/0 to-white/5 transform rotate-45 translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
    </div>
  );
};

const AnalyticsView = ({ summary }) => {
  const {
    usage = [],
    totalRequests = 0,
    apps = [],
    loading = true,
  } = summary || {};

  console.log("Analytics Debug:", { usage, totalRequests, apps, loading }); // Debug log

  // Calculate real metrics from DB
  const topApp =
    usage.length > 0
      ? usage.reduce(
          (max, app) =>
            (app.usage_count || 0) > (max.usage_count || 0) ? app : max,
          usage[0],
        )
      : null;

  const avgRequestsPerApp =
    apps.length > 0 ? Math.floor(totalRequests / apps.length) : 0;

  return (
    <ShellSection
      eyebrow="Analytics"
      title="Usage Analytics"
      description="Traffic trends, application performance, and infrastructure insights from your database."
    >
      {/* KEY METRICS FROM DB */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Requests"
          value={loading ? "—" : totalRequests.toLocaleString()}
          change="All-time webhook calls"
        />
        <MetricCard
          label="Registered Apps"
          value={loading ? "—" : apps.length}
          change={`${usage.length} with usage data`}
        />
        <MetricCard
          label="Avg per App"
          value={loading ? "—" : avgRequestsPerApp.toLocaleString()}
          change="Request distribution"
        />
        <MetricCard
          label="Top Performer"
          value={
            loading
              ? "—"
              : topApp
                ? topApp.app_name?.substring(0, 12) +
                  (topApp.app_name?.length > 12 ? "..." : "")
                : "N/A"
          }
          change={
            topApp
              ? `${(topApp.usage_count || 0).toLocaleString()} requests`
              : "No data"
          }
        />
      </div>

      {/* USAGE VISUALIZATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Request Distribution by App
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on webhooks.usage table
            </p>
          </div>
          <div className="text-xs text-slate-500">
            {totalRequests.toLocaleString()} total
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Loading usage data...
          </div>
        ) : usage.length > 0 ? (
          <div className="flex items-end justify-between gap-3 h-56">
            {usage.map((app, i) => {
              const maxUsage = Math.max(
                ...usage.map((u) => u.usage_count || 0),
              );
              const height =
                maxUsage > 0 ? ((app.usage_count || 0) / maxUsage) * 100 : 5;
              const percent =
                totalRequests > 0
                  ? Math.round(((app.usage_count || 0) / totalRequests) * 100)
                  : 0;

              return (
                <div
                  key={app.app_name || i}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full relative group">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 via-teal-500 to-green-400 transition-all duration-300 hover:from-emerald-700 hover:via-teal-600 cursor-pointer shadow-sm"
                      style={{ height: `${height}%`, minHeight: "20px" }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap">
                        <p className="font-semibold">
                          {(app.usage_count || 0).toLocaleString()} requests
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          {app.app_name}
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          {percent}% of total
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center w-full">
                    <p
                      className="text-[10px] font-semibold text-slate-900 truncate px-1"
                      title={app.app_name}
                    >
                      {app.app_name && app.app_name.length > 8
                        ? app.app_name.substring(0, 8) + "..."
                        : app.app_name || "N/A"}
                    </p>
                    <p className="text-[9px] font-semibold text-emerald-600">
                      {percent}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-slate-400 mb-3">
              No usage data available
            </p>
            <p className="text-xs text-slate-500">
              Register apps and start making requests to see analytics
            </p>
          </div>
        )}
      </div>

      {/* LOWER SECTION */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* DISTRIBUTION TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Traffic Distribution</p>
            <span className="text-xs text-slate-500">By application</span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Loading...
            </div>
          ) : usage.length > 0 ? (
            <div className="space-y-4">
              {usage.map((u) => {
                const percent =
                  totalRequests > 0
                    ? Math.round(((u.usage_count || 0) / totalRequests) * 100)
                    : 0;

                return (
                  <div key={u.app_name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-900 truncate pr-2">
                        {u.app_name}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-slate-500">
                          {(u.usage_count || 0).toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {percent}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No usage data available
            </div>
          )}
        </div>

        {/* TOP APPS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Top Applications</p>
            <span className="text-xs text-slate-500">By request volume</span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Loading...
            </div>
          ) : usage.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="text-left pb-3 font-semibold text-slate-500">
                      Rank
                    </th>
                    <th className="text-left pb-3 font-semibold text-slate-500">
                      Application
                    </th>
                    <th className="text-right pb-3 font-semibold text-slate-500">
                      Requests
                    </th>
                    <th className="text-right pb-3 font-semibold text-slate-500">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usage
                    .slice()
                    .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
                    .map((u, idx) => {
                      const percent =
                        totalRequests > 0
                          ? Math.round(
                              ((u.usage_count || 0) / totalRequests) * 100,
                            )
                          : 0;
                      return (
                        <tr
                          key={u.app_name || idx}
                          className="border-b border-slate-100 hover:bg-emerald-50 transition-colors"
                        >
                          <td className="py-3">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                              {idx + 1}
                            </span>
                          </td>
                          <td
                            className="py-3 font-semibold text-slate-900 truncate max-w-[150px]"
                            title={u.app_name}
                          >
                            {u.app_name}
                          </td>
                          <td className="text-right font-semibold text-slate-900">
                            {(u.usage_count || 0).toLocaleString()}
                          </td>
                          <td className="text-right">
                            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                              {percent}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No usage data available
            </div>
          )}
        </div>
      </div>
    </ShellSection>
  );
};

const MetricCard = ({ label, value, change }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
    <p className="text-[11px] text-slate-500">{change}</p>
  </div>
);

const Card = ({ label, value }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-2xl font-bold mt-1">
      {value?.toLocaleString?.() ?? value}
    </p>
  </div>
);

const BillingView = ({ summary }) => {
  const { totalRequests, loading } = summary;
  const pricePerThousand = 1.0;
  const estimatedCost = loading
    ? null
    : ((totalRequests / 1000) * pricePerThousand).toFixed(2);

  return (
    <ShellSection
      eyebrow="Billing"
      title="Billing & usage"
      description="Track how your workspace consumes recommendation capacity and manage your plan."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 lg:gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Current plan
                </p>
                <p className="text-lg font-bold text-slate-900">Developer</p>
              </div>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:border-cyan-400 hover:text-slate-900 bg-white transition-all">
                <CreditCard className="w-3 h-3" />
                <span>Manage plan</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Ideal for prototyping and small workloads. Includes generous free
              quota and access to all core features of Recommender Studio and
              Webhook Dashboard.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 text-xs">
            <p className="text-xs font-semibold text-slate-500">
              Current usage (from webhooks.usage)
            </p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-700">Recommendation requests</span>
                <span className="font-semibold text-slate-900">
                  {loading ? "—" : totalRequests.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-1/2" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Request counts are taken directly from the `webhooks.usage` table.
              You can later plug in per-project quotas and limits.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3 text-xs">
            <p className="text-xs font-semibold text-slate-500">
              Estimated invoice (based on current usage)
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Current cycle
                </p>
                <p className="text-[11px] text-slate-500">
                  Calculated at ${pricePerThousand.toFixed(2)} per 1k requests
                </p>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {loading || estimatedCost === null ? "—" : `$${estimatedCost}`}
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              Connect this card to your real billing system to show invoice
              status, payment method, and downloadable PDFs while still using
              live usage figures from your database.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-50 rounded-2xl border border-slate-800 p-5 space-y-2">
            <p className="text-xs font-semibold text-slate-400">
              Invoices & exports
            </p>
            <p className="text-sm font-semibold">
              Export billing history for finance and analytics
            </p>
            <p className="text-[11px] text-slate-400">
              Attach your own backend endpoint here to stream invoices, payment
              methods, and CSV exports while keeping the minimal layout.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-xs space-y-2">
            <p className="text-xs font-semibold text-slate-500">
              Cost controls
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Set soft limits on monthly recommendation volume.</li>
              <li>Alert on sudden spikes per project or per API key.</li>
              <li>Route high-volume tenants to dedicated backends.</li>
            </ul>
          </div>
        </div>
      </div>
    </ShellSection>
  );
};

const SettingsView = () => (
  <ShellSection
    eyebrow="Settings"
    title="Workspace settings"
    description="Configure how your AiREC workspace connects to auth, the ML backend, and external clients."
  >
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 text-xs">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500">
            Workspace profile
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Workspace name
              </label>
              <input
                type="text"
                value="Personal workspace"
                readOnly
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Environment
              </label>
              <input
                type="text"
                value="Development"
                readOnly
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-800"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Later, you can make these fields editable and persist them in your
            auth service or a dedicated workspace table.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500">API endpoints</p>
          <div className="space-y-2">
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Auth service</p>
              <code className="block rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-[11px] text-slate-800 break-all">
                http://localhost:8080
              </code>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 mb-1">
                ML recommender (FastAPI)
              </p>
              <code className="block rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-[11px] text-slate-800 break-all">
                http://localhost:8000
              </code>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Webhook service</p>
              <code className="block rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-[11px] text-slate-800 break-all">
                http://localhost:3001
              </code>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            These URLs are currently configured via environment variables in the
            backend and the Vite frontend. You can adapt this section later to
            surface workspace-level configuration.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-500">API tokens</p>
          <p className="text-[11px] text-slate-600">
            Use personal API tokens for CLI access or automation. Webhook apps
            will still use their own scoped API keys.
          </p>
          <code className="block rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-[11px] text-slate-800 break-all">
            airec_live_••••••••••••••••••••
          </code>
          <div className="flex gap-2">
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-cyan-400 hover:text-slate-900 transition-all">
              Copy token
            </button>
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-50 hover:bg-slate-800 transition-all">
              Generate new
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Wire these actions up to your backend to issue and revoke personal
            access tokens.
          </p>
        </div>
        <div className="bg-slate-900 text-slate-50 rounded-2xl border border-slate-800 p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-400">
            Theme & appearance
          </p>
          <p className="text-sm font-semibold">
            The dashboard uses a neutral/cyan palette by default.
          </p>
          <p className="text-[11px] text-slate-400">
            Hook this card up to user preferences to support per-user themes,
            light/dark modes, or custom accent colors without changing the
            underlying layout.
          </p>
        </div>
      </div>
    </div>
  </ShellSection>
);

function useDashboardSummary() {
  const [state, setState] = useState({
    projects: [],
    apps: [],
    usage: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const backendHeaders = getBackendAuthHeaders();
        const [projectsRes, appsRes, usageRes] = await Promise.all([
          fetch(`${API_BACKEND}/projects/`, { headers: backendHeaders }).catch(
            () => null,
          ),
          fetch(`${API_WEBHOOK}/api/apps`).catch(() => null),
          fetch(`${API_WEBHOOK}/api/apps/usage`).catch(() => null),
        ]);

        const safeJson = async (res, fallback) => {
          if (!res || !res.ok) return fallback;
          try {
            const data = await res.json();
            return Array.isArray(data) ? data : fallback;
          } catch {
            return fallback;
          }
        };

        const projects = await safeJson(projectsRes, []);
        const apps = await safeJson(appsRes, []);
        const usage = await safeJson(usageRes, []);

        if (cancelled) return;

        setState({
          projects,
          apps,
          usage,
          loading: false,
        });
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totals = useMemo(() => {
    const totalRequests = state.usage.reduce(
      (acc, curr) =>
        acc + (typeof curr.usage_count === "number" ? curr.usage_count : 0),
      0,
    );
    const readyProjects = state.projects.filter(
      (p) => p.status === "ready",
    ).length;

    return {
      totalRequests,
      readyProjects,
      projectsCount: state.projects.length,
      appsCount: state.apps.length,
    };
  }, [state.projects, state.usage, state.apps]);

  return { ...state, ...totals };
}

export default function AppShell() {
  const [activeTab, setActiveTab] = useState("home");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const summary = useDashboardSummary();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/login", { replace: true });
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeOverview onNavigate={setActiveTab} summary={summary} />;
      case "recommender":
        return <RecommenderPanel />;
      case "dashboard":
        return <Dashboard />;
      case "analytics":
        return <AnalyticsView summary={summary} />;
      case "billing":
        return <BillingView summary={summary} />;
      case "settings":
        return <SettingsView />;
      default:
        return <HomeOverview onNavigate={setActiveTab} summary={summary} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-800 via-slate-100 to-neutral-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 bg-white border-r  rounded-r-3xl border-gray-200 flex flex-col shadow-sm h-screen transition-all duration-300 z-50 ${
            isSidebarOpen ? "w-[280px]" : "w-[72px]"
          }`}
          onMouseEnter={() => !isSidebarOpen && setIsSidebarOpen(true)}
          onMouseLeave={() => isSidebarOpen && setIsSidebarOpen(false)}
        >
          {/* <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style> */}

          <div className="h-full flex flex-col">
            {/* Brand Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-900 to-cyan-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                {isSidebarOpen && (
                  <h1 className="text-xl font-bold font-main text-gray-900 whitespace-nowrap cursor-pointer">
                    BaaS Studio
                  </h1>
                )}
              </div>
            </div>

            {/* Navigation - Scrollable */}
            <nav className="flex-1 overflow-y-auto py-5 px-4 scrollbar-hide">
              <div className="space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      
                      className="group w-full flex items-center gap-3 px-3 py-4 rounded-3xl transition-all duration-200 hover:shadow-rose-100 hover:shadow-sm cursor-pointer "
                      title={!isSidebarOpen ? item.label : ""}
                    >
                      <span
                        className={`inline-flex items-center justify-center rounded-3xl w-9 h-9 flex-shrink-0 transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-br from-rose-900 to-cyan-200 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 group-hover:bg-gradient-to-br group-hover:from-rose-800 group-hover:to-cyan-200 group-hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </span>

                      {isSidebarOpen && (
                        <div className="flex-1 min-w-0 text-left">
                          
                          <p
                            className={`text-sm font-semibold font-third truncate transition-colors duration-200 ${
                              isActive
                                ? "text-gray-900"
                                : "text-gray-600 group-hover:text-gray-900"
                            }`}
                          >
                            {item.label}
                          </p>
                          <p className="text-[11px] font-sec text-gray-500 truncate">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Footer / Sign out - Sticky at bottom */}
            <div className="px-4 py-4 border-t border-gray-200 bg-red-50/30 flex-shrink-0">
              <button
                onClick={handleLogout}
                className="group w-full px-3 py-3 rounded-xl text-sm font-medium flex items-center transition-all hover:bg-red-50 border border-transparent hover:border-red-200"
                title="Sign out"
              >
                <span className="flex items-center gap-3 w-full">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-100 group-hover:bg-red-500 flex-shrink-0 transition-all duration-200">
                    <LogOut className="w-5 h-5 text-rose-800 group-hover:text-white transition-colors duration-200" />
                  </span>
                  {isSidebarOpen && (
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold font-third text-rose-600 group-hover:text-red-700">
                        Sign out
                      </span>
                      
                    </div>
                  )}
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gradient-to-br from-neutral-50 via-slate-50 to-neutral-100 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
