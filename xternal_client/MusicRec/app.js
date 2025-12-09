const KEY = '2af8a52f3788c4c6323dfedb63417164';
const PID = 2;
const URL = 'http://localhost:3001/api/recommend';

const tracksSection = document.getElementById('tracks');
const loaderSection = document.getElementById('loader');
const resultsSection = document.getElementById('results');
const resultsContent = document.getElementById('resultsContent');

function goBack() {
  tracksSection.classList.remove('hide');
  loaderSection.classList.add('hide');
  resultsSection.classList.add('hide');
}

function showLoader() {
  tracksSection.classList.add('hide');
  loaderSection.classList.remove('hide');
  resultsSection.classList.add('hide');
}

function showResults() {
  tracksSection.classList.add('hide');
  loaderSection.classList.add('hide');
  resultsSection.classList.remove('hide');
}

async function fetchRecs(track) {
  console.log(`Fetching recs for: ${track}`);
  showLoader();

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEY
      },
      body: JSON.stringify({
        project_id: PID,
        user_id: PID,
        item_title: track
      })
    });

    const txt = await res.text();
    let json;
    
    try {
      json = JSON.parse(txt);
    } catch (err) {
      throw new Error(`Bad response: ${txt.substring(0, 100)}`);
    }

    if (!res.ok) {
      throw new Error(json.details || json.error || `Error ${res.status}`);
    }

    const recs = json.recommendations || [];
    const model = json.model_type || 'Unknown';

    if (recs.length === 0) {
      resultsContent.innerHTML = `
        <div class="err-box">
          <h3>Nothing found</h3>
          <p>No recommendations for "${track}". Pick another track.</p>
        </div>
      `;
      showResults();
      return;
    }

    const items = recs
      .map((r, i) => {
        const name = r["Track Name"] || r.title || r.name || "Unknown";
        const uri = r["Track URI"];
        const link = uri 
          ? `<a href="https://open.spotify.com/track/${uri.split(":").pop()}" target="_blank" class="link-spotify">Listen</a>`
          : "";
        
        return `
          <li class="rec-item">
            <span class="rec-num">${i + 1}</span>
            <div class="rec-details">
              <div class="rec-name">${name}</div>
            </div>
            ${link}
          </li>
        `;
      })
      .join('');

    resultsContent.innerHTML = `
      <div class="rec-header">
        <h2>Your recommendations</h2>
        <span class="badge">${model} model</span>
      </div>
      <ul class="rec-list">${items}</ul>
    `;

    showResults();

  } catch (err) {
    console.error('Error:', err);
    resultsContent.innerHTML = `
      <div class="err-box">
        <h3>Connection failed</h3>
        <p>${err.message}</p>
        <p style="margin-top: 14px;">Check if servers are running on ports 8000 and 3001.</p>
      </div>
    `;
    showResults();
  }
}

document.querySelectorAll('.card').forEach(c => {
  c.addEventListener('click', function() {
    const t = this.getAttribute('data-track');
    fetchRecs(t);
  });
});

console.log('Ready');