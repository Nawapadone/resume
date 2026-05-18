import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AppService } from './app.service';

const TRANSLATION_KEYS = [
  'nav_about',
  'nav_experience',
  'nav_skills',
  'nav_education',
  'nav_projects',
  'nav_contact',
  'hero_greeting',
  'hero_name',
  'hero_title',
  'hero_subtitle',
  'hero_cta_contact',
  'hero_cta_download',
  'hero_open_to_work',
  'exp_section_title',
  'skills_section_title',
  'edu_section_title',
  'proj_section_title',
  'proj_achievements_title',
  'proj_view_source',
  'contact_section_title',
  'contact_email_label',
  'contact_phone_label',
  'contact_location_label',
  'contact_github_label',
  'contact_linkedin_label',
  'footer_built_with',
  'footer_rights',
  'dark_toggle_label',
  'lang_switch_to',
] as const;

type TranslationKey = (typeof TRANSLATION_KEYS)[number];
type Translations = Record<TranslationKey, string>;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health(): { status: string } {
    return { status: 'ok' };
  }

  @Get()
  index(@Res() res: Response, @I18n() i18n: I18nContext): void {
    const lang = i18n.lang;
    const alternateLang = lang === 'en' ? 'th' : 'en';

    const t = Object.fromEntries(
      TRANSLATION_KEYS.map((key) => [key, String(i18n.t(`translation.${key}`))]),
    ) as Translations;

    const resume = this.appService.getResumeData();
    const baseUrl = resume.resumeUrl;
    const enUrl = baseUrl;
    const thUrl = `${baseUrl}/?lang=th`;
    const canonicalUrl = lang === 'en' ? enUrl : thUrl;
    const ogLocale = lang === 'en' ? 'en_US' : 'th_TH';
    const ogLocaleAlt = lang === 'en' ? 'th_TH' : 'en_US';
    const shortDescription = `${resume.name} — ${resume.title} based in ${resume.location}.`;

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: resume.name,
      jobTitle: resume.title,
      email: `mailto:${resume.email}`,
      telephone: resume.phone,
      url: baseUrl,
      image: `${enUrl}/og-image.png`,
      sameAs: [`https://${resume.github}`, `https://${resume.linkedin}`],
      address: {
        '@type': 'PostalAddress',
        addressLocality: resume.location,
      },
      description: resume.summary,
    });

    res.render('index', {
      t,
      lang,
      alternateLang,
      resume,
      currentYear: new Date().getFullYear(),
      canonicalUrl,
      enUrl,
      thUrl,
      ogLocale,
      ogLocaleAlt,
      shortDescription,
      jsonLd,
    });
  }
}
