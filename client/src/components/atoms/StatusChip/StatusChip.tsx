import { FC } from "react";

// MUI
import Chip from "@mui/material/Chip";
import CircleIcon from "@mui/icons-material/Circle";

interface StatusChipProps {
  isOnline: boolean
}

const StatusChip: FC<StatusChipProps> = ({ isOnline }) => (
  <Chip
    icon={<CircleIcon fontSize="small" color={isOnline ? "success" : "error"} />}
    variant="outlined"
    size="small"
    label={isOnline ? "Online" : "Offline"}
    color={isOnline ? "success" : "error"}
  />
);

export default StatusChip