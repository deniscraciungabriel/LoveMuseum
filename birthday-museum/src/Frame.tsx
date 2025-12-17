import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

interface FrameProps {
    url: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    frameColor?: string;
}

export const Frame = ({ url, position, rotation = [0, 0, 0], scale = [1, 1, 1], frameColor = '#DAA520' }: FrameProps) => {
    const texture = useLoader(TextureLoader, url);

    // Calculate aspect ratio safely
    const image = texture.image;
    const aspectRatio = (image && image.width && image.height) ? image.width / image.height : 1;

    // Base dimensions - keep height fixed at 1, adjust width
    const height = 1;
    const width = height * aspectRatio;

    const thickness = 0.05;
    const borderSize = 0.1;

    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Top Border */}
            <Box args={[width + borderSize * 2, borderSize, thickness]} position={[0, height / 2 + borderSize / 2, 0]}>
                <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.2} />
            </Box>

            {/* Bottom Border */}
            <Box args={[width + borderSize * 2, borderSize, thickness]} position={[0, -height / 2 - borderSize / 2, 0]}>
                <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.2} />
            </Box>

            {/* Left Border */}
            <Box args={[borderSize, height, thickness]} position={[-width / 2 - borderSize / 2, 0, 0]}>
                <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.2} />
            </Box>

            {/* Right Border */}
            <Box args={[borderSize, height, thickness]} position={[width / 2 + borderSize / 2, 0, 0]}>
                <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.2} />
            </Box>

            {/* Backing */}
            <Box args={[width + borderSize * 2, height + borderSize * 2, 0.02]} position={[0, 0, -thickness / 2 - 0.01]}>
                <meshStandardMaterial color="#222" />
            </Box>

            {/* Image */}
            <mesh frustumCulled={false}>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};
