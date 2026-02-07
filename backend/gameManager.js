import { CHARACTERS, QUESTIONS } from './gameData.js';

export class GameManager {
  constructor(io) {
    this.io = io;
    this.gameState = 'LOBBY'; // LOBBY, PLAYING, FINISHED
    this.players = new Map(); // socketId -> player data
    this.characterRegistry = {}; // character -> { socketId, playerName } or null
    this.currentQuestionIndex = 0;
    this.currentAnswers = new Map(); // socketId -> answer data
    this.questionTimer = null;
    this.questionStartTime = null;

    // Initialize character registry
    CHARACTERS.forEach(char => {
      this.characterRegistry[char] = null;
    });
  }

  getPlayerCount() {
    let count = 0;
    this.players.forEach(player => {
      if (!player.isAdmin) count++;
    });
    return count;
  }

  getLobbyData() {
    const players = [];
    const availableCharacters = [];
    const takenCharacters = {};

    this.players.forEach((player, socketId) => {
      players.push({
        socketId,
        name: player.name,
        character: player.character,
        isAdmin: player.isAdmin
      });
    });

    Object.entries(this.characterRegistry).forEach(([char, data]) => {
      if (data === null) {
        availableCharacters.push(char);
      } else {
        takenCharacters[char] = data.playerName;
      }
    });

    return { players, availableCharacters, takenCharacters };
  }

  handleJoinGame(socket, data) {
    const { name, character, isAdmin } = data;

    if (this.gameState !== 'LOBBY') {
      socket.emit('error', { message: 'Game already in progress' });
      return;
    }

    // Admin doesn't need a character
    if (isAdmin) {
      this.players.set(socket.id, {
        name: name || 'Admin',
        character: null,
        score: 0,
        isAdmin: true
      });
      this.io.emit('lobby-updated', this.getLobbyData());
      return;
    }

    // Check if character is available
    if (character && this.characterRegistry[character] !== null) {
      socket.emit('character-taken', { 
        character, 
        takenBy: this.characterRegistry[character].playerName 
      });
      return;
    }

    // Release previous character if player had one
    const existingPlayer = this.players.get(socket.id);
    if (existingPlayer && existingPlayer.character) {
      this.characterRegistry[existingPlayer.character] = null;
    }

    // Assign character
    if (character) {
      this.characterRegistry[character] = {
        socketId: socket.id,
        playerName: name
      };
    }

    this.players.set(socket.id, {
      name,
      character,
      score: 0,
      isAdmin: false
    });

    this.io.emit('lobby-updated', this.getLobbyData());
  }

  handleDisconnect(socket) {
    const player = this.players.get(socket.id);
    
    if (player) {
      // Release character
      if (player.character) {
        this.characterRegistry[player.character] = null;
      }
      this.players.delete(socket.id);
    }

    this.io.emit('lobby-updated', this.getLobbyData());
  }

  startGame() {
    if (this.gameState !== 'LOBBY') {
      return { success: false, message: 'Game already in progress' };
    }

    const playerCount = this.getPlayerCount();
    if (playerCount < 2) {
      return { success: false, message: 'Need at least 2 players to start' };
    }

    this.gameState = 'PLAYING';
    this.currentQuestionIndex = 0;
    
    // Reset scores
    this.players.forEach((player, socketId) => {
      player.score = 0;
    });

    this.io.emit('game-started');
    
    // Start first question after a short delay
    setTimeout(() => {
      this.sendQuestion();
    }, 2000);

    return { success: true, message: 'Game started' };
  }

  sendQuestion() {
    if (this.currentQuestionIndex >= QUESTIONS.length) {
      this.endGame();
      return;
    }

    const question = QUESTIONS[this.currentQuestionIndex];
    this.currentAnswers.clear();
    this.questionStartTime = Date.now();

    this.io.emit('new-question', {
      questionId: question.id,
      question: question.question,
      options: question.options,
      timeLimit: question.timeLimit,
      questionNumber: this.currentQuestionIndex + 1,
      totalQuestions: QUESTIONS.length
    });

    // Set timer for question end
    this.questionTimer = setTimeout(() => {
      this.endQuestion();
    }, question.timeLimit * 1000 + 1000); // Extra second for network latency
  }

  handleAnswerSubmitted(socket, data) {
    if (this.gameState !== 'PLAYING') return;
    
    const player = this.players.get(socket.id);
    if (!player || player.isAdmin) return;

    // Prevent duplicate answers
    if (this.currentAnswers.has(socket.id)) return;

    const { questionId, answerIndex, timestamp } = data;
    const question = QUESTIONS[this.currentQuestionIndex];
    
    if (questionId !== question.id) return;

    const answerTime = Date.now() - this.questionStartTime;
    
    this.currentAnswers.set(socket.id, {
      answerIndex,
      timestamp,
      answerTime
    });

    // Emit to admin for real-time tracking
    this.io.emit('player-answered', {
      socketId: socket.id,
      playerName: player.name,
      character: player.character,
      answerIndex,
      answerTime
    });
  }

  endQuestion() {
    const question = QUESTIONS[this.currentQuestionIndex];
    const correctAnswer = question.correctAnswer;
    const timeLimit = question.timeLimit * 1000;

    // Calculate scores
    this.players.forEach((player, socketId) => {
      if (player.isAdmin) return;

      const answer = this.currentAnswers.get(socketId);
      
      if (!answer) {
        // No answer: 0 points
        return;
      }

      if (answer.answerIndex === correctAnswer) {
        // Correct answer: +10 points
        player.score += 10;
        
        // Speed bonus: +5 if answered in first 50% of time
        if (answer.answerTime < timeLimit * 0.5) {
          player.score += 5;
        }
      } else {
        // Wrong answer: -5 points
        player.score -= 5;
      }
    });

    // Build leaderboard
    const leaderboard = this.buildLeaderboard();

    this.io.emit('question-results', {
      questionId: question.id,
      correctAnswer,
      leaderboard
    });

    this.currentQuestionIndex++;

    // Next question after delay
    setTimeout(() => {
      this.sendQuestion();
    }, 4000);
  }

  buildLeaderboard() {
    const leaderboard = [];
    
    this.players.forEach((player, socketId) => {
      if (!player.isAdmin) {
        leaderboard.push({
          socketId,
          name: player.name,
          character: player.character,
          score: player.score
        });
      }
    });

    leaderboard.sort((a, b) => b.score - a.score);

    return leaderboard.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  }

  endGame() {
    this.gameState = 'FINISHED';
    
    const finalLeaderboard = this.buildLeaderboard();

    this.io.emit('game-ended', { finalLeaderboard });
  }

  resetGame() {
    // Clear timer if running
    if (this.questionTimer) {
      clearTimeout(this.questionTimer);
      this.questionTimer = null;
    }

    this.gameState = 'LOBBY';
    this.currentQuestionIndex = 0;
    this.currentAnswers.clear();

    // Reset scores and release all characters
    this.players.forEach((player, socketId) => {
      player.score = 0;
      if (player.character) {
        this.characterRegistry[player.character] = null;
      }
      player.character = null;
    });

    // Reset character registry
    CHARACTERS.forEach(char => {
      this.characterRegistry[char] = null;
    });

    this.io.emit('game-reset');
    this.io.emit('lobby-updated', this.getLobbyData());

    return { success: true, message: 'Game reset to lobby' };
  }
}
