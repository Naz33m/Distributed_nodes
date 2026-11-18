#!/bin/sh

npm run start:coordinator &
sleep 3
npm run start:node1 &
npm run start:node2 &
npm run start:node3 &
wait
