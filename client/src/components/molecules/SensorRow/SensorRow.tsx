import { FC } from "react";

// MUI
import { SxProps, Theme } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

// Atoms
import { StatusChip } from "../../atoms";

// Types
import { ISensor } from "../../../types/sensor";

// Styles
const cellStyle: SxProps<Theme> = {
  color: 'white',
  fontSize: '14px',
  border: 0
};

const SensorRow: FC<{ sensor: ISensor }> = ({ sensor }) => (
  <TableRow key={sensor.id}>
    <TableCell sx={{ ...cellStyle }}>{sensor.serial}</TableCell>
    <TableCell sx={{ ...cellStyle, textAlign: 'center' }}>{sensor.version}</TableCell>
    <TableCell sx={{ ...cellStyle, textAlign: 'center' }}>
      <StatusChip isOnline={sensor.isOnline} />
    </TableCell>
  </TableRow>
);

export default SensorRow