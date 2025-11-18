// firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD1j6qOc8orWa-JFLRF-G-jVOW---92ww8",
  authDomain: "todowebapp-a0204.firebaseapp.com",
  projectId: "todowebapp-a0204",
  storageBucket: "todowebapp-a0204.firebasestorage.app",
  messagingSenderId: "937285709647",
  appId: "1:937285709647:web:fb0c0a6672e842f7591f3a",
  measurementId: "G-YG3THSTL55"

};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export async function requestFcmToken(vapidKey: string) {
  await navigator.serviceWorker.register("/firebase-messaging-sw.js");

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: await navigator.serviceWorker.ready,
  });

  return token;
}

export function listenForeground(callback: any) {
  onMessage(messaging, callback);
}
