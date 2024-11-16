import { IsString } from 'class-validator';

export class InfoRequestDto {
  @IsString()
  info: string;
}
