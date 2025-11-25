const WebSocket = require('ws');

// WebSocket server URL
const WS_URL = 'ws://localhost:3001';

// Create WebSocket connection
const ws = new WebSocket(WS_URL);

// Connection opened
ws.on('open', () => {
  console.log('Connected to WebSocket server');
  
  // Subscribe to navigation updates
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'navigation_updates'
  }));
  
  console.log('Subscribed to navigation updates');
});

// Listen for messages
ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    console.log('\n=== Received Update ===');
    console.log('Type:', message.type);
    console.log('Timestamp:', new Date().toISOString());
    
    if (message.type === 'navigation_update' && Array.isArray(message.payload)) {
      console.log('Navigation Updates:');
      message.payload.forEach(update => {
        console.log(`- ID: ${update.id}, Count: ${update.count}, Updated: ${update.lastUpdated}`);
      });
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

// Handle errors
ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Handle connection close
ws.on('close', () => {
  console.log('Disconnected from WebSocket server');  
  process.exit(0);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Closing WebSocket connection...');
  ws.close();
});
