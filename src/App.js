import React, { useState, useEffect } from 'react';
import ThreeJS from './ThreeJS';
import './App.css';
import Controls from './components/Controls';

const App = () => {
    const [rotation, setRotation] = useState(0);
    const [tilt, setTilt] = useState(0);
    const [translation, setTranslation] = useState({
        pushPull: 0,
        raiseLower: 0,
        footHead: 0,
    });
    const [randomize, setRandomize] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (randomize) {
            const randomTranslation = {
                pushPull: Math.random() * 10 - 5,  // Random value between -5 and 5
                raiseLower: Math.random() * 10 - 5, // Random value between -5 and 5
                footHead: Math.random() * 10 - 5,   // Random value between -5 and 5
            };
            setTranslation(randomTranslation);
            console.log("Randomized translation:", randomTranslation);
        }
    }, [randomize]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            console.log("File selected:", selectedFile.name);
            setFile(selectedFile);
        } else {
            console.log("No file selected");
        }
    };

    return (
        <div className='container'>
            <Controls
                rotation={rotation}
                setRotation={setRotation}
                tilt={tilt}
                setTilt={setTilt}
                translation={translation}
                setTranslation={setTranslation}
                randomize={randomize}
                setRandomize={setRandomize}
            />
            <div className='canvas-container'>
                <ThreeJS
                    rotation={rotation}
                    tilt={tilt}
                    translation={translation}
                    file={file}
                />
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept=".nii,.nii.gz" 
                />
            </div>
        </div>
    );
};

export default App;

