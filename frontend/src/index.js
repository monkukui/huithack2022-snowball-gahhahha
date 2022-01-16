import { io } from "socket.io-client";
import * as THREE from "three";
import { OpeningAnimation } from "./openingAnimation";

export const _id = (id) => {
  return document.getElementById(id);
};

const goToEntrance = () => {
  console.log("goToEntrance");
  const beginButton = _id("begin-button");
  const name = _id("name-input").value;
  console.log(`${name} はじめるよ！`);
  beginButton.disabled = true;
  startSocket(name);
  _id("entrance_status").innerHTML = "waiting for おまえの対戦相手…";
};

window.goToEntrance = goToEntrance;

/**
 *
 * @param {*} name // one of "host" or "guest"
 * // enum とかで管理するときれいかもしれない
 */
window.playerType = undefined;

window.room = {};

// 相手のタイプ取得したいときに使う
const opponentType = {
  host: "guest",
  guest: "host",
};

const snowColorCode = 0xcff1ff;
window.snowColorCode = snowColorCode;

const server_url = "https://snowball-gahhahha.herokuapp.com";
// const server_url = "localhost:8000"

function startSocket(name) {
  console.log("startSocket");
  const socket = io(server_url, {
    path: "/ws/socket.io",
  });
  window.socket = socket;

  // socket.emit("join", JSON.stringify({ name: name }));
  socket.emit("echo", JSON.stringify({ name: name }));
  socket.on("echo", (jsonString) => {
    console.log(JSON.parse(jsonString), "echoed :)");
  });

  socket.on("connect", () => {
    console.log(socket.id);
    // TODO: join
    socket.emit(
      "join",
      JSON.stringify({
        name: name,
        socketId: socket.id,
      })
    );
  });

  socket.on("matched", (room) => {
    _id("home").style.display = "none";
    initGame();
    window.room = room;
    // const enemyName = JSON.parse(jsonString).enemyName;
    if (room.host.socketId === socket.id) {
      playerType = "host";
    } else {
      playerType = "guest";
    }
    // マッチングしました！のアニメーション、終わってちょっと待ってから startGameRequest(window.room) を emit する。
    OpeningAnimation(room[opponentType[playerType]].name); // you
    // 相手のやつ出したかったら
    // opponentType[playerType] です
  });
  // TODO: エラーハンドリング
}

window.startDangerously = () => {
  _id("home").style.display = "none";
  startSocket();
  initGame();
};

// window.onload =
function initGame() {
  console.log("initGame");
  const renderer = new THREE.WebGLRenderer();
  window.renderer = renderer;
  const scene = new THREE.Scene();
  window.scene = scene;
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = 100;
  window.camera = camera;
  renderer.setSize(window.innerWidth / 1.2, window.innerHeight / 1.2 - 70);
  // document.body.appendChild(renderer.domElement);
  document.getElementById("canvasWrapper").appendChild(renderer.domElement);
  // OpeningAnimation("Bob");

  // 角はまるく
  const canvasStyle = document.getElementById("canvasWrapper").firstChild.style;
  canvasStyle.borderRadius = "10px";
  canvasStyle.margin = "0 auto";
}
