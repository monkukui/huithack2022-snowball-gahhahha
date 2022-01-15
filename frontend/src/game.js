import * as THREE from "three";

export const Game = (enemyName) => {
  socket.on("fall", (jsonString) => {
    console.log("fall");
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
  socket.on("over", (data) => {
    console.log(data);
    console.log("over! 負けたか勝ったかどっちかな～");
  });

  camera.position.y = -200;
  camera.position.z = 200;

  camera.rotation.x = 1;

  const snowBallInitialZ = 150;

  const materialBlue = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  });
  const materialSky = new THREE.MeshBasicMaterial({
    color: 0x005555,
  });

  const materialFloor = new THREE.MeshBasicMaterial({
    color: 0xc05050,
  });

  const materialShadow = new THREE.MeshBasicMaterial({
    color: 0x202020,
  });

  const playerScale = 30;
  const ballRadius = 14;
  const generateSnowBallTicks = 35;
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
  // makeFloor();

  const makePlayer = () => {
    const head_ = new THREE.SphereGeometry(
      playerScale*0.1,
      32
    );
    const neck = new THREE.CylinderGeometry(
      playerScale*0.1,
      playerScale*0.1,
      playerScale*0.1,
      32
    );
    const torso = new THREE.BoxGeometry(
      playerScale*0.2,
      playerScale*0.4,
      playerScale*0.2
    );
    const arm = new THREE.CylinderGeometry(
      playerScale*0.05,
      playerScale*0.05,
      playerScale*0.35,
      32
    );
    const leg = new THREE.CylinderGeometry(
      playerScale*0.05,
      playerScale*0.05,
      playerScale*0.4,
      32
    );
    
    const p1_head = new THREE.Mesh(head_, materialSky);
    p1_head.position.x = -50;
    p1_head.position.z = playerScale * 0.9;
    
    const p1_neck = new THREE.Mesh(neck, materialBlue);
    p1_neck.position.x = -50;
    p1_neck.position.z = playerScale * 0.8;
    p1_neck.rotation.x = Math.PI / 2;
    
    const p1_torso = new THREE.Mesh(torso, materialBlue);
    p1_torso.position.x = -50;
    p1_torso.position.z = playerScale * 0.6;
    p1_torso.rotation.x = Math.PI / 2;
    
    const p1_arm_l = new THREE.Mesh(arm, materialBlue);
    p1_arm_l.position.x = -50 - playerScale * 0.15;
    p1_arm_l.position.z = playerScale * 0.6;
    p1_arm_l.rotation.x = Math.PI / 2;
    p1_arm_l.rotation.z = Math.PI * (-0.1);
    
    const p1_arm_r = new THREE.Mesh(arm, materialBlue);
    p1_arm_r.position.x = -50 + playerScale * 0.15;
    p1_arm_r.position.z = playerScale * 0.6;
    p1_arm_r.rotation.x = Math.PI / 2;
    p1_arm_r.rotation.z = Math.PI * 0.1;
    
    const p1_leg_l = new THREE.Mesh(leg, materialBlue);
    p1_leg_l.position.x = -50 - playerScale * 0.07;
    p1_leg_l.position.z = playerScale * 0.2;
    p1_leg_l.rotation.x = Math.PI / 2;
    p1_leg_l.rotation.z = Math.PI * (-0.05);
    
    const p1_leg_r = new THREE.Mesh(leg, materialBlue);
    p1_leg_r.position.x = -50 + playerScale * 0.07;
    p1_leg_r.position.z = playerScale * 0.2;
    p1_leg_r.rotation.x = Math.PI / 2;
    p1_leg_r.rotation.z = Math.PI * 0.05;

    const p1 = new THREE.Group();
    p1.add(p1_head);
    p1.add(p1_torso);
    p1.add(p1_arm_l);
    p1.add(p1_arm_r);
    p1.add(p1_leg_l);
    p1.add(p1_leg_r);
    p1.name = "p1";
    scene.add(p1);
  };
  makePlayer1();

  const makePlayer2 = () => {
    const geometry = new THREE.CylinderGeometry(
      playerRadius,
      playerRadius,
      playerHeight,
      32
    );
    const cylinder = new THREE.Mesh(geometry, materialSky);
    cylinder.name = "cylinder2";
    cylinder.position.x = 50;
    cylinder.rotation.x = Math.PI / 2;
    cylinder.position.z = playerHeight / 2;

    // const p2 = new THREE.Group();
    // p2.add(p2_head);
    // p2.add(p2_torso);
    // p2.add(p2_arm_l);
    // p2.add(p2_leg_l);
    // p2.name = "p2";
    // scene.add(p2);
  };
  makePlayer2();

  const getSelf = () => {
    return scene.getObjectByName(
      playerType === "host" ? "cylinder1" : "cylinder2"
    );
  };

  const getEnemy = () => {
    return scene.getObjectByName(
      playerType === "guest" ? "cylinder1" : "cylinder2"
    );
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
  };

  const tickGenerateSnowBalls = () => {
    var geometry = new THREE.SphereGeometry(
      ballRadius,
      snowballMeshQuality,
      snowballMeshQuality
    );
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
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
          console.log("removed");
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
    if (self.position.x > floorScale / 2 - playerRadius) {
      self.position.x = floorScale / 2 - playerRadius;
    }
    if (self.position.x < -floorScale / 2 + playerRadius) {
      self.position.x = -floorScale / 2 + playerRadius;
    }
    if (self.position.y > floorScale / 2 - playerRadius) {
      self.position.y = floorScale / 2 - playerRadius;
    }
    if (self.position.y < -floorScale / 2 + playerRadius) {
      self.position.y = -floorScale / 2 + playerRadius;
    }
  };

  const tickSnowBallCollision = () => {
    var self = getSelf();
    var balls = scene.children.filter((child) => child.name === "snowball");
    balls.forEach((ball) => {
      if (ball.position.distanceTo(self.position) < playerRadius + ballRadius) {
        console.log("hit");
      }
    });
  };

  const syncAnotherPlayer = (x, y) => {
    var enemy = getEnemy();
    enemy.position.x = x;
    enemy.position.y = y;
  };

  const syncGenerateSnowball = (x, y) => {
    var geometry = new THREE.SphereGeometry(
      ballRadius,
      snowballMeshQuality,
      snowballMeshQuality
    );
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
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

  function animate() {
    requestAnimationFrame(animate);
    tickMoveByKey();
    tickWallBlock();
    tickSnowBallCollision();

    const frameCount = renderer.info.render.frame;
    // if (frameCount % generateSnowBallTicks === 0) {
    //   tickGenerateSnowBalls();
    // }
    tickSnowballsAndShadow();

    if (frameCount % emitPositionTicks === 0) {
      emitSelfPosition();
    }

    renderer.render(scene, camera);
  }
  animate();
  let snowBallCount = 0; // 何ターン目か。
  const requestFallSnowBall = (timeOut, count) => {
    const before = Date.now();
    socket.emit("requestFall", { room: room, count: count });
    console.log(Date.now() - before);

    setTimeout(() => requestFallSnowBall(timeOut, count++), timeOut); // TODO: どんどんはやく
  };
  if (playerType === "host") {
    requestFallSnowBall(500, count++);
  }
};

window.game = Game;
