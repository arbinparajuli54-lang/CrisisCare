function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('show');
  });
}

function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabButtons.length || !tabPanels.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      if (!tabId) return;

      tabButtons.forEach((b) => b.classList.remove('active'));
      tabPanels.forEach((panel) => panel.classList.remove('active'));

      button.classList.add('active');
      const targetPanel = document.getElementById(tabId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

function setupFaqs() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}

// OpenStreetMap (Leaflet): Help Map initialisation
function initHelpMap() {
  const mapElement = document.getElementById('help-map');
  if (!mapElement || typeof L === 'undefined') {
    return;
  }

  // Default center (Swoyambhu, Kathmandu, Nepal)
  const defaultCenter = [27.7149, 85.2901];

  const map = L.map(mapElement).setView(defaultCenter, 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // Try to move the map to the user's real-time location
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = [position.coords.latitude, position.coords.longitude];
        map.setView(userPos, 15);

        L.circleMarker(userPos, {
          radius: 9,
          color: '#052e16',
          weight: 2,
          fillColor: '#22c55e',
          fillOpacity: 1,
        })
          .addTo(map)
          .bindPopup('You are here')
          .openPopup();
      },
      () => {
        // Ignore errors and keep default center
      }
    );
  }

  // Sample emergency locations around Swoyambhu with category and colour
  const locations = [
    {
      coords: [27.7165, 85.2918],
      title: 'Swoyambhu Community Hospital (Demo)',
      type: 'hospital',
    },
    {
      coords: [27.7158, 85.288],
      title: 'Swoyambhu Area Police Post (Demo)',
      type: 'police',
    },
    {
      coords: [27.7135, 85.2935],
      title: 'Ring Road Fire & Rescue Point (Demo)',
      type: 'fire',
    },
    {
      coords: [27.7122, 85.2872],
      title: 'Local Community Relief Shelter (Demo)',
      type: 'shelter',
    },
  ];

  const typeColors = {
    hospital: '#f97316',
    police: '#38bdf8',
    fire: '#ef4444',
    shelter: '#22c55e',
  };

  locations.forEach((loc) => {
    const color = typeColors[loc.type] || '#ffffff';

    L.circleMarker(loc.coords, {
      radius: 8,
      color: '#020617',
      weight: 2,
      fillColor: color,
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup(`<strong>${loc.title}</strong><br/>Type: ${loc.type}`);
  });
}

// In-memory store of community form entries (also mirrored in localStorage)
let communityEntries = [];

function loadCommunityEntries() {
  try {
    const raw = localStorage.getItem('communityEntries');
    communityEntries = raw ? JSON.parse(raw) : [];
  } catch {
    communityEntries = [];
  }
}

function saveCommunityEntries() {
  localStorage.setItem('communityEntries', JSON.stringify(communityEntries));
}

// Submit community help form using AJAX so page doesn't navigate
function submitCommunityForm(event) {
  event.preventDefault();

  const form = event.target;
  const statusEl = document.getElementById('community-status');
  if (statusEl) {
    statusEl.textContent = 'Submitting...';
  }

  const formData = new FormData(form);
  const body = new URLSearchParams(formData);

  fetch('/api/community-help', {
    method: 'POST',
    body,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Server returned ' + res.status);
      }
      return res.json();
    })
    .then(() => {
      // Also track in localStorage (optional, for browser-side reference)
      const data = {
        role: form.role.value,
        name: form.name.value,
        email: form.email.value,
        city: form.city.value,
        supportType: form['support-type'].value,
        message: form.message.value,
        submittedAt: new Date().toISOString(),
      };
      communityEntries.push(data);
      saveCommunityEntries();

      form.reset();
      if (statusEl) {
        statusEl.textContent = 'Thank you! Your information has been saved.';
      }
    })
    .catch((err) => {
      if (statusEl) {
        statusEl.textContent =
          'There was a problem saving your details. Make sure the Node.js server is running.';
      }
      console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavToggle();
  setupTabs();
  setupFaqs();
  loadCommunityEntries();
  initHelpMap();
});


