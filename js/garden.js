// ── FLOWERS ──
function checkFlower() {
  const weekKeys = [];
  const now = new Date();
  const dayOfWeek = now.getDay();
  for(let i=0;i<7;i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - dayOfWeek + i);
    weekKeys.push(localDateStr(d));
  }
  const weekDone = weekKeys.filter(k=>state.weekDays[k]).length;
  const weekId = weekKeys[0];
  if(weekDone >= 5 && !state.flowers.find(f=>f.week===weekId)) {
    const types = ['sunflower','rose','lavender','daisy','tulip','cherry'];
    const t = types[state.flowers.length % types.length];
    state.flowers.push({week:weekId, type:t, date:TODAY});
    save(state);
    toast('🌸 Nova flor no jardim! Semana incrível!');
    playSprite('celebrate', false);
    if(document.getElementById('tab-jardim').classList.contains('active')) buildGarden();
  }
}

// ── FLOWER SVG ──
const FLOWER_SVG = {
  sunflower: (x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-1" y="5" width="2" height="20" fill="#5a9e3a"/>
    <rect x="-4" y="10" width="3" height="2" fill="#5a9e3a"/>
    <rect x="-9" y="9" width="5" height="3" fill="#5a9e3a"/>
    <circle cx="0" cy="0" r="7" fill="#f5c842"/>
    <circle cx="0" cy="-6" r="3" fill="#f5c842"/>
    <circle cx="0" cy="6" r="3" fill="#f5c842"/>
    <circle cx="-6" cy="0" r="3" fill="#f5c842"/>
    <circle cx="6" cy="0" r="3" fill="#f5c842"/>
    <circle cx="-4" cy="-4" r="3" fill="#f5c842"/>
    <circle cx="4" cy="-4" r="3" fill="#f5c842"/>
    <circle cx="-4" cy="4" r="3" fill="#f5c842"/>
    <circle cx="4" cy="4" r="3" fill="#f5c842"/>
    <circle cx="0" cy="0" r="5" fill="#8B4513"/>
    <circle cx="-2" cy="-2" r="1" fill="#5a2a0a"/>
    <circle cx="1" cy="-1" r="1" fill="#5a2a0a"/>
    <circle cx="-1" cy="2" r="1" fill="#5a2a0a"/>
  </g>`,
  rose: (x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-1" y="5" width="2" height="20" fill="#5a9e3a"/>
    <rect x="-3" y="12" width="8" height="2" fill="#5a9e3a"/>
    <circle cx="0" cy="0" r="6" fill="#c62a47"/>
    <circle cx="-3" cy="2" r="4" fill="#e03355"/>
    <circle cx="3" cy="2" r="4" fill="#e03355"/>
    <circle cx="0" cy="-2" r="4" fill="#e03355"/>
    <circle cx="0" cy="0" r="3" fill="#c62a47"/>
    <circle cx="0" cy="0" r="2" fill="#a01a30"/>
  </g>`,
  lavender: (x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-1" y="5" width="2" height="22" fill="#5a9e3a"/>
    <rect x="-3" y="-10" width="2" height="16" fill="#7b5ea7"/>
    <rect x="1" y="-8" width="2" height="14" fill="#7b5ea7"/>
    <rect x="-5" y="-12" width="2" height="12" fill="#9b7ec8"/>
    <rect x="3" y="-11" width="2" height="12" fill="#9b7ec8"/>
  </g>`,
  daisy: (x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-1" y="5" width="2" height="20" fill="#5a9e3a"/>
    <circle cx="0" cy="-7" r="3" fill="#fff"/>
    <circle cx="7" cy="0" r="3" fill="#fff"/>
    <circle cx="-7" cy="0" r="3" fill="#fff"/>
    <circle cx="0" cy="7" r="3" fill="#fff"/>
    <circle cx="5" cy="-5" r="3" fill="#fff"/>
    <circle cx="-5" cy="-5" r="3" fill="#fff"/>
    <circle cx="5" cy="5" r="3" fill="#fff"/>
    <circle cx="-5" cy="5" r="3" fill="#fff"/>
    <circle cx="0" cy="0" r="4" fill="#f5c842"/>
  </g>`,
  tulip: (x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-1" y="5" width="2" height="20" fill="#5a9e3a"/>
    <ellipse cx="-4" cy="-4" rx="4" ry="8" fill="#e05080"/>
    <ellipse cx="4" cy="-4" rx="4" ry="8" fill="#e05080"/>
    <ellipse cx="0" cy="-6" rx="3" ry="7" fill="#f070a0"/>
  </g>`,
  cherry: (x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-1" y="5" width="2" height="20" fill="#5a9e3a"/>
    <path d="M-8,-12 Q-4,-18 0,-14 Q4,-18 8,-12" stroke="#5a9e3a" stroke-width="2" fill="none"/>
    <circle cx="-8" cy="-12" r="4" fill="#d42020"/>
    <circle cx="8" cy="-12" r="4" fill="#d42020"/>
    <circle cx="-7" cy="-13" r="1" fill="#ff6060"/>
    <circle cx="7" cy="-13" r="1" fill="#ff6060"/>
  </g>`,
};

// ── ITENS DA LOJA em SVG (nítidos no Canvas) ──
const SHOP_SVG = {
  banco: (lvl) => `<g>
    <!-- pernas -->
    <rect x="-14" y="4" width="3" height="10" fill="#8B5E3C"/>
    <rect x="11" y="4" width="3" height="10" fill="#8B5E3C"/>
    <!-- assento -->
    <rect x="-16" y="0" width="32" height="5" rx="2" fill="#C49A6C"/>
    <rect x="-14" y="-1" width="28" height="3" rx="1" fill="#D4AA80"/>
    ${lvl >= 1 ? `<circle cx="-18" cy="-4" r="4" fill="#4a8c30"/><circle cx="-14" cy="-7" r="3" fill="#5aaa38"/>` : ''}
    ${lvl >= 2 ? `<circle cx="16" cy="-4" r="4" fill="#4a8c30"/><circle cx="12" cy="-7" r="3" fill="#5aaa38"/>` : ''}
    ${lvl >= 3 ? `<circle cx="-1" cy="-6" r="3" fill="#e03355"/><circle cx="5" cy="-8" r="2" fill="#f5c842"/>` : ''}
  </g>`,

  fonte: (lvl) => `<g>
    <!-- base -->
    <ellipse cx="0" cy="12" rx="16" ry="4" fill="#7a6a9a"/>
    <!-- coluna -->
    <rect x="-4" y="-2" width="8" height="14" fill="#9a8ab8"/>
    <!-- bacia -->
    <ellipse cx="0" cy="-2" rx="14" ry="5" fill="#7a6a9a"/>
    <ellipse cx="0" cy="-4" rx="12" ry="4" fill="#b0a0d0"/>
    <!-- água -->
    <ellipse cx="0" cy="-3" rx="10" ry="3" fill="${lvl>=1?'#6ab4f5':'#4a80b0'}"/>
    ${lvl >= 1 ? `<path d="M0,-10 Q2,-14 0,-18 Q-2,-14 0,-10" fill="#6ab4f5"/>` : ''}
    ${lvl >= 2 ? `<path d="M-5,-8 Q-3,-12 -5,-15" stroke="#6ab4f5" stroke-width="2" fill="none"/>
                  <path d="M5,-8 Q7,-12 5,-15" stroke="#6ab4f5" stroke-width="2" fill="none"/>` : ''}
    ${lvl >= 3 ? `<circle cx="0" cy="-20" r="2" fill="#a0d8ff"/>
                  <circle cx="-6" cy="-17" r="1.5" fill="#a0d8ff"/>
                  <circle cx="6" cy="-17" r="1.5" fill="#a0d8ff"/>` : ''}
  </g>`,

  lampiao: (lvl) => `<g>
    <!-- poste -->
    <rect x="-2" y="-4" width="4" height="22" fill="#5a5a7a"/>
    <ellipse cx="0" cy="18" rx="7" ry="2" fill="#4a4a6a"/>
    <!-- cabeça -->
    <rect x="-7" y="-18" width="14" height="14" rx="2" fill="#7a7a9a"/>
    <!-- vidro/luz -->
    <rect x="-5" y="-16" width="10" height="10" rx="1" fill="${lvl===0?'#cccc88':lvl===1?'#ffee66':lvl===2?'#ffcc00':'#fff4a0'}"/>
    <!-- teto -->
    <polygon points="0,-22 -9,-16 9,-16" fill="#5a5a7a"/>
    ${lvl >= 1 ? `<ellipse cx="0" cy="-11" rx="8" ry="3" fill="rgba(255,220,80,0.25)"/>` : ''}
    ${lvl >= 2 ? `<ellipse cx="0" cy="-8" rx="12" ry="5" fill="rgba(255,220,80,0.15)"/>` : ''}
    ${lvl >= 3 ? `<circle cx="8" cy="-20" r="2" fill="#fff4a0"/><circle cx="-8" cy="-18" r="1.5" fill="#fff4a0"/>` : ''}
  </g>`,

  borboleta: (lvl) => `<g>
    <!-- corpo -->
    <ellipse cx="0" cy="0" rx="2" ry="6" fill="#3a2a1a"/>
    <!-- asas esquerda -->
    <ellipse cx="-8" cy="-4" rx="8" ry="5" fill="${lvl===0?'#c96fa8':lvl===1?'#e080c0':lvl===2?'#f090d0':'#ffb0e8'}" opacity="0.9"/>
    <ellipse cx="-6" cy="3" rx="5" ry="3" fill="${lvl===0?'#a05088':lvl===1?'#c060a0':'#e080c0'}" opacity="0.9"/>
    <!-- asas direita -->
    <ellipse cx="8" cy="-4" rx="8" ry="5" fill="${lvl===0?'#c96fa8':lvl===1?'#e080c0':lvl===2?'#f090d0':'#ffb0e8'}" opacity="0.9"/>
    <ellipse cx="6" cy="3" rx="5" ry="3" fill="${lvl===0?'#a05088':lvl===1?'#c060a0':'#e080c0'}" opacity="0.9"/>
    <!-- antenas -->
    <line x1="0" y1="-5" x2="-5" y2="-12" stroke="#3a2a1a" stroke-width="1"/>
    <line x1="0" y1="-5" x2="5" y2="-12" stroke="#3a2a1a" stroke-width="1"/>
    <circle cx="-5" cy="-12" r="1.5" fill="#3a2a1a"/>
    <circle cx="5" cy="-12" r="1.5" fill="#3a2a1a"/>
    ${lvl >= 2 ? `<circle cx="-8" cy="-5" r="2" fill="rgba(255,255,255,0.4)"/><circle cx="8" cy="-5" r="2" fill="rgba(255,255,255,0.4)"/>` : ''}
    ${lvl >= 3 ? `<circle cx="0" cy="-2" r="1" fill="#f5c842"/>` : ''}
  </g>`,

  arcoiris: (lvl) => `<g transform="translate(0,8)">
    <path d="M-20,0 A20,20 0 0,1 20,0" stroke="#f55" stroke-width="3" fill="none"/>
    <path d="M-17,0 A17,17 0 0,1 17,0" stroke="#f90" stroke-width="3" fill="none"/>
    <path d="M-14,0 A14,14 0 0,1 14,0" stroke="#ff0" stroke-width="3" fill="none"/>
    <path d="M-11,0 A11,11 0 0,1 11,0" stroke="#4d4" stroke-width="3" fill="none"/>
    <path d="M-8,0 A8,8 0 0,1 8,0"   stroke="#48f" stroke-width="3" fill="none"/>
    <path d="M-5,0 A5,5 0 0,1 5,0"   stroke="#a4f" stroke-width="3" fill="none"/>
    ${lvl >= 1 ? `<circle cx="-22" cy="0" r="3" fill="rgba(255,255,255,0.6)"/><circle cx="22" cy="0" r="3" fill="rgba(255,255,255,0.6)"/>` : ''}
    ${lvl >= 2 ? `<circle cx="0" cy="-20" r="2" fill="#fff4a0"/><circle cx="-14" cy="-14" r="1.5" fill="#fff4a0"/>` : ''}
    ${lvl >= 3 ? `<circle cx="14" cy="-14" r="2" fill="#fff"/><circle cx="0" cy="-22" r="3" fill="#fff"/>` : ''}
  </g>`,

  gatinho: (lvl) => `<g>
    <!-- corpo -->
    <ellipse cx="0" cy="6" rx="10" ry="8" fill="${lvl>=2?'#e8b0d0':'#d4a0c0'}"/>
    <!-- cabeça -->
    <circle cx="0" cy="-6" r="9" fill="${lvl>=2?'#e8b0d0':'#d4a0c0'}"/>
    <!-- orelhas -->
    <polygon points="-9,-12 -5,-18 -2,-12" fill="${lvl>=2?'#e8b0d0':'#d4a0c0'}"/>
    <polygon points="9,-12 5,-18 2,-12" fill="${lvl>=2?'#e8b0d0':'#d4a0c0'}"/>
    <polygon points="-8,-13 -5,-17 -3,-13" fill="#f0a0b8"/>
    <polygon points="8,-13 5,-17 3,-13" fill="#f0a0b8"/>
    <!-- rosto -->
    <circle cx="-3" cy="-7" r="2" fill="#2a1a2a"/>
    <circle cx="3" cy="-7" r="2" fill="#2a1a2a"/>
    <circle cx="-2.5" cy="-7.5" r="0.8" fill="#fff"/>
    <circle cx="3.5" cy="-7.5" r="0.8" fill="#fff"/>
    <ellipse cx="0" cy="-4" rx="2" ry="1" fill="#f080a0"/>
    <!-- bigodes -->
    <line x1="-9" y1="-5" x2="-3" y2="-4" stroke="#8a6a8a" stroke-width="0.8"/>
    <line x1="9" y1="-5" x2="3" y2="-4" stroke="#8a6a8a" stroke-width="0.8"/>
    <!-- cauda -->
    <path d="M10,8 Q18,4 16,14" stroke="${lvl>=2?'#e8b0d0':'#d4a0c0'}" stroke-width="3" fill="none"/>
    ${lvl >= 1 ? `<text x="-4" y="2" font-size="6" fill="#555">z</text><text x="2" y="-1" font-size="5" fill="#777">z</text>` : ''}
    ${lvl >= 3 ? `<circle cx="-12" cy="-8" r="2" fill="#f5c842"/><circle cx="12" cy="-8" r="2" fill="#f5c842"/>` : ''}
  </g>`,

  cogumelo: (lvl) => `<g>
    <!-- caule -->
    <rect x="-4" y="2" width="8" height="12" rx="2" fill="#e8dcc8"/>
    <!-- chapéu -->
    <ellipse cx="0" cy="2" rx="12" ry="4" fill="${lvl>=2?'#e04040':'#cc3030'}"/>
    <path d="M-12,2 Q-10,-12 0,-14 Q10,-12 12,2" fill="${lvl>=2?'#e04040':'#cc3030'}"/>
    <!-- pintas -->
    <circle cx="-4" cy="-6" r="2.5" fill="#fff"/>
    <circle cx="4" cy="-4" r="2" fill="#fff"/>
    <circle cx="0" cy="-10" r="1.5" fill="#fff"/>
    ${lvl >= 1 ? `
    <rect x="8" y="-2" width="5" height="8" rx="1.5" fill="#e8dcc8"/>
    <ellipse cx="10.5" cy="-2" rx="7" ry="2.5" fill="${lvl>=2?'#e04040':'#cc3030'}"/>
    <path d="M3.5,-2 Q5,-10 10.5,-11 Q16,-10 17.5,-2" fill="${lvl>=2?'#e04040':'#cc3030'}"/>
    <circle cx="9" cy="-6" r="1.5" fill="#fff"/>
    ` : ''}
    ${lvl >= 3 ? `<circle cx="-2" cy="-12" r="2" fill="#f5c842"/><circle cx="5" cy="-13" r="1.5" fill="#fff4a0"/>` : ''}
  </g>`,

  estrelas: (lvl) => `<g>
    <polygon points="0,-14 3,-6 11,-6 5,-1 7,7 0,2 -7,7 -5,-1 -11,-6 -3,-6"
      fill="${lvl===0?'#c8c840':lvl===1?'#e8e050':lvl===2?'#f5c842':'#fff4a0'}"/>
    ${lvl >= 1 ? `
    <polygon points="14,-10 16,-5 21,-5 17,-2 18,3 14,0 10,3 11,-2 7,-5 12,-5"
      fill="#c8c840" opacity="0.8"/>
    <polygon points="-14,-8 -12,-4 -8,-4 -11,-1 -10,3 -14,1 -18,3 -17,-1 -20,-4 -16,-4"
      fill="#c8c840" opacity="0.7"/>` : ''}
    ${lvl >= 2 ? `<circle cx="0" cy="-14" r="2" fill="#fff"/><circle cx="11" cy="-6" r="1.5" fill="#fff"/>` : ''}
    ${lvl >= 3 ? `
    <circle cx="-6" cy="-16" r="1.5" fill="#a0e8ff"/>
    <circle cx="8" cy="-15" r="1" fill="#a0e8ff"/>
    <circle cx="16" cy="-10" r="1.5" fill="#a0e8ff"/>` : ''}
  </g>`,
};

function drawShopItemSVG(ctx, itemId, cx, cy, lvl) {
  const svgContent = SHOP_SVG[itemId];
  if (!svgContent) return;

  const scale = 1.4 + lvl * 0.15;
  const size = Math.round(60 * scale);

  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-24 -24 48 48">
    <g transform="scale(${scale})">${svgContent(lvl)}</g>
  </svg>`;

  const img = new Image();
  img.onload = () => {
    // glow com nível
    if (lvl >= 1) {
      ctx.save();
      ctx.shadowColor = lvl >= 3 ? '#f5c842' : lvl >= 2 ? '#c96fa8' : 'rgba(255,255,255,0.5)';
      ctx.shadowBlur = 8 + lvl * 6;
      ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
      ctx.restore();
    } else {
      ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
    }
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
}

const grassColors = ['#2d5a1b','#356b20','#3d7a25','#2a5018','#4a8c30'];
const treeColors = ['#3d7a25','#2d5a1b','#4a8c30'];

function drawGarden() {
  const canvas = document.getElementById('jardimCanvas');
  const W = canvas.offsetWidth || 360;
  canvas.width = W;
  const H = 220;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // sky
  const skyGrad = ctx.createLinearGradient(0,0,0,H*0.55);
  skyGrad.addColorStop(0,'#1a1030');
  skyGrad.addColorStop(1,'#3a1f5a');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0,0,W,H*0.55);

  // stars
  ctx.fillStyle='rgba(255,255,255,0.7)';
  const stars=[[30,20],[80,15],[120,30],[200,10],[250,25],[300,18],[340,35],[60,40],[150,45],[280,40]];
  stars.forEach(([sx,sy])=>{ ctx.fillRect(sx,sy,2,2); });

  // moon
  ctx.fillStyle='#f5e6a0';
  ctx.beginPath(); ctx.arc(W-50,35,16,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#3a1f5a';
  ctx.beginPath(); ctx.arc(W-44,31,13,0,Math.PI*2); ctx.fill();

  // ground layers
  const gGrad = ctx.createLinearGradient(0,H*0.52,0,H);
  gGrad.addColorStop(0,'#1e4010');
  gGrad.addColorStop(0.3,'#2a5a18');
  gGrad.addColorStop(1,'#1a3a0c');
  ctx.fillStyle = gGrad;
  ctx.fillRect(0,H*0.52,W,H);

  // pixel grass strip
  for(let px=0;px<W;px+=4) {
    const h = 8 + Math.sin(px*0.3)*4 + Math.random()*4;
    ctx.fillStyle = grassColors[Math.floor(px/4)%grassColors.length];
    ctx.fillRect(px, H*0.52-h, 4, h+2);
  }

  // path
  ctx.fillStyle='rgba(180,150,80,0.25)';
  ctx.beginPath();
  ctx.ellipse(W*0.35, H*0.75, 60, 20, 0, 0, Math.PI*2);
  ctx.fill();

  // trees bg
  [[W*0.08,H*0.52],[W*0.85,H*0.52],[W*0.6,H*0.48]].forEach(([tx,ty])=>{
    ctx.fillStyle='#2a4a18';
    ctx.fillRect(tx-4,ty,8,30);
    ctx.fillStyle=treeColors[0];
    ctx.beginPath(); ctx.moveTo(tx,ty-30); ctx.lineTo(tx-18,ty+5); ctx.lineTo(tx+18,ty+5); ctx.closePath(); ctx.fill();
    ctx.fillStyle=treeColors[1];
    ctx.beginPath(); ctx.moveTo(tx,ty-44); ctx.lineTo(tx-13,ty-18); ctx.lineTo(tx+13,ty-18); ctx.closePath(); ctx.fill();
  });

  // flowers from state
  const flowerSlots = [
    [W*0.15,H*0.62],[W*0.28,H*0.60],[W*0.42,H*0.64],
    [W*0.56,H*0.61],[W*0.70,H*0.63],[W*0.82,H*0.60],
    [W*0.20,H*0.72],[W*0.35,H*0.70],[W*0.50,H*0.73],[W*0.65,H*0.71],
  ];
  state.flowers.forEach((f,i)=>{
    if(i>=flowerSlots.length) return;
    const [fx,fy] = flowerSlots[i];
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="-20 -25 40 50">${FLOWER_SVG[f.type](0,0,1.1)}</svg>`;
    const img = new Image();
    img.onload = ()=>ctx.drawImage(img,fx-20,fy-30,40,50);
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgStr);
  });

  // empty flower spots (dashed)
  const emptyStart = state.flowers.length;
  const showEmpty = Math.min(3, flowerSlots.length - emptyStart);
  for(let i=emptyStart;i<emptyStart+showEmpty;i++){
    if(i>=flowerSlots.length) break;
    const [fx,fy]=flowerSlots[i];
    ctx.strokeStyle='rgba(255,255,255,0.15)';
    ctx.setLineDash([3,3]);
    ctx.strokeRect(fx-8,fy-8,16,16);
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,255,255,0.1)';
    ctx.font='14px sans-serif';
    ctx.fillText('?',fx-5,fy+5);
  }

  // ── ITENS DA LOJA no jardim em SVG ──
  const owned = state.owned || [];
  owned.forEach(id => {
    const item = SHOP_ITEMS.find(s => s.id === id);
    if (!item) return;
    const lvl = getItemLevel(id);
    const ix = item.gx * W;
    const iy = item.gy * H;
    drawShopItemSVG(ctx, id, ix, iy, lvl);
  });
}

function buildGarden() {
  drawGarden();
  // flower list
  const list = document.getElementById('gardenFlowers');
  list.innerHTML = '';
  const names = {sunflower:'Girassol',rose:'Rosa',lavender:'Lavanda',daisy:'Margarida',tulip:'Tulipa',cherry:'Cerejeira'};
  state.flowers.forEach(f=>{
    const slot = document.createElement('div');
    slot.className='flower-slot';
    slot.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -25 40 55">${FLOWER_SVG[f.type](0,0,1)}</svg>`;
    slot.title=names[f.type]||f.type;
    list.appendChild(slot);
  });
  const missing = Math.max(0, 5 - state.flowers.length);
  for(let i=0;i<missing;i++){
    const slot=document.createElement('div');
    slot.className='flower-slot';
    slot.innerHTML='<span style="font-size:18px;opacity:.3">🌱</span>';
    list.appendChild(slot);
  }
  document.getElementById('gardenWeekLabel').textContent = `${state.flowers.length} flores ganhas`;
}
