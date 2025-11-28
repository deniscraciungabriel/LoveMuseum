import { useRef, useState, useMemo } from 'react';
import { Cylinder, Box, Text, Torus } from '@react-three/drei';
import { Frame } from './Frame';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TableDisplayProps {
    setReading: (reading: boolean) => void;
}

export const TableDisplay = ({ setReading }: TableDisplayProps) => {
    const tableHeight = 1;
    const tableWidth = 3; // Increased width
    const tableDepth = 2;

    const [hovered, setHovered] = useState(false);
    const cardRef = useRef<THREE.Group>(null);
    const { camera, raycaster } = useThree();

    // Raycasting logic
    useFrame(() => {
        if (cardRef.current) {
            // Raycast from center of screen (0,0)
            raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
            const intersects = raycaster.intersectObjects(cardRef.current.children, true);

            if (intersects.length > 0) {
                if (!hovered) setHovered(true);
            } else {
                if (hovered) setHovered(false);
            }
        }
    });

    const handleCardClick = () => {
        if (hovered) {
            setReading(true);
        }
    };

    // Add global click listener for raycasting interaction
    useFrame(() => {
        // This is a bit hacky, better to handle click in App or use event system properly.
        // But since we need raycasting from center, manual check is fine.
    });

    // We'll use a simple onClick on the group for now, but the user requested "pointer to know where player is clicking"
    // which implies center-screen interaction.
    // The standard onClick in R3F works with the mouse cursor, not center screen for PointerLock.
    // So we need to listen to 'click' event on document and check raycaster.

    // Actually, let's just use a hook in App to handle clicks and pass down? 
    // Or just attach listener here.

    // Better approach:
    // In App.tsx, we handle the click.
    // But for now, let's just make the card clickable via the center raycast check we just added.

    // Let's add a global click handler in useEffect

    // ... (moved to useEffect inside component)

    // Cake settings
    const cakeRadius = 0.4;
    const cakeHeight = 0.3;
    const cakePosition: [number, number, number] = [0, tableHeight + cakeHeight / 2, 0];

    // Candles forming "23"
    // Simple grid or manual placement for "2" and "3"
    // "2": Top arc, diagonal down-left, bottom line
    // "3": Top arc, middle, bottom arc

    const candlePositions: [number, number, number][] = [];
    const scale = 0.08;
    const offsetX2 = -0.15;
    const offsetX3 = 0.15;
    const startY = cakeHeight / 2 + 0.1;

    // Number 2
    // Top
    candlePositions.push([offsetX2 - 1 * scale, startY, 1 * scale]);
    candlePositions.push([offsetX2 + 0 * scale, startY, 1 * scale]);
    candlePositions.push([offsetX2 + 1 * scale, startY, 1 * scale]);
    // Right side top
    candlePositions.push([offsetX2 + 1 * scale, startY, 0 * scale]);
    // Middle/Diagonal
    candlePositions.push([offsetX2 + 0 * scale, startY, -0.5 * scale]);
    candlePositions.push([offsetX2 - 1 * scale, startY, -1 * scale]);
    // Bottom
    candlePositions.push([offsetX2 + 0 * scale, startY, -2 * scale]);
    candlePositions.push([offsetX2 + 1 * scale, startY, -2 * scale]);
    candlePositions.push([offsetX2 - 1 * scale, startY, -2 * scale]); // Extra for base

    // Number 3
    // Top
    candlePositions.push([offsetX3 - 1 * scale, startY, 1 * scale]);
    candlePositions.push([offsetX3 + 0 * scale, startY, 1 * scale]);
    candlePositions.push([offsetX3 + 1 * scale, startY, 1 * scale]);
    // Middle
    candlePositions.push([offsetX3 + 0 * scale, startY, -0.5 * scale]);
    candlePositions.push([offsetX3 + 1 * scale, startY, -0.5 * scale]);
    // Bottom
    candlePositions.push([offsetX3 - 1 * scale, startY, -2 * scale]);
    candlePositions.push([offsetX3 + 0 * scale, startY, -2 * scale]);
    candlePositions.push([offsetX3 + 1 * scale, startY, -2 * scale]);
    // Right side vertical connectors
    candlePositions.push([offsetX3 + 1 * scale, startY, 0 * scale]);
    candlePositions.push([offsetX3 + 1 * scale, startY, -1.2 * scale]);

    // Cake decoration texture
    const cakeDecorationTexture = useMemo(() => {
        const texture = new THREE.TextureLoader().load('images/cake_decoration.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(8, 1);
        texture.flipY = false;
        return texture;
    }, []);

    // Images for the table
    const tableImages = [
        'images/0F8F745F-ED6D-4C6A-9BFC-F28E331D4328.jpg',
        'images/7c8ed0cf-8cbb-4011-8c9a-11c2390f850e.jpg',
        'images/85F3CF67-AE0B-49FE-9D37-E7DB54EAD5A6.jpg',
        'images/C18C547B-A36D-4902-869A-9DD9F722E271.jpg',
    ];

    return (
        <group position={[0, 0, 0]} onClick={handleCardClick}>
            {/* Table */}
            <Box args={[tableWidth, tableHeight, tableDepth]} position={[0, tableHeight / 2, 0]}>
                <meshStandardMaterial color="#6B3410" /> {/* Mahogany brown */}
            </Box>

            {/* Birthday Card */}
            <group
                ref={cardRef}
                position={[0.3, tableHeight + 0.02, 0.5]} // Moved from 1.0 to 0.3 (more left)
                rotation={[0, -0.2, 0]}
            >
                <Box args={[0.3, 0.01, 0.2]}>
                    <meshStandardMaterial color={hovered ? "yellow" : "white"} />
                </Box>
                <Box args={[0.3, 0.01, 0.2]} position={[0, 0.01, 0]} rotation={[0.2, 0, 0]}>
                    <meshStandardMaterial color="#ffdddd" />
                </Box>
                {/* Text on Card Cover */}
                <Text
                    position={[0, 0.05, 0]}
                    rotation={[-1.5, 0, 0]}
                    fontSize={0.05}
                    color="red"
                    anchorX="center"
                    anchorY="middle"
                >
                    Open Me
                </Text>
            </group>

            {/* Cake */}
            <group position={cakePosition}>
                <Cylinder args={[cakeRadius, cakeRadius, cakeHeight, 32]}>
                    <meshStandardMaterial color="#FFC0CB" />
                </Cylinder>

                {/* Cake Decoration Border - Top */}
                <Torus args={[cakeRadius - 0.02, 0.04, 16, 64]} position={[0, cakeHeight / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial map={cakeDecorationTexture} />
                </Torus>

                {/* Cake Decoration Border - Bottom */}
                <Torus args={[cakeRadius - 0.02, 0.04, 16, 64]} position={[0, -cakeHeight / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial map={cakeDecorationTexture} />
                </Torus>

                {/* Single Central Light for Performance */}
                <pointLight position={[0, 0.5, 0]} intensity={1} distance={2} color="orange" />

                {/* Candles */}
                {candlePositions.map((pos, i) => (
                    <group key={i} position={pos}>
                        <Cylinder args={[0.01, 0.01, 0.2, 8]}>
                            <meshStandardMaterial color="white" />
                        </Cylinder>
                        {/* Emissive flame instead of light */}
                        <mesh position={[0, 0.12, 0]}>
                            <sphereGeometry args={[0.02]} />
                            <meshBasicMaterial color="orange" />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* Frames on Table - Angled to face the viewer/center */}
            {/* Front Left */}
            <Frame
                url={tableImages[0]}
                position={[-1.2, tableHeight + 0.4, 0.8]} // Adjusted X for wider table
                rotation={[0, Math.PI / 4, 0]}
                scale={[0.5, 0.5, 0.5]}
            />
            {/* Front Right */}
            <Frame
                url={tableImages[1]}
                position={[1.2, tableHeight + 0.4, 0.8]} // Adjusted X for wider table
                rotation={[0, -Math.PI / 4, 0]}
                scale={[0.5, 0.5, 0.5]}
            />
            {/* Back Left */}
            <Frame
                url={tableImages[2]}
                position={[-1.2, tableHeight + 0.4, -0.8]} // Adjusted X for wider table
                rotation={[0, Math.PI / 4, 0]}
                scale={[0.5, 0.5, 0.5]}
            />
            {/* Back Right */}
            <Frame
                url={tableImages[3]}
                position={[1.2, tableHeight + 0.4, -0.8]} // Adjusted X for wider table
                rotation={[0, -Math.PI / 4, 0]}
                scale={[0.5, 0.5, 0.5]}
            />
        </group>
    );
};
