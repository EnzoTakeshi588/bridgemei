import { useState, useEffect, useRef } from "react";
import { getUserFromToken } from "./utils/auth";
import {
  Chart, ArcElement, DoughnutController, LineController, LineElement,
  PointElement, LinearScale, CategoryScale, Filler, Tooltip,
} from "chart.js";

Chart.register(
  ArcElement, DoughnutController, LineController, LineElement,
  PointElement, LinearScale, CategoryScale, Filler, Tooltip
);

/* ═══════════════════════════════════════════════════
   SHARED STYLES
═══════════════════════════════════════════════════ */
const BASE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #080810;
    --surface: rgba(255,255,255,0.04);
    --surface2: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.14);
    --text: #f0f0ff;
    --text2: rgba(240,240,255,0.45);
    --text3: rgba(240,240,255,0.2);
    --accent: #6366f1;
    --accent-h: #4f52d4;
    --accent-glow: rgba(99,102,241,0.07);
    --accent-border: rgba(99,102,241,0.28);
    --warning: #f59e0b;
    --danger: #ef4444;
    --success: #22c55e;
  }

  html, body { height: 100%; background: var(--bg); }

  .shell {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg); min-height: 100vh; color: var(--text);
    display: flex; flex-direction: column; position: relative; overflow-x: hidden;
  }
  .shell::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 10% 20%, rgba(99,102,241,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 90% 80%, rgba(34,197,94,0.05) 0%, transparent 60%);
    animation: ambient 30s ease-in-out infinite alternate;
  }
  @keyframes ambient {
    0%   { opacity: .8; transform: scale(1) translate(0,0); }
    50%  { opacity: 1;  transform: scale(1.05) translate(-2%,2%); }
    100% { opacity: .9; transform: scale(1) translate(1%,-1%); }
  }

  .hdr {
    position: relative; z-index: 100;
    display: flex; align-items: center; gap: 14px;
    padding: 14px 32px; max-width: 1400px; width: 100%; margin: 0 auto;
    animation: fadeDown .6s cubic-bezier(.22,1,.36,1) both;
    min-width:0;
  }
  .hdr-logo { font-family:'DM Serif Display',serif; font-size:20px; flex-shrink:0; }
  .hdr-logo span { color:var(--accent); }

  .hdr-nav {
    display: flex; gap: 3px; align-items: center; flex: 1; min-width:0;
    background: rgba(255,255,255,0.03); border: 1px solid var(--border);
    border-radius: 14px; padding: 5px; overflow-x: auto; scrollbar-width: none;
  }
  .hdr-nav::-webkit-scrollbar { display: none; }

  .npill {
    display: flex; align-items: center; gap: 6px; white-space: nowrap;
    padding: 7px 13px; border-radius: 10px; border: 1px solid transparent;
    background: none; color: var(--text2);
    font-family:'DM Sans',sans-serif; font-size:13px;
    cursor: pointer; transition: all .22s cubic-bezier(.22,1,.36,1);
  }
  .npill:hover { color:var(--text); background: var(--surface2); }
  .npill.active {
    background: var(--accent-glow); border-color: var(--accent-border);
    color:var(--text); font-weight:500;
    box-shadow: 0 0 20px rgba(99,102,241,.12);
  }
  .npill-badge {
    min-width:16px; height:16px; background:var(--danger); color:#fff;
    font-size:9px; font-weight:700; border-radius:8px; padding:0 4px;
    display:flex; align-items:center; justify-content:center;
  }

  .hdr-right { display:flex; align-items:center; gap:8px; flex-shrink:0; position:relative; }
  .hdr-avatar {
    width:34px; height:34px; background:var(--accent-glow); border:1px solid var(--accent-border);
    border-radius:10px; display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:600; color:var(--accent); cursor:pointer; transition:all .2s;
  }
  .hdr-avatar:hover { transform:scale(1.07); box-shadow:0 0 16px rgba(99,102,241,.22); }
  .user-menu-wrapper {
    position:relative;
  }
  .user-menu{
  position:absolute;
  top:48px;
  right:0;

  width:260px;

  background:rgba(15,15,25,.88);
  backdrop-filter:blur(18px);

  border:1px solid var(--border);
  border-radius:18px;

  overflow:hidden;

  box-shadow:
    0 20px 60px rgba(0,0,0,.45),
    0 0 30px rgba(99,102,241,.08);

  animation:menuIn .22s cubic-bezier(.22,1,.36,1);

  z-index:999;
}
.user-menu-header {
  display:flex; align-items:center; gap:14px; padding:18px;
}
.user-avatar-big{
  width:48px;
  height:48px;

  border-radius:14px;

  background:var(--accent-glow);
  border:1px solid var(--accent-border);

  display:flex;
  align-items:center;
  justify-content:center;

  font-weight:700;
  font-size:15px;

  color:var(--accent);

  flex-shrink:0;
}

.user-name {
  font-size:14px; font-weight:600; color:var(--text);
}

.user-email {
  font-size:12px; color:var(--text2); margin-top:2px;
}

.user-menu-divider {
  height:1px; background:var(--border);
}

.user-menu-item{
  width:100%;

  display:flex;
  align-items:center;
  gap:10px;

  padding:14px 18px;

  background:none;
  border:none;

  color:var(--text2);

  font-family:'DM Sans',sans-serif;
  font-size:13px;
  font-weight:500;

  cursor:pointer;

  transition:
    background .18s,
    color .18s,
    padding-left .18s;
}

.user-menu-item:hover {
  background:rgba(255,255,255,.04);
  color:var(--text);
  padding-left:22px;
}

.user-menu-item.danger{
  color:rgba(239,68,68,.78);
}

.user-menu-item.danger:hover{
  background:rgba(239,68,68,.08);
  color:var(--danger);
}

.logout-btn {
    display:flex; align-items:center; gap:7px; padding:7px 14px; border-radius:10px;
    border:1px solid rgba(239,68,68,.22); background:rgba(239,68,68,.06);
    color:rgba(239,68,68,.8); font-family:'DM Sans',sans-serif; font-size:13px;
    font-weight:500; cursor:pointer; transition:all .22s cubic-bezier(.22,1,.36,1);
  }
  .logout-btn:hover { background:rgba(239,68,68,.13); border-color:rgba(239,68,68,.45); color:var(--danger); transform:translateY(-1px); }

  .page-wrap {
    position:relative; z-index:1; flex:1;
    max-width:1400px; width:100%; margin:0 auto;
    padding:0 32px 48px;
    animation: pageIn .35s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes pageIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .page-eyebrow { font-size:10.5px; color:var(--text3); letter-spacing:2.5px; text-transform:uppercase; margin-bottom:6px; }
  .page-h1 { font-family:'DM Serif Display',serif; font-size:30px; margin-bottom:28px; }
  .page-h1 em { font-style:italic; color:var(--accent); }

  @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn  { from{opacity:0;transform:scale(.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes slideR   { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
  @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.7} }
  @keyframes blinkC   { 50%{opacity:0} }
  @keyframes menuIn   { from{opacity:0;transform:translateY(-8px)scale(.97);} to{opacity:1;transform:translateY(0)scale(1);}}

  /* ── DASHBOARD ── */
  .alert-banner {
    background:rgba(245,158,11,.07); border:1px solid rgba(245,158,11,.22); border-left:3px solid var(--warning);
    border-radius:14px; padding:13px 18px; display:flex; align-items:center; gap:12px; margin-bottom:24px;
    font-size:13.5px; color:rgba(245,158,11,.9);
  }
  .alert-banner strong { font-weight:600; color:var(--warning); }
  .alert-action { margin-left:auto; background:var(--warning); color:#080810; border:none; border-radius:8px; padding:7px 16px; font-size:12px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; white-space:nowrap; }
  .alert-action:hover { filter:brightness(1.1); transform:translateY(-1px); }

  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
  .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:22px; cursor:pointer; opacity:0; transition:transform .35s cubic-bezier(.22,1,.36,1), border-color .25s, box-shadow .35s; }
  .stat-card.vis { animation:scaleIn .65s cubic-bezier(.22,1,.36,1) forwards; }
  .stat-card:nth-child(1).vis{animation-delay:.1s} .stat-card:nth-child(2).vis{animation-delay:.2s} .stat-card:nth-child(3).vis{animation-delay:.3s} .stat-card:nth-child(4).vis{animation-delay:.4s}
  .stat-card:hover { transform:translateY(-5px) scale(1.015); border-color:var(--accent-border); background:var(--surface2); box-shadow:0 20px 50px rgba(0,0,0,.3); }
  .stat-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:19px; margin-bottom:16px; animation:floatY 3.5s ease-in-out infinite; }
  .si-0{background:rgba(245,158,11,.09);border:1px solid rgba(245,158,11,.18)} .si-1{background:rgba(34,197,94,.09);border:1px solid rgba(34,197,94,.18);animation-delay:.5s} .si-2{background:rgba(239,68,68,.09);border:1px solid rgba(239,68,68,.18);animation-delay:1s} .si-3{background:rgba(99,102,241,.09);border:1px solid rgba(99,102,241,.18);animation-delay:1.5s}
  .stat-label { font-size:10.5px; color:var(--text3); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:8px; font-weight:500; }
  .stat-value { font-family:'DM Serif Display',serif; font-size:28px; letter-spacing:-1px; line-height:1; margin-bottom:10px; }
  .stat-sub { font-size:12px; color:var(--text2); }
  .tok{color:var(--success)} .twarn{color:var(--warning)} .tdang{color:var(--danger)}
  .bar-wrap { background:rgba(255,255,255,.06); border-radius:6px; height:4px; margin:10px 0 8px; overflow:hidden; }
  .bar-fill { height:100%; border-radius:6px; transition:width 1.4s cubic-bezier(.22,1,.36,1); }

  .chart-panel { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:28px; margin-bottom:24px; opacity:0; }
  .chart-panel.vis { animation:fadeUp .75s .35s cubic-bezier(.22,1,.36,1) forwards; }
  .chart-panel:hover { border-color:var(--border-hover); }
  .panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
  .panel-title { font-size:15px; font-weight:500; }
  .panel-badge { font-size:11.5px; color:var(--success); background:rgba(34,197,94,.07); border:1px solid rgba(34,197,94,.18); padding:4px 10px; border-radius:20px; }
  .charts-inner { display:grid; grid-template-columns:1fr 300px; gap:24px; align-items:center; }
  .line-wrap { position:relative; height:220px; }
  .donut-canvas-wrap { position:relative; width:180px; height:180px; margin:0 auto; }
  .donut-center { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; pointer-events:none; }
  .donut-center-val { font-family:'DM Serif Display',serif; font-size:24px; line-height:1; }
  .donut-center-sub { font-size:9.5px; color:var(--text3); letter-spacing:1.5px; text-transform:uppercase; margin-top:3px; }
  .pie-legend { display:flex; flex-direction:column; gap:9px; margin-top:14px; }
  .pie-row { display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--text2); }
  .pie-dot { width:8px; height:8px; border-radius:2px; flex-shrink:0; }
  .pie-val { margin-left:auto; font-weight:500; color:var(--text); }

  .bottom-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
  .info-card { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:22px; opacity:0; transition:transform .35s cubic-bezier(.22,1,.36,1), border-color .25s, box-shadow .35s; }
  .info-card.vis { animation:fadeUp .65s cubic-bezier(.22,1,.36,1) forwards; }
  .info-card:nth-child(1).vis{animation-delay:.5s} .info-card:nth-child(2).vis{animation-delay:.62s} .info-card:nth-child(3).vis{animation-delay:.74s}
  .info-card:hover { transform:translateY(-4px); border-color:var(--border-hover); box-shadow:0 14px 36px rgba(0,0,0,.25); }
  .card-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .card-title { font-size:14px; font-weight:500; }
  .card-link { font-size:12px; color:var(--accent); cursor:pointer; font-weight:500; background:none; border:none; font-family:'DM Sans',sans-serif; transition:opacity .2s; }
  .card-link:hover { opacity:.65; }

  .mini-alert-list { display:flex; flex-direction:column; gap:8px; }
  .mini-alert { display:flex; align-items:flex-start; gap:10px; padding:11px 13px; border-radius:11px; opacity:0; transform:translateX(-10px); transition:transform .2s; }
  .mini-alert.vis { animation:slideR .45s cubic-bezier(.22,1,.36,1) forwards; }
  .mini-alert:nth-child(1).vis{animation-delay:.6s} .mini-alert:nth-child(2).vis{animation-delay:.72s} .mini-alert:nth-child(3).vis{animation-delay:.84s}
  .mini-alert:hover { transform:translateX(5px); }
  .mini-alert.warn { background:rgba(245,158,11,.07); border:1px solid rgba(245,158,11,.22); color:rgba(245,158,11,.85); }
  .mini-alert.ok   { background:rgba(34,197,94,.07);  border:1px solid rgba(34,197,94,.18);  color:rgba(34,197,94,.85); }

  .mini-chat-list { display:flex; flex-direction:column; gap:3px; }
  .mini-chat { display:flex; align-items:center; gap:11px; padding:10px 8px; border-radius:11px; cursor:pointer; opacity:0; transform:translateX(-10px); transition:background .2s, transform .2s; }
  .mini-chat.vis { animation:slideR .45s cubic-bezier(.22,1,.36,1) forwards; }
  .mini-chat:nth-child(1).vis{animation-delay:.65s} .mini-chat:nth-child(2).vis{animation-delay:.77s}
  .mini-chat:hover { background:var(--surface2); transform:translateX(5px); }
  .mini-chat-av { width:36px; height:36px; background:var(--accent-glow); border:1px solid var(--accent-border); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:var(--accent); flex-shrink:0; }
  .mini-chat-name { font-size:13px; font-weight:500; }
  .mini-chat-prev { font-size:11.5px; color:var(--text2); margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px; }
  .mini-chat-time { font-size:11px; color:var(--text3); margin-left:auto; flex-shrink:0; }
  .unread-dot { width:7px; height:7px; background:var(--accent); border-radius:50%; flex-shrink:0; animation:pulseDot 2.5s ease-in-out infinite; }

  .ia-box { background:var(--accent-glow); border:1px solid var(--accent-border); border-radius:12px; padding:14px 16px; margin-bottom:12px; min-height:76px; }
  .ia-tag { font-size:9.5px; font-weight:600; letter-spacing:2.5px; text-transform:uppercase; color:var(--accent); margin-bottom:6px; }
  .ia-msg { font-size:13px; color:var(--text2); line-height:1.65; }
  .ia-cur { display:inline-block; width:2px; height:13px; background:var(--accent); margin-left:2px; vertical-align:middle; animation:blinkC 1s step-end infinite; }
  .ia-row { display:flex; gap:8px; }
  .ia-input { flex:1; padding:10px 14px; background:rgba(255,255,255,.04); border:1px solid var(--border); border-radius:9px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text); outline:none; transition:all .25s; }
  .ia-input::placeholder { color:var(--text3); }
  .ia-input:focus { border-color:var(--accent-border); background:var(--accent-glow); }
  .ia-send { padding:10px 18px; background:var(--accent); color:white; border:none; border-radius:9px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all .22s; }
  .ia-send:hover { background:var(--accent-h); transform:translateY(-1px); box-shadow:0 6px 18px rgba(99,102,241,.3); }

  /* ── ALERTAS ── */
  .a-section-label { font-size:11px; color:var(--text3); letter-spacing:2px; text-transform:uppercase; margin:28px 0 14px; font-weight:500; }
  .a-section-label:first-of-type { margin-top:0; }
  .a-list { display:flex; flex-direction:column; gap:12px; max-width:760px; }
  .a-card { display:flex; align-items:flex-start; gap:16px; padding:20px; border-radius:16px; border:1px solid; transition:all .2s; opacity:0; }
  .a-card.vis { animation:fadeUp .5s cubic-bezier(.22,1,.36,1) forwards; }
  .a-card:hover { filter:brightness(1.1); transform:translateX(4px); }
  .a-card.danger{background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.2)} .a-card.warn{background:rgba(245,158,11,.06);border-color:rgba(245,158,11,.2)} .a-card.ok{background:rgba(34,197,94,.06);border-color:rgba(34,197,94,.15)} .a-card.info{background:rgba(99,102,241,.06);border-color:rgba(99,102,241,.2)}
  .a-emoji { font-size:22px; flex-shrink:0; margin-top:2px; }
  .a-title { font-size:14px; font-weight:600; margin-bottom:4px; }
  .a-card.danger .a-title{color:#f87171} .a-card.warn .a-title{color:#fbbf24} .a-card.ok .a-title{color:#4ade80} .a-card.info .a-title{color:#818cf8}
  .a-desc { font-size:13px; color:var(--text2); line-height:1.5; }
  .a-date { font-size:11px; color:var(--text3); margin-top:6px; }

  /* ── APRENDIZADO ── */
  .edu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
  .edu-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; cursor:pointer; transition:all .22s cubic-bezier(.22,1,.36,1); opacity:0; }
  .edu-card.vis { animation:scaleIn .55s cubic-bezier(.22,1,.36,1) forwards; }
  .edu-card:hover { border-color:var(--accent-border); background:rgba(99,102,241,.05); transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.25); }
  .edu-card.open { border-color:var(--accent-border); background:rgba(99,102,241,.06); }
  .edu-emoji { font-size:26px; margin-bottom:12px; }
  .edu-titulo { font-size:15px; font-weight:600; margin-bottom:6px; }
  .edu-desc { font-size:13px; color:var(--text2); line-height:1.5; margin-bottom:14px; }
  .edu-tag { font-size:10px; font-weight:500; letter-spacing:1px; text-transform:uppercase; padding:3px 10px; border-radius:6px; background:var(--accent-glow); color:var(--accent); border:1px solid var(--accent-border); }
  .edu-content { margin-top:16px; padding-top:16px; border-top:1px solid var(--border); font-size:13.5px; color:var(--text2); line-height:1.7; }
  .edu-content strong { color:var(--text); font-weight:500; }

  /* ── CHAT ── */
  .chat-shell { display:flex; height:calc(100vh - 80px); border-radius:20px; overflow:hidden; border:1px solid var(--border); background:var(--surface); }
  .chat-sidebar { width:280px; border-right:1px solid var(--border); display:flex; flex-direction:column; background:rgba(8,8,16,.6); flex-shrink:0; }
  .chat-sb-hdr { padding:24px 20px 16px; border-bottom:1px solid var(--border); }
  .chat-sb-title { font-family:'DM Serif Display',serif; font-size:20px; }
  .chat-sb-sub { font-size:12px; color:var(--text3); margin-top:3px; }
  .chat-contacts { flex:1; overflow-y:auto; padding:8px; scrollbar-width:thin; scrollbar-color:rgba(255,255,255,.06) transparent; }
  .c-item { display:flex; align-items:center; gap:12px; padding:12px; border-radius:12px; cursor:pointer; transition:all .18s; border:1px solid transparent; }
  .c-item:hover { background:var(--surface2); }
  .c-item.active { background:var(--accent-glow); border-color:var(--accent-border); }
  .c-av { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:600; flex-shrink:0; background:var(--accent-glow); border:1px solid var(--accent-border); color:var(--accent); }
  .c-name { font-size:13.5px; font-weight:500; }
  .c-prev { font-size:12px; color:var(--text3); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:150px; }
  .c-time { font-size:11px; color:var(--text3); margin-left:auto; flex-shrink:0; }
  .chat-window { flex:1; display:flex; flex-direction:column; }
  .chat-topbar { padding:18px 24px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:12px; }
  .chat-topbar-av { width:36px; height:36px; border-radius:10px; background:var(--accent-glow); border:1px solid var(--accent-border); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:600; color:var(--accent); }
  .chat-topbar-name { font-size:14px; font-weight:500; }
  .chat-topbar-status { font-size:11px; color:var(--text3); margin-top:1px; }
  .chat-status-dot { width:7px; height:7px; background:var(--success); border-radius:50%; display:inline-block; margin-right:5px; animation:pulseDot 2s ease-in-out infinite; }
  .msgs-area { flex:1; overflow-y:auto; padding:24px; display:flex; flex-direction:column; gap:14px; scrollbar-width:thin; scrollbar-color:rgba(255,255,255,.06) transparent; }
  .msg-row { max-width:65%; display:flex; flex-direction:column; gap:4px; }
  .msg-row.mine   { align-self:flex-end;   align-items:flex-end; }
  .msg-row.theirs { align-self:flex-start; align-items:flex-start; }
  .msg-bubble { padding:12px 16px; border-radius:14px; font-size:13.5px; line-height:1.5; }
  .msg-row.mine   .msg-bubble { background:var(--accent); color:#fff; border-bottom-right-radius:4px; }
  .msg-row.theirs .msg-bubble { background:var(--surface2); border:1px solid var(--border); color:rgba(240,240,255,.85); border-bottom-left-radius:4px; }
  .msg-time { font-size:11px; color:var(--text3); }
  .chat-input-area { padding:16px 24px; border-top:1px solid var(--border); display:flex; gap:10px; }
  .chat-input { flex:1; padding:12px 16px; background:var(--surface); border:1px solid var(--border); border-radius:10px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13.5px; outline:none; transition:border-color .15s; }
  .chat-input::placeholder { color:var(--text3); }
  .chat-input:focus { border-color:var(--accent-border); background:var(--accent-glow); }
  .chat-send { padding:12px 22px; background:var(--accent); border:none; border-radius:10px; color:white; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all .2s; }
  .chat-send:hover { background:var(--accent-h); box-shadow:0 4px 16px rgba(99,102,241,.3); }

  /* ── FATURAMENTO ── */
  .fat-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:28px; }
  .fat-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:22px; transition:border-color .2s; opacity:0; }
  .fat-card.vis { animation:scaleIn .55s cubic-bezier(.22,1,.36,1) forwards; }
  .fat-card:nth-child(1).vis{animation-delay:.1s} .fat-card:nth-child(2).vis{animation-delay:.2s} .fat-card:nth-child(3).vis{animation-delay:.3s}
  .fat-card:hover { border-color:var(--border-hover); }
  .fat-card-label { font-size:11px; color:var(--text3); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px; }
  .fat-card-value { font-family:'DM Serif Display',serif; font-size:30px; letter-spacing:-1px; margin-bottom:6px; }
  .fat-card-sub { font-size:12px; color:var(--text2); }
  .big-bar-box { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; margin-bottom:24px; }
  .big-bar-label { font-size:13px; font-weight:500; margin-bottom:16px; display:flex; justify-content:space-between; }
  .big-bar-track { background:rgba(255,255,255,.07); border-radius:8px; height:12px; overflow:hidden; margin-bottom:10px; }
  .big-bar-fill { height:100%; border-radius:8px; transition:width 1.4s cubic-bezier(.22,1,.36,1); }
  .big-bar-info { display:flex; justify-content:space-between; font-size:12px; color:var(--text3); }
  .meses-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; }
  .mes-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:14px 10px; text-align:center; opacity:0; }
  .mes-card.vis { animation:fadeUp .45s cubic-bezier(.22,1,.36,1) forwards; }
  .mes-nome { font-size:11px; color:var(--text3); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
  .mes-valor { font-size:14px; font-weight:500; margin-bottom:6px; }
  .mes-bar { height:4px; background:rgba(255,255,255,.07); border-radius:4px; overflow:hidden; }
  .mes-bar-fill { height:100%; border-radius:4px; }

  /* ── DOCUMENTOS ── */
  .upload-area { border:1.5px dashed rgba(99,102,241,.3); border-radius:16px; padding:36px; text-align:center; cursor:pointer; background:rgba(99,102,241,.03); transition:all .22s; margin-bottom:28px; }
  .upload-area:hover { border-color:rgba(99,102,241,.6); background:rgba(99,102,241,.06); }
  .upload-icon { font-size:32px; margin-bottom:10px; }
  .upload-title { font-size:14px; font-weight:500; margin-bottom:4px; }
  .upload-sub { font-size:12px; color:var(--text3); }
  .upload-btn { margin-top:14px; padding:9px 20px; background:var(--accent); border:none; border-radius:9px; color:white; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all .2s; }
  .upload-btn:hover { background:var(--accent-h); }
  .docs-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:14px; }
  .doc-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:20px; cursor:pointer; transition:all .2s; opacity:0; }
  .doc-card.vis { animation:scaleIn .5s cubic-bezier(.22,1,.36,1) forwards; }
  .doc-card:hover { border-color:var(--border-hover); background:var(--surface2); transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,.25); }
  .doc-icon-big { font-size:28px; margin-bottom:12px; }
  .doc-name { font-size:13.5px; font-weight:500; margin-bottom:4px; }
  .doc-meta { font-size:11.5px; color:var(--text3); }
  .doc-tag { display:inline-block; margin-top:10px; font-size:10px; font-weight:500; letter-spacing:1px; text-transform:uppercase; padding:3px 8px; border-radius:6px; }
  .doc-tag.fiscal  {background:rgba(99,102,241,.1);color:var(--accent);border:1px solid rgba(99,102,241,.25)} .doc-tag.pendente{background:rgba(245,158,11,.1);color:var(--warning);border:1px solid rgba(245,158,11,.25)} .doc-tag.ok{background:rgba(34,197,94,.1);color:var(--success);border:1px solid rgba(34,197,94,.2)}
  .toast { position:fixed; bottom:24px; right:24px; background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.3); color:var(--success); padding:12px 20px; border-radius:12px; font-size:13px; animation:fadeUp .3s cubic-bezier(.22,1,.36,1); z-index:9999; }

  /* ── RESPONSIVE ── */
  @media(max-width:1100px) {
    .stats-grid{grid-template-columns:repeat(2,1fr)} .charts-inner{grid-template-columns:1fr} .bottom-grid{grid-template-columns:1fr 1fr} .fat-cards{grid-template-columns:1fr 1fr} .meses-grid{grid-template-columns:repeat(4,1fr)}
  }
  @media(max-width:768px) {
    .hdr{padding:12px 20px;flex-wrap:wrap} .hdr-nav{order:3;width:100%} .page-wrap{padding:0 20px 32px} .stats-grid{grid-template-columns:1fr 1fr} .bottom-grid{grid-template-columns:1fr} .chat-sidebar{width:220px} .meses-grid{grid-template-columns:repeat(3,1fr)} .fat-cards{grid-template-columns:1fr}
  }
`;

/* ══════════════ DATA ══════════════ */
const PIE_DATA  = [{label:"Serviços",value:58,color:"#6366f1"},{label:"Produtos",value:27,color:"#22c55e"},{label:"Outros",value:15,color:"#f59e0b"}];
const MONTHS    = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago"];
const REVENUE   = [4200,5100,6300,7200,8100,8900,9200,9800];

const ALERTAS = [
  {tipo:"danger",emoji:"🚨",titulo:"DAS vence em 6 dias!",              desc:"O DAS de maio/2025 no valor de R$ 72,60 vence em 20/05/2025. Não pague com atraso para evitar multa.",data:"Hoje"},
  {tipo:"warn",  emoji:"📊",titulo:"84% do limite atingido",             desc:"Você faturou R$ 68.400 dos R$ 81.000 permitidos no ano. Atenção para não ultrapassar.",             data:"Atualizado hoje"},
  {tipo:"warn",  emoji:"📋",titulo:"2 documentos aguardando revisão",    desc:"O contador Silva ainda não revisou 2 documentos enviados. Verifique na aba Documentos.",           data:"Há 3 dias"},
  {tipo:"ok",    emoji:"✅",titulo:"DASN-SIMEI entregue com sucesso",    desc:"A declaração anual de 2023 foi entregue e aprovada pela Receita Federal.",                         data:"Há 2 meses"},
  {tipo:"ok",    emoji:"✅",titulo:"DAS de abril pago",                  desc:"O DAS de abril/2025 foi pago e confirmado. Tudo em dia!",                                          data:"Há 20 dias"},
  {tipo:"info",  emoji:"📚",titulo:"Nova reforma tributária",            desc:"A reforma traz o IBS e a CBS. Acesse o módulo educativo para entender o impacto no seu negócio.",  data:"Há 1 semana"},
];

const CONTEUDOS = [
  {emoji:"💰",titulo:"O que é o DAS?",         desc:"Entenda o Documento de Arrecadação do Simples e como funciona o pagamento mensal.",tag:"Básico",     conteudo:<><strong>DAS</strong> é o boleto mensal do MEI, cobrindo INSS, ISS e/ou ICMS.<br/><br/>Em 2024: <strong>R$ 71,60</strong> (comércio) ou <strong>R$ 75,60</strong> (serviços).<br/><br/>⏰ Vence todo <strong>dia 20</strong> do mês seguinte.</>},
  {emoji:"📋",titulo:"O que é a DASN-SIMEI?",  desc:"A declaração anual obrigatória do MEI e como não perder o prazo.",tag:"Obrigação", conteudo:<><strong>DASN-SIMEI</strong> é obrigatória mesmo sem faturamento.<br/><br/>📅 <strong>Prazo: 31 de maio</strong> de cada ano. Não entregar gera multa e pode cancelar o CNPJ.</>},
  {emoji:"🏦",titulo:"Limite de faturamento",   desc:"Quanto você pode faturar por ano e o que acontece se ultrapassar.",tag:"Importante",conteudo:<>MEI pode faturar até <strong>R$ 81.000/ano</strong>.<br/><br/>Ultrapassar até 20% → vira ME. Ultrapassar mais → perda retroativa dos benefícios.<br/><br/>⚠️ Seu faturamento está em <strong>84%</strong> do limite.</>},
  {emoji:"📄",titulo:"Nota Fiscal do MEI",      desc:"Quando emitir, como emitir e diferença entre NF de serviço e produto.",tag:"Prática",   conteudo:<><strong>NFS-e:</strong> prefeitura, para serviços a PJ.<br/><strong>NF Produto:</strong> SEFAZ, para venda a empresas.<br/><br/>Para pessoas físicas não é obrigatória, mas é recomendada.</>},
  {emoji:"🔄",titulo:"IBS e CBS — Reforma",     desc:"O que muda com a reforma tributária e como o MEI é afetado.",tag:"Novo",       conteudo:<><strong>CBS</strong> substitui PIS/COFINS. <strong>IBS</strong> substitui ICMS/ISS.<br/><br/>O MEI está protegido por regras específicas. Transição: 2026–2032.</>},
  {emoji:"🛡️",titulo:"Benefícios do MEI",      desc:"Aposentadoria, auxílio-doença, salário-maternidade e outros direitos.",tag:"Direitos", conteudo:<>Pagando DAS em dia você tem:<br/><br/>✅ Aposentadoria por idade · ✅ Auxílio-doença (12 meses) · ✅ Salário-maternidade (10 meses) · ✅ Pensão por morte</>},
];

const CONTATOS = [
  {id:1,init:"C", nome:"Contador Silva", status:"Online agora",      preview:"Enviei o boleto do DAS",      time:"10:42",unread:true},
  {id:2,init:"🤖",nome:"Assistente IA",  status:"Sempre disponível", preview:"Posso te ajudar com dúvidas", time:"09:15",unread:true},
];
const MSGS_INIT = {
  1:[{de:"theirs",texto:"Olá! Enviei o boleto do DAS de maio para você.",hora:"10:30"},{de:"theirs",texto:"Lembre-se que vence no dia 20!",hora:"10:31"},{de:"mine",texto:"Obrigada! Vou pagar ainda hoje.",hora:"10:42"}],
  2:[{de:"theirs",texto:"Olá! Sou o assistente IA. Como posso ajudar?",hora:"09:00"},{de:"mine",texto:"Qual o prazo da DASN?",hora:"09:10"},{de:"theirs",texto:"A DASN-SIMEI deve ser entregue até 31 de maio. Está em dia! ✅",hora:"09:15"}],
};

const MESES = [{nome:"Jan",valor:5200},{nome:"Fev",valor:4800},{nome:"Mar",valor:6100},{nome:"Abr",valor:7400},{nome:"Mai",valor:6300},{nome:"Jun",valor:8200},{nome:"Jul",valor:7100},{nome:"Ago",valor:5900},{nome:"Set",valor:4700},{nome:"Out",valor:5800},{nome:"Nov",valor:3900},{nome:"Dez",valor:3000}];
const FAT_TOTAL=68400,FAT_LIMITE=81000,FAT_PCT=Math.round(FAT_TOTAL/FAT_LIMITE*100),MAIOR_MES=Math.max(...MESES.map(m=>m.valor));

const DOCS = [
  {icon:"📄",nome:"DAS_maio_2025.pdf",   meta:"Enviado há 3 dias · 42 KB",     tag:"fiscal",   tagLabel:"Fiscal"},
  {icon:"📊",nome:"Faturamento_Q1.pdf",  meta:"Enviado há 1 semana · 128 KB",  tag:"ok",       tagLabel:"Aprovado"},
  {icon:"📋",nome:"DASN_2023.pdf",       meta:"Enviado há 2 meses · 88 KB",    tag:"ok",       tagLabel:"Aprovado"},
  {icon:"🧾",nome:"NF_servico_abr.pdf",  meta:"Aguardando revisão · 56 KB",    tag:"pendente", tagLabel:"Pendente"},
  {icon:"📄",nome:"Contrato_MEI.pdf",    meta:"Aguardando revisão · 210 KB",   tag:"pendente", tagLabel:"Pendente"},
  {icon:"📊",nome:"Relatorio_anual.pdf", meta:"Enviado há 3 meses · 340 KB",   tag:"ok",       tagLabel:"Aprovado"},
  {icon:"🧾",nome:"NF_produto_mar.pdf",  meta:"Enviado há 1 mês · 64 KB",      tag:"fiscal",   tagLabel:"Fiscal"},
];

const NAV = [
  {id:"dashboard",   icon:"🏠",label:"Início",      badge:0},
  {id:"faturamento", icon:"📈",label:"Faturamento", badge:0},
  {id:"alertas",     icon:"🔔",label:"Alertas",     badge:2},
  {id:"mensagens",   icon:"💬",label:"Mensagens",   badge:2},
  {id:"aprendizado", icon:"📚",label:"Aprendizado", badge:0},
  {id:"documentos",  icon:"📁",label:"Documentos",  badge:2},
];

const AI_MSGS = [
  "Olá! Receita cresceu 6,5% este mês. Deseja mais detalhes?",
  "3 alertas ativos. Posso priorizar os mais urgentes pra você.",
  "Meta mensal está 92% concluída. Ótimo ritmo! 🚀",
];

/* ══════════════ HOOKS ══════════════ */
  function useTypewriter(text, speed = 28) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);

    return () => {
      clearInterval(id);
      setDisplay(""); // reset acontece no cleanup, não na inicialização
    };
  }, [text, speed]);

  return display;
}

function useVis(ref, threshold = 0.1) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return visible;
}
/* ══════════════ CHARTS ══════════════ */
function LineChart(){
  const r=useRef(null),inst=useRef(null);
  useEffect(()=>{
    if(!r.current)return; inst.current?.destroy();
    const ctx=r.current.getContext("2d"),g=ctx.createLinearGradient(0,0,0,220);
    g.addColorStop(0,"rgba(99,102,241,.28)");g.addColorStop(1,"rgba(99,102,241,0)");
    inst.current=new Chart(r.current,{type:"line",data:{labels:MONTHS,datasets:[{data:REVENUE,borderColor:"#6366f1",backgroundColor:g,borderWidth:2.5,tension:.45,fill:true,pointBackgroundColor:"#6366f1",pointBorderColor:"#080810",pointBorderWidth:2,pointRadius:5,pointHoverRadius:8,pointHoverBackgroundColor:"#fff"}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:1600,easing:"easeInOutQuart",delay:(c)=>c.dataIndex*70},interaction:{mode:"index",intersect:false},scales:{x:{grid:{color:"rgba(255,255,255,.04)"},ticks:{color:"rgba(240,240,255,.3)",font:{family:"DM Sans",size:11}}},y:{grid:{color:"rgba(255,255,255,.04)"},ticks:{color:"rgba(240,240,255,.3)",font:{family:"DM Sans",size:11},callback:(v)=>`R$${(v/1000).toFixed(0)}k`}}},plugins:{legend:{display:false},tooltip:{backgroundColor:"rgba(12,12,22,.95)",titleColor:"#f0f0ff",bodyColor:"rgba(240,240,255,.55)",borderColor:"rgba(99,102,241,.3)",borderWidth:1,padding:12,callbacks:{label:(c)=>` R$ ${c.parsed.y.toLocaleString("pt-BR")}`}}}}});
    return()=>inst.current?.destroy();
  },[]);
  return <canvas ref={r}/>;
}

function DonutChart(){
  const r=useRef(null),inst=useRef(null);
  useEffect(()=>{
    if(!r.current)return; inst.current?.destroy();
    inst.current=new Chart(r.current,{type:"doughnut",data:{labels:PIE_DATA.map(d=>d.label),datasets:[{data:PIE_DATA.map(d=>d.value),backgroundColor:PIE_DATA.map(d=>d.color+"bb"),borderColor:PIE_DATA.map(d=>d.color),borderWidth:2,hoverOffset:12}]},options:{responsive:true,maintainAspectRatio:false,cutout:"70%",animation:{animateRotate:true,animateScale:false,duration:1800,easing:"easeInOutQuart"},plugins:{legend:{display:false},tooltip:{backgroundColor:"rgba(12,12,22,.95)",titleColor:"#f0f0ff",bodyColor:"rgba(240,240,255,.55)",borderColor:"rgba(99,102,241,.3)",borderWidth:1,padding:10,callbacks:{label:(c)=>` ${c.parsed.toFixed(1)}%`}}}}});
    return()=>inst.current?.destroy();
  },[]);
  return(<div><div className="donut-canvas-wrap"><canvas ref={r}/><div className="donut-center"><div className="donut-center-val">85%</div><div className="donut-center-sub">Meta</div></div></div><div className="pie-legend">{PIE_DATA.map(d=><div className="pie-row" key={d.label}><div className="pie-dot" style={{background:d.color}}/>{d.label}<span className="pie-val">{d.value}%</span></div>)}</div></div>);
}

/* ══════════════ AI BOX ══════════════ */
function AIBox(){
  const [idx,setIdx]=useState(0),[input,setInput]=useState("");
  const typed=useTypewriter(AI_MSGS[idx],28);
  const send=()=>{if(!input.trim())return;setInput("");setIdx(i=>(i+1)%AI_MSGS.length);};
  return(<><div className="ia-box"><div className="ia-tag">✦ Assistente IA</div><div className="ia-msg">{typed}{typed.length<AI_MSGS[idx].length&&<span className="ia-cur"/>}</div></div><div className="ia-row"><input className="ia-input" placeholder="Pergunte algo..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button className="ia-send" onClick={send}>Enviar</button></div></>);
}

/* ══════════════ PAGES ══════════════ */
function Dashboard({navigate}){
  const user = getUserFromToken();
  const nome = user?.nome || "Usuário";
  const sRef=useRef(null),cRef=useRef(null),bRef=useRef(null);
  const sVis=useVis(sRef),cVis=useVis(cRef),bVis=useVis(bRef);
  const [barAnim,setBarAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setBarAnim(true),500);return()=>clearTimeout(t);},[]);
  const STATS=[
    {icon:"💰",cls:"si-0",label:"Receita Mensal", value:"R$ 9.800",sub:<><span className="tok">▲ 6,5%</span> vs. mês anterior</>,  bar:"84%",barColor:"#f59e0b"},
    {icon:"📦",cls:"si-1",label:"Pedidos Ativos",  value:"142",      sub:<><span className="tok">✓ 97%</span> processados</>,         bar:"97%",barColor:"#22c55e"},
    {icon:"🔴",cls:"si-2",label:"Inadimplência",   value:"R$ 1.240", sub:<><span className="twarn">▲ 2%</span> vs. mês anterior</>,  bar:"18%",barColor:"#ef4444"},
    {icon:"⭐",cls:"si-3",label:"NPS Score",        value:"87",       sub:<><span className="tok">▲ 3pts</span> — Excelente</>,       bar:"87%",barColor:"#6366f1"},
  ];
  return(<>
    <div className="page-eyebrow">Visão geral · Abril 2026</div>
    <h1 className="page-h1">Bom dia, <em>{nome}</em> 👋</h1>
    <div className="alert-banner">
      <span>⚠️</span>
      <div><strong>Atenção:</strong> 2 faturas vencem nos próximos 3 dias. Total: <strong>R$ 4.820</strong></div>
      <button className="alert-action" onClick={()=>navigate("alertas")}>Ver alertas</button>
    </div>
    <div className="stats-grid" ref={sRef}>
      {STATS.map((s,i)=>(
        <div key={i} className={`stat-card${sVis?" vis":""}`}>
          <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
          <div className="bar-wrap"><div className="bar-fill" style={{width:barAnim?s.bar:"0%",background:s.barColor}}/></div>
          <div className="stat-sub">{s.sub}</div>
        </div>
      ))}
    </div>
    <div className={`chart-panel${cVis?" vis":""}`} ref={cRef}>
      <div className="panel-header">
        <div className="panel-title">Receita Mensal (R$) — por categoria</div>
        <div className="panel-badge">▲ 6,5% este mês</div>
      </div>
      <div className="charts-inner">
        <div className="line-wrap"><LineChart/></div>
        <DonutChart/>
      </div>
    </div>
    <div className="bottom-grid" ref={bRef}>
      <div className={`info-card${bVis?" vis":""}`}>
        <div className="card-hdr"><div className="card-title">Alertas</div><button className="card-link" onClick={()=>navigate("alertas")}>Ver todos →</button></div>
        <div className="mini-alert-list">
          {ALERTAS.slice(0,3).map((a,i)=>(
            <div key={i} className={`mini-alert ${a.tipo==="danger"||a.tipo==="warn"?"warn":"ok"}${bVis?" vis":""}`}>
              <span>{a.emoji}</span>
              <div><div style={{fontWeight:500,fontSize:"12.5px"}}>{a.titulo}</div><div style={{fontSize:"11.5px",opacity:.7,marginTop:2}}>{a.data}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className={`info-card${bVis?" vis":""}`}>
        <div className="card-hdr"><div className="card-title">Mensagens</div><button className="card-link" onClick={()=>navigate("mensagens")}>Ver todas →</button></div>
        <div className="mini-chat-list">
          {CONTATOS.map((c,i)=>(
            <div key={i} className={`mini-chat${bVis?" vis":""}`} onClick={()=>navigate("mensagens")}>
              <div className="mini-chat-av">{c.init}</div>
              <div><div className="mini-chat-name">{c.nome}</div><div className="mini-chat-prev">{c.preview}</div></div>
              <div className="mini-chat-time">{c.time}</div>
              {c.unread&&<div className="unread-dot"/>}
            </div>
          ))}
        </div>
      </div>
      <div className={`info-card${bVis?" vis":""}`}>
        <div className="card-hdr"><div className="card-title">Assistente</div></div>
        <AIBox/>
      </div>
    </div>
  </>);
}

function Alertas(){
  const ativos=ALERTAS.filter(a=>a.tipo==="danger"||a.tipo==="warn");
  const resolvidos=ALERTAS.filter(a=>a.tipo==="ok"||a.tipo==="info");
  return(<>
    <div className="page-eyebrow">Notificações</div>
    <h1 className="page-h1">Seus <em>alertas</em></h1>
    <div className="a-section-label">Atenção necessária ({ativos.length})</div>
    <div className="a-list">{ativos.map((a,i)=><div key={i} className={`a-card ${a.tipo} vis`} style={{animationDelay:`${i*.1}s`}}><span className="a-emoji">{a.emoji}</span><div><div className="a-title">{a.titulo}</div><div className="a-desc">{a.desc}</div><div className="a-date">{a.data}</div></div></div>)}</div>
    <div className="a-section-label">Resolvidos e informativos ({resolvidos.length})</div>
    <div className="a-list">{resolvidos.map((a,i)=><div key={i} className={`a-card ${a.tipo} vis`} style={{animationDelay:`${(i+ativos.length)*.1}s`}}><span className="a-emoji">{a.emoji}</span><div><div className="a-title">{a.titulo}</div><div className="a-desc">{a.desc}</div><div className="a-date">{a.data}</div></div></div>)}</div>
  </>);
}

function Aprendizado(){
  const [aberto,setAberto]=useState(null);
  return(<>
    <div className="page-eyebrow">Conteúdo</div>
    <h1 className="page-h1">Módulo de <em>aprendizado</em></h1>
    <div className="edu-grid">
      {CONTEUDOS.map((c,i)=>(
        <div key={i} className={`edu-card vis${aberto===i?" open":""}`} style={{animationDelay:`${i*.07}s`}} onClick={()=>setAberto(aberto===i?null:i)}>
          <div className="edu-emoji">{c.emoji}</div>
          <div className="edu-titulo">{c.titulo}</div>
          <div className="edu-desc">{c.desc}</div>
          <span className="edu-tag">{c.tag}</span>
          {aberto===i&&<div className="edu-content">{c.conteudo}</div>}
        </div>
      ))}
    </div>
  </>);
}

function Mensagens(){
  const [ativo,setAtivo]=useState(1),[msgs,setMsgs]=useState(MSGS_INIT),[input,setInput]=useState("");
  const end=useRef(null);
  const contato=CONTATOS.find(c=>c.id===ativo);
  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[msgs,ativo]);
  const enviar=()=>{
    if(!input.trim())return;
    const nova={de:"mine",texto:input,hora:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})};
    setMsgs(p=>({...p,[ativo]:[...(p[ativo]||[]),nova]}));setInput("");
    if(ativo===2)setTimeout(()=>setMsgs(p=>({...p,2:[...p[2],{de:"theirs",texto:"Entendido! Vou verificar isso para você. 😊",hora:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]})),900);
  };
  return(
    <div className="chat-shell">
      <div className="chat-sidebar">
        <div className="chat-sb-hdr"><div className="chat-sb-title">Mensagens</div><div className="chat-sb-sub">Seus atendimentos</div></div>
        <div className="chat-contacts">
          {CONTATOS.map(c=>(
            <div key={c.id} className={`c-item${ativo===c.id?" active":""}`} onClick={()=>setAtivo(c.id)}>
              <div className="c-av">{c.init}</div>
              <div style={{flex:1,minWidth:0}}><div className="c-name">{c.nome}</div><div className="c-prev">{c.preview}</div></div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}><span className="c-time">{c.time}</span>{c.unread&&<span className="unread-dot"/>}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-window">
        {contato&&<>
          <div className="chat-topbar">
            <div className="chat-topbar-av">{contato.init}</div>
            <div><div className="chat-topbar-name">{contato.nome}</div><div className="chat-topbar-status"><span className="chat-status-dot"/>{contato.status}</div></div>
          </div>
          <div className="msgs-area">
            {(msgs[ativo]||[]).map((m,i)=><div key={i} className={`msg-row ${m.de}`}><div className="msg-bubble">{m.texto}</div><div className="msg-time">{m.hora}</div></div>)}
            <div ref={end}/>
          </div>
          <div className="chat-input-area">
            <input className="chat-input" placeholder="Digite uma mensagem..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enviar()}/>
            <button className="chat-send" onClick={enviar}>Enviar</button>
          </div>
        </>}
      </div>
    </div>
  );
}

function Faturamento(){
  const ref=useRef(null);const vis=useVis(ref,.05);
  const [barAnim,setBarAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setBarAnim(true),300);return()=>clearTimeout(t);},[]);
  return(<>
    <div className="page-eyebrow">Financeiro</div>
    <h1 className="page-h1">Dashboard de <em>faturamento</em></h1>
    <div className="fat-cards" ref={ref}>
      {[
        {label:"Faturamento acumulado",value:"R$ 68.400",sub:<><span className="twarn">{FAT_PCT}% do limite anual</span></>},
        {label:"Limite MEI 2024",       value:"R$ 81.000",sub:<>Restam <span className="tok">R$ 12.600</span></>},
        {label:"Melhor mês",            value:"R$ 8.200", sub:"Junho/2024"},
      ].map((c,i)=><div key={i} className={`fat-card${vis?" vis":""}`} style={{animationDelay:`${i*.1}s`}}><div className="fat-card-label">{c.label}</div><div className="fat-card-value">{c.value}</div><div className="fat-card-sub">{c.sub}</div></div>)}
    </div>
    <div className="big-bar-box">
      <div className="big-bar-label"><span>Progresso do limite anual</span><span className="twarn">{FAT_PCT}%</span></div>
      <div className="big-bar-track"><div className="big-bar-fill" style={{width:barAnim?`${FAT_PCT}%`:"0%",background:FAT_PCT>85?"#ef4444":"#f59e0b"}}/></div>
      <div className="big-bar-info"><span>R$ 0</span><span>⚠️ Zona de atenção a partir de 80%</span><span>R$ 81.000</span></div>
    </div>
    <div className="page-eyebrow" style={{marginBottom:14}}>Faturamento por mês</div>
    <div className="meses-grid">
      {MESES.map((m,i)=>(
        <div key={i} className={`mes-card${vis?" vis":""}`} style={{animationDelay:`${.3+i*.04}s`}}>
          <div className="mes-nome">{m.nome}</div>
          <div className="mes-valor" style={{color:m.valor<4500?"rgba(240,240,255,.4)":undefined}}>R$ {(m.valor/1000).toFixed(1)}k</div>
          <div className="mes-bar"><div className="mes-bar-fill" style={{width:barAnim?`${(m.valor/MAIOR_MES)*100}%`:"0%",background:m.valor<4500?"#f59e0b":"#6366f1",transition:"width 1.2s cubic-bezier(.22,1,.36,1)"}}/></div>
        </div>
      ))}
    </div>
  </>);
}

function Documentos(){
  const [toast,setToast]=useState(false);
  const ref=useRef(null);const vis=useVis(ref,.05);
  const simular=()=>{setToast(true);setTimeout(()=>setToast(false),3000);};
  return(<>
    <div className="page-eyebrow">Gestão</div>
    <h1 className="page-h1">Seus <em>documentos</em></h1>
    <div className="upload-area" onClick={simular}>
      <div className="upload-icon">📤</div>
      <div className="upload-title">Enviar novo documento</div>
      <div className="upload-sub">PDF, imagem ou planilha · Máx. 10MB</div>
      <button className="upload-btn">Selecionar arquivo</button>
    </div>
    <div className="page-eyebrow" style={{marginBottom:14}}>Todos os documentos ({DOCS.length})</div>
    <div className="docs-grid" ref={ref}>
      {DOCS.map((d,i)=><div key={i} className={`doc-card${vis?" vis":""}`} style={{animationDelay:`${i*.06}s`}}><div className="doc-icon-big">{d.icon}</div><div className="doc-name">{d.nome}</div><div className="doc-meta">{d.meta}</div><span className={`doc-tag ${d.tag}`}>{d.tagLabel}</span></div>)}
    </div>
    {toast&&<div className="toast">✓ Documento enviado com sucesso!</div>}
  </>);
}

/* ══════════════ APP SHELL ══════════════ */
export default function App({ onLogout, onNavegar }){
  const [view,setView]=useState("dashboard"),[key,setKey]=useState(0);
  const navigate=(id)=>{setView(id);setKey(k=>k+1);window.scrollTo({top:0,behavior:"smooth"});};

  const [menuOpen, setMenuOpen] = useState(false);
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";

  const PAGES={
    dashboard:   <Dashboard navigate={navigate}/>,
    faturamento: <Faturamento/>,
    alertas:     <Alertas/>,
    mensagens:   <Mensagens/>,
    aprendizado: <Aprendizado/>,
    documentos:  <Documentos/>,
  };

  return(<>
    <style>{BASE}</style>
    <div className="shell">
      <header className="hdr">
        <div className="hdr-logo">bridge<span>.</span>mei</div>
        <nav className="hdr-nav">
          {NAV.map(n=>(
            <button key={n.id} className={`npill${view===n.id?" active":""}`} onClick={()=>navigate(n.id)}>
              <span>{n.icon}</span>{n.label}
              {n.badge>0&&<span className="npill-badge">{n.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="hdr-right">
          <div className="user-menu-wrapper">
          <div className="hdr-avatar" onClick={() => setMenuOpen(!menuOpen)}>
            AD
          </div>
          {menuOpen && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-avatar-big">
                  {nomeUsuario.charAt(0).toUpperCase()}
                </div>
                <div className="user-name">
                  {nomeUsuario}
                </div>
                <div className="user-email">
                  admin@email.com
                </div>
              </div>

              <div className="user-menu-divider" />

                <button className="user-menu-item" onClick={() => onNavegar("home")}>
                  🏠 Início
                </button>
                <button className="user-menu-item danger" onClick={onLogout}>
                  ⎋ Sair
                </button>
            </div>
            )}
          </div>
        </div>
      </header>
      <div key={key} className="page-wrap" style={view==="mensagens"?{paddingTop:0}:{paddingTop:4}}>
        {PAGES[view]}
      </div>
    </div>
  </>);
}