import { FC, useState } from 'react';

// Redux
import { thunks as AppThunk } from '../../thunks/app-state';
import { RootState, useDispatch, useSelector } from '../../store';

// MUI
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

// Components
import { Header } from '../../components/atoms';
import { FileUpload } from '../../components/molecules';

const UploadSoftware: FC = () => {
  const dispatch = useDispatch();
  const { isUploadingSoftware } = useSelector(
    (state: RootState) => state.appState
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setSelectedFile(null);
    } else {
      setError(undefined);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const result = (await dispatch(
        AppThunk.uploadSoftwareFile({ file: selectedFile })
      )) as unknown as { success: boolean; message: string };
      if (result && result.success) {
        setSuccess('Software uploaded successfully!');
        setError(undefined);
      } else {
        setError(result?.message || 'Software upload failed');
        setSuccess(null);
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError(undefined);
    setSuccess(null);
  };

  return (
    <Container maxWidth="md">
      <Header
        title="Upload Software"
        tooltip="Home"
        href="/"
        icon={<HomeIcon />}
      />
      <Box
        sx={{
          display: 'inline-grid',
          justifyContent: 'center',
          mt: 2,
        }}
      >
        <FileUpload
          acceptType="application/pdf"
          value={selectedFile}
          onChange={handleFileChange}
          onClear={handleClear}
          error={error}
          disabled={false}
        />
        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleUpload}
            disabled={isUploadingSoftware}
            sx={{
              color: '#c77800',
              borderColor: '#c77800',
            }}
          >
            Upload Software
          </Button>
        </Box>
        {success && (
          <Box sx={{ mt: 2 }}>
            <span style={{ color: 'green' }}>{success}</span>
          </Box>
        )}
        {error && (
          <Box sx={{ mt: 2 }}>
            <span style={{ color: 'red' }}>Software upload failed!</span>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UploadSoftware;
