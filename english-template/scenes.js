// EP02《先背后缀，最划算》· Q版小人讲解片 · 7 页 76 秒 · 晓晓旁白
// 旁白节奏：每页头 0.6s 起说，页长=旁白+演完动作（narration.json/durations.json 为准）

const DURATION = 76.0;

// ---------- 角色 ----------
const T = { robe: '#3a6ea5', robe2: '#2c5275' };   // 老师
const S = { robe: '#a06a3a', robe2: '#8a5a30' };   // 学生
const SEA = '#1c2129';

// ---------- 道具（与 EP01 同族） ----------
const BCOL = {
  pre:  ['#3d6d99', '#2c5275', '#b9d7ef'],
  root: ['#b0453a', '#8a3029', '#f2b3a8'],
  suf:  ['#3f8a5a', '#2c6a42', '#b4dfc4'],
  gold: ['#a8823c', '#8a6a2c', '#f4d9a0'],
  gray: ['#5a616e', '#454b56', '#c3c9d2'],
  word: ['#6b7484', '#525a66', '#c3c9d2'],
};
function rrRect(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function block(x, y, w, h, text, kind, o = {}) {
  const [c1, c2, edge] = BCOL[kind];
  g.save(); g.globalAlpha = o.a == null ? 1 : o.a;
  g.translate(x, y); g.rotate(o.rot || 0); g.scale(o.sqx || 1, o.sqy || 1);
  if (o.glow) glow(0, 0, w * .9, o.glow);
  const rr = Math.min(26, h * .28);
  g.fillStyle = c2; rrRect(-w / 2, -h + h * .1, w, h, rr); g.fill();
  const gr = g.createLinearGradient(0, -h, 0, 0); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
  g.fillStyle = gr; rrRect(-w / 2, -h, w, h, rr); g.fill();
  g.fillStyle = 'rgba(255,255,255,.16)'; rrRect(-w / 2 + 6, -h + 5, w - 12, h * .26, rr * .5); g.fill();
  g.strokeStyle = edge; g.lineWidth = 3; rrRect(-w / 2, -h, w, h, rr); g.stroke();
  g.font = `900 ${o.fs || Math.min(h * .52, w * .34)}px ${SERIF}`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#fdf8ec'; g.fillText(text, 0, -h * .44 - (o.sub ? h * .1 : 0));
  if (o.sub) { g.font = `600 ${Math.min(30, h * .3)}px ${SANS}`; g.fillStyle = o.subC || edge; g.fillText(o.sub, 0, -h * .22); }
  g.restore();
}
const WORDS = (() => { const r = rng(42), L = 'abcdefghijklmnopqrstuvwxyz', out = []; for (let i = 0; i < 90; i++) { let w = ''; const n = 3 + Math.floor(r() * 6); for (let j = 0; j < n; j++) w += L[Math.floor(r() * 26)]; out.push(w); } return out; })();
function wordSea(t, o = {}) {
  const n = o.n || 46, [ax, ay, aw, ah] = o.area || [80, 240, 1760, 560], r = rng(o.seed || 7);
  g.save(); g.textAlign = 'center';
  for (let i = 0; i < n; i++) {
    const wx0 = ax + r() * aw, wy0 = ay + r() * ah, s = 26 + r() * 26;
    let x = wx0, y = wy0, a = (o.dim ? .8 : .9) * (.55 + r() * .45);
    if (o.fall) y = wy0 - o.fall * (900 + r() * 500);
    if (o.blow) { x = wx0 - eio(o.blow) * (1400 + r() * 900); a *= (1 - o.blow); }
    if (o.tide) y = wy0 + eout(o.tide) * (500 + r() * 300);
    if (y > H + 60 || x < -300) continue;
    g.globalAlpha = a; g.font = `${s > 34 ? 700 : 400} ${s}px ${SERIF}`;
    g.fillStyle = o.col || '#8b93a3'; g.fillText(WORDS[i % WORDS.length], x, y);
  }
  g.restore();
}
function blackboard(x, y, w, h) {
  g.fillStyle = '#5a3d22'; g.fillRect(x - 26, y - 26, w + 52, h + 52);
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x - 26, y + h + 12, w + 52, 26);
  g.fillStyle = '#6b4a2a'; g.fillRect(x - 34, y + h + 6, w + 68, 30);
  g.fillStyle = '#f2ead9'; g.fillRect(x - 6, y + h + 16, 54, 10);
  const gr = g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, '#2c4436'); gr.addColorStop(1, '#233729');
  g.fillStyle = gr; g.fillRect(x, y, w, h);
  g.fillStyle = 'rgba(255,255,255,.045)';
  g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + w * .55, y); g.lineTo(x + w * .8, y); g.lineTo(x + w * .25, y + h); g.closePath(); g.fill();
}
function chalk(x, y, s, str, col = 'rgba(240,236,220,.92)', align = 'left') {
  g.save(); g.font = `700 ${s}px ${SANS}`; g.fillStyle = col; g.textAlign = align; g.fillText(str, x, y); g.restore();
}
// 切词剪刀线：虚线闪过 + 两半弹开
function cutFlash(t, t0, x, y, w, h) {
  const k = prog(t, t0, t0 + .18);
  if (k <= 0 || k >= 1) return 0;
  g.save(); g.strokeStyle = `rgba(255,120,100,${1 - k})`; g.lineWidth = 5; g.setLineDash([18, 12]);
  g.beginPath(); g.moveTo(x, y - h - 14); g.lineTo(x, y + 14); g.stroke(); g.restore();
  return k;
}

// ---------- P1 钩子（0-9.5）：abandon 大书压学生 → 老师举绿尾巴 ----------
function s1(T) {
  const t = T;
  camStd(t, [[0, 1.06, 960, 520], [9.5, 1.12, 880, 540]]);
  room(t, SEA, DECK, 1000, .6);
  wordSea(t, { n: 34, area: [80, 170, 1760, 480], seed: 7, dim: 1, col: '#78818f' });
  const stu = P({ who: 'strong', ...S, x: 700, face: { eye: 'xx', mouth: 'wave' } });
  if (t > 1.8) stu.sy = kf(t, [[1.8, 1], [2.1, .55, eout], [2.4, .62]]);
  chibi(breathe(stu, T));
  // abandon 大书
  if (t > 1.6) {
    const by = kf(t, [[1.6, -700], [2.1, DECK - 200, ein]], lin);
    g.save(); g.translate(760, by); g.rotate(-.12);
    g.fillStyle = '#7a3428'; rrRect(-330, -160, 660, 220, 18); g.fill();
    g.strokeStyle = '#d9a64e'; g.lineWidth = 6; rrRect(-330, -160, 660, 220, 18); g.stroke();
    g.font = `900 96px ${SERIF}`; g.fillStyle = '#f4e8d4'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('abandon', 0, -50);
    g.restore();
    if (t > 2.1 && t < 3.2) dust(t, 2.1, 760, DECK, 200, 10, 5);
  }
  // 老师 4.4 进场举绿尾巴
  const tea = P({ who: 'zl', ...T, x: 1740, face: { eye: 'dot', mouth: 'small', look: [-1, -.3] } });
  const dist = kf(t, [[4.4, 0], [6.0, -540, eout]]); walk(tea, dist); tea.x += dist;
  if (t > 6.4) { tea.armR = kf(t, [[6.4, 0], [6.7, 2.5, eout], [9.5, 2.5]]); tea.face = { eye: 'smug', mouth: 'smirk', look: [-1, -.4] }; }
  chibi(breathe(tea, T));
  const [hx, hy] = HEAD(tea);
  if (t > 6.9) block(hx + 90, hy - 10, 240, 100, '-ness', 'suf', { glow: .5 });
  if (t > 6.0) stars(t, 6.05, 8.6, 700, DECK - 1.7 * D, 55);
}

// ---------- P2 原理（9.5-19.5）：只管词性 ----------
function s2(T) {
  const t = T - 9.5;
  camStd(t, [[0, 1.05, 960, 500], [10, 1.1, 900, 520]]);
  room(t, '#2a2119', DECK, 900);
  blackboard(340, 170, 1240, 450);
  chalk(420, 300, 54, '后缀 = 只管词性');
  const tea = P({ who: 'zl', ...T, x: 600, face: { eye: 'dot', mouth: 'smile' } });
  // 绿尾巴扫过一排词，尾巴闪绿
  const sweep = prog(t, 3.2, 7.2);
  const ROW = ['action', 'happy', 'decide', 'manage', 'inform'];
  ROW.forEach((w0, i) => {
    const x = 760 + i * 220, y = 520;
    g.save(); g.font = `700 44px ${SERIF}`; g.textAlign = 'center';
    g.fillStyle = '#c9cfd8'; g.fillText(w0, x, y); g.restore();
    const hit = clamp(sweep * 5 - i);
    if (hit > 0) { g.save(); g.font = `900 44px ${SERIF}`; g.textAlign = 'center'; g.fillStyle = '#7fd39a'; g.globalAlpha = .35 + .65 * hit; g.fillText('ion', x + 40, y + 44); g.restore(); }
  });
  const arrowX = 760 + sweep * 880;
  if (sweep > 0 && sweep < 1) { g.save(); g.strokeStyle = '#7fd39a'; g.lineWidth = 8; g.beginPath(); g.moveTo(arrowX, 460); g.quadraticCurveTo(arrowX + 40, 430, arrowX + 80, 460); g.stroke(); g.restore(); }
  if (t > 7.6) tea.armR = 1.2 + .1 * Math.sin(t * 5);
  chibi(breathe(tea, T));
}

// ---------- P3 ness（19.5-31.5）：happy+ness 拼装 ----------
function s3(T) {
  const t = T - 19.5;
  camStd(t, [[0, 1.05, 960, 500], [8, 1.14, 860, 480], [12, 1.05, 960, 510]]);
  room(t, '#2a2119', DECK, 900);
  blackboard(300, 160, 1320, 500);
  chalk(390, 300, 48, '形容词 ＋ ness → 名词');
  const tea = P({ who: 'zl', ...T, x: 700, face: { eye: 'dot', mouth: 'small', look: [1, -.2] } });
  const stu = P({ who: 'strong', ...S, x: 1660, face: { eye: 'wide', mouth: 'o', look: [-1, -.4] } });
  // 1.2s 蓝块 happy 飞、3.2s 绿块 ness 飞 → 4.4 对接成 happiness → 6.0 词性牌翻转 → 8.6 countRoll 213
  const up1 = prog(t, 1.2, 2.2), up2 = prog(t, 3.2, 4.2);
  if (up1 > 0 && t < 4.4) block(lerp(500, 900, eio(up1)), DECK - 560 - Math.sin(Math.PI * up1) * 200, 300, 110, 'happy', 'word', {});
  if (up2 > 0 && t < 4.4) block(lerp(1500, 1180, eio(up2)), DECK - 560 - Math.sin(Math.PI * up2) * 160, 260, 110, 'ness', 'suf', {});
  if (t > 4.4) {
    const sq = kf(t, [[4.4, 1], [4.6, .6, eout], [4.8, 1.12], [5.05, 1]]);
    const fy = kf(t, [[4.4, DECK - 700], [5.3, DECK - 540, eout], [5.55, DECK - 568], [5.8, DECK - 560]]);
    g.save(); g.translate(1040, fy);
    block(-155, 0, 310, 110, 'happy', 'word', { sqx: sq });
    block(155, 0, 310, 110, 'ness', 'suf', { sqx: sq, glow: .35 });
    g.restore();
    if (t > 5.0) glow(1040, fy - 60, 300, .5);
    // 词性牌：adj → n 翻转
    if (t > 6.0) {
      const flip = prog(t, 6.0, 6.6);
      const sx = Math.abs(Math.cos(flip * Math.PI));
      g.save(); g.translate(1480, fy - 40);
      g.scale(Math.max(.06, sx), 1);
      g.fillStyle = flip < .5 ? '#5a616e' : '#a8823c'; rrRect(-110, -50, 220, 100, 14); g.fill();
      g.strokeStyle = '#e8dcc0'; g.lineWidth = 3; rrRect(-110, -50, 220, 100, 14); g.stroke();
      g.font = `900 52px ${SANS}`; g.fillStyle = '#fdf8ec'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(flip < .5 ? 'adj' : 'n.', 0, 4); g.restore();
    }
  }
  if (t > 8.8 && t < 10.4) { const [sx2, sy2] = HEAD(stu); pop(t, 8.9, '秒变名词！', sx2 - 20, sy2 + 30, 40, { ttl: 1.4, font: SANS, weight: 700 }); }
  chibi(breathe(tea, T)); chibi(breathe(stu, T, 1.2));
}

// ---------- P4 ion/ment 两大出口（31.5-42.5） ----------
const EX4 = [['action', 'act', 'ion'], ['decision', 'decide', 'sion'], ['management', 'manage', 'ment']];
function s4(T) {
  const t = T - 31.5;
  camStd(t, [[0, 1.05, 960, 500], [8, 1.12, 900, 490], [11, 1.02, 960, 520]]);
  room(t, '#2a2119', DECK, 900);
  const tea = P({ who: 'zl', ...T, x: 1700, face: { eye: 'smug', mouth: 'smirk', look: [-1, -.3] } });
  chibi(breathe(tea, T));
  if (t > 5.6) tea.armR = 1.1 + .12 * Math.sin(t * 5);
  EX4.forEach(([w0, v0, tail], i) => {
    const t0 = .8 + i * 1.7, y = 350 + i * 200;
    if (t < t0) return;
    // 整词块入场 → 1.0s 后尾巴切开弹绿
    const inA = prog(t, t0, t0 + .4);
    const cutT = t0 + 1.0;
    const cut = cutFlash(t, cutT, 1210, y + 30, 0, 60);
    const sep = kf(t, [[cutT, 0], [cutT + .3, 150, eout]], lin);
    g.save(); g.globalAlpha = inA;
    block(1210 - 150 - sep * .5, y, 520, 100, v0, 'word', { fs: 52 });
    block(1210 + 180 + sep, y, 250, 100, tail, 'suf', { fs: 46, glow: .3 });
    g.restore();
    if (t > cutT + .1 && t < cutT + .9) ring(t, cutT, 1210, y - 20, 120, 36, .5, 3);
  });
  if (t > 7.0) { chalk(300, 330, 44, '动词 → 名词'); chalk(300, 430, 40, '两大出口', 'rgba(246,242,228,.9)'); }
}

// ---------- P5 实战拆词（42.5-55.0） ----------
function s5(T) {
  const t = T - 42.5;
  camStd(t, [[0, 1.06, 960, 490], [7, 1.14, 880, 480], [12.5, 1.03, 960, 510]]);
  room(t, '#2a2119', DECK, 900);
  const tea = P({ who: 'zl', ...T, x: 1760, face: { eye: 'dot', mouth: 'small', look: [-1, -.3] } });
  chibi(breathe(tea, T));
  // information 拆
  const cut1 = 2.0, cut2 = 7.5;
  if (t < 6.8) {
    block(960, 400, 760, 110, 'information', 'word', { fs: 60, a: t < 1.2 ? prog(t, .4, 1.2) : 1 });
    const c1 = cutFlash(t, cut1, 700, 400, 760, 110);
    const sep = kf(t, [[cut1, 0], [cut1 + .35, 190, eout]], lin);
    if (sep > 0) {
      g.save();
      g.font = `900 60px ${SERIF}`; g.textAlign = 'center';
      g.fillStyle = '#c9cfd8'; g.fillText('inform', 960 - 95 - sep * .6, 408); g.restore();
      block(960 + 150 + sep, 400, 300, 104, 'ation', 'suf', { fs: 48, glow: .3 });
      if (t > cut1 + .8) pop(t, cut1 + .8, '信息', 960 + 150 + sep, 280, 42, { ttl: 3.2, font: SANS, weight: 900 });
    }
  } else {
    // development 拆（第二例）
    block(960, 400, 800, 110, 'development', 'word', { fs: 60, a: prog(t, 6.8, 7.4) });
    cutFlash(t, cut2, 760, 400, 800, 110);
    const sep = kf(t, [[cut2, 0], [cut2 + .35, 200, eout]], lin);
    if (sep > 0) {
      g.save(); g.font = `900 60px ${SERIF}`; g.textAlign = 'center'; g.fillStyle = '#c9cfd8'; g.fillText('develop', 960 - 100 - sep * .6, 408); g.restore();
      block(960 + 160 + sep, 400, 260, 104, 'ment', 'suf', { fs: 48, glow: .3 });
      if (t > cut2 + .8) pop(t, cut2 + .8, '发展', 960 + 160 + sep, 280, 42, { ttl: 4.5, font: SANS, weight: 900 });
    }
  }
  const stu = P({ who: 'strong', ...S, x: 620, y: DECK, face: { eye: 'wide', mouth: 'O', look: [1, -.5] } });
  if (t > 3.4 && t < 5.2) stu.armR = kf(t, [[3.4, 0], [3.7, 2.8, eout], [5.2, 2.8]]);
  chibi(breathe(stu, T));
}

// ---------- P6 五后缀脸熟（55.0-66.5） ----------
const FIVE = [['-able', '可'], ['-ity', '性质'], ['-ful', '充满'], ['-less', '没有'], ['-ous', '具备']];
function s6(T) {
  const t = T - 55.0;
  camStd(t, [[0, 1.04, 960, 510], [8, 1.08, 960, 500], [11.5, 1.02, 960, 520]]);
  room(t, '#2a2119', DECK, 900);
  FIVE.forEach(([suf0, zh], i) => {
    const x = 260 + i * 350, t0 = .9 + i * .8;
    const sy = t < t0 ? 0 : kf(t, [[t0, 0], [t0 + .5, 1, eback], [t0 + .7, 1]]);
    if (sy > .02) {
      g.save(); g.translate(x, 420); g.scale(1, sy);
      block(0, 0, 280, 120, suf0, 'suf', { fs: 56, sub: zh });
      g.restore();
      if (t > t0 + .9) { g.save(); g.globalAlpha = clamp((t - t0 - .9) * 2); g.font = `900 38px ${SERIF}`; g.fillStyle = '#e8dcc0'; g.textAlign = 'center'; g.fillText(['available', 'quality', 'hopeful', 'useless', 'famous'][i], x, 620); g.restore(); }
    }
  });
  const tea = P({ who: 'zl', ...T, x: 960, y: DECK - 10, D: 170, face: { eye: 'happy', mouth: 'smile' } });
  tea.armL = .9 + .1 * Math.sin(t * 4); tea.armR = .9 + .1 * Math.sin(t * 4 + 1);
  chibi(breathe(tea, T));
  if (t > 5.4 && t < 7.4) { const [hx, hy] = HEAD(tea); pop(t, 5.5, '扫两遍就够', hx + 60, hy + 20, 40, { ttl: 1.8, font: SANS, weight: 700 }); }
}

// ---------- P7 收尾（66.5-76.0） ----------
function s7(T) {
  const t = T - 66.5;
  camStd(t, [[0, 1.06, 960, 500], [9.5, 1.0, 960, 530]]);
  room(t, '#2a2119', DECK, 900, 1.1);
  blackboard(360, 160, 1200, 470);
  const a = prog(t, .4, 1.4);
  g.save(); g.globalAlpha = a;
  chalk(960, 290, 66, '下集 · 前缀六天王', 'rgba(246,242,228,.95)', 'center');
  chalk(960, 390, 40, '和它们的马甲家族', 'rgba(240,236,220,.8)', 'center');
  g.restore();
  // 三巨头叠塔
  const TOWER = [['-ness', 'suf'], ['-ion', 'suf'], ['-ment', 'suf']];
  TOWER.forEach(([nm, k2], i) => {
    const yEnd = DECK - 130 - i * 150, k = kf(t, [[.8 + i * .5, 0], [1.3 + i * .5, 1, ein]], lin);
    if (k > 0) block(560, lerp(yEnd - 760, yEnd, k), 320, 130, nm, k2, { fs: 54, glow: .25 });
  });
  const tea = P({ who: 'zl', ...T, x: 1400, face: { eye: 'happy', mouth: 'grin' } });
  const stu = P({ who: 'strong', ...S, x: 1700, face: { eye: 'happy', mouth: 'grin', look: [-1, 0] } });
  if (t > 4.0) { tea.armR = kf(t, [[4.0, 0], [4.4, 2.8, eout], [8.0, 2.8], [8.6, 1.0, eout]]); if (t > 4.5 && t < 8.2) notes(t, 4.6, 8.0, 1520, DECK - 600, 1.0); }
  if (t > 4.2) stu.armL = stu.armR = .5 + .55 * Math.abs(Math.sin(t * 8));
  chibi(breathe(tea, T)); chibi(breathe(stu, T, 1.5));
}

const SCENES = [[0, s1], [9.5, s2], [19.5, s3], [31.5, s4], [42.5, s5], [55.0, s6], [66.5, s7]];

// ---------- 字幕 ----------
const PAGES = [
  [0.15, 9.2, [['最亏的顺序　从　a　到　abandon', .3], ['聪明的顺序　〔先背后缀〕', 5.2]]],
  [9.7, 19.2, [['后缀不管词义　只管〔词性〕', 9.9], ['认一个尾巴　切开【几百个词】', 13.4]]],
  [19.7, 31.2, [['巨头一号　【ness】213 词', 19.9], ['happy ＋ ness　＝　〔happiness〕', 24.6], ['形容词　|〔秒变名词〕', 26.4, 28.0]]],
  [31.7, 42.2, [['【ion】126 词　＋　【ment】116 词', 31.9], ['〔动词变名词〕的两大出口', 36.6]]],
  [42.7, 54.7, [['information ＝ inform ＋ ation', 42.9], ['development ＝ develop ＋ ment', 48.4], ['〔先切尾巴　词性锁死〕', 51.6]]],
  [55.2, 66.2, [['able 可　ity 性质　ful 满', 55.4], ['less 无　ous 有　〔脸熟即可〕', 58.6]]],
  [66.7, 75.6, [['一天【三巨头】　铺好 400+ 词次', 66.9], ['下集　〔前缀六天王〕', 70.4]]],
];
function overlay(t) {
  pages(t, PAGES);
  if (t > 19.5 && t < 31.5) countRoll(t, 28.3, 30.0, 0, 213, ' 词', W - 110, 150, 31.2, '#a8dcb8');
  if (t > 66.5 && t < 76) countRoll(t, 67.4, 69.2, 0, 455, ' 词次', W - 110, 150, 75.5, '#a8dcb8');
  footnote('系列第 2 期 · 数据源·云出没英语 311 词根表 · 人物和场面都是示意');
}
// ---------- 拟音 ----------
const CUES = [
  [2.0, 'whoosh2', .5], [2.1, 'thud', .9], [2.3, 'pop', .4],
  [4.6, 'hop', .4], [5.0, 'hop', .4], [5.5, 'hop', .4], [6.9, 'pop', .5], [7.1, 'blip', .4],
  [12.7, 'blip', .4], [13.9, 'blip', .4], [15.1, 'blip', .4], [16.3, 'blip', .4], [17.5, 'blip', .4],
  [20.6, 'hop', .5], [22.6, 'hop', .5], [23.9, 'tock', .7], [24.1, 'pop', .5], [25.5, 'drum', .4],
  [32.6, 'blip', .4], [33.1, 'tock', .5], [33.3, 'pop', .35], [34.3, 'blip', .4], [34.8, 'tock', .5], [35.0, 'pop', .35], [36.0, 'blip', .4], [36.5, 'tock', .5], [36.7, 'pop', .35],
  [43.2, 'blip', .4], [44.5, 'whoosh2', .5], [44.7, 'tock', .7], [44.9, 'pop', .5],
  [49.5, 'blip', .4], [50.0, 'whoosh2', .5], [50.2, 'tock', .7], [50.4, 'pop', .5],
  ...[0, 1, 2, 3, 4].flatMap(i => [[55.9 + i * .8, 'hop', .5], [56.4 + i * .8, 'tock', .45], [56.5 + i * .8, 'pop', .35]]),
  [60.5, 'blip', .4],
  [67.1, 'whoosh2', .5], [67.3, 'thud', .8], [67.6, 'whoosh2', .5], [67.8, 'thud', .8], [68.1, 'whoosh2', .5], [68.3, 'thud', .8], [68.5, 'drum', .6],
  [71.0, 'blip', .5], [71.5, 'pop', .5], [73.0, 'hop', .5],
];
