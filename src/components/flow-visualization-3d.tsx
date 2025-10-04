'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

interface DataPoint {
  vazao_l_h: number;
  eixo_x: number;
  eixo_y: number;
}

interface FlowVisualization3DProps {
  data: DataPoint[];
}

function FlowBars({ data }: { data: DataPoint[] }) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const bars = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Normalizar vazões para altura das barras (0-5)
    const vazoes = data.map((d) => d.vazao_l_h);
    const minVazao = Math.min(...vazoes);
    const maxVazao = Math.max(...vazoes);
    const range = maxVazao - minVazao || 1;

    // Centralizar os dados
    const xValues = data.map((d) => d.eixo_x);
    const yValues = data.map((d) => d.eixo_y);
    const centerX = (Math.max(...xValues) + Math.min(...xValues)) / 2;
    const centerY = (Math.max(...yValues) + Math.min(...yValues)) / 2;

    return data.map((point, index) => {
      const normalizedHeight = range > 0 
        ? ((point.vazao_l_h - minVazao) / range) * 4 + 0.5
        : 2.5;
      
      // Cor baseada na vazão (vermelho = baixo, amarelo = médio, verde = alto)
      const colorValue = range > 0 ? (point.vazao_l_h - minVazao) / range : 0.5;
      let color: string;
      if (colorValue < 0.5) {
        // Vermelho para amarelo
        const t = colorValue * 2;
        color = `rgb(255, ${Math.floor(t * 255)}, 0)`;
      } else {
        // Amarelo para verde
        const t = (colorValue - 0.5) * 2;
        color = `rgb(${Math.floor(255 - t * 255)}, 255, 0)`;
      }

      return {
        key: index,
        position: [
          (point.eixo_x - centerX) * 0.8,
          normalizedHeight / 2,
          (point.eixo_y - centerY) * 0.8
        ] as [number, number, number],
        height: normalizedHeight,
        color,
        vazao: point.vazao_l_h,
        x: point.eixo_x,
        y: point.eixo_y,
      };
    });
  }, [data]);

  return (
    <>
      {bars.map((bar) => (
        <group key={bar.key} position={bar.position}>
          <mesh
            onPointerOver={() => setHoveredBar(bar.key)}
            onPointerOut={() => setHoveredBar(null)}
            castShadow
            receiveShadow>
            <cylinderGeometry args={[0.2, 0.25, bar.height, 8]} />
            <meshStandardMaterial 
              color={bar.color} 
              emissive={hoveredBar === bar.key ? bar.color : '#000000'}
              emissiveIntensity={hoveredBar === bar.key ? 0.3 : 0}
            />
          </mesh>
          {hoveredBar === bar.key && (
            <Html position={[0, bar.height / 2 + 0.5, 0]} center>
              <div className='bg-black/80 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap'>
                <div className='font-bold'>{bar.vazao.toFixed(1)} L/h</div>
                <div className='text-gray-300'>X: {bar.x}, Y: {bar.y}</div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </>
  );
}

function Terrain({ data }: { data: DataPoint[] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const terrainGeometry = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Criar uma superfície baseada nos pontos de vazão
    const gridSize = Math.ceil(Math.sqrt(data.length));
    const geometry = new THREE.PlaneGeometry(10, 10, gridSize - 1, gridSize - 1);
    
    const vazoes = data.map((d) => d.vazao_l_h);
    const minVazao = Math.min(...vazoes);
    const maxVazao = Math.max(...vazoes);
    const range = maxVazao - minVazao || 1;

    // Modificar a altura dos vértices baseado na vazão
    const positions = geometry.attributes.position;
    for (let i = 0; i < data.length && i < positions.count; i++) {
      const normalizedHeight = ((data[i].vazao_l_h - minVazao) / range) * 2;
      positions.setZ(i, normalizedHeight);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, [data]);

  if (!terrainGeometry) return null;

  return (
    <mesh 
      ref={meshRef} 
      geometry={terrainGeometry} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.1, 0]}
      receiveShadow>
      <meshStandardMaterial 
        color='#4a9eff' 
        wireframe={false}
        opacity={0.3}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Ground() {
  return (
    <>
      {/* Plano do chão */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color='#2d3748' opacity={0.8} transparent />
      </mesh>
      
      {/* Grid */}
      <gridHelper args={[12, 24, '#4a5568', '#2d3748']} position={[0, -0.1, 0]} />
    </>
  );
}

function Legend() {
  return (
    <group position={[6, 2, 0]}>
      <Text position={[0, 1.5, 0]} fontSize={0.4} color='white' anchorX='left'>
        Vazão (L/h)
      </Text>
      
      {/* Legenda de cores */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.1]} />
        <meshStandardMaterial color='#00ff00' />
      </mesh>
      <Text position={[0.5, 0.8, 0]} fontSize={0.25} color='white' anchorX='left'>
        Alta
      </Text>
      
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.1]} />
        <meshStandardMaterial color='#ffff00' />
      </mesh>
      <Text position={[0.5, 0.3, 0]} fontSize={0.25} color='white' anchorX='left'>
        Média
      </Text>
      
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.1]} />
        <meshStandardMaterial color='#ff0000' />
      </mesh>
      <Text position={[0.5, -0.2, 0]} fontSize={0.25} color='white' anchorX='left'>
        Baixa
      </Text>
    </group>
  );
}

export default function FlowVisualization3D({ data }: FlowVisualization3DProps) {
  console.log('FlowVisualization3D - Dados recebidos:', data);
  
  if (!data || data.length === 0) {
    console.log('FlowVisualization3D - Sem dados para visualizar');
    return (
      <div className='w-full h-full flex items-center justify-center bg-secondary/20 rounded-lg'>
        <p className='text-muted-foreground'>Sem dados para visualizar</p>
      </div>
    );
  }
  
  console.log('FlowVisualization3D - Renderizando gráfico 3D com', data.length, 'pontos');

  return (
    <div className='w-full h-full'>
      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(to bottom, #1a202c, #2d3748)',
          display: 'block'
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a202c', 1);
        }}>
        
        {/* Iluminação */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.3} />
        
        {/* Elementos da cena */}
        <Ground />
        <Terrain data={data} />
        <FlowBars data={data} />
        <Legend />
        
        {/* Controles de câmera */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
