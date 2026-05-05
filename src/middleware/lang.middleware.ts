import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const SUPPORTED_LANGS = ['en', 'th'] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

function isLang(v: unknown): v is Lang {
  return SUPPORTED_LANGS.includes(v as Lang);
}

@Injectable()
export class LangMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const lang = req.query['lang'];
    if (typeof lang === 'string' && isLang(lang)) {
      res.cookie('lang', lang, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
      });
    }
    next();
  }
}
