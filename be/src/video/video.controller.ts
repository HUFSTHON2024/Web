import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  HttpStatus,
  NotFoundException,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';

import fetch from 'node-fetch';
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

  @Post('upload')
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

  @Get('interview/:id')
  async streamVideo(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // 동영상 파일 경로 설정 (실제 저장 경로에 맞게 수정 필요)
      const videoPath = path.join(process.cwd(), 'uploads', `interview${id}.mp4`);

      // 파일 존재 여부 확인
      if (!fs.existsSync(videoPath)) {
        throw new NotFoundException('요청한 동영상을 찾을 수 없습니다.');
      }

      // 파일 정보 가져오기
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      // 범위 요청이 있는 경우
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });

        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
      } else {
        // 범위 요청이 없는 경우
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };

        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: '동영상 스트리밍 중 오류가 발생했습니다.',
        });
      }
    }
  }

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