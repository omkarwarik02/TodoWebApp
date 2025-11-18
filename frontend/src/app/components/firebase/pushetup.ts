import { requestFcmToken, listenForeground } from "./firebase";

export async function setupPushAfterLogin(jwt: string) {
  try {
    const vapidKey = "BOBJnGxA3ZsMtFOhX6Fi2mYksf5VVCoehVAvAQVoRb9Au95_J3VK-p-etHxoCHbQN2UR5CZyUcij_72Guu9e8ZI";

    const token = await requestFcmToken(vapidKey);
    if (!token) return;

    await fetch("http://localhost:5000/api/notifications/save-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify({ token }),
    });

    listenForeground((payload: any) => {
      console.log("🔔 Foreground FCM:", payload);
    });
  } catch (e) {
    console.error("FCM setup failed", e);
  }
}
