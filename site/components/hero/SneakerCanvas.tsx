import { Component, Suspense, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { heroSneaker } from "@/site/content";
import type { HeroMotion } from "./heroMotion";

// Real glTF sneaker: "Materials Variants Shoe" by Shopify (CC BY 4.0, Khronos glTF sample assets),
// re-coloured to white knit + orange accents and re-compressed (WebP textures, ~1 MB).

// Resting pose: three-quarter view, toe towards the viewer's left, a slight forward tilt.
const POSE = { x: 0.16, y: -0.62, z: 0.06, lift: -0.14 };

type Props = {
  motion: HeroMotion;
  /** CSS shadow on the pedestal; scaled from the render loop so it breathes with the float */
  shadow: React.RefObject<HTMLDivElement | null>;
  active: boolean;
  onReady: () => void;
  onError: () => void;
};

function Sneaker({ motion, shadow, onReady }: Pick<Props, "motion" | "shadow" | "onReady">) {
  const { scene } = useGLTF(heroSneaker.model);
  const group = useRef<THREE.Group>(null!);
  const tilt = useRef({ x: 0, y: 0 });
  const invalidate = useThree((s) => s.invalidate);

  // Normalise whatever units the file uses: 2.1 scene units long, centred on the origin.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const s = 2.3 / Math.max(size.x, size.z);
    return { s, offset: centre.multiplyScalar(-s) };
  }, [scene]);

  useLayoutEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.envMapIntensity = 1.15;
      mat.needsUpdate = true;
    });
    invalidate();
    onReady();
  }, [scene, invalidate, onReady]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const m = motion;
    const amb = m.still ? 0 : 1;
    const e = m.enter;
    const settle = 1 - e;
    const k = Math.min(1, dt * 2.6);
    tilt.current.x += (m.py * 0.14 - tilt.current.x) * k;
    tilt.current.y += (m.px * 0.28 - tilt.current.y) * k;

    const float = Math.sin(t * 0.9) * 0.07 * amb;
    const sway = Math.sin(t * 0.4) * 0.34 * amb; // a slow ±20° turn, ~16 s per cycle

    g.position.y = POSE.lift + float - settle * 0.45 + m.scroll * 0.5;
    g.rotation.set(
      POSE.x + tilt.current.x + settle * 0.12,
      POSE.y + sway + tilt.current.y + settle * 0.85 + m.scroll * 1.4,
      POSE.z + Math.sin(t * 0.6) * 0.025 * amb,
    );

    const el = shadow.current;
    if (el) {
      const h = float / 0.07; // -1 (low) … 1 (high)
      el.style.transform = `translate(-50%, -50%) scale(${(1 - h * 0.08) * (0.7 + 0.3 * e)})`;
      el.style.opacity = String((0.62 - h * 0.12) * e * (1 - m.scroll));
    }
  });

  return (
    <group ref={group}>
      <group scale={fit.s} position={fit.offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

/** Lights tuned to the CSS showroom: warm sun from the left, white rim from behind, a whisper of orange below. */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} color="#f4f8ff" />
      <directionalLight position={[-4, 3.5, 3]} intensity={2.4} color="#eef4ff" />
      <directionalLight position={[3.5, 2.5, -4]} intensity={2.6} color="#ffffff" />
      <pointLight position={[0.2, -1.4, 0.8]} intensity={2.2} distance={4} color="#F47735" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#f1f6ff" position={[-5, 2, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ffffff" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[4, 1, -4]} rotation-y={-Math.PI / 4} scale={[3, 5, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#F47735" position={[0, -3, 1]} rotation-x={-Math.PI / 2} scale={[5, 2, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#EEF2F7" position={[0, 0, 6]} scale={[10, 6, 1]} />
      </Environment>
    </>
  );
}

useGLTF.preload(heroSneaker.model);

class ModelBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Transparent WebGL canvas layered over the CSS pedestal. Loaded lazily by the hero. */
export default function SneakerCanvas({ motion, shadow, active, onReady, onError }: Props) {
  const [dpr, setDpr] = useState(1.75);
  const loop = motion.still || !active ? "demand" : "always";

  return (
    <Canvas
      frameloop={loop}
      dpr={[1, dpr]}
      camera={{ position: [0, 0.25, 5.4], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", onError, { once: true });
      }}
      aria-hidden
      tabIndex={-1}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Lights />
      <ModelBoundary onError={onError}>
        <Suspense fallback={null}>
          <Sneaker motion={motion} shadow={shadow} onReady={onReady} />
        </Suspense>
      </ModelBoundary>
    </Canvas>
  );
}
