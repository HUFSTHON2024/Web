import './sendResume.css';
import { Dropzone, FileMosaic } from '@files-ui/react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BasicDemoDropzone() {
  const [files, setFiles] = React.useState([]);
  const [jobText, setJobText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const updateFiles = incomingFiles => {
    console.log('Incoming files:', incomingFiles); // 파일 로깅
    setFiles(incomingFiles);
  };

  const removeFile = id => {
    setFiles(files.filter(file => file.id !== id));
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

      // 파일 객체 확인
      const file = files[0].file; // @files-ui/react의 Dropzone은 {id, file} 형태로 반환
      if (!file) {
        throw new Error('Invalid file object');
      }

      console.log('File to upload:', file); // 파일 객체 로깅

      const formData = new FormData();

      // 파일 추가 - 파일 객체 직접 사용
      formData.append('resume', file);
      formData.append('jobDescription', jobText);

      // FormData 내용 확인
      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      const response = await fetch(
        'http://localhost:4000/video/upload/interview',
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);

      // navigate('/interview');
    } catch (error) {
      console.error('Upload error:', error);
      alert(`업로드 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="upload-section">
          <div className="section-title">
            <h2>이력서 업로드</h2>
            <p className="subtitle">당신의 이력서를 업로드 하세요.</p>
          </div>
          <div className="dropzone-wrapper">
            <Dropzone
              onChange={updateFiles}
              value={files}
              accept=".pdf"
              maxFileSize={10000000} // 10MB
              maxFiles={1}
              style={{
                minHeight: '100px',
                border: '1px dashed #ccc',
                borderRadius: '4px',
              }}
            >
              {files.map(file => (
                <FileMosaic
                  key={file.id}
                  {...file}
                  onDelete={removeFile}
                  info
                />
              ))}
            </Dropzone>
            <div className="file-types">Allowed types: pdf</div>
          </div>
        </div>

        <div className="job-section">
          <h2 className="section-title">채용 공고 업로드</h2>
          <div className="job-content">
            <textarea
              value={jobText}
              onChange={e => setJobText(e.target.value)}
              placeholder="채용 공고 내용을 입력하세요"
              className="job-input"
            />
          </div>
        </div>

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
