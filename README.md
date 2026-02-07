# 🍍 SpongeBob Trivia Game

A multiplayer SpongeBob-themed trivia game with real-time gameplay using WebSockets.

## Features

- 10 questions with decreasing time limits (15s to 10s) + final bonus question
- Up to 20 players, each selecting a unique SpongeBob character
- Admin controls game start/reset without playing
- Real-time scoring and leaderboard
- Beautiful underwater-themed UI with animations

## Tech Stack

- **Frontend:** Vite + React + Socket.IO Client + Tailwind CSS
- **Backend:** Node.js + Express + Socket.IO Server

## Getting Started

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3001`

### 3. Start the Frontend

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Access Admin View

To access the admin panel, open the browser console and run:

```javascript
localStorage.setItem('isAdmin', 'true')
```

Then refresh the page. To switch back to player view:

```javascript
localStorage.setItem('isAdmin', 'false')
```

## Game Flow

1. **Lobby Phase:** Players join, enter their name, and select an available character
2. **Admin starts the game** when at least 2 players are ready
3. **10 Questions:** Each question has a time limit (decreasing from 15s to 10s)
4. **Scoring:**
   - Correct answer: +10 points
   - Speed bonus: +5 points (answered in first 50% of time)
   - Wrong answer: -5 points
   - No answer: 0 points
5. **Final Leaderboard:** Shows all players ranked by score
6. **Admin resets** to return everyone to the lobby

## Project Structure

```
spongebob/
├── backend/
│   ├── server.js        # Express + Socket.IO server
│   ├── gameManager.js   # Game logic and state management
│   ├── gameData.js      # Characters and questions data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── player/      # Player view components
│   │   │   ├── admin/       # Admin view components
│   │   │   ├── PlayerView.jsx
│   │   │   ├── AdminView.jsx
│   │   │   ├── CharacterGrid.jsx
│   │   │   └── Bubbles.jsx
│   │   ├── utils/
│   │   │   └── characters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## API Endpoints

- `POST /api/start-game` - Start the game (admin only)
- `POST /api/reset-game` - Reset game to lobby (admin only)
- `GET /api/status` - Get current game status

## Socket Events

### Client → Server
- `join-game` - Join the game with name and character
- `answer-submitted` - Submit an answer

### Server → Client
- `lobby-updated` - Player list and character availability updates
- `game-started` - Game begins
- `new-question` - New question data
- `question-results` - Results after each question
- `game-ended` - Final leaderboard
- `game-reset` - Return to lobby
- `character-taken` - Error if character unavailable
- `player-answered` - Real-time answer tracking (admin only)

## Characters

1. SpongeBob SquarePants 🧽
2. Patrick Star ⭐
3. Squidward Tentacles 🦑
4. Sandy Cheeks 🐿️
5. Mr. Krabs 🦀
6. Plankton 🦠
7. Gary 🐌
8. Pearl Krabs 🐋
9. Mrs. Puff 🐡
10. Larry the Lobster 🦞
11. Karen 🖥️
12. Mermaid Man 🧜‍♂️
13. Barnacle Boy 🦸‍♂️
14. Flying Dutchman 👻
15. King Neptune 🔱
16. Squilliam Fancyson 🎩
17. Bubble Bass 🐟
18. Man Ray 🦹‍♂️
19. Dirty Bubble 🫧
20. Patchy the Pirate 🏴‍☠️
