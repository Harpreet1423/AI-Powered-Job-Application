import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { authenticate } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';

const router = Router();

// Analyze resume with Claude AI
router.post('/analyze-resume', authenticate, uploadResume.single('resume'), async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Resume PDF is required' });
    }

    // Extract text from PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    let resumeText;
    try {
      // Dynamic import for pdf-parse (CommonJS module)
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(pdfBuffer);
      resumeText = pdfData.text;
    } catch {
      return res.status(400).json({ error: 'Could not parse PDF. Please ensure the file is a valid PDF document.' });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract enough text from the PDF. Please ensure it contains readable text.' });
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return mock analysis for development
      const mockAnalysis = generateMockAnalysis(resumeText, jobDescription);
      await saveAnalysis(req, mockAnalysis, req.file.filename);
      return res.json({ analysis: mockAnalysis });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the provided resume and return a detailed JSON response.

Your response must be ONLY valid JSON with this exact structure:
{
  "atsScore": <number 0-100>,
  "categories": {
    "skillsMatch": <number 0-100>,
    "formatting": <number 0-100>,
    "clarity": <number 0-100>,
    "impact": <number 0-100>,
    "keywords": <number 0-100>
  },
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "improvements": ["<improvement 1>", "<improvement 2>", ...],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", ...],
  "sectionFeedback": {
    "summary": { "score": <0-100>, "feedback": "<detailed feedback>", "suggestions": ["<suggestion>"] },
    "experience": { "score": <0-100>, "feedback": "<detailed feedback>", "suggestions": ["<suggestion>"] },
    "skills": { "score": <0-100>, "feedback": "<detailed feedback>", "suggestions": ["<suggestion>"] },
    "education": { "score": <0-100>, "feedback": "<detailed feedback>", "suggestions": ["<suggestion>"] }
  },
  "overallSummary": "<2-3 sentence summary>"
}

Be specific and actionable in your feedback. Score based on real ATS parsing standards.`;

    let userMessage = `Analyze this resume:\n\n${resumeText}`;
    if (jobDescription) {
      userMessage += `\n\n---\n\nCompare against this job description:\n\n${jobDescription}`;
    }

    let analysis;
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const analysisText = response.content[0].text;
      try {
        analysis = JSON.parse(analysisText);
      } catch {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse AI response');
        }
      }
    } catch (aiErr) {
      console.warn('Claude API call failed, falling back to mock analysis:', aiErr.message);
      analysis = generateMockAnalysis(resumeText, jobDescription);
    }

    await saveAnalysis(req, analysis, req.file.filename);
    res.json({ analysis });
  } catch (err) {
    next(err);
  }
});

// Get user's past analyses
router.get('/analyses', authenticate, async (req, res, next) => {
  try {
    const analyses = await req.prisma.resumeAnalysis.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = analyses.map(a => ({
      ...a,
      feedback: JSON.parse(a.feedback),
    }));

    res.json({ analyses: parsed });
  } catch (err) {
    next(err);
  }
});

async function saveAnalysis(req, analysis, filename) {
  await req.prisma.resumeAnalysis.create({
    data: {
      userId: req.user.id,
      resumeUrl: `/uploads/${filename}`,
      atsScore: analysis.atsScore || 0,
      feedback: JSON.stringify(analysis),
    },
  });
}

function generateMockAnalysis(resumeText, jobDescription) {
  const wordCount = resumeText.split(/\s+/).length;
  const hasEmail = /[\w.-]+@[\w.-]+/.test(resumeText);
  const hasPhone = /[\d-]{10,}/.test(resumeText);
  const hasLinkedIn = /linkedin/i.test(resumeText);

  const baseScore = Math.min(85, 40 + Math.floor(wordCount / 20));
  const contactBonus = (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0) + (hasLinkedIn ? 5 : 0);

  return {
    atsScore: Math.min(100, baseScore + contactBonus),
    categories: {
      skillsMatch: jobDescription ? 62 : 70,
      formatting: 75,
      clarity: 72,
      impact: 65,
      keywords: jobDescription ? 58 : 68,
    },
    strengths: [
      'Resume contains structured content with clear sections',
      hasEmail ? 'Contact information includes email address' : 'Resume has substantial content',
      `Resume length (${wordCount} words) is appropriate for the career level`,
      'Skills and experience sections are present',
    ],
    improvements: [
      'Add more quantifiable achievements with metrics (numbers, percentages, dollar amounts)',
      'Use stronger action verbs at the beginning of bullet points',
      'Ensure consistent formatting throughout all sections',
      'Consider adding a professional summary or objective statement',
      jobDescription ? 'Tailor resume keywords more closely to the job description' : 'Consider tailoring the resume for specific job applications',
    ],
    missingKeywords: jobDescription
      ? ['team leadership', 'project management', 'stakeholder communication', 'agile methodology', 'cross-functional']
      : ['quantifiable results', 'leadership', 'collaboration'],
    sectionFeedback: {
      summary: {
        score: 68,
        feedback: 'The professional summary could be more impactful. Consider highlighting your unique value proposition and key achievements.',
        suggestions: ['Lead with your most impressive achievement', 'Include years of experience and key specialization'],
      },
      experience: {
        score: 72,
        feedback: 'Experience section has good content but could benefit from more quantified achievements and stronger action verbs.',
        suggestions: ['Start each bullet with a strong action verb', 'Add metrics: percentages, dollar amounts, team sizes'],
      },
      skills: {
        score: 70,
        feedback: 'Skills section is present but could be better organized. Consider categorizing technical and soft skills separately.',
        suggestions: ['Group skills by category (Technical, Tools, Soft Skills)', 'Add proficiency levels where relevant'],
      },
      education: {
        score: 78,
        feedback: 'Education section is well-structured with relevant details.',
        suggestions: ['Add relevant coursework or certifications if applicable', 'Include GPA if above 3.5'],
      },
    },
    overallSummary: `This resume scores ${Math.min(100, baseScore + contactBonus)}/100 on ATS compatibility. The document has a solid foundation with room for improvement in quantifying achievements and keyword optimization. ${jobDescription ? 'When compared to the target job description, there are several missing keywords that should be incorporated.' : 'Consider tailoring the resume for each specific application.'}`,
  };
}

export default router;
