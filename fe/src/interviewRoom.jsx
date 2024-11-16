// QuestionList.jsx
import React, { useEffect, useState } from 'react';
import './interviewRoom.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const InterviewRoom = ({ username, onRefresh }) => {
  let navigate = useNavigate();
  const completedVideos = useSelector(state => state.videos.files);
  const [questions, setQuestions] = useState([
    { id: 1, content: '첫 번째 면접 질문입니다.', isAnswered: false },
    { id: 2, content: '두 번째 면접 질문입니다.', isAnswered: false },
    { id: 3, content: '세 번째 면접 질문입니다.', isAnswered: false },
  ]);

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
          <button className="refresh-button" onClick={onRefresh}>
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
