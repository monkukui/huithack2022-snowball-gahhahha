import { Game } from "./game";
import * as THREE from "three";
export const OpeningAnimation = (enemyName) => {
  socket.on("start", () => {
    Game(enemyName);
  });
  // socket.emit("start");

  const ballRadius = 10;
  const ballCount = 8;

  const ballInitialStats = (() => {
    // {id/initialPosition/speed/direction/createdAt}
    const getOutsideRandom = () => {
      const sign = Math.random > 0.5 ? 1 : -1;
      return sign * Math.random() * Math.random() * 100 + 150;
    };

    const getVector2Center = (vector3) => {
      const centerPosition = new THREE.Vector3().random() * 100;
      return vector3.sub(centerPosition);
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
        initialPosition,
        speed: Math.random() + 5,
        direction: getVector2Center(initialPosition),
        created: Date.now(),
      });
    }
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
      scene.add(sphere);
      sphere.name = ballStats.name;
    });
  };
  generateBalls();
  const tickBalls = () => {
    const balls = scene.children.filter((child) =>
      child.name.includes("openingSnowball")
    );
    balls.forEach((ball) => {
      const ballStats = scene.getObjectById(ball.id);
      const deltaSecondsFromCreated = (Date.now() - ballStats.createdAt) / 1000;
      const dest =
        ballStats.initialPosition +
        ballStats.direction
          .multiplyScalar(deltaSecondsFromCreated)
          .sub(
            new THREE.Vector3(
              0,
              0,
              4.9 * deltaSecondsFromCreated * deltaSecondsFromCreated
            ) / 1000
          );
      console.log(ballStats.direction);
      ball.position.x = dest.x;
      ball.position.y = dest.y;
      ball.position.z = dest.z;
    });
  };
  window.tickBalls = tickBalls;

  function animate() {
    requestAnimationFrame(animate);
    // tickBalls();
    renderer.render(scene, camera);
  }
  animate();
};
