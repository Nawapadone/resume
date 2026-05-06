import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generateResumePdf(lang = 'en'): Promise<Buffer> {
    const port = process.env.PORT ?? 3000;
    const url = `http://localhost:${port}?lang=${lang}`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
      await page.goto(url, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.documentElement.classList.remove('dark'));
      await page.addStyleTag({
        content: `
          html, body {
            min-height: 297mm;
            background-color: #ffffff !important;
          }
        `,
      });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}
