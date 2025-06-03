const CACHE_NAME = 'face-yourself-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/day',
  '/week',
  '/hour',
  '/face-yourself-logo.png',
  '/manifest.json'
];

// Service Worker のインストール
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
});

// リクエストの処理
self.addEventListener('fetch', (event) => {
  // chrome-extension スキームのリクエストは無視
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // データURLやblobURLも無視
  if (event.request.url.startsWith('data:') || event.request.url.startsWith('blob:')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }

        // キャッシュになければネットワークから取得
        return fetch(event.request).then(
          (response) => {
            // レスポンスが有効でない場合はそのまま返す
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // chrome-extension スキームのレスポンスはキャッシュしない
            if (event.request.url.startsWith('chrome-extension://')) {
              return response;
            }

            // レスポンスをクローンしてキャッシュに保存
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // キャッシュ可能なリクエストのみ保存
                if (event.request.method === 'GET' &&
                    !event.request.url.startsWith('chrome-extension://') &&
                    !event.request.url.startsWith('data:') &&
                    !event.request.url.startsWith('blob:')) {
                  cache.put(event.request, responseToCache);
                }
              })
              .catch((error) => {
                console.error('Cache put failed:', error);
              });

            return response;
          }
        );
      })
      .catch((error) => {
        console.error('Fetch failed:', error);
        // オフライン時のフォールバック
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// 古いキャッシュの削除
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});