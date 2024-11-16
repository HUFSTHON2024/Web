import './App.css';
import { Routes, Route } from 'react-router-dom';
import VideoRecorderUI from './pages/VideoRecorderUI';
import FileUploadPage from './sendResume';
import InterviewRoom from './interviewRoom';

function App() {
  return (
    <Routes>
      <Route path="/video/:id" element={<VideoRecorderUI />} />
      <Route path="/" element={<FileUploadPage />} />
      <Route path="/interview-room" element={<InterviewRoom />} />
    </Routes>
  );
}

export default App;
