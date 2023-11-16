import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {ConfigService} from "@nestjs/config";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const port = configService.get('port')
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
      .setTitle('eCommerce api')
      .setDescription('Api для интернет магазина')
      .setVersion('1.0')
      .addTag('API')
      .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)
  await app.listen(port, () => console.log(`Сервер запустился на порте = ${port}`));
}
bootstrap();
