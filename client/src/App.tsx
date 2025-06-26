import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home/Home';
import UploadSoftware from './pages/UploadSoftware/UploadSoftware';

// Hooks
import useWebSocketConnection from './hooks/useWebsocketConnection';

// Styles
import './App.css';

const App = () => {
  useWebSocketConnection();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadSoftware />} />
    </Routes>
  );
};

export default App;
