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
  link: string;
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
  name: string;
  nameInitials: string;
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
      name: 'Nawapadone Chanpeng',
      nameInitials: 'NC',
      title: 'Software Engineer',
      email: 'nawapadone.c@gmail.com',
      phone: '+66 8 4316 0055',
      location: 'Bangkok, Thailand',
      github: 'github.com/nawapadone',
      linkedin: 'linkedin.com/in/nawapadone',
      summary:
        'Software Engineer with experience across the full stack — from interactive frontends to backend services and mobile applications. Worked across fintech, e-commerce, and financial markets, with a current focus on web applications at Merkle Capital (Cryptomind Group)',
      experience: [
        {
          title: 'Software Engineer',
          company: 'Merkle Capital (Cryptomind Group)',
          location: 'Bangkok, Thailand',
          period: 'April 2024 – Present',
          bullets: [
            "Built and maintained the company website (merkle.capital) showcasing investment strategies, fund performance, and onboarding flows for Thailand's first SEC-licensed digital asset fund manager.",
            'Developed client-facing features for portfolio tracking, deposit/withdrawal flows, and KYC integration, enabling retail investors to invest in digital assets',
            'Integrated real-time market data and portfolio valuation APIs to display NAV, asset allocation, and performance metrics across multiple investment strategies.',
            'Implemented secure authentication and compliance-driven workflows aligned with Thai SEC regulations for digital asset fund management.',
            'Collaborated with investment, risk, and operations teams to translate fund strategies (Merkle Framework, rebalancing logic) into user-facing dashboards.',
          ],
          tech: ['React', 'Next.js', 'TypeScript', 'Node.js', 'REST APIs'],
        },
        {
          title: 'Software Engineer',
          company: 'London Stock Exchange Group (LSEG)',
          location: 'Bangkok, Thailand',
          period: 'Jun 2022 – Jan 2024',
          bullets: [
            'Designed and developed financial markets and data web applications using Polymer and Angular.',
            'Migrated and improved the backend from C# to JavaScript, retrieving data from databases.',
          ],
          tech: ['Polymer', 'Angular', 'JavaScript', 'C#'],
        },
        {
          title: 'Software Engineer',
          company: 'Gosoft Thailand',
          location: 'Bangkok, Thailand',
          period: 'May 2021 – Jun 2022',
          bullets: [
            'Designed and developed a warehouse management system on the web using React.',
            'Designed and developed a mobile application for receiving product lists, arranging products, and managing delivery using Flutter.',
          ],
          tech: ['React', 'Flutter'],
        },
        {
          title: 'Full Stack Developer (Internship + Probation)',
          company: 'Kept by Krungsri',
          location: 'Bangkok, Thailand',
          period: 'Jan 2021 – Apr 2021',
          bullets: [
            'Designed and developed an Android mobile application.',
            'Built a facial verification system using Python for identity confirmation (Face Recognition).',
          ],
          tech: ['Android', 'Python', 'Face Recognition'],
        },
        {
          title: 'Front-End Developer (Internship)',
          company: 'Rabbit Card',
          location: 'Bangkok, Thailand',
          period: 'Jun 2020 – Jul 2020',
          bullets: [
            'Designed and developed a Real-Time Interface Monitor on a web application using Vue.js and Buefy.',
            'Integrated Firebase for real-time database functionality.',
          ],
          tech: ['Vue.js', 'Buefy', 'Firebase'],
        },
        {
          title: 'Front-End Developer (Internship)',
          company: 'Sellsuki',
          location: 'Bangkok, Thailand',
          period: 'Jun 2019 – Jul 2019',
          bullets: [
            'Designed and developed a landing page with server-side rendering (SSR) support using Nuxt.js and Material UI.',
          ],
          tech: ['Nuxt.js', 'Material UI'],
        },
      ],
      projects: [
        {
          name: 'DIZCARD (Phase 2)',
          description:
            'An online card platform for small businesses (e.g. bubble tea stands) on web and mobile.',
          tech: ['React Native', 'Vue.js', 'Parse Server'],
          link: 'github.com/Nawapadone',
        },
        {
          name: 'BARS (Bar And Bistro Reservation System)',
          description:
            'A reservation management system for small bars that allows staff to view/edit reservation info, and a chatbot that allows customers to make reservations manually.',
          tech: ['Vue.js', 'Parse Server', 'Messenger Platform'],
          link: 'github.com/Nawapadone',
        },
        {
          name: 'AODAOM (A Coin Counting Smart PiggyBank)',
          description:
            'An IoT smart piggybank that tracks its balance using image processing and machine learning on a mobile app.',
          tech: ['React Native', 'OpenCV', 'Express.js', 'Google Cloud Platform'],
          link: 'github.com/Nawapadone',
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
          skills: ['NestJS', 'Node.js', 'Express', 'FastAPI', 'gRPC', 'REST', 'GraphQL'],
        },
        {
          category: 'Frontend',
          skills: [
            'React',
            'Next.js',
            'Vue.js',
            'Nuxt.js',
            'Angular',
            'Polymer',
            'Material UI',
            'Buefy',
            'Tailwind CSS',
            'HTML5',
            'CSS3',
          ],
        },
        {
          category: 'Mobile',
          skills: ['Flutter', 'Android'],
        },
        {
          category: 'Databases',
          skills: [
            'PostgreSQL',
            'MySQL',
            'MongoDB',
            'Redis',
            'Elasticsearch',
            'ClickHouse',
            'Firebase',
          ],
        },
        {
          category: 'Cloud & DevOps',
          skills: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
        },
      ],
    };
  }
}
