
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Grid, Text, Float, Edges, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Roof3DProps {
  ancho: number;
  roofType: 'single' | 'double';
  proyeccion: number;
  pendiente: number;
  proyeccion2?: number;
  pendiente2?: number;
}

const DimensionLine: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  label: string;
  offset?: [number, number, number];
  color?: string;
}> = ({ start, end, label, offset = [0, 0, 0], color = "#475569" }) => {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const center = new THREE.Vector3(
    (start[0] + end[0]) / 2 + offset[0],
    (start[1] + end[1]) / 2 + offset[1],
    (start[2] + end[2]) / 2 + offset[2]
  );

  return (
    <group>
      <line>
        <bufferGeometry attach="geometry" setFromPoints={points} />
        <lineBasicMaterial attach="material" color={color} linewidth={2} transparent opacity={0.8} />
      </line>
      {/* End ticks */}
      <mesh position={start}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Text
        position={center.toArray()}
        fontSize={0.9}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#ffffff"
      >
        {label}
      </Text>
    </group>
  );
};

const RoofSlope: React.FC<{
  ancho: number;
  proyeccion: number;
  pendiente: number;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  label: string;
}> = ({ ancho, proyeccion, pendiente, color, position, rotation, label }) => {
  const height = (pendiente / 100) * proyeccion;
  const longitudReal = Math.sqrt(Math.pow(proyeccion, 2) + Math.pow(height, 2));
  const angle = Math.atan(pendiente / 100);

  // Panel lines simulation
  const panelWidth = 1.0; // Standard panel width approx 1m
  const numPanels = Math.ceil(ancho / panelWidth);

  // Traslapos calculation (every 11.8m approx)
  const numTraslapos = longitudReal > 12 ? Math.floor(longitudReal / 11.8) : 0;

  const traslaposLines = useMemo(() => {
    if (numTraslapos <= 0) return null;
    return Array.from({ length: numTraslapos }).map((_, i) => {
      const dist = (i + 1) * (longitudReal / (numTraslapos + 1));
      const tx = dist * Math.cos(angle);
      const ty = dist * Math.sin(angle);
      return (
        <mesh key={`traslapo-${i}`} position={[tx, ty + 0.1, 0]} rotation={[0, 0, angle]}>
          <boxGeometry args={[0.05, 0.02, ancho + 0.05]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      );
    });
  }, [numTraslapos, longitudReal, angle, ancho]);

  const panelLines = useMemo(() => {
    return Array.from({ length: numPanels + 1 }).map((_, i) => {
      const zPos = -ancho / 2 + (i * (ancho / numPanels));
      return (
        <mesh 
          key={i} 
          position={[(proyeccion || 0.1) / 2, height / 2, zPos]} 
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[longitudReal + 0.01, 0.16, 0.02]} />
          <meshStandardMaterial color="#1e293b" opacity={0.3} transparent />
        </mesh>
      );
    });
  }, [numPanels, ancho, proyeccion, height, angle, longitudReal]);

  return (
    <group position={position} rotation={rotation}>
      {/* Main Roof Slab */}
      <mesh position={[(proyeccion || 0.1) / 2, height / 2, 0]} rotation={[0, 0, angle]}>
        <boxGeometry args={[longitudReal || 0.1, 0.15, ancho || 0.1]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
        <Edges color="#1e293b" threshold={15} />
      </mesh>

      {/* Traslapos (Red dashed lines) */}
      {traslaposLines}

      {/* Panel lines */}
      {panelLines}

      {/* Dimension: Longitud Real */}
      <group rotation={[0, 0, angle]} position={[0, 0.5, (ancho || 0.1) / 2 + 0.5]}>
         <DimensionLine 
            start={[0, 0, 0]} 
            end={[longitudReal || 0.1, 0, 0]} 
            label={`${(longitudReal || 0).toFixed(2)}m`}
            offset={[0, 0.6, 0]}
         />
      </group>

      {/* Text Label */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[proyeccion / 2, height + 2.5, 0]}
          fontSize={1.2}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Float>
    </group>
  );
};

const Roof3D: React.FC<Roof3DProps> = ({ 
  ancho, 
  roofType, 
  proyeccion, 
  pendiente, 
  proyeccion2 = 0, 
  pendiente2 = 0 
}) => {
  const totalLength = roofType === 'single' ? proyeccion : proyeccion + proyeccion2;
  const h1 = (pendiente / 100) * proyeccion;
  const h2 = (pendiente2 / 100) * proyeccion2;
  
  // To make them meet at the top (ridge), we align them to the maximum height
  const ridgeHeight = Math.max(h1, h2);
  const offset1 = ridgeHeight - h1;
  const offset2 = ridgeHeight - h2;
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[500px] relative group animate-in fade-in duration-500 print:hidden">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">Ensamble 3D Kingspan</h2>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Modelo Técnico Interactivo</p>
        </div>
      </div>
      
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
           <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
           <span className="text-[10px] font-bold text-slate-600 uppercase">Vertiente A</span>
        </div>
        {roofType === 'double' && (
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
             <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
             <span className="text-[10px] font-bold text-slate-600 uppercase">Vertiente B</span>
          </div>
        )}
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [15, 15, 15], fov: 40 }}>
        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargando 3D...</p>
            </div>
          </Html>
        }>
          <Stage intensity={0.5} environment="city" adjustCamera={1.8}>
            <group position={[-(proyeccion + (roofType === 'double' ? proyeccion2 : 0)) / 2, 0, 0]}>
              {/* Slope 1 */}
              <RoofSlope 
                ancho={ancho || 0.1}
                proyeccion={proyeccion || 0.1}
                pendiente={pendiente}
                color="#3b82f6"
                position={[0, offset1, 0]}
                rotation={[0, 0, 0]}
                label="A"
              />

              {/* Slope 2 (if double) */}
              {roofType === 'double' && (
                <>
                  <RoofSlope 
                    ancho={ancho || 0.1}
                    proyeccion={proyeccion2 || 0.1}
                    pendiente={pendiente2}
                    color="#6366f1"
                    position={[proyeccion + proyeccion2, offset2, 0]}
                    rotation={[0, Math.PI, 0]}
                    label="B"
                  />
                  {/* Ridge Cap (Caballete) */}
                  <mesh position={[proyeccion, ridgeHeight + 0.1, 0]}>
                    <boxGeometry args={[0.4, 0.2, (ancho || 0.1) + 0.1]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                  </mesh>
                </>
              )}

              {/* General Dimensions (Cotas) */}
              {/* Ancho (Z) */}
              <DimensionLine 
                start={[0, -1, -(ancho || 0.1) / 2]} 
                end={[0, -1, (ancho || 0.1) / 2]} 
                label={`Ancho: ${(ancho || 0).toFixed(2)}m`}
                offset={[-1.5, 0, 0]}
              />

              {/* Proyeccion Total (X) */}
              <DimensionLine 
                start={[0, -1, (ancho || 0.1) / 2 + 1.5]} 
                end={[totalLength || 0.1, -1, (ancho || 0.1) / 2 + 1.5]} 
                label={`Largo: ${(totalLength || 0).toFixed(2)}m`}
                offset={[0, -0.8, 0]}
              />

              {/* Altura (Y) */}
              <DimensionLine 
                start={[proyeccion, 0, -(ancho || 0.1) / 2 - 1.5]} 
                end={[proyeccion, ridgeHeight, -(ancho || 0.1) / 2 - 1.5]} 
                label={`H: ${ridgeHeight.toFixed(2)}m`}
                offset={[0.8, 0, 0]}
              />
            </group>
          </Stage>
          <Grid 
            infiniteGrid 
            fadeDistance={40} 
            fadeStrength={4} 
            cellSize={1} 
            sectionSize={5} 
            sectionColor="#94a3b8" 
            cellColor="#e2e8f0"
          />
        </Suspense>
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>

      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex gap-6">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Ancho (Z)</p>
              <p className="text-xs font-bold text-slate-800">{ancho.toFixed(2)}m</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Proyección Total (X)</p>
              <p className="text-xs font-bold text-slate-800">{totalLength.toFixed(2)}m</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 font-medium italic">Use el mouse para rotar y zoom</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Kingspan 3D Engine v3.0</p>
        </div>
      </div>
    </div>
  );
};

export default Roof3D;
