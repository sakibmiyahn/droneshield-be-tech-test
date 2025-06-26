import { SxProps, Theme } from '@mui/material';

export const fileUploadContainerStyle: SxProps<Theme> = {
  position: 'relative',
  height: '20vh',
  width: '60vw',
  backgroundColor: '#424242',
  display: 'flex',
  borderRadius: '2px',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
};

export const fileInputStyle: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  opacity: 0,
  borderRadius: '2px',
  color: 'white',
  '& .MuiInput-root ': {
    height: '100%',
  },
  '& .MuiInputBase-input': {
    height: '100%'
  }
};

export const fileNameStyle: SxProps<Theme> = {
  flex: 1,
  padding: '14px'
};

export const removeButtonStyle: SxProps<Theme> = {
  color: 'red',
  fontSize: 14
};
