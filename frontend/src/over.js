import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
const endingMeshMaterial = new THREE.MeshBasicMaterial({ color: 0x2c3b9e });
const textMeshMaterial = new THREE.MeshBasicMaterial({ color: 0xcff1ff });
const floorScale = 200;
const offsetZ = floorScale / 2;

let endingMeshCreatedAt = undefined;
let endingMeshInitialZ = undefined;
let fontLoaded = false;

export const Over = async () => {
  const generateEndingMesh = async () => {
    const endingMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(floorScale, floorScale),
      endingMeshMaterial
    );
    const group = new THREE.Group();
    group.add(endingMesh);
    const loader = new FontLoader();

    await new Promise((resolve) => {
      loader.load("helvetiker.typeface.json", (font) => {
        if (fontLoaded) {
          return;
        }
        fontLoaded = true;
        console.log("font loaded");
        const geometry = new TextGeometry("Game Over!", {
          font: font,
          size: 20,
          height: 1,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 1,
          bevelSize: 0.5,
          bevelOffset: 0,
          bevelSegments: 5,
        });
        const textMesh = new THREE.Mesh(geometry, textMeshMaterial);
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;

        textMesh.position.set(
          -boundingBox.max.x / 2,
          -boundingBox.max.y / 2 + 20,
          10
        );
        group.add(textMesh);
        group.rotation.x = Math.PI / 2;
        group.position.y = -floorScale / 2;
        group.position.z = 4.9 * 4 * 4 + offsetZ;
        group.name = "endingMesh";

        endingMeshCreatedAt = Date.now();
        endingMeshInitialZ = group.position.z - offsetZ;
        scene.add(group);
        resolve();
      });
    });
    return;
  };
  await generateEndingMesh();

  const tickEndingMesh = () => {
    // console.log("tickEndingMesh");
    const endingMesh = scene.getObjectByName("endingMesh");
    const deltaSecondsFromCreated = (Date.now() - endingMeshCreatedAt) / 1000;
    if (deltaSecondsFromCreated > 4) {
      endingMesh.position.z = offsetZ;
    } else {
      endingMesh.position.z =
        endingMeshInitialZ -
        39.2 * deltaSecondsFromCreated +
        4.9 * deltaSecondsFromCreated * deltaSecondsFromCreated +
        offsetZ;
      camera.position.z += 12 / 60;
      camera.position.y -= 9 / 60;
      camera.rotation.x += Math.PI / 45 / 60;
    }
  };

  function animate() {
    requestAnimationFrame(animate);
    tickEndingMesh();
    renderer.render(scene, camera);
  }
  animate();
};
