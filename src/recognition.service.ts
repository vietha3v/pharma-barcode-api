import { Injectable } from '@nestjs/common';
import { recognize } from '@pharma-barcode/recognition';
import type { AiConfig, RecognitionInput, RecognitionResult } from '@pharma-barcode/recognition';

@Injectable()
export class RecognitionService {
  /**
   * Build the AI config from env. The backend used to read these from its
   * Settings table; the standalone service reads them from the environment so
   * it can run independently.
   */
  private aiConfig(): AiConfig {
    return {
      aiEnabled: process.env.AI_ENABLED !== 'false',
      geminiKey: process.env.AI_GEMINI_API_KEY || undefined,
      openaiKey: process.env.AI_OPENAI_API_KEY || undefined,
      openaiBaseUrl: process.env.AI_OPENAI_BASE_URL || undefined,
      openaiModel: process.env.AI_OPENAI_MODEL || 'gpt-4o-mini',
    };
  }

  recognize(input: RecognitionInput): Promise<RecognitionResult> {
    return recognize({ ...input, aiConfig: input.aiConfig ?? this.aiConfig() });
  }
}