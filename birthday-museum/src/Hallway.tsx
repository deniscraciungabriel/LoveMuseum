import { Text, Box, Extrude } from '@react-three/drei';
import { Frame } from './Frame';
import * as THREE from 'three';
import { useMemo } from 'react';

export const Hallway = () => {
    const hallwayLength = 30; // Extended for more pictures
    const hallwayWidth = 6;
    const hallwayHeight = 5;
    const startZ = 2; // Hallway walls start here

    const hallwayImages = [
        'images/IMG_1055.jpeg',
        'images/IMG_1179.jpeg',
        'images/IMG_1307.jpeg',
        'images/IMG_2067.JPG',
        'images/2787dd72-3888-4918-9dab-8c7ba6f0b2ae.jpg',
        'images/IMG_0461.jpeg',
        'images/IMG_0612.jpeg',
        'images/IMG_5511.jpeg',
        'images/IMG_7607.JPG',
        'images/IMG_7985.JPG',
    ];

    const heartShape = useMemo(() => {
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo(x + 0.5, y + 0.5);
        heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
        heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
        heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
        heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
        heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
        return heartShape;
    }, []);

    const wallTexture = useMemo(() => {
        const texture = new THREE.TextureLoader().load('images/wall_decoration.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 3); // Adjusted for longer hallway
        return texture;
    }, []);

    const floorTexture = useMemo(() => {
        const texture = new THREE.TextureLoader().load('images/floor_decoration.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(3, 15); // Adjusted for longer hallway
        return texture;
    }, []);

    return (
        <group>
            {/* Floor Extension from Table to Hallway */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1]}>
                <planeGeometry args={[hallwayWidth, 2]} />
                <meshStandardMaterial map={floorTexture} />
            </mesh>

            {/* Floor for Hallway */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, startZ + hallwayLength / 2]}>
                <planeGeometry args={[hallwayWidth, hallwayLength]} />
                <meshStandardMaterial map={floorTexture} />
            </mesh>

            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, hallwayHeight, startZ + hallwayLength / 2]}>
                <planeGeometry args={[hallwayWidth, hallwayLength]} />
                <meshStandardMaterial color="#DAA520" /> {/* Gold like frames */}
            </mesh>

            {/* Left Wall - With Decoration */}
            <Box args={[0.1, hallwayHeight, hallwayLength]} position={[-hallwayWidth / 2, hallwayHeight / 2, startZ + hallwayLength / 2]}>
                <meshStandardMaterial map={wallTexture} color="#F5F5DC" opacity={0.6} transparent /> {/* More subtle */}
            </Box>

            {/* Right Wall - With Decoration */}
            <Box args={[0.1, hallwayHeight, hallwayLength]} position={[hallwayWidth / 2, hallwayHeight / 2, startZ + hallwayLength / 2]}>
                <meshStandardMaterial map={wallTexture} color="#F5F5DC" opacity={0.6} transparent /> {/* More subtle */}
            </Box>

            {/* End Wall - With Decoration */}
            <Box args={[hallwayWidth, hallwayHeight, 0.1]} position={[0, hallwayHeight / 2, startZ + hallwayLength]}>
                <meshStandardMaterial map={wallTexture} color="#F5F5DC" opacity={0.6} transparent /> {/* More subtle */}
            </Box>

            {/* Paintings on Walls */}
            {/* Left Wall Paintings */}
            <Frame url={hallwayImages[0]} position={[-hallwayWidth / 2 + 0.15, 2.5, startZ + 5]} rotation={[0, Math.PI / 2, 0]} scale={[1.8, 1.8, 1.8]} />
            <Frame url={hallwayImages[1]} position={[-hallwayWidth / 2 + 0.15, 2.5, startZ + 10]} rotation={[0, Math.PI / 2, 0]} scale={[1.8, 1.8, 1.8]} />
            <Frame url={hallwayImages[2]} position={[-hallwayWidth / 2 + 0.15, 2.5, startZ + 15]} rotation={[0, Math.PI / 2, 0]} scale={[1.8, 1.8, 1.8]} />
            <Frame url={hallwayImages[3]} position={[-hallwayWidth / 2 + 0.15, 2.5, startZ + 20]} rotation={[0, Math.PI / 2, 0]} scale={[1.8, 1.8, 1.8]} />
            <Frame url={hallwayImages[4]} position={[-hallwayWidth / 2 + 0.15, 2.5, startZ + 25]} rotation={[0, Math.PI / 2, 0]} scale={[1.8, 1.8, 1.8]} />

            {/* Right Wall Paintings */}
            <Frame url={hallwayImages[5]} position={[hallwayWidth / 2 - 0.15, 2.5, startZ + 5]} rotation={[0, -Math.PI / 2, 0]} scale={[1.8, 1.8, 1.8]} />
            <Frame url={hallwayImages[6]} position={[hallwayWidth / 2 - 0.15, 2.5, startZ + 10]} rotation={[0, -Math.PI / 2, 0]} scale={[1.8, 1.8, 1.8]} />
            <Frame url={hallwayImages[7]} position={[hallwayWidth / 2 - 0.15, 2.5, startZ + 15]} rotation={[0, -Math.PI / 2, 0]} scale={[1.8, 1.8, 1.8]} />
            <Frame url={hallwayImages[8]} position={[hallwayWidth / 2 - 0.15, 2.5, startZ + 20]} rotation={[0, -Math.PI / 2, 0]} scale={[1.8, 1.8, 1.8]} />
            <Frame url={hallwayImages[9]} position={[hallwayWidth / 2 - 0.15, 2.5, startZ + 25]} rotation={[0, -Math.PI / 2, 0]} scale={[1.8, 1.8, 1.8]} />

            {/* 3D Heart Sculpture */}
            <group position={[0, 1.5, startZ + hallwayLength - 2]}> {/* Raised Y to 1.5 */}
                <Extrude args={[heartShape, { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 }]}
                    rotation={[Math.PI, Math.PI, 0]} // Fixed rotation to face user
                    position={[1.0, 2.5, 0]} // Adjusted X to 1.0 to center the shape (approx)
                    scale={[2, 2, 2]}
                >
                    <meshStandardMaterial color="red" metalness={0.6} roughness={0.2} />
                </Extrude>

                <Text
                    position={[0, 0.8, -0.5]} // Lowered Y from 1.5 to 0.8
                    rotation={[0, Math.PI, 0]}
                    fontSize={0.5} // Reduced font size
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    I LOVE YOU
                </Text>
            </group>
        </group>
    );
};
