import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import niftiReader from './libs/nifti-reader.js'; // Updated import path

const ThreeJS = ({ rotation, tilt, translation }) => {
  const mountRef = useRef(null);
  const [niftiHeader, setNiftiHeader] = useState(null);
  const [niftiImage, setNiftiImage] = useState(null);
  const [slice, setSlice] = useState(0);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const loadNiftiFile = async (url) => {
      try {
        const { header, image } = await niftiReader.readNiftiFile(url);
        setNiftiHeader(header);
        setNiftiImage(image);

        const slices = header.dims[3];
        setSlice(Math.round(slices / 2));
      } catch (error) {
        console.error('Error loading NIfTI file:', error);
      }
    };

    loadNiftiFile('./CT_Abdo.nii.gz'); // Ensure the path is correct

    const animate = () => {
      requestAnimationFrame(animate);

      scene.children.forEach((mesh) => {
        mesh.rotation.y = rotation;
        mesh.rotation.x = tilt;
      });

      renderer.render(scene, camera);
    };

    animate();

    const mountElement = mountRef.current;

    return () => {
      if (mountElement) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, [rotation, tilt, translation]);

  useEffect(() => {
    if (niftiHeader && niftiImage) {
      const cols = niftiHeader.dims[1];
      const rows = niftiHeader.dims[2];
      const depth = niftiHeader.dims[3];

      const textureData = new Uint8Array(cols * rows);
      const sliceSize = cols * rows;
      const sliceOffset = sliceSize * slice;

      for (let i = 0; i < sliceSize; i++) {
        textureData[i] = niftiImage[sliceOffset + i];
      }

      const texture = new THREE.DataTexture(textureData, cols, rows, THREE.LuminanceFormat);
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const geometry = new THREE.PlaneGeometry(20, 20, 1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = 0;

      const scene = new THREE.Scene();
      scene.add(mesh);

      const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
      camera.position.z = 50;

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.appendChild(renderer.domElement);

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
    }
  }, [niftiHeader, niftiImage, slice]);

  const handleSliderChange = (event) => {
    setSlice(event.target.value);
  };

  return (
    <div>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>
      <input
        type="range"
        min="0"
        max={niftiHeader ? niftiHeader.dims[3] - 1 : 0}
        value={slice}
        onChange={handleSliderChange}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default ThreeJS;

