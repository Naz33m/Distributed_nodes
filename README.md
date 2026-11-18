# 🚀 Distributed Counter System

A hands-on project to learn distributed architecture concepts with a simple shared counter across multiple nodes.

## Architecture Overview

```
┌──────────────────┐
│  COORDINATOR     │ (Port 3000)
│  (Central Hub)   │
└────────┬─────────┘
         │
    ┌────┼────┬────┐
    │    │    │    │
    v    v    v    v
┌─────┐┌─────┐┌─────┐┌──────────┐
│NODE1││NODE2││NODE3││  CLIENT  │
│:3001││:3002││:3003││ (CLI)    │
└─────┘└─────┘└─────┘└──────────┘
```

## How It **Works**

1. **Coordinator** - Central authority managing the distributed counter state
2. **Nodes** - Independent servers that register with the coordinator and can increment/decrement the counter
3. **Client** - CLI tool to interact with the system and observe distributed behavior

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Running Locally - EASIEST WAY (Windows)

**Just run:**
```bash
start.bat
```

This will open 4 windows automatically:
1. Coordinator (port 3000)
2. Node 1 (port 3001)
3. Node 2 (port 3002)
4. Node 3 (port 3003)

Then in another terminal, start the client:
```bash
npm run start:client
```

### Running Locally - EASIEST WAY (Mac/Linux)

**Just run:**
```bash
bash start.sh
```

Then in another terminal, start the client:
```bash
npm run start:client
```

### Running Locally (Manual - Terminal by Terminal)

**⚠️ IMPORTANT: Start in this order!**

**Terminal 1 - Start Coordinator FIRST:**
```bash
npm run start:coordinator
```
Wait 2-3 seconds for it to be ready.

**Terminal 2 - Start Node 1:**
```bash
npm run start:node1
```

**Terminal 3 - Start Node 2:**
```bash
npm run start:node2
```

**Terminal 4 - Start Node 3:**
```bash
npm run start:node3
```

**Terminal 5 - Start Client:**
```bash
npm run start:client
```

### Running with Docker Compose

```bash
docker compose up --build
```

Then in another terminal:
```bash
npm run start:client
```

The Compose stack starts the coordinator and three nodes with health checks. The
coordinator and nodes communicate over the Compose network at
`coordinator:3000`; the host can access the services on ports `3000-3003`.

Stop the containers with:

```bash
docker compose down
```

## Client Commands

```
status              - Show current counter and registered nodes
inc [nodePort]      - Increment counter (default: port 3001)
dec [nodePort]      - Decrement counter (default: port 3001)
inc [port] [amount] - Increment by specific amount
dec [port] [amount] - Decrement by specific amount
reset               - Reset counter to 0
help                - Show available commands
exit                - Exit client
```

## Example Usage

```bash
# Check status
> status
📊 Current Counter: 0
🔗 Registered Nodes: 3

# Increment from different nodes
> inc 3001 5
✅ Incremented! Counter: 5

> inc 3002 3
✅ Incremented! Counter: 8

# Check all nodes see the same value
> status
📊 Current Counter: 8

# Decrement
> dec 3003 2
✅ Decremented! Counter: 6

# Reset
> reset
✅ Counter reset! Value: 0
```

## Learning Goals

This project helps you understand:

✅ **Node Registration** - How nodes join a distributed system  
✅ **Shared State** - Maintaining consistency across multiple nodes  
✅ **Synchronization** - Keeping nodes in sync with a central authority  
✅ **Communication** - Inter-node and node-to-coordinator messaging  
✅ **Scalability** - Adding more nodes without breaking the system  

## Experiments to Try

1. **Kill a node** - See how coordinator maintains state
2. **Rapid increments** - Send many increments quickly from different nodes
3. **Network simulation** - Add latency/failures with Docker networks
4. **Concurrent updates** - Increment from multiple nodes simultaneously
5. **Restart nodes** - Verify they resync on reconnection

## API Endpoints

### Coordinator (`:3000`)

```
GET    /health              - Health check
GET    /counter             - Get current counter value
POST   /register            - Register a new node
POST   /increment           - Increment counter
POST   /decrement           - Decrement counter
POST   /reset               - Reset counter
```

### Node Servers (`:3001`, `:3002`, `:3003`)

```
GET    /health              - Health check
GET    /counter             - Get counter value
POST   /increment           - Increment counter
POST   /decrement           - Decrement counter
```

## Next Steps: Advanced Distributed Concepts

After mastering this, explore:

- **Consensus Algorithms** (Raft, PAXOS) - Distributed decision making
- **Message Queues** (RabbitMQ, Redis) - Async communication
- **Database Replication** - Distributed data persistence
- **Load Balancing** - Distributing requests across nodes
- **Fault Tolerance** - Handling node failures gracefully

## Project Structure

```
.
├── coordinator.js       - Central coordinator managing counter state
├── node.js             - Node server template
├── client.js           - Interactive CLI client
├── package.json        - Dependencies
├── docker-compose.yml  - Docker orchestration
├── Dockerfile          - Container image
├── start.bat           - Windows local launcher
├── start.sh            - macOS/Linux local launcher
└── README.md           - This file
```

## Troubleshooting

**Nodes can't connect to coordinator:**
- Ensure coordinator is running on `http://localhost:3000`
- Check firewall settings

**Counter not syncing:**
- Verify all nodes are registered (check coordinator logs)
- Client should show all 3 nodes in status

**Port already in use:**
- Change port numbers in package.json scripts or docker-compose.yml

---

🎓 Happy learning! This project is your playground for distributed systems.
