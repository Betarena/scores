importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Set Firebase configuration, once available
self.addEventListener('fetch', () =>
{
  const urlParams = new URLSearchParams(location.search);
  self.firebaseConfig = Object.fromEntries(urlParams);
});

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

// Initialize Firebase app
firebase.initializeApp(self.firebaseConfig || defaultConfig);
const messaging = firebase.messaging();

// Configure message handler (assumes backend is set up)
messaging.onBackgroundMessage((payload) =>
{
  const { icon, body, title } = payload.data;
  self.registration.showNotification(title, { body, icon });
});

self.addEventListener('push', function (event)
{
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: 'icons/icon-192x192.png',
    badge: 'icons/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});