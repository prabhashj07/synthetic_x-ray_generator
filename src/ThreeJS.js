import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as nifti from 'nifti-reader-js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeJS = ({ rotation, tilt, translation, file }) => {
    const mountRef = useRef(null);
    const [niftiHeader, setNiftiHeader] = useState(null);
    const [niftiImage, setNiftiImage] = useState(null);
    const [slice, setSlice] = useState(0);

    const readNIFTI = useCallback((data) => {
        console.log("Attempting to read NIFTI data");
        try {
            if (nifti.isCompressed(data)) {
                console.log("Data is compressed, decompressing...");
                data = nifti.decompress(data);
            }

            if (nifti.isNIFTI(data)) {
                console.log("Valid NIFTI data found");
                const header = nifti.readHeader(data);
                const image = nifti.readImage(header, data);

                console.log("Header:", header);
                console.log("Image data length:", image.length);

                setNiftiHeader(header);
                setNiftiImage(image);

                const slices = header.dims[3];
                setSlice(Math.floor(slices / 2));
            } else {
                console.error("Not a valid NIFTI file");
            }
        } catch (error) {
            console.error("Error reading NIFTI file:", error);
        }
    }, []);

    useEffect(() => {
        if (file) {
            console.log("File received in ThreeJS component:", file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log("File loaded, calling readNIFTI");
                const arrayBuffer = e.target.result;
                readNIFTI(arrayBuffer);
            };
            reader.onerror = (e) => {
                console.error("Error reading file:", e);
            };
            reader.readAsArrayBuffer(file);
        }
    }, [file, readNIFTI]);

    useEffect(() => {
        if (!niftiHeader || !niftiImage || !mountRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Convert NIFTI image to THREE.DataTexture
        const sliceIndex = slice * niftiHeader.dims[1] * niftiHeader.dims[2];
        const sliceData = new Uint8Array(niftiImage.buffer, sliceIndex, niftiHeader.dims[1] * niftiHeader.dims[2]);

        const texture = new THREE.DataTexture(sliceData, niftiHeader.dims[1], niftiHeader.dims[2], THREE.LuminanceFormat);
        texture.needsUpdate = true;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        camera.position.z = 5;

        const controls = new OrbitControls(camera, renderer.domElement);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        const mountNode = mountRef.current;

        return () => {
            if (mountNode) {
                mountNode.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [niftiHeader, niftiImage, slice, rotation, tilt, translation]);

    return (
        <div ref={mountRef} style={{ width: '100%', height: '400px' }}></div>
    );
};

export default ThreeJS;

