import React from 'react';
import { Slider, TextField, FormControlLabel, Checkbox } from '@mui/material';

const TranslationControl = ({ translation, setTranslation, randomize, setRandomize }) => {
  
  const handleTranslationChange = (key, value) => {
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
            min={key === 'raiseLower' ? 0 : -100}
            max={key === 'raiseLower' ? 100 : 100}
          />
          {key === 'footHead' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={randomize}
                  onChange={(e) => setRandomize(e.target.checked)}
                />
              }
              label='Randomize'
            />
          )}
        </div>
      ))}
    </>
  );
};

export default TranslationControl;

