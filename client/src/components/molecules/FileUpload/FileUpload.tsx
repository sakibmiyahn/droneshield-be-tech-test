import { useRef } from 'react';
import type { ChangeEvent, FC } from 'react';

// MUI
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';

import {
  fileUploadContainerStyle,
  fileInputStyle,
  fileNameStyle,
  removeButtonStyle
} from './FileUpload.styles';

// Atoms
import { TooltipIconBtn } from '../../atoms';


interface FileUploadProps {
  disabled?: boolean;
  acceptType?: string;
  onChange: (_file: File | null) => void;
  onClear?: () => void;
  value?: File | null;
  error?: string;
}

const FileUpload: FC<FileUploadProps> = ({
  disabled = false,
  acceptType,
  onChange,
  onClear,
  value,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputElement = event.target as HTMLInputElement;

    const file = inputElement.files?.[0] || null;
    onChange(file);
  };

  const handleRemoveFile = () => {
    onClear && onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Box
        sx={{
          ...fileUploadContainerStyle,
          ...(error && {
            border: '1px solid',
            borderColor: 'error.main',
            borderRadius: '2px'
          })
        }}
      >
        <TextField
          type='file'
          disabled={disabled}
          inputProps={{ accept: acceptType }}
          inputRef={fileInputRef}
          onChange={(event) => handleFileChange(event)}
          sx={fileInputStyle}
        />
        {value ? (
          <>
            <Typography
              variant='body1'
              color='white'
              fontSize={14}
              sx={fileNameStyle}
              noWrap
            >
              {value.name}
            </Typography>
            <Button
              disabled={disabled}
              variant='text'
              sx={removeButtonStyle}
              startIcon={
                <CloseIcon sx={{ color: 'red' }} fontSize={'small'} />
              }
              onClick={handleRemoveFile}
            >
              REMOVE
            </Button>
          </>
        ) : (
          <TooltipIconBtn
            onClick={handleClick}
            tooltip='Upload file'
            buttonId='upload-button'
            disableMuiBtn={disabled}
          />
        )}
      </Box>
      {error && (
        <FormHelperText
          sx={{ ml: 0, color: 'error.main' }}
        >
          {error}
        </FormHelperText>
      )}
    </>
  );
};

export default FileUpload;
