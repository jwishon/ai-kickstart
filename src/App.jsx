import { useState, useEffect, useCallback, useMemo } from 'react'

// ─── STYLES ────────────────────────────────────────────────
const COLORS = {
  bg: '#0f0f1a',
  card: '#1a1a2e',
  cardHover: '#232342',
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  accent: '#22d3ee',
  accentGreen: '#34d399',
  accentOrange: '#fb923c',
  accentPink: '#f472b6',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  border: '#2d2d4a',
  success: '#22c55e',
  warning: '#eab308',
  premium: '#f59e0b',
}

// ─── DATA: ROLES ───────────────────────────────────────────
const ROLES = [
  { id: 'pm', label: 'Project Manager', icon: '📋', desc: 'Agile, status reports, stakeholder updates' },
  { id: 'marketer', label: 'Marketer', icon: '📣', desc: 'Content, campaigns, analytics, social' },
  { id: 'sales', label: 'Salesperson', icon: '🤝', desc: 'Outreach, proposals, CRM, follow-ups' },
  { id: 'hr', label: 'HR Professional', icon: '👥', desc: 'Recruiting, onboarding, policies, comms' },
  { id: 'exec', label: 'Executive / Leader', icon: '🎯', desc: 'Strategy, decisions, presentations, comms' },
  { id: 'freelancer', label: 'Freelancer / Consultant', icon: '💼', desc: 'Proposals, invoicing, client work, marketing' },
  { id: 'ops', label: 'Operations', icon: '⚙️', desc: 'Processes, documentation, automation, reporting' },
  { id: 'other', label: 'Other', icon: '🌟', desc: 'General knowledge worker' },
]

// ─── DATA: ASSESSMENT ──────────────────────────────────────
const ASSESSMENT_QUESTIONS = [
  { q: 'How often do you use AI tools (ChatGPT, Claude, Gemini, Copilot)?', opts: ['Never tried one', 'Tried once or twice', 'A few times a month', 'Weekly or more'] },
  { q: 'When you use AI, what do you typically do?', opts: ['Ask basic questions', 'Write or edit content', 'Analyze data or documents', 'Multiple complex tasks'] },
  { q: 'Have you ever customized an AI tool (custom instructions, system prompts)?', opts: ['What does that mean?', 'I\'ve heard of it', 'I\'ve tried it', 'I use it regularly'] },
  { q: 'How would you rate your prompting skills?', opts: ['I just type whatever comes to mind', 'I try to be specific but it\'s hit or miss', 'I have some techniques that work', 'I write structured, detailed prompts'] },
  { q: 'Have you built a Custom GPT, Claude Project, or Google Gem?', opts: ['Never heard of these', 'Heard of them, haven\'t tried', 'Built one but didn\'t stick', 'Use them regularly'] },
]

// ─── DATA: MODULES ─────────────────────────────────────────
const MODULES = [
  {
    id: 1, title: 'How AI Actually Thinks', icon: '🧠', duration: '3 min',
    free: true, tagline: 'The mental model that makes everything else click',
    content: {
      sections: [
        {
          heading: 'AI Isn\'t Google — Here\'s the Difference',
          text: `When you search Google, you're finding pages other humans wrote. When you talk to an AI, you're asking a pattern-matching engine to generate new text based on everything it's learned.\n\nThis matters because it means AI doesn't "know" things the way you do. It predicts what a helpful response looks like. The better you describe what helpful looks like, the better the output.`,
        },
        {
          heading: 'Why Your First Attempt Usually Misses',
          text: `Most people type a one-line question and expect a perfect answer. That's like walking into a meeting and saying "fix the project" without any context.\n\nAI needs the same things a smart colleague needs: context about the situation, clarity about what you want, and specifics about the format and tone.`,
        },
        {
          heading: 'The 80/20 of Better Results',
          text: `You don't need to become a prompt engineer. You just need to do three things consistently:\n\n1. Tell the AI who it should act as (role)\n2. Give it the relevant context (background)\n3. Be specific about what you want back (format)\n\nThat's it. Those three things will make 80% of your interactions dramatically better.`,
        },
      ],
      exercise: {
        title: 'Rewrite This Prompt',
        bad: 'Write me an email about the project update.',
        hint: 'Add: who you\'re emailing, what project, what happened, what tone.',
        good: 'You\'re a project manager writing a weekly status email to the VP of Engineering. The project is a CRM migration, currently on track. Milestones hit this week: data mapping complete, test environment set up. One risk: vendor API documentation is delayed. Write a professional, concise email (under 200 words) with a clear subject line.',
      },
    },
  },
  {
    id: 2, title: 'The Anatomy of a Great Prompt', icon: '✍️', duration: '4 min',
    free: true, tagline: 'Five components that turn vague requests into sharp results',
    content: {
      sections: [
        {
          heading: 'The Five Components',
          text: `Every great prompt has up to five parts. You don't need all five every time, but knowing them gives you a toolkit to fix any prompt that isn't working.\n\n• Role — Who should the AI act as? ("You're a senior copywriter...")\n• Context — What background does it need? ("Our company sells B2B software to healthcare...")\n• Task — What specifically should it do? ("Write three subject line options...")\n• Format — What should the output look like? ("Bullet points, under 50 words each...")\n• Constraints — What should it avoid? ("Don't use jargon, don't exceed 200 words...")`,
        },
        {
          heading: 'Side-by-Side: Vague vs. Specific',
          text: `❌ Vague: "Help me write a presentation about Q2 results."\n\n✅ Specific: "You're a delivery manager presenting Q2 results to the SVP. The audience is non-technical. Key metrics: project delivery rate (94%), customer satisfaction (4.6/5), team velocity (+12%). One risk to flag: a staffing gap in the ServiceNow team. Create a 5-slide outline with speaker notes. Tone: confident, data-driven, not overly formal."`,
        },
        {
          heading: 'Start Simple, Then Iterate',
          text: `You don't have to write the perfect prompt on the first try. Start with Role + Task, see what you get, then add Context, Format, and Constraints to sharpen it.\n\nThink of it like a conversation: your first prompt starts the discussion, and follow-ups refine it. "Make it shorter," "Add more data," "Change the tone to be more direct" — these are all valid second prompts.`,
        },
      ],
      exercise: {
        title: 'Build a Prompt from Scratch',
        bad: 'Write a report.',
        hint: 'Use all 5 components: Role, Context, Task, Format, Constraints.',
        good: 'Role: You\'re a business analyst. Context: Our SaaS platform had 15% churn last quarter, up from 10%. Most churn is in the SMB segment. Task: Write a brief analysis of likely causes and 3 recommendations. Format: Executive summary (3 paragraphs max), then bullet-point recommendations. Constraints: Avoid technical jargon — the audience is the CEO.',
      },
    },
  },
  {
    id: 3, title: 'Your Daily AI Workflow', icon: '📅', duration: '4 min',
    free: true, tagline: 'How to actually use AI in your day-to-day work',
    content: {
      sections: [
        {
          heading: 'Morning: Plan and Prioritize',
          text: `Start your day by pasting in your meeting list and task backlog. Ask AI to help you prioritize, draft agendas for your meetings, and identify the 3 things that will move the needle today.\n\nPrompt idea: "Here's my calendar and task list for today. Help me identify the top 3 priorities and draft a plan for the day. Flag anything that looks like a conflict or time crunch."`,
        },
        {
          heading: 'Midday: Draft and Analyze',
          text: `This is where AI saves the most time. Status updates, emails, document summaries, meeting notes cleanup, first drafts of proposals or reports — anything you'd normally stare at a blank page for.\n\nThe key mindset shift: use AI for the first draft, then apply your expertise to edit and refine. You go from "writer" to "editor," which is faster and often produces better results.`,
        },
        {
          heading: 'End of Day: Reflect and Prepare',
          text: `Paste your meeting notes and accomplishments into AI. Ask it to summarize what happened, flag open action items, and draft any follow-up emails you need to send.\n\nPrompt idea: "Here are my notes from today's meetings. Summarize the key decisions, list all action items assigned to me, and draft follow-up emails for any items that need immediate response."`,
        },
      ],
      exercise: {
        title: 'Map Your Own AI Day',
        bad: 'Think about when you could use AI.',
        hint: 'Pick 3 specific tasks from your actual workday that AI could speed up.',
        good: 'List three tasks you did this week that involved writing, analyzing, or summarizing. For each one, write a prompt you could have used to get a first draft from AI. Try using one of them tomorrow morning.',
      },
    },
  },
  {
    id: 4, title: 'Choosing the Right AI Tool', icon: '🔧', duration: '4 min',
    free: false, tagline: 'ChatGPT vs. Claude vs. Gemini vs. Copilot — when to use which',
    content: {
      sections: [
        {
          heading: 'The Big Four — Quick Comparison',
          text: `• ChatGPT (OpenAI) — Best for: general tasks, creative writing, image generation, Custom GPTs. The most popular option with the largest plugin ecosystem.\n\n• Claude (Anthropic) — Best for: long documents, nuanced analysis, coding, careful reasoning. Handles large context windows well — great for pasting in entire reports or codebases.\n\n• Gemini (Google) — Best for: research with real-time web access, Google Workspace integration, working with Gmail/Docs/Sheets natively.\n\n• Copilot (Microsoft) — Best for: users deep in the Microsoft ecosystem. Lives inside Word, Excel, Outlook, Teams. Great for enterprise workers who want AI without switching tools.`,
        },
        {
          heading: 'Free vs. Paid — What\'s Worth It?',
          text: `Free tiers are fine for getting started and casual use. Paid tiers ($20/month range) are worth it if:\n\n• You use AI daily for real work (the time savings pay for themselves)\n• You need longer conversations or bigger document uploads\n• You want access to the latest, most capable models\n• You need features like image generation or advanced analysis\n\nStart free with 2–3 tools, figure out which one fits your workflow, then go paid on that one.`,
        },
        {
          heading: 'The Right Tool for the Task',
          text: `Rather than picking one tool forever, think in terms of tasks:\n\n• Writing emails, proposals, creative content → ChatGPT or Claude\n• Analyzing a 50-page PDF or contract → Claude\n• Researching current events or market data → Gemini\n• Working inside Word or Excel → Copilot\n• Building automations → ChatGPT (with plugins) or Gemini\n\nMost power users settle on 1–2 primary tools and use others for specific tasks.`,
        },
      ],
      exercise: {
        title: 'Find Your Primary Tool',
        bad: 'Try all the AI tools.',
        hint: 'Pick the tool that fits your main ecosystem (Google, Microsoft, or standalone).',
        good: 'Sign up for free accounts on ChatGPT and Claude. Take the same prompt — one from Module 2 — and run it in both. Compare the outputs. Which one felt more natural for your use case?',
      },
    },
  },
  {
    id: 5, title: 'Advanced Prompting Moves', icon: '🚀', duration: '5 min',
    free: false, tagline: 'Techniques that separate casual users from power users',
    content: {
      sections: [
        {
          heading: 'Chain-of-Thought: Make AI Show Its Work',
          text: `Adding "think step by step" or "walk me through your reasoning" to a prompt dramatically improves accuracy on complex tasks — analysis, problem-solving, planning.\n\nInstead of: "What's the best pricing strategy for our app?"\n\nTry: "Think step by step. Analyze the pros and cons of freemium vs. subscription vs. one-time purchase for a productivity app targeting project managers. Consider conversion rates, lifetime value, and user acquisition cost. Then recommend the best approach with your reasoning."`,
        },
        {
          heading: 'AI as Editor, Not Just Writer',
          text: `One of the most underused moves: give AI your own draft and ask it to improve it.\n\n• "Here's my email draft. Make it 40% shorter without losing any key information."\n• "Review this project plan and identify gaps, risks, or unrealistic timelines."\n• "I wrote this executive summary. Rewrite it to be more data-driven and less generic."\n\nThis works because you're starting with your expertise and using AI to refine — not the other way around.`,
        },
        {
          heading: 'Structured Output: Get Exactly What You Need',
          text: `Tell AI the exact format you want:\n\n• "Respond as a markdown table with columns: Task, Priority, Owner, Due Date"\n• "Give me exactly 5 bullet points, each under 20 words"\n• "Format as a STAR response (Situation, Task, Action, Result)"\n\nStructured output saves you from having to reformat AI responses to fit your actual needs. Tell it the shape, and it'll fill it.`,
        },
      ],
      exercise: {
        title: 'Try the Editor Technique',
        bad: 'Ask AI to write something for you.',
        hint: 'Take something YOU wrote and ask AI to improve it.',
        good: 'Find an email, report, or document you wrote this week. Paste it into your AI tool with: "Review this and suggest 3 specific improvements. Focus on clarity, conciseness, and impact. Show me a revised version."',
      },
    },
  },
  {
    id: 6, title: 'Building Your AI Toolkit', icon: '🧰', duration: '4 min',
    free: false, tagline: 'Organize your prompts so they work for you every time',
    content: {
      sections: [
        {
          heading: 'Custom Instructions: Set It Once, Benefit Forever',
          text: `Every major AI tool lets you set "custom instructions" — persistent context that applies to every conversation.\n\nThis is where you tell the AI who you are, what you do, and how you like responses. Instead of re-explaining your context every time, set it once:\n\n"I'm a senior project manager at a mid-size tech company. I manage 3 concurrent projects with cross-functional teams. I prefer concise, direct responses. Use bullet points for action items. Always tie recommendations to business impact."`,
        },
        {
          heading: 'Building a Reusable Prompt Library',
          text: `If you find yourself writing similar prompts repeatedly, save them. Build a simple system:\n\n1. Keep a note (Google Doc, Notion, Notes app) with your best prompts\n2. Organize by category: Writing, Analysis, Planning, Communication\n3. Leave [BRACKETS] for the parts that change each time\n\nExample template: "Draft a [weekly/monthly] status update for [audience]. Key accomplishments: [list]. Risks: [list]. Next steps: [list]. Keep it under [word count] words. Tone: [professional/casual]."`,
        },
        {
          heading: 'Your AI Starter Kit',
          text: `Here's what your personal toolkit should include by the time you finish this app:\n\n• Custom instructions set up on your primary AI tool\n• 5–10 saved prompt templates for your most common tasks\n• A daily workflow pattern (when you use AI, for what)\n• One custom skill/GPT for your most repetitive task\n\nThis kit turns AI from "a thing I sometimes use" into "a tool I rely on every day."`,
        },
      ],
      exercise: {
        title: 'Set Up Your Custom Instructions',
        bad: 'Think about what instructions you\'d set.',
        hint: 'Actually open your AI tool and configure the custom instructions right now.',
        good: 'Open ChatGPT (Settings → Custom Instructions) or Claude (your profile → Custom Style). Write 3–5 sentences describing who you are, what you do, and how you like responses formatted. Save it and try a conversation — notice the difference.',
      },
    },
  },
  {
    id: 7, title: 'Build Custom AI Skills', icon: '⚡', duration: '5 min',
    free: false, tagline: 'Create AI assistants that do specific tasks perfectly, every time',
    content: {
      sections: [
        {
          heading: 'What Are Custom AI Skills?',
          text: `A custom skill (Custom GPT, Claude Project, Google Gem) is an AI assistant you configure once to do a specific task reliably. Instead of writing the same detailed prompt every time you need a status report, you build a "Status Report Writer" that already knows your format, audience, and preferences.\n\nThink of it as the difference between explaining a task to a new hire every time versus training a team member who remembers how you like things done.`,
        },
        {
          heading: 'Where to Build Them',
          text: `• Custom GPTs (ChatGPT Plus) — The most mature platform. You define instructions, upload reference documents, and optionally add web browsing or code execution. Share publicly or keep private.\n\n• Claude Projects (Claude Pro) — Create a project with custom instructions and upload documents as context. Great for tasks requiring analysis of specific documents or data.\n\n• Google Gems (Gemini Advanced) — Similar to Custom GPTs but integrated with Google Workspace. Good if your workflow lives in Google Docs, Sheets, and Gmail.`,
        },
        {
          heading: 'Build Your First Skill in 10 Minutes',
          text: `Pick your most repetitive AI task and turn it into a custom skill:\n\n1. Write down the prompt you'd normally use (the full, detailed version)\n2. Identify what changes each time (the variables) vs. what stays the same (the instructions)\n3. Put the constant parts into the custom skill's instructions\n4. Upload any reference documents (style guides, templates, past examples)\n5. Test it with 3 different inputs to make sure it works consistently\n\nExample: A "Meeting Agenda Builder" skill that takes a meeting topic and attendee list, then outputs a structured agenda with time allocations, discussion points, and pre-read materials.`,
        },
      ],
      exercise: {
        title: 'Build Your First Custom Skill',
        bad: 'Think about what custom skill you\'d build.',
        hint: 'Pick your #1 most repetitive task and build a skill for it right now.',
        good: 'Go to ChatGPT → Explore GPTs → Create, or Claude → Projects → New Project. Name it after your most common task. Paste in your best prompt as the instructions. Upload one reference document. Test it with a real task from this week.',
      },
    },
  },
  {
    id: 8, title: 'AI Agents: Autopilot Mode', icon: '🤖', duration: '6 min',
    free: false, tagline: 'Put AI to work across steps, tools, and workflows',
    content: {
      sections: [
        {
          heading: 'Agents vs. Chatbots — The Key Difference',
          text: `A chatbot answers questions. An agent takes actions.\n\nWhen you ask ChatGPT to draft an email, that's a chatbot interaction. When you set up a system that automatically monitors your inbox, drafts responses to common questions, flags urgent items, and puts tasks in your to-do list — that's an agent.\n\nAgents combine AI with tools (email, calendar, databases, web) to complete multi-step workflows without you hovering over them.`,
        },
        {
          heading: 'No-Code Agent Builders You Can Use Today',
          text: `You don't need to code to build AI agents:\n\n• Zapier AI Agents — Connect 6,000+ apps. "When a new email arrives from a client, summarize it, check my calendar, and draft a response with available meeting times."\n\n• Microsoft Copilot Studio — Build agents inside the Microsoft ecosystem. Great for Teams, SharePoint, and Outlook workflows.\n\n• Make.com — Visual workflow builder with AI steps. More flexible than Zapier for complex logic.\n\n• Claude with MCP (Model Context Protocol) — Connect Claude to your files, databases, and tools directly.\n\nStart with Zapier if you want the easiest on-ramp. Move to Copilot Studio if your org runs on Microsoft.`,
        },
        {
          heading: 'The Decision Framework',
          text: `Not everything needs to be an agent. Use this to decide:\n\n• Is it a one-time task? → Just use a prompt.\n• Do you do it the same way every time? → Build a custom skill (Module 7).\n• Does it involve multiple steps across different tools? → Build an agent.\n• Does it need to run without you? → Build an agent with a trigger.\n\nStart small. Build one agent for one workflow. Let it prove itself before you automate everything. And always add a human review step for anything that sends content externally (emails, messages, posts).`,
        },
      ],
      exercise: {
        title: 'Design Your First Agent',
        bad: 'Think about what you\'d automate.',
        hint: 'Map out a workflow you do weekly that crosses 2+ tools.',
        good: 'Write down a workflow you do every week that touches at least 2 tools (e.g., email + calendar, Slack + project board). Map the steps: trigger → action 1 → action 2 → output. Then go to zapier.com/agents and try building it. Start with a "notify me" output instead of auto-sending anything.',
      },
    },
  },
]

// ─── DATA: PROMPT LIBRARY ──────────────────────────────────
const PROMPTS = [
  // Writing
  { id: 'p1', title: 'Weekly Status Email', category: 'writing', roles: ['pm', 'ops', 'exec'], free: true, prompt: 'You\'re a [role] writing a weekly status update email to [audience]. Project: [name]. Key accomplishments this week: [list]. Risks or blockers: [list]. Next week\'s priorities: [list]. Write a professional, concise email (under 200 words) with a clear subject line. Tone: confident and transparent.' },
  { id: 'p2', title: 'Meeting Follow-Up Email', category: 'writing', roles: ['pm', 'sales', 'exec', 'hr'], free: true, prompt: 'Draft a follow-up email after a meeting. Meeting topic: [topic]. Attendees: [names]. Key decisions made: [list]. Action items: [list with owners and dates]. Next meeting: [date/time]. Keep it concise and professional. Include a clear subject line.' },
  { id: 'p3', title: 'Cold Outreach Email', category: 'writing', roles: ['sales', 'freelancer', 'marketer'], free: false, prompt: 'You\'re a [sales rep / consultant] reaching out to [target persona] at [company type]. Your product/service: [description]. The pain point you solve: [specific problem]. Write a cold email that\'s personal (not templated-sounding), under 150 words, with a clear call to action. No hard sell — focus on curiosity and relevance.' },
  { id: 'p4', title: 'Executive Summary', category: 'writing', roles: ['pm', 'exec', 'ops'], free: true, prompt: 'Write an executive summary for [document/project/initiative]. Audience: [C-suite / VP / Board]. Key points to cover: [list]. Length: one page maximum. Lead with the business impact, then supporting data. Tone: authoritative, data-driven, no jargon.' },
  { id: 'p5', title: 'Blog Post Draft', category: 'writing', roles: ['marketer', 'freelancer'], free: false, prompt: 'Write a blog post titled "[topic]" for [target audience]. Goal: [educate / persuade / entertain]. Key points to cover: [list]. Tone: [professional / conversational / authoritative]. Include a compelling intro hook, 3-5 subheadings, and a clear call-to-action at the end. Length: [word count].' },
  // Analysis
  { id: 'p6', title: 'Document Summarizer', category: 'analysis', roles: ['pm', 'exec', 'hr', 'ops'], free: true, prompt: 'Summarize the following document in [3 bullet points / one paragraph / an executive brief]. Focus on: key decisions, action items, and anything that requires follow-up. Flag any risks or concerns. Audience: [who will read this summary].\n\n[Paste document here]' },
  { id: 'p7', title: 'Competitive Analysis', category: 'analysis', roles: ['marketer', 'sales', 'exec'], free: false, prompt: 'Analyze [competitor name] compared to [your company/product]. Cover: positioning, pricing, strengths, weaknesses, and market perception. Use publicly available information. Format as a comparison table followed by 3 strategic recommendations for how we should respond. Be specific — no generic advice.' },
  { id: 'p8', title: 'Risk Assessment', category: 'analysis', roles: ['pm', 'ops', 'exec'], free: false, prompt: 'Review this [project plan / proposal / initiative] and identify the top 5 risks. For each risk: describe the risk, rate likelihood (Low/Med/High), rate impact (Low/Med/High), and suggest a mitigation strategy. Format as a table. Be specific to this project, not generic.\n\n[Paste plan here]' },
  // Planning
  { id: 'p9', title: 'Meeting Agenda Builder', category: 'planning', roles: ['pm', 'exec', 'ops'], free: true, prompt: 'Create a structured meeting agenda. Meeting type: [standup / review / planning / 1:1]. Duration: [minutes]. Attendees: [roles/names]. Topics to cover: [list]. For each topic, include: time allocation, discussion lead, and expected outcome. Add 5 minutes for parking lot items at the end.' },
  { id: 'p10', title: 'Project Kickoff Plan', category: 'planning', roles: ['pm', 'ops'], free: false, prompt: 'Create a project kickoff plan for [project name]. Scope: [brief description]. Team: [roles involved]. Timeline: [target dates]. Include: objectives, success criteria, key milestones, RACI for first 3 deliverables, communication plan, and a list of decisions needed in the first week.' },
  { id: 'p11', title: 'Sprint Planning Helper', category: 'planning', roles: ['pm'], free: false, prompt: 'Help me plan a 2-week sprint. Team capacity: [number of people, hours available]. Backlog items: [paste list with estimates]. Carryover from last sprint: [items]. Help me: prioritize by business value, check if scope fits capacity, identify dependencies, and suggest a sprint goal. Flag if we\'re overcommitting.' },
  // Communication
  { id: 'p12', title: 'Difficult Conversation Prep', category: 'communication', roles: ['pm', 'hr', 'exec'], free: false, prompt: 'Help me prepare for a difficult conversation with [person/role]. Situation: [what happened]. My goal: [desired outcome]. Their likely perspective: [what you think they\'ll say]. Draft: an opening statement, key talking points, potential objections with responses, and a closing that preserves the relationship. Tone: direct but empathetic.' },
  { id: 'p13', title: 'Presentation Outline', category: 'communication', roles: ['pm', 'exec', 'marketer', 'sales'], free: true, prompt: 'Create a presentation outline for [topic]. Audience: [who]. Duration: [minutes]. Key message: [the one thing they should remember]. Include: slide-by-slide outline with title, key point, and suggested visual for each slide. Maximum [number] slides. Start with the conclusion, then support it.' },
  { id: 'p14', title: 'Stakeholder Update', category: 'communication', roles: ['pm', 'exec', 'ops'], free: false, prompt: 'Draft a stakeholder update for [project/initiative]. Audience: [VP / C-suite / Board]. Cover: progress against milestones, key metrics, wins this period, risks and mitigations, and a clear ask (if any). Format: structured with headers, no longer than one page. Lead with the most important information.' },
  // Creativity
  { id: 'p15', title: 'Brainstorm Generator', category: 'creativity', roles: ['pm', 'marketer', 'freelancer', 'exec'], free: true, prompt: 'Help me brainstorm [topic/challenge]. Context: [background]. Constraints: [budget, time, resources]. Generate 10 ideas ranging from safe/incremental to bold/unconventional. For each idea: one sentence description + one sentence on why it could work. Don\'t self-censor — I want range.' },
  { id: 'p16', title: 'Social Media Content', category: 'creativity', roles: ['marketer', 'freelancer'], free: false, prompt: 'Create [number] social media posts for [platform]. Topic: [subject]. Audience: [target]. Brand voice: [describe]. Goals: [awareness / engagement / clicks]. For each post: the copy, suggested hashtags, and a description of what visual/image to pair with it. Mix formats: text-only, question, statistic, story.' },
  // Advanced
  { id: 'p17', title: 'Custom GPT Instructions Template', category: 'advanced', roles: ['pm', 'marketer', 'sales', 'hr', 'exec', 'freelancer', 'ops'], free: false, prompt: 'Help me write custom instructions for a [Custom GPT / Claude Project] that will [specific purpose]. This assistant should:\n- Always know: [permanent context]\n- Default format: [how outputs should look]\n- Tone: [voice/style]\n- Never do: [constraints]\n- When uncertain: [how to handle ambiguity]\n\nWrite the instructions in second person ("You are...") and keep them under 500 words.' },
  { id: 'p18', title: 'Agent Workflow Design', category: 'advanced', roles: ['pm', 'ops', 'exec', 'freelancer'], free: false, prompt: 'Help me design an AI agent workflow for: [task description]. Current process: [how I do it manually]. Tools involved: [list apps/services]. Desired trigger: [what starts the workflow]. Steps the agent should take: [list]. Output: [what the final result looks like]. Include: error handling, a human review step, and a fallback plan if something fails.' },
]

const CATEGORIES = [
  { id: 'writing', label: 'Writing', icon: '✍️' },
  { id: 'analysis', label: 'Analysis', icon: '🔍' },
  { id: 'planning', label: 'Planning', icon: '📅' },
  { id: 'communication', label: 'Communication', icon: '💬' },
  { id: 'creativity', label: 'Creativity', icon: '💡' },
  { id: 'advanced', label: 'Advanced', icon: '⚡' },
]

// ─── GLOBAL STYLES ─────────────────────────────────────────
const globalCSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: ${COLORS.bg};
    color: ${COLORS.text};
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  .fade-in { animation: fadeIn 0.35s ease-out both; }
  .slide-up { animation: slideUp 0.4s ease-out both; }
`

// ─── HELPER: useLocalStorage ───────────────────────────────
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial }
    catch { return initial }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(val)) }, [key, val])
  return [val, setVal]
}

// ─── COMPONENT: StyleInjector ──────────────────────────────
function StyleInjector() {
  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = globalCSS
    document.head.appendChild(s)
    return () => s.remove()
  }, [])
  return null
}

// ─── COMPONENT: Icon Button ────────────────────────────────
function IconBtn({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px',
      color: active ? COLORS.primary : COLORS.textDim, transition: 'color 0.2s',
      position: 'relative', minWidth: 56,
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
      {badge > 0 && <span style={{
        position: 'absolute', top: 2, right: 6, background: COLORS.accentOrange,
        color: '#000', fontSize: 9, fontWeight: 700, borderRadius: 99,
        padding: '1px 5px', minWidth: 16, textAlign: 'center',
      }}>{badge}</span>}
    </button>
  )
}

// ─── COMPONENT: ProgressBar ────────────────────────────────
function ProgressBar({ value, max, color = COLORS.primary, height = 6 }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ width: '100%', height, background: COLORS.border, borderRadius: height }}>
      <div style={{
        width: `${pct}%`, height: '100%', borderRadius: height,
        background: `linear-gradient(90deg, ${color}, ${COLORS.primaryLight})`,
        transition: 'width 0.5s ease',
      }} />
    </div>
  )
}

// ─── COMPONENT: Card ───────────────────────────────────────
function Card({ children, style, onClick, className }) {
  return (
    <div onClick={onClick} className={className} style={{
      background: COLORS.card, borderRadius: 16, padding: 20,
      border: `1px solid ${COLORS.border}`, cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, border-color 0.2s',
      ...(onClick ? { ':hover': { borderColor: COLORS.primary } } : {}),
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── COMPONENT: PremiumBadge ───────────────────────────────
function PremiumBadge() {
  return (
    <span style={{
      background: `linear-gradient(135deg, ${COLORS.premium}, #f97316)`,
      color: '#000', fontSize: 10, fontWeight: 700, borderRadius: 6,
      padding: '2px 8px', textTransform: 'uppercase', letterSpacing: 0.5,
    }}>Premium</span>
  )
}

// ─── SCREEN: Onboarding ────────────────────────────────────
function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0) // 0=welcome, 1=role, 2=assessment, 3=score
  const [role, setRole] = useState(null)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)

  const calcScore = (ans) => {
    const total = ans.reduce((s, a) => s + a, 0)
    const max = ans.length * 3
    return Math.round((total / max) * 100)
  }

  const handleAnswer = (qIdx, aIdx) => {
    const next = [...answers]
    next[qIdx] = aIdx
    setAnswers(next)
    if (qIdx < ASSESSMENT_QUESTIONS.length - 1) {
      // auto-advance handled by UI
    }
  }

  const getLevel = (s) => {
    if (s <= 25) return { label: 'Beginner', color: COLORS.accent, msg: 'You\'re at the starting line — and that\'s a great place to be. This app will take you from zero to productive with AI.' }
    if (s <= 55) return { label: 'Intermediate', color: COLORS.accentOrange, msg: 'You\'ve got the basics down. The next modules will show you techniques that\'ll 2–3x your effectiveness.' }
    return { label: 'Ready to Level Up', color: COLORS.accentGreen, msg: 'You\'re already using AI well. The advanced modules — custom skills and agents — are where you\'ll find the biggest gains.' }
  }

  // Welcome
  if (step === 0) return (
    <div className="slide-up" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🚀</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Kickstart</h1>
      <p style={{ fontSize: 18, color: COLORS.textMuted, marginBottom: 32, maxWidth: 320, lineHeight: 1.5 }}>Stop chatting with AI.<br />Start working with it.</p>
      <p style={{ fontSize: 14, color: COLORS.textDim, marginBottom: 40, maxWidth: 300, lineHeight: 1.6 }}>A personalized setup guide that turns you from AI-curious to AI-fluent — based on your actual job.</p>
      <button onClick={() => setStep(1)} style={{
        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
        color: '#fff', border: 'none', borderRadius: 14, padding: '16px 48px',
        fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 24px ${COLORS.primary}44`,
      }}>Get Started</button>
    </div>
  )

  // Role Selection
  if (step === 1) return (
    <div className="fade-in" style={{ minHeight: '100vh', padding: 24, paddingTop: 48 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>What's your role?</h2>
      <p style={{ color: COLORS.textMuted, marginBottom: 24, fontSize: 14 }}>This personalizes your learning path, prompts, and examples.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {ROLES.map(r => (
          <div key={r.id} onClick={() => { setRole(r.id); setTimeout(() => setStep(2), 200) }}
            style={{
              background: role === r.id ? COLORS.primary + '22' : COLORS.card,
              border: `2px solid ${role === r.id ? COLORS.primary : COLORS.border}`,
              borderRadius: 14, padding: 16, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6,
            }}>
            <span style={{ fontSize: 28 }}>{r.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</span>
            <span style={{ fontSize: 11, color: COLORS.textDim }}>{r.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )

  // Assessment
  if (step === 2) {
    const currentQ = answers.length
    if (currentQ >= ASSESSMENT_QUESTIONS.length) {
      const s = calcScore(answers)
      setScore(s)
      setStep(3)
      return null
    }
    const q = ASSESSMENT_QUESTIONS[currentQ]
    return (
      <div className="fade-in" key={currentQ} style={{ minHeight: '100vh', padding: 24, paddingTop: 48 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {ASSESSMENT_QUESTIONS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= currentQ ? COLORS.primary : COLORS.border, transition: 'background 0.3s' }} />
          ))}
        </div>
        <p style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 8 }}>Question {currentQ + 1} of {ASSESSMENT_QUESTIONS.length}</p>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, lineHeight: 1.4 }}>{q.q}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(currentQ, i)}
              style={{
                background: COLORS.card, border: `1px solid ${COLORS.border}`,
                borderRadius: 12, padding: '14px 16px', color: COLORS.text,
                fontSize: 14, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.target.style.borderColor = COLORS.primary; e.target.style.background = COLORS.primary + '11' }}
              onMouseOut={e => { e.target.style.borderColor = COLORS.border; e.target.style.background = COLORS.card }}
            >{opt}</button>
          ))}
        </div>
      </div>
    )
  }

  // Score
  if (step === 3) {
    const level = getLevel(score)
    const hoursEstimate = score <= 25 ? '8–10' : score <= 55 ? '5–7' : '3–5'
    return (
      <div className="slide-up" style={{ minHeight: '100vh', padding: 24, paddingTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: 140, height: 140, borderRadius: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          background: `conic-gradient(${level.color} ${score * 3.6}deg, ${COLORS.border} 0deg)`,
          marginBottom: 24, position: 'relative',
        }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: COLORS.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: level.color }}>{score}</span>
            <span style={{ fontSize: 11, color: COLORS.textMuted }}>/ 100</span>
          </div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Your AI Readiness: <span style={{ color: level.color }}>{level.label}</span></h2>
        <p style={{ color: COLORS.textMuted, marginBottom: 24, maxWidth: 340, fontSize: 14, lineHeight: 1.6 }}>{level.msg}</p>
        <div style={{ background: COLORS.card, borderRadius: 14, padding: 20, marginBottom: 32, width: '100%', maxWidth: 340, border: `1px solid ${COLORS.border}` }}>
          <p style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 8 }}>Estimated time savings with AI</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: COLORS.accentGreen }}>{hoursEstimate} hrs/week</p>
          <p style={{ fontSize: 12, color: COLORS.textDim }}>once you complete all modules</p>
        </div>
        <button onClick={() => onComplete(role, score)} style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          color: '#fff', border: 'none', borderRadius: 14, padding: '16px 48px',
          fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 24px ${COLORS.primary}44`,
        }}>Start My Learning Path →</button>
      </div>
    )
  }
}

// ─── SCREEN: Learning Path ─────────────────────────────────
function LearningScreen({ completed, onMarkComplete, isPremium }) {
  const [activeModule, setActiveModule] = useState(null)

  if (activeModule !== null) {
    const mod = MODULES[activeModule]
    const locked = !mod.free && !isPremium
    return (
      <div className="fade-in" style={{ padding: 20, paddingTop: 16, paddingBottom: 100 }}>
        <button onClick={() => setActiveModule(null)} style={{
          background: 'none', border: 'none', color: COLORS.textMuted, fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6,
        }}>← Back to modules</button>

        {locked ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Premium Module</h2>
            <p style={{ color: COLORS.textMuted, marginBottom: 24, maxWidth: 300, margin: '0 auto 24px' }}>Unlock all 8 modules, 150+ prompts, custom skill builders, and agent recipes.</p>
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.premium}22, ${COLORS.accentOrange}11)`,
              border: `1px solid ${COLORS.premium}44`, borderRadius: 16, padding: 24, marginBottom: 24,
            }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: COLORS.premium }}>$4.99<span style={{ fontSize: 14, fontWeight: 400, color: COLORS.textMuted }}>/month</span></p>
              <p style={{ fontSize: 13, color: COLORS.textDim, marginTop: 4 }}>or $29.99/year (save 50%)</p>
            </div>
            <button style={{
              background: `linear-gradient(135deg, ${COLORS.premium}, #f97316)`,
              color: '#000', border: 'none', borderRadius: 14, padding: '14px 40px',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>Upgrade to Premium</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 36 }}>{mod.icon}</span>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700 }}>{mod.title}</h2>
                <p style={{ fontSize: 12, color: COLORS.textDim }}>{mod.duration} read</p>
              </div>
            </div>
            <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 24 }}>{mod.tagline}</p>

            {mod.content.sections.map((sec, i) => (
              <div key={i} className="fade-in" style={{ marginBottom: 28, animationDelay: `${i * 0.1}s` }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: COLORS.primaryLight }}>{sec.heading}</h3>
                {sec.text.split('\n\n').map((p, j) => (
                  <p key={j} style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.text, marginBottom: 12, whiteSpace: 'pre-wrap' }}>{p}</p>
                ))}
              </div>
            ))}

            {mod.content.exercise && (
              <div style={{
                background: COLORS.primary + '11', border: `1px solid ${COLORS.primary}33`,
                borderRadius: 14, padding: 20, marginBottom: 24,
              }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: COLORS.accent }}>🎯 Exercise: {mod.content.exercise.title}</h4>
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4 }}>❌ Don't do this:</p>
                  <p style={{ fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic' }}>{mod.content.exercise.bad}</p>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4 }}>💡 Hint:</p>
                  <p style={{ fontSize: 13, color: COLORS.textMuted }}>{mod.content.exercise.hint}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4 }}>✅ Try this instead:</p>
                  <p style={{ fontSize: 13, color: COLORS.accentGreen, lineHeight: 1.6 }}>{mod.content.exercise.good}</p>
                </div>
              </div>
            )}

            {!completed.includes(mod.id) ? (
              <button onClick={() => onMarkComplete(mod.id)} style={{
                width: '100%', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                color: '#fff', border: 'none', borderRadius: 14, padding: '16px',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}>✓ Mark Module Complete</button>
            ) : (
              <div style={{ textAlign: 'center', padding: 16, color: COLORS.accentGreen, fontWeight: 600, fontSize: 15 }}>✅ Module Completed!</div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ padding: 20, paddingBottom: 100 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Your Learning Path</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>
        {completed.length} of {MODULES.length} modules complete
      </p>
      <ProgressBar value={completed.length} max={MODULES.length} height={8} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {MODULES.map((mod, i) => {
          const done = completed.includes(mod.id)
          const locked = !mod.free && !isPremium
          return (
            <div key={mod.id} onClick={() => setActiveModule(i)} className="fade-in"
              style={{
                background: COLORS.card, borderRadius: 14, padding: 16,
                border: `1px solid ${done ? COLORS.accentGreen + '44' : COLORS.border}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                opacity: locked ? 0.7 : 1, animationDelay: `${i * 0.05}s`,
                transition: 'border-color 0.2s',
              }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center',
                background: done ? COLORS.accentGreen + '22' : COLORS.primary + '15', fontSize: 24, flexShrink: 0,
              }}>
                {done ? '✅' : mod.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: done ? COLORS.accentGreen : COLORS.text }}>{mod.title}</span>
                  {locked && <PremiumBadge />}
                </div>
                <p style={{ fontSize: 12, color: COLORS.textDim }}>{mod.tagline}</p>
              </div>
              <span style={{ fontSize: 12, color: COLORS.textDim, flexShrink: 0 }}>{mod.duration}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SCREEN: Prompt Library ────────────────────────────────
function PromptsScreen({ role, favorites, onToggleFav, isPremium }) {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [copied, setCopied] = useState(null)
  const [showFavsOnly, setShowFavsOnly] = useState(false)

  const filtered = useMemo(() => {
    return PROMPTS.filter(p => {
      if (showFavsOnly && !favorites.includes(p.id)) return false
      if (filterCat !== 'all' && p.category !== filterCat) return false
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.prompt.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => {
      // Show role-relevant prompts first
      const aRelevant = a.roles.includes(role) ? 0 : 1
      const bRelevant = b.roles.includes(role) ? 0 : 1
      return aRelevant - bRelevant
    })
  }, [search, filterCat, role, favorites, showFavsOnly])

  const copyPrompt = async (prompt, id) => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(id)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      setCopied(null)
    }
  }

  return (
    <div className="fade-in" style={{ padding: 20, paddingBottom: 100 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Prompt Library</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 16 }}>{filtered.length} prompts · Tailored for your role</p>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts..."
          style={{
            width: '100%', padding: '12px 16px 12px 40px', borderRadius: 12,
            background: COLORS.card, border: `1px solid ${COLORS.border}`,
            color: COLORS.text, fontSize: 14, outline: 'none',
          }} />
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
        <button onClick={() => { setFilterCat('all'); setShowFavsOnly(false) }}
          style={{
            padding: '6px 14px', borderRadius: 20, border: `1px solid ${filterCat === 'all' && !showFavsOnly ? COLORS.primary : COLORS.border}`,
            background: filterCat === 'all' && !showFavsOnly ? COLORS.primary + '22' : 'transparent',
            color: filterCat === 'all' && !showFavsOnly ? COLORS.primaryLight : COLORS.textMuted,
            fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}>All</button>
        <button onClick={() => setShowFavsOnly(!showFavsOnly)}
          style={{
            padding: '6px 14px', borderRadius: 20, border: `1px solid ${showFavsOnly ? COLORS.accentOrange : COLORS.border}`,
            background: showFavsOnly ? COLORS.accentOrange + '22' : 'transparent',
            color: showFavsOnly ? COLORS.accentOrange : COLORS.textMuted,
            fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}>⭐ Favorites</button>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => { setFilterCat(c.id); setShowFavsOnly(false) }}
            style={{
              padding: '6px 14px', borderRadius: 20, border: `1px solid ${filterCat === c.id ? COLORS.primary : COLORS.border}`,
              background: filterCat === c.id ? COLORS.primary + '22' : 'transparent',
              color: filterCat === c.id ? COLORS.primaryLight : COLORS.textMuted,
              fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}>{c.icon} {c.label}</button>
        ))}
      </div>

      {/* Prompt Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(p => {
          const locked = !p.free && !isPremium
          const isExpanded = expanded === p.id
          const isFav = favorites.includes(p.id)
          const isRelevant = p.roles.includes(role)
          return (
            <div key={p.id} style={{
              background: COLORS.card, borderRadius: 14, overflow: 'hidden',
              border: `1px solid ${isRelevant ? COLORS.primary + '33' : COLORS.border}`,
              opacity: locked ? 0.65 : 1,
            }}>
              <div onClick={() => !locked && setExpanded(isExpanded ? null : p.id)}
                style={{ padding: 16, cursor: locked ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{CATEGORIES.find(c => c.id === p.category)?.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{p.title}</span>
                    {locked && <PremiumBadge />}
                    {isRelevant && <span style={{ fontSize: 9, color: COLORS.primary, background: COLORS.primary + '22', padding: '1px 6px', borderRadius: 4 }}>For you</span>}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); onToggleFav(p.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 4 }}>
                  {isFav ? '⭐' : '☆'}
                </button>
              </div>
              {isExpanded && !locked && (
                <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${COLORS.border}` }}>
                  <pre style={{
                    background: COLORS.bg, borderRadius: 10, padding: 14, marginTop: 12,
                    fontSize: 13, lineHeight: 1.6, color: COLORS.textMuted,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit',
                  }}>{p.prompt}</pre>
                  <button onClick={() => copyPrompt(p.prompt, p.id)} style={{
                    marginTop: 10, width: '100%', padding: '10px',
                    background: copied === p.id ? COLORS.accentGreen + '22' : COLORS.primary + '15',
                    border: `1px solid ${copied === p.id ? COLORS.accentGreen : COLORS.primary}33`,
                    borderRadius: 10, color: copied === p.id ? COLORS.accentGreen : COLORS.primaryLight,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>{copied === p.id ? '✓ Copied to clipboard!' : '📋 Copy Prompt'}</button>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: COLORS.textDim }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>🔍</p>
            <p>No prompts match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SCREEN: Dashboard ─────────────────────────────────────
function DashboardScreen({ role, score, completed, streak }) {
  const roleName = ROLES.find(r => r.id === role)?.label || 'Professional'
  const pct = Math.round((completed.length / MODULES.length) * 100)
  const freeComplete = completed.filter(id => MODULES.find(m => m.id === id)?.free).length
  const premiumComplete = completed.length - freeComplete

  return (
    <div className="fade-in" style={{ padding: 20, paddingBottom: 100 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Your Progress</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>Learning path for {roleName}</p>

      {/* Score Circle */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Readiness Score</p>
          <p style={{ fontSize: 36, fontWeight: 800, color: COLORS.primary }}>{score}</p>
          <p style={{ fontSize: 11, color: COLORS.textDim }}>/ 100</p>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Modules Done</p>
          <p style={{ fontSize: 36, fontWeight: 800, color: COLORS.accentGreen }}>{completed.length}</p>
          <p style={{ fontSize: 11, color: COLORS.textDim }}>/ {MODULES.length}</p>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Day Streak</p>
          <p style={{ fontSize: 36, fontWeight: 800, color: COLORS.accentOrange }}>{streak}</p>
          <p style={{ fontSize: 11, color: COLORS.textDim }}>🔥 days</p>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Overall Progress</span>
          <span style={{ fontSize: 13, color: COLORS.primary, fontWeight: 600 }}>{pct}%</span>
        </div>
        <ProgressBar value={completed.length} max={MODULES.length} height={10} />
      </Card>

      {/* Module Checklist */}
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Module Checklist</h3>
        {MODULES.map(mod => {
          const done = completed.includes(mod.id)
          return (
            <div key={mod.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
              borderBottom: `1px solid ${COLORS.border}22`,
            }}>
              <span style={{ fontSize: 18 }}>{done ? '✅' : '⬜'}</span>
              <span style={{ fontSize: 13, color: done ? COLORS.accentGreen : COLORS.textMuted, flex: 1 }}>{mod.title}</span>
              {!mod.free && <PremiumBadge />}
            </div>
          )
        })}
      </Card>

      {/* Next Recommended */}
      {completed.length < MODULES.length && (() => {
        const next = MODULES.find(m => !completed.includes(m.id))
        return next ? (
          <Card style={{ background: COLORS.primary + '11', border: `1px solid ${COLORS.primary}33` }}>
            <p style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Up next</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28 }}>{next.icon}</span>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{next.title}</p>
                <p style={{ fontSize: 12, color: COLORS.textMuted }}>{next.tagline}</p>
              </div>
            </div>
          </Card>
        ) : null
      })()}

      {completed.length === MODULES.length && (
        <Card style={{ background: COLORS.accentGreen + '11', border: `1px solid ${COLORS.accentGreen}33`, textAlign: 'center' }}>
          <span style={{ fontSize: 48 }}>🎉</span>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 8, color: COLORS.accentGreen }}>All Modules Complete!</h3>
          <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 8 }}>You've finished your AI onboarding. Now it's about daily practice — use your prompt library and keep building.</p>
        </Card>
      )}
    </div>
  )
}

// ─── SCREEN: Settings ──────────────────────────────────────
function SettingsScreen({ role, onChangeRole, isPremium, onTogglePremium, onReset }) {
  const roleName = ROLES.find(r => r.id === role)?.label || 'Not set'
  return (
    <div className="fade-in" style={{ padding: 20, paddingBottom: 100 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Settings</h2>

      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, color: COLORS.textDim }}>Your Role</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{roleName}</p>
          </div>
          <button onClick={onChangeRole} style={{
            background: COLORS.primary + '22', border: `1px solid ${COLORS.primary}33`,
            borderRadius: 10, padding: '8px 16px', color: COLORS.primaryLight,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Change</button>
        </div>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, color: COLORS.textDim }}>Subscription</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{isPremium ? '⭐ Premium' : 'Free Plan'}</p>
          </div>
          <button onClick={onTogglePremium} style={{
            background: isPremium ? COLORS.card : `linear-gradient(135deg, ${COLORS.premium}, #f97316)`,
            border: isPremium ? `1px solid ${COLORS.border}` : 'none',
            borderRadius: 10, padding: '8px 16px',
            color: isPremium ? COLORS.textMuted : '#000',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>{isPremium ? 'Manage' : 'Upgrade'}</button>
        </div>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>About AI Kickstart</h3>
        <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>Version 1.0.0</p>
        <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, marginTop: 8 }}>Built to help professionals go from AI-curious to AI-fluent. Not a course — your personal AI setup guide.</p>
      </Card>

      <Card style={{ borderColor: '#ef444444' }}>
        <button onClick={onReset} style={{
          background: 'none', border: 'none', color: '#ef4444',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', textAlign: 'left',
        }}>Reset All Progress</button>
        <p style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4 }}>This will clear your role, progress, and favorites.</p>
      </Card>
    </div>
  )
}

// ─── MAIN APP ──────────────────────────────────────────────
export default function App() {
  const [onboarded, setOnboarded] = useLocalStorage('aik_onboarded', false)
  const [role, setRole] = useLocalStorage('aik_role', null)
  const [score, setScore] = useLocalStorage('aik_score', 0)
  const [completed, setCompleted] = useLocalStorage('aik_completed', [])
  const [favorites, setFavorites] = useLocalStorage('aik_favorites', [])
  const [isPremium, setIsPremium] = useLocalStorage('aik_premium', false)
  const [streak, setStreak] = useLocalStorage('aik_streak', 1)
  const [lastVisit, setLastVisit] = useLocalStorage('aik_lastVisit', null)
  const [screen, setScreen] = useState('learn')

  // Streak tracking
  useEffect(() => {
    const today = new Date().toDateString()
    if (lastVisit) {
      const last = new Date(lastVisit)
      const diff = Math.floor((new Date(today) - last) / 86400000)
      if (diff === 1) setStreak(s => s + 1)
      else if (diff > 1) setStreak(1)
    }
    setLastVisit(today)
  }, [])

  const handleOnboardComplete = (selectedRole, readinessScore) => {
    setRole(selectedRole)
    setScore(readinessScore)
    setOnboarded(true)
  }

  const handleMarkComplete = (moduleId) => {
    if (!completed.includes(moduleId)) {
      setCompleted([...completed, moduleId])
    }
  }

  const handleToggleFav = (promptId) => {
    setFavorites(prev => prev.includes(promptId) ? prev.filter(f => f !== promptId) : [...prev, promptId])
  }

  const handleReset = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      setOnboarded(false); setRole(null); setScore(0)
      setCompleted([]); setFavorites([]); setStreak(1)
      setScreen('learn')
    }
  }

  const handleChangeRole = () => {
    setOnboarded(false)
    setScreen('learn')
  }

  if (!onboarded) return (
    <>
      <StyleInjector />
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <OnboardingScreen onComplete={handleOnboardComplete} />
      </div>
    </>
  )

  const screens = {
    learn: <LearningScreen completed={completed} onMarkComplete={handleMarkComplete} isPremium={isPremium} />,
    prompts: <PromptsScreen role={role} favorites={favorites} onToggleFav={handleToggleFav} isPremium={isPremium} />,
    dashboard: <DashboardScreen role={role} score={score} completed={completed} streak={streak} />,
    settings: <SettingsScreen role={role} onChangeRole={handleChangeRole} isPremium={isPremium} onTogglePremium={() => setIsPremium(!isPremium)} onReset={handleReset} />,
  }

  return (
    <>
      <StyleInjector />
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: `1px solid ${COLORS.border}`, position: 'sticky', top: 0, background: COLORS.bg, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🚀</span>
            <span style={{ fontSize: 17, fontWeight: 700, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Kickstart</span>
          </div>
          {isPremium && <span style={{ fontSize: 10, color: COLORS.premium, fontWeight: 700, background: COLORS.premium + '22', padding: '3px 8px', borderRadius: 6 }}>⭐ PREMIUM</span>}
        </div>

        {/* Screen Content */}
        <div style={{ paddingBottom: 70 }}>
          {screens[screen]}
        </div>

        {/* Bottom Nav */}
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480, background: COLORS.card,
          borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-around',
          paddingBottom: 'env(safe-area-inset-bottom, 8px)', paddingTop: 4, zIndex: 20,
        }}>
          <IconBtn icon="📚" label="Learn" active={screen === 'learn'} onClick={() => setScreen('learn')} />
          <IconBtn icon="💬" label="Prompts" active={screen === 'prompts'} onClick={() => setScreen('prompts')}
            badge={favorites.length} />
          <IconBtn icon="📊" label="Progress" active={screen === 'dashboard'} onClick={() => setScreen('dashboard')} />
          <IconBtn icon="⚙️" label="Settings" active={screen === 'settings'} onClick={() => setScreen('settings')} />
        </div>
      </div>
    </>
  )
}
