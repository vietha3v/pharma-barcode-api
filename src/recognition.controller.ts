import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { RecognitionService } from './recognition.service';
import type { RecognitionInput } from '@pharma-erp/recognition';

const API_KEY = process.env.RECOGNITION_API_KEY;

function checkKey(headerVal: string | undefined) {
  if (!API_KEY) return; // auth disabled when key not configured
  if (headerVal !== API_KEY) throw new UnauthorizedException('Invalid recognition key');
}

@Controller()
export class RecognitionController {
  constructor(private readonly service: RecognitionService) {}

  @Get('health')
  health() {
    return { status: 'ok', ts: Date.now() };
  }

  /** JSON body: { barcodeText?, imageUrl?, imageBase64?, imageMimeType?, hint? } */
  @Post('recognize')
  async recognizeJson(@Body() body: RecognitionInput, @Headers('x-recognition-key') key?: string) {
    checkKey(key);
    if (!body.barcodeText && !body.imageUrl && !body.imageBase64) {
      throw new BadRequestException('Provide barcodeText, imageUrl or imageBase64');
    }
    return this.service.recognize(body);
  }

  /** Multipart: image file + optional fields (hint, barcodeText). */
  @Post('recognize/upload')
  @UseInterceptors(FileInterceptor('image'))
  async recognizeUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { hint?: RecognitionInput['hint']; barcodeText?: string },
    @Headers('x-recognition-key') key?: string,
  ) {
    checkKey(key);
    if (!file) throw new BadRequestException('image file is required');
    const imageBase64 = Buffer.from(file.buffer).toString('base64');
    return this.service.recognize({
      barcodeText: body.barcodeText,
      imageBase64,
      imageMimeType: file.mimetype,
      hint: body.hint,
    });
  }
}