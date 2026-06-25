import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

const fallbackResponses = [
  {
    keywords: ['resume', 'cv', 'profile', 'bio', 'summary'],
    reply: "To make your resume or profile stand out, I recommend focusing on three main areas:\n\n1. **Use Action Verbs**: Begin bullet points with strong action verbs (e.g., *Architected*, *Spearheaded*, *Optimized*).\n2. **Quantify Results**: Instead of saying 'improved query performance', say 'optimized MongoDB indexing, reducing query latencies by 45%'.\n3. **Tailor to the Job**: Scan target job listings for key skills (like *System Design*, *Socket.IO*, or *React*) and incorporate them naturally.\n\nWould you like me to draft a professional summary for your profile? Let me know your current role and years of experience!"
  },
  {
    keywords: ['connect', 'outreach', 'template', 'draft', 'message', 'invite'],
    reply: "Here is a clean, professional template you can use to reach out to recruiters or professionals in your network:\n\n---\n*\"Hi [Name],\n\nI came across your profile and was inspired by your career journey in [Industry/Field]. I am currently developing React/Node.js web platforms and am looking to connect with like-minded professionals in the area.\n\nI would love to connect and follow your insights! \n\nBest regards,\n[Your Name]\"*\n---\n\nPro Tip: Always mention a specific project or achievement of theirs if you have seen it!"
  },
  {
    keywords: ['interview', 'prep', 'prepare', 'questions', 'behavioral', 'star'],
    reply: "For technical and behavioral interviews, I highly recommend using the **STAR Method** (Situation, Task, Action, Result) to structure your answers. Here is how to prepare:\n\n1. **Tell Me About Yourself**: Prepare a 60-second summary highlighting your core stack (e.g. MERN) and 1-2 major achievements.\n2. **STAR Stories**: Prepare 3 stories about *challenges* you faced, *conflicts* you resolved, and *mistakes* you learned from.\n3. **Questions for Them**: Always ask 2-3 questions at the end (e.g., 'What does success look like in the first 90 days for this role?').\n\nWhat role or stack is your upcoming interview for? I can simulate a mock interview with you!"
  },
  {
    keywords: ['hello', 'hi', 'hey', 'start', 'coach', 'help', 'career'],
    reply: "Hello! I am your **Global Connect AI Career Coach**. 🚀\n\nI am here to guide you with:\n- **Resume & Profile Optimization**\n- **Professional Outreach Templates**\n- **Interview Preparation & Mock Sessions**\n- **Career Path Planning**\n\nHow can I help you accelerate your professional journey today?"
  }
];

// @route   POST /api/ai/chat
// @desc    Get career advice from Gemini API or Career Coach fallback
// @access  Private
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      console.log('📡 Sending request to Google Gemini API...');
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are a helpful, professional AI Career Coach and networking assistant on Global Connect (a professional networking platform like LinkedIn). Keep answers concise, highly structured, encouraging, and formatted in clean markdown. Provide actionable career advice. User message: "${message}"`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            return res.json({ response: responseText });
          }
        }
        console.warn('⚠️ Gemini API response not ok or missing parts, falling back to mock coach.');
      } catch (apiErr) {
        console.error('❌ Gemini API Connection error:', apiErr.message);
      }
    }

    // Fallback: Matching keywords to give career advice
    const lowerMessage = message.toLowerCase();
    let reply = "That's an interesting question! I can help you optimize your resume, write outreach templates, or prepare for interviews. Could you please specify if you'd like resume advice, connection templates, or interview prep techniques?";

    for (const option of fallbackResponses) {
      if (option.keywords.some(keyword => lowerMessage.includes(keyword))) {
        reply = option.reply;
        break;
      }
    }

    // Delay slightly to simulate AI typing experience
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({ response: reply });
  } catch (error) {
    console.error('AI chat route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
