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

function demoSubmit() {
  alert(
    'Thank you! This is a demo form only.\n\nIn a real deployment, your details would be securely sent to coordinators.'
  );
}

// Google Maps: Help Map initialisation
function initHelpMap() {
  const mapElement = document.getElementById('help-map');
  if (!mapElement || !window.google || !google.maps) {
    return;
  }

  // Default center (used if geolocation is not available or is denied)
  const defaultCenter = { lat: 27.7172, lng: 85.324 }; // Kathmandu as an example

  const map = new google.maps.Map(mapElement, {
    center: defaultCenter,
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: [
      {
        elementType: 'geometry',
        stylers: [{ color: '#0b1120' }],
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ color: '#e5e7eb' }],
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#020617' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#1f2937' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#0ea5e9' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#064e3b' }],
      },
    ],
  });

  // Try to move the map to the user's real-time location
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(userPos);
        map.setZoom(14);

        new google.maps.Marker({
          position: userPos,
          map,
          title: 'You are here',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#22c55e',
            fillOpacity: 1,
            strokeColor: '#052e16',
            strokeWeight: 2,
          },
        });
      },
      () => {
        // If user denies or it fails, we just stay on the default center
      }
    );
  }

  // Sample emergency locations with category and colour
  const locations = [
    {
      position: { lat: 27.7167, lng: 85.3200 },
      title: 'Central City Hospital',
      type: 'hospital',
    },
    {
      position: { lat: 27.7195, lng: 85.3255 },
      title: 'Main Police Headquarters',
      type: 'police',
    },
    {
      position: { lat: 27.7215, lng: 85.3315 },
      title: 'North Fire Station',
      type: 'fire',
    },
    {
      position: { lat: 27.7125, lng: 85.3185 },
      title: 'Community Relief Shelter',
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
    const color = typeColors[loc.type] || '#fff';

    const marker = new google.maps.Marker({
      position: loc.position,
      map,
      title: loc.title,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#020617',
        strokeWeight: 2,
      },
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<strong>${loc.title}</strong><br/>Type: ${loc.type}`,
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavToggle();
  setupTabs();
  setupFaqs();
});


