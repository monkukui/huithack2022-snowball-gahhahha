import * as THREE from "three";

export const Game = (enemyName) => {
  socket.on("fall", (jsonString) => {
    const data = JSON.parse(jsonString).data;
    const x = data.x;
    const y = data.y;
    syncGenerateSnowball(x, y);
  });

  socket.on("enemyPosition", (jsonString) => {
    const data = JSON.parse(jsonString).data;
    const x = data.x;
    const y = data.y;
    syncAnotherPlayer(x, y);
  });

  socket.on("disconnected", () => {});
  socket.on("over", (data) => {
    console.log(data);
    console.log("over! 負けたか勝ったかどっちかな～");
  });

  // camera.position(new THREE.Vector3(0, -200, 500));
  camera.position.x = 0;
camera.position.y = -100;
camera.position.z = 100;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

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
  const floorScale = 200;
  const snowballSpeedFactor = 1.5;
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
  makePlayer();

  const makeAnotherPlayer = () => {
    //   const head_ = new THREE.SphereGeometry(
    //   playerScale*0.2,
    //   32
    // );
    // const torso = new THREE.CylinderGeometry(
    //   playerScale*0.4,
    //   playerScale*0.4,
    //   playerScale*0.2,
    //   32
    // );
    // const arm = new THREE.CylinderGeometry(
    //   playerScale*0.5,
    //   playerScale*0.5,
    //   playerScale*0.1,
    //   32
    // );
    // const leg = new THREE.CylinderGeometry(
    //   playerScale*0.4,
    //   playerScale*0.3,
    //   playerScale*0.1,
    //   32
    // );
    
    // const p2_head = new THREE.Mesh(head_, materialSky);
    // p2_head.position.x = 50;
    // p2_head.position.z = playerScale / 2;
    
    // const p2_torso = new THREE.Mesh(torso, materialBlue);
    // p2_torso.position.x = -50;
    // p2_torso.position.z = playerScale * 3 / 4;
    // p2_torso.rotation.x = Math.PI / 2;
    
    // const p2_arm_l = new THREE.Mesh(arm, materialBlue);
    // p2_arm_l.position.x = -50;
    // p2_arm_l.position.z = playerScale * 3 / 4;
    // p2_arm_l.rotation.x = Math.PI / 2;
    
    // const p2_leg_l = new THREE.Mesh(leg, materialBlue);
    // p2_leg_l.position.x = -50;
    // p2_leg_l.position.z = playerScale * 3 / 4;
    // p2_leg_l.rotation.x = Math.PI / 2;

    // const p2 = new THREE.Group();
    // p2.add(p2_head);
    // p2.add(p2_torso);
    // p2.add(p2_arm_l);
    // p2.add(p2_leg_l);
    // p2.name = "p2";
    // scene.add(p2);
  };
  makeAnotherPlayer();

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
    var p1 = scene.getObjectByName("p1");
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
    p1.position.x += vector2.x * speedFactor;
    p1.position.y += vector2.y * speedFactor;
  };

  const tickGenerateSnowBalls = () => {
    var geometry = new THREE.SphereGeometry(ballRadius, 32, 32);
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
    var player = scene.getObjectByName("p1");
    if (player.position.x > floorScale / 2 - playerScale) {
      player.position.x = floorScale / 2 - playerScale;
    }
    if (player.position.x < -floorScale / 2 + playerScale) {
      player.position.x = -floorScale / 2 + playerScale;
    }
    if (player.position.y > floorScale / 2 - playerScale) {
      player.position.y = floorScale / 2 - playerScale;
    }
    if (player.position.y < -floorScale / 2 + playerScale) {
      player.position.y = -floorScale / 2 + playerScale;
    }
  };

  const tickSnowBallCollision = () => {
    var player = scene.getObjectByName("p1");
    var balls = scene.children.filter((child) => child.name === "snowball");
    balls.forEach((ball) => {
      if (
        ball.position.distanceTo(player.position) <
        playerScale + ballRadius
      ) {
        console.log("hit");
      }
    });
  };

  const syncAnotherPlayer = (x, y) => {
    var cylinder2 = scene.getObjectByName("cylinder2");
    cylinder2.position.x = x;
    cylinder2.position.y = y;
  };

  const syncGenerateSnowball = (x, y) => {
    var geometry = new THREE.SphereGeometry(ballRadius, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = snowBallInitialZ;
    scene.add(sphere);
    sphere.name = "snowball";
  };

  function animate() {
    requestAnimationFrame(animate);

    tickMoveByKey();
    tickWallBlock();
    tickSnowBallCollision();

    const frameCount = renderer.info.render.frame;
    if (frameCount % generateSnowBallTicks === 0) {
      tickGenerateSnowBalls();
    }
    tickSnowballsAndShadow();

    renderer.render(scene, camera);
  }
  animate();
};

window.game = Game;
