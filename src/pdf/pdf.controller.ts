import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('resume.pdf')
  async downloadPdf(@Query('lang') lang: string, @Res() res: Response): Promise<void> {
    const pdf = await this.pdfService.generateResumePdf(lang || 'en');
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }
}
