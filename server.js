const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON (if you later send JSON from frontend)
app.use(express.json());

// Serve all static files (HTML, CSS, JS, images) from current folder
app.use(express.static(__dirname));

// Storage files for demo purposes
const JSON_FILE = path.join(__dirname, 'community-help-data.json');
const TEXT_FILE = path.join(__dirname, 'community-help-entries.txt');

function loadEntries() {
  try {
    const raw = fs.readFileSync(JSON_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  fs.writeFileSync(JSON_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

// API endpoint to receive community help form submissions
app.post('/api/community-help', (req, res) => {
  const { role, name, email, city, 'support-type': supportType, message } = req.body;

  // Basic server-side validation (demo level)
  if (!role || !name || !email) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const entries = loadEntries();
  const newEntry = {
    id: Date.now(),
    role,
    name,
    email,
    city: city || '',
    supportType: supportType || '',
    message: message || '',
    createdAt: new Date().toISOString(),
  };

  entries.push(newEntry);
  saveEntries(entries);

  // Also append a human-readable version to a .txt file
  const lines = [
    '--- Community Help Entry ---',
    `Role: ${newEntry.role}`,
    `Name: ${newEntry.name}`,
    `Email: ${newEntry.email}`,
    `City: ${newEntry.city}`,
    `Support type: ${newEntry.supportType}`,
    `Message: ${newEntry.message}`,
    `Submitted at: ${newEntry.createdAt}`,
    '',
  ];

  fs.appendFileSync(TEXT_FILE, lines.join('\n'), 'utf8');

  // Respond with JSON so the front-end can stay on the same page
  res.json({ success: true });
});

// Optional: simple API to view stored entries (for debugging/demo)
app.get('/api/community-help', (req, res) => {
  const entries = loadEntries();
  res.json(entries);
});

app.listen(PORT, () => {
  console.log(`CrisisCare backend running on http://localhost:${PORT}`);
});


