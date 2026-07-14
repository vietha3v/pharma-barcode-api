import { NestFactory } from '@nestjs/core';
import { RecognitionModule } from './recognition.module';

async function bootstrap() {
  const app = await NestFactory.create(RecognitionModule, { cors: true });
  // No global ValidationPipe: request bodies here are plain interfaces
  // (barcode text / image refs), no class-validator DTOs.
  app.setGlobalPrefix('api');
  const port = Number(process.env.RECOGNITION_PORT || 3003);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[recognition-service] listening on :${port}`);
}
bootstrap();