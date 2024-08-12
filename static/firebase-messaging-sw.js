importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp(
  {
    apiKey: import.meta.env?.VITE_FIREBASE_DB_API_KEY,
    authDomain: import.meta.env?.VITE_FIREBASE_DB_AUTH_DOMAIN,
    projectId: import.meta.env?.VITE_FIREBASE_DB_PROJECT_ID,
    databaseURL: import.meta.env?.VITE_FIREBASE_DB_DATABASE_URL,
    storageBucket: import.meta.env?.VITE_FIREBASE_DB_STORAGE_BUCKET,
    messagingSenderId: import.meta.env?.VITE_FIREBASE_SENDER_ID,
    appId: import.meta.env?.VITE_FIREBASE_APP_ID,
  }
);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) =>
{
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/img/192x192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});