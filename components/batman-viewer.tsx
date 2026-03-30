"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function BatmanViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff7e6);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 2.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.42;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.minDistance = 1.6;
    controls.maxDistance = 3.2;
    controls.minAzimuthAngle = -0.65;
    controls.maxAzimuthAngle = 0.65;
    controls.minPolarAngle = 1.15;
    controls.maxPolarAngle = 1.95;
    controls.target.set(0, 1.05, 0);
    controls.update();

    const hemi = new THREE.HemisphereLight(0xfff8e8, 0xd2c1a6, 1.38);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff2d8, 2.05);
    key.position.set(2.2, 5.1, 4.8);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    key.shadow.bias = -0.00015;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x8b5cf6, 0.75);
    rim.position.set(-2.8, 2.6, -3.9);
    scene.add(rim);

    const fill = new THREE.PointLight(0x06b6d4, 0.5);
    fill.position.set(2.4, 2.0, -1.6);
    scene.add(fill);

    const topLight = new THREE.SpotLight(0xffffff, 0.95, 20, Math.PI / 4.8, 0.45, 1.1);
    topLight.position.set(0, 6.5, 0.8);
    topLight.target.position.set(0, 0.4, 0);
    topLight.castShadow = true;
    scene.add(topLight);
    scene.add(topLight.target);

    const frontSpot = new THREE.SpotLight(0xfffbef, 1.5, 14, Math.PI / 5.3, 0.28, 1.15);
    frontSpot.position.set(0, 3.4, 3.2);
    frontSpot.target.position.set(0, 0.1, 0);
    frontSpot.castShadow = true;
    scene.add(frontSpot);
    scene.add(frontSpot.target);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.8, 64),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.11 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.34;
    floor.receiveShadow = true;
    scene.add(floor);

    let model: THREE.Object3D | null = null;

    const loader = new GLTFLoader();
    loader.load(
      "/models/batman.glb",
      (gltf) => {
        model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const safeHeight = size.y || 1;

        // Normalize model height, then center it exactly at world origin.
        const targetHeight = 2.4;
        const scale = targetHeight / safeHeight;
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const scaledHeight = size.y * scale;
        const fov = THREE.MathUtils.degToRad(camera.fov);
        const fitDistance = (scaledHeight * 0.5) / Math.tan(fov * 0.5);
        const cameraDistance = fitDistance * 1.22;

        camera.position.set(0, 0.15, cameraDistance);
        camera.lookAt(0, 0, 0);

        controls.target.set(0, 0, 0);
        controls.minDistance = cameraDistance * 0.72;
        controls.maxDistance = cameraDistance * 1.5;
        controls.minAzimuthAngle = -0.62;
        controls.maxAzimuthAngle = 0.62;
        controls.update();

        scene.add(model);
      },
      undefined,
      (err) => {
        console.error("Failed to load /models/batman.glb", err);
      }
    );

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
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

  return <div ref={containerRef} className="batman-canvas" />;
}
