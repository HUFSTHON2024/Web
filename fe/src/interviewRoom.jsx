// QuestionList.jsx
import React, { useEffect, useState } from 'react';
import './interviewRoom.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InterviewRoom = ({ username, onRefresh }) => {
  let navigate = useNavigate();
  const completedVideos = useSelector(state => state.videos.files);

  const [questions, setQuestions] = useState([
    { id: 1, content: '첫 번째 면접 질문입니다.', isAnswered: false },
    { id: 2, content: '두 번째 면접 질문입니다.', isAnswered: false },
    { id: 3, content: '세 번째 면접 질문입니다.', isAnswered: false },
  ]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/questions'); // 질문 데이터 요청
        setQuestions(response.data); // 서버에서 받은 데이터를 상태에 저장
      } catch (err) {
        console.error('질문 데이터를 가져오는데 실패했습니다:', err);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    console.log(completedVideos);
    const completedIds = completedVideos.map(video => +video.id);

    // 질문 상태 업데이트
    const updatedQuestions = questions.map(question => ({
      ...question,
      isAnswered: completedIds.includes(question.id), // Redux에 존재하는 id면 true로 설정
    }));

    setQuestions(updatedQuestions); // 상태 업데이트
  }, [completedVideos]); // Redux 상태가 변경될 때마다 실행

  return (
    <div className="question-list-container">
      <div className="question-card">
        <div className="card-header">
          <button
            className="refresh-button"
            onClick={async () => {
              // Redux 상태 전송
              const payload = completedVideos.map(video => ({
                id: video.id,
                blob: video.blob,
              }));
              console.log(payload);
              try {
                await axios.post('http://localhost:5000/feedback', payload, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                console.log('피드백 요청이 성공적으로 전송되었습니다.');
              } catch (err) {
                console.error('피드백 요청 전송 실패:', err);
              }
            }}
          >
            피드백 요청
          </button>
        </div>
        <div className="questions-container">
          {questions.map((question, i) => (
            <div
              key={question.id}
              className="question-item"
              onClick={() => {
                if (!questions[question.id - 1].isAnswered)
                  navigate(`/video/${question.id}`);
              }}
            >
              <span className="question-content">{question.content}</span>
              <input
                type="checkbox"
                checked={question.isAnswered}
                disabled
                className="question-checkbox"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
