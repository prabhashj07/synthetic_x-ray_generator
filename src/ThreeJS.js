import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

const ThreeJS = ({ rotation, tilt, translation }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    scene.add(new THREE.AxesHelper(5));

    // Lighting setup
    const light = new THREE.SpotLight();
    light.position.set(20, 20, 20);
    scene.add(light);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Environment Texture setup
    const envTexture = new THREE.CubeTextureLoader().load([
      'img/px_50.png',
      'img/nx_50.png',
      'img/py_50.png',
      'img/ny_50.png',
      'img/pz_50.png',
      'img/nz_50.png',
    ]);
    envTexture.mapping = THREE.CubeReflectionMapping;

    // Material setup
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xb2ffc8,
      envMap: envTexture,
      metalness: 0.25,
      roughness: 0.1,
      opacity: 1.0,
      transparent: true,
      transmission: 0.99,
      clearcoat: 1.0,
      clearcoatRoughness: 0.25,
    });

    // Load STL model
    const loader = new STLLoader();
    let mesh;
    loader.load(
      'models/example.stl',
      function (geometry) {
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.log(error);
      }
    );

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Stats setup
    const stats = new Stats();
    mountRef.current.appendChild(stats.dom);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update mesh rotation and position
      if (mesh) {
        mesh.rotation.y = rotation;
        mesh.rotation.x = tilt;
        mesh.position.x = translation.pushPull;
        mesh.position.y = translation.raiseLower;
        mesh.position.z = translation.footHead;
      }

      controls.update();
      renderer.render(scene, camera);
      stats.update();
    };

    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [rotation, tilt, translation]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default ThreeJS;

