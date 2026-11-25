import { duplex } from "./duplex.js";

"use strict";

const clientId = document.querySelector('meta[name="dashboard-google-client-id"]').content.trim();
const sessionEndpoint = document.querySelector('meta[name="dashboard-session-url"]').content.trim();
const statusMessage = document.getElementById("login-status");
const signIn = document.getElementById("google-sign-in");
const toolsPanel = document.getElementById("project-tools");
const signOut = document.getElementById("sign-out");
let verification;

function showSignIn(message) {
  verification?.abort();
  verification = undefined;
  duplex.signOut();
  toolsPanel.hidden = true;
  signIn.hidden = false;
  statusMessage.textContent = message;
}

async function verifySignIn({ credential }) {
  verification?.abort();
  const request = new AbortController();
  verification = request;
  statusMessage.textContent = "Checking access…";

  try {
    // The server verifies the Google ID token and applies the owner allowlist.
    const response = await fetch(sessionEndpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${credential}` },
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
      signal: request.signal,
    });

    if (verification !== request) return;

    if (response.status === 204) {
      statusMessage.textContent = "Signed in.";
      signIn.hidden = true;
      toolsPanel.hidden = false;
      duplex.signIn(credential);
      signOut.focus();
    } else if (response.status === 401 || response.status === 403) {
      showSignIn("This Google account does not have access.");
    } else {
      showSignIn("Could not verify access. Try again.");
    }
  } catch {
    if (verification === request) showSignIn("Could not reach the sign-in service. Try again.");
  }
}

signOut.addEventListener("click", () => {
  window.google.accounts.id.disableAutoSelect();
  showSignIn("Signed out.");
});

if (clientId && sessionEndpoint.startsWith("https://")) {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.addEventListener("load", () => {
    window.google.accounts.id.initialize({ client_id: clientId, callback: verifySignIn });
    window.google.accounts.id.renderButton(signIn, { theme: "outline", size: "large" });
    statusMessage.textContent = "Sign in with Google to open your project tools.";
  });
  script.addEventListener("error", () => {
    statusMessage.textContent = "Could not load Google sign-in. Reload to try again.";
  });
  document.head.append(script);
}
