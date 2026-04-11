import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:80';
const API_URL = 'http://localhost:80/api/scores';

async function testRealtime() {
  console.log('--- Real-Time System Verification ---');
  
  const socket = io(SOCKET_URL);
  let updatedReceived = false;

  socket.on('connect', () => {
    console.log('1. Socket connected to server:', socket.id);
    
    // Once connected, trigger a score update via API
    console.log('2. Triggering score update via POST request...');
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'TEST_USER', score: 999 })
    })
    .then(res => res.json())
    .then(data => {
      console.log('3. POST success:', data);
    })
    .catch(err => {
      console.error('3. POST failed:', err);
      process.exit(1);
    });
  });

  socket.on('scoreUpdated', () => {
    console.log('4. SUCCESS: "scoreUpdated" event received from server!');
    updatedReceived = true;
    socket.disconnect();
    console.log('--- Verification Complete ---');
    process.exit(0);
  });

  // Timeout after 10 seconds
  setTimeout(() => {
    if (!updatedReceived) {
      console.error('FAILED: Timed out waiting for "scoreUpdated" event.');
      socket.disconnect();
      process.exit(1);
    }
  }, 10000);
}

testRealtime();
