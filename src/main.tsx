import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../styles/globals.css";

// Mobile performance optimizations
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Service worker registration failed - ignore silently
    });
  });
}

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false,
);

// Prevent pinch zoom
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);