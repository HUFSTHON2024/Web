import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addVideo } from '../redux/store';

export function VideoRecorder() {
  const videoRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const dispatch = useDispatch();
  let localRecordedChunks = [];
  const videos = useSelector(state => state.videos.files);
  let { id } = useParams();

  // useEffect(() => {
  //   // 동영상을 가져오는 함수
  //   const fetchVideo = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:4000/videos/${id}`);
  //       setVideoURL(response.data.videoURL); // 서버에서 받은 비디오 URL 저장
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('동영상 로드 실패:', err);
  //       setError('동영상을 로드하는 데 실패했습니다.');
  //       setLoading(false);
  //     }
  //   };
  //
  //   fetchVideo();
  // }, [id]);

  useEffect(() => {
    let stream;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(s => {
        stream = s;
        videoRef.current.srcObject = stream;

        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        setMediaRecorder(recorder);

        recorder.ondataavailable = event => {
          if (event.data && event.data.size > 0) {
            localRecordedChunks.push(event.data); // 로컬 변수에 추가
            console.log(
              'ondataavailable: 새로운 데이터 추가됨',
              event.data.size,
              'bytes',
            );
          } else {
            console.error('ondataavailable: 데이터가 없습니다.');
          }
        };

        recorder.onstop = () => {
          if (localRecordedChunks.length > 0) {
            const blob = new Blob(localRecordedChunks, { type: 'video/webm' });
            dispatch(addVideo({ blob }));
            localRecordedChunks = [];
            //console.log('녹화 중지 및 Redux에 저장 완료:', blob.size, 'bytes');

            // Redux 상태 크기 확인
            // console.log('Redux 상태 배열 크기:', videos.length);
            // console.log('Redux 상태 업데이트 완료:', videos);
          } else {
            console.error('녹화된 데이터가 없습니다.');
          }
        };
      })
      .catch(error => {
        console.error('카메라 접근 실패:', error);
      });

    return () => {
      stream && stream.getTracks().forEach(track => track.stop());
    };
  }, [dispatch, videos]);

  const handleStartRecording = () => {
    if (mediaRecorder) {
      localRecordedChunks = []; // 로컬 변수 초기화
      mediaRecorder.start();
      console.log('녹화 시작');
    } else {
      console.error('mediaRecorder가 초기화되지 않았습니다.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    } else {
      console.error('mediaRecorder가 초기화되지 않았습니다.');
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ width: '500px' }} />
      <div className="button-group">
        <button className="styled-button" onClick={handleStartRecording}>
          녹화 시작
        </button>
        <button className="styled-button" onClick={handleStopRecording}>
          녹화 중지
        </button>
      </div>
    </div>
  );
}

export default VideoRecorder;
