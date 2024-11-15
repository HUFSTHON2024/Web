import { Controller, Post, Body } from '@nestjs/common';
import { MLService } from './ml.service';

@Controller('ml')
export class MLController {
  constructor(private mlService: MLService) {}

  @Post('chat')
  async chat(@Body() body: { message: string }) {
    return this.mlService.chat(body.message);
  }
} 