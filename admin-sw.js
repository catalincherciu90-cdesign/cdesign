// Service worker pentru adminul C Design (/programari).
// Rol unic: primește notificările push (programări, mesaje, lead-uri noi)
// și deschide adminul la tab-ul potrivit când se apasă pe notificare.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; }
  catch (e) { d = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(d.title || 'C Design Admin', {
    body: d.body || '',
    icon: '/admin-icon-192.png',
    badge: '/admin-badge.png',
    vibrate: [120, 60, 120],
    data: { tab: d.tab || '' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const tab = (event.notification.data && event.notification.data.tab) || '';
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const open = all.find((c) => { try { return new URL(c.url).pathname.startsWith('/programari'); } catch (e) { return false; } });
    if (open) {
      try { await open.focus(); } catch (e) {}
      open.postMessage({ type: 'cd-open-tab', tab });
      return;
    }
    await self.clients.openWindow('/programari' + (tab ? '?tab=' + encodeURIComponent(tab) : ''));
  })());
});
