importScripts("https://progressier.app/A0K7kzxcIrOaWtW8h3Ol/sw.js");
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

  const notificationPromise = self.registration.showNotification(title, { body, icon });

  const clientsPromise = self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients =>
  {
    clients.forEach(client =>
    {
      client.postMessage({
        type: 'NEW_NOTIFICATION',
        payload: payload.data
      });
    });
  });
  // Use event.waitUntil inside a push event listener
  self.addEventListener('push', function (event)
  {
    event.waitUntil(Promise.all([notificationPromise, clientsPromise]));
  });

});