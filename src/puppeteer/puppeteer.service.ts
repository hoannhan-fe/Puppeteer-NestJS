import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
  private browser: puppeteer.Browser;

  async initBrowser() {
    this.browser = await puppeteer.launch({ headless: true });
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async crawlYouTubeData(videoUrl: string) {
    let page: puppeteer.Page;
    try {
      page = await this.browser.newPage();
      await page.goto(videoUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      let title = 'Không có tiêu đề';
      try {
        title = await page.title();
        console.log('Tiêu đề video:', title);
      } catch (error) {
        console.error('Không lấy được tiêu đề:', error);
      }

      let views = 'Không có số lượt xem';
      try {
        views = await page.$eval('.view-count', (el) => el.textContent.trim());
        console.log('Số lượt xem:', views);
      } catch (error) {
        console.error('Không lấy được số lượt xem:', error);
      }

      let description = 'Không có mô tả';
      try {
        description = await page.$eval('#description', (el) => el.textContent.trim());
        console.log('Mô tả:', description);
      } catch (error) {
        console.error('Không lấy được mô tả:', error);
      }

      let transcript = 'Không có transcript';
      try {
        const transcriptButton = await page.$('button[aria-label="Open transcript"]');
        if (transcriptButton) {
          await transcriptButton.click();
          await page.waitForSelector('.ytd-transcript-renderer');
          const segments = await page.$$eval('.ytd-transcript-segment-renderer', (el) =>
            el.map((segment) => segment.textContent.trim())
          );
          transcript = segments.join('\n');
          console.log('Nội dung transcript:', transcript);
        } else {
          console.log('Không có transcript cho video này.');
        }
      } catch (error) {
        console.error('Không lấy được transcript:', error);
      }

      let comments = [];
      try {
        await page.waitForSelector('#comments', { timeout: 10000 });
        comments = await page.$$eval('#content-text', (el) =>
          el.map((comment) => comment.textContent.trim())
        );
        console.log('Bình luận:', comments.slice(0, 5)); // Lấy 5 bình luận đầu tiên
      } catch (error) {
        console.error('Không lấy được bình luận:', error);
      }

      return {
        title,
        views,
        description,
        transcript,
        comments,
      };
    } catch (error) {
      console.error('Lỗi trong quá trình thu thập dữ liệu:', error);
      throw new Error('Không thể thu thập dữ liệu.');
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
}
