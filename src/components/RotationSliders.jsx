import React from 'react';
import { CircleSlider } from 'react-circle-slider';
import { Grid, Typography, Box } from '@mui/material';

const RotationSliders = ({ rotation, setRotation, tilt, setTilt }) => {
  const handleRotationChange = (value) => {
    setRotation((value - 180) * (Math.PI / 180));
  };

  const handleTiltChange = (value) => {
    setTilt((value - 180) * (Math.PI / 180));
  };

  // Convert radians to degrees and adjust range from -180 to 180
  const rotationDegrees = Math.round((rotation * (180 / Math.PI)));
  const tiltDegrees = Math.round((tilt * (180 / Math.PI)));

  return (
    <Grid container spacing={3} alignItems='center' justifyContent='center'>
      <Grid item xs={6} container direction='column' alignItems='center'>
        <CircleSlider
          value={Math.round((rotation + Math.PI) * (180 / Math.PI))}
          onChange={handleRotationChange}
          size={120} // Increased slider size
          knobRadius={15}
          circleWidth={12}
          progressWidth={12}
          stepSize={1}
          min={0}
          max={360}
          className='circle-slider'
        />
        <Box mt={1}>
          <Typography variant='body1' align='center'>
            Rotation
          </Typography>
          <Typography variant='body2' align='center'>
            {rotationDegrees}°
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} container direction='column' alignItems='center'>
        <CircleSlider
          value={Math.round((tilt + Math.PI) * (180 / Math.PI))}
          onChange={handleTiltChange}
          size={120} // Increased slider size
          knobRadius={15}
          circleWidth={12}
          progressWidth={12}
          stepSize={1}
          min={0}
          max={360}
          className='circle-slider'
        />
        <Box mt={1}>
          <Typography variant='body1' align='center'>
            Tilt
          </Typography>
          <Typography variant='body2' align='center'>
            {tiltDegrees}°
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RotationSliders;

