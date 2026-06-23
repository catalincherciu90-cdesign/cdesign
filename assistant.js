/* ════════════════════════════════════════════════════════════
   C DESIGN — ASISTENT VIRTUAL (chat pe site)
   Bulă plutitoare + panou de chat. Vorbește cu vizitatorii despre
   servicii și îi îndrumă spre o ofertă (programare / telefon / email).
   Backend: POST /api/assistant (Cloudflare Workers AI).
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.__cdAssistant) return; window.__cdAssistant = true;

  var PHONE = '0753 116 155', TEL = '+40753116155', EMAIL = 'office@c-design.ro';
  var history = [];      // {role, content}
  var busy = false, opened = false, greeted = false;

  /* ── stil ─────────────────────────────────────────────── */
  var css = ''
    + '#cda-btn{position:fixed;right:18px;bottom:78px;z-index:9000;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;'
    + 'background:linear-gradient(135deg,var(--teal,#00a8a8),var(--teal-dk,#067e7e));color:#fff;font-size:1.6rem;'
    + 'box-shadow:0 10px 30px rgba(0,0,0,.35),0 0 0 4px rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;'
    + 'transition:transform .2s,box-shadow .2s;}'
    + '#cda-btn:hover{transform:translateY(-2px) scale(1.05);}'
    + '#cda-btn .cda-badge{position:absolute;top:-3px;right:-3px;width:16px;height:16px;border-radius:50%;background:#e8112d;border:2px solid #fff;}'
    + '#cda-panel{position:fixed;right:18px;bottom:150px;z-index:9001;width:min(380px,calc(100vw - 36px));height:min(560px,70vh);'
    + 'display:none;flex-direction:column;border-radius:18px;overflow:hidden;background:#0e1f1c;color:#f2f4f4;'
    + 'border:1px solid rgba(255,255,255,.12);box-shadow:0 24px 70px rgba(0,0,0,.55);}'
    + '#cda-panel.cda-on{display:flex;animation:cda-in .25s ease;}'
    + '@keyframes cda-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}'
    + '.cda-head{background:linear-gradient(135deg,var(--teal,#00a8a8),var(--teal-dk,#067e7e));padding:14px 16px;display:flex;align-items:center;gap:11px;}'
    + '.cda-head .cda-av{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:1.2rem;}'
    + '.cda-head .cda-ti{font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:.98rem;color:#fff;line-height:1.1;}'
    + '.cda-head .cda-st{font-size:.72rem;color:rgba(255,255,255,.85);display:flex;align-items:center;gap:5px;}'
    + '.cda-head .cda-st i{width:7px;height:7px;border-radius:50%;background:#5dffb0;display:inline-block;}'
    + '.cda-head .cda-x{margin-left:auto;background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;opacity:.85;line-height:1;padding:4px;}'
    + '.cda-head .cda-x:hover{opacity:1;}'
    + '.cda-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;font-size:.9rem;line-height:1.5;}'
    + '.cda-msg{max-width:85%;padding:10px 13px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word;}'
    + '.cda-bot{align-self:flex-start;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);border-bottom-left-radius:4px;}'
    + '.cda-user{align-self:flex-end;background:linear-gradient(135deg,var(--teal,#00a8a8),var(--teal-dk,#067e7e));color:#fff;border-bottom-right-radius:4px;}'
    + '.cda-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;}'
    + '.cda-typing i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.5);animation:cda-bl 1.2s infinite;}'
    + '.cda-typing i:nth-child(2){animation-delay:.2s}.cda-typing i:nth-child(3){animation-delay:.4s}'
    + '@keyframes cda-bl{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}'
    + '.cda-chips{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 8px;}'
    + '.cda-chip{background:rgba(0,168,168,.12);border:1px solid rgba(0,168,168,.4);color:#9fe9ff;border-radius:20px;padding:7px 12px;font-size:.78rem;cursor:pointer;transition:background .15s;}'
    + '.cda-chip:hover{background:rgba(0,168,168,.25);}'
    + '.cda-cta{display:flex;gap:8px;padding:0 16px 10px;}'
    + '.cda-cta a{flex:1;text-align:center;text-decoration:none;font-family:"Space Grotesk",sans-serif;font-weight:600;font-size:.8rem;padding:9px 8px;border-radius:9px;}'
    + '.cda-cta .cda-p{background:linear-gradient(135deg,var(--gold,#c9a96e),var(--gold-dk,#a8843d));color:#10201d;}'
    + '.cda-cta .cda-s{background:rgba(255,255,255,.08);color:#f2f4f4;border:1px solid rgba(255,255,255,.16);}'
    + '.cda-in{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(255,255,255,.1);background:#0b1815;}'
    + '.cda-in input{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:10px;color:#f2f4f4;padding:11px 13px;font-size:.9rem;outline:none;font-family:inherit;}'
    + '.cda-in input:focus{border-color:var(--teal,#00a8a8);}'
    + '.cda-in button{background:linear-gradient(135deg,var(--teal,#00a8a8),var(--teal-dk,#067e7e));border:none;color:#fff;border-radius:10px;width:44px;font-size:1.1rem;cursor:pointer;}'
    + '.cda-in button:disabled{opacity:.5;cursor:default;}'
    + '@media(max-width:640px){#cda-btn{bottom:70px;}#cda-panel{right:8px;left:8px;width:auto;bottom:8px;height:80vh;}}';

  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── DOM ──────────────────────────────────────────────── */
  var btn = document.createElement('button');
  btn.id = 'cda-btn'; btn.setAttribute('aria-label', 'Asistent virtual C Design');
  btn.innerHTML = '💬<span class="cda-badge"></span>';
  document.body.appendChild(btn);

  var panel = document.createElement('div');
  panel.id = 'cda-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Chat asistent C Design');
  panel.innerHTML = ''
    + '<div class="cda-head"><div class="cda-av">🤖</div>'
    + '<div><div class="cda-ti">Asistent C Design</div><div class="cda-st"><i></i> online · răspunde acum</div></div>'
    + '<button class="cda-x" aria-label="Închide">×</button></div>'
    + '<div class="cda-log" id="cda-log"></div>'
    + '<div class="cda-chips" id="cda-chips"></div>'
    + '<div class="cda-cta"><a class="cda-p" href="/programare">📅 Programează</a><a class="cda-s" href="tel:' + TEL + '">📞 Sună</a></div>'
    + '<div class="cda-in"><input id="cda-input" type="text" placeholder="Scrie un mesaj..." maxlength="600" autocomplete="off"><button id="cda-send" aria-label="Trimite">➤</button></div>';
  document.body.appendChild(panel);

  var log = panel.querySelector('#cda-log');
  var chips = panel.querySelector('#cda-chips');
  var input = panel.querySelector('#cda-input');
  var sendBtn = panel.querySelector('#cda-send');

  var SUGGESTIONS = ['Cât costă un site?', 'În cât timp e gata?', 'Ce include Pachetul Startup?', 'Vreau o ofertă'];

  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function scroll() { log.scrollTop = log.scrollHeight; }

  function addMsg(role, text) {
    var d = document.createElement('div');
    d.className = 'cda-msg ' + (role === 'user' ? 'cda-user' : 'cda-bot');
    d.innerHTML = esc(text);
    log.appendChild(d); scroll();
  }
  function typing(on) {
    var ex = log.querySelector('.cda-typing');
    if (on && !ex) { var t = document.createElement('div'); t.className = 'cda-typing'; t.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(t); scroll(); }
    else if (!on && ex) ex.remove();
  }
  function renderChips() {
    chips.innerHTML = '';
    if (history.length > 2) return; // ascunde sugestiile dupa ce conversatia incepe
    SUGGESTIONS.forEach(function (s) {
      var c = document.createElement('button'); c.className = 'cda-chip'; c.textContent = s;
      c.addEventListener('click', function () { send(s); });
      chips.appendChild(c);
    });
  }

  function greet() {
    if (greeted) return; greeted = true;
    var hi = 'Salut! 👋 Sunt asistentul C Design. Te pot ajuta cu informații despre site-uri, prețuri orientative și o ofertă gratuită. Cu ce începem?';
    addMsg('bot', hi); history.push({ role: 'assistant', content: hi }); renderChips();
  }

  async function send(text) {
    text = (text || input.value || '').trim();
    if (!text || busy) return;
    input.value = '';
    addMsg('user', text); history.push({ role: 'user', content: text });
    renderChips();
    busy = true; sendBtn.disabled = true; typing(true);
    try {
      var r = await fetch('/api/assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-10) })
      });
      var d = await r.json();
      typing(false);
      var reply = (d && d.reply) || 'Hai să discutăm direct: programează o consultație gratuită sau sună la ' + PHONE + '.';
      addMsg('bot', reply); history.push({ role: 'assistant', content: reply });
    } catch (e) {
      typing(false);
      addMsg('bot', 'Am o problemă de conexiune. Sună-ne la ' + PHONE + ' sau scrie la ' + EMAIL + ' și îți răspundem rapid.');
    }
    busy = false; sendBtn.disabled = false; input.focus();
  }

  function open() {
    panel.classList.add('cda-on'); opened = true;
    btn.querySelector('.cda-badge').style.display = 'none';
    greet(); setTimeout(function () { input.focus(); }, 200);
  }
  function close() { panel.classList.remove('cda-on'); }

  btn.addEventListener('click', function () { panel.classList.contains('cda-on') ? close() : open(); });
  panel.querySelector('.cda-x').addEventListener('click', close);
  sendBtn.addEventListener('click', function () { send(); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
})();
