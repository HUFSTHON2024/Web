import React from 'react';
import './feedbackPage.css';

const FeedbackPage = () => {
  // 정적 피드백 데이터
  const feedbacks = [
    {
      question: '첫 번째 질문에 대한 답변',
      content:
        '홍길동님의 답변은 상당히 충실하고 논리적입니다. 자신의 기술 및 경험에 관한 통찰력이 뛰어나며, 이를 통해 NetsPresso의 AI 모델 최적화 및 변환 업무에 어떻게 기여할 수 있을지 구체적으로 설명하였습니다. 그러나 답변의 앞부분에서는 자신의 그동안의 경험 및 학습 과정을 통해 빅데이터와 AI에 관심을 가지게 된 배경에 대해 좀 더 구체적으로 서술할 필요가 있습니다. 또한, 경량화 기법의 예시 (Pruning, Quantization, Knowledge Distillation 등)를 제시하면서 각 기법에 대한 간단한 설명을 추가하면, 면접관에게 자신이 이 주제에 대해 깊은 이해를 가지고 있다는 인상을 줄 수 있을 것입니다.',
    },
    {
      question: '두 번째 질문에 대한 답변',
      content:
        '홍길동님은 주어진 문제를 해결하기 위해 어떻게 데이터 분석과 기계 학습 기법을 활용했는지 상세하게 서술했습니다. 이 과정에서 달성한 성과와 이를 통해 얻은 통찰력에 대해 언급하며, 능숙한 프로젝트 관리와 데이터 분석 능력을 보여주었습니다. 그러나 답변이 조금 길어짐에 따라 주요 포인트가 묻히는 경향이 있습니다. 고객 이탈률을 줄이는 데 어떤 데이터 및 모델을 사용했는지, 그리고 그 결과 어떤 영향이 있었는지에 중점을 두어 이야기를 좀 더 간결하게 표현할 필요가 있습니다.',
    },
    {
      question: '세 번째 질문에 대한 답변',
      content:
        "홍길동님은 이벤트 기반 아키텍처 설계 경험을 어떻게 On-device AI 모델 최적화에 활용할 수 있는지 잘 설명하였습니다. 그는 자신의 방법론과 그 방법이 수반할 수 있는 문제를 잘 인식하고 있으며, 그 해결책에 대해 실용적인 아이디어를 제시하였습니다. 그러나 이 답변에서는 'On-device AI 환경에서 데이터 흐름과 연산 속도를 최적화하는 데 중요한 역할을 할 수 있다는' 주장을 뒷받침하기 위해 좀 더 구체적인 예시나 경험을 제시하는 것이 좋을 것입니다. 그리고 어떤 기술을 사용하였을 때 예상치 못한 문제에 부딪혔고, 이것을 어떻게 해결하였는지에 대한 사례를 들면 효과적일 것입니다.",
    },
  ];

  return (
    <div className="feedback-page-container">
      <h1 className="feedback-header">면접 피드백</h1>
      <div className="feedback-list">
        {feedbacks.map((feedback, index) => (
          <div key={index} className="feedback-card">
            <h2 className="feedback-title">
              {index + 1}. {feedback.question}
            </h2>
            <p className="feedback-content">{feedback.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
