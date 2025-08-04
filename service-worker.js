const CACHE_NAME = 'ud-anugrah-v1';
const urlsToCache = [
  '/',
  '/static/js/push-subscribe.js',
  '/static/user/style.css',
  '/static/user/hubungi.css',
  '/static/user/artikel.css',
  '/static/profile_pics/Profile_placeholder.png',
  '/static/misc/logo.svg',
  '/static/misc/home_banner.jpg',
  '/static/misc/hubungi_kami.jpeg',
  '/static/misc/login_banner.jpg',
  '/static/administrator/assets/image/article-2025-06-27-20-07-38.jpg',
  '/static/administrator/assets/css/bootstrap.min.css',
  '/static/administrator/assets/css/bootstrap.min.css.map',
  '/static/administrator/assets/css/fonts.css',
  '/static/administrator/assets/css/styleadmin.css',
  '/static/administrator/assets/fonts/flaticon/_flaticon.scss',
  '/static/administrator/assets/fonts/flaticon/Flaticon.eot',
  '/static/administrator/assets/fonts/flaticon/flaticon.html',
  '/static/administrator/assets/fonts/flaticon/Flaticon.svg',
  '/static/administrator/assets/fonts/flaticon/Flaticon.ttf',
  '/static/administrator/assets/fonts/flaticon/Flaticon.woff',
  '/static/administrator/assets/js/plugin/datatables/datatables.min.js',
  '/static/administrator/assets/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js',
  '/static/administrator/assets/js/plugin/jquery-ui-1.12.1.custom/jquery-ui.min.js',
  '/static/administrator/assets/js/plugin/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
  '/static/administrator/assets/js/bootstrap.min.js',
  '/static/administrator/assets/js/jquery.3.2.1.min.js',
  '/static/administrator/assets/js/popper.min.js',
  '/static/administrator/assets/js/ready.js',
  '/static/administrator/assets/js/ready.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       return response || fetch(event.request);
//     })
//   );
// });

// self.addEventListener("fetch", event => {
//     if (event.request.method === "POST" && event.request.url.includes("/profile_pics")) {
//         event.respondWith(handleUpload(event.request));
//     }
// });

self.addEventListener("fetch", event => {
  if (
    event.request.method === "POST" &&
    (
      event.request.url.includes("/profile_pics") ||
      event.request.url.includes("/administrator")
    )
  ) {
    event.respondWith(handleUpload(event.request));
  }
});


function handleUpload(request) {
  return fetch(request).then(response => {
    if (response.ok) {
      // Simpan gambar di cache
      caches.open("image-cache").then(cache => {
        cache.put(request.url, response.clone());
      });
      return response;
    } else {
      return Promise.reject("Gagal mengupload gambar");
    }
  });
}

// self.addEventListener('fetch', event => {
//   // Tangani upload POST tertentu
//   if (
//     event.request.method === "POST" &&
//     (
//       event.request.url.includes("/profile_pics") ||
//       event.request.url.includes("/administrator")
//     )
//   ) {
//     event.respondWith(handleUpload(event.request));
//   }

//   // Tangani semua permintaan GET (halaman, gambar, dll)
//   else if (event.request.method === "GET") {
//     event.respondWith(
//       caches.match(event.request).then(response => {
//         return response || fetch(event.request);
//       })
//     );
//   }
// });


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('push', event => {
  const payload = event.data.json();
  const options = {
    body: payload.body,
    icon: '/static/icons/icon-192x192.png',
    badge: '/static/icons/badge.png',
    data: { url: payload.url }
  };
  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});