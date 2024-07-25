import React from 'react';
import { Slider, TextField } from '@mui/material';

const TranslationControl = ({ translation, setTranslation }) => {

  const handleTranslationChange = (key, value) => {
    // Ensure 'raiseLower' slider value does not exceed the range
    if (value < -100) {
      value = -100;
    }
    if (value > 100) {
      value = 100;
    }
    setTranslation({ ...translation, [key]: value });
  };

  return (
    <>
      {['pushPull', 'raiseLower', 'footHead'].map((key) => (
        <div key={key} className='translation-control'>
          <TextField
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            type='number'
            value={translation[key]}
            onChange={(e) => handleTranslationChange(key, Number(e.target.value))}
            size='small'
            className='translation-textfield'
          />
          <Slider
            value={translation[key]}
            onChange={(e, newValue) => handleTranslationChange(key, newValue)}
            aria-labelledby={`${key}-slider`}
            className='translation-slider'
            min={-100} // Allow negative values
            max={100}
          />
        </div>
      ))}
    </>
  );
};

export default TranslationControl;

