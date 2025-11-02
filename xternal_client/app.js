// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const getRecsBtn = document.getElementById("getRecs");
  
  if (!getRecsBtn) {
    console.error("❌ 'getRecs' button not found!");
    return;
  }

  getRecsBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent any default button behavior
    
    const output = document.getElementById("output");
    if (!output) {
      console.error("❌ 'output' div not found!");
      return;
    }
    
    try {
      const apiKey = document.getElementById("apiKey").value.trim();
      const itemTitle = document.getElementById("itemTitle").value.trim();
      const projectId = document.getElementById("projectId").value.trim();

      console.log("🔍 Button clicked", { apiKey, itemTitle, projectId });

      if (!apiKey || !itemTitle || !projectId) {
        output.innerHTML = `<p style="color:red;">⚠️ Please fill in all fields.</p>`;
        return;
      }

      output.innerHTML = "⏳ Fetching recommendations...";
      console.log("📡 Making request to http://localhost:3001/api/recommend");

      const res = await fetch("http://localhost:3001/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          project_id: projectId,
          item_title: itemTitle,
        }),
      });

      console.log("📥 Response status:", res.status);

      // Parse the response
      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Server error:", res.status, data);
        const errorMsg = data.details || data.error || `Server returned ${res.status}`;
        throw new Error(errorMsg);
      }

      console.log("✅ Response from server:", data);

      const recs = data.recommendations || [];

      if (!recs.length) {
        output.innerHTML = `<p style="color:red;">❌ No recommendations found for "${itemTitle}".</p>`;
        return;
      }

      // 🧠 Handle Track Name / URI structure
      const listHTML = recs
        .map((rec, idx) => {
          const title = rec["Track Name"] || rec.title || rec.name || rec.id || "Untitled";
          const uri = rec["Track URI"]
            ? `<a href="https://open.spotify.com/track/${rec["Track URI"].split(":").pop()}" target="_blank">🎧 Listen</a>`
            : "";
          return `<li style="margin: 6px 0;">${idx + 1}. ${title} ${uri}</li>`;
        })
        .join("");

      output.innerHTML = `
        <h3 style="color:green;">✅ Recommendations for "<b>${itemTitle}</b>":</h3>
        <ul style="list-style: none; padding-left: 0;">${listHTML}</ul>
        <p style="margin-top:10px; color:gray;">Model type: <b>${data.model_type}</b></p>
      `;
    } catch (err) {
      console.error("🚨 Error:", err);
      output.innerHTML = `<p style="color:red;">🚨 Error: ${err.message}</p>`;
    }
  });
});
