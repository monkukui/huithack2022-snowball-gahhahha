import * as THREE from "three";
import { Over } from "./over";

import { _id } from "./index";

let gameEnded = false;

export const Game = (enemyName) => {
  socket.on("fall", (jsonString) => {
    const data = jsonString.data;
    data.forEach((s) => {
      const { x, y } = s;
      syncGenerateSnowball(x, y);
    });
  });

  socket.on("enemyPosition", (data) => {
    const { x, y } = data.data;
    // console.log(`enemy moved to ${x}, ${y}`);
    // const data = JSON.parse(jsonString).data;
    syncAnotherPlayer(x, y);
  });

  socket.on("disconnected", () => {});

  socket.once("over", (data) => {
    // console.log(data);
    cancelAnimationFrame(gameRAFId);
    if (!gameEnded) {
      _id("matchInfo").innerHTML += "<br><br>おまえの勝ち！ガッハッハ";
      // Over();
      alert(`おまえの勝ち！ガッハッハ`);
    }
    gameEnded = true;
  });

  camera.position.y = -200;
  camera.position.z = 100;

  camera.rotation.x = 1;

  const snowBallInitialZ = 150;

  const materialPlayer1 = new THREE.MeshBasicMaterial({
    color: 0xf26690,
  });
  const materialPlayer2 = new THREE.MeshBasicMaterial({
    color: 0xde864e,
  });

  const materialFloor = new THREE.MeshBasicMaterial({
    color: 0xd3d7db,
  });

  const materialShadow = new THREE.MeshBasicMaterial({
    color: 0x8b8b8b,
  });

  const playerScale = 30;
  const ballRadius = 14;
  const generateSnowBallTicks = 35;
  const requestSnowBallTicks = 6 * 60;
  const emitPositionTicks = 3;
  const floorScale = 200;
  const snowballSpeedFactor = 1.5;
  const snowballMeshQuality = 8;
  const keyInput = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  const speedFactor = 2;

  const makeFloor = () => {
    const geometry = new THREE.PlaneGeometry(floorScale, floorScale);

    const mesh = new THREE.Mesh(geometry, materialFloor);
    mesh.name = "floor";
    scene.add(mesh);
  };
  makeFloor();

  const makePlayer1 = () => {
    const headGeometry = new THREE.SphereGeometry(playerScale * 0.1, 32);
    const neckGeometry = new THREE.CylinderGeometry(
      playerScale * 0.1,
      playerScale * 0.1,
      playerScale * 0.1,
      32
    );
    const torsoGeometry = new THREE.BoxGeometry(
      playerScale * 0.2,
      playerScale * 0.4,
      playerScale * 0.2
    );
    const armGeometry = new THREE.CylinderGeometry(
      playerScale * 0.05,
      playerScale * 0.05,
      playerScale * 0.35,
      32
    );
    const legGeometry = new THREE.CylinderGeometry(
      playerScale * 0.05,
      playerScale * 0.05,
      playerScale * 0.4,
      32
    );
    const material = materialPlayer1;

    const head = new THREE.Mesh(headGeometry, material);
    head.position.z = playerScale * 0.9;

    const neck = new THREE.Mesh(neckGeometry, material);
    neck.position.z = playerScale * 0.8;
    neck.rotation.x = Math.PI / 2;

    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.z = playerScale * 0.6;
    torso.rotation.x = Math.PI / 2;

    const arm_l = new THREE.Mesh(armGeometry, material);
    arm_l.position.x = -playerScale * 0.15;
    arm_l.position.z = playerScale * 0.6;
    arm_l.rotation.x = Math.PI / 2;
    arm_l.rotation.z = Math.PI * -0.1;

    const arm_r = new THREE.Mesh(armGeometry, material);
    arm_r.position.x = playerScale * 0.15;
    arm_r.position.z = playerScale * 0.6;
    arm_r.rotation.x = Math.PI / 2;
    arm_r.rotation.z = Math.PI * 0.1;

    const leg_l = new THREE.Mesh(legGeometry, material);
    leg_l.position.x = -playerScale * 0.07;
    leg_l.position.z = playerScale * 0.2;
    leg_l.rotation.x = Math.PI / 2;
    leg_l.rotation.z = Math.PI * -0.05;

    const leg_r = new THREE.Mesh(legGeometry, material);
    leg_r.position.x = playerScale * 0.07;
    leg_r.position.z = playerScale * 0.2;
    leg_r.rotation.x = Math.PI / 2;
    leg_r.rotation.z = Math.PI * 0.05;

    const group = new THREE.Group();
    group.add(head);
    group.add(neck);
    group.add(torso);
    group.add(arm_l);
    group.add(arm_r);
    group.add(leg_l);
    group.add(leg_r);
    group.name = "p1";
    window.p1 = group;
    scene.add(group);
  };
  makePlayer1();

  const makePlayer2 = () => {
    const headGeometry = new THREE.SphereGeometry(playerScale * 0.1, 32);
    const neckGeometry = new THREE.CylinderGeometry(
      playerScale * 0.1,
      playerScale * 0.1,
      playerScale * 0.1,
      32
    );
    const torsoGeometry = new THREE.BoxGeometry(
      playerScale * 0.2,
      playerScale * 0.4,
      playerScale * 0.2
    );
    const armGeometry = new THREE.CylinderGeometry(
      playerScale * 0.05,
      playerScale * 0.05,
      playerScale * 0.35,
      32
    );
    const legGeometry = new THREE.CylinderGeometry(
      playerScale * 0.05,
      playerScale * 0.05,
      playerScale * 0.4,
      32
    );

    const material = materialPlayer2;

    const head = new THREE.Mesh(headGeometry, material);
    head.position.z = playerScale * 0.9;

    const neck = new THREE.Mesh(neckGeometry, material);
    neck.position.z = playerScale * 0.8;
    neck.rotation.x = Math.PI / 2;

    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.z = playerScale * 0.6;
    torso.rotation.x = Math.PI / 2;

    const arm_l = new THREE.Mesh(armGeometry, material);
    arm_l.position.x = -playerScale * 0.15;
    arm_l.position.z = playerScale * 0.6;
    arm_l.rotation.x = Math.PI / 2;
    arm_l.rotation.z = Math.PI * -0.1;

    const arm_r = new THREE.Mesh(armGeometry, material);
    arm_r.position.x = playerScale * 0.15;
    arm_r.position.z = playerScale * 0.6;
    arm_r.rotation.x = Math.PI / 2;
    arm_r.rotation.z = Math.PI * 0.1;

    const leg_l = new THREE.Mesh(legGeometry, material);
    leg_l.position.x = -playerScale * 0.07;
    leg_l.position.z = playerScale * 0.2;
    leg_l.rotation.x = Math.PI / 2;
    leg_l.rotation.z = Math.PI * -0.05;

    const leg_r = new THREE.Mesh(legGeometry, material);
    leg_r.position.x = playerScale * 0.07;
    leg_r.position.z = playerScale * 0.2;
    leg_r.rotation.x = Math.PI / 2;
    leg_r.rotation.z = Math.PI * 0.05;

    const group = new THREE.Group();
    group.add(head);
    group.add(neck);
    group.add(torso);
    group.add(arm_l);
    group.add(arm_r);
    group.add(leg_l);
    group.add(leg_r);
    group.name = "p2";
    scene.add(group);
  };
  makePlayer2();

  const getSelf = () => {
    return scene.getObjectByName(playerType === "host" ? "p1" : "p2");
  };

  const getEnemy = () => {
    return scene.getObjectByName(playerType === "host" ? "p2" : "p1");
  };

  const setupKeyInput = () => {
    document.onkeydown = function (e) {
      switch (e.key) {
        case "ArrowLeft":
          keyInput.left = true;
          break;
        case "ArrowRight":
          keyInput.right = true;
          break;
        case "ArrowDown":
          keyInput.down = true;
          break;
        case "ArrowUp":
          keyInput.up = true;
          break;
      }
    };
    document.onkeyup = function (e) {
      switch (e.key) {
        case "ArrowLeft":
          keyInput.left = false;
          break;
        case "ArrowRight":
          keyInput.right = false;
          break;
        case "ArrowDown":
          keyInput.down = false;
          break;
        case "ArrowUp":
          keyInput.up = false;
          break;
      }
    };
  };
  setupKeyInput();

  const tickMoveByKey = () => {
    var self = getSelf();
    const vector2 = {
      x: 0,
      y: 0,
      normalize: () => {
        const length = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
        if (length === 0) {
          return;
        }
        if (vector2.x !== 0) {
          vector2.x = vector2.x / length;
        }
        if (vector2.y !== 0) {
          vector2.y = vector2.y / length;
        }
      },
    };

    if (keyInput.left) {
      vector2.x -= 1;
    }
    if (keyInput.right) {
      vector2.x += 1;
    }
    if (keyInput.down) {
      vector2.y -= 1;
    }
    if (keyInput.up) {
      vector2.y += 1;
    }
    vector2.normalize();
    self.position.x += vector2.x * speedFactor;
    self.position.y += vector2.y * speedFactor;

    if (vector2.x * vector2.y > 0) {
      console.log("");
      self.rotation.z = -Math.PI / 4;
    }
    if (vector2.x * vector2.y < 0) {
      self.rotation.z = Math.PI / 4;
    }
    if (vector2.x === 0 && Math.abs(vector2.y) > 0) {
      self.rotation.z = 0;
    }
    if (Math.abs(vector2.x) > 0 && vector2.y === 0) {
      self.rotation.z = Math.PI / 2;
    }
  };

  const tickGenerateSnowBalls = () => {
    var geometry = new THREE.SphereGeometry(
      ballRadius,
      snowballMeshQuality,
      snowballMeshQuality
    );
    var material = new THREE.MeshBasicMaterial({ color: snowColorCode });
    var sphere = new THREE.Mesh(geometry, material);
    const boundBoxVertical = floorScale - ballRadius * 2;
    sphere.position.x = Math.random() * boundBoxVertical - boundBoxVertical / 2;
    sphere.position.y = Math.random() * boundBoxVertical - boundBoxVertical / 2;
    sphere.position.z = snowBallInitialZ;
    scene.add(sphere);
    sphere.name = "snowball";
  };

  const tickSnowballsAndShadow = () => {
    const deleteShadow = () => {
      var shadows = scene.children.filter(
        (child) => child.name === "snowballShadow"
      );
      shadows.forEach((shadow) => {
        scene.remove(shadow);
      });
    };
    deleteShadow();

    var balls = scene.children.filter((child) => child.name === "snowball");
    balls.forEach((ball) => {
      const move = () => {
        ball.position.z -=
          ((snowBallInitialZ - ball.position.z + 1) / 20) * snowballSpeedFactor;
        if (ball.position.z < 0) {
          scene.remove(ball);
        }
      };
      move();

      const makeShadow = () => {
        const geometry = new THREE.CircleGeometry(ballRadius, 32);
        const material = materialShadow;
        const shadow = new THREE.Mesh(geometry, material);
        shadow.name = "snowballShadow";
        shadow.position.x = ball.position.x;
        shadow.position.y = ball.position.y;
        shadow.position.z = 0.2;
        scene.add(shadow);
      };
      makeShadow();
    });
  };

  const tickWallBlock = () => {
    var self = getSelf();
    if (self.position.x > floorScale / 2 - playerScale / 3) {
      self.position.x = floorScale / 2 - playerScale / 3;
    }
    if (self.position.x < -floorScale / 2 + playerScale / 3) {
      self.position.x = -floorScale / 2 + playerScale / 3;
    }
    if (self.position.y > floorScale / 2 - playerScale / 3) {
      self.position.y = floorScale / 2 - playerScale / 3;
    }
    if (self.position.y < -floorScale / 2 + playerScale / 3) {
      self.position.y = -floorScale / 2 + playerScale / 3;
    }
  };

  const tickSnowBallCollision = () => {
    var self = getSelf();
    var balls = scene.children.filter((child) => child.name === "snowball");
    balls.forEach((ball) => {
      if (
        ball.position.distanceTo(self.position) <
        playerScale / 3 + ballRadius
      ) {
        if (!gameEnded) {
          cancelAnimationFrame(gameRAFId);
          Over();
          socket.emit("over", { room: room });
        }
        gameEnded = true;
      }
    });
  };

  let enemyLastX = undefined;
  let enemyLastY = undefined;
  const syncAnotherPlayer = (x, y) => {
    var enemy = getEnemy();
    (() => {
      if (enemyLastX === undefined || enemyLastY === undefined) {
        console.log("returnByUndefined");
        return;
      }
      if (x === enemyLastX) {
        enemy.rotation.z = 0;
        console.log("x===enemyLastX");

        return;
      }
      console.log(
        "atan:" + Math.atan((y - enemyLastY) / (x - enemyLastX)) + Math.PI / 2
      );

      enemy.rotation.z =
        Math.atan((y - enemyLastY) / (x - enemyLastX)) + Math.PI / 2;
    })();

    enemy.position.x = x;
    enemy.position.y = y;
    enemyLastX = x;
    enemyLastY = y;
  };

  const syncGenerateSnowball = (x, y) => {
    var geometry = new THREE.SphereGeometry(
      ballRadius,
      snowballMeshQuality,
      snowballMeshQuality
    );
    var material = new THREE.MeshBasicMaterial({ color: snowColorCode });
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = snowBallInitialZ;
    scene.add(sphere);
    sphere.name = "snowball";
  };

  let lastX = 0;
  let lastY = 0;
  const emitSelfPosition = () => {
    var self = getSelf();
    if (self.position.x === lastX && self.position.y === lastY) {
    } else {
      lastX = self.position.x;
      lastY = self.position.y;
      socket.emit("position", {
        room: room,
        position: { x: self.position.x, y: self.position.y },
      });
    }
  };

  let count = 0;

  window.gameRAFId = "";
  function animate() {
    gameRAFId = requestAnimationFrame(animate);
    tickMoveByKey();
    tickWallBlock();
    tickSnowBallCollision();

    const frameCount = renderer.info.render.frame;
    // if (frameCount % generateSnowBallTicks === 0) {
    //   tickGenerateSnowBalls();
    // }
    let snowBallCount = 0; // 何ターン目か。

    if (frameCount % requestSnowBallTicks === 0) {
      if (playerType === "host") {
        tickRequestFallSnowBall(snowBallCount);
        snowBallCount++;
      }
    }
    tickSnowballsAndShadow();

    if (frameCount % emitPositionTicks === 0) {
      emitSelfPosition();
    }

    renderer.render(scene, camera);
  }
  animate();
  const tickRequestFallSnowBall = (count) => {
    socket.emit("requestFall", { room: room, count: count });
  };
};

window.game = Game;
