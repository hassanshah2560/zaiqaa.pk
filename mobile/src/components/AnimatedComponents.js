import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

// 3D Animated Food Plate Component
export const AnimatedFoodPlate = () => {
  return (
    <Canvas style={styles.canvas}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <FoodPlateModel />
    </Canvas>
  );
};

const FoodPlateModel = () => {
  const groupRef = React.useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Plate */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.1, 64]} />
        <meshStandardMaterial color="#fff" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Food Items */}
      <mesh position={[-0.5, 0.2, -0.5]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#FF6B6B" metalness={0.1} roughness={0.8} />
      </mesh>

      <mesh position={[0.5, 0.15, -0.5]}>
        <boxGeometry args={[0.6, 0.3, 0.6]} />
        <meshStandardMaterial color="#FFD700" metalness={0.2} roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.1, 0.6]}>
        <coneGeometry args={[0.35, 0.5, 32]} />
        <meshStandardMaterial color="#90EE90" metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  );
};

// 3D Animated Delivery Bike Component
export const AnimatedDeliveryBike = () => {
  return (
    <Canvas style={styles.canvas}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <perspectiveCamera position={[0, 1, 4]} fov={50} />
      <DeliveryBikeModel />
    </Canvas>
  );
};

const DeliveryBikeModel = () => {
  const bikeRef = React.useRef();

  useFrame(({ clock }) => {
    if (bikeRef.current) {
      // Rotating animation
      bikeRef.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3;
      bikeRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.5;
    }
  });

  return (
    <group ref={bikeRef}>
      {/* Bike Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.3, 1.5]} />
        <meshStandardMaterial color="#FF6B6B" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Left Wheel */}
      <mesh position={[-0.5, 0.2, -0.5]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Right Wheel */}
      <mesh position={[0.5, 0.2, -0.5]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Delivery Box */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.8]} />
        <meshStandardMaterial color="#FF6B6B" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Handle */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
};

// 3D Animated Restaurant Badge Component
export const AnimatedRestaurantBadge = ({ rating = 4.5 }) => {
  return (
    <Canvas style={styles.badgeCanvas}>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <RestaurantBadgeModel rating={rating} />
    </Canvas>
  );
};

const RestaurantBadgeModel = ({ rating }) => {
  const badgeRef = React.useRef();

  useFrame(({ clock }) => {
    if (badgeRef.current) {
      badgeRef.current.rotation.z = clock.getElapsedTime();
      badgeRef.current.scale.x = 1 + Math.sin(clock.getElapsedTime()) * 0.1;
      badgeRef.current.scale.y = 1 + Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <group ref={badgeRef}>
      {/* Badge Circle */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 64]} />
        <meshStandardMaterial color="#FFD700" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Inner Circle */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.05, 64]} />
        <meshStandardMaterial color="#FF6B6B" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Star - represented as a cone */}
      <mesh position={[0, 0.12, 0]}>
        <coneGeometry args={[0.4, 0.4, 5]} />
        <meshStandardMaterial color="#FFF" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
};

// 3D Animated Loading Spinner
export const AnimatedLoadingSpinner = () => {
  return (
    <Canvas style={styles.spinnerCanvas}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} />
      <LoadingSpinnerModel />
    </Canvas>
  );
};

const LoadingSpinnerModel = () => {
  const spinnerRef = React.useRef();

  useFrame(() => {
    if (spinnerRef.current) {
      spinnerRef.current.rotation.x += 0.02;
      spinnerRef.current.rotation.y += 0.03;
    }
  });

  return (
    <group ref={spinnerRef}>
      {/* Ring 1 */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <meshStandardMaterial color="#FF6B6B" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Ring 2 */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.8, 0.08, 16, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Ring 3 */}
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[0.6, 0.06, 16, 32]} />
        <meshStandardMaterial color="#4CAF50" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Center Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.1} />
      </mesh>
    </group>
  );
};

// 3D Animated Order Status Component
export const AnimatedOrderStatus = ({ status = 'preparing' }) => {
  const getColor = () => {
    const colors = {
      pending: '#FFA500',
      preparing: '#FF6B6B',
      delivering: '#2196F3',
      delivered: '#4CAF50'
    };
    return colors[status] || '#666';
  };

  return (
    <Canvas style={styles.statusCanvas}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
      <OrderStatusModel color={getColor()} />
    </Canvas>
  );
};

const OrderStatusModel = ({ color }) => {
  const statusRef = React.useRef();

  useFrame(({ clock }) => {
    if (statusRef.current) {
      statusRef.current.rotation.z += 0.015;
      statusRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.3;
    }
  });

  return (
    <group ref={statusRef}>
      {/* Outer Ring */}
      <mesh>
        <torusGeometry args={[1, 0.15, 32, 64]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Inner Ball */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} emissive={color} emissiveIntensity={0.2} />
      </mesh>

      {/* Orbiting Particles */}
      <mesh position={[1, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.1} />
      </mesh>
    </group>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  badgeCanvas: {
    width: 100,
    height: 100
  },
  spinnerCanvas: {
    width: 80,
    height: 80
  },
  statusCanvas: {
    width: 120,
    height: 120
  }
});

export default {
  AnimatedFoodPlate,
  AnimatedDeliveryBike,
  AnimatedRestaurantBadge,
  AnimatedLoadingSpinner,
  AnimatedOrderStatus
};
