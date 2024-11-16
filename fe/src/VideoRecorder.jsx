import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

export function VideoRecorder() {
  const videoRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    let stream;

    // 카메라 스트림 가져오기
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        stream = s;
        videoRef.current.srcObject = stream;

        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };
      })
      .catch((error) => {
        console.error('카메라 접근 실패:', error);
      });

    return () => {
      stream && stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleStartRecording = () => {
    setRecordedChunks([]);
    mediaRecorder && mediaRecorder.start();
  };

  const handleStopRecording = () => {
    mediaRecorder && mediaRecorder.stop();
  };

  const handleUpload = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    console.log(blob);
    const formData = new FormData();
    formData.append('video', blob, 'recorded_video.webm');

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('업로드 성공:', response.data);
    } catch (error) {
      console.error('업로드 실패:', error);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ width: '500px' }} />
      <div>
        <button onClick={handleStartRecording}>녹화 시작</button>
        <button onClick={handleStopRecording}>녹화 중지</button>
        <button onClick={handleUpload}>서버로 업로드</button>
      </div>
    </div>
  );
}

export default VideoRecorder;
