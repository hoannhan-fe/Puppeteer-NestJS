import { Controller, Get, Query } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';

@Controller('puppeteer')
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @Get('scrape')
  async scrape(@Query('url') url: string) {
    // Khởi tạo trình duyệt và thực hiện thu thập dữ liệu
    await this.puppeteerService.initBrowser();
    const result = await this.puppeteerService.crawlYouTubeData(url);
    await this.puppeteerService.closeBrowser();

    return result || 'Không thể lấy dữ liệu từ trang.';
  }
}
