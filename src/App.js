import React, { useState } from 'react';
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
        />
      </div>
    </div>
  );
};

export default App;

