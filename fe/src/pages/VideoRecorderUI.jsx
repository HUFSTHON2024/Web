import React from 'react';
import VideoRecorder from '../components/VideoRecorder';
import './VideoRecorderUI.css';

export const VideoRecorderUI = () => {
  return (
    <div className="container">
      <div className="videoBox">
        <h2 className="label">서버 비디오</h2>
        <div className="videoWrapper">
          <video className="video" controls>
            <source src="/test.mp4" type="video/mp4" />
            비디오를 지원하지 않는 브라우저입니다.
          </video>
        </div>
      </div>

      <div className="videoBox">
        <h2 className="label">내 캠</h2>
        <VideoRecorder />
      </div>
    </div>
  );
};

export default VideoRecorderUI;
