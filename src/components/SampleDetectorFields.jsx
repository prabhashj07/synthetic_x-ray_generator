import React from 'react';
import { Grid, TextField, Box } from '@mui/material';
import { useState } from 'react';
import Title from './Title'; // Import the Title component

const SampleDetectorFields = () => {
  const [numSamples, setNumSamples] = useState(10);
  const [sourceToDetector, setSourceToDetector] = useState(100);
  const [detectorDiameter, setDetectorDiameter] = useState(50);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label='Number of Samples'
            type='number'
            value={numSamples}
            onChange={(e) => setNumSamples(Number(e.target.value))}
            fullWidth
            size='small'
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label='Source to Detector Distance'
            type='number'
            value={sourceToDetector}
            onChange={(e) => setSourceToDetector(Number(e.target.value))}
            fullWidth
            size='small'
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label='Detector Diameter'
            type='number'
            value={detectorDiameter}
            onChange={(e) => setDetectorDiameter(Number(e.target.value))}
            fullWidth
            size='small'
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SampleDetectorFields;

