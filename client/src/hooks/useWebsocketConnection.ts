import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from '../store';
import { actions as AppAction } from '../slices/app-state';

const useWebSocketConnection = () => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const { page, rowsPerPage } = useSelector(
    (state) => state.appState.pagination
  );

  useEffect(() => {
    const socket = io('http://localhost:8000');
    socketRef.current = socket;

    // Adding logging for connection status for easy validation production code should not have console logs
    socket.on('sensor-status-update', (payload) => {
      console.log('sensor-status-update:', JSON.stringify(payload));
      dispatch(AppAction.updateSensorData(payload));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, page, rowsPerPage]);
};

export default useWebSocketConnection;
