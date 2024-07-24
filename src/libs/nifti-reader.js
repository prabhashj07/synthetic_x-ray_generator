// src/libs/nifti-reader.js

import nifti from 'nifti-reader-js';

const readNiftiFile = async (url) => {
  try {
    const response = await fetch(url);
    let data = await response.arrayBuffer();

    if (nifti.isCompressed(data)) {
      data = nifti.decompress(data);
    }

    if (nifti.isNIFTI(data)) {
      const header = nifti.readHeader(data);
      const image = nifti.readImage(header, data);
      return { header, image };
    } else {
      throw new Error('The data is not a valid NIfTI file');
    }
  } catch (error) {
    console.error('Error loading NIfTI file:', error);
    throw error;
  }
};

export default { readNiftiFile };

