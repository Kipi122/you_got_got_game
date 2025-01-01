# Party Missions

A social party game that adds excitement to any gathering through secret missions. Players receive challenges to complete during the party, with a twist: if anyone realizes you're playing the game and calls you out, the mission fails! 

## Features

- **Real-Time Updates**: Instant synchronization across all players
- **Room System**: Create or join private party rooms
- **Multiple Missions**: Each player receives 5 concurrent challenges
- **Progress Tracking**: Mark missions as complete or request new ones
- **Player Competition**: Track completion rates against other players
- **Mission Filtering**: Optional gender-based mission assignment
- **Responsive Design**: Full support for mobile and desktop devices

## Prerequisites

- Node.js (v18.x)
- npm (included with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/party-missions.git
cd party-missions
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
party-missions/
├── public/
│   └── index.html      # Main application interface
├── missions.json       # Mission definitions
├── server.js          # Server implementation
├── package.json       # Project configuration
└── README.md          # Documentation
```

## How to Play

1. Access the application in your browser
2. Enter a room ID (create new or join existing)
3. Select a username and gender preference
4. Complete your missions discreetly
5. If someone identifies that you're completing a Party Mission, the mission is failed
6. Select "Nailed it!" for successful completions or "Failed it" for unsuccessful attempts
7. Monitor the leaderboard for rankings

Note: Successful players complete their missions naturally without drawing attention to the game.

## Available Scripts

- `npm start`: Launch production server
- `npm run dev`: Launch development server with live reload

## Mission Categories

- **Social Missions**: Tasks involving interaction with other guests
- **Gender-Specific**: Optional missions filtered by player preference
- **General Missions**: Universal tasks available to all players

## Deployment

To deploy on Heroku:

1. Create a Heroku application
2. Connect your GitHub repository
3. Deploy and configure

## Environment Configuration

Required configuration:
- `PORT`: Application port (defaults to 3000)

## Contributing

Interested in contributing? Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Submit a Pull Request

## Security Features

- Room-based access control
- Honor-based mission completion system
- Automatic room cleanup for inactive sessions

## Planned Features

- Persistent storage implementation
- User authentication
- Photo verification system
- Custom mission creation
- Enhanced room management
- Difficulty levels
- Achievement system
- Social sharing capabilities

## License

MIT License - See LICENSE file for details.

---

Created for enhancing social gatherings through interactive gameplay.
