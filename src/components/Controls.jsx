import React from 'react';
import { Grid, Button } from '@mui/material';
import Title from './Title';
import RotationSliders from './RotationSliders';
import TranslationControl from './TranslationControl';
import SampleDetectorFields from './SampleDetectorFields';

const Controls = ({
  rotation,
  setRotation,
  tilt,
  setTilt,
  translation,
  setTranslation,
  randomize,
  setRandomize,
}) => {
  const handleSubmit = () => {
    const params = {
      rotation,
      tilt,
      translation,
      randomize,
    };

    // Convert params to JSON
    const json = JSON.stringify(params, null, 2);

    // Create a Blob with the JSON content
    const blob = new Blob([json], { type: 'application/json' });

    // Create a link element and simulate a click to download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parameters.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className='controls'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Title title='Rotation & Tilt' />
          <RotationSliders
            rotation={rotation}
            setRotation={setRotation}
            tilt={tilt}
            setTilt={setTilt}
          />
        </Grid>
        <Grid item xs={12}>
          <Title title='Translation' />
          <TranslationControl
            translation={translation}
            setTranslation={setTranslation}
            randomize={randomize}
            setRandomize={setRandomize}
          />
        </Grid>
        <Grid item xs={12}>
          <SampleDetectorFields />
        </Grid>
        <Grid item xs={12} container justifyContent='center' mt={2}>
          <Button variant='contained' color='primary' onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Controls;

