// render.js - minimal test version

console.log("✅ render.js loaded correctly");

// 仅做一个简单函数，确保 JS 能执行
function helloTest() {
  console.log("🎮 Hello from render.js!");
}

// 挂到全局，保证 index.html 能调用
window.helloTest = helloTest;
