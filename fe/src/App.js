import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import VideoRecorderUI from './pages/VideoRecorderUI';

function App() {
  return (
    <Routes>
      <Route path="/video/:id" element={<VideoRecorderUI />} />
    </Routes>
  );
}

export default App;
