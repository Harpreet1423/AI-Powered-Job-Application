import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.resumeAnalysis.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 12);

  // Create users
  const seeker = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'seeker@example.com',
      password,
      role: 'seeker',
      bio: 'Full-stack developer with 3 years of experience. Passionate about building great products.',
      location: 'San Francisco, CA',
    },
  });

  const recruiter = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'recruiter@example.com',
      password,
      role: 'recruiter',
      bio: 'Senior Technical Recruiter at TechCorp. Helping companies build amazing teams.',
      location: 'New York, NY',
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password,
      role: 'admin',
      bio: 'Platform administrator',
      location: 'Remote',
    },
  });

  console.log('Users created');

  // Create jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'remote',
        type: 'full-time',
        salaryMin: 120000,
        salaryMax: 160000,
        description: `We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building and maintaining our web applications using React, TypeScript, and modern frontend technologies.\n\n**Responsibilities:**\n- Lead frontend architecture decisions\n- Build reusable component libraries\n- Mentor junior developers\n- Collaborate with design and backend teams\n\n**Requirements:**\n- 5+ years of frontend experience\n- Strong React and TypeScript skills\n- Experience with state management (Redux, Zustand)\n- Understanding of web accessibility standards`,
        skills: 'React,TypeScript,Next.js,TailwindCSS,GraphQL',
        deadline: new Date('2026-05-30'),
        recruiterId: recruiter.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Backend Engineer',
        company: 'DataFlow Inc',
        location: 'hybrid',
        type: 'full-time',
        salaryMin: 130000,
        salaryMax: 175000,
        description: `Join DataFlow as a Backend Engineer to build scalable data processing pipelines and APIs.\n\n**Responsibilities:**\n- Design and implement RESTful APIs\n- Build data processing pipelines\n- Optimize database performance\n- Write comprehensive tests\n\n**Requirements:**\n- 4+ years backend development experience\n- Proficiency in Node.js or Python\n- Experience with PostgreSQL and Redis\n- Knowledge of cloud services (AWS/GCP)`,
        skills: 'Node.js,Python,PostgreSQL,Redis,AWS',
        deadline: new Date('2026-05-15'),
        recruiterId: recruiter.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'onsite',
        type: 'full-time',
        salaryMin: 100000,
        salaryMax: 140000,
        description: `Early-stage startup looking for a versatile Full Stack Developer to help build our product from the ground up.\n\n**What you'll do:**\n- Build features end-to-end\n- Make technology choices that scale\n- Work directly with founders\n- Ship fast and iterate\n\n**What we're looking for:**\n- 3+ years full stack experience\n- React + Node.js proficiency\n- Database design skills\n- Startup mindset - move fast, own your work`,
        skills: 'React,Node.js,MongoDB,Docker,Git',
        deadline: new Date('2026-06-01'),
        recruiterId: recruiter.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'DevOps Engineer',
        company: 'CloudScale',
        location: 'remote',
        type: 'full-time',
        salaryMin: 140000,
        salaryMax: 190000,
        description: `We need a DevOps Engineer to help us scale our infrastructure and improve our deployment pipeline.\n\n**Responsibilities:**\n- Manage Kubernetes clusters\n- Build CI/CD pipelines\n- Monitor and optimize infrastructure\n- Implement security best practices\n\n**Requirements:**\n- 5+ years DevOps experience\n- Strong Kubernetes and Docker skills\n- Experience with Terraform\n- AWS or GCP certification preferred`,
        skills: 'Kubernetes,Docker,Terraform,AWS,CI/CD',
        deadline: new Date('2026-05-20'),
        recruiterId: recruiter.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'UI/UX Designer',
        company: 'DesignHub',
        location: 'remote',
        type: 'full-time',
        salaryMin: 95000,
        salaryMax: 130000,
        description: `DesignHub is looking for a talented UI/UX Designer to create beautiful, intuitive interfaces for our SaaS platform.\n\n**Responsibilities:**\n- Create wireframes, prototypes, and high-fidelity designs\n- Conduct user research and usability testing\n- Build and maintain design systems\n- Collaborate with engineering team\n\n**Requirements:**\n- 3+ years UI/UX design experience\n- Proficiency in Figma\n- Understanding of design systems\n- Portfolio demonstrating SaaS product design`,
        skills: 'Figma,UI Design,UX Research,Prototyping,Design Systems',
        deadline: new Date('2026-06-15'),
        recruiterId: recruiter.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Data Scientist',
        company: 'AnalyticsPro',
        location: 'hybrid',
        type: 'full-time',
        salaryMin: 125000,
        salaryMax: 165000,
        description: `Join our data science team to build ML models that drive business decisions.\n\n**Responsibilities:**\n- Build and deploy ML models\n- Analyze large datasets\n- Present findings to stakeholders\n- Collaborate with engineering on MLOps\n\n**Requirements:**\n- MS/PhD in related field or equivalent experience\n- Strong Python and SQL skills\n- Experience with TensorFlow or PyTorch\n- Knowledge of statistical analysis`,
        skills: 'Python,TensorFlow,SQL,Machine Learning,Statistics',
        deadline: new Date('2026-05-25'),
        recruiterId: recruiter.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Mobile Developer (React Native)',
        company: 'AppWorks',
        location: 'onsite',
        type: 'full-time',
        salaryMin: 110000,
        salaryMax: 150000,
        description: `Build cross-platform mobile applications for our growing user base.\n\n**Responsibilities:**\n- Develop iOS and Android apps with React Native\n- Integrate with REST APIs\n- Optimize app performance\n- Publish to App Store and Play Store\n\n**Requirements:**\n- 3+ years React Native experience\n- Published apps on both stores\n- Knowledge of native modules\n- Strong JavaScript/TypeScript skills`,
        skills: 'React Native,TypeScript,iOS,Android,REST APIs',
        deadline: new Date('2026-06-10'),
        recruiterId: recruiter.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Security Engineer',
        company: 'SecureNet',
        location: 'remote',
        type: 'contract',
        salaryMin: 150000,
        salaryMax: 200000,
        description: `We're looking for a Security Engineer to help protect our infrastructure and customer data.\n\n**Responsibilities:**\n- Conduct security audits and penetration testing\n- Implement security monitoring\n- Respond to security incidents\n- Develop security policies\n\n**Requirements:**\n- 5+ years security experience\n- CISSP or equivalent certification\n- Experience with SIEM tools\n- Knowledge of compliance frameworks (SOC 2, ISO 27001)`,
        skills: 'Cybersecurity,Penetration Testing,SIEM,Compliance,Python',
        deadline: new Date('2026-05-30'),
        recruiterId: recruiter.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Product Manager',
        company: 'InnovateTech',
        location: 'hybrid',
        type: 'full-time',
        salaryMin: 130000,
        salaryMax: 170000,
        description: `Lead product strategy and execution for our B2B SaaS platform.\n\n**Responsibilities:**\n- Define product roadmap and strategy\n- Gather and prioritize requirements\n- Work with engineering and design teams\n- Analyze product metrics and KPIs\n\n**Requirements:**\n- 4+ years product management experience\n- B2B SaaS background\n- Strong analytical skills\n- Excellent communication abilities`,
        skills: 'Product Strategy,Agile,Analytics,B2B SaaS,Roadmapping',
        deadline: new Date('2026-06-20'),
        recruiterId: recruiter.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Junior Web Developer',
        company: 'WebStudio',
        location: 'onsite',
        type: 'part-time',
        salaryMin: 50000,
        salaryMax: 70000,
        description: `Great opportunity for a junior developer to grow their skills in a supportive environment.\n\n**Responsibilities:**\n- Build and maintain client websites\n- Fix bugs and implement features\n- Learn from senior developers\n- Participate in code reviews\n\n**Requirements:**\n- Basic knowledge of HTML, CSS, JavaScript\n- Familiarity with React or Vue\n- Eagerness to learn\n- Strong problem-solving skills`,
        skills: 'HTML,CSS,JavaScript,React,Git',
        deadline: new Date('2026-07-01'),
        recruiterId: recruiter.id,
      },
    }),
  ]);

  console.log(`${jobs.length} jobs created`);

  // Create a sample application
  await prisma.application.create({
    data: {
      jobId: jobs[0].id,
      seekerId: seeker.id,
      coverLetter: 'I am very interested in this position and believe my skills align perfectly with the requirements.',
      status: 'reviewed',
    },
  });

  console.log('Sample application created');
  console.log('\nSeed completed! Test accounts:');
  console.log('  Seeker:    seeker@example.com / password123');
  console.log('  Recruiter: recruiter@example.com / password123');
  console.log('  Admin:     admin@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
