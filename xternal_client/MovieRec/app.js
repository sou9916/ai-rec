// From Webhook Dashboard: register an app and paste the API key here.
const API_KEY = '62b885ef121413cb2b71400c510a4bdd';
// Must match a project ID that exists in the ML backend (create project in Dashboard first; list IDs: GET http://localhost:8000/projects/)
const PROJECT = 1;
const ENDPOINT = 'http://localhost:3001/api/recommend';

const moviesView = document.getElementById('moviesView');
const loadingView = document.getElementById('loadingView');
const resultsView = document.getElementById('resultsView');
const resultsOutput = document.getElementById('resultsOutput');
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

function backToMovies() {
  moviesView.style.display = 'block';
  loadingView.classList.add('hide');
  resultsView.classList.add('hide');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function displayLoading() {
  moviesView.style.display = 'none';
  loadingView.classList.remove('hide');
  resultsView.classList.add('hide');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function displayResults() {
  moviesView.style.display = 'none';
  loadingView.classList.add('hide');
  resultsView.classList.remove('hide');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadRecommendations(movieTitle) {
  console.log('Loading recommendations for:', movieTitle);
  displayLoading();

  try {
    const req = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        project_id: PROJECT,
        user_id: PROJECT,
        item_title: movieTitle
      })
    });

    const rawText = await req.text();
    let parsedData;
    
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      throw new Error('Invalid server response');
    }

    if (!req.ok) {
      throw new Error(parsedData.details || parsedData.error || 'Request failed');
    }

    const movies = parsedData.recommendations || [];
    const modelName = parsedData.model_type || 'Unknown';

    if (movies.length === 0) {
      resultsOutput.innerHTML = `
        <div class="error-panel">
          <h3>No Results</h3>
          <p>We couldn't find recommendations for "${movieTitle}". Try selecting another movie.</p>
        </div>
      `;
      displayResults();
      return;
    }

    const movieCards = movies
      .map((m, idx) => {
        const name = m["Track Name"] || m.title || m.name || "Untitled";
        const link = m["Track URI"];
        const watchBtn = link 
          ? `<a href="https://open.spotify.com/track/${link.split(":").pop()}" target="_blank" class="watch-link">Watch Now</a>`
          : "";
        
        return `
          <li class="rec-card">
            <div class="rec-left">
              <span class="rec-index">${idx + 1}</span>
              <span class="rec-title-text">${name}</span>
            </div>
            ${watchBtn}
          </li>
        `;
      })
      .join('');

    resultsOutput.innerHTML = `
      <h2 class="rec-title">Recommended for you</h2>
      <div class="model-tag">${modelName}</div>
      <ul class="rec-grid">${movieCards}</ul>
    `;

    displayResults();

  } catch (err) {
    console.error('Error loading recommendations:', err);
    resultsOutput.innerHTML = `
      <div class="error-panel">
        <h3>Connection Error</h3>
        <p>${err.message}</p>
        <p style="margin-top: 14px;">Please verify that your FastAPI (port 8000) and Node.js (port 3001) services are running.</p>
      </div>
    `;
    displayResults();
  }
}

const cards = document.querySelectorAll('.movie-card');
cards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.getAttribute('data-movie');
    loadRecommendations(title);
  });
});

console.log('MovieRec initialized');