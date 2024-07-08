import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeJS = ({ rotation, tilt, translation }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.y = rotation;
      cube.rotation.x = tilt;

      cube.position.x = translation.pushPull;
      cube.position.y = translation.raiseLower;
      cube.position.z = translation.footHead;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [rotation, tilt, translation]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default ThreeJS;

