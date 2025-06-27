import axios from 'axios';

export const uploadSoftware = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('files', file);

    const response = await axios.post(
      'http://localhost:8000/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`File upload progress: ${progress}%`);
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};
