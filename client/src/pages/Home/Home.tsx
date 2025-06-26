import { FC } from 'react';

// MUI
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


// Components
import { SensorList } from '../../components/organisms';
import { Header } from '../../components/atoms';

const Home: FC = () => {
  return (
    <Container maxWidth="md">
      <Header 
        title='DroneShield Sensors'
        tooltip='Upload Software'
        href='/upload' 
        icon={<UploadFileIcon />} 
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 2,
        }}
      >
        <SensorList />
      </Box>
    </Container>
  );
};

export default Home;
