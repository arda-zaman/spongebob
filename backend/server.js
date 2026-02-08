import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameManager } from './gameManager.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const gameManager = new GameManager(io);

// REST Endpoints
app.post('/api/start-game', (req, res) => {
  const result = gameManager.startGame();
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

app.post('/api/reset-game', (req, res) => {
  const result = gameManager.resetGame();
  res.json(result);
});

app.get('/api/status', (req, res) => {
  res.json({
    state: gameManager.gameState,
    playerCount: gameManager.getPlayerCount(),
    currentQuestion: gameManager.currentQuestionIndex
  });
});

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join-game', (data) => {
    gameManager.handleJoinGame(socket, data);
  });

  socket.on('answer-submitted', (data) => {
    gameManager.handleAnswerSubmitted(socket, data);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    gameManager.handleDisconnect(socket);
  });
});

server.listen(3001, () => {
  console.log('🍍 SpongeBob Trivia Server running on port 3001');
});
