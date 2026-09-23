const status = document.querySelector('#status');
const temperature = document.querySelector('#temperature');
const time = document.querySelector('#time');
const refresh = document.querySelector('#refresh');
async function read() {
  refresh.disabled = true;
  status.textContent = 'Checking the service…';
  try {
    const response = await fetch('/api/demo-reading');
    const payload = await response.json();
    // First load can precede service-worker control.
    const { reading, source } = 'source' in payload ? payload : { reading: payload, source: 'network' };
    temperature.textContent = reading ? `${reading.temperature} °F` : '—';
    time.textContent = reading ? `Recorded ${new Date(reading.recordedAt).toLocaleString()}` : 'No recent saved reading.';
    status.textContent = source === 'network' ? 'Live response · synthetic data' : source === 'saved' ? 'Saved reading · service unavailable; data may be out of date' : 'Unavailable · reconnect to load a fresh reading';
  } catch {
    temperature.textContent = '—'; time.textContent = '';
    status.textContent = 'Unavailable · no service response';
  } finally { refresh.disabled = false; }
}
refresh.addEventListener('click', read);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { type: 'module' }).then(registration => {
    const update = document.querySelector('#update');
    const showUpdate = () => { if (registration.waiting) update.hidden = false; };
    showUpdate();
    registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', showUpdate));
    update.addEventListener('click', () => registration.waiting?.postMessage('APPLY_UPDATE'));
    let controlled = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (controlled) location.reload();
      controlled = true;
    });
  }).catch(() => { document.querySelector('#support').textContent = 'Offline support unavailable in this browser.'; });
}
read();
