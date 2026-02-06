import React from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Sparkles, Activity, Webhook, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Pill = ({ children }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-slate-100 border border-slate-700/80">
    {children}
  </span>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/60 p-6 flex flex-col gap-3">
    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-cyan-700 to-cyan-500 text-white shadow-md shadow-cyan-500/40">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
  </div>
);

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const primaryLabel = isAuthenticated ? "Open dashboard" : "Get started";
  const primaryTarget = isAuthenticated ? "/app" : "/signup";

  const secondaryLabel = isAuthenticated ? "Sign out & switch account" : "Already using AiREC? Log in";
  const secondaryTarget = isAuthenticated ? "/login" : "/login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <header className="border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-red-900 via-cyan-700 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/40">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-slate-500">
                AiREC
              </p>
              <p className="text-sm font-bold tracking-tight">
                Recom BaaS Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white border border-slate-700/70 hover:border-cyan-400/80 bg-slate-900/60 hover:bg-slate-900/90 transition-all"
            >
              Log in
            </button>
            <button
              onClick={() => navigate(primaryTarget)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-300 text-slate-950 shadow-md shadow-cyan-500/40 hover:shadow-lg hover:-translate-y-[1px] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{primaryLabel}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        <section className="grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center">
          {/* Hero copy */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Pill>Recommendations-as-a-Service</Pill>
              <Pill>No MLOps required</Pill>
              <Pill>FastAPI · React · Webhooks</Pill>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Ship production-ready{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                  recommendation engines
                </span>{" "}
                in days, not months.
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                AiREC gives you a single studio to upload data, train models,
                and expose recommendations over secure webhooks—without wiring
                up infrastructure, auth, or tracking usage yourself.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => navigate(primaryTarget)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/40 hover:shadow-xl hover:-translate-y-[1px] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{primaryLabel}</span>
              </button>
              <button
                onClick={() => navigate(secondaryTarget)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700/80 text-slate-200 hover:text-white hover:border-cyan-400/80 bg-slate-900/40 hover:bg-slate-900/80 transition-all"
              >
                <Activity className="w-4 h-4" />
                <span>{secondaryLabel}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-900/80 flex items-center justify-center border border-slate-700/80">
                  <span className="text-[10px] font-semibold">1</span>
                </div>
                <span>Upload CSVs for content & interactions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-900/80 flex items-center justify-center border border-slate-700/80">
                  <span className="text-[10px] font-semibold">2</span>
                </div>
                <span>Train models directly from the studio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-900/80 flex items-center justify-center border border-slate-700/80">
                  <span className="text-[10px] font-semibold">3</span>
                </div>
                <span>Register apps & consume via webhooks</span>
              </div>
            </div>
          </div>

          {/* Right-hand visual */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl shadow-cyan-500/20 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-400 to-emerald-300 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-400/50">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs text-slate-400">Studio</p>
                    <p className="text-sm font-semibold text-slate-50">
                      Recommender projects
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300 uppercase tracking-wide">
                  Live workspace
                </span>
              </div>

              <div className="grid gap-3 text-[11px] text-slate-300">
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 border border-slate-700/80 px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold">Movie recommender</span>
                    <span className="text-slate-500">
                      Hybrid · 25K users · 12K items
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/60 px-3 py-1 text-[10px] font-semibold">
                    READY
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/60 border border-slate-800 px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold">Music suggestions</span>
                    <span className="text-slate-500">
                      Collaborative · 3K active listeners
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/60 px-3 py-1 text-[10px] font-semibold">
                    TRAINING
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FeatureCard
                icon={Activity}
                title="Recommender Studio"
                description="Upload content & interaction CSVs, map schemas, and train content, collaborative, or hybrid models in a guided flow."
              />
              <FeatureCard
                icon={Webhook}
                title="Webhook Dashboard"
                description="Register external apps, manage API keys, and stream recommendations via a simple `/recommend` endpoint."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Auth & isolation built-in"
                description="Users, projects, and apps are scoped per account using JWT—no extra plumbing or boilerplate required."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

