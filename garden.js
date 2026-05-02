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

// ── GARDEN ──
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

  // ── ITENS DA LOJA no jardim ──
  const owned = state.owned || [];
  owned.forEach(id=>{
    const item = SHOP_ITEMS.find(s=>s.id===id);
    if(!item) return;
    const lvl = getItemLevel(id);
    const icon = item.levels[Math.min(lvl, item.levels.length-1)];
    const ix = item.gx * W;
    const iy = item.gy * H;
    const size = 20 + lvl * 3;
    // glow que cresce com o nível
    if(lvl >= 1) {
      ctx.shadowColor = lvl>=3?'#f5c842':lvl>=2?'#c96fa8':'rgba(255,255,255,0.4)';
      ctx.shadowBlur = 6 + lvl * 5;
    }
    ctx.font = `${size}px sans-serif`;
    ctx.fillText(icon, ix - size/2, iy);
    ctx.shadowBlur = 0;
  });
}

function buildGarden() {
  drawGarden();
  // flower list
  const list = document.getElementById('gardenFlowers');
  list.innerHTML = '';
  const types = ['sunflower','rose','lavender','daisy','tulip','cherry'];
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