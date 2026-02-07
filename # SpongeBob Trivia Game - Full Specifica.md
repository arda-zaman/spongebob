# SpongeBob Trivia Game - Full Specification

Build a multiplayer SpongeBob-themed trivia game with real-time gameplay using WebSockets.

## Tech Stack
- **Frontend:** Vite + React + Socket.IO Client + CSS/Tailwind + Typescript
- **Backend:** Node.js + Express + Socket.IO Server + Typescript

## Game Overview
- 10 questions (with decreasing time limits (15s to 10s)) + one final question typing test, final question score should be bigger.
- Up to 20 players, each selecting a unique SpongeBob character
- Admin controls game start/reset without playing
- Real-time scoring and leaderboard

---

## Frontend Specification

### Admin Detection
- Check `localStorage.getItem('isAdmin')` on app load
- If `isAdmin === 'true'`, render Admin View
- Otherwise, render Player View

### Available Characters (20 total, each selectable only once)
1. SpongeBob SquarePants
2. Patrick Star
3. Squidward Tentacles
4. Sandy Cheeks
5. Mr. Krabs
6. Plankton
7. Gary
8. Pearl Krabs
9. Mrs. Puff
10. Larry the Lobster
11. Karen
12. Mermaid Man
13. Barnacle Boy
14. Flying Dutchman
15. King Neptune
16. Squilliam Fancyson
17. Bubble Bass
18. Man Ray
19. Dirty Bubble
20. Patchy the Pirate

---

### PLAYER VIEW

#### 1. Lobby Screen
- Character selection grid (4x5 or 5x4 layout)
- Each character card shows:
  - Character image/avatar
  - Character name
  - Status: Available (clickable) / Taken (grayed out with "Taken by [PlayerName]")
- Player name input
- Selected character preview
- "Confirm Selection" button (enabled only after name + character selected)
- Waiting room showing all connected players with their chosen characters
- Waiting message: "Waiting for admin to start the game..."
- **Real-time updates:** When someone picks a character, it becomes unavailable immediately

#### 2. Game Screen
- Question display with animated timer bar (countdown)
- 4 answer options as clickable cards
- Current score display
- Question number indicator (1/10)
- Small live leaderboard sidebar showing top 3
- Player's character avatar displayed

#### 3. Leaderboard Screen
- Full rankings list (all players) with:
  - Rank number (1st, 2nd, 3rd, etc.)
  - Character avatar
  - Player name
  - Final score
- Animated podium for top 3
- Waiting message: "Waiting for admin to reset..."

#### Socket Events (Client - Player)
**Emit:**
- `join-game` - Payload: `{ name: string, character: string }`
- `answer-submitted` - Payload: `{ questionId: number, answerIndex: number, timestamp: number }`

**Listen:**
- `game-started` - Game begins
- `new-question` - New question data
- `question-results` - Results after each question
- `game-ended` - Final leaderboard
- `lobby-updated` - Player list and character availability updates
- `game-reset` - Return to lobby
- `character-taken` - Error if selected character is unavailable

---

### ADMIN VIEW

#### 1. Admin Lobby
- List of all connected players (name, character, timestamp joined)
- Player count (X/20)
- Character availability overview (grid showing taken/available)
- **"Start Game" button** (enabled when at least 2 players connected)
- No character selection for admin

#### 2. Admin Game Monitor
- Current question display
- Timer countdown
- **Live answer tracking:** Show who answered what in real-time
- Live leaderboard (all players)
- Question progress (1/10, 2/10, etc.)

#### 3. Admin Leaderboard
- Full rankings list (all players)
- **"Reset Game" button** to return everyone to lobby

#### Socket Events (Client - Admin)
**Listen:**
- `lobby-updated` - Player and character updates
- `game-started` - Game begins
- `new-question` - New question data
- `player-answered` - Real-time player answers
- `question-results` - Results after each question
- `game-ended` - Final leaderboard
- `character-taken` - Character availability changes

---

### Design Requirements
- Underwater bubble background
- SpongeBob font (Krabby Patty or similar)
- Yellow/blue color scheme
- Bubble animations, wave effects
- Character sprite images (20 characters)
- Character selection: Available characters highlighted, taken characters grayed out
- Admin view: Control panel aesthetic (dashboard style)
- Sound effects (optional: bubble pops, correct/wrong sounds)

---

## Backend Specification

### Character Management
Maintain a global character registry:
```javascript
{
  "SpongeBob SquarePants": null, // available
  "Patrick Star": { socketId: "abc123", playerName: "John" }, // taken
  // ... all 20 characters
}
```
- When player selects character, check availability
- If taken, emit `character-taken` error
- If available, assign and broadcast `lobby-updated`
- **Release character when player disconnects**

---

### REST Endpoints

#### POST `/api/start-game`
- Admin-only endpoint (no auth needed, trust-based)
- Validates minimum 2 players connected
- Triggers game start
- Returns: `{ success: true, message: "Game started" }` or error

#### POST `/api/reset-game`
- Admin-only endpoint
- Resets game state to LOBBY
- Clears all scores
- **Releases all characters (makes them available again)**
- Keeps connected players but they must re-select characters
- Emits `game-reset` to all clients
- Returns: `{ success: true, message: "Game reset to lobby" }`

---

### Game Logic

#### Player Management
- Track connected players: `{ socketId, name, character, score, isAdmin }`
- Admin connections don't count as players
- Handle disconnections gracefully - **release character when player disconnects**
- **Enforce unique character selection:** Only one player per character at a time

#### Game States
- `LOBBY` - Waiting for players
- `PLAYING` - Game in progress
- `FINISHED` - Showing leaderboard

#### Game Flow
1. Lobby phase - players join, enter name, select available character
2. Admin triggers `/api/start-game` → emit `game-started`
3. 10 questions loop:
   - Question 1: 10 seconds
   - Question 2: 9 seconds
   - Question 3: 8 seconds
   - ... (decrease by 1 second each)
   - Question 10: 1 second
4. After each question, emit `question-results` with correct answer & updated scores
5. After Q10, emit `game-ended` with full leaderboard (all players ranked)
6. Admin triggers `/api/reset-game` → emit `game-reset` → back to lobby, characters released

#### Scoring System
- Correct answer: **+10 points**
- Speed bonus: **+5 points** (answered in first 50% of time)
- Wrong answer: **-5 points**
- No answer: **0 points**

---

### Socket Events (Server)

#### Connection Management
**`connection`** - New socket connected

**`join-game`** - Payload: `{ name: string, character: string, isAdmin: boolean }`
- Check if character is available
- If taken, emit `character-taken` error to sender
- If available, assign character (if not admin), add to lobby
- Emit `lobby-updated` to all clients with player list + character availability

**`disconnect`**
- Release player's character
- Emit `lobby-updated`

#### During Game
**`answer-submitted`** - Payload: `{ questionId: number, answerIndex: number, timestamp: number }`
- Emit `player-answered` to admin with player info
- Store answer for scoring

#### Broadcasts
**Emit `game-started`**
- Game begins, sends first question

**Emit `new-question`**
- Payload: `{ questionId: number, question: string, options: string[], timeLimit: number }`

**Emit `question-results`**
- Payload: `{ correctAnswer: number, scores: object, leaderboard: array }`

**Emit `game-ended`**
- Payload: `{ finalLeaderboard: array }` (all players with ranks)

**Emit `game-reset`**
- Returns all clients to lobby, clears scores, releases all characters

**Emit `lobby-updated`**
- Payload: `{ players: array, availableCharacters: array, takenCharacters: object }`
- Sent whenever someone joins/leaves/selects character

**Emit `character-taken`**
- Error to specific player if character already selected

---

### Data Structures

#### Lobby Update Payload
```javascript
{
  players: [
    { socketId: "abc123", name: "John", character: "SpongeBob SquarePants", isAdmin: false },
    { socketId: "def456", name: "Admin", character: null, isAdmin: true }
  ],
  availableCharacters: [
    "Squidward Tentacles",
    "Sandy Cheeks"
    // ... all available characters
  ],
  takenCharacters: {
    "SpongeBob SquarePants": "John",
    "Patrick Star": "Jane"
  }
}
```

#### Leaderboard Data
```javascript
{
  finalLeaderboard: [
    { rank: 1, name: "Player1", character: "SpongeBob SquarePants", score: 145 },
    { rank: 2, name: "Player2", character: "Patrick Star", score: 120 },
    { rank: 3, name: "Player3", character: "Sandy Cheeks", score: 110 }
    // ... all players
  ]
}
```

#### Question Data
```javascript
{
  id: 1,
  question: "What is SpongeBob's pet snail's name?",
  options: ["Larry", "Gary", "Barry", "Harry"],
  correctAnswer: 1, // index of correct answer
  timeLimit: 10 // seconds
}
```

---

### Sample Questions (10 total)

Prepare 10 questions mixing SpongeBob trivia with funny general questions themed around the show. Questions can be in Turkish or English based on your preference.

Example questions:
1. "What is SpongeBob's pet snail's name?" (10s)
2. "Where does SpongeBob work?" (9s)
3. "Who is SpongeBob's best friend?" (8s)
4. "What instrument does Squidward play?" (7s)
5. "What is Mr. Krabs' daughter's name?" (6s)
6. "Where does Sandy come from?" (5s)
7. "What is Plankton trying to steal?" (4s)
8. "What is SpongeBob's house shaped like?" (3s)
9. "What color is Patrick?" (2s)
10. "How many holes does SpongeBob have?" (1s)

---

## Implementation Notes

### Key Features to Implement
1. **Real-time character locking** - Instant updates when characters are selected
2. **Disconnect handling** - Release characters when players leave
3. **Timer synchronization** - All clients show same countdown
4. **Score calculation** - Include time-based bonus
5. **Admin controls** - Start/reset without playing
6. **Responsive design** - Works on mobile and desktop

### Error Handling
- Character already taken
- Game already started
- Minimum player requirement
- Socket disconnections
- Invalid answers

### Testing Scenarios
- Multiple players selecting same character simultaneously
- Admin starting game with < 2 players
- Player disconnecting during game
- Admin resetting during active game
- 20+ players trying to join