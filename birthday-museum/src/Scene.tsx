// This file is no longer used - SceneWrapper in App.tsx is used instead
// Keeping for reference only

import { TableDisplay } from './TableDisplay';
import { Hallway } from './Hallway';

interface SceneProps {
    setReading: (reading: boolean) => void;
}

export const Scene = ({ setReading }: SceneProps) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 5, 0]} intensity={0.8} />

            {/* Table Area Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#222" />
            </mesh>

            <TableDisplay setReading={setReading} />
            <Hallway />
        </>
    );
};
