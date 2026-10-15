  const RANGE = 175;
  const nodes = [
    { id: 0, label: "You",  x: 60,  y: 190, type: "you" },
    { id: 1, label: "A",    x: 170, y: 90 },
    { id: 2, label: "B",    x: 190, y: 290 },
    { id: 3, label: "C",    x: 310, y: 190 },
    { id: 4, label: "D",    x: 330, y: 50 },
    { id: 5, label: "E",    x: 340, y: 330 },
    { id: 6, label: "F",    x: 460, y: 140 },
    { id: 7, label: "G",    x: 470, y: 280 },
    { id: 8, label: "Rescue", x: 550, y: 200, type: "base" }
  ];
  const palette = ["#ff6b6b","#ffd166","#06d6a0","#4cc9f0","#c77dff","#ff9f1c","#7bf1a8"];
const off = new Set();
  const svg = document.getElementById("map");
  const status = document.getElementById("status");
  let busy = false;

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const alive = n => !off.has(n.id);
  const linked = (a, b) => a.id !== b.id && alive(a) && alive(b) && dist(a, b) <= RANGE;

  function draw(hotPath = []) {
    const hot = new Set();
    for (let i = 0; i < hotPath.length - 1; i++) {
      hot.add([hotPath[i], hotPath[i + 1]].sort().join("-"));
    }
    let html = "";
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (linked(nodes[i], nodes[j])) {
          const cls = hot.has(`${i}-${j}`) || hot.has(`${j}-${i}`) ? "link hot" : "link";
          html += `<line class="${cls}" x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}"/>`;
        }
      }
    }
    nodes.forEach(n => {
      const cls = ["node", n.type || "", off.has(n.id) ? "off" : ""].join(" ");
      html += `<g class="${cls}" data-id="${n.id}">
        <circle cx="${n.x}" cy="${n.y}" r="${n.type ? 24 : 18}" style="${n.type || off.has(n.id) ? '' : 'fill:' + palette[n.id % palette.length]}"/>
        <text x="${n.x}" y="${n.y + (n.type ? 42 : 36)}">${n.label}</text>
      </g>`;
    });
    svg.innerHTML = html;
  }

  function findPath() {
    const start = nodes[0], goal = nodes[nodes.length - 1];
    const queue = [[start.id]];
    const seen = new Set([start.id]);
    while (queue.length) {
      const path = queue.shift();
      const last = nodes[path[path.length - 1]];
      if (last.id === goal.id) return path;
      nodes.forEach(n => {
        if (!seen.has(n.id) && linked(last, n)) {
          seen.add(n.id);
          queue.push([...path, n.id]);
        }
      });
    }
    return null;
  }

  async function sendSOS() {
    if (busy) return;
    busy = true;
    status.className = "";
    const path = findPath();
    if (!path) {
      draw();
      status.className = "fail";
      status.textContent = "No route found. There is no chain of phones in range. Switch a phone back on or reset.";
      busy = false;
      return;
    }
    for (let i = 1; i <= path.length; i++) {
      draw(path.slice(0, i));
      status.textContent = i < path.length
        ? `SOS hopping... reached ${nodes[path[i - 1]].label} (${i - 1} hop${i - 1 === 1 ? "" : "s"})`
        : `SOS delivered to the rescue base in ${path.length - 1} hops.`;
      await new Promise(r => setTimeout(r, 600));
    }
    busy = false;
  }

  svg.addEventListener("click", e => {
    const g = e.target.closest(".node");
    if (!g || busy) return;
    const id = Number(g.dataset.id);
    if (nodes[id].type) return; // sender and base stay on
    off.has(id) ? off.delete(id) : off.add(id);
    status.className = "";
    status.textContent = `Phone ${nodes[id].label} is now ${off.has(id) ? "off" : "on"}.`;
    draw();
  });

  document.getElementById("sendBtn").addEventListener("click", sendSOS);
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (busy) return;
    off.clear();
    status.className = "";
    status.textContent = "Network reset. All phones are on.";
    draw();
  });

  draw();
