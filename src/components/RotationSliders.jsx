import React from 'react';
import { CircleSlider } from 'react-circle-slider';
import { Grid, Typography } from '@mui/material';

const RotationSliders = ({ rotation, setRotation, tilt, setTilt }) => {
  const handleRotationChange = (value) => {
    setRotation((value - 180) * (Math.PI / 180));
  };

  const handleTiltChange = (value) => {
    setTilt((value - 180) * (Math.PI / 180));
  };

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item xs={6}>
        <CircleSlider
          value={Math.round((rotation + Math.PI) * (180 / Math.PI))}
          onChange={handleRotationChange}
          size={80}
          knobRadius={10}
          circleWidth={8}
          progressWidth={8}
          stepSize={1}
          min={0}
          max={360}
          className='circle-slider'
        />
		<Typography variant='body1' align='center'>
			Rotation
		</Typography>
      </Grid>
      <Grid item xs={6}>
        <CircleSlider
          value={Math.round((tilt + Math.PI) * (180 / Math.PI))}
          onChange={handleTiltChange}
          size={80}
          knobRadius={10}
          circleWidth={8}
          progressWidth={8}
          stepSize={1}
          min={0}
          max={360}
          className='circle-slider'
        />
		<Typography variant='body1' align='center'>
			Tilt                                                                           
		</Typography>  
      </Grid>
    </Grid>
  );
};

export default RotationSliders;
