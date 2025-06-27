import { FC, ChangeEvent, useEffect } from 'react';

// Redux
import { actions as AppAction } from '../../../slices/app-state';
import { thunks as AppThunk } from '../../../thunks/app-state';
import { RootState, useDispatch, useSelector } from '../../../store';

// MUI
import { SxProps, Theme } from '@mui/material';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';

// Molecules & Atoms
import { SensorRow } from '../../molecules';
import { TableLoader } from '../../atoms';

// Styles
const columnHeaderCellStyle: SxProps<Theme> = {
  color: 'white',
  fontSize: '16px',
  border: 0,
};

const SensorList: FC = () => {
  const dispatch = useDispatch();
  const { sensorsData, isFetchingSensors, pagination } = useSelector(
    (state: RootState) => state.appState
  );
  const { page, rowsPerPage, total } = pagination;

  useEffect(() => {
    dispatch(AppThunk.loadPaginatedSensors({ page, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handlePageChange = (_: unknown, newPage: number) => {
    dispatch(AppAction.setPagination({ page: newPage, rowsPerPage }));
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(AppAction.setPagination({ page: 0, rowsPerPage: newLimit }));
  };

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#424242' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ height: '50px' }}>
            <TableCell sx={{ ...columnHeaderCellStyle, width: '50%' }}>
              Serial
            </TableCell>
            <TableCell
              sx={{
                ...columnHeaderCellStyle,
                width: '25%',
                textAlign: 'center',
              }}
            >
              Version
            </TableCell>
            <TableCell
              sx={{
                ...columnHeaderCellStyle,
                width: '25%',
                textAlign: 'center',
              }}
            >
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isFetchingSensors ? (
            <TableLoader />
          ) : (
            sensorsData.map((sensor) => (
              <SensorRow key={sensor.id} sensor={sensor} />
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: '#bfbfbf',
          '& .MuiSelect-select': {
            backgroundColor: '#212121',
            color: '#bfbfbf',
          },
        }}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                backgroundColor: '#212121',
                color: '#bfbfbf',
                '& .MuiMenuItem-root': {
                  color: '#bfbfbf',
                  '&.Mui-selected': {
                    backgroundColor: '#424242',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#616161',
                  },
                },
              },
            },
          },
        }}
      />
    </TableContainer>
  );
};

export default SensorList;
