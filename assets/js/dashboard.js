"use strict";

const clientId = document.querySelector('meta[name="dashboard-google-client-id"]').content.trim();
const sessionEndpoint = document.querySelector('meta[name="dashboard-session-url"]').content.trim();
const statusMessage = document.getElementById("login-status");
const signIn = document.getElementById("google-sign-in");
const toolsPanel = document.getElementById("project-tools");
const signOut = document.getElementById("sign-out");
const duplexOpen = document.getElementById("duplex-open");
const duplexPanel = document.getElementById("duplex-panel");
const duplexStatus = document.getElementById("duplex-status");
const duplexRefresh = document.getElementById("duplex-refresh");
let verification;
let ownerCredential;

function showSignIn(message) {
  verification?.abort();
  verification = undefined;
  ownerCredential = undefined;
  duplexPanel.hidden = true;
  duplexOpen.setAttribute("aria-expanded", "false");
  duplexRefresh.disabled = false;
  duplexStatus.textContent = "";
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
      ownerCredential = credential;
      statusMessage.textContent = "Signed in.";
      signIn.hidden = true;
      toolsPanel.hidden = false;
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

async function checkJamStatus() {
  const request = verification;
  if (!request || !ownerCredential) return;

  duplexRefresh.disabled = true;
  duplexStatus.textContent = "Checking jam status…";
  try {
    const response = await fetch(new URL("./duplex/status", sessionEndpoint), {
      headers: { Authorization: `Bearer ${ownerCredential}` },
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
      signal: request.signal,
    });
    if (verification !== request) return;
    if (response.status === 401 || response.status === 403) {
      showSignIn("Sign in again to check Duplex Music.");
      return;
    }
    if (!response.ok) throw new Error("Status request failed");
    const { state } = await response.json();
    if (verification !== request) return;
    if (state !== "unconfigured") throw new Error("Unexpected jam status");
    duplexStatus.textContent = "Live jam is awaiting a GPU worker.";
  } catch {
    if (verification === request) duplexStatus.textContent = "Jam status is unavailable. Try again.";
  } finally {
    if (verification === request) duplexRefresh.disabled = false;
  }
}

duplexOpen.addEventListener("click", () => {
  duplexPanel.hidden = !duplexPanel.hidden;
  duplexOpen.setAttribute("aria-expanded", String(!duplexPanel.hidden));
  if (!duplexPanel.hidden && !duplexRefresh.disabled) checkJamStatus();
});
duplexRefresh.addEventListener("click", checkJamStatus);

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
