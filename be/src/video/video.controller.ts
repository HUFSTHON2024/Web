import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import fetch from 'node-fetch';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as FormData from 'form-data';
import * as multer from 'multer';

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
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        console.log(`Received file: ${JSON.stringify(file)}`);

        if (!file.mimetype.includes('pdf')) {
          return cb(
            new BadRequestException('Only PDF files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async handleInterviewRequest(
    @UploadedFile() file: Express.Multer.File,
    @Body('jobDescription') jobDescription: string,
  ) {
    console.log(`File: ${JSON.stringify(file)}`);
    console.log(`Job Description: ${jobDescription}`);

    // 파일 유효성 검사
    if (!file) {
      throw new BadRequestException('Resume file is required');
    }

    try {
      // FormData 생성
      const formData = new FormData();

      // 파일 추가 시 상세 정보 포함
      formData.append('resume', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      const response = await fetch('http://localhost:5000/api/interview', {
        method: 'GET',
        body: formData,
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (!response.ok) {
        throw new BadRequestException(
          `AI server error: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Interview request processed successfully',
        data,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to process interview request');
    }
  }
}
