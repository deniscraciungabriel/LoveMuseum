import { TableDisplay } from './TableDisplay';
import { Hallway } from './Hallway';

export const Scene = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 5, 0]} intensity={0.8} />

            {/* Table Area Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#222" />
            </mesh>

            <TableDisplay />
            <Hallway />
        </>
    );
};
