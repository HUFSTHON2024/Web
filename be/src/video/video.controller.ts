import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as fs from 'fs';
import axios from 'axios';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { InfoRequestDto } from './dto/requestDto/info.request.dto';
import path from 'path';
import { diskStorage } from 'multer';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
}

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload/video')
  @UseInterceptors(FileInterceptor('video'))
  uploadVideo(@UploadedFile() file: MulterFile) {
    console.log('파일 업로드 확인:');
    console.log('원본 파일 이름:', file.originalname);
    console.log('MIME 타입:', file.mimetype);
    console.log('파일 크기 (바이트):', file.size);

    return {
      message: '파일 업로드 성공',
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
  // // 이력서:PDF 및 채용공고문:text AI서버로 전송
  // @Post('submit/info')
  // @UseInterceptors(
  //   FileInterceptor('resume', {
  //     dest: './uploads', // 업로드된 파일 저장 경로
  //   }),
  // )
  // async submitResumeInfo(
  //   @UploadedFile() file: MulterFile,
  //   @Body() dto: InfoRequestDto,
  // ) {
  //   console.log('전송된 이력서 파일:', file.originalname);
  //   console.log('전송된 채용 공고 내용:', dto.info);

  //   const filePath = path.resolve('./uploads', file.filename);
  //   try {
  //     // AI 서버로 데이터 전송
  //     const formData = new FormData();
  //     formData.append('file', fs.createReadStream(filePath));
  //     formData.append('info', dto.info);

  //     const aiResponse = await axios.post(
  //       'http://ai-server.com/api/analyze',
  //       formData,
  //       {
  //         headers: formData.getHeaders(),
  //       },
  //     );

  //     // 응답 반환
  //     // 응답은 제목과 비디오로 도착.
  //     return {
  //       message: 'AI 서버로 전송 성공',
  //       data: aiResponse.data,
  //     };
  //   } catch (error) {
  //     console.error('AI 서버 요청 실패:', error);
  //     throw error;
  //   } finally {
  //     // 임시 파일 삭제
  //     fs.unlinkSync(filePath);
  //   }
  // }

  // 면접을 본 뒤, 녹화한 영상을 전달받아 피드백을 반환 영상을 3개를 연달아 받습니다.
  // async getVideoFeedback(@Body() body: { videoUrl: string }) {
  //   const videoUrl = body.videoUrl;
  //   const videoFeedback = await this.videoService.getVideoFeedback(videoUrl);
  //   return videoFeedback;
  // }
  @Post('upload/interview')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // 저장 디렉터리 설정: `uploads/video`
          const uploadPath = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            'video',
          );
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // 파일 이름 생성
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname); // 확장자 추출
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async handleInterviewRequest(
    @UploadedFile() file: Express.Multer.File, // 파일 처리
    @Body('jobDescription') jobDescription: string, // 텍스트 처리
  ) {
    console.log('업로드된 파일:', file.originalname);
    console.log('채용 공고 설명:', jobDescription);

    try {
      // 파일 저장 경로
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        'video',
        file.filename,
      );

      // 여기에서 AI 분석 로직 추가 가능
      return {
        message: '요청 처리 성공',
        file: file.originalname,
        jobDescription,
      };
    } catch (error) {
      console.error('요청 처리 중 오류 발생:', error);
      throw error;
    }
  }
}
