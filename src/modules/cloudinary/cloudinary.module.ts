import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [MulterModule.register({
    dest: './uploads'
  }),],
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
  exports: [CloudinaryService]
})
export class CloudinaryModule {}
