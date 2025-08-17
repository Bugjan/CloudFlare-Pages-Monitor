const projects = [
  'https://vless.pykgpp.dpdns.org',
  'https://trojan.pykgpp.dpdns.org',
  'https://bpb3.pykgpp.dpdns.org',
  'https://vless.kann.dpdns.org',
  'https://trojan.kann.dpdns.org',
];

const REFRESH_INTERVAL = 30000; // 30 秒

async function checkProject(url) {
  let available = false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 秒超時
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const text = await res.text();
    // 如果頁面裡面沒有 Error 1027 或 request quota 被刷光的訊息，視為可用
    if (!/Error 1027|request quota exceeded/i.test(text)) {
      available = true;
    }
  } catch (e) {
    available = false;
  }
  return { url, available };
}

async function renderProjects() {
  const container = document.getElementById('projects');
  container.innerHTML = '';
  const results = await Promise.all(projects.map(checkProject));
  results.forEach(r => {
    const div = document.createElement('div');
    div.className = 'project ' + (r.available ? 'available' : 'unavailable');
    div.innerHTML = `
      <h2>${r.url}</h2>
      <p>目前狀態: <strong>${r.available ? '可用 ✅' : '不可用 ❌'}</strong></p>
    `;
    container.appendChild(div);
  });
}

// 首次渲染
renderProjects();

// 自動刷新
setInterval(renderProjects, REFRESH_INTERVAL);
