import { FC } from "react";

// MUI
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const TableLoader: FC = () => (
  <TableRow>
    <TableCell colSpan={3}>
      <Box display="flex" justifyContent="center" alignItems="center" height={150}>
        <CircularProgress />
      </Box>
    </TableCell>
  </TableRow>
);

export default TableLoader;
