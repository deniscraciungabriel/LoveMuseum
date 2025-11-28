import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Text, Box } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';

import { Vector3 } from 'three';
import * as THREE from 'three';
import './App.css';
import { TableDisplay } from './TableDisplay';
import { Hallway } from './Hallway';

// Scene Wrapper to pass props
const SceneWrapper = ({ setReading }: { setReading: (reading: boolean) => void }) => {
  const backgroundTexture = new THREE.TextureLoader().load('images/background.png');

  return (
    <>
      <ambientLight intensity={0.8} /> {/* Reduced from 1.2 */}
      <pointLight position={[0, 5, 0]} intensity={1.0} /> {/* Reduced from 1.5 */}
      <pointLight position={[0, 3, 2]} intensity={0.5} /> {/* Reduced from 0.8 */}

      {/* Table Area Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Curved Background Screen */}
      <mesh position={[0, 2.5, 0]} rotation={[0, 1.6, 0.1]}>
        <cylinderGeometry args={[12, 12, 8, 32, 1, true, 0, Math.PI]} />
        <meshStandardMaterial map={backgroundTexture} side={THREE.DoubleSide} />
      </mesh>

      <TableDisplay setReading={setReading} />
      <Hallway />
    </>
  );
};

const Player = ({ reading, setLocked }: { reading: boolean, setLocked: (locked: boolean) => void }) => {
  const { camera } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const direction = useRef(new Vector3());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (reading) return; // Disable movement keys when reading
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (reading) return; // Disable movement keys when reading
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = false;
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [reading]);

  useFrame((state, delta) => {
    if (reading) return; // Stop movement when reading

    const speed = 3.0; // Reduced speed

    // Reset direction
    direction.current.set(0, 0, 0);

    // Correct movement logic
    // Forward (W) moves towards negative Z (default camera view)
    // Backward (S) moves towards positive Z
    if (moveForward.current) direction.current.z -= 1;
    if (moveBackward.current) direction.current.z += 1;

    // Left (A) moves towards negative X
    // Right (D) moves towards positive X
    if (moveLeft.current) direction.current.x -= 1;
    if (moveRight.current) direction.current.x += 1;

    direction.current.normalize();

    // Move camera directly
    if (moveForward.current || moveBackward.current || moveLeft.current || moveRight.current) {
      camera.translateX(direction.current.x * speed * delta);
      camera.translateZ(direction.current.z * speed * delta);
    }

    // Lock Y position (stay on floor)
    camera.position.y = 1.7;
  });

  return <PointerLockControls selector="#canvas-container" onLock={() => setLocked(true)} onUnlock={() => setLocked(false)} />;
};

const ReadingView = ({ onClose }: { onClose: () => void }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      // Simple float animation
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyF') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <group position={[0, 0, -0.5]} ref={group}>
      {/* Card Open Book Style */}
      <group rotation={[0.5, 0, 0]}>
        {/* Left Page */}
        <Box args={[0.3, 0.4, 0.01]} position={[-0.15, 0, 0]}>
          <meshStandardMaterial color="white" />
        </Box>
        {/* Right Page */}
        <Box args={[0.3, 0.4, 0.01]} position={[0.15, 0, 0]}>
          <meshStandardMaterial color="white" />
        </Box>

        {/* Text Content */}
        <Text position={[0.15, 0, 0.01]} fontSize={0.02} color="black" maxWidth={0.25} textAlign="center">
          Happy Birthday!

          This is a test text.

          I hope you have a wonderful day!
        </Text>
      </group>
    </group>
  );
};

// HUD Component removed as it was unused and replaced by CardOverlay


// Better HUD approach: Just a component that follows camera
const CardOverlay = ({ reading, setReading }: { reading: boolean, setReading: (r: boolean) => void }) => {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const [cardTexture] = useState(() => new THREE.TextureLoader().load('images/card_background.jpeg'));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (reading && e.code === 'KeyF') {
        setReading(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reading, setReading]);

  useFrame(() => {
    if (group.current) {
      group.current.position.copy(camera.position);
      group.current.quaternion.copy(camera.quaternion);
      group.current.translateZ(-0.5); // Move in front
    }
  });

  if (!reading) return null;

  return (
    <group ref={group}>
      {/* Card Open Book Style - Bent Up */}
      <group rotation={[0.2, 0, 0]}> {/* Slight tilt towards camera */}
        {/* Left Page - Rotated to open left */}
        <Box args={[0.3, 0.4, 0.01]} position={[-0.15, 0, 0]} rotation={[0, 0.2, 0]}>
          <meshStandardMaterial map={cardTexture} emissive="white" emissiveIntensity={0.1} />
        </Box>
        {/* Right Page - Rotated to open right */}
        <Box args={[0.3, 0.4, 0.01]} position={[0.15, 0, 0]} rotation={[0, -0.2, 0]}>
          <meshStandardMaterial color="white" />
        </Box>

        {/* Text Content */}
        <Text position={[0.15, 0, 0.02]} rotation={[0, -0.2, 0]} fontSize={0.02} color="black" maxWidth={0.25} textAlign="center">
          Happy Birthday!
          {'\n\n'}
          This is a test text.
          {'\n\n'}
          I hope you have a wonderful day!
        </Text>
      </group>
    </group>
  );
}

function App() {
  const [reading, setReading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  if (showMenu) {
    return (
      <div className="menu-container">
        <div className="menu-content">
          <h1 className="menu-title">The Love Museum</h1>
          <button className="menu-button" onClick={() => setShowMenu(false)}>
            Play with Love
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="canvas-container">
      <div className="crosshair" />
      {!reading && !locked && <div className="instructions">Click to start. WASD to move. Mouse to look.</div>}
      {reading && <div className="hud-hint">Press F to close</div>}

      <Canvas camera={{ position: [0, 1.7, 3], fov: 75 }}>
        <Suspense fallback={null}>
          <SceneWrapper setReading={setReading} />
          <Player reading={reading} setLocked={setLocked} />
          <CardOverlay reading={reading} setReading={setReading} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
