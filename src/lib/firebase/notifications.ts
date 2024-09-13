import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { type Writable, writable } from "svelte/store";
import { post } from "$lib/api/utils.js";
import userSettings from "$lib/store/user-settings.js";

export let messaging;

export function requestPermission()
{
  const uid = (userSettings.extract("uid") || "") as string;
  if (!uid) return false;
  setMessaging();
  return Notification.requestPermission().then(async (permission) =>
  {
    if (permission === 'granted')
    {
      const key = import.meta.env?.VITE_FIREBASE_MESSAGING_VAPID_PUBLIC_KEY;
      getToken(messaging, { vapidKey: key })
        .then((currentToken) =>
        {
          if (currentToken)
          {
            post('/api/notifications/settings', {
              uid, type: "device",
              data: {
                deviceToken: currentToken
              }
            });
            localStorage.setItem('fcmToken', currentToken);
          } else
          {
            console.log('No registration token available.');
          }
          showWelcomeNotification();
        })
        .catch((err) =>
        {
          console.log('An error occurred while retrieving token.', err);
          return false
        });
      return true
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
  if (messaging) return
  const audio = new Audio('/audio/notification.mp3');
  messaging = getMessaging();
  onMessage(messaging, (payload) =>
  {
    new Notification(payload?.data?.title || "Betarena", {
      body: payload.data?.body || "New notification",
      icon: '/assets/img/192x192.png',
    });
    newNotifications.update((notifications) => [...notifications, payload]);
    notReadNotifications.update((notifications) => [...notifications, payload]);
    audio.play();

  });

  // if (navigator.serviceWorker)
  // {
  //   navigator.serviceWorker.addEventListener('message', (event) =>
  //   {
  //     if (event.data && event.data.type === 'NEW_NOTIFICATION')
  //     {
  //       const payload = event.data.payload;
  //       newNotifications.update((notifications) => [...notifications, payload]);
  //       audio.play();
  //     }
  //   });
  // }

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
  post(`https://us-central1-betarena-ios.cloudfunctions.net/api/messaging/multicast?uid=${userSettings.extract('uid')}`, {});
}
export const newNotifications: Writable<any[]> = writable([]);
export const notReadNotifications: Writable<any[]> = writable([]);
export function setNotReadNotifications(notifications)
{
  const not_read = notifications.filter((m) => !m.is_read);
  notReadNotifications.set(not_read);
}

