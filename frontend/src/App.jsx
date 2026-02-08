import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import PlayerView from './components/PlayerView';
import AdminView from './components/AdminView';
import Bubbles from './components/Bubbles';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const socket = io(API_URL);

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check localStorage for admin status
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Bubbles />
      
      {isAdmin ? (
        <AdminView socket={socket} />
      ) : (
        <PlayerView socket={socket} />
      )}
    </div>
  );
}

export default App;
