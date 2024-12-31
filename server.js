const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const PORT = process.env.PORT || 3000;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from 'public' directory
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Modified in-memory storage structure
const rooms = new Map(); // roomId -> Map<username, playerData>
const missions = require('./missions.json');
const socketToPlayer = new Map(); // socket.id -> {roomId, username}

// Helper function to get random missions
function getRandomMissions(count, gender) {
    const filteredMissions = missions.filter(m => 
        m.gender === 'any' || m.gender === gender
    );
    const selectedMissions = [];
    
    while (selectedMissions.length < count) {
        const randomIndex = Math.floor(Math.random() * filteredMissions.length);
        const mission = filteredMissions[randomIndex];
        if (!selectedMissions.some(m => m.id === mission.id)) {
            selectedMissions.push({
                ...mission,
                status: 'active'
            });
        }
    }
    return selectedMissions;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    // Join room
    socket.on('joinRoom', ({ roomId, username, gender }) => {
        try {
            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Map());
            }
            
            const room = rooms.get(roomId);
            let player;

            // Check if player already exists in the room
            if (room.has(username)) {
                player = room.get(username);
                player.socketId = socket.id; // Update socket ID for the existing player
            } else {
                // Create new player if they don't exist
                player = {
                    socketId: socket.id,
                    username,
                    gender,
                    missions: getRandomMissions(5, gender),
                    completedMissions: []
                };
                room.set(username, player);
            }

            // Store socket to player mapping
            socketToPlayer.set(socket.id, { roomId, username });
            
            socket.join(roomId);
            
            // Send initial missions to player
            socket.emit('initialMissions', player.missions);
            
            // Broadcast updated player list
            io.to(roomId).emit('playersUpdate', Array.from(room.values()));
        } catch (error) {
            console.error('Error in joinRoom:', error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    // Handle mission completion/failure
    socket.on('completeMission', ({ roomId, missionId, status }) => {
        try {
            const playerInfo = socketToPlayer.get(socket.id);
            if (!playerInfo) {
                console.log('Player info not found for socket:', socket.id);
                return;
            }

            const room = rooms.get(roomId);
            if (!room) {
                console.log('Room not found:', roomId);
                return;
            }

            const player = room.get(playerInfo.username);
            if (!player) {
                console.log('Player not found:', playerInfo.username);
                return;
            }

            // Find the mission
            const missionIndex = player.missions.findIndex(m => m.id === missionId);
            if (missionIndex === -1) {
                console.log('Mission not found:', missionId);
                return;
            }

            const currentMission = player.missions[missionIndex];
            if (currentMission.status === 'completed') {
                console.log('Mission already completed, ignoring update');
                return;
            }

            let updatedMissions = [...player.missions];

            if (status === 'completed') {
                const completedMission = {
                    ...currentMission,
                    status: 'completed',
                    completedAt: new Date().toISOString()
                };
                updatedMissions[missionIndex] = completedMission;
                player.completedMissions.push(completedMission);
            } else if (status === 'failed') {
                const newMission = {
                    ...getRandomMissions(1, player.gender)[0],
                    status: 'active',
                    id: `m${Date.now()}`
                };
                updatedMissions[missionIndex] = newMission;
            }

            // Update the player's missions array
            player.missions = updatedMissions;
            room.set(playerInfo.username, player);

            // Send updated missions to player
            socket.emit('missionsUpdate', updatedMissions);
            
            // Broadcast updated player list
            io.to(roomId).emit('playersUpdate', Array.from(room.values()));
        } catch (error) {
            console.error('Error processing mission update:', error);
            socket.emit('error', { message: 'Failed to process mission update' });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const playerInfo = socketToPlayer.get(socket.id);
        if (playerInfo) {
            // Remove socket mapping but keep player data in room
            socketToPlayer.delete(socket.id);
            
            // Notify other players
            const room = rooms.get(playerInfo.roomId);
            if (room) {
                io.to(playerInfo.roomId).emit('playersUpdate', Array.from(room.values()));
            }
        }
    });

    // Clean up empty rooms periodically
    setInterval(() => {
        rooms.forEach((room, roomId) => {
            if (room.size === 0) {
                rooms.delete(roomId);
                console.log(`Cleaned up empty room: ${roomId}`);
            }
        });
    }, 3600000); // Check every hour
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});