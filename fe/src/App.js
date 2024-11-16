import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';

function App() {
  return (
    <Routes>
      <Route path="" element={<VideoRecorder />} />
    </Routes>
  );
}

export default App;
