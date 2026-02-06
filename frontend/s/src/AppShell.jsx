import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import RecommenderPanel from "./components/RecommenderPanel";
import Dashboard from "./pages/Dashboard";
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
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { toast } from "react-toastify";
import { API_BACKEND, API_WEBHOOK, getBackendAuthHeaders } from "./api";
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  <div className="px-6 py-8 lg:px-10 lg:py-10 ">
    <div className="max-w-6xl xl:max-w-7xl mx-auto space-y-8">
      <div className="space-y-2 font-third">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-400 ">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl lg:text-6xl font-bold text-stone-950 font-third tracking-wide">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-600 max-w-2xl font-sec">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  </div>
);

const StatCard = ({ label, value, hint }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
    <p className="text-xs font-semibold text-slate-500">{label}</p>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    {hint && (
      <p className="text-[11px] text-slate-500 mt-1">{hint}</p>
    )}
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

  // State for service health checks
  const [serviceHealth, setServiceHealth] = useState({
    mlBackend: { status: 'checking', latency: null },
    webhook: { status: 'checking', latency: null },
    auth: { status: 'checking', latency: null },
  });

  // Health check function using existing endpoints
  useEffect(() => {
    const checkServiceHealth = async () => {
      const results = {
        mlBackend: { status: 'degraded', latency: null },
        webhook: { status: 'degraded', latency: null },
        auth: { status: 'degraded', latency: null },
      };

      // Check ML Backend - using /projects/ endpoint
      try {
        const startML = Date.now();
        const backendHeaders = getBackendAuthHeaders();
        const mlRes = await fetch(`${API_BACKEND}/projects/`, { 
          method: 'GET',
          headers: backendHeaders,
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        const latencyML = Date.now() - startML;
        results.mlBackend = { 
          status: mlRes.ok ? 'ok' : 'degraded', 
          latency: `${latencyML}ms` 
        };
      } catch (error) {
        results.mlBackend = { status: 'degraded', latency: 'offline' };
      }

      // Check Webhook Service - using /api/apps endpoint
      try {
        const startWebhook = Date.now();
        const webhookRes = await fetch(`${API_WEBHOOK}/api/apps`, { 
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        const latencyWebhook = Date.now() - startWebhook;
        results.webhook = { 
          status: webhookRes.ok ? 'ok' : 'degraded', 
          latency: `${latencyWebhook}ms` 
        };
      } catch (error) {
        results.webhook = { status: 'degraded', latency: 'offline' };
      }

      // Check Auth Service - using a basic endpoint or just mark as ok if we got here
      // Since we're already authenticated, we can assume auth is working
      try {
        const startAuth = Date.now();
        const backendHeaders = getBackendAuthHeaders();
        const authRes = await fetch(`${API_BACKEND}/projects/`, { 
          method: 'GET',
          headers: backendHeaders,
          signal: AbortSignal.timeout(5000)
        });
        const latencyAuth = Date.now() - startAuth;
        results.auth = { 
          status: authRes.ok ? 'ok' : 'degraded', 
          latency: `${latencyAuth}ms` 
        };
      } catch (error) {
        results.auth = { status: 'degraded', latency: 'offline' };
      }

      setServiceHealth(results);
    };

    checkServiceHealth();
    
    // Re-check every 30 seconds
    const interval = setInterval(checkServiceHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate real metrics from your DB data
  const activeApps = apps.filter(app => app.status === 'active' || !app.status).length;
  const avgRequestsPerApp = apps.length > 0 ? Math.floor(totalRequests / apps.length) : 0;

  const handleProjectClick = (project) => {
    // Store project info in sessionStorage to pass to RecommenderPanel
    sessionStorage.setItem('selectedProject', JSON.stringify({
      id: project.id,
      name: project.name,
      status: project.status
    }));
    // Navigate to recommender tab
    onNavigate("recommender");
  };

  return (
    <ShellSection
      eyebrow="Workspace"
      title="Welcome back to AiREC"
      description="Jump into your recommender projects, inspect webhook integrations, or review how your recommendations are performing."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 lg:gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/70 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 via-cyan-700 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/50">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-slate-500">
                    Getting started
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Build and ship a recommender in three steps
                  </p>
                </div>
              </div>
            </div>
            <ol className="space-y-3 text-xs text-slate-500">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-slate-50">
                  1
                </span>
                <div>
                  <p className="font-semibold text-slate-900">
                    Create a project in Recommender Studio
                  </p>
                  <p>
                    Upload your content and/or interaction CSVs, map the schema,
                    and let AiREC train content, collaborative, or hybrid models for you.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-slate-50">
                  2
                </span>
                <div>
                  <p className="font-semibold text-slate-900">
                    Register an external app in the Webhook Dashboard
                  </p>
                  <p>
                    Generate scoped API keys, point AiREC at your webhook URL, and keep
                    your clients decoupled from the ML backend.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-slate-50">
                  3
                </span>
                <div>
                  <p className="font-semibold text-slate-900">
                    Monitor traffic and usage
                  </p>
                  <p>
                    Use Analytics and Billing to understand how recommendations are
                    being consumed and keep an eye on quotas.
                  </p>
                </div>
              </li>
            </ol>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => onNavigate("recommender")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-300 text-slate-950 shadow-md shadow-cyan-500/40 hover:shadow-lg hover:-translate-y-[1px] transition-all"
              >
                <Activity className="w-4 h-4" />
                <span>Open Recommender Studio</span>
              </button>
              <button
                onClick={() => onNavigate("recommender")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create your first project →
              </button>
            </div>
          
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-semibold mb-4">Quick Actions</p>
          <div className="grid grid-cols-1 gap-3">
            <QuickActionCard
              title="Create Project"
              description="Train a new recommender model"
              Icon={Zap}
              onClick={() => onNavigate("recommender")}
            />
            <QuickActionCard
              title="Register App"
              description="Generate API keys & webhook"
              Icon={Webhook}
              onClick={() => onNavigate("dashboard")}
            />
            <QuickActionCard
              title="View Analytics"
              description="Inspect usage and traffic trends"
              Icon={BarChart3}
              onClick={() => onNavigate("analytics")}
            />
          </div>
        </div>
      </div>

        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-50">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-slate-500">
                    Workspace snapshot
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Live usage from your APIs
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-slate-500">Total requests</p>
                <p className="text-xl font-bold text-slate-900">
                  {loading ? "—" : totalRequests}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500">Projects live</p>
                <p className="text-xl font-bold text-slate-900">
                  {loading ? "—" : readyProjects}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500">Registered apps</p>
                <p className="text-xl font-bold text-slate-900">
                  {loading ? "—" : appsCount}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 text-slate-50 rounded-3xl border border-slate-800 p-5 flex items-start gap-3">
            <div className="mt-1">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Secure by default</p>
              <p className="text-xs text-slate-400">
                Each project and webhook app is scoped to your account via JWT, so
                you can safely run multiple tenants from the same backend without
                leaking data across workspaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ShellSection>
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
  const topApp = usage.length > 0 
    ? usage.reduce((max, app) => (app.usage_count || 0) > (max.usage_count || 0) ? app : max, usage[0])
    : null;

  const avgRequestsPerApp = apps.length > 0 ? Math.floor(totalRequests / apps.length) : 0;

  return (
    <ShellSection
      eyebrow="Analytics"
      title="Usage Analytics"
      description="Traffic trends, application performance, and infrastructure insights from your database."
    >
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-700">
            Environment: <span className="font-semibold">Development</span>
          </span>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1 py-0.5">
          {["24h", "7d", "30d"].map((label) => {
            const active = label === "7d";
            return (
              <button
                key={label}
                className={`px-3 py-1 rounded-full font-medium ${
                  active
                    ? "bg-slate-900 text-slate-50"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            Total requests
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? "—" : totalRequests}
          </p>
          <p className="text-[11px] text-slate-500">
            Aggregated from webhook usage table
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            Active webhook apps
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? "—" : apps.length}
          </p>
          <p className="text-[11px] text-slate-500">
            Based on apps registered in the webhooks service
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            Apps with traffic
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? "—" : usage.length}
          </p>
          <p className="text-[11px] text-slate-500">
            Number of apps present in the usage table
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-500">
            Requests per app
          </p>
          <div className="space-y-2 text-xs">
            {!loading && perAppPercentages.length === 0 && (
              <p className="text-slate-500">
                No usage records yet. Once your apps start calling the recommend
                endpoint, you&apos;ll see their distribution here.
              </p>
            )}
            {perAppPercentages.map((row) => (
              <div key={row.app_name}>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700">{row.app_name}</span>
                  <span className="text-slate-500">{row.percent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-500">
            Top apps by traffic
          </p>
          <ul className="space-y-2 text-xs">
            {loading && <li className="text-slate-500">Loading usage…</li>}
            {!loading &&
              usage
                .slice()
                .sort(
                  (a, b) => (b.usage_count || 0) - (a.usage_count || 0)
                )
                .slice(0, 5)
                .map((u) => (
                  <li
                    key={u.app_name}
                    className="flex justify-between border-b border-slate-100 pb-1 last:border-0"
                  >
                    <span className="text-slate-700">{u.app_name}</span>
                    <span className="font-semibold text-slate-900">
                      {u.usage_count || 0}
                    </span>
                  </li>
                ))}
            {!loading && usage.length === 0 && (
              <li className="text-slate-500">
                No usage yet. Make requests via the `/api/recommend` endpoint to
                populate these stats.
              </li>
            )}
          </ul>
          <p className="text-[11px] text-slate-500">
            All values are computed from the `webhooks.usage` table.
          </p>
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-slate-100 to-neutral-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
<aside 
  className={`fixed left-0 top-0 bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 z-50 ${
    isSidebarOpen ? 'w-[280px]' : 'w-[72px]'
  }`}
  onMouseEnter={() => !isSidebarOpen && setIsSidebarOpen(true)}
  onMouseLeave={() => isSidebarOpen && setIsSidebarOpen(false)}
>
  <style jsx>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
  
  <div className="h-full flex flex-col">
    {/* Brand Header */}
    <div className="px-6 py-5 border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-rose-900 to-cyan-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
          <Layers className="w-6 h-6 text-white" />
        </div>
        {isSidebarOpen && (
          <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
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
              className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
              title={!isSidebarOpen ? item.label : ''}
            >
              <span
                className={`inline-flex items-center justify-center rounded-lg w-9 h-9 flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-br from-rose-700 to-cyan-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gradient-to-br group-hover:from-rose-700 group-hover:to-cyan-500 group-hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
              </span>

              {isSidebarOpen && (
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-sm font-semibold truncate transition-colors duration-200 ${
                    isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
                  }`}>
                    {item.label}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
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
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 group-hover:bg-red-500 flex-shrink-0 transition-all duration-200">
            <LogOut className="w-5 h-5 text-red-600 group-hover:text-white transition-colors duration-200" />
          </span>
          {isSidebarOpen && (
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-red-600 group-hover:text-red-700">Sign out</span>
              <span className="text-[10px] uppercase tracking-wide text-red-400 font-semibold">
                Secure exit
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
