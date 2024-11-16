import React, { useEffect, useState } from 'react';
import VideoRecorder from '../components/VideoRecorder';
import './VideoRecorderUI.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const VideoRecorderUI = () => {
  let { id } = useParams();
  const [videoURL, setVideoURL] = useState(''); // 서버에서 받은 비디오 URL
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    // 동영상을 가져오는 함수
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/video/interview/${id}`,
          {
            responseType: 'blob',
          },
        );
        const videoBlob = response.data;
        const videoObjectURL = URL.createObjectURL(videoBlob);
        setVideoURL(videoObjectURL);
        setLoading(false);
      } catch (err) {
        console.error('동영상 로드 실패:', err);
        setError('동영상을 로드하는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchVideo();

    // 컴포넌트 언마운트 시 Blob URL 해제
    return () => {
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [id, videoURL]);

  return (
    <div className="container">
      <div className="videoBox">
        <div className="videoWrapper">
          <video className="video" controls>
            {loading ? (
              <p>동영상을 로드 중입니다...</p>
            ) : (
              <source src={videoURL} type="video/mp4" />
            )}
            비디오를 지원하지 않는 브라우저입니다.
          </video>
        </div>
      </div>

      <div className="videoBox">
        <VideoRecorder id={id} />
      </div>
    </div>
  );
};

export default VideoRecorderUI;
