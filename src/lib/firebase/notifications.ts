import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { type Writable, writable } from "svelte/store";
import { post } from "$lib/api/utils.js";

export let messaging;

export function requestPermission()
{
  setMessaging();
  return Notification.requestPermission().then(async (permission) =>
  {
    if (permission === 'granted')
    {
      const key = import.meta.env?.VITE_FIREBASE_MESSAGING_VAPID_PUBLIC_KEY;
      return getToken(messaging, { vapidKey: key })
        .then((currentToken) =>
        {
          if (currentToken)
          {
            // console.log('FCM Token:', currentToken);
            // Send token to your backend server and store it
          } else
          {
            console.log('No registration token available.');
          }
          showWelcomeNotification();
          return true
        })
        .catch((err) =>
        {
          console.log('An error occurred while retrieving token.', err);
          return false
        });
    } else
    {

      console.log('Permission not granted for notifications.');
      return false
    }
  });
}


export function checkNotificationPermission()
{
  if (Notification.permission === 'granted' || Notification.permission === 'denied')
  {
    setMessaging();
    return true;
  };
  return false;
}


function setMessaging()
{
  if (!messaging)
  {
    const audio = new Audio('/audio/notification.mp3');
    messaging = getMessaging();
    onMessage(messaging, (payload) =>
    {
      new Notification(payload?.data?.title || "Betarena", {
        body: payload.data?.body || "New notification",
        icon: '/assets/img/192x192.png',
      });
      notifications.update((notifications) => [...notifications, payload]);
      audio.play();

    });

    if (navigator.serviceWorker)
    {
      navigator.serviceWorker.addEventListener('message', (event) =>
      {
        if (event.data && event.data.type === 'NEW_NOTIFICATION')
        {
          const payload = event.data.payload;
          notifications.update((notifications) => [...notifications, payload]);
          audio.play();
        }
      });
    }

  }
}


export function showWelcomeNotification()
{
  if ('serviceWorker' in navigator && Notification.permission === 'granted')
  {
    navigator.serviceWorker.ready.then(function (registration)
    {
      registration.showNotification('Welcome to Scores', {
        body: 'Congrats! You will now receive notifications from betarena.',
        icon: '/assets/img/192x192.png'
      });
    });
  }
}

export function mockNotification()
{

  const key = import.meta.env?.VITE_FIREBASE_MESSAGING_VAPID_PUBLIC_KEY;
  getToken(messaging, { vapidKey: key })
    .then((currentToken) =>
    {
      post(`https://us-central1-betarena-ios.cloudfunctions.net/api/messaging/test?userToken=${currentToken}`, {});
      return true
    })
    .catch((err) =>
    {
      console.log('An error occurred while retrieving token.', err);
      return false
    });
}

export const notifications: Writable<any[]> = writable([]);