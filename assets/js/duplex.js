const base = document.querySelector('meta[name="duplex-api-url"]').content.trim();
const launch = document.querySelector("#duplex-launch");
const start = document.querySelector("#duplex-start");
const stop = document.querySelector("#duplex-stop");
const message = document.querySelector("#duplex-message");
const backing = document.querySelector("#duplex-backing");

let credential;
let requestScope;
let microphone;
let peer;
let statusTimer;
let connecting = false;
let stopping = false;

async function api(path, { method = "GET", body } = {}) {
  const response = await fetch(new URL(`/duplex/${path}`, base), {
    method, body, signal: requestScope.signal,
    headers: {
      Authorization: `Bearer ${credential}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store", credentials: "omit", redirect: "error",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Request failed (${response.status}).`);
  }
  return response.json();
}

function closeMedia() {
  const connection = peer;
  peer = undefined;
  connection?.close();
  microphone?.getTracks().forEach(track => track.stop());
  microphone = undefined;
  backing.srcObject = null;
  backing.hidden = true;
}

function stopPolling() {
  clearTimeout(statusTimer);
}

function pollAgain() {
  stopPolling();
  statusTimer = setTimeout(refresh, 3000);
}

async function refresh() {
  const scope = requestScope;
  if (!scope || stopping) return;
  try {
    const { state } = await api("state");
    if (scope !== requestScope || stopping) return;
    launch.disabled = state !== "stopped";
    stop.disabled = state !== "active";
    if (state !== "active") {
      closeMedia();
      start.disabled = true;
      message.textContent = state === "stopping" ? "Stopping GPU…" :
        state === "stopped" ? "GPU is off." : "GPU launch is unavailable.";
      if (state === "stopping") pollAgain();
      return;
    }
    if (peer || connecting) {
      pollAgain();
      return;
    }
    try {
      await api("ready");
      if (scope !== requestScope || stopping) return;
      start.disabled = false;
      message.textContent = "Ready. Start your jam when you’re set.";
      pollAgain();
    } catch {
      if (scope !== requestScope || stopping) return;
      start.disabled = true;
      message.textContent = "Warming up the GPU…";
      pollAgain();
    }
  } catch (error) {
    if (scope === requestScope) message.textContent = error.message;
  }
}

launch.addEventListener("click", async () => {
  const scope = requestScope;
  launch.disabled = true;
  try {
    await api("launch", { method: "POST" });
    if (scope === requestScope) await refresh();
  } catch (error) {
    if (scope !== requestScope || stopping) return;
    await refresh();
    message.textContent = error.message;
  }
});

function gatherCandidates(connection) {
  if (connection.iceGatheringState === "complete") return Promise.resolve();
  return new Promise(resolve => {
    const finish = () => {
      clearTimeout(timeout);
      connection.removeEventListener("icegatheringstatechange", onChange);
      resolve();
    };
    const onChange = () => {
      if (connection.iceGatheringState === "complete") finish();
    };
    const timeout = setTimeout(finish, 2500);
    connection.addEventListener("icegatheringstatechange", onChange);
  });
}

start.addEventListener("click", async () => {
  const scope = requestScope;
  start.disabled = true;
  connecting = true;
  message.textContent = "Connecting microphone…";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
    });
    if (scope !== requestScope || stop.disabled) {
      stream.getTracks().forEach(track => track.stop());
      return;
    }
    microphone = stream;
    const connection = new RTCPeerConnection();
    peer = connection;
    connection.addEventListener("track", ({ track }) => {
      if (peer !== connection) return;
      backing.srcObject = new MediaStream([track]);
      backing.hidden = false;
      backing.play().catch(() => {
        if (peer === connection) message.textContent = "Press play on the backing audio to hear it.";
      });
    });
    connection.addEventListener("connectionstatechange", () => {
      if (peer !== connection) return;
      if (connection.connectionState === "connected") {
        message.textContent = "Jam is live.";
      } else if (["failed", "closed"].includes(connection.connectionState)) {
        closeMedia();
        start.disabled = false;
        message.textContent = "Audio disconnected. Try Start Jam again.";
      }
    });
    stream.getAudioTracks().forEach(track => connection.addTrack(track, stream));
    await connection.setLocalDescription(await connection.createOffer());
    await gatherCandidates(connection);
    if (peer !== connection) return;
    const answer = await api("offer", {
      method: "POST", body: JSON.stringify({ sdp: connection.localDescription.sdp }),
    });
    if (peer === connection) await connection.setRemoteDescription(answer);
  } catch (error) {
    if (scope !== requestScope || stop.disabled) return;
    closeMedia();
    start.disabled = false;
    message.textContent = error.message;
  } finally {
    if (scope === requestScope) connecting = false;
  }
});

stop.addEventListener("click", async () => {
  const scope = requestScope;
  stopping = true;
  stopPolling();
  closeMedia();
  launch.disabled = true;
  start.disabled = true;
  stop.disabled = true;
  message.textContent = "Stopping GPU…";
  try {
    await api("stop", { method: "POST" });
    if (scope === requestScope) {
      stopping = false;
      await refresh();
    }
  } catch (error) {
    if (scope === requestScope) {
      stopping = false;
      stop.disabled = false;
      message.textContent = error.message;
    }
  }
});

export const duplex = {
  signIn(token) {
    this.signOut();
    if (!base.startsWith("https://")) return;
    credential = token;
    requestScope = new AbortController();
    refresh();
  },
  signOut() {
    stopPolling();
    closeMedia();
    requestScope?.abort();
    requestScope = undefined;
    credential = undefined;
    connecting = false;
    stopping = false;
    launch.disabled = start.disabled = stop.disabled = true;
    message.textContent = "Live jam is awaiting deployment.";
  },
};

window.addEventListener("pagehide", () => duplex.signOut());
