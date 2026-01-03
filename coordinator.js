const express = require('express');
const app = express();

// Shared state across all nodes
let globalCounter = 0;
const registeredNodes = [];

app.use(express.json());

// Node registration endpoint
app.post('/register', (req, res) => {
  const nodeId = req.body.nodeId;
  const nodeUrl = req.body.nodeUrl;

  if (!registeredNodes.find(n => n.nodeId === nodeId)) {
    registeredNodes.push({ nodeId, nodeUrl });
    console.log(`✅ Node ${nodeId} registered at ${nodeUrl}`);
  }

  res.json({
    success: true,
    counterValue: globalCounter,
    registeredNodes: registeredNodes.length
  });
});

// Get current counter value
app.get('/counter', (req, res) => {
  res.json({ counter: globalCounter, registeredNodes });
});

// Increment counter (from any node)
app.post('/increment', (req, res) => {
  const amount = req.body.amount || 1;
  const nodeId = req.body.nodeId;

  globalCounter += amount;
  console.log(`📈 Counter incremented by ${amount} (from node ${nodeId}). Current: ${globalCounter}`);

  res.json({
    counter: globalCounter,
    message: `Counter incremented by ${amount}`
  });
});

// Decrement counter
app.post('/decrement', (req, res) => {
  const amount = req.body.amount || 1;
  const nodeId = req.body.nodeId;

  globalCounter -= amount;
  console.log(`📉 Counter decremented by ${amount} (from node ${nodeId}). Current: ${globalCounter}`);

  res.json({
    counter: globalCounter,
    message: `Counter decremented by ${amount}`
  });
});

// Reset counter
app.post('/reset', (req, res) => {
  globalCounter = 0;
  console.log('🔄 Counter reset to 0');
  res.json({ counter: globalCounter, message: 'Counter reset' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', counter: globalCounter });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`
🎯 Distributed Counter Coordinator
────────────────────────────────
🚀 Coordinator running on http://localhost:${PORT}
📍 Endpoints:
   POST   /register          - Register a new node
   GET    /counter           - Get current counter value
   POST   /increment         - Increment counter
   POST   /decrement         - Decrement counter
   POST   /reset             - Reset counter
   GET    /health            - Health check
  `);
});
