@echo off
start "Distributed Counter - Coordinator" cmd /k "npm run start:coordinator"
timeout /t 3 /nobreak >nul
start "Distributed Counter - Node 1" cmd /k "npm run start:node1"
start "Distributed Counter - Node 2" cmd /k "npm run start:node2"
start "Distributed Counter - Node 3" cmd /k "npm run start:node3"
