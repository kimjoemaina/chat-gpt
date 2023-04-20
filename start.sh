#!/bin/bash

#Start express backend
cd ./backend
npm install 
node server.js

#Start React frontend
cd ./frontend
npm install && npm run build
npm install -g serve
serve -s build
