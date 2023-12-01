import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as util from 'util';
import { MulterFile } from 'multer';

const writeFileAsync = util.promisify(fs.writeFile);

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('cloudinary_cloud_name'),
      api_key: this.configService.get('cloudinary_api_key'),
      api_secret: this.configService.get('cloudinary_api_secret'),
    });
  }

  async upload(file: MulterFile): Promise<string> {
    try {
      const tempFilePath = `./uploads/temp_${Date.now()}_${file.originalname}`;
      await writeFileAsync(tempFilePath, file.buffer);
      const result = await cloudinary.uploader.upload(tempFilePath, {
      });
      fs.unlinkSync(tempFilePath);
      return result.secure_url;
    } catch (error) {
      throw new Error('Ошибка при загрузке файла в Cloudinary!');
    }
  }
}