import { Controller, Post, Body } from '@nestjs/common';
import { MLService } from './ml.service';

@Controller('ml')
export class MLController {
  constructor(private mlService: MLService) {}

  @Post('predict')
  async predict(@Body() body: { features: number[] }) {
    return this.mlService.predict(body.features);
  }
}
