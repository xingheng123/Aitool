// ================================
// render.js - 动态渲染游戏卡片 & 详情
// ================================

// 读取 games.json
async function fetchGames() {
  try {
    const response = await fetch("games.json", { cache: "no-store" });
    if (!response.ok) throw new Error("❌ Failed to fetch games.json");
    const games = await response.json();
    console.log("✅ Loaded games.json:", games.length, "games");
    return games;
  } catch (err) {
    console.error("⚠️ Error loading games.json:", err);
    return [];
  }
}

// 创建游戏卡片 HTML
function createGameCard(game) {
  return `
    <article class="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition">
      <img src="${game.thumbnail}" alt="${game.title}"
           class="w-full h-40 object-cover"
           onerror="this.src='assets/placeholder.jpg'">
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900">${game.title}</h3>
        <p class="text-sm text-gray-600 mb-3">${game.description}</p>
        <a href="game.html?id=${game.id}"
           class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
           🎮 Play Now
        </a>
      </div>
    </article>
  `;
}

// 渲染游戏列表
async function loadGames(targetId, filterCategory = null, limit = null) {
  const container = document.getElementById(targetId);
  if (!container) {
    console.error("⚠️ Container not found:", targetId);
    return;
  }

  const games = await fetchGames();

  let filtered = games;
  if (filterCategory) {
    filtered = filtered.filter(g => g.category === filterCategory);
  }
  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No games found.</p>`;
    return;
  }

  container.innerHTML = filtered.map(game => createGameCard(game)).join("");
  console.log(`✅ Rendered ${filtered.length} games into #${targetId}`);
}

// 渲染游戏详情
async function loadGameDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    console.warn("⚠️ No game id in URL");
    return;
  }

  const games = await fetchGames();
  const game = games.find(g => g.id === id);

  if (!game) {
    console.error("❌ Game not found:", id);
    return;
  }

  document.getElementById("game-title").textContent = game.title;
  document.getElementById("game-description").textContent = game.description;
  document.getElementById("game-iframe").src = game.iframe;

  console.log("✅ Loaded game detail:", game.title);
}

// 暴露全局函数
window.loadGames = loadGames;
window.loadGameDetail = loadGameDetail;
