import { Game } from "./game";
import * as THREE from "three";
import { _id } from "./index";

const destroyScene = (scene) => {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
};

const 準備はいいかな = "準備はいいかな？<br>方向キーを使って操作してね<br>";

window.gamePlaying = false;

export const OpeningAnimation = (isSolo = false) => {
  _id("gameStart").style.display = "block";
  if (isSolo) {
    _id("matchInfo").innerHTML = `ソロモード`;
    _id("gameStart").innerHTML = `ソロモード`;
  } else {
    const [me, you] =
      room.host.socketId == socket.id
        ? [room.host.name, room.guest.name]
        : [room.guest.name, room.host.name];
    _id("matchInfo").innerHTML = `${me} vs ${you}`;
    _id("gameStart").innerHTML = `${me}<br>vs<br>${you}`;
  }

  socket.on("start", () => {
    _id("gameStart").innerHTML = `${準備はいいかな}<br>3`;
    destroyScene(scene);
    cancelAnimationFrame(openingRAFId);
    Game(isSolo);
  });

  setTimeout(() => {
    _id("gameStart").innerHTML = `${準備はいいかな}<br>2`;
  }, 4000);
  setTimeout(() => {
    _id("gameStart").innerHTML = `${準備はいいかな}<br>1`;
  }, 5000);
  setTimeout(() => {
    _id("gameStart").innerHTML = `${準備はいいかな}<br>0`;
  }, 6000);
  setTimeout(() => {
    _id("gameStart").innerHTML = `START!!`;
    gamePlaying = true;
  }, 7000);
  setTimeout(() => {
    _id("gameStart").style.display = "none";
  }, 8000);

  setTimeout(() => {
    socket.emit("startGameRequest", window.room);
    _id("point-container").style.display = "block";
  }, 3000);

  const ballRadius = 10;
  const ballCount = 8;
  const ballLaunchFactor = 3;
  const ballSpeedFactor = 20;

  const generateSkyBox = () => {
    const Distance = 500;

    const skyBox = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(Distance * 2, Distance * 2),
      new THREE.MeshBasicMaterial({ color: 0x60b060 })
    );
    [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ].forEach(([x, y, z]) => {
      const clonedSkyBox = skyBox.clone();
      clonedSkyBox.position.x = Distance * x;
      clonedSkyBox.position.y = Distance * y;
      clonedSkyBox.position.z = Distance * z;
      clonedSkyBox.rotation.x = y === 0 ? Math.PI / 2 : 0;
      clonedSkyBox.rotation.y = x === 0 ? Math.PI / 2 : 0;
      scene.add(clonedSkyBox);
    });
  };
  generateSkyBox();

  const ballInitialStats = (() => {
    // {id/initialPosition/speed/direction/createdAt}
    const getOutsideRandom = () => {
      const sign = Math.random() > 0.5 ? 1 : -1;
      return sign * (Math.random() * 50 + 100);
    };

    const getVector2Center = (vector3) => {
      const centerPosition = new THREE.Vector3().random().multiplyScalar(50);
      return centerPosition.sub(vector3);
    };

    const ret = [];
    for (let i = 0; i < ballCount; i++) {
      const initialPosition = new THREE.Vector3(
        getOutsideRandom(),
        getOutsideRandom(),
        getOutsideRandom()
      );
      ret.push({
        name: "openingSnowball" + Math.random().toString(),
        initialPosition: initialPosition,
        speed: Math.random() + 5,
        direction: getVector2Center(initialPosition).normalize(),
        createdAt: Date.now(),
      });
    }

    return ret;
  })();
  window.stats = ballInitialStats;

  const generateBalls = () => {
    ballInitialStats.forEach((ballStats) => {
      var geometry = new THREE.SphereGeometry(ballRadius, 32, 32);
      var material = new THREE.MeshBasicMaterial({ color: snowColorCode });
      var sphere = new THREE.Mesh(geometry, material);
      sphere.position.x = ballStats.initialPosition.x;
      sphere.position.y = ballStats.initialPosition.y;
      sphere.position.z = ballStats.initialPosition.z;
      sphere.name = ballStats.name;
      scene.add(sphere);
    });
  };
  generateBalls();

  const generateLastBall = () => {
    var geometry = new THREE.SphereGeometry(ballRadius, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: snowColorCode });
    var sphere = new THREE.Mesh(geometry, material);

    // sphere.position.z = ballStats.initialPosition.z;
    sphere.name = "lastSnowball";
    setTimeout(() => {
      scene.add(sphere);
    }, 2000);
  };
  generateLastBall();

  const tickBalls = () => {
    const balls = scene.children.filter((child) =>
      child.name.includes("openingSnowball")
    );
    balls.forEach((ball) => {
      const ballStats = ballInitialStats.find((stats) => {
        return ball.name === stats.name;
      });
      const deltaSecondsFromCreated = (Date.now() - ballStats.createdAt) / 1000;
      const dest = ballStats.initialPosition
        .clone()
        .add(
          ballStats.direction
            .clone()
            .normalize()
            .multiplyScalar(
              ballLaunchFactor *
                ballStats.speed *
                deltaSecondsFromCreated *
                ballSpeedFactor
            )
        )
        .sub(
          new THREE.Vector3(
            0,
            0,
            4.9 * deltaSecondsFromCreated * deltaSecondsFromCreated
          ).multiplyScalar(ballSpeedFactor)
        );
      ball.position.x = dest.x;
      ball.position.y = dest.y;
      ball.position.z = dest.z;

      if (
        Math.abs(ball.position.x) > 500 ||
        Math.abs(ball.position.y) > 500 ||
        Math.abs(ball.position.z) > 200
      ) {
        scene.remove(ball);
      }
    });
  };

  const tickLastBall = () => {
    const lastBall = scene.getObjectByName("lastSnowball");
    if (lastBall === undefined) {
      // console.log("lastBall is undefined");
      return;
    }

    const direction = camera.position
      .clone()
      .sub(lastBall.position)
      .normalize();
    // console.log(direction);

    lastBall.position.x += (direction.x * ballSpeedFactor) / 6;
    lastBall.position.y += (direction.y * ballSpeedFactor) / 6;
    lastBall.position.z += (direction.z * ballSpeedFactor) / 6;
  };

  window.tickBalls = tickBalls;
  window.openingRAFId = "";
  function animate() {
    openingRAFId = requestAnimationFrame(animate);
    tickBalls();
    tickLastBall();
    renderer.render(scene, camera);
  }
  animate();
};
