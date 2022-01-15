import { io } from "socket.io-client";

const socket = io('localhost:8000', {
  path: '/ws/socket.io'
});

socket.on("connect", () => {
  console.log(socket.id);
});

window.socket = socket