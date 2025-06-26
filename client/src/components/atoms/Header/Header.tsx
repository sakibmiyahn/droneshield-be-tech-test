import { FC, ReactNode } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

interface HeaderProps {
  title: string,
  tooltip: string,
  href: string,
  icon: ReactNode
}

const Header: FC<HeaderProps> = ({ title, tooltip, href, icon }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 5
    }}
  >
    <Typography variant="h5" component="h1" color='white'>
      { title }
    </Typography>
    <Tooltip title={tooltip}>
      <IconButton href={href} sx={{ color: '#c77800' }}>
        { icon }
      </IconButton>
    </Tooltip>
  </Box>
);

export default Header