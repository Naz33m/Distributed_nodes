const axios = require('axios');
const readline = require('readline');

const COORDINATOR_URL = 'http://localhost:3000';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getCounter() {
  try {
    const response = await axios.get(`${COORDINATOR_URL}/counter`);
    console.log(`\n📊 Current Counter: ${response.data.counter}`);
    console.log(`🔗 Registered Nodes: ${response.data.registeredNodes.length}`);
    response.data.registeredNodes.forEach(n => {
      console.log(`   - ${n.nodeId} (${n.nodeUrl})`);
    });
  } catch (error) {
    console.error('❌ Error fetching counter:', error.message);
  }
}

async function increment(nodePort = 3001, amount = 1) {
  try {
    const nodeUrl = `http://localhost:${nodePort}`;
    const response = await axios.post(`${nodeUrl}/increment`, { amount });
    console.log(`\n✅ Incremented! Counter: ${response.data.counter}`);
  } catch (error) {
    console.error('❌ Error incrementing:', error.message);
  }
}

async function decrement(nodePort = 3001, amount = 1) {
  try {
    const nodeUrl = `http://localhost:${nodePort}`;
    const response = await axios.post(`${nodeUrl}/decrement`, { amount });
    console.log(`\n✅ Decremented! Counter: ${response.data.counter}`);
  } catch (error) {
    console.error('❌ Error decrementing:', error.message);
  }
}

async function reset() {
  try {
    const response = await axios.post(`${COORDINATOR_URL}/reset`);
    console.log(`\n✅ Counter reset! Value: ${response.data.counter}`);
  } catch (error) {
    console.error('❌ Error resetting:', error.message);
  }
}

function showMenu() {
  console.log(`
╔════════════════════════════════════════╗
║  Distributed Counter Client            ║
╚════════════════════════════════════════╝

Commands:
  status              - Show counter status
  inc [nodePort]      - Increment (ex: inc 3001)
  dec [nodePort]      - Decrement (ex: dec 3001)
  inc [nodePort] [n]  - Increment by n (ex: inc 3001 5)
  reset               - Reset counter to 0
  help                - Show this menu
  exit                - Exit

Example:
  > inc 3001 3        (increment by 3 from node 3001)
  > status
  `);
}

async function processCommand(input) {
  const [command, ...args] = input.trim().split(' ');

  switch (command.toLowerCase()) {
    case 'status':
      await getCounter();
      break;
    case 'inc':
      const incPort = parseInt(args[0]) || 3001;
      const incAmount = parseInt(args[1]) || 1;
      await increment(incPort, incAmount);
      break;
    case 'dec':
      const decPort = parseInt(args[0]) || 3001;
      const decAmount = parseInt(args[1]) || 1;
      await decrement(decPort, decAmount);
      break;
    case 'reset':
      await reset();
      break;
    case 'help':
      showMenu();
      break;
    case 'exit':
      console.log('👋 Goodbye!');
      process.exit(0);
    default:
      console.log('❓ Unknown command. Type "help" for options.');
  }
}

async function main() {
  showMenu();

  const askQuestion = () => {
    rl.question('\n> ', async (input) => {
      if (input.trim()) {
        await processCommand(input);
      }
      askQuestion();
    });
  };

  askQuestion();
}

main();
