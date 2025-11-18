/* public/firebase-messaging-sw.js */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// paste your web app firebaseConfig here
firebase.initializeApp({
 apiKey: "AIzaSyD1j6qOc8orWa-JFLRF-G-jVOW---92ww8",
  authDomain: "todowebapp-a0204.firebaseapp.com",
  projectId: "todowebapp-a0204",
  storageBucket: "todowebapp-a0204.firebasestorage.app",
  messagingSenderId: "937285709647",
  appId: "1:937285709647:web:fb0c0a6672e842f7591f3a",
  measurementId: "G-YG3THSTL55"

});

const messaging = firebase.messaging();

// Called when a notification arrives while the app is in the background
messaging.onBackgroundMessage((payload) => {
  // Optional: customize notification
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "Reminder", {
    body: body || "",
  });
});
self.addEventListener("push", (event) => {
  console.log("🔥 Push event received!", event);

  const data = event.data?.json() || {
    title: "Test Push",
    body: "Push triggered from DevTools",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
    })
  );
});
