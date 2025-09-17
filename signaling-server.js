const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const rooms = new Map();

wss.on('connection', (ws) => {
  console.log('📱 New client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📨 Received:', data.type);
      
      switch (data.type) {
        case 'join-room':
          const roomId = data.room || 'default';
          ws.roomId = roomId;
          
          if (!rooms.has(roomId)) {
            rooms.set(roomId, []);
          }
          
          rooms.get(roomId).push(ws);
          console.log(`👥 Client joined room: ${roomId} (${rooms.get(roomId).length} clients)`);
          
          // Notify other clients in room
          rooms.get(roomId).forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'user-joined',
                count: rooms.get(roomId).length
              }));
            }
          });
          break;
          
        case 'offer':
        case 'answer':
        case 'ice-candidate':
          // Forward to other clients in the same room
          if (ws.roomId && rooms.has(ws.roomId)) {
            rooms.get(ws.roomId).forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
              }
            });
          }
          break;
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('👋 Client disconnected');
    
    // Remove from room
    if (ws.roomId && rooms.has(ws.roomId)) {
      const roomClients = rooms.get(ws.roomId);
      const index = roomClients.indexOf(ws);
      if (index > -1) {
        roomClients.splice(index, 1);
        
        if (roomClients.length === 0) {
          rooms.delete(ws.roomId);
        } else {
          // Notify remaining clients
          roomClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'user-left',
                count: roomClients.length
              }));
            }
          });
        }
      }
    }
  });
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to signaling server'
  }));
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Signaling server running on http://localhost:${PORT}`);
  console.log(`📱 Mobile devices can connect to: http://10.255.0.8:${PORT}`);
});