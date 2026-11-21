// Roadmap: suggested order to earn every trophy, grouped by phase.
export function createRoadmap(trophies) {
  const container = document.createElement('div');
  container.className = 'roadmap';

  const phases = [];
  for (const t of trophies) {
    let phase = phases.find(p => p.name === t.phase);
    if (!phase) { phase = { name: t.phase, items: [] }; phases.push(phase); }
    phase.items.push(t);
  }

  for (const phase of phases) {
    const phaseEl = document.createElement('div');
    phaseEl.className = 'roadmap-phase';

    const h3 = document.createElement('h3');
    h3.textContent = phase.name;
    phaseEl.appendChild(h3);

    const list = document.createElement('ul');
    list.className = 'roadmap-list';
    let n = 0;
    for (const t of phase.items) {
      n++;
      const li = document.createElement('li');
      if (t.missable) li.classList.add('missable');
      li.innerHTML = `
        <span class="num">${n}.</span>
        <span class="name">${escapeHtml(t.name)}</span>
        <span class="grade ${gradeClass(t.grade)}">${escapeHtml(t.grade)}</span>
        ${t.missable ? '<span class="miss" title="Missable">&#9888;</span>' : ''}
        <div class="desc">${escapeHtml(t.description)}</div>
      `;
      list.appendChild(li);
    }
    phaseEl.appendChild(list);
    container.appendChild(phaseEl);
  }
  return container;
}

function gradeClass(grade) {
  return { platinum: 'platinum', gold: 'gold', silver: 'silver', bronze: 'bronze' }[grade] || 'bronze';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
