"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type ModelViewerProps = {
  className?: string;
};

export function ModelViewer({ className }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0.2, 0.2, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.58;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.autoRotate = false;
    controls.minDistance = 1.8;
    controls.maxDistance = 3.4;
    controls.minAzimuthAngle = -Math.PI / 4;
    controls.maxAzimuthAngle = Math.PI / 4;
    controls.minPolarAngle = 1.05;
    controls.maxPolarAngle = 2.1;
    controls.target.set(0, 0.25, 0);
    controls.update();

    const hemi = new THREE.HemisphereLight(0xfff8e8, 0x1f1a0d, 1.45);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff2d8, 2.35);
    key.position.set(2.4, 3.8, 4.1);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    key.shadow.bias = -0.00015;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xf0c024, 1.02);
    rim.position.set(-2.6, 2.8, -3.2);
    scene.add(rim);

    const fill = new THREE.PointLight(0x9fb6ff, 0.65);
    fill.position.set(2.0, 2.2, -1.6);
    scene.add(fill);

    const topLight = new THREE.SpotLight(0xffffff, 1.22, 22, Math.PI / 4.8, 0.45, 1.1);
    topLight.position.set(0, 5.5, 0.8);
    topLight.target.position.set(0, 0.2, 0);
    topLight.castShadow = true;
    scene.add(topLight);
    scene.add(topLight.target);

    const frontSpot = new THREE.SpotLight(0xfffbef, 1.72, 16, Math.PI / 5.3, 0.28, 1.15);
    frontSpot.position.set(0.5, 2.8, 3.6);
    frontSpot.target.position.set(0, 0.1, 0);
    frontSpot.castShadow = true;
    scene.add(frontSpot);
    scene.add(frontSpot.target);

    const headLight = new THREE.SpotLight(0xfff7e2, 0.85, 10, Math.PI / 7, 0.35, 1.25);
    headLight.position.set(0.2, 2.2, 2.4);
    headLight.target.position.set(0, 0.75, 0.15);
    scene.add(headLight);
    scene.add(headLight.target);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.8, 64),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.17 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    floor.receiveShadow = true;
    scene.add(floor);

    let model: THREE.Object3D | null = null;
    let baseModelYaw = 0;

    const loader = new GLTFLoader();
    loader.load(
      "/models/batman.glb",
      (gltf) => {
        model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const safeHeight = size.y || 1;

        const targetHeight = 2.9;
        const scale = targetHeight / safeHeight;
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        model.position.y -= 0.2;
        baseModelYaw = model.rotation.y;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const scaledHeight = size.y * scale;
        const fov = THREE.MathUtils.degToRad(camera.fov);
        const fitDistance = (scaledHeight * 0.5) / Math.tan(fov * 0.5);
        const cameraDistance = fitDistance * 1.16;

        camera.position.set(0.2, 0.2, cameraDistance);
        camera.lookAt(0, 0, 0);

        controls.target.set(0, 0.05, 0);
        controls.minDistance = cameraDistance * 0.7;
        controls.maxDistance = cameraDistance * 1.4;
        controls.minAzimuthAngle = -Math.PI / 4;
        controls.maxAzimuthAngle = Math.PI / 4;
        controls.update();

        scene.add(model);
      },
      undefined,
      (err) => {
        console.error("Failed to load /models/batman.glb", err);
      }
    );

    let frame = 0;
    const range = Math.PI / 4;
    const angularSpeed = 1.1;
    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);

      // Oscillate model yaw continuously between -45deg and +45deg.
      if (model) {
        const t = clock.getElapsedTime();
        model.rotation.y = baseModelYaw + Math.sin(t * angularSpeed) * range;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      controls.dispose();
      if (model) {
        scene.remove(model);
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className ?? "batman-canvas"} />;
}

export { ModelViewer as BatmanViewer };
