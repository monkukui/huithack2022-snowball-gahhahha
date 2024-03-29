import { io } from "socket.io-client";
import * as THREE from "three";
import { OpeningAnimation } from "./openingAnimation";

import MobileDetect from "mobile-detect";

export const _id = (id) => {
  return document.getElementById(id);
};

const md = new MobileDetect(window.navigator.userAgent);

const startWithSolo = () => {
  console.log("startWithSolo");
  _id("home").style.display = "none";
  _id("how-to-play").style.display = "none";
  _id("footer").style.display = "none";
  startSocket(undefined, true);
};

window.startWithSolo = startWithSolo;

if (md.mobile()) {
  _id("home-container").style.display = "none";
  _id("sorry-container").className = "";
  _id("unsupported-message").innerHTML =
    "モバイル端末には<br>対応していません…";
}

const goToEntrance = () => {
  // console.log("goToEntrance");
  const beginButton = _id("begin-button");
  const name = _id("name-input").value;
  _id("name-input").disabled = true;
  _id("startSolo").disabled = true;
  _id("how-to-play").style.display = "none";
  _id("footer").style.display = "none";
  console.log(`${name} はじめるよ！`);
  beginButton.disabled = true;
  startSocket(name);
  _id(
    "entrance_status"
  ).innerHTML = `対戦相手を探しています...<br> <div style="margin-top:30px"> <div class="progress blue lighten-3">
  <div class="indeterminate indigo"></div>
</div>`;
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

// local だったら local のサーバーに。
const server_url =
  process.env.NODE_ENV === "development"
    ? "localhost:8000"
    : "https://snowball-gahhahha.herokuapp.com";

// const server_url = "https://snowball-gahhahha.herokuapp.com"

function startSocket(name, isSolo = false) {
  console.log("startSocket, isSolo", isSolo);
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
    console.log(`socket connected with id:${socket.id}`);
    // TODO: join
    if (!isSolo) {
      socket.emit(
        "join",
        JSON.stringify({
          name: name,
          socketId: socket.id,
        })
      );
    } else {
      _id("home").style.display = "none";
      initGame();
      window.room = {
        host: {
          socketId: socket.id,
          name: "solo",
        },
        guest: {
          socketId: null,
          name: null,
        },
      };
      playerType = "host";
      OpeningAnimation(true); // you
    }
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
    OpeningAnimation(); // you
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

// opening animation 用の canvas 作成
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
  console.log("canvas done");
}
