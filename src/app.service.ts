import { Injectable } from '@nestjs/common';

export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  tech: string[];
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link?: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ResumeData {
  resumeUrl: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  summary: string;
  experience: WorkExperience[];
  projects: Project[];
  projectAchievements: string[];
  education: Education[];
  skillGroups: SkillGroup[];
}

@Injectable()
export class AppService {
  getResumeData(): ResumeData {
    return {
      resumeUrl: 'https://nawapadone.me',
      name: 'Nawapadone',
      title: 'Senior Software Engineer',
      email: 'nawapadone.c@gmail.com',
      phone: '+66 8 4316 0055',
      location: 'Bangkok, Thailand',
      github: 'github.com/nawapadone',
      linkedin: 'linkedin.com/in/nawapadone',
      summary:
        "Senior Software Engineer with 5+ years building full-stack products in fintech and digital assets. Specialized in SEC-compliant KYC flows, real-time financial data pipelines, and investor-facing platforms. Currently at Merkle Capital — Thailand's first SEC-licensed digital asset fund manager.",
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Merkle Capital (Cryptomind Group)',
          location: 'Bangkok, Thailand',
          period: 'April 2024 – Present',
          bullets: [
            "Owned end-to-end development across 3 products at Thailand's first SEC-licensed digital asset fund manager — merkle.capital (investor-facing platform), Elkrem (internal product), and the shared backend infrastructure including API services, deployment pipelines, and GCP cloud configuration.",
            'Built and maintained merkle.capital, integrating a CMS for investment strategy content so non-technical teams could manage fund performance pages and onboarding flows independently.',
            'Developed investor-facing portfolio tracking, deposit/withdrawal flows, and KYC onboarding, integrating DOPA (Thai national ID verification), liveness detection, UPPass, and e-stamp for SEC-compliant identity verification.',
            'Integrated real-time market data and portfolio valuation APIs to display NAV, asset allocation, and performance metrics across multiple investment strategies.',
            "Built LINE channel integrations (LINE OA, LINE LIFF, Flex Message, Rich Menu) to support investor communications and onboarding flows through Thailand's primary messaging platform.",
            'Integrated SendGrid for transactional email and OTP delivery, supporting secure authentication and investor notification workflows.',
            'Engineered a historical transaction backfill pipeline to reconcile and migrate all existing customer financial records, ensuring investment portfolio data integrity across the platform.',
            'Collaborated with investment, risk, and operations teams to translate fund strategies (Merkle Framework, rebalancing logic) into user-facing dashboards aligned with Thai SEC compliance requirements.',
          ],
          tech: [
            'React',
            'Next.js',
            'TypeScript',
            'NestJS',
            'Node.js',
            'PostgreSQL',
            'Strapi',
            'REST APIs',
          ],
        },
        {
          title: 'Software Engineer',
          company: 'London Stock Exchange Group (LSEG)',
          location: 'Bangkok, Thailand',
          period: 'Jun 2022 – Jan 2024',
          bullets: [
            'Diagnosed and resolved chart and graph rendering bugs in Refinitiv Workspace/Eikon — a real-time financial data platform used by 400,000+ professionals globally — tracing root causes to faulty server-side data queries delivering incorrect market data.',
            'Migrated server-side data query logic from C# to JavaScript to consolidate data retrieval closer to the frontend layer, eliminating indirect data fetching paths that caused rendering inconsistencies across financial dashboards.',
            'Contributed to a Polymer-to-Angular frontend migration of Refinitiv Workspace/Eikon, ensuring data accuracy and graph rendering correctness were preserved throughout the platform transition.',
          ],
          tech: ['Polymer', 'Angular', 'JavaScript', 'C#'],
        },
        {
          title: 'Software Engineer',
          company: 'Gosoft Thailand',
          location: 'Bangkok, Thailand',
          period: 'May 2021 – Jun 2022',
          bullets: [
            "Developed and shipped features for a React-based web admin system used across 7-Eleven Thailand's 13,000+ locations, improving store staff workflows for day-to-day inventory and operations management.",
            'Built and extended a Flutter mobile app for 7-Eleven delivery order management, covering the full order lifecycle from receipt and product arrangement through payment collection and completion.',
          ],
          tech: ['React', 'Flutter'],
        },
        {
          title: 'Full Stack Developer (Internship)',
          company: 'Kept by Krungsri',
          location: 'Bangkok, Thailand',
          period: 'Jan 2021 – Apr 2021',
          bullets: [
            'Conducted a POC to evaluate migrating the Kept app from a Chinese cross-platform framework to Flutter, prototyping a face recognition feature for Thai national ID verification as part of a KYC onboarding flow.',
            'Built a Python Flask API serving face recognition and Thai ID card OCR endpoints as the backend for the identity verification system.',
            "Fine-tuned Facebook's DeepFace face-comparison model to achieve similarity scores above the 0.75 threshold required for reliable identity matching.",
            'Developed frontend for the "Together Savings" feature — a collaborative piggy bank allowing users to invite friends to shared saving goals, with real-time deposit notifications and transparent transaction history for all participants.',
          ],
          tech: ['Flutter', 'Python', 'Flask', 'DeepFace', 'OCR'],
        },
        {
          title: 'Front-End Developer (Internship)',
          company: 'Rabbit Card',
          location: 'Bangkok, Thailand',
          period: 'Jun 2020 – Jul 2020',
          bullets: [
            'Built a real-time operations dashboard using Vue.js and Buefy to display live telemetry from IoT card-reader devices, enabling operations staff to monitor device status and transaction data at a glance.',
            'Integrated Firebase Realtime Database as the data layer, streaming continuous IoT device updates to the UI with sub-second latency without polling.',
          ],
          tech: ['Vue.js', 'Buefy', 'Firebase'],
        },
        {
          title: 'Front-End Developer (Internship)',
          company: 'Sellsuki',
          location: 'Bangkok, Thailand',
          period: 'Jun 2019 – Jul 2019',
          bullets: [
            "Designed and developed SEO-optimized marketing landing pages with SSR using Nuxt.js, improving organic discoverability for Sellsuki's SME merchant clients.",
            'Owned end-to-end UX/UI design in Figma and translated mockups into pixel-perfect frontend implementations.',
            'Integrated Google Analytics (gtag) and Firebase Analytics for campaign tracking, and connected a transactional email delivery system.',
            "Built LINE channel features (LINE Flex Message, LINE LIFF, LINE Messaging API bot) leveraging Sellsuki's LINE Business Partner status to extend merchant reach on Thailand's largest messaging platform.",
          ],
          tech: ['Nuxt.js', 'Material UI', 'Figma', 'Firebase', 'LINE Messaging API'],
        },
      ],
      projects: [
        {
          name: 'nawapadone.me (Web Resume)',
          description:
            'A bilingual (EN/TH) server-side rendered resume website with dark mode, PDF export, and QR code. Built with NestJS and Handlebars, styled with Tailwind CSS, and deployed as a Docker container on Google Cloud Run.',
          tech: ['NestJS', 'Handlebars', 'Tailwind CSS', 'Docker', 'GCP'],
          link: 'nawapadone.me',
        },
        {
          name: 'Phone Price Tracker',
          description:
            'A daily web scraper that tracks used phone listings on a Thai online marketplace, infers sold prices via listing disappearance detection, and visualizes ask vs. sold price trends per model on a Streamlit dashboard. Includes an MCP server for querying data via Claude.',
          tech: ['Python', 'BeautifulSoup', 'SQLAlchemy', 'Streamlit', 'Plotly', 'MCP'],
        },
        {
          name: 'AmCoco LINE Bot',
          description:
            'A production-ready LINE Bot webhook API with structured architecture, Firestore integration, signature validation, rate limiting, and Thai language support. Deployed on GCP via Cloud Build.',
          tech: ['Bun', 'Fastify', 'TypeScript', 'Firestore', 'GCP'],
        },
        {
          name: 'DIZCARD (Phase 2)',
          description:
            'An online card platform for small businesses (e.g. bubble tea stands) on web and mobile.',
          tech: ['React Native', 'Vue.js', 'Parse Server'],
        },
        {
          name: 'BARS (Bar And Bistro Reservation System)',
          description:
            'A reservation management system for small bars that allows staff to view/edit reservation info, and a chatbot that allows customers to make reservations manually.',
          tech: ['Vue.js', 'Parse Server', 'Messenger Platform'],
        },
        {
          name: 'AODAOM (A Coin Counting Smart PiggyBank)',
          description:
            'An IoT smart piggybank that tracks its balance using image processing and machine learning on a mobile app.',
          tech: ['React Native', 'OpenCV', 'Express.js', 'Google Cloud Platform'],
        },
      ],
      projectAchievements: [
        'Hatch 2019 Incubator Program',
        'National Software Contest 2019 — Semi-Finalist',
        'G-CON 2019 Finalist',
      ],
      education: [
        {
          degree: "Bachelor's Degree in Computer Science (SIT)",
          institution: "King Mongkut's University of Technology Thonburi (KMUTT)",
          location: 'Bangkok, Thailand',
          period: '2017 – 2021',
          gpa: '',
        },
        {
          degree: 'High School Diploma (Full Scholarship)',
          institution: 'Princess Chulabhorn Science High School',
          location: 'Thailand',
          period: '2014 – 2017',
          gpa: '',
        },
      ],
      skillGroups: [
        {
          category: 'Languages',
          skills: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL', 'PHP', 'C#', 'Dart'],
        },
        {
          category: 'Backend',
          skills: ['NestJS', 'Node.js', 'Express', 'Fastify', 'Bun', 'FastAPI', 'REST'],
        },
        {
          category: 'Frontend',
          skills: [
            'React',
            'Next.js',
            'Vue.js',
            'Nuxt.js',
            'Angular',
            'Tailwind CSS',
            'HTML5',
            'CSS3',
          ],
        },
        {
          category: 'Mobile',
          skills: ['Flutter', 'React Native', 'Android'],
        },
        {
          category: 'Databases',
          skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase'],
        },
        {
          category: 'Cloud & DevOps',
          skills: ['GCP', 'Docker', 'GitHub Actions'],
        },
        {
          category: 'Integrations',
          skills: ['LINE Messaging API', 'SendGrid', 'Puppeteer'],
        },
        {
          category: 'Testing',
          skills: ['Jest', 'Vitest', 'Playwright'],
        },
      ],
    };
  }
}
