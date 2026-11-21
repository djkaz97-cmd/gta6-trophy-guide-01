// main.js: wires the guide together. All offline, localStorage only.
import { Tracker } from './tracker.js';
import { Filters, KINDS } from './filters.js';
import { createCard, gradeClass } from './guide.js';
import { createRoadmap } from './roadmap.js';
import { exportProgress, importProgress } from './export.js';

const DATA_URL = 'data/trophies.json';

const grid = document.getElementById('trophy-grid');
const emptyNote = document.getElementById('empty-note');
const countBadge = document.getElementById('count-badge');
const progressEl = document.getElementById('progress');
const sectionLabel = document.getElementById('section-label');
const chips = document.querySelectorAll('.chip');
const spoilerInput = document.getElementById('spoiler');
const btnExport = document.getElementById('btn-export');
const btnImport = document.getElementById('btn-import');
const inpImport = document.getElementById('inp-import');
const detailHost = document.getElementById('detail');
const roadmapContainer = document.getElementById('roadmap-phases');

const tracker = new Tracker();
const filters = new Filters();
let trophies = [];
let detailPanel = null;

init();

async function init() {
  tracker.load();
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('Could not load data/trophies.json');
  const data = await res.json();
  trophies = Array.isArray(data) ? data : data.trophies;

  detailPanel = document.createElement('div');
  detailPanel.className = 'detail-panel hidden';
  detailHost.appendChild(detailPanel);

  spoilerInput.addEventListener('change', (ev) => { filters.setSpoiler(ev.target.checked); render(); });
  btnExport.addEventListener('click', () => { exportProgress(tracker.exportJson()); });
  btnImport.addEventListener('click', () => inpImport.click());
  inpImport.addEventListener('change', async (ev) => {
    try {
      const json = await importProgress(inpImport);
      tracker.importJson(json);
      inpImport.value = '';
      render();
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  });

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      for (const c of chips) c.classList.remove('active');
      chip.classList.add('active');
      filters.setKind(chip.dataset.kind);
      sectionLabel.textContent = chip.dataset.kind === 'all' ? 'Checklist' : `Checklist — ${chip.dataset.kind}`;
      render();
    });
  }
  chips[0].classList.add('active');

  renderRoadmap();
  render();
}

function render() {
  grid.innerHTML = '';
  let shown = 0;
  for (const t of trophies) {
    if (!filters.matches(t)) continue;
    const card = createCard(t, tracker.earned, filters.spoiler,
      (name) => { tracker.toggle(name); render(); },
      (trophy) => { openDetailPanel(trophy); });
    grid.appendChild(card);
    shown++;
  }
  emptyNote.classList.toggle('hidden', shown > 0);
  countBadge.textContent = `· ${shown} shown`;
  progressEl.textContent = `${tracker.count()} of ${trophies.length} earned`;
}

function renderRoadmap() {
  if (!roadmapContainer) return;
  roadmapContainer.innerHTML = '';
  roadmapContainer.appendChild(createRoadmap(trophies));
}

function openDetailPanel(trophy) {
  if (!detailPanel) return;
  const inner = buildDetailInner(trophy);
  detailPanel.innerHTML = '';
  detailPanel.appendChild(inner);
  detailPanel.classList.remove('hidden');
}

function buildDetailInner(trophy) {
  const inner = document.createElement('div');
  inner.className = 'detail-inner';
  inner.innerHTML = `
    <button id="close-detail">&times;</button>
    <h2 id="detail-title"></h2>
    <div class="detail-meta"></div>
    <p class="official" id="detail-official"></p>
    <h3>Your guide</h3>
    <p id="detail-guide"></p>
    <h3>Sources</h3>
    <ul id="detail-sources"></ul>
  `;
  const title = inner.querySelector('#detail-title');
  const meta = inner.querySelector('.detail-meta');
  const official = inner.querySelector('#detail-official');
  const guide = inner.querySelector('#detail-guide');
  const sources = inner.querySelector('#detail-sources');

  title.textContent = trophy.name;

  const grade = document.createElement('span');
  grade.className = `grade-badge grade ${gradeClass(trophy.grade)}`;
  grade.textContent = trophy.grade;
  meta.appendChild(grade);

  const kindTag = document.createElement('span');
  kindTag.className = `tag ${trophy.kind}`;
  kindTag.textContent = trophy.kind;
  meta.appendChild(kindTag);

  if (trophy.missable) {
    const miss = document.createElement('span');
    miss.className = 'tag missable';
    miss.textContent = 'Missable';
    meta.appendChild(miss);
  }

  if (trophy.chapter && trophy.chapter !== '—') {
    const ch = document.createElement('span');
    ch.className = 'tag';
    ch.textContent = trophy.chapter;
    meta.appendChild(ch);
  }

  official.textContent = `Official: "${trophy.description}"`;
  guide.textContent = trophy.guide;

  sources.innerHTML = '';
  for (const src of (trophy.sources || [])) {
    const li = document.createElement('li');
    if (src.url) {
      const a = document.createElement('a');
      a.href = src.url; a.textContent = src.name; a.target = '_blank'; a.rel = 'noopener';
      li.appendChild(a);
    } else {
      li.textContent = src.name;
    }
    sources.appendChild(li);
  }

  const close = inner.querySelector('#close-detail');
  close.addEventListener('click', () => { detailPanel.classList.add('hidden'); });
  detailPanel.onclick = (ev) => { if (ev.target === detailPanel) detailPanel.classList.add('hidden'); };

  return inner;
}
