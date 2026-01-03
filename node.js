const express = require('express');
const axios = require('axios');
const app = express();

const COORDINATOR_URL = 'http://localhost:3000';
const port = process.argv[2] || 3001;
const nodeId = `NODE-${port}`;

let localCounter = 0;

app.use(express.json());

// Initialize: register with coordinator and get current state
async function registerWithCoordinator() {
  try {
    const response = await axios.post(`${COORDINATOR_URL}/register`, {
      nodeId,
      nodeUrl: `http://localhost:${port}`
    });
    localCounter = response.data.counterValue;
    console.log(`✅ Registered with coordinator. Current counter: ${localCounter}`);
    return true;
  } catch (error) {
    console.error(`⏳ Waiting for coordinator... (${COORDINATOR_URL})`);
    setTimeout(registerWithCoordinator, 2000);
    return false;
  }
}

// Sync counter value with coordinator
async function syncCounter() {
  try {
    const response = await axios.get(`${COORDINATOR_URL}/counter`);
    localCounter = response.data.counter;
  } catch (error) {
    console.error(`⚠️  Failed to sync with coordinator`);
  }
}

// Increment endpoint
app.post('/increment', async (req, res) => {
  const amount = req.body.amount || 1;

  try {
    // Send increment request to coordinator
    const response = await axios.post(`${COORDINATOR_URL}/increment`, {
      nodeId,
      amount
    });
    localCounter = response.data.counter;
    console.log(`📈 ${nodeId}: Counter incremented. New value: ${localCounter}`);
    res.json({ counter: localCounter, message: 'Incremented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment' });
  }
});

// Decrement endpoint
app.post('/decrement', async (req, res) => {
  const amount = req.body.amount || 1;

  try {
    const response = await axios.post(`${COORDINATOR_URL}/decrement`, {
      nodeId,
      amount
    });
    localCounter = response.data.counter;
    console.log(`📉 ${nodeId}: Counter decremented. New value: ${localCounter}`);
    res.json({ counter: localCounter, message: 'Decremented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to decrement' });
  }
});

// Get counter value
app.get('/counter', async (req, res) => {
  await syncCounter();
  res.json({ counter: localCounter, nodeId });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', nodeId, counter: localCounter });
});

app.listen(port, async () => {
  console.log(`
🔗 Node Server
────────────────
🚀 ${nodeId} running on http://localhost:${port}
⏳ Attempting to register with coordinator at ${COORDINATOR_URL}
📍 Endpoints:
   POST   /increment         - Increment counter
   POST   /decrement         - Decrement counter
   GET    /counter           - Get current counter
   GET    /health            - Health check
  `);
  
  // Register with coordinator after startup
  await registerWithCoordinator();
  
  // Sync with coordinator every 5 seconds
  setInterval(syncCounter, 5000);
});
