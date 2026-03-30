"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  CylinderCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";

const LOGO_URLS = [
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg",
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/reactnative/reactnative-original.svg",
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg",
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg",
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg",
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg",
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg",
];

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(42)].map(() => ({
  scale: [0.72, 0.88, 1.0, 1.16, 1.32][Math.floor(Math.random() * 5)],
  materialIndex: Math.floor(Math.random() * LOGO_URLS.length),
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  materialIndex: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  materials: THREE.MeshPhysicalMaterial[];
  isInteractive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  materialIndex,
  r = THREE.MathUtils.randFloatSpread,
  materials,
  isInteractive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const material = materials[materialIndex] ?? materials[0];

  useFrame((_state, delta) => {
    if (!api.current) return;
    const dt = Math.min(0.1, delta);

    const centerImpulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -30 * dt * scale,
          -30 * dt * scale,
          -30 * dt * scale
        )
      );

    // When idle, balls cluster; when interactive, pointer collisions become dominant.
    if (isInteractive) {
      api.current.applyImpulse(centerImpulse.multiplyScalar(0.35), true);
      return;
    }

    api.current.applyImpulse(centerImpulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(6), r(6), r(6)]}
      ref={api}
      colliders={false}
      canSleep={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isInteractive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isInteractive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isInteractive) {
      ref.current?.setNextKinematicTranslation(new THREE.Vector3(100, 100, 100));
      return;
    }

    const targetVec = vec.lerp(
      new THREE.Vector3((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0),
      0.2
    );

    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

type TechStackSceneProps = {
  isInteractive: boolean;
};

function TechStackScene({ isInteractive }: TechStackSceneProps) {
  const logoTextures = useTexture(LOGO_URLS);

  const materials = useMemo(
    () =>
      logoTextures.map((texture) => {
        const colorTexture = texture.clone();
        colorTexture.colorSpace = THREE.SRGBColorSpace;
        return new THREE.MeshPhysicalMaterial({
          color: "#f0b825",
          emissive: "#9fc9ff",
          emissiveMap: colorTexture,
          emissiveIntensity: 0.14,
          metalness: 0.8,
          roughness: 0.34,
          clearcoat: 0.5,
          clearcoatRoughness: 0.24,
        });
      }),
    [logoTextures]
  );

  return (
    <>
      <ambientLight intensity={1.05} />

      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.28}
        color="white"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <directionalLight position={[0, 5, -4]} intensity={2.1} />

      <Physics gravity={[0, 0, 0]}>
        <Pointer isInteractive={isInteractive} />
        {spheres.map((props, i) => (
          <SphereGeo key={i} {...props} materials={materials} isInteractive={isInteractive} />
        ))}
      </Physics>

      <Environment preset="city" />

      <EffectComposer enableNormalPass={false}>
        <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
      </EffectComposer>
    </>
  );
}

const TechStack = () => {
  const [isInteractive, setIsInteractive] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  const activateInteraction = () => {
    setIsInteractive(true);
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      setIsInteractive(false);
      idleTimerRef.current = null;
    }, 320);
  };

  useEffect(() => {
    return () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="techstack">
      <div className="techstack-layout">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ alpha: true, stencil: false, depth: true, antialias: true }}
          camera={{ position: [0, 0, 14], fov: 45, near: 0.1, far: 140 }}
          onCreated={(state) => {
            state.gl.toneMappingExposure = 1.5;
          }}
          onPointerMove={activateInteraction}
          onPointerDown={activateInteraction}
          onPointerLeave={() => setIsInteractive(false)}
          className="tech-canvas"
        >
          <TechStackScene isInteractive={isInteractive} />
        </Canvas>

        <aside className="techstack-meta" aria-label="Tech stack list">
          <p className="techstack-meta-title">Tech Stack</p>
          <div className="techstack-meta-grid">
            <span>React</span>
            <span>React Native</span>
            <span>Next.js</span>
            <span>JavaScript</span>
            <span>TypeScript</span>
            <span>Node.js</span>
            <span>Express</span>
            <span>Firebase</span>
            <span>Docker</span>
            <span>Kubernetes</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TechStack;
