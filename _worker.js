const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

const ADMIN_TOKEN = 'Anaare3mere#';

const DEFAULT_PROJECTS = [
  { id: 'p1', emoji: '🚗', tag: 'Auto', title: 'Tractări Auto Teleorman', description: 'Site de prezentare cu zone de acoperire: Dâmbovița, Ilfov, București, Argeș, Giurgiu.', order: 0 },
  { id: 'p2', emoji: '🏭', tag: 'Dealer Autorizat', title: 'Dealer Autorizat Lindab', description: 'Prezentare profesională cu catalog de produse și date de contact integrate.', order: 1 },
  { id: 'p3', emoji: '🌸', tag: 'Florărie', title: 'Site Florărie', description: 'Site modern cu produse și posibilitate de comandă online, optimizat pentru mobil.', order: 2 },
  { id: 'p4', emoji: '🏗️', tag: 'Construcții', title: 'Arhitectură & Construcții', description: 'Portofoliu vizual elegant cu proiecte realizate și testimoniale clienți.', order: 3 },
  { id: 'p5', emoji: '💼', tag: 'Start-Up', title: 'Micul Întreprinzător', description: 'Pachet complet la start: site + identitate vizuală + prezență online activă.', order: 4 },
  { id: 'p6', emoji: '🔧', tag: 'Servicii', title: 'Firmă Servicii Tehnice', description: 'Site de prezentare cu formular de solicitare ofertă și galerie de lucrări.', order: 5 },
];

function isAdmin(url, env) {
  return url.searchParams.get('token') === (env.ADMIN_TOKEN || ADMIN_TOKEN);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    // ── BOOKINGS ──────────────────────────────────────────────

    if (path === '/api/booking' && request.method === 'POST') {
      try {
        const { name, phone, email, service, date, time, message } = await request.json();
        if (!name || !phone || !email || !date || !time)
          return json({ error: 'Câmpuri obligatorii lipsă' }, 400);
        const id = `booking_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const booking = { id, name, phone, email, service: service || 'Nespecificat', date, time, message: message || '', status: 'nou', createdAt: new Date().toISOString() };
        await env.PROGRAMARI.put(id, JSON.stringify(booking));
        const raw = await env.PROGRAMARI.get('__index__');
        const index = raw ? JSON.parse(raw) : [];
        index.unshift({ id, date, time, name });
        await env.PROGRAMARI.put('__index__', JSON.stringify(index));
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

    // GET /api/projects — public
    if (path === '/api/projects' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__projects__');
        const projects = raw ? JSON.parse(raw) : DEFAULT_PROJECTS;
        return json(projects.sort((a, b) => a.order - b.order));
      } catch { return json(DEFAULT_PROJECTS); }
    }

    // POST /api/project — adaugă proiect nou
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

    // PUT /api/project/:id — editează proiect
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

    // DELETE /api/project/:id — șterge proiect
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

    // Fallthrough — servește fișierele statice
    return env.ASSETS.fetch(request);
  },
};
