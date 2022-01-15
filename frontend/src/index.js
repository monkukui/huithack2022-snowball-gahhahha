import { io } from "socket.io-client";
import * as THREE from "three";
import { OpeningAnimation } from "./openingAnimation";

const _id = (id) => {
  return document.getElementById(id)
}



const goToEntrance = () => {
  console.log("goToEntrance")
  const beginButton = _id("begin-button")
  const name = _id("name-input").value
  console.log(`${name} はじめるよ！`)
  beginButton.disabled = true
  startSocket(name)
  _id("entrance_status").innerHTML = "waiting for おまえの対戦相手…"
}

window.goToEntrance = goToEntrance



function startSocket(name) {
  console.log("startSocket")
  const socket = io("localhost:8000", {
    path: "/ws/socket.io",
  });
  window.socket = socket;

  socket.emit("join", JSON.stringify({ name: name }));
  socket.emit("echo", JSON.stringify({ name: name }));
  socket.on("echo", (jsonString) => {
    console.log(JSON.parse(jsonString), "echoed :)");
  });

  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("matched", (jsonString) => {
    _id("home").style.display = "none"
    initGame()
    const enemyName = JSON.parse(jsonString).enemyName;
    OpeningAnimation(enemyName);
  });
  // ここまで待つ。

  // TODO: エラーハンドリング
}

window.startDangerously = () => {
  _id("home").style.display = "none"
  startSocket()
  initGame()
}

// window.onload =
function initGame() {
  console.log("initGame")
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
  camera.position.z = 200;
  camera.position.y = -200;
  camera.rotation.x = 1;
  window.camera = camera;
  renderer.setSize(window.innerWidth / 1.2, window.innerHeight / 1.2 - 70);
  // document.body.appendChild(renderer.domElement);
  document.getElementById("canvasWrapper").appendChild(renderer.domElement);
  OpeningAnimation("Bob");

  // 角はまるく
  const canvasStyle = document.getElementById("canvasWrapper").firstChild.style
  canvasStyle.borderRadius = "10px"
  canvasStyle.margin = "0 auto"
};
