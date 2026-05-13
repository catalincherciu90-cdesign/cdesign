const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

const ADMIN_TOKEN = 'Anaare3mere#';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    // POST /api/booking — salvează o programare nouă
    if (path === '/api/booking' && request.method === 'POST') {
      try {
        const { name, phone, email, service, date, time, message } = await request.json();
        if (!name || !phone || !email || !date || !time)
          return json({ error: 'Câmpuri obligatorii lipsă' }, 400);

        const id = `booking_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const booking = {
          id, name, phone, email,
          service: service || 'Nespecificat',
          date, time,
          message: message || '',
          status: 'nou',
          createdAt: new Date().toISOString(),
        };

        await env.PROGRAMARI.put(id, JSON.stringify(booking));

        const raw = await env.PROGRAMARI.get('__index__');
        const index = raw ? JSON.parse(raw) : [];
        index.unshift({ id, date, time, name });
        await env.PROGRAMARI.put('__index__', JSON.stringify(index));

        return json({ success: true, id });
      } catch {
        return json({ error: 'Eroare server' }, 500);
      }
    }

    // GET /api/bookings?token= — listează toate programările
    if (path === '/api/bookings' && request.method === 'GET') {
      const token = url.searchParams.get('token');
      if (token !== (env.ADMIN_TOKEN || ADMIN_TOKEN))
        return json({ error: 'Acces neautorizat' }, 401);

      try {
        const raw = await env.PROGRAMARI.get('__index__');
        const index = raw ? JSON.parse(raw) : [];
        const bookings = await Promise.all(
          index.map(async ({ id }) => {
            const r = await env.PROGRAMARI.get(id);
            return r ? JSON.parse(r) : null;
          })
        );
        return json(bookings.filter(Boolean));
      } catch {
        return json({ error: 'Eroare server' }, 500);
      }
    }

    // PATCH /api/booking/:id?token= — actualizează statusul
    if (path.startsWith('/api/booking/') && request.method === 'PATCH') {
      const token = url.searchParams.get('token');
      if (token !== (env.ADMIN_TOKEN || ADMIN_TOKEN))
        return json({ error: 'Acces neautorizat' }, 401);

      const id = path.replace('/api/booking/', '');
      const raw = await env.PROGRAMARI.get(id);
      if (!raw) return json({ error: 'Negăsit' }, 404);

      const { status } = await request.json();
      const booking = JSON.parse(raw);
      booking.status = status;
      await env.PROGRAMARI.put(id, JSON.stringify(booking));
      return json({ success: true });
    }

    // Fallthrough — servește fișierele statice
    return env.ASSETS.fetch(request);
  },
};
