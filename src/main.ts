import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('Nest project')
    .setDescription('The nest API description')
    .setVersion('1.0')
    .addTag('nest')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/swagger', app, documentFactory);

  app.setGlobalPrefix('api/v1', { exclude: [''] })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true
  }));
  await app.listen(port);
}

bootstrap();
