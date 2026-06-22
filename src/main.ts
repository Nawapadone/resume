import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { engine } from 'express-handlebars';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '../..', 'public'));

  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      layoutsDir: join(__dirname, '../..', 'views', 'layouts'),
      partialsDir: join(__dirname, '../..', 'views', 'partials'),
      defaultLayout: 'main',
      helpers: {
        eq: (a: unknown, b: unknown) => a === b,
        join: (arr: unknown, separator: string) => Array.isArray(arr) ? arr.join(separator) : '',
      },
    }),
  );

  app.setBaseViewsDir(join(__dirname, '../..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Resume site running on http://localhost:${process.env.PORT ?? 3000}`);
}

void bootstrap();
