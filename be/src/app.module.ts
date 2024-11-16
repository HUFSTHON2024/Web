import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MLModule } from './ml/ml.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MLModule,
    VideoModule,
  ],
})
export class AppModule {}
