/* ═══════════════════════════════════════════════════════════════════
   RITMO Shop — Shared client code
   - localStorage cart (single source of truth)
   - Cart-badge sync (cross-tab via storage event)
   - Sticky-header on scroll
   - Reveal-on-scroll (IntersectionObserver)
   - Filter chips (home grid)
   - Add-to-cart toast
   - Year stamp
   No frameworks. No tracking. No external requests.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ───────── Cart store ─────────────────────────────────────────── */
  // Schema: [{ id, name, cat, price, qty, variant?, img? }]
  var KEY = 'ritmo.cart.v1';

  var Cart = window.RitmoCart = {
    read: function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; }
      catch (e) { return []; }
    },
    write: function (items) {
      localStorage.setItem(KEY, JSON.stringify(items));
      syncBadges();
      // notify listeners on same tab (storage event only fires cross-tab)
      window.dispatchEvent(new CustomEvent('ritmo:cart', { detail: items }));
    },
    add: function (item) {
      var items = Cart.read();
      var key = item.id + '::' + (item.variant || '');
      var found = items.find(function (i) {
        return (i.id + '::' + (i.variant || '')) === key;
      });
      if (found) {
        found.qty += (item.qty || 1);
      } else {
        items.push(Object.assign({ qty: 1 }, item));
      }
      Cart.write(items);
      return items;
    },
    setQty: function (id, variant, qty) {
      var items = Cart.read();
      var key = id + '::' + (variant || '');
      items = items.map(function (i) {
        if ((i.id + '::' + (i.variant || '')) === key) i.qty = Math.max(1, qty | 0);
        return i;
      });
      Cart.write(items);
    },
    remove: function (id, variant) {
      var key = id + '::' + (variant || '');
      var items = Cart.read().filter(function (i) {
        return (i.id + '::' + (i.variant || '')) !== key;
      });
      Cart.write(items);
    },
    clear: function () { Cart.write([]); },
    count: function () {
      return Cart.read().reduce(function (n, i) { return n + (i.qty || 0); }, 0);
    },
    subtotal: function () {
      return Cart.read().reduce(function (s, i) { return s + (i.price * (i.qty || 0)); }, 0);
    }
  };

  /* ───────── Badge sync ─────────────────────────────────────────── */
  function syncBadges() {
    var n = Cart.count();
    document.querySelectorAll('.cart-link .count').forEach(function (el) {
      var prev = el.textContent;
      el.textContent = String(n);
      var link = el.closest('.cart-link');
      if (link && prev !== el.textContent) {
        link.classList.remove('bump');
        // restart animation
        void link.offsetWidth;
        link.classList.add('bump');
      }
      if (link) link.setAttribute('title', n + ' Artikel');
    });
  }
  // cross-tab updates
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) syncBadges();
  });

  /* ───────── Toast ──────────────────────────────────────────────── */
  function toast(html) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span class="dot"></span><span class="msg">' + html + '</span>';
    document.body.appendChild(el);
    // trigger transition
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 400);
    }, 2600);
  }
  window.RitmoToast = toast;

  /* ───────── Sticky header on scroll ────────────────────────────── */
  function initStickyHeader() {
    var h = document.querySelector('.site-header');
    if (!h) return;
    var onScroll = function () {
      if (window.scrollY > 24) h.classList.add('scrolled');
      else h.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ───────── Reveal-on-scroll ──────────────────────────────────── */
  function initReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!nodes.length || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .08 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ───────── Filter chips (home) ───────────────────────────────── */
  function initFilter() {
    var btns = document.querySelectorAll('.chip-btn');
    var cards = document.querySelectorAll('.card-prod');
    var empty = document.getElementById('empty');
    if (!btns.length) return;
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        var cat = b.dataset.cat;
        var any = false;
        cards.forEach(function (c) {
          var match = (cat === 'all') || (c.dataset.cat === cat);
          c.style.display = match ? '' : 'none';
          if (match) any = true;
        });
        if (empty) empty.hidden = any;
      });
    });
  }

  /* ───────── Add-to-cart wiring ────────────────────────────────── */
  // Any element with [data-add-to-cart] expects sibling/child data attrs
  // OR a parent [data-prod-*] block to read from. Easiest: put all data
  // on the button itself.
  function initAddButtons() {
    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = {
          id:      btn.dataset.id,
          name:    btn.dataset.name,
          cat:     btn.dataset.cat || '',
          price:   parseFloat(btn.dataset.price) || 0,
          variant: btn.dataset.variant || '',
          img:     btn.dataset.img || ''
        };
        if (!item.id || !item.name) return;
        // pull variant from sibling .opt-btn.active if present
        var scope = btn.closest('[data-prod-scope]') || document;
        var activeVariants = scope.querySelectorAll('.opt-row [data-variant].active');
        if (activeVariants.length) {
          item.variant = Array.prototype.map.call(activeVariants, function (v) {
            return v.dataset.variant;
          }).join(' / ');
        }
        Cart.add(item);
        toast('<b>' + item.name + '</b> in den Warenkorb gelegt.');
      });
    });
  }

  /* ───────── Option pickers (size / color swatches) ────────────── */
  function initOptionPickers() {
    document.querySelectorAll('.opt-row').forEach(function (row) {
      row.querySelectorAll('.opt-btn,.opt-swatch').forEach(function (b) {
        b.addEventListener('click', function () {
          row.querySelectorAll('.opt-btn,.opt-swatch').forEach(function (x) {
            x.classList.remove('active');
          });
          b.classList.add('active');
        });
      });
    });
  }

  /* ───────── Sticky buy bar on PDP ─────────────────────────────── */
  function initBuyBar() {
    var bar = document.querySelector('.buy-bar');
    var anchor = document.querySelector('[data-buybar-anchor]');
    if (!bar || !anchor) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // show bar when the main CTA scrolls OUT of view
        bar.classList.toggle('visible', !e.isIntersecting);
      });
    }, { rootMargin: '-80px 0px 0px 0px' });
    io.observe(anchor);
  }

  /* ───────── Year stamp ────────────────────────────────────────── */
  function initYear() {
    var y = document.getElementById('yr');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ───────── Newsletter stub ───────────────────────────────────── */
  function initNewsletter() {
    document.querySelectorAll('[data-newsletter]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = f.querySelector('button[type="submit"]');
        if (btn) { btn.textContent = 'Danke ✓'; btn.disabled = true; }
      });
    });
  }

  /* ───────── Boot ──────────────────────────────────────────────── */
  function boot() {
    syncBadges();
    initStickyHeader();
    initReveal();
    initFilter();
    initOptionPickers();
    initAddButtons();
    initBuyBar();
    initYear();
    initNewsletter();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
