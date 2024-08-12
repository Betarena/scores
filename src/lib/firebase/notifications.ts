import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./init.js";
import { type Writable, writable } from "svelte/store";

export let messaging;

export function requestPermission()
{
  if (!messaging)
  {
    messaging = getMessaging(app);
    onMessage(messaging, (payload) =>
    {
      console.log('Message received. ', payload);
      debugger;

      notifications.update((notifications) => [...notifications, {
        title: payload.notification?.title,
        body: payload.notification?.body,
        data: payload.data
      }]);

    });

  }

  return Notification.requestPermission().then((permission) =>
  {
    if (permission === 'granted')
    {
      const key = import.meta.env?.VITE_FIREBASE_MESSAGING_VAPID_PUBLIC_KEY;
      console.log("KEY: ", key)
      return getToken(messaging, { vapidKey: key })
        .then((currentToken) =>
        {
          if (currentToken)
          {
            console.log('FCM Token:', currentToken);
            // Send token to your backend server and store it
          } else
          {
            console.log('No registration token available.');
          }
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
  if (Notification.permission === 'granted' || Notification.permission === 'denied') return true;
  return false;
}


export const notifications: Writable<any[]> = writable([]);