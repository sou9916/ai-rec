import React, { useState } from "react";
import { API_WEBHOOK } from "../api";

export default function RegisterWebhook({ onAppRegistered }) {
  const [appName, setAppName] = useState("");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setApiKey("");
    setLoading(true);

    try {
      const res = await fetch(`${API_WEBHOOK}/api/apps/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_name: appName, webhook_url: url }),
      });

      if (!res.ok) throw new Error("Failed to register app");
      const data = await res.json();

      if (data.api_key) {
        setApiKey(data.api_key);
        setMessage("✅ App registered successfully!");
        if (onAppRegistered) onAppRegistered();
      } else {
        setMessage("⚠️ Registered, but API key not returned.");
      }
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
      setAppName("");
      setUrl("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-3">Register External App</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="App Name"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          required
          className="border w-full px-3 py-2 rounded"
        />
        <input
          type="url"
          placeholder="Webhook URL (https://example.com/webhook)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="border w-full px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}

      {apiKey && (
        <div className="mt-3 p-3 bg-gray-100 rounded-md border text-sm">
          <p className="font-semibold">Your API Key:</p>
          <code className="text-blue-700 break-all">{apiKey}</code>
        </div>
      )}
    </div>
  );
}
