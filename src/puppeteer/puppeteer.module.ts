import { Module } from '@nestjs/common';
import { PuppeteerController } from './puppeteer.controller';

@Module({
  controllers: [PuppeteerController]
})
export class PuppeteerModule {}
