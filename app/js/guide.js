// Guide rendering: trophy cards, detail panel, spoiler masking.
import { isMasked } from './spoiler.js';

const GRADE_CLASS = { platinum: 'platinum', gold: 'gold', silver: 'silver', bronze: 'bronze' };

export function gradeClass(grade) {
  return GRADE_CLASS[grade] || 'bronze';
}

export function createCard(trophy, earned, spoiler, onToggle, onOpen) {
  const card = document.createElement('article');
  card.className = 'card' + (earned.has(trophy.name) ? ' taken' : '') + (isMasked(trophy, earned, spoiler) ? ' masked' : '');

  const checked = earned.has(trophy.name) ? 'checked' : '';
  const showName = isMasked(trophy, earned, spoiler) ? 'Story trophy' : trophy.name;
  const showDesc = isMasked(trophy, earned, spoiler) ? 'Hidden until you earn it.' : trophy.description;

  const missHtml = trophy.missable ? '<span class="miss" title="Can be missed">&#9888;</span>' : '';
  const phaseHtml = trophy.phase && trophy.phase !== '—' ? `<span class="phase">${escapeHtml(trophy.phase)}</span>` : '';

  card.innerHTML = `
    <div class="head">
      <input type="checkbox" class="checkbox" ${checked} aria-label="Mark ${escapeHtml(showName)} as earned">
      <div class="grade ${gradeClass(trophy.grade)}">${escapeHtml(trophy.grade)}</div>
    </div>
    <h3>${escapeHtml(showName)}${missHtml}</h3>
    <p>${escapeHtml(showDesc)}</p>
    <div class="foot"><span class="tag ${trophy.kind}">${escapeHtml(trophy.kind)}</span>${phaseHtml}</div>
  `;

  const box = card.querySelector('.checkbox');
  box.addEventListener('change', () => { onToggle(trophy.name); refreshCard(card, trophy, earned, spoiler); });

  card.addEventListener('click', (ev) => {
    if (ev.target === box) return;
    onOpen(trophy);
  });

  return card;
}

function refreshCard(card, trophy, earned, spoiler) {
  const box = card.querySelector('.checkbox');
  const taken = earned.has(trophy.name);
  card.className = 'card' + (taken ? ' taken' : '') + (isMasked(trophy, earned, spoiler) ? ' masked' : '');
  box.checked = taken;
  const h3 = card.querySelector('h3');
  const p = card.querySelector('p');
  if (isMasked(trophy, earned, spoiler)) {
    h3.innerHTML = 'Story trophy';
    p.textContent = 'Hidden until you earn it.';
  } else {
    h3.innerHTML = escapeHtml(trophy.name) + (trophy.missable ? '<span class="miss" title="Can be missed">&#9888;</span>' : '');
    p.textContent = trophy.description;
  }
}

export function createDetail(trophy) {
  const section = document.createElement('section');
  section.className = 'detail-panel';
  section.innerHTML = `
    <button id="close-detail">&times;</button>
    <div class="detail-inner">
      <h2 id="detail-title"></h2>
      <div class="detail-meta"></div>
      <p class="official" id="detail-official"></p>
      <h3>Your guide</h3>
      <p id="detail-guide"></p>
      <h3>Sources</h3>
      <ul id="detail-sources"></ul>
    </div>
  `;
  const title = section.querySelector('#detail-title');
  const meta = section.querySelector('.detail-meta');
  const official = section.querySelector('#detail-official');
  const guide = section.querySelector('#detail-guide');
  const sources = section.querySelector('#detail-sources');

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

  section.querySelector('#close-detail').addEventListener('click', () => { section.classList.add('hidden'); });
  section.addEventListener('click', (ev) => { if (ev.target === section) section.classList.add('hidden'); });

  return section;
}

export function openDetail(section) {
  section.classList.remove('hidden');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
