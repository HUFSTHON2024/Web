import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MLService {
  private readonly mlServerUrl = 'http://localhost:5000';

  async chat(message: string) {
    try {
      const response = await axios.post(`${this.mlServerUrl}/chat`, {
        message
      });
      return response.data;
    } catch (error) {
      throw new HttpException('ML 서버 에러', 500);
    }
  }
} 