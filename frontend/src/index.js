import { io } from "socket.io-client";
import * as THREE from "three";
import { OpeningAnimation } from "./openingAnimation";
const socket = io("localhost:8000", {
  path: "/ws/socket.io",
});
window.socket = socket;

socket.emit("join", JSON.stringify({ name: "Alice" }));
socket.emit("echo", JSON.stringify({ name: "Alice" }));
socket.on("echo", (jsonString) => {
  console.log(JSON.parse(jsonString));
});
socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("matched", (jsonString) => {
  const enemyName = JSON.parse(jsonString).enemyName;
  OpeningAnimation(enemyName);
});

window.onload = function () {
  const renderer = new THREE.WebGLRenderer();
  window.renderer = renderer;
  const scene = new THREE.Scene();
  window.scene = scene;
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;
  window.camera = camera;
  renderer.setSize(window.innerWidth / 1.2, window.innerHeight / 1.2 - 70);
  // document.body.appendChild(renderer.domElement);
  document.getElementById("canvasWrapper").appendChild(renderer.domElement);
  OpeningAnimation("Bob");

  // 角はまるく
  const canvasStyle = document.getElementById("canvasWrapper").firstChild.style;
  canvasStyle.borderRadius = "10px";
  canvasStyle.margin = "0 auto";
};
