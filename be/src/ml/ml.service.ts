import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MLService {
  private readonly mlServerUrl = 'http://localhost:5000';

  async predict(features: number[]) {
    try {
      const response = await axios.post(`${this.mlServerUrl}/predict`, {
        features
      });
      return response.data;
    } catch (error) {
      throw new HttpException('ML 서버 에러', 500);
    }
  }
} 