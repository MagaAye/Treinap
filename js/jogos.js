/* jogos.js — Aba de Jogos do Treinap
 * Lê estado do localStorage (ayelen_v1). Usa save(), updateCharUI(), toast() globais.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'ayelen_v1';

  /* ── Catálogo de jogos ──────────────────────────────────── */
  const JOGOS = [
    {
      id: 'memory',
      icon: '🧠',
      nome: 'Memory',
      desc: 'Encontre os pares de emojis saudáveis antes do tempo acabar!',
      disponivel: true,
    },
    {
      id: 'quiz',
      icon: '❓',
      nome: 'Quiz Saúde',
      desc: 'Responda perguntas sobre saúde e bem-estar.',
      disponivel: false,
    },
    {
      id: 'passo',
      icon: '👟',
      nome: 'Corrida',
      desc: 'Desvie dos obstáculos e acumule passos.',
      disponivel: false,
    },
  ];

  /* ── Menu principal ─────────────────────────────────────── */
  function buildJogosMenu() {
    const menu = document.getElementById('jogos-menu');
    const ativo = document.getElementById('jogo-ativo');
    if (!menu) return;
    ativo.innerHTML = '';
    ativo.style.display = 'none';
    menu.style.display  = 'block';

    let html = `
      <div class="section-title" style="margin-bottom:14px;">🎮 Mini-jogos</div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:16px;line-height:1.7;">
        Jogue e ganhe ⭐ extras! Venha todo dia para novos desafios.
      </div>
      <div class="jogos-grid">`;

    JOGOS.forEach(j => {
      const cls   = j.disponivel ? 'jogo-card' : 'jogo-card em-breve';
      const badge = j.disponivel
        ? '<span class="jogo-card-badge badge-disponivel">Disponível</span>'
        : '<span class="jogo-card-badge badge-breve">Em breve</span>';
      const click = j.disponivel ? `onclick="window._jogoIniciar('${j.id}')"` : '';
      html += `
        <div class="${cls}" ${click}>
          <span class="jogo-card-icon">${j.icon}</span>
          <div class="jogo-card-nome">${j.nome}</div>
          <div class="jogo-card-desc">${j.desc}</div>
          ${badge}
        </div>`;
    });

    html += `</div>`;
    menu.innerHTML = html;
  }

  /* ── Iniciar um jogo ────────────────────────────────────── */
  window._jogoIniciar = function (id) {
    if (id === 'memory') iniciarMemory();
  };

  /* ══════════════════════════════════════════════════════════
     MEMORY GAME
  ══════════════════════════════════════════════════════════ */
  const EMOJIS = ['🏃','💧','🥗','💪','🧘','🥦','❤️','🌟'];
  const PREMIA_COINS = 15;
  const TEMPO_TOTAL  = 60; // segundos

  let memState = null; // { cards, virados, pareados, tempoRestante, bloqueado, intervalo }

  function iniciarMemory() {
    const menu  = document.getElementById('jogos-menu');
    const ativo = document.getElementById('jogo-ativo');
    menu.style.display  = 'none';
    ativo.style.display = 'block';

    // Monta baralho 4×4 (8 pares embaralhados)
    const baralho = embaralhar([...EMOJIS, ...EMOJIS]);

    memState = {
      cards:       baralho.map((emoji, i) => ({ id: i, emoji, virado: false, pareado: false })),
      virados:     [],   // índices dos 2 virados aguardando checagem
      pareados:    0,
      tempoRestante: TEMPO_TOTAL,
      bloqueado:   false,
      intervalo:   null,
    };

    renderMemory();
    iniciarTimer();
  }

  /* ── Render completo do jogo ── */
  function renderMemory() {
    const ativo = document.getElementById('jogo-ativo');
    if (!ativo) return;

    const t = memState.tempoRestante;
    const timerCls = t <= 10 ? 'memory-timer urgente' : 'memory-timer';

    let gridHtml = '';
    memState.cards.forEach((card, i) => {
      const flippedCls = (card.virado || card.pareado) ? 'flipped' : '';
      const matchedCls = card.pareado ? 'matched' : '';
      gridHtml += `
        <div class="memory-card ${flippedCls} ${matchedCls}" data-idx="${i}" onclick="window._memoryFlip(${i})">
          <div class="memory-card-inner">
            <div class="memory-back"></div>
            <div class="memory-front">${card.emoji}</div>
          </div>
        </div>`;
    });

    ativo.innerHTML = `
      <div class="jogo-header">
        <div class="jogo-titulo">🧠 Memory</div>
        <button class="jogo-voltar" onclick="window._jogoVoltar()">← Voltar</button>
      </div>
      <div class="memory-meta">
        <div>
          <div style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Tempo</div>
          <div class="${timerCls}">${t}s</div>
        </div>
        <div class="memory-pares">
          Pares encontrados<br>
          <span>${memState.pareados}</span> / ${EMOJIS.length}
        </div>
      </div>
      <div class="memory-grid">${gridHtml}</div>
      <button class="memory-reiniciar" onclick="iniciarMemory()">🔄 Reiniciar</button>`;
  }

  /* ── Flip de card ── */
  window._memoryFlip = function (idx) {
    if (!memState) return;
    const card = memState.cards[idx];
    if (memState.bloqueado || card.virado || card.pareado) return;

    card.virado = true;
    memState.virados.push(idx);
    atualizarCardDOM(idx);

    if (memState.virados.length === 2) {
      memState.bloqueado = true;
      verificarPar();
    }
  };

  /* ── Verificar par ── */
  function verificarPar() {
    const [a, b] = memState.virados;
    const cardA  = memState.cards[a];
    const cardB  = memState.cards[b];

    if (cardA.emoji === cardB.emoji) {
      // Par encontrado
      setTimeout(() => {
        cardA.pareado = true;
        cardB.pareado = true;
        memState.pareados += 1;
        memState.virados  = [];
        memState.bloqueado = false;
        atualizarCardDOM(a);
        atualizarCardDOM(b);
        atualizarMeta();

        if (memState.pareados === EMOJIS.length) {
          venceu();
        }
      }, 300);
    } else {
      // Par errado — desvira após 800ms
      setTimeout(() => {
        cardA.virado = false;
        cardB.virado = false;
        memState.virados  = [];
        memState.bloqueado = false;
        atualizarCardDOM(a);
        atualizarCardDOM(b);
      }, 800);
    }
  }

  /* ── Atualiza só o DOM de um card (sem re-render completo) ── */
  function atualizarCardDOM(idx) {
    const el   = document.querySelector(`.memory-card[data-idx="${idx}"]`);
    if (!el) return;
    const card = memState.cards[idx];
    el.classList.toggle('flipped',  card.virado || card.pareado);
    el.classList.toggle('matched',  card.pareado);
  }

  /* ── Atualiza timer e pares no topo sem re-render ── */
  function atualizarMeta() {
    const t = memState ? memState.tempoRestante : 0;
    const timerEl = document.querySelector('.memory-timer');
    const paresEl = document.querySelector('.memory-pares span');
    if (timerEl) {
      timerEl.textContent = t + 's';
      timerEl.className   = t <= 10 ? 'memory-timer urgente' : 'memory-timer';
    }
    if (paresEl && memState) paresEl.textContent = memState.pareados;
  }

  /* ── Timer regressivo ── */
  function iniciarTimer() {
    if (memState.intervalo) clearInterval(memState.intervalo);
    memState.intervalo = setInterval(() => {
      if (!memState) { clearInterval(memState?.intervalo); return; }
      memState.tempoRestante -= 1;
      atualizarMeta();
      if (memState.tempoRestante <= 0) {
        clearInterval(memState.intervalo);
        perdeu();
      }
    }, 1000);
  }

  /* ── Vitória ── */
  function venceu() {
    clearInterval(memState.intervalo);
    // Premia com estrelas
    try {
      const st = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      st.coins = (st.coins || 0) + PREMIA_COINS;
      save(st);
      updateCharUI();
    } catch (e) { /* silencioso */ }
    setTimeout(() => toast(`🎉 +${PREMIA_COINS} ⭐ por vencer o Memory!`), 200);
    // Bloqueia novos cliques
    memState.bloqueado = true;
    // Destaca resultado no header
    const timerEl = document.querySelector('.memory-timer');
    if (timerEl) {
      timerEl.style.color = '#6dcc7a';
      timerEl.textContent = '🏆';
    }
  }

  /* ── Derrota ── */
  function perdeu() {
    if (!memState) return;
    memState.bloqueado = true;
    const timerEl = document.querySelector('.memory-timer');
    if (timerEl) {
      timerEl.style.color = '#f07070';
      timerEl.textContent = '0s';
    }
    setTimeout(() => toast('⏰ Tempo esgotado! Tente de novo'), 200);
  }

  /* ── Voltar ao menu ── */
  window._jogoVoltar = function () {
    if (memState && memState.intervalo) clearInterval(memState.intervalo);
    memState = null;
    buildJogosMenu();
  };

  /* ── Embaralhar (Fisher-Yates) ── */
  function embaralhar(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ── Integração com showTab do app ── */
  // Reconstrói o menu toda vez que a aba Jogos é aberta
  const _showTabOriginal = window.showTab;
  window.showTab = function (nome) {
    if (typeof _showTabOriginal === 'function') _showTabOriginal(nome);
    if (nome === 'jogos') buildJogosMenu();
  };

  /* ── Init ── */
  function init() {
    // Pré-renderiza o menu para a primeira abertura
    buildJogosMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
