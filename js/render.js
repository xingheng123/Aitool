// js/render.js  —— 调试版，会把加载过程和错误打印到 console
async function fetchGamesJson() {
  try {
    console.log('[render.js] Fetching games.json ...');
    const res = await fetch('games.json', { cache: 'no-store' });
    console.log('[render.js] fetch status:', res.status, res.statusText);
    if (!res.ok) {
      throw new Error('Failed to fetch games.json: HTTP ' + res.status);
    }
    const text = await res.text();
    console.log('[render.js] games.json text (first 1000 chars):', text.slice(0, 1000));
    const games = JSON.parse(text);
    console.log('[render.js] parsed games array length:', Array.isArray(games) ? games.length : 'not array');
    return games;
  } catch (err) {
    console.error('[render.js] Error loading or parsing games.json:', err);
    throw err;
  }
}

function createGameCardHTML(game) {
  return `
    <article class="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition">
      <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-40 object-cover">
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900">${game.title}</h3>
        <p class="text-sm text-gray-600 mb-3">${game.description}</p>
        <a href="game.html?id=${game.id}" class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          立即开始
        </a>
      </div>
    </article>
  `;
}

async function loadGames(targetId, filterCategory = null, limit = null) {
  const container = document.getElementById(targetId);
  if (!container) {
    console.error('[render.js] Container not found:', targetId);
    return;
  }

  try {
    const games = await fetchGamesJson();
    let filtered = games;
    if (filterCategory) filtered = games.filter(g => g.category === filterCategory);
    if (limit && Number.isInteger(limit)) filtered = filtered.slice(0, limit);

    if (!filtered || filtered.length === 0) {
      console.warn('[render.js] No games to render for', targetId, 'category=', filterCategory);
      container.innerHTML = '<p class="text-gray-500">No games found.</p>';
      return;
    }
<div id="latest-games"></div>

    container.innerHTML = '';
    filtered.forEach(game => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = createGameCardHTML(game);
      container.appendChild(wrapper.firstElementChild);
    });
    console.log('[render.js] Rendered', filtered.length, 'games into', targetId);
  } catch (err) {
    container.innerHTML = '<p class="text-red-500">Failed to load games. See console for details.</p>';
  }
}

async function loadGameDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    console.log('[render.js] No game id in URL.');
    return;
  }
  try {
    const games = await fetchGamesJson();
    const game = games.find(g => g.id === id);
    if (!game) {
      console.warn('[render.js] Game not found:', id);
      return;
    }
    const titleEl = document.getElementById('game-title');
    const descEl = document.getElementById('game-description');
    const iframeEl = document.getElementById('game-iframe');
    if (titleEl) titleEl.textContent = game.title;
    if (descEl) descEl.textContent = game.description;
    if (iframeEl) iframeEl.src = game.iframe;
    console.log('[render.js] Loaded detail for', id);
  } catch (err) {
    console.error('[render.js] Error in loadGameDetail:', err);
  }
}

// Expose functions globally
window.loadGames = loadGames;
window.loadGameDetail = loadGameDetail;
