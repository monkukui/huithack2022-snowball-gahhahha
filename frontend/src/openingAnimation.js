import { Game } from "./game";
import * as THREE from "three";

const destroyScene = (scene) => {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
}

export const OpeningAnimation = (enemyName) => {
  socket.on("start", () => {
    destroyScene(scene)
    cancelAnimationFrame(openingRAFId)
    Game(enemyName);
  });
  // socket.emit("start");

  const ballRadius = 10;
  const ballCount = 8;
  const ballLaunchFactor = 3;
  const ballSpeedFactor = 20;

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
    ret.push({
      name: "openingCenterSnowball" + Math.random().toString(),
      initialPosition: new THREE.Vector3(0, 200, -100),
      speed: 0,
      direction: new THREE.Vector3(0, -1, 2),
      createdAt: Date.now(),
    });
    return ret;
  })();
  window.stats = ballInitialStats;

  const generateBalls = () => {
    ballInitialStats.forEach((ballStats) => {
      var geometry = new THREE.SphereGeometry(ballRadius, 32, 32);
      var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var sphere = new THREE.Mesh(geometry, material);
      sphere.position.x = ballStats.initialPosition.x;
      sphere.position.y = ballStats.initialPosition.y;
      sphere.position.z = ballStats.initialPosition.z;
      sphere.name = ballStats.name;
      scene.add(sphere);
    });
  };
  generateBalls();

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
  window.tickBalls = tickBalls;
  window.openingRAFId = ""
  function animate() {
    openingRAFId = requestAnimationFrame(animate);
    tickBalls();
    renderer.render(scene, camera);
  }
  animate();
};
