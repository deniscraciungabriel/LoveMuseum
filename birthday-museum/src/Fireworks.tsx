import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const particleCount = 200; // Increased count
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

export const Fireworks = ({ position }: { position: [number, number, number] }) => {
    const group = useRef<THREE.Group>(null);

    // Create particles with random velocities and colors
    const particles = useMemo(() => {
        return new Array(particleCount).fill(0).map(() => ({
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 1.0, // Much wider spread (was 0.5)
                (Math.random() - 0.5) * 1.0 + 0.8, // Higher and faster upward (was 0.4)
                (Math.random() - 0.5) * 1.0 // Much wider spread (was 0.5)
            ),
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 3.0 + Math.random() * 2.0, // Longer life (3-5 seconds)
            position: new THREE.Vector3(0, 0, 0)
        }));
    }, []);

    useFrame((_state, delta) => {
        if (!group.current) return;

        // Update particles
        group.current.children.forEach((child, i) => {
            const particle = particles[i];

            if (particle.life > 0) {
                // Update position
                particle.position.add(particle.velocity);
                // Gravity
                particle.velocity.y -= 0.005;
                // Fade out life
                particle.life -= delta;

                child.position.copy(particle.position);
                child.scale.setScalar(particle.life * 0.1); // Shrink as they die
                (child as THREE.Mesh).visible = true;
            } else {
                (child as THREE.Mesh).visible = false;
            }
        });
    });

    return (
        <group ref={group} position={position}>
            {particles.map((particle, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color={particle.color} />
                </mesh>
            ))}
        </group>
    );
};
