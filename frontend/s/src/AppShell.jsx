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

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: HomeIcon, description: "Overview of your workspace" },
  { id: "recommender", label: "Recommender Studio", icon: Activity, description: "Create projects & train models" },
  { id: "dashboard", label: "Webhook Dashboard", icon: Webhook, description: "Apps, API keys & webhooks" },
  { id: "analytics", label: "Analytics", icon: BarChart3, description: "Traffic & usage" },
  { id: "billing", label: "Billing", icon: CreditCard, description: "Plan & consumption" },
  { id: "settings", label: "Settings", icon: Settings, description: "Workspace configuration" },
];

const ShellSection = ({ title, eyebrow, description, children }) => (
  <div className="px-6 py-8 lg:px-10 lg:py-10">
    <div className="max-w-6xl xl:max-w-7xl mx-auto space-y-8">
      <div className="space-y-3">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-400">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="text-sm text-slate-500 max-w-2xl">{description}</p>
        )}
      </div>
      {children}
    </div>
  </div>
);

const HomeOverview = ({ onNavigate, summary }) => {
  const { totalRequests, readyProjects, appsCount, loading } = summary;

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
                onClick={() => onNavigate("dashboard")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-cyan-400 bg-white/70 hover:bg-white transition-all"
              >
                <Webhook className="w-4 h-4" />
                <span>Go to Webhook Dashboard</span>
              </button>
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
  const { apps, usage, totalRequests, loading } = summary;

  const perAppPercentages = useMemo(() => {
    if (!totalRequests) return [];
    return usage.map((u) => {
      const count = typeof u.usage_count === "number" ? u.usage_count : 0;
      const percent = Math.round((count / totalRequests) * 100);
      return { app_name: u.app_name, percent };
    });
  }, [usage, totalRequests]);

  return (
    <ShellSection
      eyebrow="Analytics"
      title="Recommendation analytics"
      description="Understand how your recommendation APIs are being consumed across applications."
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
            <p className="text-xs font-semibold text-slate-500">Cost controls</p>
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
              <p className="text-[11px] text-slate-500 mb-1">
                Webhook service
              </p>
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
            () => null
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
      0
    );
    const readyProjects = state.projects.filter(
      (p) => p.status === "ready"
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
        <aside className="w-64 lg:w-72 xl:w-80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 border-r border-slate-800/60">
          <div className="h-full flex flex-col">
            {/* Brand */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-800/60">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-900 via-cyan-700 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/40">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
                    AiREC
                  </p>
                  <h1 className="text-lg font-extrabold bg-gradient-to-r from-slate-50 via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                    Recom BaaS Studio
                  </h1>
                </div>
                <div className="ml-auto hidden xl:flex flex-col items-end gap-1">
                  <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                    Workspace: Personal
                  </span>
                  <span className="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Plan: Developer
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                Build, test, and ship recommendation engines with a single
                workspace.
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-transparent py-4">
              <div className="px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-200 group ${
                        isActive
                          ? "bg-slate-50 text-slate-900 shadow-lg shadow-cyan-500/20"
                          : "text-slate-200 hover:text-white hover:bg-slate-800/70"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center rounded-xl border text-xs font-semibold w-9 h-9 ${
                          isActive
                            ? "bg-gradient-to-br from-cyan-600 to-cyan-400 text-white border-transparent"
                            : "border-slate-700/80 bg-slate-900/60 text-slate-200 group-hover:border-cyan-500/60"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Footer / Sign out */}
            <div className="px-4 pt-3 pb-5 border-t border-slate-800/60 bg-slate-950/60">
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2.5 rounded-2xl text-sm font-medium flex items-center justify-between text-slate-200 hover:text-white hover:bg-slate-800/80 transition-all"
                title="Sign out"
              >
                <span className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-slate-900/80">
                    <LogOut className="w-4 h-4" />
                  </span>
                  <span>Sign out</span>
                </span>
                <span className="text-[11px] uppercase tracking-wide text-slate-500">
                  Secure exit
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
