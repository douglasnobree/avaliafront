'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useMemo } from 'react';

interface DataPoint {
  vazao_l_h: number;
  eixo_x: number;
  eixo_y: number;
}

interface FlowVisualization3DProps {
  data: DataPoint[];
}

function FlowBars({ data }: { data: DataPoint[] }) {
  const bars = useMemo(() => {
    // Normalizar vazões para altura das barras (0-5)
    const vazoes = data.map((d) => d.vazao_l_h);
    const minVazao = Math.min(...vazoes);
    const maxVazao = Math.max(...vazoes);
    const range = maxVazao - minVazao;

    return data.map((point, index) => {
      const normalizedHeight = ((point.vazao_l_h - minVazao) / range) * 5 + 0.5;
      
      // Cor baseada na vazão (vermelho = baixo, verde = alto)
      const colorValue = (point.vazao_l_h - minVazao) / range;
      const color = `rgb(${255 - colorValue * 255}, ${colorValue * 200 + 55}, ${
        50
      })`;

      return {
        key: index,
        position: [point.eixo_x - 4, normalizedHeight / 2, point.eixo_y - 4] as [
          number,
          number,
          number
        ],
        height: normalizedHeight,
        color,
        vazao: point.vazao_l_h,
      };
    });
  }, [data]);

  return (
    <>
      {bars.map((bar) => (
        <group key={bar.key} position={bar.position}>
          <mesh>
            <boxGeometry args={[0.3, bar.height, 0.3]} />
            <meshStandardMaterial color={bar.color} />
          </mesh>
          <Text
            position={[0, bar.height / 2 + 0.5, 0]}
            fontSize={0.3}
            color='black'
            anchorX='center'
            anchorY='middle'>
            {bar.vazao.toFixed(1)}
          </Text>
        </group>
      ))}
    </>
  );
}

function Grid() {
  return (
    <gridHelper args={[10, 10, '#888888', '#444444']} position={[0, 0, 0]} />
  );
}

export default function FlowVisualization3D({ data }: FlowVisualization3DProps) {
  return (
    <Canvas
      camera={{ position: [10, 8, 10], fov: 50 }}
      style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Grid />
      <FlowBars data={data} />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
      />
      
      {/* Eixos de referência */}
      <Text
        position={[6, 0, 0]}
        fontSize={0.5}
        color='red'
        anchorX='center'>
        X
      </Text>
      <Text
        position={[0, 6, 0]}
        fontSize={0.5}
        color='green'
        anchorX='center'>
        Y (Vazão)
      </Text>
      <Text
        position={[0, 0, 6]}
        fontSize={0.5}
        color='blue'
        anchorX='center'>
        Z
      </Text>
    </Canvas>
  );
}
