import { getMessaging, getToken, type Messaging, onMessage } from "firebase/messaging";
import { type Writable, writable } from "svelte/store";
import { post } from "$lib/api/utils.js";
import { app } from "./init.js";

export let messaging: Messaging;
export let token;

export function requestPermission()
{
  return Notification.requestPermission().then(async (permission) =>
  {
    if (permission === 'granted')
    {
      // const key = import.meta.env?.VITE_FIREBASE_MESSAGING_VAPID_PUBLIC_KEY;
      return true
      // return getToken(messaging, { vapidKey: key })
      //   .then((currentToken) =>
      //   {
      //     if (currentToken)
      //     {
      //       // console.log('FCM Token:', currentToken);
      //       // Send token to your backend server and store it
      //     } else
      //     {
      //       console.log('No registration token available.');
      //     }
      //     showWelcomeNotification();
      //     return true
      //   })
      //   .catch((err) =>
      //   {
      //     console.log('An error occurred while retrieving token.', err);
      //     return false
      //   });
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
    return true;
  };
  return false;
}


function setMessaging()
{
  if (!messaging)
  {

    messaging = getMessaging(app);
  }
  return messaging;
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

  post(`https://us-central1-betarena-ios.cloudfunctions.net/api/messaging/test?userToken=${token}`, {});
}

function setHandlers(messaging?: any)
{
  if (!messaging) return;
  const audio = new Audio('/audio/notification.mp3');
  onMessage(messaging, (payload) =>
  {
    new Notification(payload?.data?.title || "Betarena", {
      body: payload.data?.body || "New notification",
      icon: '/assets/img/192x192.png',
    });
    notifications.update((notifications) => [...notifications, payload]);
    audio.play();

  });
  messaging.onBackgroundMessageHandler = ((payload) =>
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

export async function initFMessaging(sw: ServiceWorkerRegistration)
{
  messaging = setMessaging();
  const key = import.meta.env?.VITE_FIREBASE_MESSAGING_VAPID_PUBLIC_KEY;
  token = await getToken(messaging, { vapidKey: key, serviceWorkerRegistration: sw });
  setHandlers(messaging);
}

export const notifications: Writable<any[]> = writable([]);