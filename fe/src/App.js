import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import VideoRecorderUI from './pages/VideoRecorderUI';
import VideoRecorder from './VideoRecorder';
import FileUploadPage from './sendResume';

function App() {
  return (
    <Routes>
      <Route path="/video/:id" element={<VideoRecorderUI />} />
      <Route path="/send-response" element={<VideoRecorder />} />
      <Route path="/send-resume" element={<FileUploadPage />} />
    </Routes>
  );
}

export default App;
