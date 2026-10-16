/* Cae1ioN ESPORTS — main.js */
(function () {
  "use strict";

  /* ---------- Header on scroll ---------- */
  const header = document.querySelector(".header");
  const toTop = document.querySelector(".to-top");
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 30);
    if (toTop) toTop.classList.toggle("show", y > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Mobile navigation ---------- */
  const burger = document.querySelector(".burger");
  const mobileNav = document.querySelector(".mobile-nav");
  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      mobileNav.classList.toggle("open");
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        burger.classList.remove("open");
        mobileNav.classList.remove("open");
      })
    );
  }

  /* ---------- Theme Toggle (aurora gelap default, krem via toggle) ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "cae1ion_theme_mode"; // "light" or "dark"
  const applyTheme = (isLight) => {
    if (isLight) document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
  };
  // Default: langit malam aurora; terang hanya bila tersimpan eksplisit
  const saved = localStorage.getItem(THEME_KEY);
  const initialLight = saved !== null ? saved === "light" : false;
  applyTheme(initialLight);
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = !document.documentElement.classList.contains("light");
      applyTheme(isLight);
      localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
    });
  }
  // Ikuti perubahan sistem hanya bila pengguna belum memilih manual
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (localStorage.getItem(THEME_KEY) === null) {
      applyTheme(!e.matches);
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const run = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      let cur = 0;
      const step = Math.max(1, Math.round(target / 60));
      const tick = () => {
        cur += step;
        if (cur >= target) cur = target;
        el.textContent = cur.toLocaleString("id-ID") + suffix;
        if (cur < target) requestAnimationFrame(tick);
      };
      tick();
    };
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run(e.target);
            co.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => co.observe(c));
  }

  /* ---------- Match / result filters (tabs) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const targetSel = group.dataset.filterTarget;
    const items = document.querySelectorAll(targetSel);
    group.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        group.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const key = tab.dataset.filter;
        items.forEach((item) => {
          const show = key === "all" || item.dataset.game === key;
          item.style.display = show ? "" : "none";
        });
      });
    });
  });

  /* ---------- Countdown to next match ---------- */
  const cd = document.querySelector("[data-countdown]");
  if (cd) {
    const target = new Date(cd.dataset.countdown).getTime();
    const update = () => {
      let diff = target - Date.now();
      if (diff < 0) diff = 0;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const parts = { d: d, h: h, m: m, s: s };
      Object.keys(parts).forEach((k) => {
        const el = cd.querySelector('[data-unit="' + k + '"]');
        if (el) el.textContent = String(parts[k]).padStart(2, "0");
      });
    };
    update();
    setInterval(update, 1000);
  }

  /* ---------- Accordion / FAQ ---------- */
  document.querySelectorAll(".acc-head").forEach((head) => {
    head.addEventListener("click", () => {
      const item = head.parentElement;
      const body = item.querySelector(".acc-body");
      const isOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".acc-item").forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".acc-body").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  /* ---------- Forms (demo, no backend) ---------- */
  document.querySelectorAll("form[data-demo]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector("[data-form-msg]");
      if (note) {
        note.textContent = "Terima kasih! Pesanmu sudah kami terima — tim kami akan menghubungi segera.";
        note.style.color = "#2ed47a";
      }
      form.reset();
    });
  });

  /* ---------- Fan Zone: prediksi skor + poin supporter ---------- */
  const predictBox = document.querySelector("[data-predict]");
  if (predictBox) {
    const VOTE_KEY = "cae1ion_vote_20261002";
    const POINTS_KEY = "cae1ion_points";
    const base = { cae1ion: 1284, draw: 96, geek: 743 };
    const labels = { cae1ion: "Cae1ioN MLBB", draw: "Draw", geek: "Geek Fam" };
    const btns = Array.from(predictBox.querySelectorAll("[data-vote]"));
    const msg = document.querySelector("[data-predict-msg]");
    const ptsEl = document.querySelector("[data-points]");
    const getPoints = () => parseInt(localStorage.getItem(POINTS_KEY) || "0", 10) || 0;
    const render = (myVote) => {
      const votes = { cae1ion: base.cae1ion, draw: base.draw, geek: base.geek };
      if (myVote) votes[myVote] += 1;
      const total = votes.cae1ion + votes.draw + votes.geek;
      btns.forEach((b) => {
        const k = b.dataset.vote;
        const pct = Math.round((votes[k] / total) * 100);
        const pctEl = b.querySelector('[data-pct="' + k + '"]');
        const barEl = b.querySelector('[data-bar="' + k + '"]');
        if (pctEl) pctEl.textContent = pct + "%";
        if (barEl) barEl.style.width = pct + "%";
        b.disabled = !!myVote;
        b.classList.toggle("picked", myVote === k);
      });
      if (ptsEl) ptsEl.textContent = getPoints().toLocaleString("id-ID");
    };
    const saved = localStorage.getItem(VOTE_KEY);
    render(saved);
    if (saved && msg) msg.textContent = "Tebakanmu: " + labels[saved] + ". +100 poin sudah masuk — poin ganda jika benar!";
    btns.forEach((b) => {
      b.addEventListener("click", () => {
        if (localStorage.getItem(VOTE_KEY)) return;
        const k = b.dataset.vote;
        localStorage.setItem(VOTE_KEY, k);
        localStorage.setItem(POINTS_KEY, String(getPoints() + 100));
        render(k);
        if (msg) msg.textContent = "Tebakanmu: " + labels[k] + ". +100 poin sudah masuk — poin ganda jika benar!";
      });
    });
  }

  /* ---------- Toast Notification System ---------- */
  const Toast = {
    container: null,
    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.style.cssText = `
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          display: flex; flex-direction: column; gap: 10px;
          pointer-events: none;
        `;
        document.body.appendChild(this.container);
      }
    },
    show(message, type = 'success', duration = 3500) {
      this.init();
      const toast = document.createElement('div');
      const colors = {
        success: { bg: '#0c3d1f', border: '#2ed47a', icon: '✓' },
        error: { bg: '#3d0c12', border: '#ff6b7d', icon: '✕' },
        info: { bg: '#1e1410', border: '#ff5d20', icon: 'ℹ' },
        warn: { bg: '#3d2e0c', border: '#f5c542', icon: '⚠' }
      };
      const c = colors[type] || colors.success;
      toast.style.cssText = `
        background: ${c.bg}; border: 1px solid ${c.border};
        color: #fff; padding: 14px 18px; border-radius: 10px;
        font-size: 14px; font-weight: 500; max-width: 320px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        display: flex; align-items: center; gap: 10px;
        transform: translateX(120%); opacity: 0;
        transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s;
        pointer-events: auto;
      `;
      toast.innerHTML = `<span style="font-size:18px;">${c.icon}</span><span>${message}</span>`;
      this.container.appendChild(toast);
      requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
      });
      setTimeout(() => this.hide(toast), duration);
      return toast;
    },
    hide(toast) {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    },
    success(m, d) { return this.show(m, 'success', d); },
    error(m, d) { return this.show(m, 'error', d); },
    info(m, d) { return this.show(m, 'info', d); },
    warn(m, d) { return this.show(m, 'warn', d); }
  };

  /* ---------- Web Share API Helper ---------- */
  const ShareUtil = {
    async share(data) {
      if (navigator.share) {
        try {
          await navigator.share(data);
          return true;
        } catch (e) { if (e.name !== 'AbortError') console.warn('Share cancelled'); }
      }
      // Fallback: copy to clipboard
      const text = `${data.title}\n${data.text}\n${data.url}`;
      await navigator.clipboard.writeText(text);
      Toast.info('Link disalin ke clipboard!');
      return false;
    }
  };

  /* ---------- Player of the Week Voting ---------- */
  const POTW = {
    KEY: 'potw_vote_',
    init() {
      const boxes = document.querySelectorAll('[data-potw]');
      boxes.forEach(box => {
        const week = box.dataset.potw;
        const players = JSON.parse(box.dataset.players || '[]');
        const voted = localStorage.getItem(this.KEY + week);
        this.render(box, players, voted);
        box.querySelectorAll('[data-potw-vote]').forEach(btn => {
          btn.addEventListener('click', () => this.vote(box, week, btn.dataset.potwVote, players));
        });
      });
    },
    render(box, players, voted) {
      const list = box.querySelector('[data-potw-list]');
      if (!list) return;
      const total = players.reduce((s, p) => s + p.votes, 0) || 1;
      list.innerHTML = players.map(p => {
        const pct = Math.round((p.votes / total) * 100);
        const isVoted = voted === p.id;
        return `
          <button type="button" data-potw-vote="${p.id}" ${voted ? 'disabled' : ''} class="potw-item ${isVoted ? 'voted' : ''}" style="
            display:flex;align-items:center;gap:12px;width:100%;text-align:left;
            background:var(--surface-2);border:1px solid ${isVoted ? 'var(--accent)' : 'var(--line)'};
            border-radius:10px;padding:12px 14px;cursor:${voted ? 'default' : 'pointer'};
            transition:.25s;position:relative;overflow:hidden;
          ">
            <span style="font-weight:700;color:${isVoted ? 'var(--accent)' : 'var(--text)'};position:relative;z-index:2;">${p.name}</span>
            <span style="margin-left:auto;font-size:13px;color:var(--muted);position:relative;z-index:2;">${pct}%</span>
            <i class="potw-bar" style="position:absolute;left:0;top:0;bottom:0;width:${pct}%;background:rgba(139,92,246,.18);transition:width .6s;z-index:1;"></i>
          </button>
        `;
      }).join('');
      if (voted) {
        const msg = box.querySelector('[data-potw-msg]');
        if (msg) msg.textContent = 'Kamu sudah vote! Hasil update real-time.';
      }
    },
    vote(box, week, playerId, players) {
      const p = players.find(x => x.id === playerId);
      if (!p) return;
      p.votes = (p.votes || 0) + 1;
      localStorage.setItem(this.KEY + week, playerId);
      // Simpan data terupdate (demo: simpan ke localStorage)
      localStorage.setItem('potw_data_' + week, JSON.stringify(players));
      this.render(box, players, playerId);
      Toast.success(`Vote untuk ${p.name} berhasil! +50 poin supporter.`);
    }
  };

  /* ---------- Referral Code System ---------- */
  const Referral = {
    generate() {
      const name = (localStorage.getItem('cae1ion_member_name') || 'C1N').toUpperCase().slice(0, 4);
      const num = Math.floor(100 + Math.random() * 900);
      return `Cae1ioN-${name}-${num}`;
    },
    init() {
      const el = document.querySelector('[data-referral]');
      if (!el) return;
      let code = localStorage.getItem('cae1ion_referral_code');
      if (!code) {
        code = this.generate();
        localStorage.setItem('cae1ion_referral_code', code);
      }
      el.textContent = code;
      const copyBtn = document.querySelector('[data-copy-referral]');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          await navigator.clipboard.writeText(code);
          Toast.success('Kode referral disalin!');
        });
      }
    }
  };

  /* ---------- Init all new features ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    POTW.init();
    Referral.init();

    /* Share buttons */
    document.querySelectorAll('[data-share]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = window.location.href;
        const title = document.title;
        const text = 'Lihat ini di Cae1ioN TEAM!';
        ShareUtil.share({ title, text, url });
      });
    });
  });

  /* ---------- Bungkus semua tulisan Cae1ioN dengan font Del Rose ---------- */
  (function () {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!/Cae1ioN/.test(n.nodeValue || "")) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p || /^(SCRIPT|STYLE)$/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const wrap = document.createDocumentFragment();
      n.nodeValue.split(/(Cae1ioN)/g).forEach((part) => {
        if (part === "Cae1ioN") {
          const s = document.createElement("span");
          s.className = "font-caelion";
          s.textContent = part;
          wrap.appendChild(s);
        } else if (part) wrap.appendChild(document.createTextNode(part));
      });
      n.parentNode.replaceChild(wrap, n);
    });
  })();

  /* Expose for debugging */
  window.Cae1ioNUtils = { Toast, ShareUtil, POTW, Referral };
})();


