import { FC } from 'react';

// MUI
import NoteAdd from '@mui/icons-material/NoteAdd';
import { Box, IconButton, SxProps, Tooltip } from '@mui/material';

interface TooltipIconBtnProps {
  onClick?: (_e?: any) => void;
  tooltip?: string;
  fontSize?: number;
  disableMuiBtn?: boolean;
  disablePadding?: boolean;
  hover?: boolean;
  buttonId?: string;
  sx?: SxProps;
}

const TooltipIconBtn: FC<TooltipIconBtnProps> = ({
  onClick,
  tooltip = '',
  fontSize = 24,
  disableMuiBtn,
  disablePadding = false,
  hover = false,
  buttonId = 'icon-button',
  sx
}: TooltipIconBtnProps) => {
  const renderIcon = () => (
    <NoteAdd style={{ fontSize }} sx={{ cursor: 'pointer', padding: 0 }} />
  );

  return (
    <Tooltip title={tooltip} sx={{ pl: 0.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
        data-testid='tooltip-icon-btn'
      >
        {!disableMuiBtn ? (
          <IconButton
            color='inherit'
            onClick={onClick}
            data-testid={buttonId}
            sx={{
              cursor: 'pointer',
              padding: disablePadding ? 0 : 1,
              ...(hover && {
                '&:hover': {
                  color: 'primary.main'
                }
              }),
              ...(sx && sx)
            }}
          >
            {renderIcon()}
          </IconButton>
        ) : (
          <Box data-testid='disable-icon-button'>{renderIcon()}</Box>
        )}
      </Box>
    </Tooltip>
  );
};

export default TooltipIconBtn;
