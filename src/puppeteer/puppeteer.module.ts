import { Module } from '@nestjs/common';
import { PuppeteerController } from './puppeteer.controller';

@Module({
  controllers: [PuppeteerController],
  providers: [PuppeteerService],
})
export class PuppeteerModule {}
