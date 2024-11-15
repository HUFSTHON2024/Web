// QuestionList.jsx
import React from 'react';
import './interviewRoom.css';

const InterviewRoom = ({ username, onRefresh }) => {
  const questions = [
    { id: 1, content: "첫 번째 면접 질문입니다.", isAnswered: false },
    { id: 2, content: "두 번째 면접 질문입니다.", isAnswered: true },
    { id: 3, content: "세 번째 면접 질문입니다.", isAnswered: false },
  ];

  return (
    <div className="question-list-container">
      <div className="question-card">
        <div className="card-header">
          <button className="refresh-button" onClick={onRefresh}>
            피드백 요청
          </button>
        </div>
        <div className="questions-container">
          {questions.map((question) => (
            <div key={question.id} className="question-item">
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