// src/sendResume.jsx
import "./sendResume.css";
import { Dropzone, FileMosaic } from '@files-ui/react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BasicDemoDropzone() {
  const [files, setFiles] = React.useState([]);
  const [jobText, setJobText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  
  const updateFiles = incommingFiles => {
    console.log('incomming files', incommingFiles);
    setFiles(incommingFiles);
  };
  
  const removeFile = id => {
    setFiles(files.filter(x => x.id !== id));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('이력서 파일을 업로드해주세요.');
      return;
    }

    if (!jobText.trim()) {
      alert('채용 공고 내용을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // 파일 추가
      formData.append('resume', files[0].file); // 첫 번째 파일만 사용

      // 텍스트 추가
      formData.append('jobDescription', jobText);

      const response = await fetch('/video/submit/info', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      
      // 성공 시 다음 페이지로 이동
      navigate('/interview');
    } catch (error) {
      console.error('Upload error:', error);
      alert('업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        {/* 이력서 업로드 섹션 */}
        <div className="upload-section">
          <div className="section-title">
            <h2>이력서 업로드</h2>
            <p className="subtitle">당신의 이력서를 업로드 하세요.</p>
          </div>
          <div className="dropzone-wrapper">
            <Dropzone
              onChange={updateFiles}
              value={files}
              label="Drop your files here"
              accept=".pdf"
              maxFileSize={100000000000000}
              header={false}
              maxFiles={1}
              style={{
                minHeight: '100px',
                border: '1px dashed #ccc',
                borderRadius: '4px'
              }}
            >
              {files.map(file => (
                <FileMosaic key={file.id} {...file} onDelete={removeFile} info />
              ))}
            </Dropzone>
            <div className="file-types">
              Allowed types: pdf
            </div>
          </div>
        </div>

        {/* 채용 공고 업로드 섹션 */}
        <div className="job-section">
          <h2 className="section-title">채용 공고 업로드</h2>
          <div className="job-content">
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="채용 공고 내용을 입력하세요"
              className="job-input"
            />
          </div>
        </div>

        {/* 업로드 버튼 */}
        <div className="button-wrapper">
          <button 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '업로드 중...' : '면접장 입장'}
          </button>
        </div>
      </div>
    </div>
  );
}