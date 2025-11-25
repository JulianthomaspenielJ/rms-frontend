const WebSocket = require('ws');
const http = require('http');
const express = require('express');

// Create HTTP server
const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  clients.add(ws);

  // Send initial navigation data
  sendNavigationUpdate(ws);

  // Set up periodic updates (every 30 seconds)
  const updateInterval = setInterval(() => {
    sendNavigationUpdate(ws);
  }, 30000);

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
    clearInterval(updateInterval);
  });

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      
      // Handle different message types
      if (data.type === 'subscribe') {
        console.log(`Client subscribed to channel: ${data.channel}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Function to generate random navigation updates
function generateNavigationUpdate() {
  return [
    { 
      id: 2, // Jobs
      count: Math.floor(Math.random() * 10), // Random count between 0-9
      lastUpdated: new Date().toISOString()
    },
    { 
      id: 3, // Candidates
      count: Math.floor(Math.random() * 15), // Random count between 0-14
      lastUpdated: new Date().toISOString()
    },
    { 
      id: 4, // Interviews
      count: Math.floor(Math.random() * 5), // Random count between 0-4
      lastUpdated: new Date().toISOString()
    }
  ];
}

// Function to send navigation update to a client
function sendNavigationUpdate(ws) {
  const update = {
    type: 'navigation_update',
    payload: generateNavigationUpdate()
  };
  
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(update));
  }
}

// Broadcast navigation update to all connected clients
function broadcastNavigationUpdate() {
  const update = {
    type: 'navigation_update',
    payload: generateNavigationUpdate()
  };
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(update));
    }
  });
}

// Set up HTTP routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', clients: clients.size });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

// For manual testing: Broadcast updates every 30 seconds
setInterval(broadcastNavigationUpdate, 30000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  wss.close(() => {
    console.log('WebSocket server closed');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
});
