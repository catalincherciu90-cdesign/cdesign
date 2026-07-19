function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function sanitizeHtml(html) {
  if (!html) return '';
  // Allow basic formatting tags only
  const allowed = /<\/?(b|i|em|strong|p|br|ul|ol|li|h2|h3|h4|blockquote|a)[^>]*>/gi;
  return String(html)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+\s*=/gi, 'data-blocked=')
    .replace(/javascript:/gi, '');
}

function renderArticle(post) {
  const date = new Date(post.createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
  const plain = post.content.replace(/<[^>]*>/g, '');
  const desc = escHtml(post.excerpt || (plain.slice(0, 155) + (plain.length > 155 ? '…' : '')));
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || plain.slice(0, 155),
    image: post.coverImage || 'https://www.c-design.ro/logo-c-design.png',
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: { '@type': 'Organization', name: 'C Design', url: 'https://www.c-design.ro' },
    publisher: { '@type': 'Organization', name: 'C Design', url: 'https://www.c-design.ro' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.c-design.ro/blog/${post.slug}` },
  });
  const yr = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(post.title)} – C Design</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://www.c-design.ro/blog/${post.slug}">
<link rel="icon" type="image/png" href="/logo-c-design.png">
<meta property="og:type" content="article">
<meta property="og:url" content="https://www.c-design.ro/blog/${post.slug}">
<meta property="og:title" content="${escHtml(post.title)}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://www.c-design.ro/cover.jpg">
<meta property="og:locale" content="ro_RO">
<meta property="og:site_name" content="C Design">
<meta property="article:published_time" content="${post.createdAt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escHtml(post.title)}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="https://www.c-design.ro/cover.jpg">
<script type="application/ld+json">${schema}<\/script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--teal:#00c8b4;--teal-dk:#00a898;--teal-lt:#33d4c3;--teal-dim:rgba(0,200,180,.08);--teal-border:rgba(0,200,180,.28);--bg:#080b0e;--bg2:#0d1117;--bg3:#111820;--text:#e8edf2;--soft:#9aa5b4;--muted:#6a7585;--border:rgba(255,255,255,.07);--border-soft:rgba(255,255,255,.11)}
html{scroll-behavior:smooth}body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.7;overflow-x:hidden}
a{color:inherit;text-decoration:none}
.container{max-width:760px;margin:0 auto;padding:0 24px}
.wide{max-width:1180px;margin:0 auto;padding:0 24px}
nav{position:sticky;top:0;z-index:100;background:rgba(8,11,14,.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:68px}
.logo{font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:1.35rem;color:#fff;display:flex;align-items:center;gap:6px}
.logo-c{color:var(--teal);font-size:1.6rem;line-height:1;text-shadow:0 0 12px rgba(0,200,180,.6);animation:logo-pulse 3s ease-in-out infinite}
@keyframes logo-pulse{0%,100%{text-shadow:0 0 12px rgba(0,200,180,.6)}50%{text-shadow:0 0 24px rgba(0,200,180,1),0 0 48px rgba(0,200,180,.4)}}
.nav-links{display:flex;align-items:center;gap:28px;list-style:none}
.nav-links a{font-size:.875rem;color:var(--muted);transition:color .2s}.nav-links a:hover{color:var(--teal)}
.nav-phone{font-family:'Share Tech Mono',monospace;font-size:.875rem;color:var(--teal);border:1px solid var(--teal-border);padding:6px 14px;border-radius:6px;transition:background .2s}
.nav-phone:hover{background:var(--teal-dim)}
.btn-nav{background:var(--teal);color:#080b0e;font-weight:600;font-size:.875rem;padding:9px 20px;border-radius:8px;transition:background .2s,transform .15s}
.btn-nav:hover{background:var(--teal-lt);transform:translateY(-1px)}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:6px}
.hamburger span{display:block;width:22px;height:2px;background:var(--text);border-radius:2px}
.mobile-menu{display:none;flex-direction:column;gap:16px;background:var(--bg2);border-bottom:1px solid var(--border);padding:20px 24px}
.mobile-menu.open{display:flex}.mobile-menu a{font-size:1rem;color:var(--soft)}.mobile-menu a:hover{color:var(--teal)}
article{padding:72px 0 100px}
.art-back{display:inline-flex;align-items:center;gap:6px;color:var(--muted);font-size:.85rem;margin-bottom:40px;transition:color .2s}.art-back:hover{color:var(--teal)}
.art-tag{display:inline-block;background:var(--teal-dim);color:var(--teal);border:1px solid var(--teal-border);padding:4px 12px;border-radius:20px;font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;margin-bottom:18px}
.art-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(1.8rem,5vw,2.8rem);font-weight:800;line-height:1.2;margin-bottom:20px;color:#fff}
.art-meta{color:var(--muted);font-size:.85rem;padding-bottom:28px;border-bottom:1px solid var(--border);margin-bottom:40px}
.art-content{color:#c8d4e0;font-size:1.05rem;line-height:1.85}
.art-content p{margin-bottom:1.4em}
.art-content h2{font-family:'Space Grotesk',sans-serif;font-size:1.45rem;font-weight:700;color:#fff;margin:2em 0 .8em}
.art-content h3{font-family:'Space Grotesk',sans-serif;font-size:1.15rem;font-weight:700;color:#fff;margin:1.6em 0 .6em}
.art-content ul,.art-content ol{padding-left:1.5em;margin-bottom:1.4em}
.art-content li{margin-bottom:.5em}
.art-content strong{color:#fff;font-weight:600}
.art-content a{color:var(--teal);text-decoration:underline;text-decoration-color:rgba(0,200,180,.3)}
.art-content a:hover{text-decoration-color:var(--teal)}
.art-content blockquote{border-left:3px solid var(--teal);padding:12px 20px;background:rgba(0,200,180,.06);border-radius:0 8px 8px 0;margin:1.5em 0;color:var(--soft);font-style:italic}
.art-content pre{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:20px;overflow-x:auto;margin:1.5em 0}
.art-content code{background:rgba(0,200,180,.1);color:var(--teal);padding:2px 6px;border-radius:4px;font-size:.9em}
.art-content pre code{background:none;color:var(--soft);padding:0}
.cta-box{margin-top:64px;padding:32px;background:linear-gradient(135deg,rgba(0,200,180,.08),rgba(0,200,180,.04));border:1px solid rgba(0,200,180,.2);border-radius:14px;text-align:center}
.cta-box h3{font-family:'Space Grotesk',sans-serif;font-size:1.3rem;margin-bottom:10px;color:#fff}
.cta-box p{color:var(--soft);margin-bottom:20px;font-size:.95rem}
.btn{display:inline-block;background:var(--teal);color:#000;padding:12px 28px;border-radius:8px;font-weight:700;font-size:.9rem;transition:transform .15s,box-shadow .15s}
.btn:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,200,180,.35)}
footer{border-top:1px solid var(--border);padding:32px 0;text-align:center;color:var(--muted);font-size:.83rem}
footer a{color:var(--muted);transition:color .2s}footer a:hover{color:var(--teal)}
@media(max-width:640px){article{padding:40px 0 60px}.art-title{font-size:1.7rem}nav .nav-links,.nav-phone,.btn-nav{display:none}.hamburger{display:flex}}
</style>
<link rel="stylesheet" href="/theme.css">
<link rel="stylesheet" href="/effects.css">
<script src="/effects.js" defer><\/script>
<script>
// Analytics stubs (queued until consent is granted)
window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};
gtag('js',new Date());gtag('config','G-K3VR7JC1QW');
!function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window);
fbq('init','893560673744618');fbq('track','PageView');
// Gate tracking load on consent
(function(){
  var d=false;
  function L(){
    if(d)return;d=true;
    var a=document.createElement('script');a.src='https://www.googletagmanager.com/gtag/js?id=G-K3VR7JC1QW';a.async=true;document.head.appendChild(a);
    var b=document.createElement('script');b.src='https://connect.facebook.net/en_US/fbevents.js';b.async=true;document.head.appendChild(b);
  }
  function checkConsent(){
    var c=localStorage.getItem('cdCookieConsent');
    if(c==='granted'){L();} else if(c==='denied'){return;}
    /* nedecis: nu se incarca tracking pana la accept din banner */
  }
  window.addEventListener('cookie-consent-granted',L);
  checkConsent();
})();
<\/script>
<script src="/cookie-consent.js" defer><\/script>
</head>
<body data-fx>
<nav>
  <div class="wide">
    <div class="nav-inner">
      <a href="/" class="logo"><img src="/logo-c-design.png" alt="C Design" style="height:42px;width:auto;display:block;"></a>
      <ul class="nav-links" role="list">
        <li><a href="/servicii">Servicii</a></li>
        <li><a href="/despre-noi">Despre noi</a></li>
        <li><a href="/#portofoliu">Portofoliu</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/blog">Blog</a></li>
      </ul>
      <a href="tel:+40753116155" class="nav-phone">0753 116 155</a>
      <a href="/programare" class="btn-nav">Programează acum →</a>
      <button class="hamburger" id="hamburger" aria-label="Deschide meniu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="/servicii">Servicii</a><a href="/despre-noi">Despre noi</a><a href="/#portofoliu">Portofoliu</a><a href="/contact">Contact</a><a href="/blog">Blog</a>
  <a href="tel:+40753116155">0753 116 155</a><a href="/programare" class="btn-nav">Programează acum →</a>
</div>
<main>
<article>
<div class="container">
  <a href="/blog" class="art-back">← \xCEnnapoi la blog</a>
  <span class="art-tag">Blog</span>
  <h1 class="art-title">${escHtml(post.title)}</h1>
  <div class="art-meta">${date}</div>
  <div class="art-content">${sanitizeHtml(post.content)}</div>
  <div class="cta-box">
    <h3>Vrei un site profesional pentru afacerea ta?</h3>
    <p>Programează o şedinţă de consultanţă gratuită — fără obligaţii.</p>
    <a href="/programare" class="btn">Programează consultanţă gratuită →</a>
  </div>
</div>
</article>
</main>
<footer>
  <a href="/" aria-label="C Design – Pagina principală"><img src="/logo-c-design.png" alt="C Design" style="height:32px;width:auto;display:block;margin:0 auto 12px;"></a>
  <p>© ${yr} C Design · <a href="tel:+40753116155">0753 116 155</a> · <a href="mailto:office@c-design.ro">office@c-design.ro</a> · <a href="/blog">Blog</a> · <a href="#" onclick="window.openCookieConsentBanner();return false;" style="cursor:pointer;">Setări cookies</a></p>
</footer>
<script>
const ham=document.getElementById('hamburger'),mob=document.getElementById('mobileMenu');
ham.addEventListener('click',()=>{const o=mob.classList.toggle('open');ham.setAttribute('aria-expanded',o)});
<\/script>
</body>
</html>`;
}

async function sendDeadlineNotification(entry, env) {
  const termen = entry.termen || 'N/A';
  const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
      <tr><td style="background:#080b0e;padding:28px 32px;text-align:center;">
        <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.4rem;font-weight:800;color:#fff;">
          <span style="color:#00c8b4;">C</span> Design
        </div>
        <div style="color:#9aa5b4;font-size:.85rem;margin-top:4px;">Reminder deadline CRM</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <div style="background:#fff8e1;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
          <div style="font-size:.8rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">⏰ Deadline în 3 zile</div>
          <div style="font-size:1.1rem;font-weight:700;color:#080b0e;">${escHtml(entry.client || 'N/A')}</div>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding:8px 0;color:#6a7585;font-size:.85rem;width:120px;">Proiect</td>
            <td style="padding:8px 0;font-weight:600;color:#080b0e;">${escHtml(entry.proiect || 'N/A')}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6a7585;font-size:.85rem;">Deadline</td>
            <td style="padding:8px 0;font-weight:600;color:#f59e0b;">${escHtml(termen)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6a7585;font-size:.85rem;">Valoare</td>
            <td style="padding:8px 0;font-weight:600;color:#080b0e;">${escHtml(String(entry.valoare || 'N/A'))}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6a7585;font-size:.85rem;">Status</td>
            <td style="padding:8px 0;font-weight:600;color:#080b0e;">${escHtml(entry.status || 'N/A')}</td>
          </tr>
          ${entry.note ? `<tr><td style="padding:8px 0;color:#6a7585;font-size:.85rem;vertical-align:top;">Note</td><td style="padding:8px 0;color:#080b0e;">${escHtml(entry.note)}</td></tr>` : ''}
        </table>
        <div style="text-align:center;">
          <a href="https://www.c-design.ro/programari.html" style="display:inline-block;background:#00c8b4;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;font-size:.95rem;text-decoration:none;">
            Deschide CRM →
          </a>
        </div>
      </td></tr>
      <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="color:#9aa5b4;font-size:.8rem;margin:0;">C Design · <a href="https://www.c-design.ro" style="color:#00c8b4;text-decoration:none;">www.c-design.ro</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY || RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'C Design <office@c-design.ro>',
      to: [env.NOTIFY_EMAIL || NOTIFY_EMAIL],
      subject: `⏰ Deadline în 3 zile: ${entry.client || 'Client'} – ${entry.proiect || 'Proiect'}`,
      html,
    }),
  });
}

async function sendGibilanMorningEmail(env) {
  try {
    const raw = await env.PROGRAMARI.get('__gibilan__');
    const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const in3Days = new Date(today);
    in3Days.setDate(today.getDate() + 3);
    const in3Str = in3Days.toISOString().split('T')[0];

    const meetingsAzi = (data.meetings || []).filter(m => m.date === todayStr);
    const deadlinesUrgente = (data.deadlines || []).filter(d => d.date >= todayStr && d.date <= in3Str);
    const todosActive = (data.todos || []).filter(t => !t.done);

    const ziuaRo = today.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const ziuaCapital = ziuaRo.charAt(0).toUpperCase() + ziuaRo.slice(1);

    const nimicDeRaportat = !meetingsAzi.length && !deadlinesUrgente.length && !todosActive.length;

    let meetingsHtml = '';
    if (meetingsAzi.length) {
      meetingsHtml = meetingsAzi.map(m => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">
            <span style="font-family:'Segoe UI',monospace;font-size:.85rem;color:#00a898;font-weight:700;margin-right:8px;">${m.time || '--:--'}</span>
            <span style="color:#1a1a1a;font-weight:600;">${escHtml(m.title)}</span>
            ${m.notes ? `<div style="font-size:.78rem;color:#888;margin-top:3px;">${escHtml(m.notes)}</div>` : ''}
          </td>
        </tr>`).join('');
    } else {
      meetingsHtml = '<tr><td style="padding:8px 12px;color:#aaa;font-style:italic;font-size:.88rem;">Nicio întâlnire azi — zi liberă!</td></tr>';
    }

    let deadlinesHtml = '';
    if (deadlinesUrgente.length) {
      deadlinesHtml = deadlinesUrgente.map(d => {
        const isAzi = d.date === todayStr;
        return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;${isAzi ? 'border-left:3px solid #ff5f57;' : ''}">
            <span style="font-size:.78rem;color:${isAzi ? '#ff5f57' : '#f59e0b'};font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-right:8px;">${isAzi ? 'AZI' : d.date}</span>
            <span style="color:#1a1a1a;font-weight:600;">${escHtml(d.title)}</span>
            ${d.project ? `<span style="font-size:.8rem;color:#888;margin-left:6px;">· ${escHtml(d.project)}</span>` : ''}
          </td>
        </tr>`;
      }).join('');
    } else {
      deadlinesHtml = '<tr><td style="padding:8px 12px;color:#aaa;font-style:italic;font-size:.88rem;">Niciun deadline urgent — respira adânc!</td></tr>';
    }

    let todosHtml = '';
    if (todosActive.length) {
      todosHtml = todosActive.map(t => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;${t.priority === 'high' ? 'border-left:3px solid #febc2e;background:#fffbf0;' : ''}">
            <span style="display:inline-block;width:14px;height:14px;border:2px solid #ccc;border-radius:3px;margin-right:8px;vertical-align:middle;"></span>
            <span style="color:#1a1a1a;">${escHtml(t.title)}</span>
            ${t.priority === 'high' ? '<span style="font-size:.7rem;color:#f59e0b;font-weight:700;margin-left:6px;text-transform:uppercase;">URGENT</span>' : ''}
          </td>
        </tr>`).join('');
    } else {
      todosHtml = '<tr><td style="padding:8px 12px;color:#aaa;font-style:italic;font-size:.88rem;">Totul bifat! Esti un campion.</td></tr>';
    }

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">
      <!-- HEADER -->
      <tr><td style="background:#060f0f;padding:28px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle;">
              <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.3rem;font-weight:800;color:#fff;">
                <span style="color:#00c8b4;">C</span> Design
              </div>
              <div style="color:#6a9494;font-size:.78rem;margin-top:2px;font-family:monospace;">// gibilan.morning_brief</div>
            </td>
            <td style="text-align:right;vertical-align:middle;">
              <div style="font-size:2rem;">🤖</div>
            </td>
          </tr>
        </table>
      </td></tr>
      <!-- GREETING -->
      <tr><td style="padding:28px 32px 0;border-bottom:1px solid #f0f0f0;">
        <div style="font-size:1.15rem;font-weight:700;color:#060f0f;margin-bottom:6px;">
          Bună dimineata! ☀️
        </div>
        <div style="font-size:.92rem;color:#555;margin-bottom:20px;line-height:1.6;">
          ${nimicDeRaportat
            ? 'Zi liberă, nicio urgență! Profită de liniște, că nu durează. 😄'
            : `Iată agenda ta pentru <strong>${ziuaCapital}</strong>. Hai să facem o zi productivă!`}
        </div>
        ${!nimicDeRaportat ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;background:#f0fffe;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:6px 12px;background:#00c8b4;color:#060f0f;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;width:32px;">📊</td>
            <td style="padding:6px 12px;background:#e8faf9;font-size:.82rem;color:#1a4a44;">
              <strong>${meetingsAzi.length}</strong> întâlniri azi &nbsp;·&nbsp;
              <strong>${deadlinesUrgente.length}</strong> deadline-uri urgente &nbsp;·&nbsp;
              <strong>${todosActive.length}</strong> task-uri active
            </td>
          </tr>
        </table>` : ''}
      </td></tr>
      <!-- MEETINGS -->
      <tr><td style="padding:24px 32px 0;">
        <div style="font-size:.78rem;font-weight:800;color:#00a898;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">📅 Întâlniri de azi</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:8px;overflow:hidden;border:1px solid #eee;">
          ${meetingsHtml}
        </table>
      </td></tr>
      <!-- DEADLINES -->
      <tr><td style="padding:20px 32px 0;">
        <div style="font-size:.78rem;font-weight:800;color:#f59e0b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">⚠️ Deadline-uri (azi + 3 zile)</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:8px;overflow:hidden;border:1px solid #eee;">
          ${deadlinesHtml}
        </table>
      </td></tr>
      <!-- TODOS -->
      <tr><td style="padding:20px 32px 24px;">
        <div style="font-size:.78rem;font-weight:800;color:#6a7585;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">✅ To-do active</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:8px;overflow:hidden;border:1px solid #eee;">
          ${todosHtml}
        </table>
      </td></tr>
      <!-- CTA -->
      <tr><td style="padding:0 32px 28px;text-align:center;">
        <a href="https://www.c-design.ro/programari.html" style="display:inline-block;background:#00c8b4;color:#060f0f;padding:12px 28px;border-radius:8px;font-weight:700;font-size:.9rem;text-decoration:none;">
          Deschide Gibilan →
        </a>
      </td></tr>
      <!-- FOOTER -->
      <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#9aa5b4;font-size:.75rem;margin:0;">Gibilan · C Design · <a href="https://www.c-design.ro" style="color:#00a898;text-decoration:none;">c-design.ro</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY || RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Gibilan <notificari@c-design.ro>',
        to: [env.NOTIFY_EMAIL || NOTIFY_EMAIL],
        subject: `🤖 Gibilan — Agenda ta pentru ${ziuaCapital}`,
        html,
      }),
    });
  } catch (e) {
    console.error('sendGibilanMorningEmail error:', e);
  }
}

async function checkCrmDeadlines(env) {
  const raw = await env.PROGRAMARI.get('__crm__');
  const entries = raw ? JSON.parse(raw) : [];
  const today = new Date();
  const target = new Date(today);
  target.setDate(today.getDate() + 3);
  const targetDate = target.toISOString().split('T')[0];
  const due = entries.filter(e =>
    e.termen === targetDate &&
    e.status !== 'finalizat' &&
    e.status !== 'anulat'
  );
  for (const e of due) {
    await sendDeadlineNotification(e, env);
  }
}

const ALLOWED_ORIGINS = ['https://www.c-design.ro', 'https://c-design.ro'];

function getCors(request) {
  const origin = request ? request.headers.get('Origin') : null;
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

const SEC_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.resend.com https://www.google-analytics.com;",
};

function json(data, status = 200, req) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...getCors(req), 'Content-Type': 'application/json' },
  });
}

// Scanează conținutul dinamic din KV (setări site, layout-uri, blog) și
// returnează { filename: [locații] } pentru fiecare imagine /media/ referențiată.
async function collectMediaUsage(env, pages) {
  const usage = {};
  const scan = (str, loc) => {
    if (!str || typeof str !== 'string') return;
    const re = /\/media\/([A-Za-z0-9._-]+)/g;
    let m;
    while ((m = re.exec(str))) {
      const list = usage[m[1]] || (usage[m[1]] = []);
      if (!list.includes(loc)) list.push(loc);
    }
  };
  try {
    const raw = await env.PROGRAMARI.get('__site_settings__');
    scan(raw, 'Setări site (hero / bannere)');
  } catch {}
  for (const page of pages) {
    try {
      const raw = await env.PROGRAMARI.get('__layout__' + page);
      scan(raw, 'Blocuri custom: ' + page);
    } catch {}
  }
  try {
    const raw = await env.PROGRAMARI.get('__blog__');
    if (raw) {
      const posts = JSON.parse(raw);
      for (const p of posts) scan(JSON.stringify(p), 'Blog: ' + (p.title || p.slug || p.id));
    }
  } catch {}
  return usage;
}

// ── CONȚINUT EDITABIL (rubrici marcate cu data-edit) ─────────
// Paginile publice ale căror texte pot fi editate din admin (tab Conținut).
const CONTENT_PAGES = {
  'index': '/index.html',
  'servicii': '/servicii.html',
  'despre-noi': '/despre-noi.html',
  'contact': '/contact.html',
  'parteneri': '/parteneri.html',
  'partener-hosting': '/partener-hosting.html',
  'partener-print': '/partener-print.html',
  'pachet-startup': '/pachet-startup.html',
  'abonament-lunar': '/abonament-lunar.html',
  'web-design-bucuresti': '/web-design-bucuresti.html',
  'web-design-cluj': '/web-design-cluj.html',
  'web-design-timisoara': '/web-design-timisoara.html',
  'web-design-auto': '/web-design-auto.html',
  'web-design-restaurante': '/web-design-restaurante.html',
  'web-design-afaceri-mici': '/web-design-afaceri-mici.html',
};

// Înlocuiește conținutul elementelor cu data-edit="cheie" cu textul salvat.
// Pentru ul/ol, fiecare linie devine un <li>.
function applyContentOverrides(html, overrides) {
  for (const key of Object.keys(overrides)) {
    const val = overrides[key];
    if (!val || typeof val !== 'string') continue;
    const esc = val.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
    const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(<([a-zA-Z0-9]+)\\b[^>]*\\bdata-edit="' + safeKey + '"[^>]*>)[\\s\\S]*?(</\\2>)');
    html = html.replace(re, (mm, open, tag, close) => {
      let content = esc;
      if (/^(ul|ol)$/i.test(tag)) {
        content = esc.split('<br>').map(s => s.trim()).filter(Boolean).map(s => '<li>' + s + '</li>').join('');
      }
      return open + content + close;
    });
  }
  return html;
}

// Extrage rubricile editabile dintr-o pagină: cheie + textul implicit.
function extractContentFields(html) {
  const fields = [];
  const re = /<([a-zA-Z0-9]+)\b[^>]*\bdata-edit="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(html))) {
    let inner = m[3];
    if (/^(ul|ol)$/i.test(m[1])) inner = inner.replace(/<\/li>/gi, '\n');
    const def = inner.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&nbsp;/g,' ')
      .split('\n').map(s => s.replace(/\s+/g,' ').trim()).filter(Boolean).join('\n').trim();
    fields.push({ key: m[2], default: def });
  }
  return fields;
}

// Servește o pagină statică aplicând textele editate din KV (dacă există).
async function serveContentPage(request, env, page) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = CONTENT_PAGES[page];
  const [resp, raw] = await Promise.all([
    env.ASSETS.fetch(new Request(assetUrl.toString(), request)),
    env.PROGRAMARI.get('__content__' + page).catch(() => null),
  ]);
  // paginile servite de aici primesc mereu headerele de securitate
  const withSec = (r) => {
    const h = new Headers(r.headers);
    Object.entries(SEC_HEADERS).forEach(([k, v]) => h.set(k, v));
    return new Response(r.body, { status: r.status, headers: h });
  };
  if (!raw) return withSec(resp);
  let overrides;
  try { overrides = JSON.parse(raw); } catch { return withSec(resp); }
  if (!overrides || !Object.keys(overrides).length) return withSec(resp);
  const html = applyContentOverrides(await resp.text(), overrides);
  return new Response(html, {
    headers: { ...SEC_HEADERS, 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' }
  });
}

async function checkRateLimit(env, key, maxAttempts, windowSeconds) {
  try {
    const raw = await env.PROGRAMARI.get('__rl_' + key);
    const now = Date.now();
    const data = raw ? JSON.parse(raw) : { count: 0, start: now };
    if (now - data.start > windowSeconds * 1000) { data.count = 0; data.start = now; }
    data.count++;
    await env.PROGRAMARI.put('__rl_' + key, JSON.stringify(data), { expirationTtl: windowSeconds });
    return data.count <= maxAttempts;
  } catch { return true; }
}

const ADMIN_TOKEN = '';  // set via: wrangler secret put ADMIN_TOKEN
const ADMIN_USER  = '';  // set via: wrangler secret put ADMIN_USER
const RESEND_API_KEY = '';  // set via: wrangler secret put RESEND_API_KEY
const NOTIFY_EMAIL  = 'office@c-design.ro';

async function sendBookingNotification(booking, env) {
  const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
      <tr><td style="background:#080b0e;padding:28px 32px;text-align:center;">
        <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.4rem;font-weight:800;color:#fff;">
          <span style="color:#00c8b4;">C</span> Design
        </div>
        <div style="color:#9aa5b4;font-size:.85rem;margin-top:4px;">Programare nouă</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <div style="background:#f0fffe;border-left:4px solid #00c8b4;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
          <div style="font-size:.8rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Programare nouă primită</div>
          <div style="font-size:1.1rem;font-weight:700;color:#080b0e;">${booking.name}</div>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Telefon</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${booking.phone}</div>
            </td>
            <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Email</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${booking.email}</div>
            </td>
          </tr>
          <tr>
            <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Data</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${booking.date}</div>
            </td>
            <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Ora</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${booking.time}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding:0 0 16px 0;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Serviciu</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${booking.service}</div>
            </td>
          </tr>
          ${booking.message ? `<tr><td colspan="2" style="padding:0 0 16px 0;">
            <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Mesaj</div>
            <div style="font-size:.95rem;color:#080b0e;line-height:1.5;">${booking.message}</div>
          </td></tr>` : ''}
        </table>
        <div style="text-align:center;margin-top:24px;">
          <a href="https://www.c-design.ro/programari.html" style="display:inline-block;background:#00c8b4;color:#080b0e;font-weight:700;font-size:.9rem;padding:12px 28px;border-radius:8px;text-decoration:none;">
            Vezi în admin panel →
          </a>
        </div>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
        <div style="font-size:.78rem;color:#9aa5b4;">c-design.ro · 0753 116 155 · office@c-design.ro</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY || RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'C Design <notificari@c-design.ro>',
        to: [env.NOTIFY_EMAIL || NOTIFY_EMAIL],
        subject: `📅 Programare nouă — ${booking.name} · ${booking.date} ${booking.time}`,
        html,
      }),
    });
  } catch {}

  // Confirmare catre client
  const confirmHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
      <tr><td style="background:#080b0e;padding:28px 32px;text-align:center;">
        <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.4rem;font-weight:800;color:#fff;">
          <span style="color:#00c8b4;">C</span> Design
        </div>
        <div style="color:#9aa5b4;font-size:.85rem;margin-top:4px;">Confirmare programare</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="font-size:1rem;color:#080b0e;margin:0 0 20px;">Bună <strong>${booking.name}</strong>,</p>
        <p style="font-size:.95rem;color:#444;line-height:1.6;margin:0 0 28px;">Programarea ta a fost primită cu succes. Te vom contacta în maxim <strong>2 ore</strong> pentru confirmare.</p>

        <div style="background:#f0fffe;border:1px solid #d0f5f2;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
          <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px;">Detalii programare</div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding:0 8px 12px 0;">
                <div style="font-size:.75rem;color:#6a7585;margin-bottom:3px;">Data</div>
                <div style="font-size:.95rem;color:#080b0e;font-weight:700;">${booking.date}</div>
              </td>
              <td width="50%" style="padding:0 0 12px 8px;">
                <div style="font-size:.75rem;color:#6a7585;margin-bottom:3px;">Ora</div>
                <div style="font-size:.95rem;color:#080b0e;font-weight:700;">${booking.time}</div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div style="font-size:.75rem;color:#6a7585;margin-bottom:3px;">Serviciu</div>
                <div style="font-size:.95rem;color:#080b0e;font-weight:700;">${booking.service}</div>
              </td>
            </tr>
          </table>
        </div>

        <p style="font-size:.9rem;color:#666;line-height:1.6;margin:0 0 24px;">Dacă ai întrebări sau vrei să modifici programarea, ne poți contacta oricând:</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding:0 8px 0 0;">
              <a href="tel:+40753116155" style="display:block;text-align:center;background:#080b0e;color:#00c8b4;font-weight:600;font-size:.9rem;padding:12px;border-radius:8px;text-decoration:none;">📞 0753 116 155</a>
            </td>
            <td style="padding:0 0 0 8px;">
              <a href="https://wa.me/40753116155" style="display:block;text-align:center;background:#25d366;color:#fff;font-weight:600;font-size:.9rem;padding:12px;border-radius:8px;text-decoration:none;">💬 WhatsApp</a>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
        <div style="font-size:.78rem;color:#9aa5b4;">© ${new Date().getFullYear()} C Design · <a href="https://www.c-design.ro" style="color:#00c8b4;text-decoration:none;">c-design.ro</a></div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY || RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'C Design <notificari@c-design.ro>',
        to: [booking.email],
        subject: `✅ Programare confirmată — ${booking.date} ora ${booking.time}`,
        html: confirmHtml,
      }),
    });
  } catch {}
}

async function sendContactNotification(contact, env) {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
      <tr><td style="background:#080b0e;padding:28px 32px;text-align:center;">
        <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.4rem;font-weight:800;color:#fff;"><span style="color:#00c8b4;">C</span> Design</div>
        <div style="color:#9aa5b4;font-size:.85rem;margin-top:4px;">Mesaj nou prin formularul de contact</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <div style="background:#f0fffe;border-left:4px solid #00c8b4;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
          <div style="font-size:.8rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">De la</div>
          <div style="font-size:1.1rem;font-weight:700;color:#080b0e;">${contact.name}</div>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Telefon</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${contact.phone}</div>
            </td>
            <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Email</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${contact.email}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding:0 0 16px 0;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Serviciu</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${contact.service}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding:0 0 16px 0;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Mesaj</div>
              <div style="font-size:.95rem;color:#080b0e;line-height:1.5;">${contact.message}</div>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
        <div style="font-size:.78rem;color:#9aa5b4;">c-design.ro · 0753 116 155 · office@c-design.ro</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY || RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'C Design <notificari@c-design.ro>',
        to: [env.NOTIFY_EMAIL || NOTIFY_EMAIL],
        subject: `✉️ Mesaj nou — ${contact.name} · ${contact.service}`,
        html,
      }),
    });
  } catch {}

  try {
    const confirmHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
      <tr><td style="background:#080b0e;padding:28px 32px;text-align:center;">
        <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.4rem;font-weight:800;color:#fff;"><span style="color:#00c8b4;">C</span> Design</div>
        <div style="color:#9aa5b4;font-size:.85rem;margin-top:4px;">Am primit mesajul tău</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="font-size:1rem;color:#080b0e;margin:0 0 20px;">Bună <strong>${contact.name}</strong>,</p>
        <p style="font-size:.95rem;color:#444;line-height:1.6;margin:0 0 28px;">Mulțumim că ne-ai contactat! Am primit mesajul tău și te vom contacta în maxim <strong>2 ore</strong> în timpul programului de lucru (Luni–Vineri, 09:00–18:00).</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding:0 8px 0 0;">
              <a href="tel:+40753116155" style="display:block;text-align:center;background:#080b0e;color:#00c8b4;font-weight:600;font-size:.9rem;padding:12px;border-radius:8px;text-decoration:none;">📞 0753 116 155</a>
            </td>
            <td style="padding:0 0 0 8px;">
              <a href="https://wa.me/40753116155" style="display:block;text-align:center;background:#25d366;color:#fff;font-weight:600;font-size:.9rem;padding:12px;border-radius:8px;text-decoration:none;">💬 WhatsApp</a>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
        <div style="font-size:.78rem;color:#9aa5b4;">© ${new Date().getFullYear()} C Design · <a href="https://www.c-design.ro" style="color:#00c8b4;text-decoration:none;">c-design.ro</a></div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY || RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'C Design <notificari@c-design.ro>',
        to: [contact.email],
        subject: `✅ Am primit mesajul tău — C Design`,
        html: confirmHtml,
      }),
    });
  } catch {}
}

const DEFAULT_PROJECTS = [
  { id: 'p1', emoji: '🚗', tag: 'Auto', title: 'Tractări Auto Teleorman', description: 'Site de prezentare cu zone de acoperire: Dâmbovița, Ilfov, București, Argeș, Giurgiu.', problema: 'Clientul nu era găsit online — toți clienții veneau doar din recomandări.', solutie: 'Site de prezentare rapid cu pagini separate pe județe, optimizat local SEO.', rezultat: 'Prima comandă online în 3 zile de la lansare. Trafic organic +180% în 2 luni.', order: 0 },
  { id: 'p2', emoji: '🏭', tag: 'Dealer Autorizat', title: 'Dealer Autorizat Lindab', description: 'Prezentare profesională cu catalog de produse și date de contact integrate.', problema: 'Site vechi, neoptimizat pentru mobil — 70% din vizitatori plecau în primele 5 secunde.', solutie: 'Redesign complet cu catalog digital și formular de cerere ofertă integrat.', rezultat: 'Rata de abandon scăzută cu 55%. Cereri de ofertă x3 față de înainte.', order: 1 },
  { id: 'p3', emoji: '🌸', tag: 'Florărie', title: 'Site Florărie', description: 'Site modern cu produse și posibilitate de comandă online, optimizat pentru mobil.', problema: 'Fără prezență online — clienții nu știau dacă florăria e deschisă sau ce oferte are.', solutie: 'Site cu galerie produse, program actualizabil și buton de comandă WhatsApp.', rezultat: 'Comenzi online de la zero la 15-20/săptămână în prima lună.', order: 2 },
  { id: 'p4', emoji: '🏗️', tag: 'Construcții', title: 'Arhitectură & Construcții', description: 'Portofoliu vizual elegant cu proiecte realizate și testimoniale clienți.', problema: 'Firma lucra bine, dar nu putea dovedi asta online — fără portofoliu vizibil.', solutie: 'Site portofoliu cu galerie proiecte, testimoniale și pagină de servicii detaliată.', rezultat: 'Câștigat 2 contracte noi direct din site în prima lună. ROI investiție: 10x.', order: 3 },
  { id: 'p5', emoji: '💼', tag: 'Start-Up', title: 'Micul Întreprinzător', description: 'Pachet complet la start: site + identitate vizuală + prezență online activă.', problema: 'Afacere nouă, zero prezență online — buget limitat, nevoie de totul dintr-o dată.', solutie: 'Pachet Startup: site + logo + domeniu + găzduire + 2 conturi social media, livrat în 14 zile.', rezultat: 'Online complet în 2 săptămâni. Primul client obținut din Google după 3 săptămâni.', order: 4 },
  { id: 'p6', emoji: '🔧', tag: 'Servicii', title: 'Firmă Servicii Tehnice', description: 'Site de prezentare cu formular de solicitare ofertă și galerie de lucrări.', problema: 'Pierdeau clienți potențiali pentru că nu aveau o modalitate ușoară de contact online.', solutie: 'Site cu formular rapid de solicitare ofertă, galerie lucrări și recenzii Google integrate.', rezultat: 'Cereri de ofertă online: de la 0 la 8-12/lună. Economie de timp la telefon: 4h/săpt.', order: 5 },
];

function isAdmin(url, env) {
  return url.searchParams.get('token') === (env.ADMIN_TOKEN || ADMIN_TOKEN);
}

function buildMaintenancePage(m) {
  const title   = m.title   || 'Site în construcție';
  const message = m.message || 'Revenim în curând cu ceva nou!';
  const date    = m.date    ? '<p class="date">🗓 ' + m.date + '</p>' : '';
  return `<!DOCTYPE html><html lang="ro"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;background:#060f0f;color:#e8edf2;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px;position:relative;overflow:hidden}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 800px 600px at 70% 40%,rgba(0,168,168,.07),transparent);pointer-events:none}
.wrap{position:relative;z-index:1;max-width:560px}
.gear{font-size:4rem;margin-bottom:24px;display:block;animation:spin 8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
h1{font-family:'Space Grotesk',sans-serif;font-size:clamp(2rem,5vw,3rem);font-weight:800;color:#fff;margin-bottom:16px;line-height:1.1}
h1 span{color:#00a8a8}
p{color:#8bbaba;font-size:1.05rem;line-height:1.75;margin-bottom:12px}
.date{font-size:.9rem;color:rgba(139,186,186,.6);margin-top:8px}
.divider{width:48px;height:3px;background:#00a8a8;margin:28px auto}
.logo{font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:700;color:rgba(255,255,255,.2);letter-spacing:4px;margin-top:48px;text-transform:uppercase}
.dots{display:flex;gap:8px;justify-content:center;margin-top:32px}
.dot{width:8px;height:8px;border-radius:50%;background:#00a8a8;animation:pulse 1.4s ease-in-out infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes pulse{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
</style></head><body>
<div class="wrap">
  <span class="gear">⚙️</span>
  <h1>C <span>Design</span></h1>
  <div class="divider"></div>
  <p><strong style="color:#fff">${title}</strong></p>
  <p>${message}</p>
  ${date}
  <div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
  <div class="logo">c-design.ro</div>
</div>
</body></html>`;
}

const AGENT_PERSONAS = {"alex":{"label":"Alex","role":"Mobile App Developer. Expert în React Native și Flutter pentru iOS și Android."},"alina":{"label":"Alina","role":"Manager de proiect și coordonator echipe. Planuri de proiect, breakdown de task-uri, timelines, deadline-uri, prioritizare backlog și rapoarte de progres."},"ana-pm":{"label":"Ana-pm","role":"Project manager general. Coordonează task-uri, planifică implementări."},"ana":{"label":"Ana","role":"COO & Chief of Staff. Coordonează întreaga echipă, descompune task-uri, planificare strategică."},"anca":{"label":"Anca","role":"Asistent academic pentru învățătoare cls. I-IV, masterandă."},"andrei":{"label":"Andrei","role":"Content Strategist & Senior Copywriter. Content strategy, storytelling de brand, long-form content."},"clara":{"label":"Clara","role":"Specialist Copyright, Proprietate Intelectuală și Anti-Plagiat. Originalitate conținut, mărci, drepturi de autor, conformitate legală."},"cosmin":{"label":"Cosmin","role":"Full-stack web developer. Expert în GitHub, Cloudflare Pages și dezvoltare web modernă."},"cristina":{"label":"Cristina","role":"PR Manager & Specialist Comunicare. Relații publice, comunicare de criză, media relations, brand reputation."},"danbastan":{"label":"Danbastan","role":"Senior Platform & AI Engineer. Full-stack, AI/LLM, Cloudflare avansat, auth & payments, arhitecturi complexe, code review senior."},"daniela":{"label":"Daniela","role":"Project Coordinator & Traffic Manager. Coordonare zilnică, planificare task-uri, time tracking."},"diana":{"label":"Diana","role":"UI/UX Designer. Design de interfețe, experiență utilizator, prototipuri Figma, design systems."},"elena":{"label":"Elena","role":"SEO & Content Strategist. Optimizare pentru motoare de căutare, strategie de conținut, content marketing."},"emma":{"label":"Emma","role":"Account Director & Client Success Manager. Relația cu clienții, retention, upsell, comunicare client-agenție."},"george":{"label":"George","role":"Specialist Google Ads & PPC. Campanii Search, Display, Shopping, YouTube, Performance Max."},"gogu":{"label":"Gogu","role":"Expert marketing online, social media și manager agenție. Strategie de marketing digital, planuri editoriale, campanii Meta/Google Ads, SEO local."},"ioana":{"label":"Ioana","role":"Pricing & Sales Operations. Construcția ofertelor, pricing strategy, contracte, calcul de marjă."},"ion":{"label":"Ion","role":"Social media manager și marketing specialist. Facebook, LinkedIn, Instagram, TikTok, copywriting."},"irina":{"label":"Irina","role":"Senior UX Designer & Design Lead. User research, information architecture, design systems, UX strategy."},"laura":{"label":"Laura","role":"Performance Marketing Manager. Paid advertising — Google Ads, Meta Ads, TikTok, optimizare ROAS."},"lucian":{"label":"Lucian","role":"Expert programare web și dezvoltare software. Cod, buguri, arhitectură, deployment, baze de date, securitate."},"marian":{"label":"Marian","role":"Visual & Graphic Designer. Identitate vizuală, materiale print & digital, motion graphics, creative ads."},"mihai":{"label":"Mihai","role":"Copywriter & Content Writer. Texte persuasive pentru web, ads, emailuri și materiale de vânzare."},"radu":{"label":"Radu","role":"Specialist implantologie și estetică dentară. Conținut medical stomatologic, educație pacienți, personal branding medical."},"rares":{"label":"Rares","role":"Manager Academie de Rugby pentru copii. Social media rugby, comunicare cu părinți, organizare turnee."},"robert":{"label":"Robert","role":"Head of Analytics & Strategic Advisor. Analytics, conversion rate optimization, atribuire, decizii bazate pe date."},"stefan":{"label":"Stefan","role":"Senior Project Manager & Operations Lead. Delivery management, planificare, resource allocation, optimizare procese."},"victor":{"label":"Victor","role":"VR/XR Developer. Meta Quest, Unity XR, Unreal Engine, mixed reality, avatare 3D."},"victoria":{"label":"Victoria","role":"Chief Marketing Officer & Strategy Director. Strategie de marketing integrată, brand positioning, GTM, leadership."}};

// ── GOOGLE SEARCH CONSOLE (service account → JWT → access token) ──
function gscB64urlBytes(bytes) { let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function gscB64urlStr(str) { return gscB64urlBytes(new TextEncoder().encode(str)); }
async function gscImportKey(pem) {
  const body = String(pem).replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\\n/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(body), c => c.charCodeAt(0));
  return crypto.subtle.importKey('pkcs8', der.buffer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
}
async function gscAccessToken(env) {
  const raw = env.GSC_SA_KEY;
  if (!raw) throw new Error('GSC_SA_KEY lipsește (adaugă cheia service account ca secret în Cloudflare).');
  const sa = JSON.parse(raw);
  const now = Math.floor(Date.now() / 1000);
  const header = gscB64urlStr(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = gscB64urlStr(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  }));
  const unsigned = header + '.' + claim;
  const key = await gscImportKey(sa.private_key);
  const sig = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, key, new TextEncoder().encode(unsigned));
  const jwt = unsigned + '.' + gscB64urlBytes(new Uint8Array(sig));
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + encodeURIComponent(jwt),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Autentificare Google eșuată: ' + (data.error_description || data.error || JSON.stringify(data)));
  return data.access_token;
}
async function gscQuery(token, site, payload) {
  const res = await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(site) + '/searchAnalytics/query', {
    method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('GSC API: ' + (data.error && data.error.message || res.status));
  return data.rows || [];
}
function gscDateStr(d) { return d.toISOString().slice(0, 10); }

// ── PROMO PAGE VISIBILITY ─────────────────────────────────
async function promoPagePublished(env, key) {
  try {
    const raw = await env.PROGRAMARI.get('__site_settings__');
    const s = raw ? JSON.parse(raw) : {};
    return !!(s && s[key] && s[key].published);
  } catch { return false; }
}
function promoDraft404() {
  return new Response('<!DOCTYPE html><meta charset="utf-8"><title>Pagina nu a fost găsită</title><body style="font-family:system-ui,sans-serif;text-align:center;padding:80px 20px;color:#334155;"><h1>Pagina nu a fost găsită</h1><p><a href="https://www.c-design.ro" style="color:#00AAAC;">Înapoi la C Design →</a></p></body>', { status: 404, headers: { 'Content-Type': 'text/html;charset=utf-8' } });
}
// Verifică un token de previzualizare (?pt=...) valabil (setat de admin, TTL scurt în KV).
async function validPreviewToken(env, url) {
  try {
    const pt = url.searchParams.get('pt');
    if (!pt) return false;
    const raw = await env.PROGRAMARI.get('__pv__' + pt);
    if (!raw) return false;
    const p = JSON.parse(raw);
    return !p.expires || p.expires > Date.now();
  } catch { return false; }
}

// Cod de reducere scurt, prietenos și fără ambiguități (fără 0/O/1/I/L).
function genDiscountCode(prefix) {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const arr = new Uint8Array(6);
  crypto.getRandomValues(arr);
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[arr[i] % chars.length];
  return (prefix || 'CD') + '-' + s;
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Construiește și trimite emailul cu reducerea de bun venit prietenului recomandat.
async function sendFriendDiscountEmail(env, rec) {
  if (!EMAIL_RE.test(rec.friendContact)) return { ok: false, skipped: true };
  const replyTo = (await getOwnerEmail(env)) || (env.NOTIFY_EMAIL || NOTIFY_EMAIL);
  const html =
    '<div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:0 auto;color:#2E3436;">' +
      '<h2 style="color:#008587;">Ai primit un cadou de bun venit!</h2>' +
      '<p>Salut ' + escHtml(rec.friendName) + ',</p>' +
      '<p><strong>' + escHtml(rec.referrerName) + '</strong> crede că C Design îți poate ajuta afacerea online și te-a recomandat — și asta vine cu un cadou.</p>' +
      '<p style="font-size:1rem;">Iată reducerea ta de <strong>' + escHtml(String(rec.friendPct)) + '% pentru primul tău proiect</strong>:</p>' +
      '<p style="text-align:center;margin:22px 0;"><span style="display:inline-block;font-family:monospace;font-size:1.5rem;font-weight:700;letter-spacing:2px;color:#008587;background:#e9f6f6;border:1px dashed #00AAAC;border-radius:10px;padding:14px 26px;">' + escHtml(rec.friendCode) + '</span></p>' +
      '<p>Menționează acest cod când ceri o ofertă la <a href="https://www.c-design.ro/cere-oferta" style="color:#008587;">www.c-design.ro/cere-oferta</a> sau răspunde direct la acest email.</p>' +
      '<p style="color:#8b94a3;font-size:.85rem;">Fără presiune — suntem aici când ești gata. — Echipa C Design</p>' +
    '</div>';
  return sendEmail(env, { to: rec.friendContact, replyTo, subject: 'Reducerea ta de ' + rec.friendPct + '% de la C Design', html });
}

// Cheie stabilă de identitate pentru un referent (un om = un cod persistent).
function referrerKeyOf(r) {
  return (String((r && r.referrerEmail) || '').trim().toLowerCase()) || String((r && r.referrerPhone) || '').trim() || String((r && r.referrerName) || '').trim().toLowerCase();
}

// Trimite referentului codul său PERSISTENT (o singură dată, la primul referral).
async function sendReferrerCodeEmail(env, rec, pct, cap) {
  if (!EMAIL_RE.test(rec.referrerEmail)) return { ok: false, skipped: true };
  const replyTo = (await getOwnerEmail(env)) || (env.NOTIFY_EMAIL || NOTIFY_EMAIL);
  const html =
    '<div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:0 auto;color:#2E3436;">' +
      '<h2 style="color:#008587;">Mulțumim că răspândești vestea!</h2>' +
      '<p>Salut ' + escHtml(rec.referrerName) + ',</p>' +
      '<p>Iată codul tău personal de referral — este al tău și rămâne mereu același:</p>' +
      '<p style="text-align:center;margin:22px 0;"><span style="display:inline-block;font-family:monospace;font-size:1.5rem;font-weight:700;letter-spacing:2px;color:#008587;background:#e9f6f6;border:1px dashed #00AAAC;border-radius:10px;padding:14px 26px;">' + escHtml(rec.referrerCode) + '</span></p>' +
      '<p>Fiecare prieten pe care îl recomanzi și care se înscrie adaugă <strong>' + escHtml(String(pct)) + '%</strong> la el — cumulând până la <strong>' + escHtml(String(cap)) + '%</strong> reducere la proiectul tău următor. Codul rămâne același; valoarea lui crește pe măsură ce mai mulți prieteni se alătură.</p>' +
      '<p>Recomandă mai mulți prieteni oricând la <a href="https://www.c-design.ro/referral" style="color:#008587;">www.c-design.ro/referral</a> și menționează codul când ești gata să folosești reducerea.</p>' +
      '<p style="color:#8b94a3;font-size:.85rem;">— Echipa C Design</p>' +
    '</div>';
  return sendEmail(env, { to: rec.referrerEmail, replyTo, subject: 'Codul tău de referral C Design', html });
}

// Emailează referentul când unul dintre prietenii recomandați devine client.
async function sendReferrerConversionEmail(env, rec, value, cap) {
  if (!EMAIL_RE.test(rec.referrerEmail)) return { ok: false, skipped: true };
  const replyTo = (await getOwnerEmail(env)) || (env.NOTIFY_EMAIL || NOTIFY_EMAIL);
  const atCap = value >= cap;
  const html =
    '<div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:0 auto;color:#2E3436;">' +
      '<h2 style="color:#008587;">Reducerea ta a crescut!</h2>' +
      '<p>Salut ' + escHtml(rec.referrerName) + ',</p>' +
      '<p>Vești bune — <strong>' + escHtml(rec.friendName) + '</strong> a devenit client C Design. Mulțumim pentru recomandare!</p>' +
      '<p>Codul tău de referral valorează acum:</p>' +
      '<p style="text-align:center;margin:20px 0;"><span style="display:inline-block;font-family:\'Poppins\',system-ui,sans-serif;font-size:2rem;font-weight:700;color:#008587;">' + escHtml(String(value)) + '% reducere</span><br>' +
        '<span style="font-family:monospace;font-size:1.05rem;font-weight:700;letter-spacing:2px;color:#2E3436;background:#e9f6f6;border:1px dashed #00AAAC;border-radius:8px;padding:6px 16px;display:inline-block;margin-top:8px;">' + escHtml(rec.referrerCode || '') + '</span></p>' +
      '<p>' + (atCap
        ? 'Ai atins maximul — felicitări! Menționează codul când ești gata să îl folosești.'
        : 'Continuă să crească pe măsură ce mai mulți prieteni se înscriu (până la ' + escHtml(String(cap)) + '%). Menționează codul când ești gata să folosești reducerea.') + '</p>' +
      '<p style="color:#8b94a3;font-size:.85rem;">— Echipa C Design</p>' +
    '</div>';
  return sendEmail(env, { to: rec.referrerEmail, replyTo, subject: 'Reducerea ta de referral este acum de ' + value + '%', html });
}

// Trimitere email robustă via Resend. Nu face nimic (și spune asta) când nu e configurat.
async function sendEmail(env, opts) {
  const apiKey = env.RESEND_API_KEY || RESEND_API_KEY;
  if (!apiKey) return { ok: false, skipped: true, reason: 'RESEND_API_KEY not configured' };
  const to = (Array.isArray(opts.to) ? opts.to : [opts.to]).filter(Boolean);
  if (!to.length) return { ok: false, skipped: true, reason: 'no recipient' };
  try {
    const payload = { from: opts.from || 'C Design <office@c-design.ro>', to, subject: opts.subject, html: opts.html };
    if (opts.text) payload.text = String(opts.text).slice(0, 20000);
    else if (opts.html) payload.text = String(opts.html).replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim().slice(0, 20000);
    const replyTo = (Array.isArray(opts.replyTo) ? opts.replyTo : [opts.replyTo]).filter(Boolean);
    if (replyTo.length) payload.reply_to = replyTo;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let detail = ''; try { detail = await res.text(); } catch {}
      console.error('sendEmail failed', res.status, detail.slice(0, 300));
      return { ok: false, status: res.status, error: detail };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    console.error('sendEmail network error', e && e.message);
    return { ok: false, error: String((e && e.message) || e) };
  }
}

// Adresele email ale conturilor sub-admin (doar cele valide).
async function getAdminEmails(env) {
  try {
    const raw = await env.PROGRAMARI.get('__admins__');
    const admins = raw ? JSON.parse(raw) : [];
    return admins.map(a => String(a.email || '').trim()).filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  } catch { return []; }
}

// Email-ul proprietarului, stocat separat în KV.
async function getOwnerEmail(env) {
  try {
    const e = String((await env.PROGRAMARI.get('__owner_email__')) || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : '';
  } catch { return ''; }
}

// Destinatari pentru notificările de admin: NOTIFY_EMAIL + email proprietar + email-urile adminilor, deduplicat.
async function notifyRecipients(env) {
  const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const list = [];
  const base = String(env.NOTIFY_EMAIL || NOTIFY_EMAIL || '').trim();
  if (isEmail(base)) list.push(base);
  const owner = await getOwnerEmail(env);
  if (owner) list.push(owner);
  for (const e of await getAdminEmails(env)) list.push(e);
  return [...new Set(list.map(e => e.toLowerCase()))];
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') return new Response(null, { headers: getCors(request) });

    // Redirect non-www → www (301 permanent) pentru canonical corect
    if (url.hostname === 'c-design.ro') {
      url.hostname = 'www.c-design.ro';
      return Response.redirect(url.toString(), 301);
    }

    // ── MAINTENANCE MODE ──────────────────────────────────────
    // Skip maintenance check for: admin API, admin page, static assets, token bypass
    const isAdminReq = path === '/programari' || path === '/programari.html' || path.startsWith('/api/');
    const hasToken = url.searchParams.get('token') === (env.ADMIN_TOKEN || ADMIN_TOKEN);
    if (!isAdminReq && !hasToken) {
      try {
        const mRaw = await env.PROGRAMARI.get('__maintenance__');
        const mData = mRaw ? JSON.parse(mRaw) : { enabled: false };
        if (mData.enabled) {
          return new Response(buildMaintenancePage(mData), {
            status: 503,
            headers: { ...SEC_HEADERS, 'Content-Type': 'text/html;charset=utf-8', 'Retry-After': '3600', 'Cache-Control': 'no-store' }
          });
        }
      } catch {}
    }

    // ── 301 REDIRECTS pentru URL-uri 404 semnalate în GSC ────────
    const REDIRECTS_301 = {
      '/campanie-florarii/tema1': '/',
      '/campanie-florarii/tema2': '/',
      '/campanie-florarii/tema3': '/',
    };
    if (REDIRECTS_301[path]) {
      return Response.redirect('https://www.c-design.ro' + REDIRECTS_301[path], 301);
    }
    // orice alt URL vechi din campania de florărie → homepage (301)
    if (path === '/campanie-florarii' || path.startsWith('/campanie-florarii/')) {
      return Response.redirect('https://www.c-design.ro/', 301);
    }

    // ── SITEMAP DINAMIC ───────────────────────────────────────
    // Generat la cerere: paginile statice + articolele de blog publicate
    // din KV. Înlocuiește sitemap.xml static (nu mai necesită întreținere).
    if (path === '/sitemap.xml' && request.method === 'GET') {
      const BASE = 'https://www.c-design.ro';
      const SITE_LASTMOD = '2026-07-08';
      const staticPages = [
        { loc: '/',                           cf: 'weekly',  pr: '1.0' },
        { loc: '/servicii',                   cf: 'monthly', pr: '0.9' },
        { loc: '/servicii/website-design',        cf: 'monthly', pr: '0.7' },
        { loc: '/servicii/ecommerce',        cf: 'monthly', pr: '0.7' },
        { loc: '/servicii/web-apps',        cf: 'monthly', pr: '0.7' },
        { loc: '/servicii/ai-integration',        cf: 'monthly', pr: '0.7' },
        { loc: '/servicii/seo',        cf: 'monthly', pr: '0.7' },
        { loc: '/servicii/social-media',        cf: 'monthly', pr: '0.7' },
        { loc: '/servicii/hosting-maintenance',        cf: 'monthly', pr: '0.7' },
        { loc: '/servicii/branding',        cf: 'monthly', pr: '0.7' },
        { loc: '/despre-noi',                 cf: 'monthly', pr: '0.8' },
        { loc: '/contact',                    cf: 'monthly', pr: '0.8' },
        { loc: '/parteneri',                  cf: 'monthly', pr: '0.6' },
        { loc: '/parteneri/hosting',          cf: 'monthly', pr: '0.5' },
        { loc: '/parteneri/print',            cf: 'monthly', pr: '0.5' },
        { loc: '/programare',                 cf: 'monthly', pr: '0.6' },
        { loc: '/pachet-startup',             cf: 'monthly', pr: '0.8' },
        { loc: '/abonament-lunar',            cf: 'monthly', pr: '0.8' },
        { loc: '/blog',                       cf: 'weekly',  pr: '0.7' },
        { loc: '/demos',                      cf: 'monthly', pr: '0.7' },
        { loc: '/cere-oferta',                cf: 'monthly', pr: '0.8' },
        { loc: '/promo',                      cf: 'monthly', pr: '0.8' },
        { loc: '/referral',                   cf: 'monthly', pr: '0.6' },
        { loc: '/giveaway',                   cf: 'monthly', pr: '0.6' },
        { loc: '/web-design-bucuresti',       cf: 'monthly', pr: '0.8' },
        { loc: '/web-design-cluj',            cf: 'monthly', pr: '0.8' },
        { loc: '/web-design-timisoara',       cf: 'monthly', pr: '0.8' },
        { loc: '/web-design-auto',            cf: 'monthly', pr: '0.8' },
        { loc: '/web-design-restaurante',     cf: 'monthly', pr: '0.8' },
        { loc: '/web-design-afaceri-mici',    cf: 'monthly', pr: '0.8' },
        { loc: '/politica-confidentialitate', cf: 'yearly',  pr: '0.3' },
      ];
      const urlXml = (loc, lastmod, cf, pr) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>`;
      const parts = staticPages.map(p => urlXml(BASE + p.loc, SITE_LASTMOD, p.cf, p.pr));
      // Notă: paginile demo individuale (/demos/*.html) sunt intenționat
      // EXCLUSE din sitemap și marcate noindex — sunt site-uri exemplu, nu
      // conținut de indexat. Galeria /demos rămâne indexată.
      try {
        const raw = await env.PROGRAMARI.get('__blog__');
        if (raw) {
          const posts = JSON.parse(raw).filter(p => p.published && p.slug);
          for (const p of posts) {
            const d = String(p.updatedAt || p.createdAt || '').slice(0, 10) || SITE_LASTMOD;
            parts.push(urlXml(BASE + '/blog/' + encodeURIComponent(p.slug), d, 'yearly', '0.6'));
          }
        }
      } catch {}
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${parts.join('\n')}\n</urlset>`;
      return new Response(xml, {
        headers: { 'Content-Type': 'application/xml;charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // ── BLOG PUBLIC PAGES ─────────────────────────────────────

    if (path === '/blog' || path === '/blog/') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/blog.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // ── DEMO-URI (galerie de site-uri exemplu) ────────────────
    if (path === '/demos' || path === '/demos/') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/demos.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // ── CERE OFERTĂ (formular de cerere ofertă) ───────────────
    if (path === '/cere-oferta' || path === '/cere-oferta/') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/cere-oferta.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // ── PROMO (ofertă de lansare) ─────────────────────────────
    if (path === '/promo' || path === '/promo/') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/promo.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // ── SERVICII — pagini dedicate /servicii/<slug> ───────────
    if (path.startsWith('/servicii/')) {
      const SERVICE_PAGES = ['website-design', 'ecommerce', 'web-apps', 'ai-integration', 'seo', 'social-media', 'hosting-maintenance', 'branding'];
      const slug = path.replace('/servicii/', '').replace(/\/$/, '');
      if (SERVICE_PAGES.includes(slug)) {
        const assetUrl = new URL(request.url);
        assetUrl.pathname = '/servicii/' + slug + '.html';
        return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
      }
    }

    if (path === '/referral' || path === '/referral/') {
      if (!isAdmin(url, env) && !(await validPreviewToken(env, url)) && !(await promoPagePublished(env, 'referral'))) return promoDraft404();
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/referral.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (path === '/giveaway' || path === '/giveaway/') {
      if (!isAdmin(url, env) && !(await validPreviewToken(env, url)) && !(await promoPagePublished(env, 'giveaway'))) return promoDraft404();
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/giveaway.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (/^\/blog\/[^/]+$/.test(path) && request.method === 'GET') {
      const slug = path.slice(6);
      try {
        const raw = await env.PROGRAMARI.get('__blog__');
        const posts = raw ? JSON.parse(raw) : [];
        const post = posts.find(p => p.slug === slug && p.published);
        if (!post) return Response.redirect('https://www.c-design.ro/blog', 302);
        return new Response(renderArticle(post), {
          headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public,max-age=300' },
        });
      } catch { return Response.redirect('https://www.c-design.ro/blog', 302); }
    }

    // ── PACHET STARTUP ────────────────────────────────────────

    if (path === '/pachet-startup') {
      try {
        const assetUrl = new URL(request.url);
        assetUrl.pathname = '/pachet-startup.html';
        const [htmlResp, settingsRaw, contentRaw] = await Promise.all([
          env.ASSETS.fetch(new Request(assetUrl.toString(), request)),
          env.PROGRAMARI.get('__site_settings__'),
          env.PROGRAMARI.get('__content__pachet-startup').catch(() => null)
        ]);
        if (!settingsRaw && !contentRaw) return htmlResp;
        const s = settingsRaw ? JSON.parse(settingsRaw) : {};
        let html = await htmlResp.text();
        if (contentRaw) { try { html = applyContentOverrides(html, JSON.parse(contentRaw)); } catch {} }
        function injectInner(h, id, val) {
          if (!val && val !== 0) return h;
          const esc = String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          return h.replace(new RegExp(`(id="${id}"[^>]*>)[\\s\\S]*?(<\\/span>|<\\/div>)`), `$1${esc}$2`);
        }
        if (s.startupPretMin !== undefined) html = injectInner(html, 'startup-pret-min', s.startupPretMin);
        if (s.startupPretMax !== undefined) html = injectInner(html, 'startup-pret-max', '– ' + s.startupPretMax);
        if (s.startupValoareSep !== undefined) html = injectInner(html, 'startup-valoare-sep', `\n      Valoare separată: ~${s.startupValoareSep}€\n    `);
        return new Response(html, { headers: { ...SEC_HEADERS, 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
      } catch {
        const assetUrl = new URL(request.url);
        assetUrl.pathname = '/pachet-startup.html';
        return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
      }
    }

    // ── PAGINI PRINCIPALE (Despre noi, Servicii) ─────────────

    if (path === '/despre-noi') {
      return serveContentPage(request, env, 'despre-noi');
    }

    if (path === '/servicii') {
      return serveContentPage(request, env, 'servicii');
    }

    if (path === '/contact') {
      return serveContentPage(request, env, 'contact');
    }

    if (path === '/parteneri/hosting') {
      return serveContentPage(request, env, 'partener-hosting');
    }

    if (path === '/parteneri/print') {
      return serveContentPage(request, env, 'partener-print');
    }

    if (path === '/parteneri') {
      return serveContentPage(request, env, 'parteneri');
    }

    // ── CITY LANDING PAGES ───────────────────────────────────

    if (path === '/web-design-bucuresti') {
      return serveContentPage(request, env, 'web-design-bucuresti');
    }

    if (path === '/web-design-cluj') {
      return serveContentPage(request, env, 'web-design-cluj');
    }

    if (path === '/web-design-timisoara') {
      return serveContentPage(request, env, 'web-design-timisoara');
    }

    if (path === '/web-design-auto') {
      return serveContentPage(request, env, 'web-design-auto');
    }

    if (path === '/web-design-restaurante') {
      return serveContentPage(request, env, 'web-design-restaurante');
    }

    if (path === '/web-design-afaceri-mici') {
      return serveContentPage(request, env, 'web-design-afaceri-mici');
    }


    if (path === '/abonament-lunar') {
      return serveContentPage(request, env, 'abonament-lunar');
    }

    if (path === '/programare') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/programare.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // ── LEGAL ─────────────────────────────────────────────────

    if (path === '/politica-confidentialitate') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/politica-confidentialitate.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // ── AUTH ──────────────────────────────────────────────────

    if (path === '/api/login' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const allowed = await checkRateLimit(env, 'login_' + ip, 10, 900);
      if (!allowed) return json({ error: 'Prea multe încercări. Reîncearcă în 15 minute.' }, 429, request);
      try {
        const { username, password } = await request.json();
        const validUser  = env.ADMIN_USER  || ADMIN_USER;
        const validToken = env.ADMIN_TOKEN || ADMIN_TOKEN;
        if (username === validUser && password === validToken)
          return json({ success: true }, 200, request);
        return json({ error: 'Credențiale incorecte' }, 401, request);
      } catch { return json({ error: 'Eroare server' }, 500, request); }
    }

    // ── CONTACT FORM ──────────────────────────────────────────

    if (path === '/api/contact' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const allowed = await checkRateLimit(env, 'contact_' + ip, 5, 3600);
      if (!allowed) return json({ error: 'Prea multe cereri. Reîncearcă mai târziu.' }, 429, request);
      try {
        const { name, phone, email, service, message } = await request.json();
        if (!name || !phone || !email || !message)
          return json({ error: 'Câmpuri obligatorii lipsă' }, 400);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
        if (!emailRegex.test(email)) return json({ error: 'Email invalid' }, 400);
        if (!phoneRegex.test(phone)) return json({ error: 'Telefon invalid' }, 400);
        if (name.length < 2) return json({ error: 'Nume invalid' }, 400);
        const contact = { name, phone, email, service: service || 'Nespecificat', message };
        // Salvează mesajul în admin (KV), pe lângă notificarea pe email.
        try {
          const mid = 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
          const rec = { id: mid, name: String(name).slice(0, 120), phone: String(phone).slice(0, 40), email: String(email).slice(0, 160), service: contact.service, message: String(message).slice(0, 5000), createdAt: Date.now(), status: 'nou', ip };
          await env.PROGRAMARI.put('msg:' + mid, JSON.stringify(rec), { metadata: { name: rec.name, email: rec.email, createdAt: rec.createdAt, status: 'nou', preview: String(message).slice(0, 90) } });
        } catch (e) {}
        await sendContactNotification(contact, env);
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── BOOKINGS ──────────────────────────────────────────────

    if (path === '/api/booking' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const allowed = await checkRateLimit(env, 'booking_' + ip, 5, 3600);
      if (!allowed) return json({ error: 'Prea multe cereri. Reîncearcă mai târziu.' }, 429, request);
      try {
        const { name, phone, email, service, date, time, message } = await request.json();
        if (!name || !phone || !email || !date || !time)
          return json({ error: 'Câmpuri obligatorii lipsă' }, 400);
        const id = `booking_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const booking = { id, name, phone, email, service: service || 'Nespecificat', date, time, message: message || '', status: 'nou', createdAt: new Date().toISOString() };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
        if (!emailRegex.test(booking.email)) return json({error:'Email invalid'}, 400);
        if (!phoneRegex.test(booking.phone)) return json({error:'Telefon invalid'}, 400);
        if (!booking.name || booking.name.length < 2) return json({error:'Nume invalid'}, 400);
        await env.PROGRAMARI.put(id, JSON.stringify(booking));
        const raw = await env.PROGRAMARI.get('__index__');
        const index = raw ? JSON.parse(raw) : [];
        index.unshift({ id, date, time, name });
        await env.PROGRAMARI.put('__index__', JSON.stringify(index));
        await sendBookingNotification(booking, env);
        return json({ success: true, id });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path === '/api/bookings' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__index__');
        const index = raw ? JSON.parse(raw) : [];
        const bookings = await Promise.all(index.map(async ({ id }) => { const r = await env.PROGRAMARI.get(id); return r ? JSON.parse(r) : null; }));
        return json(bookings.filter(Boolean));
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/booking/') && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      const id = path.replace('/api/booking/', '');
      const raw = await env.PROGRAMARI.get(id);
      if (!raw) return json({ error: 'Negăsit' }, 404);
      const { status } = await request.json();
      const booking = JSON.parse(raw);
      booking.status = status;
      await env.PROGRAMARI.put(id, JSON.stringify(booking));
      return json({ success: true });
    }

    // ── PROJECTS ──────────────────────────────────────────────

    if (path === '/api/projects' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__projects__');
        const projects = raw ? JSON.parse(raw) : DEFAULT_PROJECTS;
        return json(projects.sort((a, b) => a.order - b.order));
      } catch { return json(DEFAULT_PROJECTS); }
    }

    if (path === '/api/project' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const { emoji, tag, title, description } = await request.json();
        if (!title) return json({ error: 'Titlul este obligatoriu' }, 400);
        const raw = await env.PROGRAMARI.get('__projects__');
        const projects = raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS];
        const id = `p_${Date.now()}`;
        const maxOrder = projects.reduce((m, p) => Math.max(m, p.order), -1);
        projects.push({ id, emoji: emoji || '🌐', tag: tag || 'Web', title, description: description || '', order: maxOrder + 1 });
        await env.PROGRAMARI.put('__projects__', JSON.stringify(projects));
        return json({ success: true, id });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/project/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/project/', '');
        const { emoji, tag, title, description, order } = await request.json();
        const raw = await env.PROGRAMARI.get('__projects__');
        const projects = raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS];
        const idx = projects.findIndex(p => p.id === id);
        if (idx === -1) return json({ error: 'Negăsit' }, 404);
        projects[idx] = { ...projects[idx], emoji: emoji ?? projects[idx].emoji, tag: tag ?? projects[idx].tag, title: title ?? projects[idx].title, description: description ?? projects[idx].description, order: order ?? projects[idx].order };
        await env.PROGRAMARI.put('__projects__', JSON.stringify(projects));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/project/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/project/', '');
        const raw = await env.PROGRAMARI.get('__projects__');
        const projects = raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS];
        const filtered = projects.filter(p => p.id !== id);
        await env.PROGRAMARI.put('__projects__', JSON.stringify(filtered));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── CRM ───────────────────────────────────────────────────

    if (path === '/api/crm' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__crm__');
        const entries = raw ? JSON.parse(raw) : [];
        return json(entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path === '/api/crm' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const { client, proiect, valoare, termen, status, note } = await request.json();
        if (!client) return json({ error: 'Clientul este obligatoriu' }, 400);
        const raw = await env.PROGRAMARI.get('__crm__');
        const entries = raw ? JSON.parse(raw) : [];
        const id = `crm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        entries.unshift({ id, client, proiect: proiect || '', valoare: valoare || '', termen: termen || '', status: status || 'oferta', note: note || '', createdAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__crm__', JSON.stringify(entries));
        return json({ success: true, id });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/crm/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/crm/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__crm__');
        const entries = raw ? JSON.parse(raw) : [];
        const idx = entries.findIndex(e => e.id === id);
        if (idx === -1) return json({ error: 'Negăsit' }, 404);
        entries[idx] = { ...entries[idx], ...body };
        await env.PROGRAMARI.put('__crm__', JSON.stringify(entries));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/crm/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/crm/', '');
        const raw = await env.PROGRAMARI.get('__crm__');
        const entries = raw ? JSON.parse(raw) : [];
        await env.PROGRAMARI.put('__crm__', JSON.stringify(entries.filter(e => e.id !== id)));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── BLOG ──────────────────────────────────────────────────

    if (path === '/api/blog/generate' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401, request);
      try {
        const { subject, agent, existing } = await request.json();
        if (!subject) return json({ error: 'Subiectul este obligatoriu' }, 400, request);
        if (!env.AI) return json({ error: 'AI binding nedisponibil — verifică wrangler.toml' }, 500, request);

        const persona = AGENT_PERSONAS[agent];
        const intro = persona
          ? `Ești ${persona.label}, parte din echipa agenției C Design (web design, România). Rolul și expertiza ta: ${persona.role} Scrie, din perspectiva și cu expertiza ta, un articol de blog complet pentru "C Design" pe subiectul: "${subject}".`
          : `Ești un copywriter expert în web design și marketing digital pentru afaceri mici din România. Scrie un articol de blog complet pentru agenția "C Design" pe subiectul: "${subject}".`;
        const avoid = (Array.isArray(existing) && existing.length)
          ? `\n\nIMPORTANT: NU repeta și evită titluri/unghiuri similare cu aceste articole deja publicate (alege un titlu și un unghi DIFERIT):\n${existing.slice(0, 15).map(t => '- ' + t).join('\n')}`
          : '';
        const prompt = intro + avoid + `

Returnează EXCLUSIV un obiect JSON valid, fără text înainte sau după, cu această structură:
{
  "title": "titlu articol max 70 caractere",
  "excerpt": "rezumat 2-3 propoziții pentru lista de articole",
  "content": "conținut HTML complet cu <h2>, <p>, <ul>, <li>, <strong>",
  "metaDescription": "meta description SEO max 160 caractere"
}

Cerințe articol:
- Limbă: română
- Lungime: 600-900 cuvinte
- Public țintă: antreprenori și proprietari de afaceri mici din România
- Ton: profesional dar accesibil, fără jargon tehnic
- Include sfaturi practice și exemple concrete`;

        const ai = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2048,
        });

        const text = (ai.response || '').trim();
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) return json({ error: 'Modelul nu a returnat JSON valid. Încearcă din nou.' }, 500, request);

        // Sanitize control characters inside JSON string values
        let raw = match[0];
        let sanitized = '';
        let inStr = false, esc = false;
        for (let i = 0; i < raw.length; i++) {
          const c = raw[i];
          if (esc) { sanitized += c; esc = false; continue; }
          if (c === '\\') { sanitized += c; esc = true; continue; }
          if (c === '"') { inStr = !inStr; sanitized += c; continue; }
          if (inStr && c.charCodeAt(0) < 0x20) {
            if (c === '\n') sanitized += '\\n';
            else if (c === '\r') sanitized += '\\r';
            else if (c === '\t') sanitized += '\\t';
          } else { sanitized += c; }
        }

        const article = JSON.parse(sanitized);
        if (!article.title || !article.content) return json({ error: 'Articol incomplet generat. Încearcă din nou.' }, 500, request);
        return json({ success: true, article }, 200, request);
      } catch (e) {
        return json({ error: 'Eroare generare: ' + (e.message || 'necunoscută') }, 500, request);
      }
    }

    if (path === '/api/blog/research-titles' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401, request);
      try {
        const { focus, audience, existing, agent } = await request.json();
        if (!env.AI) return json({ error: 'AI binding nedisponibil — verifică wrangler.toml' }, 500, request);

        const existingList = Array.isArray(existing) && existing.length
          ? `\nEvită titluri similare cu cele deja publicate:\n${existing.slice(0, 10).map(t => `- ${t}`).join('\n')}`
          : '';

        const focusCtx = focus ? `Focalizare: ${focus}` : 'Servicii generale de web design pentru afaceri mici';
        const audienceCtx = audience ? `Public țintă: ${audience}` : 'Antreprenori și proprietari de afaceri mici din România';

        const _rp = AGENT_PERSONAS[agent];
        const _rIntro = _rp
          ? `Ești ${_rp.label} din echipa C Design. Expertiza ta: ${_rp.role} Analizezi, cu expertiza ta, ce articole de blog ar trebui să scrie agenția "C Design" (web design din Ilfov/București, pentru afaceri mici) ca să crească pe Google și să atragă clienți potențiali.`
          : `Ești un expert SEO și content strategist pentru piața din România. Analizezi ce articole de blog ar trebui să scrie agenția "C Design" (web design din Ilfov/București, servicii pentru afaceri mici) pentru a-și îmbunătăți poziționarea pe Google și a atrage clienți potențiali.`;
        const prompt = _rIntro + `

${focusCtx}
${audienceCtx}${existingList}

Generează exact 8 idei de titluri de blog SEO-optimizate. Returnează EXCLUSIV un array JSON valid, fără text înainte sau după:

[
  {
    "title": "Titlul articolului (max 65 caractere, include cuvinte cheie)",
    "keywords": ["cuvant cheie 1", "cuvant cheie 2", "cuvant cheie 3"],
    "intent": "informational|commercial|navigational",
    "hook": "De ce funcționează acest titlu SEO (1-2 propoziții)",
    "difficulty": "ușor|mediu|dificil",
    "angle": "Unghiul editorial: tutorial|lista|ghid|comparatie|studiu-de-caz|sfaturi"
  }
]

Cerințe titluri:
- Limbă română, naturală, fără traduceri rigide
- Mixează intenții: 4 informational (sfaturi, ghiduri), 2 commercial (comparații, prețuri), 2 orientate spre conversie
- Dificultate variată: 3 ușor, 3 mediu, 2 dificil
- Relevante pentru afaceri mici din România care caută servicii web design
- Include termeni de căutare reali pe care proprietarii de afaceri îi folosesc`;

        const ai = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2048,
        });

        const rawAi = ai.response ?? ai.text ?? ai ?? '';
        const text = (typeof rawAi === 'string' ? rawAi : JSON.stringify(rawAi)).trim();
        const match = text.match(/\[[\s\S]*\]/);
        if (!match) return json({ error: 'Modelul nu a returnat JSON valid. Încearcă din nou.' }, 500, request);

        let raw = match[0];
        let sanitized = '';
        let inStr = false, esc2 = false;
        for (let i = 0; i < raw.length; i++) {
          const c = raw[i];
          if (esc2) { sanitized += c; esc2 = false; continue; }
          if (c === '\\') { sanitized += c; esc2 = true; continue; }
          if (c === '"') { inStr = !inStr; sanitized += c; continue; }
          if (inStr && c.charCodeAt(0) < 0x20) {
            if (c === '\n') sanitized += '\\n';
            else if (c === '\r') sanitized += '\\r';
            else if (c === '\t') sanitized += '\\t';
          } else { sanitized += c; }
        }

        const titles = JSON.parse(sanitized);
        if (!Array.isArray(titles) || !titles.length) return json({ error: 'Niciun rezultat generat. Încearcă din nou.' }, 500, request);
        return json({ success: true, titles }, 200, request);
      } catch (e) {
        return json({ error: 'Eroare cercetare: ' + (e.message || 'necunoscută') }, 500, request);
      }
    }

    if (path === '/api/blog' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__blog__');
        const posts = raw ? JSON.parse(raw) : [];
        const all = url.searchParams.get('all') === '1' && isAdmin(url, env);
        return json(posts.filter(p => all || p.published).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path === '/api/blog' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const { title, slug, content, excerpt, published } = await request.json();
        if (!title) return json({ error: 'Titlul este obligatoriu' }, 400);
        const raw = await env.PROGRAMARI.get('__blog__');
        const posts = raw ? JSON.parse(raw) : [];
        const id = `blog_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const autoSlug = (slug || title).toLowerCase().replace(/ă/g,'a').replace(/â/g,'a').replace(/î/g,'i').replace(/ș/g,'s').replace(/ț/g,'t').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        posts.unshift({ id, title, slug: autoSlug, content: content || '', excerpt: excerpt || '', published: !!published, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__blog__', JSON.stringify(posts));
        return json({ success: true, id });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/blog/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/blog/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__blog__');
        const posts = raw ? JSON.parse(raw) : [];
        const idx = posts.findIndex(p => p.id === id);
        if (idx === -1) return json({ error: 'Negăsit' }, 404);
        posts[idx] = { ...posts[idx], ...body, updatedAt: new Date().toISOString() };
        await env.PROGRAMARI.put('__blog__', JSON.stringify(posts));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/blog/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/blog/', '');
        const raw = await env.PROGRAMARI.get('__blog__');
        const posts = raw ? JSON.parse(raw) : [];
        await env.PROGRAMARI.put('__blog__', JSON.stringify(posts.filter(p => p.id !== id)));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── CHELTUIELI ───────────────────────────────────────────
    if (path === '/api/cheltuieli' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__cheltuieli__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path === '/api/cheltuieli' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const { descriere, categorie, suma, moneda, data, metodaPlatii, recurent, note } = await request.json();
        if (!descriere || !suma || !data) return json({ error: 'Câmpuri obligatorii lipsă' }, 400);
        const raw = await env.PROGRAMARI.get('__cheltuieli__');
        const lista = raw ? JSON.parse(raw) : [];
        const id = `chelt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        lista.unshift({ id, descriere, categorie: categorie || 'altele', suma: parseFloat(suma), moneda: moneda || 'RON', data, metodaPlatii: metodaPlatii || 'card', recurent: !!recurent, note: note || '', createdAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__cheltuieli__', JSON.stringify(lista));
        return json({ success: true, id });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/cheltuieli/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/cheltuieli/', '');
        const updates = await request.json();
        const raw = await env.PROGRAMARI.get('__cheltuieli__');
        const lista = raw ? JSON.parse(raw) : [];
        const idx = lista.findIndex(c => c.id === id);
        if (idx === -1) return json({ error: 'Cheltuiala negăsită' }, 404);
        lista[idx] = { ...lista[idx], ...updates, suma: parseFloat(updates.suma || lista[idx].suma), updatedAt: new Date().toISOString() };
        await env.PROGRAMARI.put('__cheltuieli__', JSON.stringify(lista));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/cheltuieli/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/cheltuieli/', '');
        const raw = await env.PROGRAMARI.get('__cheltuieli__');
        const lista = raw ? JSON.parse(raw) : [];
        await env.PROGRAMARI.put('__cheltuieli__', JSON.stringify(lista.filter(c => c.id !== id)));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── SETTINGS ─────────────────────────────────────────────

    const DEFAULT_SETTINGS = { workingDays:[1,2,3,4,5], startTime:'09:00', endTime:'18:00', slotInterval:60, blockedDates:[] };

    if (path === '/api/test-email' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401, request);
      const apiKey = env.RESEND_API_KEY || RESEND_API_KEY;
      if (!apiKey) return json({ error: 'RESEND_API_KEY nu este configurat în Cloudflare Secrets.' }, 400, request);
      const toEmail = env.NOTIFY_EMAIL || NOTIFY_EMAIL;
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'C Design <office@c-design.ro>',
            to: [toEmail],
            subject: '✅ Test notificare C Design',
            html: `<div style="font-family:Arial,sans-serif;padding:32px;max-width:480px;">
              <h2 style="color:#00a8a8;">✅ Notificările funcționează!</h2>
              <p>Acest email a fost trimis din adminul <strong>C Design</strong> pentru a verifica că integrarea Resend este configurată corect.</p>
              <p style="color:#777;font-size:.85rem;">Trimis la: ${new Date().toLocaleString('ro-RO')}</p>
            </div>`
          })
        });
        const data = await res.json();
        if (!res.ok) return json({ error: data.message || data.name || 'Eroare Resend', detail: data }, 500, request);
        return json({ success: true, id: data.id, to: toEmail }, 200, request);
      } catch (e) {
        return json({ error: 'Eroare rețea: ' + e.message }, 500, request);
      }
    }

    if (path === '/api/settings' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__settings__');
        return json(raw ? JSON.parse(raw) : DEFAULT_SETTINGS);
      } catch { return json(DEFAULT_SETTINGS); }
    }

    if (path === '/api/settings' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__settings__', JSON.stringify(body));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── SOCIAL MEDIA ──────────────────────────────────────────

    const DEFAULT_SOCIAL = [
      { platform: 'Facebook', url: '', enabled: false },
      { platform: 'Instagram', url: '', enabled: false },
      { platform: 'LinkedIn', url: '', enabled: false },
      { platform: 'TikTok', url: '', enabled: false },
      { platform: 'Google Business', url: '', enabled: false },
      { platform: 'WhatsApp', url: '', enabled: false },
    ];

    if (path === '/api/social' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__social__');
        return json(raw ? JSON.parse(raw) : DEFAULT_SOCIAL);
      } catch { return json(DEFAULT_SOCIAL); }
    }

    if (path === '/api/social' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__social__', JSON.stringify(body));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── GIBILAN ───────────────────────────────────────────────

    if (path === '/api/gibilan/agenda' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const today = new Date().toISOString().split('T')[0];
        const meetings = (data.meetings || []).filter(m => m.date >= today);
        const todos = (data.todos || []).filter(t => !t.done);
        const todosDone = (data.todos || []).filter(t => t.done);
        const deadlines = (data.deadlines || []).filter(d => d.date >= today);
        return json({ meetings, todos, todosDone, deadlines });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path === '/api/gibilan/meeting' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const { title, date, time, notes, clientId } = await request.json();
        if (!title || !date) return json({ error: 'Titlul și data sunt obligatorii' }, 400);
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const id = `m_${Date.now()}`;
        data.meetings = data.meetings || [];
        data.meetings.push({ id, title, date, time: time || '', notes: notes || '', clientId: clientId || '' });
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true, id });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/gibilan/meeting/') && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/gibilan/meeting/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const item = (data.meetings || []).find(m => m.id === id);
        if (!item) return json({ error: 'Negăsit' }, 404);
        Object.assign(item, body);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/gibilan/meeting/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/gibilan/meeting/', '');
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        data.meetings = (data.meetings || []).filter(m => m.id !== id);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path === '/api/gibilan/todo' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const { title, dueDate, priority, clientId } = await request.json();
        if (!title) return json({ error: 'Titlul este obligatoriu' }, 400);
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const id = `t_${Date.now()}`;
        data.todos = data.todos || [];
        data.todos.push({ id, title, dueDate: dueDate || '', priority: priority || 'normal', done: false, clientId: clientId || '' });
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true, id });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.match(/^\/api\/gibilan\/todo\/[^/]+\/done$/) && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/gibilan/todo/', '').replace('/done', '');
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const todo = (data.todos || []).find(t => t.id === id);
        if (!todo) return json({ error: 'Negăsit' }, 404);
        todo.done = !todo.done;
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true, done: todo.done });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/gibilan/todo/') && !path.endsWith('/done') && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/gibilan/todo/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const item = (data.todos || []).find(t => t.id === id);
        if (!item) return json({ error: 'Negăsit' }, 404);
        Object.assign(item, body);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/gibilan/todo/') && !path.endsWith('/done') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/gibilan/todo/', '');
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        data.todos = (data.todos || []).filter(t => t.id !== id);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path === '/api/gibilan/deadline' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const { title, date, project, notes, clientId } = await request.json();
        if (!title || !date) return json({ error: 'Titlul și data sunt obligatorii' }, 400);
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const id = `d_${Date.now()}`;
        data.deadlines = data.deadlines || [];
        data.deadlines.push({ id, title, date, project: project || '', notes: notes || '', clientId: clientId || '' });
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true, id });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/gibilan/deadline/') && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/gibilan/deadline/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const item = (data.deadlines || []).find(d => d.id === id);
        if (!item) return json({ error: 'Negăsit' }, 404);
        Object.assign(item, body);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/gibilan/deadline/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/gibilan/deadline/', '');
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        data.deadlines = (data.deadlines || []).filter(d => d.id !== id);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── CLIENȚI ──────────────────────────────────────────────
    if (path === '/api/clients' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__clients__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path === '/api/client' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const { name, contact, phone, email, notes } = await request.json();
        if (!name) return json({ error: 'Numele este obligatoriu' }, 400);
        const raw = await env.PROGRAMARI.get('__clients__');
        const clients = raw ? JSON.parse(raw) : [];
        const client = {
          id: 'c_' + Date.now(), name,
          contact: contact || '', phone: phone || '',
          email: email || '', notes: notes || '',
          createdAt: new Date().toISOString().split('T')[0]
        };
        clients.push(client);
        await env.PROGRAMARI.put('__clients__', JSON.stringify(clients));
        return json(client);
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.match(/^\/api\/client\/[^/]+$/) && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/client/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__clients__');
        const clients = raw ? JSON.parse(raw) : [];
        const idx = clients.findIndex(c => c.id === id);
        if (idx === -1) return json({ error: 'Client negăsit' }, 404);
        clients[idx] = { ...clients[idx], ...body };
        await env.PROGRAMARI.put('__clients__', JSON.stringify(clients));
        return json(clients[idx]);
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.match(/^\/api\/client\/[^/]+$/) && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/client/', '');
        const raw = await env.PROGRAMARI.get('__clients__');
        const clients = raw ? JSON.parse(raw) : [];
        await env.PROGRAMARI.put('__clients__', JSON.stringify(clients.filter(c => c.id !== id)));
        return json({ ok: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── THEME ─────────────────────────────────────────────────

    const THEME_DEFAULT = {
      teal:        '#c9a96e',
      bg:          '#ffffff',
      bg2:         '#f7f7f7',
      bg3:         '#eeeeee',
      bg4:         '#e5e5e5',
      text:        '#111111',
      soft:        '#444444',
      heading:     '#111111',
      fontHeading: 'Space Grotesk',
      fontBody:    'DM Sans'
    };

    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    function lightenHex(hex, amount) {
      let r = Math.min(255, parseInt(hex.slice(1,3),16) + amount);
      let g = Math.min(255, parseInt(hex.slice(3,5),16) + amount);
      let b = Math.min(255, parseInt(hex.slice(5,7),16) + amount);
      return '#' + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
    }

    function darkenHex(hex, amount) {
      let r = Math.max(0, parseInt(hex.slice(1,3),16) - amount);
      let g = Math.max(0, parseInt(hex.slice(3,5),16) - amount);
      let b = Math.max(0, parseInt(hex.slice(5,7),16) - amount);
      return '#' + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
    }

    const FONT_GOOGLE_MAP = {
      'Syne':          'Syne:wght@700;800',
      'Raleway':       'Raleway:wght@700;800',
      'Oswald':        'Oswald:wght@500;700',
      'Space Grotesk': 'Space+Grotesk:wght@600;700',
      'Bebas Neue':    'Bebas+Neue',
      'DM Sans':       'DM+Sans:ital,wght@0,300;0,400;0,500;1,400',
      'Inter':         'Inter:wght@300;400;500',
      'Nunito':        'Nunito:wght@300;400;600',
      'Roboto':        'Roboto:wght@300;400;500',
      'Open Sans':     'Open+Sans:wght@300;400;600',
      'Lato':          'Lato:wght@300;400;700',
    };

    function buildThemeCss(t) {
      const teal = t.teal || THEME_DEFAULT.teal;
      const bg   = t.bg   || THEME_DEFAULT.bg;
      const bg2  = t.bg2  || THEME_DEFAULT.bg2;
      const bg3  = t.bg3  || THEME_DEFAULT.bg3;
      const text = t.text || THEME_DEFAULT.text;
      const soft = t.soft || THEME_DEFAULT.soft;
      const fh   = t.fontHeading || THEME_DEFAULT.fontHeading;
      const fb   = t.fontBody    || THEME_DEFAULT.fontBody;
      const tealDk  = darkenHex(teal, 30);
      const tealLt  = lightenHex(teal, 30);
      const bg4     = lightenHex(bg3, 8);
      const muted   = darkenHex(soft, 40);
      // Adaptive vars based on bg luminance
      const bgR = parseInt(bg.slice(1,3),16);
      const bgG = parseInt(bg.slice(3,5),16);
      const bgB = parseInt(bg.slice(5,7),16);
      const lum = 0.2126*bgR/255 + 0.7152*bgG/255 + 0.0722*bgB/255;
      const isLight = lum > 0.5;
      const heading = t.heading || (isLight ? '#111111' : '#f0f4f8');
      const border     = isLight ? 'rgba(0,0,0,.10)'  : 'rgba(255,255,255,.07)';
      const borderSoft = isLight ? 'rgba(0,0,0,.16)'  : 'rgba(255,255,255,.11)';
      const navColor = t.navColor || bg;
      const navR = parseInt(navColor.slice(1,3),16);
      const navG = parseInt(navColor.slice(3,5),16);
      const navB = parseInt(navColor.slice(5,7),16);
      const navLum = 0.2126*navR/255 + 0.7152*navG/255 + 0.0722*navB/255;
      const navIsLight = navLum > 0.5;
      const navText  = t.navText  || (navIsLight ? '#111111' : '#ffffff');
      const navPhone = t.navPhone || (navIsLight ? '#111111' : '#ffffff');
      const navBurger = t.navBurger || (navIsLight ? '#111111' : '#ffffff');
      const navBg      = `rgba(${navR},${navG},${navB},.92)`;
      const navBgSolid = `rgba(${navR},${navG},${navB},.97)`;
      const hG = (a) => `rgba(${bgR},${bgG},${bgB},${a})`;
      const heroGrad    = `linear-gradient(105deg,${hG(.97)} 0%,${hG(.90)} 35%,${hG(.72)} 60%,${hG(.45)} 100%)`;
      const heroGradMob = `linear-gradient(180deg,${hG(.82)} 0%,${hG(.75)} 50%,${hG(.92)} 100%)`;
      const heroGradXs  = `linear-gradient(180deg,${hG(.88)} 0%,${hG(.72)} 55%,${hG(.95)} 100%)`;
      const fonts = [...new Set([FONT_GOOGLE_MAP[fh], FONT_GOOGLE_MAP[fb]].filter(Boolean))];
      const importUrl = fonts.length ? `@import url('https://fonts.googleapis.com/css2?family=${fonts.join('&family=')}&display=swap');\n` : '';
      return `${importUrl}:root{` +
        `--teal:${teal};--teal-dk:${tealDk};--teal-lt:${tealLt};` +
        `--teal-dim:${hexToRgba(teal,.08)};--teal-glow:${hexToRgba(teal,.18)};--teal-border:${hexToRgba(teal,.30)};` +
        `--bg:${bg};--bg2:${bg2};--bg3:${bg3};--bg4:${bg4};` +
        `--text:${text};--soft:${soft};--muted:${muted};--heading:${heading};` +
        `--border:${border};--border-soft:${borderSoft};` +
        `--nav-bg:${navBg};--nav-bg-solid:${navBgSolid};--nav-text:${navText};--nav-phone:${navPhone};--nav-burger:${navBurger};` +
        `--hero-grad:${heroGrad};--hero-grad-mob:${heroGradMob};--hero-grad-xs:${heroGradXs};` +
        `--font-heading:'${fh}',sans-serif;--font-body:'${fb}',sans-serif}` +
        `body{font-family:'${fb}',sans-serif!important}` +
        `h1,h2,h3,h4,h5,h6,.logo,.hero h1,.section-title,.card-title{font-family:'${fh}',sans-serif!important}` +
        `.nav-phone{color:${navPhone}!important}.hamburger span{background:${navBurger}!important}`;
    }

    if (path === '/theme.css') {
      try {
        const raw = await env.PROGRAMARI.get('__theme__');
        let t = raw ? JSON.parse(raw) : THEME_DEFAULT;
        // Ensure missing keys get defaults
        if (!t.text)    t.text    = THEME_DEFAULT.text;
        if (!t.soft)    t.soft    = THEME_DEFAULT.soft;
        if (!t.heading) t.heading = THEME_DEFAULT.heading;
        if (!raw) await env.PROGRAMARI.put('__theme__', JSON.stringify(t));
        const css = buildThemeCss(t);
        return new Response(css, { headers: { 'Content-Type': 'text/css;charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
      } catch { return new Response('', { headers: { 'Content-Type': 'text/css' } }); }
    }

    if (path === '/api/theme' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__theme__');
        return json(raw ? JSON.parse(raw) : THEME_DEFAULT);
      } catch { return json(THEME_DEFAULT); }
    }

    if (path === '/api/theme' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__theme__', JSON.stringify(body));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── LAYOUT (section order per page) ──────────────────────


    const LAYOUT_DEFAULTS = {
      index: ['hero','carousel','showcase','services','portfolio','about','testimonials','contact'],
      'web-design-bucuresti': ['hero','trust','services','portfolio','process','contact'],
      'web-design-cluj':      ['hero','trust','services','portfolio','process','contact'],
      'web-design-timisoara': ['hero','trust','services','portfolio','process','contact'],
      'web-design-auto':      ['hero','trust','services','portfolio','process','contact'],
      'web-design-restaurante':['hero','trust','services','portfolio','process','contact'],
      'web-design-afaceri-mici':['hero','trust','services','portfolio','process','contact'],
    };

    const LAYOUT_LABELS = {
      hero:'Hero principal', carousel:'Banner carousel', showcase:'Device showcase',
      services:'Servicii (teaser)', about:'Strip despre noi', startup:'Strip pachet startup',
      industries:'Industrii', process:'Procesul nostru', portfolio:'Portofoliu',
      testimonials:'Testimoniale', contact:'CTA final (contact)', trust:'Trust / statistici',
    };

    if (path.startsWith('/api/layout/') && request.method === 'GET') {
      const page = path.replace('/api/layout/','');
      if (!LAYOUT_DEFAULTS[page]) return json({ error: 'Pagină necunoscută' }, 404);
      try {
        const raw = await env.PROGRAMARI.get('__layout__' + page);
        const stored = raw ? JSON.parse(raw) : {};
        const normalized = Array.isArray(stored) ? { order: stored } : stored;
        return json({
          order:  normalized.order  || LAYOUT_DEFAULTS[page],
          hidden: normalized.hidden || [],
          blocks: normalized.blocks || {},
          labels: LAYOUT_LABELS,
          default: LAYOUT_DEFAULTS[page]
        });
      } catch { return json({ order: LAYOUT_DEFAULTS[page], hidden: [], blocks: {}, labels: LAYOUT_LABELS, default: LAYOUT_DEFAULTS[page] }); }
    }

    if (path.startsWith('/api/layout/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      const page = path.replace('/api/layout/','');
      if (!LAYOUT_DEFAULTS[page]) return json({ error: 'Pagină necunoscută' }, 404);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__layout__' + page, JSON.stringify({
          order:  body.order  || [],
          hidden: body.hidden || [],
          blocks: body.blocks || {}
        }));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── CONȚINUT EDITABIL (API admin) ─────────────────────────

    if (path.startsWith('/api/content/') && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      const page = path.replace('/api/content/', '');
      if (!CONTENT_PAGES[page]) return json({ error: 'Pagină necunoscută' }, 404);
      try {
        const assetUrl = new URL(request.url);
        assetUrl.pathname = CONTENT_PAGES[page];
        const resp = await env.ASSETS.fetch(new Request(assetUrl.toString()));
        const fields = extractContentFields(await resp.text());
        const raw = await env.PROGRAMARI.get('__content__' + page);
        const overrides = raw ? JSON.parse(raw) : {};
        for (const f of fields) f.value = overrides[f.key] || '';
        return json({ fields });
      } catch { return json({ error: 'Eroare' }, 500); }
    }

    if (path.startsWith('/api/content/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      const page = path.replace('/api/content/', '');
      if (!CONTENT_PAGES[page]) return json({ error: 'Pagină necunoscută' }, 404);
      try {
        const body = await request.json();
        const clean = {};
        let n = 0;
        for (const [k, v] of Object.entries(body.overrides || {})) {
          if (typeof v !== 'string' || !v.trim()) continue;
          if (++n > 500) break;
          clean[String(k).slice(0, 100)] = v.trim().slice(0, 4000);
        }
        await env.PROGRAMARI.put('__content__' + page, JSON.stringify(clean));
        return json({ success: true, saved: Object.keys(clean).length });
      } catch { return json({ error: 'Eroare' }, 500); }
    }

    // ── SITE SETTINGS (hero image etc.) ──────────────────────
    if (path === '/api/site-settings' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__site_settings__');
        return json(raw ? JSON.parse(raw) : {});
      } catch { return json({}); }
    }
    if (path === '/api/site-settings' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__site_settings__');
        const existing = raw ? JSON.parse(raw) : {};
        const body = await request.json();
        const updated = Object.assign({}, existing, body);
        await env.PROGRAMARI.put('__site_settings__', JSON.stringify(updated));
        return json({ success: true });
      } catch { return json({ error: 'Eroare' }, 500); }
    }

    // ── MAINTENANCE API ───────────────────────────────────────
    if (path === '/api/maintenance' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__maintenance__');
        return json(raw ? JSON.parse(raw) : { enabled: false, title: '', message: '', date: '' });
      } catch { return json({ error: 'Eroare' }, 500); }
    }
    if (path === '/api/maintenance' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__maintenance__', JSON.stringify({
          enabled: !!body.enabled,
          title:   String(body.title   || 'Site în construcție').slice(0, 120),
          message: String(body.message || 'Revenim în curând cu ceva nou!').slice(0, 400),
          date:    String(body.date    || '').slice(0, 60),
        }));
        return json({ success: true });
      } catch { return json({ error: 'Eroare' }, 500); }
    }

    // ── CHAT ECHIPA AI (Cloudflare Workers AI — gratuit, fără cheie API) ──
    if (path === '/api/agent-chat' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      if (!env.AI) return json({ error: 'Workers AI nu este activat. Adaugă binding-ul AI în Cloudflare Pages → Settings → Functions → AI bindings (variabila AI).' }, 503);
      try {
        const body = await request.json();
        const persona = AGENT_PERSONAS[String(body.agent || '')];
        if (!persona) return json({ error: 'Agent necunoscut' }, 400);
        const userMsgs = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
        const system = 'Ești ' + persona.label + ', parte din echipa agenției de web design C Design din România. Rolul tău: ' + persona.role
          + ' Răspunzi MEREU în limba română, concis, prietenos și la obiect, rămânând în rolul tău. Dacă întrebarea nu ține de expertiza ta, spui scurt asta și sugerezi ce coleg din echipă ar fi mai potrivit.';
        const messages = [{ role: 'system', content: system }];
        for (const m of userMsgs) {
          if (m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string') {
            messages.push({ role: m.role, content: m.content.slice(0, 4000) });
          }
        }
        const out = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', { messages, max_tokens: 800 });
        const reply = (out && (out.response || out.result)) || '';
        return json({ reply: String(reply).trim() || 'Nu am putut genera un răspuns.' });
      } catch (e) { return json({ error: 'Eroare: ' + String((e && e.message) || e) }, 500); }
    }

    // Asistent virtual public (chat pe site) — Workers AI, fără auth, rate-limited.
    // Răspunde vizitatorilor despre servicii și îi îndrumă spre o ofertă/contact.
    if (path === '/api/assistant' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const ok = await checkRateLimit(env, 'assistant_' + ip, 40, 3600);
      if (!ok) return json({ reply: 'Ai trimis multe mesaje într-un timp scurt. Hai să discutăm direct: sună la 0753 116 155 sau scrie la office@c-design.ro. 🙂' }, 200, request);
      const FALLBACK = 'Cel mai simplu e să discutăm direct — programează o consultanță gratuită pe pagina de Programare, sună la 0753 116 155 sau scrie la office@c-design.ro și îți facem o ofertă fixă, fără costuri ascunse.';
      if (!env.AI) return json({ reply: FALLBACK }, 200, request);
      const body0 = await request.json().catch(() => ({}));
      const validEmail = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
      const convId = String((body0 && body0.id) || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || (crypto.randomUUID ? crypto.randomUUID() : 'c' + Date.now() + Math.random().toString(36).slice(2));
      const email = String((body0 && body0.email) || '').trim().slice(0, 160);
      // Salvează conversația în KV (lead), când avem un email valid.
      // La primul mesaj al unei conversații noi: notificare email + intrare CRM.
      async function logConv(userText, replyText) {
        if (!email || !validEmail(email)) return;
        try {
          const key = 'chat:' + convId;
          let conv = await env.PROGRAMARI.get(key, 'json');
          const isNew = !conv || typeof conv !== 'object';
          if (isNew) conv = { id: convId, email, createdAt: Date.now(), ip, messages: [] };
          conv.email = email;
          conv.updatedAt = Date.now();
          if (userText) conv.messages.push({ role: 'user', content: String(userText).slice(0, 1500), ts: Date.now() });
          if (replyText) conv.messages.push({ role: 'assistant', content: String(replyText).slice(0, 2000), ts: Date.now() });
          if (conv.messages.length > 120) conv.messages = conv.messages.slice(-120);
          if (isNew) conv.status = 'nou';
          const lastUser = [...conv.messages].reverse().find(m => m.role === 'user');
          const meta = { email, updatedAt: conv.updatedAt, count: conv.messages.length, preview: (lastUser ? lastUser.content : '').slice(0, 90), status: conv.status || 'nou' };
          await env.PROGRAMARI.put(key, JSON.stringify(conv), { metadata: meta });
          if (isNew) {
            const firstMsg = userText ? String(userText).slice(0, 500) : '';
            // 1) Notificare email către agenție
            try {
              const apiKey = env.RESEND_API_KEY || RESEND_API_KEY;
              if (apiKey) {
                await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    from: 'C Design <notificari@c-design.ro>',
                    to: [env.NOTIFY_EMAIL || NOTIFY_EMAIL],
                    reply_to: email,
                    subject: '💬 Lead nou din chat AI: ' + email,
                    html: '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">'
                      + '<h2 style="color:#0e1f1c;">Lead nou din asistentul de pe site</h2>'
                      + '<p><strong>Email:</strong> <a href="mailto:' + email + '">' + email + '</a></p>'
                      + (firstMsg ? '<p><strong>Primul mesaj:</strong><br>' + firstMsg.replace(/</g, '&lt;') + '</p>' : '')
                      + '<p style="margin-top:18px;"><a href="https://www.c-design.ro/programari.html" style="background:#00a8a8;color:#fff;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:700;">Vezi conversația în admin → Chat AI</a></p>'
                      + '<p style="color:#9aa5b4;font-size:.8rem;margin-top:18px;">c-design.ro · 0753 116 155</p></div>',
                  }),
                });
              }
            } catch (e) {}
            // 2) Intrare CRM (cu dedup după email)
            try {
              const raw = await env.PROGRAMARI.get('__crm__');
              const entries = raw ? JSON.parse(raw) : [];
              const exists = entries.some(en => (en.client && en.client.toLowerCase() === email.toLowerCase()) || (en.note && en.note.toLowerCase().includes(email.toLowerCase())));
              if (!exists) {
                const cid = 'crm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
                entries.unshift({ id: cid, client: email, proiect: 'Lead din chat AI', valoare: '', termen: '', status: 'oferta', note: 'Lead automat din asistentul de pe site.' + (firstMsg ? ' Primul mesaj: ' + firstMsg : ''), createdAt: new Date().toISOString() });
                await env.PROGRAMARI.put('__crm__', JSON.stringify(entries));
              }
            } catch (e) {}
          }
        } catch (e) {}
      }
      try {
        const userMsgs = Array.isArray(body0.messages) ? body0.messages.slice(-10) : [];
        const lastUserMsg = [...userMsgs].reverse().find(m => m && m.role === 'user' && typeof m.content === 'string');
        const system = 'Ești asistentul virtual al C Design, o agenție de web design din Ilfov și București, care lucrează cu clienți din toată România. '
          + 'Rolul tău: ajuți vizitatorii cu informații despre servicii și îi îndrumi cu căldură să ne contacteze pentru o ofertă personalizată gratuită. '
          + 'SERVICII: Site de prezentare (livrat în maxim 14 zile, garantat; domeniu .ro și găzduire incluse; mobile-first; SEO de bază inclus). '
          + 'Redesign site (modernizare + viteză, fără pierderea poziției pe Google). Design grafic & logo (identitate vizuală). Mentenanță (actualizări, securitate, suport). '
          + 'Pachet Startup: site + logo + prezență online, de la 300€. Experiență din 2017. '
          + 'REGULI: răspunzi MEREU în limba română, scurt (2-4 propoziții), prietenos, fără jargon tehnic. '
          + 'NU inventa prețuri exacte (singura cifră permisă: „de la 300€" pentru Pachetul Startup) — explică faptul că prețul e fix și se stabilește printr-o consultanță gratuită, în funcție de nevoi. '
          + 'Când e potrivit, îndrumă spre acțiune: „programează o consultanță gratuită" (pagina de Programare), sună la 0753 116 155 sau scrie la office@c-design.ro. '
          + 'Dacă întrebarea nu ține de web design sau de serviciile noastre, răspunzi scurt și politicos și revii la cum putem ajuta cu site-ul. Nu promite lucruri pe care agenția nu le oferă.';
        const messages = [{ role: 'system', content: system }];
        for (const m of userMsgs) {
          if (m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string') {
            messages.push({ role: m.role, content: m.content.slice(0, 1500) });
          }
        }
        if (messages.length === 1) {
          return json({ reply: 'Salut! 👋 Sunt asistentul C Design. Cu ce te pot ajuta — un site nou, un redesign sau o ofertă pentru afacerea ta?', id: convId }, 200, request);
        }
        const out = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', { messages, max_tokens: 400 });
        const reply = (String((out && (out.response || out.result)) || '').trim()) || FALLBACK;
        await logConv(lastUserMsg ? lastUserMsg.content : '', reply);
        return json({ reply, id: convId }, 200, request);
      } catch (e) {
        return json({ reply: FALLBACK, id: convId }, 200, request);
      }
    }

    // Conversații asistent (admin) — listă lead-uri din chat
    if (path === '/api/conversations' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const out = [];
        let cursor;
        do {
          const list = await env.PROGRAMARI.list({ prefix: 'chat:', limit: 1000, cursor });
          for (const k of list.keys) out.push({ id: k.name.slice(5), ...(k.metadata || {}) });
          cursor = list.list_complete ? null : list.cursor;
        } while (cursor);
        out.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        return json({ conversations: out }, 200, request);
      } catch (e) { return json({ error: 'Eroare: ' + String((e && e.message) || e) }, 500, request); }
    }

    // Conversație asistent (admin) — transcript complet / ștergere
    if (path.startsWith('/api/conversation/')) {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      const cid = path.slice('/api/conversation/'.length).replace(/[^a-zA-Z0-9_-]/g, '');
      if (!cid) return json({ error: 'ID invalid' }, 400);
      if (request.method === 'GET') {
        const conv = await env.PROGRAMARI.get('chat:' + cid, 'json');
        if (!conv) return json({ error: 'Conversație negăsită' }, 404, request);
        return json({ conversation: conv }, 200, request);
      }
      if (request.method === 'PUT') {
        const conv = await env.PROGRAMARI.get('chat:' + cid, 'json');
        if (!conv) return json({ error: 'Conversație negăsită' }, 404, request);
        const upd = await request.json().catch(() => ({}));
        if (typeof upd.status === 'string') conv.status = upd.status.slice(0, 20);
        const lastUser = [...(conv.messages || [])].reverse().find(m => m.role === 'user');
        const meta = { email: conv.email || '', updatedAt: conv.updatedAt || Date.now(), count: (conv.messages || []).length, preview: (lastUser ? lastUser.content : '').slice(0, 90), status: conv.status || 'nou' };
        await env.PROGRAMARI.put('chat:' + cid, JSON.stringify(conv), { metadata: meta });
        return json({ ok: true }, 200, request);
      }
      if (request.method === 'DELETE') {
        await env.PROGRAMARI.delete('chat:' + cid);
        return json({ ok: true }, 200, request);
      }
    }

    // Lead-uri publice din formulare (concurs, promo, cere-ofertă, contact)
    // → salvate ca mesaje în admin (tab Mesaje) + notificare email.
    if (path === '/api/messages' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const allowed = await checkRateLimit(env, 'msgpost_' + ip, 8, 3600);
      if (!allowed) return json({ error: 'Prea multe cereri. Reîncearcă mai târziu.' }, 429, request);
      try {
        const b = await request.json().catch(() => ({}));
        const name = String(b.name || '').trim();
        const phone = String(b.phone || '').trim();
        const email = String(b.email || '').trim();
        const service = String(b.service || 'Formular').trim();
        const message = String(b.message || '').trim();
        if (!name || !message || (!phone && !email)) return json({ error: 'Câmpuri obligatorii lipsă' }, 400);
        const mid = 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        const rec = { id: mid, name: name.slice(0, 120), phone: phone.slice(0, 40), email: email.slice(0, 160), service: service.slice(0, 80), message: message.slice(0, 5000), createdAt: Date.now(), status: 'nou', ip };
        try {
          await env.PROGRAMARI.put('msg:' + mid, JSON.stringify(rec), { metadata: { name: rec.name, email: rec.email, createdAt: rec.createdAt, status: 'nou', preview: (service + ' — ' + message).replace(/\n/g, ' ').slice(0, 90) } });
        } catch (e) {}
        try { await sendContactNotification({ name: rec.name, phone: rec.phone || '-', email: rec.email || '-', service: rec.service, message: rec.message }, env); } catch (e) {}
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // Mesaje contact (admin) — listă
    if (path === '/api/messages' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const out = [];
        let cursor;
        do {
          const list = await env.PROGRAMARI.list({ prefix: 'msg:', limit: 1000, cursor });
          for (const k of list.keys) out.push({ id: k.name.slice(4), ...(k.metadata || {}) });
          cursor = list.list_complete ? null : list.cursor;
        } while (cursor);
        out.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        return json({ messages: out }, 200, request);
      } catch (e) { return json({ error: 'Eroare: ' + String((e && e.message) || e) }, 500, request); }
    }

    // Mesaj contact (admin) — detaliu / status / ștergere
    if (path.startsWith('/api/message/')) {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      const mid = path.slice('/api/message/'.length).replace(/[^a-zA-Z0-9_-]/g, '');
      if (!mid) return json({ error: 'ID invalid' }, 400);
      if (request.method === 'GET') {
        const rec = await env.PROGRAMARI.get('msg:' + mid, 'json');
        if (!rec) return json({ error: 'Mesaj negăsit' }, 404, request);
        return json({ message: rec }, 200, request);
      }
      if (request.method === 'PUT') {
        const rec = await env.PROGRAMARI.get('msg:' + mid, 'json');
        if (!rec) return json({ error: 'Mesaj negăsit' }, 404, request);
        const upd = await request.json().catch(() => ({}));
        if (typeof upd.status === 'string') rec.status = upd.status.slice(0, 20);
        await env.PROGRAMARI.put('msg:' + mid, JSON.stringify(rec), { metadata: { name: rec.name || '', email: rec.email || '', createdAt: rec.createdAt || Date.now(), status: rec.status || 'nou', preview: String(rec.message || '').slice(0, 90) } });
        return json({ ok: true }, 200, request);
      }
      if (request.method === 'DELETE') {
        await env.PROGRAMARI.delete('msg:' + mid);
        return json({ ok: true }, 200, request);
      }
    }

    // Google Search Console (admin) — performanță din ultimele 28 zile
    if (path === '/api/gsc' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      if (!env.GSC_SA_KEY) return json({ configured: false }, 200, request);
      try {
        const site = env.GSC_SITE_URL || 'https://www.c-design.ro/';
        const token = await gscAccessToken(env);
        const end = new Date(Date.now() - 3 * 86400000);
        const start = new Date(end.getTime() - 27 * 86400000);
        const startDate = gscDateStr(start), endDate = gscDateStr(end);
        const [totalsRows, queryRows, pageRows] = await Promise.all([
          gscQuery(token, site, { startDate, endDate }),
          gscQuery(token, site, { startDate, endDate, dimensions: ['query'], rowLimit: 25 }),
          gscQuery(token, site, { startDate, endDate, dimensions: ['page'], rowLimit: 25 }),
        ]);
        const t = totalsRows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
        return json({
          configured: true,
          site,
          range: { startDate, endDate },
          totals: { clicks: t.clicks || 0, impressions: t.impressions || 0, ctr: t.ctr || 0, position: t.position || 0 },
          queries: queryRows.map(r => ({ q: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })),
          pages: pageRows.map(r => ({ url: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })),
        }, 200, request);
      } catch (e) {
        return json({ configured: true, error: String((e && e.message) || e) }, 200, request);
      }
    }

    // Media upload — cu ?name=<fișier existent> suprascrie imaginea în loc
    // (folosit de optimizarea din admin: referințele /media/ rămân valabile)
    if (path === '/api/media' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const ct = request.headers.get('Content-Type') || '';
        const isImg = ct.startsWith('image/');
        const isVid = ct.startsWith('video/');
        if (!isImg && !isVid) return json({ error: 'Doar imagini sau video acceptate' }, 400);
        const buf = await request.arrayBuffer();
        const maxBytes = isVid ? 24 * 1024 * 1024 : 5 * 1024 * 1024;
        if (buf.byteLength > maxBytes) return json({ error: isVid ? 'Video prea mare (max 24MB). Comprimă-l sau folosește un clip mai scurt.' : 'Imagine prea mare (max 5MB)' }, 400);
        const overwrite = url.searchParams.get('name') || '';
        let filename;
        if (overwrite) {
          if (!/^[A-Za-z0-9._-]+$/.test(overwrite)) return json({ error: 'Nume invalid' }, 400);
          const existing = await env.PROGRAMARI.get('__media__' + overwrite);
          if (existing === null) return json({ error: 'Fișierul nu există' }, 404);
          filename = overwrite;
        } else {
          let ext;
          if (isVid) ext = ct.includes('webm') ? 'webm' : ct.includes('ogg') ? 'ogv' : ct.includes('quicktime') ? 'mov' : 'mp4';
          else ext = ct.includes('png') ? 'png' : ct.includes('gif') ? 'gif' : ct.includes('webp') ? 'webp' : 'jpg';
          filename = 'media_' + Date.now() + '.' + ext;
        }
        await env.PROGRAMARI.put('__media__' + filename, buf, { metadata: { ct } });
        return json({ url: '/media/' + filename, filename });
      } catch { return json({ error: 'Eroare la upload' }, 500); }
    }

    if (path.startsWith('/media/') && request.method === 'GET') {
      const filename = path.replace('/media/', '');
      if (!filename || filename.includes('..')) return new Response('Not found', { status: 404 });
      try {
        const obj = await env.PROGRAMARI.getWithMetadata('__media__' + filename, { type: 'arrayBuffer' });
        if (!obj.value) return new Response('Not found', { status: 404 });
        const ct = (obj.metadata && obj.metadata.ct) || 'image/jpeg';
        return new Response(obj.value, {
          headers: { 'Content-Type': ct, 'Cache-Control': 'public, max-age=31536000', ...getCors(request) }
        });
      } catch { return new Response('Eroare', { status: 500 }); }
    }

    // Raport utilizare media: unde e folosită fiecare imagine pe site
    if (path === '/api/media/usage' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const usage = await collectMediaUsage(env, Object.keys(LAYOUT_DEFAULTS));
        return json({ usage });
      } catch { return json({ error: 'Eroare' }, 500); }
    }

    // Curățare referințe moarte: elimină din conținut (setări, blocuri, blog)
    // referințele către imagini /media/ care nu mai există în KV → fix 404
    if (path === '/api/media/clean-refs' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const list = await env.PROGRAMARI.list({ prefix: '__media__' });
        const existing = new Set(list.keys.map(k => k.name.replace('__media__', '')));
        const isDead = (u) => {
          const m = String(u).match(/\/media\/([A-Za-z0-9._-]+)/);
          return m ? !existing.has(m[1]) : false;
        };
        const report = [];

        // 1. Setări site (hero desktop/mobil etc.)
        try {
          const raw = await env.PROGRAMARI.get('__site_settings__');
          if (raw) {
            const s = JSON.parse(raw);
            let changed = false;
            for (const k of Object.keys(s)) {
              if (typeof s[k] === 'string' && s[k].includes('/media/') && isDead(s[k])) {
                report.push('Setări site: golit câmpul "' + k + '" (' + s[k] + ')');
                delete s[k];
                changed = true;
              }
            }
            if (changed) await env.PROGRAMARI.put('__site_settings__', JSON.stringify(s));
          }
        } catch {}

        // 2. Blocuri custom din layout-uri (imagini, bannere)
        const cleanNode = (node, loc) => {
          if (Array.isArray(node)) {
            for (let i = node.length - 1; i >= 0; i--) {
              const it = node[i];
              if (it && typeof it === 'object' && !Array.isArray(it) && it.type === 'image'
                  && typeof it.src === 'string' && it.src.includes('/media/') && isDead(it.src)) {
                report.push(loc + ': element imagine eliminat (' + it.src + ')');
                node.splice(i, 1);
                continue;
              }
              cleanNode(it, loc);
            }
          } else if (node && typeof node === 'object') {
            for (const k of Object.keys(node)) {
              const v = node[k];
              if (typeof v === 'string' && v.includes('/media/') && isDead(v)) {
                report.push(loc + ': golit câmpul "' + k + '" (' + v + ')');
                delete node[k];
              } else {
                cleanNode(v, loc);
              }
            }
          }
        };
        for (const page of Object.keys(LAYOUT_DEFAULTS)) {
          try {
            const raw = await env.PROGRAMARI.get('__layout__' + page);
            if (!raw) continue;
            const layout = JSON.parse(raw);
            const before = report.length;
            cleanNode(layout.blocks || layout, 'Blocuri "' + page + '"');
            if (report.length > before) await env.PROGRAMARI.put('__layout__' + page, JSON.stringify(layout));
          } catch {}
        }

        // 3. Articole blog: elimină tag-urile <img> cu src inexistent
        try {
          const raw = await env.PROGRAMARI.get('__blog__');
          if (raw) {
            const posts = JSON.parse(raw);
            let changed = false;
            for (const p of posts) {
              if (typeof p.content !== 'string') continue;
              p.content = p.content.replace(/<img\b[^>]*>/gi, (tag) => {
                const m = tag.match(/src\s*=\s*["']([^"']+)["']/i);
                if (m && m[1].includes('/media/') && isDead(m[1])) {
                  report.push('Blog "' + (p.title || p.slug) + '": imagine eliminată (' + m[1] + ')');
                  changed = true;
                  return '';
                }
                return tag;
              });
            }
            if (changed) await env.PROGRAMARI.put('__blog__', JSON.stringify(posts));
          }
        } catch {}

        return json({ success: true, cleaned: report.length, report });
      } catch { return json({ error: 'Eroare la curățare' }, 500); }
    }

    if (path.startsWith('/api/media') && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const list = await env.PROGRAMARI.list({ prefix: '__media__' });
        const files = list.keys.map(k => ({
          filename: k.name.replace('__media__', ''),
          url: '/media/' + k.name.replace('__media__', ''),
          ct: k.metadata?.ct || 'image/*',
          ts: parseInt((k.name.match(/(\d+)\./) || [])[1] || '0')
        }));
        files.sort((a, b) => b.ts - a.ts);
        return json({ files });
      } catch { return json({ error: 'Eroare' }, 500); }
    }

    if (path.startsWith('/api/media/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      const filename = path.replace('/api/media/', '');
      try {
        // Blocăm ștergerea imaginilor încă folosite pe site (previne 404-uri).
        // Ștergerea forțată se face explicit cu ?force=1.
        if (url.searchParams.get('force') !== '1') {
          const usage = await collectMediaUsage(env, Object.keys(LAYOUT_DEFAULTS));
          if (usage[filename] && usage[filename].length) {
            return json({ error: 'Imaginea este folosită pe site', inUse: true, locations: usage[filename] }, 409);
          }
        }
        await env.PROGRAMARI.delete('__media__' + filename);
        return json({ success: true });
      } catch { return json({ error: 'Eroare' }, 500); }
    }

    // ── SERVICII (catalog pentru oferte) ─────────────────────

    if (path === '/api/servicii' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__servicii__');
        // Servicii noi adăugate după seed inițial — migrare automată
        const migrations = [
          { id:'svc_d17', nume:'Integrare Google Search Console', descriere:'Verificare proprietate, sitemap XML, conectare Google Analytics, raport erori indexare', pret:120, moneda:'EUR', unitate:'proiect', categorie:'seo' },
        ];
        if (raw !== null) {
          const lista = JSON.parse(raw);
          const ids = new Set(lista.map(s => s.id));
          const toAdd = migrations.filter(m => !ids.has(m.id));
          if (toAdd.length) {
            const updated = [...lista, ...toAdd];
            await env.PROGRAMARI.put('__servicii__', JSON.stringify(updated));
            return json(updated);
          }
          return json(lista);
        }
        // Prima accesare — seed cu servicii tipice agenție web design România
        const defaults = [
          { id:'svc_d01', nume:'Site de Prezentare', descriere:'5 pagini, design responsiv, CMS, Google Analytics, SEO de bază', pret:899, moneda:'EUR', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d02', nume:'Site de Prezentare Premium', descriere:'10+ pagini, design custom, blog, multilingv, integrări API', pret:1800, moneda:'EUR', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d03', nume:'Magazin Online (eCommerce)', descriere:'WooCommerce / Shopify, catalog produse, plăți online, livrare', pret:2500, moneda:'EUR', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d04', nume:'Landing Page', descriere:'Pagină de conversie optimizată, A/B testing, integrare formulare', pret:450, moneda:'EUR', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d05', nume:'Redesign Site Existent', descriere:'Redesign complet cu păstrarea conținutului, migrare date, SEO redirect', pret:700, moneda:'EUR', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d06', nume:'Audit SEO Complet', descriere:'Analiză tehnică, cuvinte cheie, concurență, raport cu recomandări', pret:300, moneda:'EUR', unitate:'proiect', categorie:'seo' },
          { id:'svc_d07', nume:'SEO Lunar (Ongoing)', descriere:'Optimizare continuă, content, link building, raport lunar, 15-25 keywords', pret:400, moneda:'EUR', unitate:'lună', categorie:'seo' },
          { id:'svc_d08', nume:'SEO Local (Google Maps)', descriere:'Optimizare Google Business Profile, local citations, recenzii', pret:250, moneda:'EUR', unitate:'lună', categorie:'seo' },
          { id:'svc_d09', nume:'Management Google Ads', descriere:'Setup + optimizare campanii Search/Display/Shopping, raport lunar', pret:350, moneda:'EUR', unitate:'lună', categorie:'marketing' },
          { id:'svc_d10', nume:'Management Meta Ads', descriere:'Campanii Facebook & Instagram, A/B testing, retargeting, raport lunar', pret:350, moneda:'EUR', unitate:'lună', categorie:'marketing' },
          { id:'svc_d11', nume:'Administrare Social Media', descriere:'12 postări/lună, copywriting, grafică branded, monitorizare comunitate', pret:300, moneda:'EUR', unitate:'lună', categorie:'marketing' },
          { id:'svc_d12', nume:'Email Marketing / Newsletter', descriere:'Design template, segmentare listă, trimitere campanii, raport deschideri', pret:200, moneda:'EUR', unitate:'lună', categorie:'marketing' },
          { id:'svc_d13', nume:'Mentenanță Site Bază', descriere:'Actualizări CMS & plugin-uri, backup lunar, monitoring uptime, 1h suport', pret:100, moneda:'EUR', unitate:'lună', categorie:'mentenanta' },
          { id:'svc_d14', nume:'Mentenanță Site Avansat', descriere:'Actualizări, backup săptămânal, securitate, 4h modificări/lună, raport', pret:200, moneda:'EUR', unitate:'lună', categorie:'mentenanta' },
          { id:'svc_d15', nume:'Logo Design', descriere:'3 variante de concept, fișiere vectoriale finale (AI, SVG, PNG, PDF)', pret:350, moneda:'EUR', unitate:'proiect', categorie:'grafic' },
          { id:'svc_d16', nume:'Identitate Vizuală Completă', descriere:'Logo + paletă culori + fonturi + business card + antet + ghid brand', pret:800, moneda:'EUR', unitate:'proiect', categorie:'grafic' },
          ...migrations,
        ];
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(defaults));
        return json(defaults);
      } catch { return json([]); }
    }

    if (path === '/api/servicii' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const body = await request.json();
        if (!body.nume || body.pret === undefined) return json({ error: 'Câmpuri obligatorii lipsă' }, 400);
        const raw = await env.PROGRAMARI.get('__servicii__');
        const lista = raw ? JSON.parse(raw) : [];
        const svc = {
          id: 'svc_' + Date.now(),
          nume: String(body.nume).slice(0, 120),
          descriere: String(body.descriere || '').slice(0, 300),
          pret: parseFloat(body.pret) || 0,
          moneda: ['EUR', 'RON'].includes(body.moneda) ? body.moneda : 'EUR',
          unitate: ['proiect', 'lună', 'oră', 'pagină', 'an'].includes(body.unitate) ? body.unitate : 'proiect',
          categorie: ['web-design', 'seo', 'mentenanta', 'grafic', 'marketing', 'altele'].includes(body.categorie) ? body.categorie : 'altele',
        };
        lista.push(svc);
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(lista));
        return json(svc);
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/servicii/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      const id = path.replace('/api/servicii/', '');
      try {
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__servicii__');
        const lista = raw ? JSON.parse(raw) : [];
        const idx = lista.findIndex(s => s.id === id);
        if (idx === -1) return json({ error: 'Serviciu negăsit' }, 404);
        lista[idx] = {
          ...lista[idx],
          ...(body.nume !== undefined && { nume: String(body.nume).slice(0, 120) }),
          ...(body.descriere !== undefined && { descriere: String(body.descriere).slice(0, 300) }),
          ...(body.pret !== undefined && { pret: parseFloat(body.pret) || 0 }),
          ...(body.moneda && ['EUR', 'RON'].includes(body.moneda) && { moneda: body.moneda }),
          ...(body.unitate && ['proiect','lună','oră','pagină','an'].includes(body.unitate) && { unitate: body.unitate }),
          ...(body.categorie && { categorie: body.categorie }),
        };
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(lista));
        return json(lista[idx]);
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    if (path.startsWith('/api/servicii/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      const id = path.replace('/api/servicii/', '');
      try {
        const raw = await env.PROGRAMARI.get('__servicii__');
        const lista = raw ? JSON.parse(raw) : [];
        const filtered = lista.filter(s => s.id !== id);
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(filtered));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── OFERTE ───────────────────────────────────────────────

    if (path === '/api/oferte' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__oferte__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json([]); }
    }

    if (path === '/api/oferte' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const body = await request.json();
        if (!body.client?.name || !body.servicii?.length) return json({ error: 'Date incomplete' }, 400);
        const raw = await env.PROGRAMARI.get('__oferte__');
        const lista = raw ? JSON.parse(raw) : [];
        const yr = new Date().getFullYear();
        const nrSeq = String(lista.filter(o => (o.createdAt || '').startsWith(String(yr))).length + 1).padStart(3, '0');
        const oferta = {
          id: 'off_' + Date.now(),
          numar: `OFF-${yr}-${nrSeq}`,
          createdAt: new Date().toISOString(),
          client: {
            id: body.client.id || null,
            name: String(body.client.name).slice(0, 120),
            email: String(body.client.email || '').slice(0, 120),
            phone: String(body.client.phone || '').slice(0, 40),
          },
          servicii: (body.servicii || []).map(s => ({
            id: s.id, nume: String(s.nume || '').slice(0, 120),
            descriere: String(s.descriere || '').slice(0, 300),
            pret: parseFloat(s.pret) || 0, moneda: s.moneda || 'EUR', unitate: s.unitate || 'proiect',
          })),
          moneda: ['EUR', 'RON'].includes(body.moneda) ? body.moneda : 'EUR',
          valabilitate: String(body.valabilitate || '30 zile').slice(0, 30),
          note: String(body.note || '').slice(0, 500),
          status: 'trimisă',
        };
        lista.push(oferta);
        await env.PROGRAMARI.put('__oferte__', JSON.stringify(lista));
        return json(oferta);
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── OFERTĂ PREVIEW (print as PDF) ────────────────────────

    if (path.startsWith('/oferta-preview/') && request.method === 'GET') {
      if (!isAdmin(url, env)) return new Response('Acces neautorizat', { status: 401 });
      const id = path.replace('/oferta-preview/', '');
      try {
        const [raw, tmplRaw] = await Promise.all([
          env.PROGRAMARI.get('__oferte__'),
          env.PROGRAMARI.get('__contract_template__'),
        ]);
        const lista = raw ? JSON.parse(raw) : [];
        const o = lista.find(x => x.id === id);
        if (!o) return new Response('Ofertă negăsită', { status: 404 });
        const t = tmplRaw ? JSON.parse(tmplRaw) : {};
        const prest = {
          nume:  t.prestNume  || 'C Design',
          email: t.prestEmail || 'office@c-design.ro',
          tel:   t.prestTel   || '',
          web:   t.prestWeb   || 'www.c-design.ro',
          cui:   t.prestCui   || '',
          adresa:t.prestAdresa|| '',
        };

        const total = (o.servicii || []).reduce((s, sv) => s + parseFloat(sv.pret || 0), 0);
        const dataDoc = new Date(o.createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
        const dataExpira = (() => {
          const d = new Date(o.createdAt);
          const zile = parseInt(o.valabilitate) || 30;
          d.setDate(d.getDate() + zile);
          return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
        })();
        function e(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

        const html = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ofertă ${e(o.numar)} – ${e(prest.nume)}</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,Arial,sans-serif;background:#f0f4f8;color:#1e293b;font-size:14px;line-height:1.6;min-height:100vh;padding:32px 16px 80px;}

  /* A4 sheet */
  .page{
    background:#fff;
    max-width:794px;
    margin:0 auto;
    border-radius:4px;
    box-shadow:0 4px 32px rgba(0,0,0,.13);
    overflow:hidden;
  }

  /* Accent bar top */
  .accent-bar{height:6px;background:linear-gradient(90deg,#00a8a8 0%,#00d4d4 100%);}

  .inner{padding:48px 52px 52px;}

  /* HEADER */
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:44px;}
  .brand-name{font-size:1.9rem;font-weight:800;color:#0f172a;letter-spacing:-.03em;line-height:1;}
  .brand-name span{color:#00a8a8;}
  .brand-details{margin-top:6px;}
  .brand-details div{font-size:.75rem;color:#64748b;line-height:1.7;}
  .doc-block{text-align:right;}
  .doc-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;margin-bottom:4px;}
  .doc-nr{font-size:1.5rem;font-weight:800;color:#00a8a8;letter-spacing:-.02em;}
  .doc-date{font-size:.78rem;color:#64748b;margin-top:4px;line-height:1.7;}

  /* DIVIDER */
  .divider{height:1px;background:#e2e8f0;margin:0 0 36px;}

  /* TOWARDS */
  .towards{display:flex;gap:40px;margin-bottom:36px;}
  .towards-block{flex:1;}
  .block-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;margin-bottom:10px;}
  .client-name{font-size:1.1rem;font-weight:700;color:#0f172a;}
  .client-detail{font-size:.82rem;color:#475569;margin-top:3px;}
  .validity-badge{display:inline-flex;align-items:center;gap:6px;background:#f0fdf9;border:1px solid #99f6e4;border-radius:6px;padding:6px 12px;font-size:.78rem;color:#0f766e;font-weight:600;margin-top:8px;}

  /* TABLE */
  .tbl-wrap{margin-bottom:28px;}
  .tbl-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;margin-bottom:10px;}
  table{width:100%;border-collapse:collapse;}
  thead tr{border-bottom:2px solid #e2e8f0;}
  th{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;padding:0 14px 10px;text-align:left;}
  th.right{text-align:right;}
  tbody tr{border-bottom:1px solid #f1f5f9;transition:background .1s;}
  tbody tr:last-child{border-bottom:none;}
  td{padding:13px 14px;vertical-align:top;}
  .svc-name{font-weight:600;color:#0f172a;font-size:.92rem;}
  .svc-desc{font-size:.77rem;color:#64748b;margin-top:3px;line-height:1.5;}
  .svc-unit{font-size:.78rem;color:#94a3b8;white-space:nowrap;}
  .svc-pret{font-size:.95rem;font-weight:700;color:#0f172a;text-align:right;white-space:nowrap;}

  /* TOTAL */
  .total-section{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;}
  .total-left{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#64748b;}
  .total-right{font-size:1.6rem;font-weight:800;color:#00a8a8;letter-spacing:-.02em;}
  .total-moneda{font-size:.9rem;font-weight:600;color:#94a3b8;margin-left:4px;}

  /* NOTES */
  .note-box{background:#fffbeb;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:28px;}
  .note-box strong{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:#92400e;display:block;margin-bottom:4px;}
  .note-box p{font-size:.85rem;color:#78350f;line-height:1.6;white-space:pre-wrap;}

  /* FOOTER */
  .footer{display:flex;justify-content:space-between;align-items:flex-end;padding-top:28px;border-top:1px solid #e2e8f0;margin-top:4px;}
  .footer-left{font-size:.78rem;color:#94a3b8;line-height:1.7;}
  .sig-block{text-align:center;}
  .sig-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;margin-bottom:28px;}
  .sig-line{border-top:1.5px solid #cbd5e1;padding-top:8px;font-size:.8rem;font-weight:600;color:#475569;min-width:180px;}

  /* PRINT BUTTON */
  .print-btn{position:fixed;bottom:28px;right:28px;background:#00a8a8;color:#fff;font-weight:700;font-size:.88rem;padding:11px 22px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,168,168,.45);display:flex;align-items:center;gap:8px;font-family:inherit;}
  .print-btn:hover{background:#009090;transform:translateY(-1px);}

  @media print{
    body{background:#fff;padding:0;}
    .page{box-shadow:none;border-radius:0;}
    .print-btn{display:none;}
    .inner{padding:30px 36px 36px;}
    @page{margin:1.2cm;size:A4;}
  }
  @media(max-width:600px){
    body{padding:12px 8px 72px;}
    .inner{padding:28px 22px 32px;}
    .towards{flex-direction:column;gap:20px;}
    .footer{flex-direction:column;gap:24px;align-items:flex-start;}
  }
</style>
</head>
<body>
<div class="page">
  <div class="accent-bar"></div>
  <div class="inner">

    <!-- HEADER -->
    <div class="header">
      <div>
        <div class="brand-name">${e(prest.nume.split(' ')[0])}<span>${prest.nume.includes(' ') ? e(prest.nume.slice(prest.nume.indexOf(' '))) : ''}</span></div>
        <div class="brand-details">
          ${prest.web ? `<div>${e(prest.web)}</div>` : ''}
          ${prest.email ? `<div>${e(prest.email)}</div>` : ''}
          ${prest.tel ? `<div>${e(prest.tel)}</div>` : ''}
          ${prest.cui ? `<div>CUI: ${e(prest.cui)}</div>` : ''}
        </div>
      </div>
      <div class="doc-block">
        <div class="doc-label">Ofertă comercială</div>
        <div class="doc-nr">${e(o.numar)}</div>
        <div class="doc-date">
          Emisă: ${dataDoc}<br>
          ${o.valabilitate !== 'la cerere' ? `Valabilă până: <strong>${dataExpira}</strong>` : 'Valabilitate: la cerere'}
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- TOWARDS -->
    <div class="towards">
      <div class="towards-block">
        <div class="block-label">Către</div>
        <div class="client-name">${e(o.client?.name || '—')}</div>
        ${o.client?.email ? `<div class="client-detail">✉ ${e(o.client.email)}</div>` : ''}
        ${o.client?.phone ? `<div class="client-detail">✆ ${e(o.client.phone)}</div>` : ''}
      </div>
      <div class="towards-block">
        <div class="block-label">Detalii</div>
        <div class="validity-badge">⏱ Valabilitate: ${e(o.valabilitate)}</div>
        ${prest.adresa ? `<div class="client-detail" style="margin-top:8px;">📍 ${e(prest.adresa)}</div>` : ''}
      </div>
    </div>

    <!-- SERVICII -->
    <div class="tbl-wrap">
      <div class="tbl-label">Servicii incluse</div>
      <table>
        <thead>
          <tr>
            <th style="width:52%">Serviciu / Descriere</th>
            <th>Unitate</th>
            <th class="right">Preț</th>
          </tr>
        </thead>
        <tbody>
          ${(o.servicii || []).map((s, i) => `
          <tr style="${i % 2 === 1 ? 'background:#fafbfc;' : ''}">
            <td>
              <div class="svc-name">${e(s.nume)}</div>
              ${s.descriere ? `<div class="svc-desc">${e(s.descriere)}</div>` : ''}
            </td>
            <td class="svc-unit">/ ${e(s.unitate || 'proiect')}</td>
            <td class="svc-pret">${parseFloat(s.pret||0).toLocaleString('ro-RO')} <span style="font-size:.75rem;font-weight:400;color:#94a3b8;">${e(s.moneda||o.moneda)}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <!-- TOTAL -->
    <div class="total-section">
      <div class="total-left">Total estimat</div>
      <div class="total-right">${total.toLocaleString('ro-RO')}<span class="total-moneda">${e(o.moneda)}</span></div>
    </div>

    ${o.note ? `
    <div class="note-box">
      <strong>Note &amp; condiții</strong>
      <p>${e(o.note)}</p>
    </div>` : ''}

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-left">
        <div style="font-weight:600;color:#475569;margin-bottom:4px;">${e(prest.nume)}</div>
        ${prest.email ? `<div>${e(prest.email)}</div>` : ''}
        ${prest.tel ? `<div>${e(prest.tel)}</div>` : ''}
        ${prest.web ? `<div>${e(prest.web)}</div>` : ''}
      </div>
      <div class="sig-block">
        <div class="sig-label">Reprezentant autorizat</div>
        <div class="sig-line">${e(prest.nume)}</div>
      </div>
    </div>

  </div>
</div>
<button class="print-btn" onclick="window.print()">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
  Printează / Salvează PDF
</button>
</body>
</html>`;
        return new Response(html, {
          headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
        });
      } catch { return new Response('Eroare la generare', { status: 500 }); }
    }

    // ── CONTRACT TEMPLATE ────────────────────────────────────

    if (path === '/api/contract-template' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__contract_template__');
        return json(raw ? JSON.parse(raw) : {});
      } catch { return json({}); }
    }

    if (path === '/api/contract-template' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__contract_template__');
        const existing = raw ? JSON.parse(raw) : {};
        const body = await request.json();
        const allowed = ['prestNume','prestCui','prestRegcom','prestAdresa','prestEmail','prestTel',
          'prestWeb','prestIban','prestBanca','prestRepr','garantie','preaviz','ndaAni',
          'avansPct','termen','penalitatiPct'];
        allowed.forEach(k => { if (body[k] !== undefined) existing[k] = String(body[k]).slice(0,200); });
        await env.PROGRAMARI.put('__contract_template__', JSON.stringify(existing));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── CONTRACTE ────────────────────────────────────────────

    if (path === '/api/contracte' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__contracte__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json([]); }
    }

    if (path === '/api/contracte' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const body = await request.json();
        if (!body.client?.name || !body.obiect) return json({ error: 'Date incomplete' }, 400);
        const raw = await env.PROGRAMARI.get('__contracte__');
        const lista = raw ? JSON.parse(raw) : [];
        const yr = new Date().getFullYear();
        const nrSeq = String(lista.filter(c => (c.createdAt||'').startsWith(String(yr))).length + 1).padStart(3, '0');
        const contract = {
          id: 'cnt_' + Date.now(),
          numar: `CNT-${yr}-${nrSeq}`,
          createdAt: new Date().toISOString(),
          dataSemnare: String(body.dataSemnare || new Date().toISOString().slice(0,10)),
          client: {
            name: String(body.client.name||'').slice(0,120),
            cui: String(body.client.cui||'').slice(0,40),
            adresa: String(body.client.adresa||'').slice(0,200),
            email: String(body.client.email||'').slice(0,120),
          },
          obiect: String(body.obiect||'').slice(0,500),
          serviciiText: String(body.serviciiText||'').slice(0,2000),
          total: parseFloat(body.total)||0,
          moneda: ['EUR','RON'].includes(body.moneda) ? body.moneda : 'EUR',
          avansPct: Math.min(100, Math.max(0, parseFloat(body.avansPct)||50)),
          termen: String(body.termen||'30'),
          termenUnit: String(body.termenUnit||'zile lucrătoare').slice(0,40),
          clauze: {
            confidentialitate: !!body.clauze?.confidentialitate,
            penalitati: !!body.clauze?.penalitati,
            ip: !!body.clauze?.ip,
          },
          ofertaId: body.ofertaId || null,
        };
        lista.push(contract);
        await env.PROGRAMARI.put('__contracte__', JSON.stringify(lista));
        return json(contract);
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── CONTRACT PREVIEW (print as PDF) ──────────────────────

    if (path.startsWith('/contract-preview/') && request.method === 'GET') {
      if (!isAdmin(url, env)) return new Response('Acces neautorizat', { status: 401 });
      const id = path.replace('/contract-preview/', '');
      try {
        const [raw, tmplRaw] = await Promise.all([
          env.PROGRAMARI.get('__contracte__'),
          env.PROGRAMARI.get('__contract_template__'),
        ]);
        const lista = raw ? JSON.parse(raw) : [];
        const c = lista.find(x => x.id === id);
        if (!c) return new Response('Contract negăsit', { status: 404 });
        const t = tmplRaw ? JSON.parse(tmplRaw) : {};

        // Merge template defaults with per-contract values
        const prest = {
          nume:    t.prestNume   || 'C Design',
          cui:     t.prestCui    || '',
          regcom:  t.prestRegcom || '',
          adresa:  t.prestAdresa || '',
          email:   t.prestEmail  || 'office@c-design.ro',
          tel:     t.prestTel    || '',
          web:     t.prestWeb    || 'www.c-design.ro',
          iban:    t.prestIban   || '',
          banca:   t.prestBanca  || '',
          repr:    t.prestRepr   || '',
        };
        const garantie      = parseInt(t.garantie)      || 30;
        const preaviz       = parseInt(t.preaviz)       || 15;
        const ndaAni        = parseInt(t.ndaAni)        || 2;
        const penalitatiPct = parseFloat(t.penalitatiPct) || 0.1;

        function e(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
        function fmtDate(d) {
          if (!d) return '___________';
          const dt = new Date(d);
          return dt.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        const avansVal = (c.total * c.avansPct / 100).toFixed(2);
        const restVal = (c.total - parseFloat(avansVal)).toFixed(2);
        const nrArt = (() => { let n = 0; return () => ++n; })();

        const serviciiRows = c.serviciiText
          ? c.serviciiText.split('\n').filter(Boolean).map(l => `<div style="padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:.9rem;">${e(l)}</div>`).join('')
          : `<div style="padding:4px 0;">${e(c.obiect)}</div>`;

        const html = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contract ${e(c.numar)} – C Design</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Times New Roman',Times,serif;background:#fff;color:#111;font-size:13px;line-height:1.6;}
  .page{max-width:800px;margin:0 auto;padding:50px 48px;}
  .header{text-align:center;margin-bottom:36px;padding-bottom:20px;border-bottom:2px solid #111;}
  .logo{font-family:Arial,sans-serif;font-size:1.3rem;font-weight:800;letter-spacing:.05em;}
  .logo span{color:#007070;}
  .logo-sub{font-size:.75rem;color:#555;margin-top:2px;}
  .contract-title{font-size:1.3rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin:20px 0 6px;}
  .contract-nr{font-size:.95rem;color:#333;}
  .art{margin-bottom:20px;}
  .art-title{font-weight:700;font-size:.95rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;padding:6px 0;border-bottom:1px solid #ddd;}
  .art-body{font-size:.9rem;color:#222;line-height:1.7;}
  .art-body p{margin-bottom:6px;}
  .art-body ul{margin:6px 0 6px 20px;}
  .art-body li{margin-bottom:4px;}
  .parties-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:12px 0;}
  .party-box{background:#f8f8f8;border:1px solid #ddd;border-radius:4px;padding:14px 16px;}
  .party-label{font-weight:700;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#555;margin-bottom:8px;}
  .party-name{font-weight:700;font-size:1rem;color:#111;}
  .party-detail{font-size:.85rem;color:#444;margin-top:3px;}
  .highlight{background:#f0fafa;border-left:3px solid #007070;padding:10px 14px;margin:10px 0;border-radius:0 4px 4px 0;}
  .svc-box{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:4px;padding:12px 16px;margin:10px 0;}
  .total-box{background:#e8f5f5;border:1px solid #007070;border-radius:4px;padding:12px 16px;margin:10px 0;display:flex;justify-content:space-between;align-items:center;}
  .total-label{font-weight:700;}
  .total-val{font-size:1.1rem;font-weight:700;color:#007070;}
  .signatures{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px;}
  .sig-block{text-align:center;}
  .sig-label{font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;}
  .sig-name{font-size:.85rem;color:#333;margin-bottom:40px;}
  .sig-line{border-top:1px solid #333;padding-top:6px;font-size:.75rem;color:#888;}
  .print-btn{position:fixed;bottom:28px;right:28px;background:#007070;color:#fff;font-weight:700;font-size:.9rem;padding:11px 22px;border-radius:8px;border:none;cursor:pointer;font-family:Arial,sans-serif;box-shadow:0 4px 14px rgba(0,112,112,.4);}
  @media print{
    .print-btn{display:none;}
    body{font-size:11px;}
    .page{padding:0;}
    @page{margin:2cm;}
  }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="logo">${e(prest.nume)}</div>
    <div class="logo-sub">${prest.web ? e(prest.web) + ' | ' : ''}${prest.email ? e(prest.email) : ''}${prest.tel ? ' | ' + e(prest.tel) : ''}</div>
    <div class="contract-title">Contract de Prestări Servicii</div>
    <div class="contract-nr">Nr. <strong>${e(c.numar)}</strong> / Data: <strong>${fmtDate(c.dataSemnare)}</strong></div>
  </div>

  <!-- ART. 1 — PĂRȚILE -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Părțile contractante</div>
    <div class="art-body">
      <div class="parties-grid">
        <div class="party-box">
          <div class="party-label">Prestator</div>
          <div class="party-name">${e(prest.nume)}</div>
          ${prest.cui ? `<div class="party-detail">CUI: ${e(prest.cui)}</div>` : ''}
          ${prest.regcom ? `<div class="party-detail">Reg.Com.: ${e(prest.regcom)}</div>` : ''}
          ${prest.adresa ? `<div class="party-detail">${e(prest.adresa)}</div>` : ''}
          ${prest.email ? `<div class="party-detail">${e(prest.email)}</div>` : ''}
          ${prest.tel ? `<div class="party-detail">${e(prest.tel)}</div>` : ''}
          ${prest.web ? `<div class="party-detail">${e(prest.web)}</div>` : ''}
          ${prest.iban ? `<div class="party-detail">IBAN: ${e(prest.iban)}${prest.banca ? ' · ' + e(prest.banca) : ''}</div>` : ''}
          ${prest.repr ? `<div class="party-detail">Reprezentant: ${e(prest.repr)}</div>` : ''}
        </div>
        <div class="party-box">
          <div class="party-label">Beneficiar</div>
          <div class="party-name">${e(c.client.name)}</div>
          ${c.client.cui ? `<div class="party-detail">CUI/CNP: ${e(c.client.cui)}</div>` : ''}
          ${c.client.adresa ? `<div class="party-detail">${e(c.client.adresa)}</div>` : ''}
          ${c.client.email ? `<div class="party-detail">${e(c.client.email)}</div>` : ''}
        </div>
      </div>
      <p>Au convenit să încheie prezentul contract de prestări servicii în condițiile următoare:</p>
    </div>
  </div>

  <!-- ART. 2 — OBIECTUL -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Obiectul contractului</div>
    <div class="art-body">
      <p>Prestatorul se obligă să execute în beneficiul Beneficiarului următoarele servicii:</p>
      <div class="highlight"><strong>${e(c.obiect)}</strong></div>
      ${c.serviciiText ? `<div class="svc-box">${serviciiRows}</div>` : ''}
    </div>
  </div>

  <!-- ART. 3 — DURATA -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Durata contractului și termene de livrare</div>
    <div class="art-body">
      <p>Prezentul contract intră în vigoare la data semnării de către ambele părți și este valabil până la finalizarea și recepția tuturor serviciilor prevăzute la Art. 2.</p>
      <p>Termenul de realizare și livrare a serviciilor este de <strong>${e(c.termen)} ${e(c.termenUnit)}</strong>, calculat de la data achitării avansului prevăzut la Art. 4.</p>
      <p>Termenul poate fi prelungit cu acordul scris al ambelor părți sau în situații de forță majoră.</p>
    </div>
  </div>

  <!-- ART. 4 — PREȚUL -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Prețul și modalitatea de plată</div>
    <div class="art-body">
      <div class="total-box">
        <span class="total-label">Valoare totală contract:</span>
        <span class="total-val">${c.total.toLocaleString('ro-RO')} ${e(c.moneda)}</span>
      </div>
      <ul>
        <li>Avans (<strong>${c.avansPct}%</strong>): <strong>${parseFloat(avansVal).toLocaleString('ro-RO')} ${e(c.moneda)}</strong> — plătibil la semnarea contractului, condiție pentru demararea lucrărilor.</li>
        <li>Rest de plată (<strong>${(100 - c.avansPct)}%</strong>): <strong>${parseFloat(restVal).toLocaleString('ro-RO')} ${e(c.moneda)}</strong> — plătibil la recepția și acceptarea finală a lucrărilor.</li>
      </ul>
      <p style="margin-top:8px;">Plata se efectuează prin transfer bancar sau în modalitatea agreată în scris de ambele părți. Prețurile nu includ TVA dacă nu se specifică altfel.</p>
      ${c.clauze.penalitati ? `<p>În cazul întârzierii plăților, Beneficiarul datorează penalități de <strong>${penalitatiPct}% pe zi</strong> din suma restantă, calculate de la data scadenței.</p>` : ''}
    </div>
  </div>

  <!-- ART. 5 — OBLIGAȚII PRESTATOR -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Obligațiile Prestatorului</div>
    <div class="art-body">
      <ul>
        <li>Să execute serviciile prevăzute la Art. 2 cu profesionalism și în termenul stabilit;</li>
        <li>Să informeze Beneficiarul cu privire la stadiul lucrărilor la solicitarea acestuia;</li>
        <li>Să solicite Beneficiarului materialele și informațiile necesare (texte, imagini, date de acces) în timp util;</li>
        <li>Să corecteze orice deficiențe constatate în perioada de garanție de <strong>${garantie} de zile</strong> de la recepția finală, care nu sunt imputabile Beneficiarului;</li>
        <li>Să păstreze confidențialitatea informațiilor comunicate de Beneficiar pe durata contractului.</li>
      </ul>
    </div>
  </div>

  <!-- ART. 6 — OBLIGAȚII BENEFICIAR -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Obligațiile Beneficiarului</div>
    <div class="art-body">
      <ul>
        <li>Să achite avansul la semnarea contractului și restul la recepția finală;</li>
        <li>Să furnizeze Prestatorului toate materialele necesare (texte, imagini, logo, date de acces) în termen de <strong>5 zile lucrătoare</strong> de la solicitare;</li>
        <li>Să verifice și să aprobe livrabilele în termen de <strong>5 zile lucrătoare</strong> de la primire; lipsa unui răspuns se consideră acceptare tacită;</li>
        <li>Să nu utilizeze lucrările livrate înainte de achitarea integrală a prețului contractului.</li>
      </ul>
    </div>
  </div>

  ${c.clauze.ip ? `
  <!-- ART. IP -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Drepturi de proprietate intelectuală</div>
    <div class="art-body">
      <p>Drepturile de proprietate intelectuală asupra tuturor lucrărilor livrate (design, cod sursă, grafică) se transferă integral Beneficiarului după achitarea integrală a prețului contractului.</p>
      <p>Până la achitarea integrală, Prestatorul poate utiliza lucrările realizate în scopuri de portofoliu și promovare, cu excepția cazului în care Beneficiarul solicită expres confidențialitate.</p>
      <p>Prestatorul își rezervă dreptul de a menționa în portofoliu proiectele realizate, dacă nu există acorduri de confidențialitate exprese.</p>
    </div>
  </div>` : ''}

  ${c.clauze.confidentialitate ? `
  <!-- ART. CONFIDENTIALITATE -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Confidențialitate</div>
    <div class="art-body">
      <p>Ambele părți se obligă să păstreze confidențialitatea informațiilor dobândite în executarea prezentului contract, care nu sunt publice și pe care cealaltă parte le-a desemnat ca fiind confidențiale.</p>
      <p>Această obligație rămâne în vigoare pe durata contractului și timp de <strong>${ndaAni} ${ndaAni === 1 ? 'an' : 'ani'}</strong> după încetarea acestuia.</p>
      <p>Sunt excluse de la obligația de confidențialitate informațiile care sunt sau devin publice fără culpa părții care le divulgă.</p>
    </div>
  </div>` : ''}

  <!-- ART. REZILIERE -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Reziliere</div>
    <div class="art-body">
      <p>Oricare dintre părți poate rezilia prezentul contract cu un preaviz de <strong>${preaviz} zile</strong>, în cazul în care cealaltă parte nu își îndeplinește obligațiile contractuale și nu remediază situația în termenul de preaviz.</p>
      <p>În cazul rezilierii din culpa Beneficiarului, avansul achitat nu se restituie; în cazul rezilierii din culpa Prestatorului, acesta va restitui avansul și va preda lucrările efectuate până la data rezilierii.</p>
    </div>
  </div>

  <!-- ART. FORȚĂ MAJORĂ -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Forță majoră</div>
    <div class="art-body">
      <p>Niciuna dintre părți nu va fi răspunzătoare pentru neexecutarea obligațiilor contractuale cauzate de evenimente de forță majoră (calamități naturale, acte de autoritate publică, pandemii, etc.).</p>
      <p>Partea afectată are obligația de a notifica cealaltă parte în termen de <strong>5 zile</strong> de la apariția evenimentului. Dacă forța majoră depășește <strong>30 de zile</strong>, oricare parte poate rezilia contractul fără daune-interese.</p>
    </div>
  </div>

  <!-- ART. DISPOZIȚII FINALE -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Dispoziții finale</div>
    <div class="art-body">
      <p>Prezentul contract este guvernat de legea română. Orice litigiu se va soluționa pe cale amiabilă; în caz contrar, competența revine instanțelor judecătorești de la sediul Prestatorului.</p>
      <p>Orice modificare a prezentului contract se face prin act adițional semnat de ambele părți.</p>
      <p>Contractul a fost încheiat în <strong>2 (două) exemplare originale</strong>, câte unul pentru fiecare parte.</p>
    </div>
  </div>

  <!-- SEMNĂTURI -->
  <div class="signatures">
    <div class="sig-block">
      <div class="sig-label">Prestator</div>
      <div class="sig-name">${e(prest.nume)}${prest.repr ? '<div style="font-size:.8rem;color:#555;margin-top:2px;">' + e(prest.repr) + '</div>' : ''}</div>
      <div class="sig-line">Semnătură și ștampilă</div>
    </div>
    <div class="sig-block">
      <div class="sig-label">Beneficiar</div>
      <div class="sig-name">${e(c.client.name)}</div>
      <div class="sig-line">Semnătură și ștampilă</div>
    </div>
  </div>

</div>
<button class="print-btn" onclick="window.print()">&#x1F5A8; Printează / Salvează PDF</button>
</body>
</html>`;
        return new Response(html, {
          headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
        });
      } catch { return new Response('Eroare la generare contract', { status: 500 }); }
    }

    // ── REFERRAL LEDGER (cine a recomandat pe cine + discount acumulat) ──
    if (path === '/api/referrals' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const allowed = await checkRateLimit(env, 'referral_' + ip, 6, 3600);
      if (!allowed) return json({ error: 'Prea multe cereri. Încearcă din nou mai târziu.' }, 429, request);
      try {
        const b = await request.json();
        const referrerName = String(b.referrerName || '').trim().slice(0, 120);
        const friendName = String(b.friendName || '').trim().slice(0, 120);
        const friendContact = String(b.friendContact || '').trim().slice(0, 160);
        if (referrerName.length < 2 || friendName.length < 2 || !friendContact) return json({ error: 'Câmpuri obligatorii lipsă' }, 400);
        const rec = {
          id: 'ref_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
          referrerName,
          referrerEmail: String(b.referrerEmail || '').trim().slice(0, 160),
          referrerPhone: String(b.referrerPhone || '').trim().slice(0, 40),
          friendName,
          friendContact,
          friendBusiness: String(b.friendBusiness || '').trim().slice(0, 160),
          note: String(b.note || '').trim().slice(0, 1000),
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        let friendPct = 10, referrerPct = 20, refCap = 50;
        try { const rawS = await env.PROGRAMARI.get('__site_settings__'); const s = rawS ? JSON.parse(rawS) : {}; if (s.referral) { if (s.referral.friendPct != null) friendPct = s.referral.friendPct; if (s.referral.referrerPct != null) referrerPct = s.referral.referrerPct; if (s.referral.cap != null) refCap = s.referral.cap; } } catch {}
        rec.friendPct = friendPct;
        rec.friendCode = genDiscountCode('CD');
        rec.friendEmailed = false;
        try { const r = await sendFriendDiscountEmail(env, rec); rec.friendEmailed = !!(r && r.ok); } catch {}
        const raw = await env.PROGRAMARI.get('__referrals__');
        const list = raw ? JSON.parse(raw) : [];
        const rkey = referrerKeyOf(rec);
        let referrerCode = '', isFirst = true;
        for (const x of list) {
          if (referrerKeyOf(x) === rkey) { isFirst = false; if (x.referrerCode && !referrerCode) referrerCode = x.referrerCode; }
        }
        if (!referrerCode) referrerCode = genDiscountCode('REF');
        rec.referrerCode = referrerCode;
        rec.referrerEmailed = false;
        if (isFirst && EMAIL_RE.test(rec.referrerEmail)) {
          try { const rr = await sendReferrerCodeEmail(env, rec, referrerPct, refCap); rec.referrerEmailed = !!(rr && rr.ok); } catch {}
        }
        list.unshift(rec);
        await env.PROGRAMARI.put('__referrals__', JSON.stringify(list.slice(0, 2000)));
        try {
          await sendEmail(env, {
            to: await notifyRecipients(env),
            subject: 'Referral nou — ' + referrerName,
            html: '<p><strong>' + escHtml(referrerName) + '</strong> a recomandat pe <strong>' + escHtml(friendName) + '</strong>.</p>'
              + '<p>Referent: ' + escHtml(rec.referrerEmail || '—') + ' · ' + escHtml(rec.referrerPhone || '—') + '<br>'
              + 'Prieten: ' + escHtml(friendContact) + (rec.friendBusiness ? ' · ' + escHtml(rec.friendBusiness) : '') + '</p>'
              + (rec.note ? '<p>Notă: ' + escHtml(rec.note) + '</p>' : '')
          });
        } catch {}
        return json({ success: true, id: rec.id });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }
    if (path === '/api/referrals' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__referrals__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json([]); }
    }
    if (path.startsWith('/api/referrals/') && path.endsWith('/resend-code') && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/referrals/', '').replace('/resend-code', '');
        const raw = await env.PROGRAMARI.get('__referrals__');
        const list = raw ? JSON.parse(raw) : [];
        const r = list.find(x => x.id === id);
        if (!r) return json({ error: 'Nu a fost găsit' }, 404);
        if (!EMAIL_RE.test(r.friendContact)) return json({ error: 'Contactul prietenului nu este un email — copiază codul și trimite-l manual.' }, 400);
        if (!r.friendCode) { r.friendCode = genDiscountCode('CD'); }
        const sent = await sendFriendDiscountEmail(env, r);
        if (sent && sent.ok) { r.friendEmailed = true; await env.PROGRAMARI.put('__referrals__', JSON.stringify(list)); return json({ success: true }); }
        return json({ error: (sent && sent.skipped) ? 'Trimiterea email-urilor nu este configurată.' : 'Nu s-a putut trimite email-ul.' }, 500);
      } catch { return json({ error: 'Eroare server' }, 500); }
    }
    if (path.startsWith('/api/referrals/') && path.endsWith('/resend-referrer-code') && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/referrals/', '').replace('/resend-referrer-code', '');
        const raw = await env.PROGRAMARI.get('__referrals__');
        const list = raw ? JSON.parse(raw) : [];
        const r = list.find(x => x.id === id);
        if (!r) return json({ error: 'Nu a fost găsit' }, 404);
        if (!EMAIL_RE.test(r.referrerEmail)) return json({ error: 'Referentul nu are email înregistrat — copiază codul și trimite-l manual.' }, 400);
        if (!r.referrerCode) r.referrerCode = genDiscountCode('REF');
        let pct = 20, cap = 50;
        try { const rawS = await env.PROGRAMARI.get('__site_settings__'); const s = rawS ? JSON.parse(rawS) : {}; if (s.referral) { if (s.referral.referrerPct != null) pct = s.referral.referrerPct; if (s.referral.cap != null) cap = s.referral.cap; } } catch {}
        const sent = await sendReferrerCodeEmail(env, r, pct, cap);
        if (sent && sent.ok) { r.referrerEmailed = true; await env.PROGRAMARI.put('__referrals__', JSON.stringify(list)); return json({ success: true }); }
        return json({ error: (sent && sent.skipped) ? 'Trimiterea email-urilor nu este configurată.' : 'Nu s-a putut trimite email-ul.' }, 500);
      } catch { return json({ error: 'Eroare server' }, 500); }
    }
    if (path.startsWith('/api/referrals/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/referrals/', '');
        const b = await request.json();
        const raw = await env.PROGRAMARI.get('__referrals__');
        const list = raw ? JSON.parse(raw) : [];
        const r = list.find(x => x.id === id);
        if (!r) return json({ error: 'Nu a fost găsit' }, 404);
        const prevStatus = r.status;
        if (b.status !== undefined && ['pending', 'signed_up'].includes(b.status)) r.status = b.status;
        await env.PROGRAMARI.put('__referrals__', JSON.stringify(list));
        if (prevStatus !== 'signed_up' && r.status === 'signed_up' && EMAIL_RE.test(r.referrerEmail)) {
          let pct = 20, cap = 50;
          try { const rawS = await env.PROGRAMARI.get('__site_settings__'); const s = rawS ? JSON.parse(rawS) : {}; if (s.referral) { if (s.referral.referrerPct != null) pct = s.referral.referrerPct; if (s.referral.cap != null) cap = s.referral.cap; } } catch {}
          const rkey = referrerKeyOf(r);
          const confirmed = list.filter(x => referrerKeyOf(x) === rkey && x.status === 'signed_up').length;
          const value = Math.min(cap, confirmed * pct);
          try { await sendReferrerConversionEmail(env, r, value, cap); } catch {}
        }
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }
    if (path.startsWith('/api/referrals/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const id = path.replace('/api/referrals/', '');
        const raw = await env.PROGRAMARI.get('__referrals__');
        const list = raw ? JSON.parse(raw) : [];
        await env.PROGRAMARI.put('__referrals__', JSON.stringify(list.filter(x => x.id !== id)));
        return json({ success: true });
      } catch { return json({ error: 'Eroare server' }, 500); }
    }

    // ── GIVEAWAY SETTINGS ─────────────────────────────────────
    if (path === '/api/giveaway-settings' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__site_settings__');
        const existing = raw ? JSON.parse(raw) : {};
        const cur = existing.giveaway || {};
        if (body.endDate !== undefined) cur.endDate = String(body.endDate || '').slice(0, 40);
        if (body.published !== undefined) cur.published = !!body.published;
        if (body.banner !== undefined) cur.banner = String(body.banner || '').slice(0, 300);
        if (body.entrantPct !== undefined) { const n = parseInt(String(body.entrantPct).replace(/[^0-9]/g, ''), 10); if (!isNaN(n)) cur.entrantPct = Math.max(0, Math.min(100, n)); }
        existing.giveaway = cur;
        await env.PROGRAMARI.put('__site_settings__', JSON.stringify(existing));
        return json({ success: true });
      } catch { return json({ error: 'Eroare' }, 500); }
    }

    // ── REFERRAL SETTINGS ─────────────────────────────────────
    if (path === '/api/referral-settings' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__site_settings__');
        const existing = raw ? JSON.parse(raw) : {};
        const cur = existing.referral || {};
        const clampPct = (v) => { const n = parseInt(String(v).replace(/[^0-9]/g, ''), 10); return isNaN(n) ? undefined : Math.max(0, Math.min(100, n)); };
        if (body.referrerPct !== undefined) { const n = clampPct(body.referrerPct); if (n !== undefined) cur.referrerPct = n; }
        if (body.friendPct !== undefined) { const n = clampPct(body.friendPct); if (n !== undefined) cur.friendPct = n; }
        if (body.cap !== undefined) { const n = clampPct(body.cap); if (n !== undefined) cur.cap = n; }
        if (body.banner !== undefined) cur.banner = String(body.banner || '').slice(0, 300);
        existing.referral = cur;
        await env.PROGRAMARI.put('__site_settings__', JSON.stringify(existing));
        return json({ success: true });
      } catch { return json({ error: 'Eroare' }, 500); }
    }

    // ── PROMO VISIBILITY (publică / ascunde pagina referral sau giveaway) ──
    // Token scurt de previzualizare pentru paginile draft (referral/giveaway)
    if (path === '/api/preview-token' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      const pt = 'pv_' + (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
      await env.PROGRAMARI.put('__pv__' + pt, JSON.stringify({ expires: Date.now() + 120000 }), { expirationTtl: 120 });
      return json({ pt });
    }

    if (path === '/api/promo-visibility' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Acces neautorizat' }, 401);
      try {
        const body = await request.json();
        const page = body.page === 'referral' ? 'referral' : 'giveaway';
        const raw = await env.PROGRAMARI.get('__site_settings__');
        const existing = raw ? JSON.parse(raw) : {};
        existing[page] = Object.assign({}, existing[page] || {}, { published: !!body.published });
        await env.PROGRAMARI.put('__site_settings__', JSON.stringify(existing));
        return json({ success: true });
      } catch { return json({ error: 'Eroare' }, 500); }
    }

    // SSR: injectează setările salvate în index.html pentru a evita flash-ul de conținut hardcodat
    if (path === '/' || path === '/index.html') {
      try {
        const [htmlResp, settingsRaw, contentRaw] = await Promise.all([
          env.ASSETS.fetch(new Request(new URL('/index.html', request.url).toString())),
          env.PROGRAMARI.get('__site_settings__'),
          env.PROGRAMARI.get('__content__index').catch(() => null)
        ]);
        if (!settingsRaw && !contentRaw) return htmlResp;
        const settings = settingsRaw ? JSON.parse(settingsRaw) : {};
        let html = await htmlResp.text();
        if (contentRaw) { try { html = applyContentOverrides(html, JSON.parse(contentRaw)); } catch {} }
        function injectText(h, id, tag, value) {
          if (!value) return h;
          const esc = value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          return h.replace(new RegExp(`(id="${id}"[^>]*>)[\\s\\S]*?(<\\/${tag}>)`), `$1${esc}$2`);
        }
        html = injectText(html, 'hero-h1-el',        'h1', settings.heroTitle);
        html = injectText(html, 'hero-desc-el',       'p',  settings.heroDesc);
        html = injectText(html, 'servicii-heading',   'h2', settings.servicesTitle);
        html = injectText(html, 'servicii-sub-el',    'p',  settings.servicesSub);
        html = injectText(html, 'ind-heading',        'h2', settings.indTitle);
        html = injectText(html, 'ind-sub-el',         'p',  settings.indSub);
        html = injectText(html, 'proces-heading',     'h2', settings.procesTitle);
        html = injectText(html, 'proces-sub-el',      'p',  settings.procesSub);
        html = injectText(html, 'portofoliu-heading', 'h2', settings.portTitle);
        html = injectText(html, 'portofoliu-sub-el',  'p',  settings.portSub);
        html = injectText(html, 'testi-heading',      'h2', settings.testiTitle);
        html = injectText(html, 'contact-heading',    'h2', settings.contactTitle);
        // LCP: imaginea hero injectată server-side + preload — browserul o
        // descarcă imediat, nu după fetch-ul client-side de site-settings
        try {
          const heroD = settings.heroImage || '';
          const heroM = settings.heroImageMobile || '';
          if (heroD || heroM) {
            const cssUrl = (u) => String(u).replace(/["'()\\<>]/g, '');
            const escA = (u) => String(u).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
            let inject = '<style id="hero-ssr">';
            if (heroD) {
              inject += '.hero-bg-photo{background-image:url("' + cssUrl(heroD) + '")'
                + (settings.heroSize ? ';background-size:' + cssUrl(settings.heroSize) : '')
                + (settings.heroPosition ? ';background-position:' + cssUrl(settings.heroPosition) : '')
                + ';}';
            }
            if (heroM) {
              inject += '@media(max-width:768px){.hero-bg-photo{background-image:url("' + cssUrl(heroM) + '")'
                + (settings.heroSizeMobile ? ';background-size:' + cssUrl(settings.heroSizeMobile) : '')
                + (settings.heroPosMobile ? ';background-position:' + cssUrl(settings.heroPosMobile) : '')
                + ';}}';
            }
            inject += '</style>';
            const distinctM = heroM && heroM !== heroD;
            if (heroD) inject += '<link rel="preload" as="image" fetchpriority="high" href="' + escA(heroD) + '"' + (distinctM ? ' media="(min-width:769px)"' : '') + '>';
            if (distinctM) inject += '<link rel="preload" as="image" fetchpriority="high" href="' + escA(heroM) + '" media="(max-width:768px)">';
            html = html.replace('</head>', inject + '</head>');
            // clasele hero din settings, aplicate server-side — clientul le
            // seta abia după fetch, redimensionând hero-ul (sursă de CLS)
            const heroCls = [];
            if (settings.heroGradient === false) heroCls.push('no-gradient');
            if (settings.heroText === false) heroCls.push('no-text');
            if (settings.heroHeight && settings.heroHeight !== 'full') heroCls.push('h-' + String(settings.heroHeight).replace(/[^a-z-]/g, ''));
            if (heroCls.length) html = html.replace('<section class="hero"', '<section class="hero ' + heroCls.join(' ') + '"');
          }
        } catch {}
        return new Response(html, { headers: { ...SEC_HEADERS, 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
      } catch { return env.ASSETS.fetch(request); }
    }

    // Fallthrough — servește fișierele statice cu security headers
    const assetResp = await env.ASSETS.fetch(request);
    const ct = assetResp.headers.get('Content-Type') || '';
    if (ct.includes('text/html')) {
      const newHeaders = new Headers(assetResp.headers);
      Object.entries(SEC_HEADERS).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(assetResp.body, { status: assetResp.status, headers: newHeaders });
    }
    return assetResp;
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(Promise.all([
      checkCrmDeadlines(env),
      sendGibilanMorningEmail(env),
    ]));
  },
};
