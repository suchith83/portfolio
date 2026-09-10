(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stepDelay = prefersReduced ? 0 : 700;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function announce(root, message) {
    const live = root.querySelector('[data-live]');
    if (live) live.textContent = message;
  }

  function setStatus(root, message) {
    const status = root.querySelector('[data-status]');
    if (status) status.textContent = message;
    announce(root, message);
  }

  function qs(root, sel) {
    return root.querySelector(sel);
  }

  function qsa(root, sel) {
    return Array.from(root.querySelectorAll(sel));
  }

  /* ---------- SeatGrid ---------- */
  function SeatGrid(root) {
    const seats = qsa(root, '[data-seat]');
    const selectedEl = qs(root, '[data-selected-seat]');

    function setSelected(id) {
      seats.forEach((btn) => {
        const on = btn.getAttribute('data-seat') === id;
        btn.classList.toggle('is-selected', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (selectedEl) selectedEl.textContent = id || '—';
      setStatus(root, id ? `You selected ${id}. Now imagine someone else selected it too.` : 'Pick a seat.');
    }

    seats.forEach((btn) => {
      btn.addEventListener('click', () => setSelected(btn.getAttribute('data-seat')));
    });

    setSelected(null);
  }

  /* ---------- ConcurrentRequests (naive race) ---------- */
  function ConcurrentRequests(root) {
    const log = qs(root, '[data-log]');
    const seat = qs(root, '[data-race-seat]');
    let running = false;
    let step = 0;

    const steps = [
      { who: 'A', text: 'SELECT status FROM seats WHERE id = A10 → FREE', state: 'FREE' },
      { who: 'B', text: 'SELECT status FROM seats WHERE id = A10 → FREE', state: 'FREE' },
      { who: 'A', text: 'UPDATE seats SET status = BOOKED WHERE id = A10', state: 'BOOKED', owner: 'A' },
      { who: 'B', text: 'UPDATE seats SET status = BOOKED WHERE id = A10', state: 'BOOKED', owner: 'both' },
      { who: 'sys', text: 'Congratulations. You sold one seat twice.', state: 'BOOKED', owner: 'both', fail: true }
    ];

    function renderLog(items) {
      log.innerHTML = items
        .map(
          (s) =>
            `<div class="viz-log__row ${s.fail ? 'is-fail' : ''}" data-who="${s.who}"><span class="viz-log__who">${s.who === 'sys' ? 'result' : 'User ' + s.who}</span><span>${s.text}</span></div>`
        )
        .join('');
    }

    function paintSeat(state, owner) {
      seat.dataset.state = state;
      seat.textContent = owner === 'both' ? 'A10 · DOUBLE' : owner ? `A10 · ${owner}` : `A10 · ${state}`;
      seat.classList.toggle('is-fail', owner === 'both');
    }

    async function run() {
      if (running) return;
      running = true;
      step = 0;
      renderLog([]);
      paintSeat('FREE', null);
      setStatus(root, 'Running naive concurrent bookings…');

      const shown = [];
      for (const s of steps) {
        shown.push(s);
        renderLog(shown);
        paintSeat(s.state, s.owner || null);
        setStatus(root, s.text);
        step += 1;
        await sleep(stepDelay);
      }
      running = false;
    }

    function reset() {
      running = false;
      step = 0;
      renderLog([]);
      paintSeat('FREE', null);
      setStatus(root, 'Ready. Press Run to watch the race.');
    }

    qs(root, '[data-run]').addEventListener('click', run);
    qs(root, '[data-reset]').addEventListener('click', reset);
    reset();
  }

  /* ---------- TransactionTimeline (check/update gap) ---------- */
  function TransactionTimeline(root) {
    const gap = qs(root, '[data-gap]');
    const row = qs(root, '[data-row-state]');

    function flashGap() {
      gap.classList.add('is-active');
      row.textContent = 'status: FREE  ← both requests still believe this';
      setStatus(root, 'The dangerous gap is between CHECK and UPDATE.');
      if (!prefersReduced) {
        setTimeout(() => gap.classList.remove('is-active'), 1200);
      }
    }

    qs(root, '[data-highlight-gap]').addEventListener('click', flashGap);
    setStatus(root, 'Availability check and mutation are separate ops unless one transaction protects both.');
  }

  /* ---------- RowLockVisualizer (pessimistic + row vs table) ---------- */
  function RowLockVisualizer(root) {
    const mode = root.getAttribute('data-mode') || 'pessimistic';
    const seats = qsa(root, '[data-seat]');
    const log = qs(root, '[data-log]');
    let lockedBy = null;
    let waiting = false;
    let running = false;

    function writeLog(lines) {
      if (!log) return;
      log.innerHTML = lines.map((l) => `<div class="viz-log__row">${l}</div>`).join('');
    }

    function paint() {
      seats.forEach((btn) => {
        const id = btn.getAttribute('data-seat');
        const isTarget = id === 'A10';
        let state = 'FREE';
        let label = id;
        if (isTarget && lockedBy) {
          state = 'LOCKED';
          label = `${id} · ${lockedBy}`;
        }
        if (isTarget && btn.dataset.booked === '1') {
          state = 'BOOKED';
          label = `${id} · BOOKED`;
        }
        btn.dataset.state = state;
        btn.textContent = label;
        btn.disabled = mode === 'row-demo' ? false : btn.dataset.booked === '1';
      });
    }

    async function runPessimistic() {
      if (running) return;
      running = true;
      lockedBy = null;
      waiting = false;
      seats.forEach((b) => {
        delete b.dataset.booked;
      });
      paint();
      writeLog([]);

      writeLog(['User A: BEGIN', 'User A: SELECT … FOR UPDATE WHERE seat = A10']);
      lockedBy = 'A';
      paint();
      setStatus(root, 'A10 is locked by transaction A. Other seats stay free.');
      await sleep(stepDelay);

      writeLog([
        'User A: BEGIN',
        'User A: SELECT … FOR UPDATE WHERE seat = A10 → LOCKED BY A',
        'User B: SELECT … FOR UPDATE WHERE seat = A10 → WAITING'
      ]);
      waiting = true;
      setStatus(root, 'User B waits — it does not read a stale FREE.');
      await sleep(stepDelay);

      writeLog([
        'User A: UPDATE A10 → BOOKED; COMMIT',
        'LOCK RELEASED',
        'User B resumes → sees BOOKED → aborts booking'
      ]);
      lockedBy = null;
      qs(root, '[data-seat="A10"]').dataset.booked = '1';
      paint();
      setStatus(root, 'B continues after the lock releases and discovers A10 is already BOOKED.');
      waiting = false;
      running = false;
    }

    function reset() {
      running = false;
      lockedBy = null;
      waiting = false;
      seats.forEach((b) => delete b.dataset.booked);
      paint();
      writeLog([]);
      setStatus(
        root,
        mode === 'row-demo'
          ? 'Click any seat. Locking A10 must not freeze A11 or B10.'
          : 'Ready to run SELECT … FOR UPDATE.'
      );
    }

    if (mode === 'row-demo') {
      seats.forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-seat');
          if (id === 'A10') {
            lockedBy = lockedBy === 'YOU' ? null : 'YOU';
            paint();
            setStatus(
              root,
              lockedBy
                ? 'A10 locked. Try A11 / B10 — they remain interactive.'
                : 'A10 unlocked.'
            );
          } else {
            setStatus(root, `${id} still works under row-level locking.`);
            btn.classList.add('is-pulse');
            setTimeout(() => btn.classList.remove('is-pulse'), 400);
          }
        });
      });
    } else {
      const runBtn = qs(root, '[data-run]');
      if (runBtn) runBtn.addEventListener('click', runPessimistic);
    }

    const resetBtn = qs(root, '[data-reset]');
    if (resetBtn) resetBtn.addEventListener('click', reset);
    reset();
  }

  /* ---------- OptimisticLockDemo ---------- */
  function OptimisticLockDemo(root) {
    const versionEl = qs(root, '[data-version]');
    const log = qs(root, '[data-log]');
    const toggle = qsa(root, '[data-lock-mode]');
    let mode = 'optimistic';
    let running = false;

    function setMode(next) {
      mode = next;
      toggle.forEach((btn) => {
        const on = btn.getAttribute('data-lock-mode') === mode;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      reset();
    }

    function write(lines) {
      log.innerHTML = lines.map((l) => `<div class="viz-log__row ${l.fail ? 'is-fail' : ''} ${l.ok ? 'is-ok' : ''}">${l.text}</div>`).join('');
    }

    async function runOptimistic() {
      versionEl.textContent = '5';
      write([
        { text: 'A reads version = 5, status = FREE' },
        { text: 'B reads version = 5, status = FREE' }
      ]);
      await sleep(stepDelay);
      write([
        { text: 'A reads version = 5, status = FREE' },
        { text: 'B reads version = 5, status = FREE' },
        { text: 'A: UPDATE … SET version = 6 WHERE version = 5 → 1 row', ok: true }
      ]);
      versionEl.textContent = '6';
      await sleep(stepDelay);
      write([
        { text: 'A committed version 6 / BOOKED', ok: true },
        { text: 'B: UPDATE … SET version = 6 WHERE version = 5 → 0 rows', fail: true },
        { text: 'Conflict detected — B must retry or abort', fail: true }
      ]);
      setStatus(root, 'Optimistic locking detects conflicts; it does not prevent concurrent reads.');
    }

    async function runPessimisticBrief() {
      versionEl.textContent = '5';
      write([{ text: 'A: SELECT … FOR UPDATE → lock held' }]);
      await sleep(stepDelay);
      write([
        { text: 'A: SELECT … FOR UPDATE → lock held' },
        { text: 'B: blocked until A commits' },
        { text: 'A commits BOOKED', ok: true },
        { text: 'B resumes and sees BOOKED', ok: true }
      ]);
      versionEl.textContent = '6';
      setStatus(root, 'Pessimistic locking prevents the conflicting write by waiting.');
    }

    async function run() {
      if (running) return;
      running = true;
      if (mode === 'optimistic') await runOptimistic();
      else await runPessimisticBrief();
      running = false;
    }

    function reset() {
      running = false;
      versionEl.textContent = '5';
      write([]);
      setStatus(
        root,
        mode === 'optimistic'
          ? 'Both users may read the same version; only one update wins.'
          : 'One transaction holds the row; the other waits.'
      );
    }

    toggle.forEach((btn) => btn.addEventListener('click', () => setMode(btn.getAttribute('data-lock-mode'))));
    qs(root, '[data-run]').addEventListener('click', run);
    qs(root, '[data-reset]').addEventListener('click', reset);
    setMode('optimistic');
  }

  /* ---------- HoldTimer + payment anti-pattern ---------- */
  function PaymentLockCompare(root) {
    const bad = qs(root, '[data-bad-lock]');
    const good = qs(root, '[data-good-lock]');

    qs(root, '[data-show-bad]').addEventListener('click', () => {
      bad.classList.add('is-active');
      good.classList.remove('is-active');
      setStatus(root, 'Bad: row stays locked while waiting for payment. Throughput dies.');
    });
    qs(root, '[data-show-good]').addEventListener('click', () => {
      good.classList.add('is-active');
      bad.classList.remove('is-active');
      setStatus(root, 'Good: short transaction writes a hold + expiry, then payment happens outside.');
    });
    setStatus(root, 'Compare holding a DB lock during payment vs a short hold transaction.');
  }

  function HoldTimer(root) {
    const timerEl = qs(root, '[data-timer]');
    const seat = qs(root, '[data-hold-seat]');
    let remaining = 8;
    let handle = null;

    function paint() {
      const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
      const ss = String(remaining % 60).padStart(2, '0');
      timerEl.textContent = `${mm}:${ss}`;
      if (remaining <= 0) {
        seat.dataset.state = 'FREE';
        seat.textContent = 'A10 · FREE';
        qs(root, '[data-hold-meta]').textContent = 'hold expired · seat returned to FREE';
        setStatus(root, 'Hold expired. A10 is FREE again — no long-lived DB lock was required.');
      } else {
        seat.dataset.state = 'HELD';
        seat.textContent = 'A10 · HELD';
        qs(root, '[data-hold-meta]').textContent = `hold_id: H123 · expires in ${remaining}s`;
      }
    }

    function stop() {
      if (handle) {
        clearInterval(handle);
        handle = null;
      }
    }

    function start() {
      stop();
      remaining = 8;
      paint();
      setStatus(root, 'Seat held with an expiry. Payment can proceed without pinning a row lock.');
      handle = setInterval(() => {
        remaining -= 1;
        paint();
        if (remaining <= 0) stop();
      }, prefersReduced ? 200 : 1000);
    }

    qs(root, '[data-start-hold]').addEventListener('click', start);
    qs(root, '[data-reset]').addEventListener('click', () => {
      stop();
      remaining = 8;
      paint();
      setStatus(root, 'Press Start hold to watch expiry.');
    });
    paint();
  }

  /* ---------- ApiFlow ---------- */
  function ApiFlow(root) {
    const steps = qsa(root, '[data-api-step]');
    let i = 0;

    function show(index) {
      i = index;
      steps.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
      const labels = [
        'POST /seat-holds creates a temporary reservation.',
        'Payment runs outside the database transaction.',
        'POST /bookings confirms the hold atomically.'
      ];
      setStatus(root, labels[i]);
    }

    qs(root, '[data-next]').addEventListener('click', () => show((i + 1) % steps.length));
    qs(root, '[data-prev]').addEventListener('click', () => show((i - 1 + steps.length) % steps.length));
    show(0);
  }

  /* ---------- IdempotencyDemo ---------- */
  function IdempotencyDemo(root) {
    const log = qs(root, '[data-log]');
    const bookings = qs(root, '[data-booking-count]');
    let running = false;
    let bookingCount = 0;

    function write(lines) {
      log.innerHTML = lines
        .map((l) => `<div class="viz-log__row ${l.fail ? 'is-fail' : ''} ${l.ok ? 'is-ok' : ''}"><span class="viz-log__who">${l.who}</span><span>${l.text}</span></div>`)
        .join('');
    }

    async function run() {
      if (running) return;
      running = true;
      bookingCount = 0;
      bookings.textContent = '0';
      write([
        { who: 'client', text: 'POST /bookings  Idempotency-Key: abc123' }
      ]);
      await sleep(stepDelay);
      bookingCount = 1;
      bookings.textContent = '1';
      write([
        { who: 'client', text: 'POST /bookings  Idempotency-Key: abc123' },
        { who: 'server', text: 'booking created · store response under abc123', ok: true },
        { who: 'network', text: 'response lost — client sees timeout', fail: true }
      ]);
      setStatus(root, 'Server already created the booking. Client does not know.');
      await sleep(stepDelay);
      write([
        { who: 'client', text: 'RETRY POST /bookings  Idempotency-Key: abc123' },
        { who: 'server', text: 'key abc123 found → return original booking', ok: true },
        { who: 'server', text: 'bookings table still has exactly 1 row', ok: true }
      ]);
      bookings.textContent = '1';
      setStatus(root, 'Idempotency prevents duplicate requests. Row locking prevents concurrent seat races.');
      running = false;
    }

    function reset() {
      running = false;
      bookingCount = 0;
      bookings.textContent = '0';
      write([]);
      setStatus(root, 'Simulate a timeout after the server already processed the booking.');
    }

    qs(root, '[data-run]').addEventListener('click', run);
    qs(root, '[data-reset]').addEventListener('click', reset);
    reset();
  }

  /* ---------- SystemArchitecture ---------- */
  function SystemArchitecture(root) {
    const nodes = qsa(root, '[data-arch-node]');
    const detail = qs(root, '[data-arch-detail]');
    const copy = {
      client: 'Selects seats, retries safely with Idempotency-Key, never assumes success on timeout.',
      api: 'Validates input, starts hold/booking workflows, returns stable responses.',
      idempotency: 'Deduplicates identical client retries. Does not replace seat locks.',
      seat: 'Short transactions: lock row → verify → write hold or booking → commit.',
      db: 'Source of truth for seat status, holds, bookings, payments, idempotency keys.',
      payment: 'Runs outside seat-row locks. Success is an input to booking confirmation.'
    };

    function select(id) {
      nodes.forEach((n) => n.classList.toggle('is-active', n.getAttribute('data-arch-node') === id));
      detail.textContent = copy[id] || '';
      setStatus(root, copy[id] || '');
    }

    nodes.forEach((n) => n.addEventListener('click', () => select(n.getAttribute('data-arch-node'))));
    nodes.forEach((n) => {
      n.setAttribute('tabindex', '0');
      n.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(n.getAttribute('data-arch-node'));
        }
      });
    });
    select('seat');
  }

  function boot() {
    document.querySelectorAll('[data-viz]').forEach((root) => {
      const type = root.getAttribute('data-viz');
      try {
        if (type === 'seat-grid') SeatGrid(root);
        if (type === 'concurrent') ConcurrentRequests(root);
        if (type === 'timeline') TransactionTimeline(root);
        if (type === 'row-lock') RowLockVisualizer(root);
        if (type === 'optimistic') OptimisticLockDemo(root);
        if (type === 'payment-compare') PaymentLockCompare(root);
        if (type === 'hold-timer') HoldTimer(root);
        if (type === 'api-flow') ApiFlow(root);
        if (type === 'idempotency') IdempotencyDemo(root);
        if (type === 'architecture') SystemArchitecture(root);
      } catch (err) {
        console.error('viz init failed', type, err);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
