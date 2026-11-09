// GIANG – service worker chỉ để nhận thông báo đẩy (không lưu cache trang)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = {body: e.data ? e.data.text() : ''}; }
  e.waitUntil(self.registration.showNotification(d.title || '💬 Tin nhắn mới', {
    body: d.body || 'Khách vừa nhắn, bot đã soạn nháp chờ duyệt', tag: d.tag || 'tn', renotify: true,
    icon: 'icon-192.png', badge: 'icon-192.png', data: {url: d.url || './?tab=tinnhan'}}));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './?tab=tinnhan', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(ws => {
    for (const w of ws) if ('focus' in w) { w.postMessage({mo: 'tinnhan'}); return w.focus(); }
    return self.clients.openWindow(url);
  }));
});
