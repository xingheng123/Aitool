// render.js - clean version for LovePlaying.online

// 读取 games.json
async function fetchGamesJson() {
  try {
    console.log("📂 [render.js] Fetching games.json...");
    const res = await fetch("games.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch games.json: " + res.status);

    const games = await res.json();
    console.log("✅ [render.js] Loaded games:", games.length);
    return games;
  } catch (err) {
    console.error("❌ [render.js] Error loading games.json:", err);
    return [];
  }
}

// 生成游戏卡片 HTML
function createGameCardHTML(game) {
  return `
    <article class="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition">
      <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-40 object-cover" />
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900">${game.title}</h3>
        <p class="text-sm text-gray-600 mb-3">${game.description}</p>
        <a href="game.html?id=${game.id}" 
           class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
           Play Now
        </a>
      </div>
    </article>
  `;
}

// 渲染游戏到页面
async function loadGames(targetId, filterCategory = null, limit = null) {
  const container = document.getElementById(targetId);
  if (!container) {
    console.error("❌ [render.js] Container not found:", targetId);
    return;
  }

  const games = await fetchGamesJson();
  let filtered = games;

  if (filterCategory) {
    filtered = games.filter(g => g.category === filterCategory);
  }

  if (limit && Number.isInteger(limit)) {
    filtered = filtered.slice(0, limit);
  }

  if (!filtered || filtered.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No games available.</p>`;
    return;
  }

  container.innerHTML = filtered.map(createGameCardHTML).join("");
  console.log(`🎮 [render.js] Rendered ${filtered.length} games to #${targetId}`);
}

// ✅ 挂到全局，保证 HTML 能调用
window.loadGames = loadGames;
