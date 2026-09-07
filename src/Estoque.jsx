import { useState, useEffect, useRef, useCallback } from "react";
import { fetchEstoqueWithAuth } from "./services/api.js";

const STYLES = `
  *, *::before, *::after {
    box-sizing: border-box;
  }

  .est-shell {
    font-family: var(--font-body);
    background: var(--color-bg);
    min-height: 100vh;
    color: var(--color-text);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    left: 0 !important;
  }

  .est-shell::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(
        ellipse 70% 55% at 0% 0%,
        var(--color-accent-glow) 0%,
        transparent 60%
      ),
      radial-gradient(
        ellipse 50% 40% at 100% 100%,
        var(--color-accent-bg) 0%,
        transparent 55%
      ),
      radial-gradient(
        ellipse 35% 30% at 50% 40%,
        rgba(143, 29, 63, 0.08) 0%,
        transparent 65%
      );
    animation: estAmb 20s ease-in-out infinite alternate;
  }

  @keyframes estAmb {
    0% {
      opacity: .8;
    }

    100% {
      opacity: 1;
      transform: scale(1.03);
    }
  }

  .est-pw {
    position: relative;
    z-index: 1;
    flex: 1;
    max-width: 980px;
    width: 100%;
    margin: 0 auto;
    padding: 24px 24px 48px;
    animation: estPIn .35s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes estPIn {
    from {
      opacity: 0;
      transform: translateY(14px);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes estSIn {
    from {
      opacity: 0;
      transform: scale(.94) translateY(10px);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes estFUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes estFly {
    0%, 100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-6px);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .est-ey {
    font-size: 10px;
    color: var(--color-text-muted);
    letter-spacing: 2.5px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .est-h1 {
    font-family: var(--font-heading);
    font-size: 28px;
    margin-bottom: 6px;
    color: var(--color-text);
  }

  .est-h1 em {
    font-style: italic;
    background: linear-gradient(
      135deg,
      var(--color-accent-hover),
      var(--color-accent)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .est-sub {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
  }

  .est-abanner {
    background: rgba(239, 68, 68, .07);
    border: 1px solid rgba(239, 68, 68, .22);
    border-left: 3px solid var(--color-danger);
    border-radius: 14px;
    padding: 13px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    font-size: 13px;
    color: rgba(239, 68, 68, .9);
    flex-wrap: wrap;
  }

  .est-abanner strong {
    color: var(--color-danger);
  }

  /* Spinner de loading */

  .est-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 60px;
    color: var(--color-text-secondary);
    font-size: 14px;
  }

  .est-spinner {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid var(--color-accent-bg);
    border-top-color: var(--color-accent);
    animation: spin .7s linear infinite;
  }

  /* Error banner */

  .est-err {
    background: rgba(239, 68, 68, .08);
    border: 1px solid rgba(239, 68, 68, .25);
    border-radius: 14px;
    padding: 16px 20px;
    color: #f87171;
    font-size: 13px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .est-err-retry {
    margin-left: auto;
    background: none;
    border: 1px solid rgba(239, 68, 68, .35);
    color: #f87171;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 12px;
    cursor: pointer;
    font-family: var(--font-body);
    transition: all .2s;
  }

  .est-err-retry:hover {
    background: rgba(239, 68, 68, .12);
  }

  .est-sg {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .est-sc {
    border-radius: 16px;
    padding: 18px;
    cursor: pointer;
    opacity: 0;
    position: relative;
    overflow: hidden;
    transition:
      transform .35s cubic-bezier(.22,1,.36,1),
      box-shadow .35s;
  }

  .est-sc::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      var(--color-accent-border),
      var(--color-accent-bg),
      transparent 60%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  .est-sc.vis {
    animation: estSIn .65s cubic-bezier(.22,1,.36,1) forwards;
  }

  .est-sc:nth-child(1).vis {
    animation-delay: .08s;
  }

  .est-sc:nth-child(2).vis {
    animation-delay: .18s;
  }

  .est-sc:nth-child(3).vis {
    animation-delay: .28s;
  }

  .est-sc:nth-child(4).vis {
    animation-delay: .38s;
  }

  .est-sc:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0, 0, 0, .5);
  }

  /* Cards semânticos */

  .est-sc0 {
    background: linear-gradient(
      135deg,
      var(--color-accent-bg) 0%,
      rgba(0, 0, 0, .40) 100%
    );
  }

  .est-sc1 {
    background: linear-gradient(
      135deg,
      rgba(34, 197, 94, .14) 0%,
      rgba(0, 0, 0, .40) 100%
    );
  }

  .est-sc2 {
    background: linear-gradient(
      135deg,
      rgba(245, 158, 11, .14) 0%,
      rgba(0, 0, 0, .40) 100%
    );
  }

  .est-sc3 {
    background: linear-gradient(
      135deg,
      rgba(239, 68, 68, .14) 0%,
      rgba(0, 0, 0, .40) 100%
    );
  }

  .est-sc0 .est-sval {
    background: linear-gradient(
      135deg,
      var(--color-accent-hover),
      var(--color-accent)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .est-sc1 .est-sval {
    color: #4ade80;
  }

  .est-sc2 .est-sval {
    color: #fbbf24;
  }

  .est-sc3 .est-sval {
    color: #f87171;
  }

  .est-sico {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-bottom: 12px;
    animation: estFly 3.5s ease-in-out infinite;
  }

  .est-sico0 {
    background: var(--color-accent-bg);
    border: 1px solid var(--color-accent-border);
  }

  .est-sico1 {
    background: rgba(34, 197, 94, .15);
    border: 1px solid rgba(34, 197, 94, .25);
    animation-delay: .5s;
  }

  .est-sico2 {
    background: rgba(245, 158, 11, .15);
    border: 1px solid rgba(245, 158, 11, .25);
    animation-delay: 1s;
  }

  .est-sico3 {
    background: rgba(239, 68, 68, .15);
    border: 1px solid rgba(239, 68, 68, .25);
    animation-delay: 1.5s;
  }

  .est-slbl {
    font-size: 9px;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 6px;
  }

  .est-sval {
    font-family: var(--font-heading);
    font-size: 26px;
    letter-spacing: -1px;
    line-height: 1;
    margin-bottom: 8px;
  }

  .est-ssub {
    font-size: 11px;
    color: var(--color-text-secondary);
  }

  .est-tok {
    color: var(--color-success);
  }

  .est-twarn {
    color: var(--color-warning);
  }

  .est-tdng {
    color: var(--color-danger);
  }

  .est-bw {
    height: 3px;
    border-radius: 6px;
    margin: 8px 0 6px;
    overflow: hidden;
  }

  .est-bw0 {
    background: var(--color-accent-bg);
  }

  .est-bw1 {
    background: rgba(34, 197, 94, .10);
  }

  .est-bw2 {
    background: rgba(245, 158, 11, .10);
  }

  .est-bw3 {
    background: rgba(239, 68, 68, .10);
  }

  .est-bf {
    height: 100%;
    border-radius: 6px;
    transition: width 1.4s cubic-bezier(.22,1,.36,1);
  }

  .est-tb {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }

  .est-bp {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .22s;
    background: linear-gradient(
      135deg,
      var(--color-accent-hover),
      var(--color-accent)
    );
    color: #fff;
    box-shadow: 0 4px 20px var(--color-accent-glow);
    white-space: nowrap;
  }

  .est-bp:hover {
    background: linear-gradient(
      135deg,
      var(--color-accent),
      var(--color-accent-hover)
    );
    transform: translateY(-1px);
  }

  .est-bp:disabled {
    opacity: .5;
    cursor: not-allowed;
    transform: none;
  }

  .est-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--color-accent-bg);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    font-family: var(--font-body);
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 10px;
    cursor: pointer;
    transition: all .2s;
    margin-bottom: 20px;
  }

  .est-back:hover {
    border-color: var(--color-accent-border);
    color: var(--color-text);
    background: var(--color-surface-hover);
  }

  .est-tp {
    border-radius: 20px;
    overflow: hidden;
    animation: estFUp .6s .2s cubic-bezier(.22,1,.36,1) both;
    position: relative;
  }

  .est-tp::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      var(--color-accent-border),
      var(--color-accent-bg),
      transparent 50%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 2;
  }

  .est-tp-inner {
    background: var(--color-bg-secondary);
    border-radius: 20px;
    overflow-x: auto;
    position: relative;
  }

  .est-ph {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--color-accent-bg);
  }

  .est-ptitle {
    font-size: 14px;
    font-weight: 600;
    background: linear-gradient(
      135deg,
      var(--color-text),
      var(--color-accent-hover)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .est-pcnt {
    font-size: 11px;
    color: var(--color-accent);
    background: var(--color-accent-bg);
    border: 1px solid var(--color-accent-border);
    padding: 4px 12px;
    border-radius: 20px;
  }

  .est-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
  }

  .est-table thead {
    background: linear-gradient(
      90deg,
      var(--color-accent-bg),
      rgba(143, 29, 63, .04)
    );
  }

  .est-table thead tr {
    border-bottom: 1px solid var(--color-accent-bg);
  }

  .est-table th {
    padding: 10px 16px;
    text-align: left;
    font-size: 10px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 500;
    white-space: nowrap;
  }

  .est-table td {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(143, 29, 63, .06);
    vertical-align: middle;
  }

  .est-table tr:last-child td {
    border-bottom: none;
  }

  .est-table tbody tr {
    transition: background .2s ease;
  }

  .est-table tbody tr:hover {
    background: var(--color-surface);
  }

  .est-pn {
    color: var(--color-text);
    font-size: 13px;
    font-weight: 500;
  }

  .est-ps {
    color: var(--color-text-muted);
    font-size: 10px;
    margin-top: 3px;
  }

  .est-qr {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .est-qn {
    color: var(--color-text);
    font-size: 13px;
    min-width: 25px;
  }

  .est-qb {
    width: 70px;
    height: 4px;
    background: var(--color-surface-hover);
    border-radius: 4px;
    overflow: hidden;
  }

  .est-qbf {
    height: 100%;
    border-radius: 4px;
    transition: width .6s ease;
  }

  .est-pr {
    color: var(--color-text-secondary);
    font-size: 13px;
  }

  .est-empty {
    text-align: center;
    padding: 40px 20px !important;
    color: var(--color-text-muted);
    font-size: 13px;
  }

  .est-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .est-act {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all .2s;
  }

  .est-act:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-border-hover);
    color: var(--color-text);
  }

  .est-act.edit:hover {
    border-color: var(--color-accent-border);
    color: var(--color-accent);
  }

  .est-act.mov:hover {
    border-color: var(--color-success-border);
    color: var(--color-success);
  }

  .est-act.del:hover {
    border-color: rgba(239, 68, 68, .35);
    color: var(--color-danger);
  }

  .est-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 9px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 500;
    white-space: nowrap;
  }

  .est-bok {
    color: var(--color-success);
    background: var(--color-success-glow);
    border: 1px solid var(--color-success-border);
  }

  .est-blow {
    color: var(--color-warning);
    background: rgba(245, 158, 11, .10);
    border: 1px solid rgba(245, 158, 11, .25);
  }

  .est-bout {
    color: var(--color-danger);
    background: rgba(239, 68, 68, .10);
    border: 1px solid rgba(239, 68, 68, .25);
  }

  /* Modal */

  .est-mbg {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(0, 0, 0, .72);
    backdrop-filter: blur(8px);
    animation: estFade .2s ease;
  }

  @keyframes estFade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .est-mo {
    width: 100%;
    max-width: 430px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-accent-border);
    border-radius: 18px;
    padding: 26px;
    box-shadow: var(--shadow-modal);
    animation: estFUp .3s cubic-bezier(.22,1,.36,1);
  }

  .est-mt {
    font-family: var(--font-heading);
    font-size: 25px;
    color: var(--color-text);
    margin-bottom: 5px;
  }

  .est-mt em {
    color: var(--color-accent);
    font-style: italic;
  }

  .est-ms {
    color: var(--color-text-muted);
    font-size: 12px;
    margin-bottom: 22px;
  }

  .est-fg {
    margin-bottom: 16px;
  }

  .est-fg label {
    display: block;
    color: var(--color-text-secondary);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 7px;
  }

  .est-fg input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid var(--color-border);
    background: var(--color-input-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: 13px;
    outline: none;
    transition: all .2s;
  }

  .est-fg input:focus {
    border-color: var(--color-accent-border);
    background: var(--color-accent-bg);
    box-shadow: 0 0 0 3px var(--color-accent-glow);
  }

  .est-fg input::placeholder {
    color: var(--color-text-faint);
  }

  .est-mbtns {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 22px;
  }

  .est-bcx {
    padding: 10px 18px;
    border-radius: 9px;
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text-secondary);
    font-family: var(--font-body);
    font-size: 12px;
    cursor: pointer;
    transition: all .2s;
  }

  .est-bcx:hover {
    border-color: var(--color-border-hover);
    color: var(--color-text);
    background: var(--color-surface);
  }

  .est-bsv {
    padding: 10px 18px;
    border-radius: 9px;
    border: none;
    background: linear-gradient(
      135deg,
      var(--color-accent-hover),
      var(--color-accent)
    );
    color: #fff;
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s;
  }

  .est-bsv:hover {
    background: linear-gradient(
      135deg,
      var(--color-accent),
      var(--color-accent-hover)
    );
    transform: translateY(-1px);
  }

  .est-bsv:disabled,
  .est-bcx:disabled {
    opacity: .5;
    cursor: not-allowed;
    transform: none;
  }

  /* Modal movimento */

  .est-mpill {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 18px;
  }

  .est-mpill strong {
    color: var(--color-text);
    font-size: 13px;
  }

  .est-mpill span {
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .est-mtype {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 18px;
  }

  .est-mtbtn {
    padding: 10px;
    border-radius: 9px;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    font-family: var(--font-body);
    font-size: 12px;
    cursor: pointer;
    transition: all .2s;
  }

  .est-mtbtn.en.act {
    color: var(--color-success);
    border-color: var(--color-success-border);
    background: var(--color-success-glow);
  }

  .est-mtbtn.sa.act {
    color: var(--color-warning);
    border-color: rgba(245, 158, 11, .30);
    background: rgba(245, 158, 11, .10);
  }

  .est-mtbtn:hover {
    border-color: var(--color-border-hover);
    color: var(--color-text);
  }

  .est-bsv.entrada {
    background: linear-gradient(
      135deg,
      #22c55e,
      #16a34a
    );
    box-shadow: 0 4px 16px rgba(22, 163, 74, .25);
  }

  .est-bsv.entrada:hover {
    background: linear-gradient(
      135deg,
      #22c55e,
      #16a34a
    );
  }

  .est-bsv.saida {
    background: linear-gradient(
      135deg,
      #d97706,
      #b45309
    );
    box-shadow: 0 4px 16px rgba(217, 119, 6, .25);
  }

  .est-bsv.saida:hover {
    background: linear-gradient(
      135deg,
      #f59e0b,
      #d97706
    );
  }

  .est-toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: var(--color-accent-bg);
    border: 1px solid var(--color-accent-border);
    color: var(--color-accent-hover);
    padding: 13px 22px;
    border-radius: 12px;
    font-size: 13px;
    animation: estFUp .3s cubic-bezier(.22,1,.36,1);
    z-index: 9999;
    font-family: var(--font-body);
  }

  .est-toast.ok {
    background: var(--color-success-glow);
    border-color: var(--color-success-border);
    color: #4ade80;
  }

  .est-toast.err {
    background: rgba(239, 68, 68, .12);
    border-color: rgba(239, 68, 68, .30);
    color: #f87171;
  }

  @media(max-width: 900px) {
    .est-sg {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media(max-width: 600px) {
    .est-sg {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────
const DEFAULT_MIN  = 5; // min não existe na API, mantemos local
const sku          = (id) => "SKU-" + String(id).padStart(4, "0");
const getStatus    = (p)  => (p.quantidade === 0 ? "out" : p.quantidade <= (p.min ?? DEFAULT_MIN) ? "low" : "ok");
const getBarW      = (p)  => { const m = Math.max(p.quantidade, (p.min ?? DEFAULT_MIN) * 2, 1); return Math.min(100, Math.round((p.quantidade / m) * 100)); };
const getBarC      = (p)  => ({ out:"#ef4444", low:"#f59e0b", ok:"#22c55e" }[getStatus(p)]);
const BADGE_CLS    = { ok:"est-badge est-bok", low:"est-badge est-blow", out:"est-badge est-bout" };
const BADGE_LBL    = { ok:"Em estoque", low:"Estoque baixo", out:"Zerado" };

// ── Hook: IntersectionObserver ─────────────────────────────────────────────
function useVis(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ref é um objeto estável, não precisa entrar nas deps
  return v;
}

// ── Modal: Adicionar / Editar produto ─────────────────────────────────────
function ModalProduto({ onClose, onSave, initial, loading }) {
  const [f, setF] = useState(
    initial
      ? { nome: initial.nome, preco: initial.preco ?? 0 }
      : { nome: "", preco: "" }
  );
  const s = (k, v) => setF((x) => ({ ...x, [k]: v }));

  const save = () => {
    if (!f.nome.trim()) return alert("Nome é obrigatório.");
    onSave({ nome: f.nome.trim(), preco: parseFloat(f.preco) || 0 });
  };

  return (
    <div className="est-mbg" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="est-mo">
        <div className="est-mt">{initial ? "Editar" : "Novo"} <em>produto</em></div>
        <div className="est-ms">
          {initial ? "Atualize o nome e o preço do item" : "Informe os dados do novo produto"}
        </div>
        <div className="est-fg">
          <label>Nome do produto</label>
          <input
            placeholder="Ex: Notebook Dell i7"
            value={f.nome}
            onChange={(e) => s("nome", e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="est-fg">
          <label>Preço unitário (R$)</label>
          <input
            type="number" min="0" step="0.01" placeholder="0,00"
            value={f.preco}
            onChange={(e) => s("preco", e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="est-mbtns">
          <button className="est-bcx" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="est-bsv" onClick={save} disabled={loading}>
            {loading ? "Salvando…" : "✓ Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Entrada / Saída de estoque ─────────────────────────────────────
function ModalMovimento({ produto, onClose, onConfirm, loading }) {
  const [tipo, setTipo]       = useState("entrada"); // "entrada" | "saida"
  const [quantidade, setQtd]  = useState("");

  const confirmar = () => {
    const q = parseInt(quantidade);
    if (!q || q <= 0) return alert("Informe uma quantidade válida.");
    if (tipo === "saida" && q > produto.quantidade)
      return alert(`Quantidade insuficiente. Estoque atual: ${produto.quantidade}`);
    onConfirm(tipo, q);
  };

  return (
    <div className="est-mbg" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="est-mo">
        <div className="est-mt">Movimentar <em>estoque</em></div>
        <div className="est-ms">Registre entrada ou saída de unidades</div>

        {/* Info do produto */}
        <div className="est-mpill">
          <div>
            <strong>{produto.nome}</strong>
            <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{sku(produto.id)}</div>
          </div>
          <span>{produto.quantidade} un.</span>
        </div>

        {/* Seletor entrada / saída */}
        <div className="est-mtype">
          <button
            className={`est-mtbtn en ${tipo === "entrada" ? "act" : ""}`}
            onClick={() => setTipo("entrada")}
            disabled={loading}
          >
            ▲ Entrada
          </button>
          <button
            className={`est-mtbtn sa ${tipo === "saida" ? "act" : ""}`}
            onClick={() => setTipo("saida")}
            disabled={loading}
          >
            ▼ Saída
          </button>
        </div>

        <div className="est-fg">
          <label>Quantidade</label>
          <input
            type="number" min="1" placeholder="Ex: 10"
            value={quantidade}
            onChange={(e) => setQtd(e.target.value)}
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="est-mbtns">
          <button className="est-bcx" onClick={onClose} disabled={loading}>Cancelar</button>
          <button
            className={`est-bsv ${tipo}`}
            onClick={confirmar}
            disabled={loading}
          >
            {loading
              ? "Processando…"
              : tipo === "entrada"
                ? "▲ Confirmar entrada"
                : "▼ Confirmar saída"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function Estoque({ onNavegar }) {
  const [produtos,  setProdutos]  = useState([]);
  const [loadingPage, setLP]      = useState(true);
  const [loadingAct,  setLA]      = useState(false);
  const [erro,      setErro]      = useState("");
  const [modal,     setModal]     = useState(null); // null | "novo" | produto (editar) | { mov: produto }
  const [toast,     setToast]     = useState(null); // { msg, tipo }
  const [anim,      setAnim]      = useState(false);

  const sRef = useRef(null);
  const sVis = useVis(sRef);

  // ── API helpers ──────────────────────────────────────────────────────────
  const apiFetch = useCallback(async (path, options = {}) => {
    const res = await fetchEstoqueWithAuth(path, options);

    if (!res.ok) { 
      let message = `Erro HTTP ${res.status}`

      try {
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const data = await res.json();
          message = data.message || data.title || message;
        } else {
           const text = await res.text();
            if (text) message = text;
        }
      } catch (error) {
        
      }
      throw new Error(message);
    }
    return res.json();
  }, []);

  const carregarProdutos = useCallback(async () => {
    try {
      setErro("");
      const data = await apiFetch("/api/Produtos");
      // A API retorna campos em PascalCase (Id, Nome, Quantidade, Preco)
      // Normalizamos para camelCase
      setProdutos(data.map((p) => ({
        id:         p.Id         ?? p.id,
        nome:       p.Nome       ?? p.nome,
        quantidade: p.Quantidade ?? p.quantidade ?? 0,
        preco:      p.Preco      ?? p.preco      ?? 0,
      })));
    } catch (e) {
      setErro("Não foi possível carregar os produtos. " + e.message);
    } finally {
      setLP(false);
    }
  }, [apiFetch]);

  useEffect(() => {
  let ativo = true;
  const load = async () => {
    if (ativo) await carregarProdutos();
  };
  load();
  return () => { ativo = false; };
}, [carregarProdutos]);
  useEffect(() => { const t = setTimeout(() => setAnim(true), 350); return () => clearTimeout(t); }, []);

  // ── Toast ────────────────────────────────────────────────────────────────
  const showToast = (msg, tipo = "ok") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Criar produto ────────────────────────────────────────────────────────
  const salvarProduto = async (form) => {
    setLA(true);
    try {
      // POST /api/produtos  → body: { Nome, Preco, Quantidade }
      await apiFetch("/api/Produtos", {
        method: "POST",
        body: JSON.stringify({ 
          Nome: form.nome,
          Preco: form.preco,
          Quantidade: 0
         }),
      });

      await carregarProdutos();
      setModal(null);
      showToast("✓ Produto adicionado!");
    } catch (e) {
      showToast("Erro: " + e.message, "err");
    } finally {
      setLA(false);
    }
  };

  // ── Movimentar estoque (Entrada ou Saída) ────────────────────────────────
  const confirmarMovimento = async (tipo, quantidade) => {
    const produto = modal.mov;
    setLA(true);
    try {
      // POST /api/produtos/entrada?id=X&quantidade=Y
      // POST /api/produtos/saida?id=X&quantidade=Y
      await apiFetch(`/api/Produtos/${tipo}?id=${produto.id}&quantidade=${quantidade}`, {
        method: "POST",
      });
      await carregarProdutos();
      setModal(null);
      const emoji = tipo === "entrada" ? "▲" : "▼";
      showToast(`${emoji} ${tipo === "entrada" ? "Entrada" : "Saída"} de ${quantidade} un. registrada!`);
    } catch (e) {
      showToast("Erro: " + e.message, "err");
    } finally {
      setLA(false);
    }
  };

  // ── Excluir (requer endpoint DELETE na API — ver nota abaixo) ────────────
  const excluir = async (p) => {
    if (!confirm(`Remover "${p.nome}"?`)) return;
    setLA(true);
    try {
      // DELETE /api/produtos/{id}  ← precisa adicionar esse endpoint na API
      await apiFetch(`/api/Produtos/${p.id}`, { method: "DELETE" });
      await carregarProdutos();
      showToast("Produto removido.");
    } catch (e) {
      showToast("Erro ao remover: " + e.message, "err");
    } finally {
      setLA(false);
    }
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const zerados    = produtos.filter((p) => getStatus(p) === "out").length;
  const baixo      = produtos.filter((p) => getStatus(p) === "low").length;
  const valorTotal = produtos.reduce((a, p) => a + p.quantidade * p.preco, 0);

  const STATS = [
    {
      C:"est-sc est-sc0", I:"est-sico est-sico0", emoji:"📦",
      lbl:"Total", val: produtos.length,
      sub: <><span className="est-tok">▲ {produtos.length}</span> itens</>,
      bwC:"est-bw est-bw0",
      bf: { width: anim ? `${Math.min(100, produtos.length * 8)}%` : "0%", background:"linear-gradient(90deg,#c084fc,#9333ea)" },
    },
    {
      C:"est-sc est-sc1", I:"est-sico est-sico1", emoji:"💰",
      lbl:"Valor total", val: `R$ ${(valorTotal).toFixed(2)}`,
      sub: <><span className="est-tok">▲</span> em estoque</>,
      bwC:"est-bw est-bw1",
      bf: { width: anim ? "78%" : "0%", background:"linear-gradient(90deg,#4ade80,#22c55e)" },
    },
    {
      C:"est-sc est-sc2", I:"est-sico est-sico2", emoji:"⚠️",
      lbl:"Estoque baixo", val: baixo,
      sub: <><span className="est-twarn">{baixo} item(s)</span> críticos</>,
      bwC:"est-bw est-bw2",
      bf: { width: anim ? `${Math.min(100, baixo * 20)}%` : "0%", background:"linear-gradient(90deg,#fbbf24,#f59e0b)" },
    },
    {
      C:"est-sc est-sc3", I:"est-sico est-sico3", emoji:"🔴",
      lbl:"Zerados", val: zerados,
      sub: <><span className="est-tdng">{zerados} item(s)</span> sem estoque</>,
      bwC:"est-bw est-bw3",
      bf: { width: anim ? `${Math.min(100, zerados * 20)}%` : "0%", background:"linear-gradient(90deg,#f87171,#ef4444)" },
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>
      <div className="est-shell">
        <div className="est-pw">

          {onNavegar && (
            <button className="est-back" onClick={() => onNavegar("mei")}>
              ← Voltar para o Dashboard
            </button>
          )}

          <div className="est-ey">
            Inventário · {new Date().toLocaleDateString("pt-BR", { month:"long", year:"numeric" })}
          </div>
          <h1 className="est-h1">Controle de <em>Estoque</em></h1>
          <div className="est-sub">Gerencie produtos, quantidades e alertas em tempo real</div>

          {erro && (
            <div className="est-err">
              ⚠ {erro}
              <button className="est-err-retry" onClick={carregarProdutos}>Tentar novamente</button>
            </div>
          )}

          {(zerados > 0 || baixo > 0) && !loadingPage && (
            <div className="est-abanner">
              <span>🔴</span>
              <div><strong>Atenção:</strong> {zerados} produto(s) sem estoque e {baixo} com quantidade crítica.</div>
            </div>
          )}

          <div className="est-sg" ref={sRef}>
            {STATS.map((s, i) => (
              <div key={i} className={`${s.C}${sVis ? " vis" : ""}`}>
                <div className={s.I}>{s.emoji}</div>
                <div className="est-slbl">{s.lbl}</div>
                <div className="est-sval">{s.val}</div>
                <div className={s.bwC}><div className="est-bf" style={s.bf} /></div>
                <div className="est-ssub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="est-tb">
            <button className="est-bp" onClick={() => setModal("novo")} disabled={loadingAct}>
              ＋ Adicionar produto
            </button>
          </div>

          <div className="est-tp">
            <div className="est-tp-inner">
              <div className="est-ph">
                <div className="est-ptitle">Produtos em estoque</div>
                <div className="est-pcnt">{produtos.length} itens</div>
              </div>

              {loadingPage ? (
                <div className="est-loading">
                  <div className="est-spinner" />
                  Carregando produtos…
                </div>
              ) : (
                <table className="est-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço unit.</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.length === 0 ? (
                      <tr><td colSpan={5} className="est-empty">Nenhum produto cadastrado</td></tr>
                    ) : (
                      produtos.map((p) => {
                        const st = getStatus(p);
                        return (
                          <tr key={p.id}>
                            <td>
                              <div className="est-pn">{p.nome}</div>
                              <div className="est-ps">{sku(p.id)}</div>
                            </td>
                            <td>
                              <div className="est-qr">
                                <span className="est-qn">{p.quantidade}</span>
                                <div className="est-qb">
                                  <div className="est-qbf" style={{ width: anim ? `${getBarW(p)}%` : "0%", background: getBarC(p) }} />
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="est-pr">
                                R$ {p.preco.toLocaleString("pt-BR", { minimumFractionDigits:2 })}
                              </span>
                            </td>
                            <td><span className={BADGE_CLS[st]}>{BADGE_LBL[st]}</span></td>
                            <td>
                              <div className="est-actions">
                                {/* ▲ Entrada */}
                                <button
                                  className="est-bi est-ben"
                                  title="Registrar entrada"
                                  disabled={loadingAct}
                                  onClick={() => setModal({ mov: p })}
                                >▲ Mov.</button>
                                {/* ✕ Excluir */}
                                <button
                                  className="est-bi est-bdl"
                                  title="Remover produto"
                                  disabled={loadingAct}
                                  onClick={() => excluir(p)}
                                >✕</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modal: Novo produto */}
      {modal === "novo" && (
        <ModalProduto
          onClose={() => setModal(null)}
          onSave={salvarProduto}
          loading={loadingAct}
        />
      )}

      {/* Modal: Movimentação */}
      {modal?.mov && (
        <ModalMovimento
          produto={modal.mov}
          onClose={() => setModal(null)}
          onConfirm={confirmarMovimento}
          loading={loadingAct}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`est-toast ${toast.tipo}`}>{toast.msg}</div>
      )}
    </>
  );
}
