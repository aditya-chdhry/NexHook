import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuditModal from '../components/AuditModal';
import useReveal from '../components/useReveal';
import './BlogPage.css';

export const BLOGS_DATA = [
  {
    id: 'why-90-percent-small-businesses-fail-digital-marketing',
    tag: 'Marketing',
    title: 'Why 90% of Small Businesses Fail at Digital Marketing (And How to Fix It)',
    excerpt: 'Most small businesses throw money at ads without a strategy. Here\'s a proven framework to get real ROI from your marketing spend — without burning cash.',
    date: 'Apr 28, 2026',
    readTime: '6 min read',
    image: '/images/blog1.png',
    author: 'Aditya Chaudhary',
    content: `
Digital marketing isn't optional anymore — it's the primary engine behind growth for businesses of all sizes. Yet, a staggering 90% of small businesses fail to see meaningful ROI from their digital efforts. The reason? They approach marketing without a structured strategy.

## The 3 Biggest Mistakes Small Businesses Make

### 1. Running Ads Without a Funnel
Most small businesses jump straight to running Facebook or Google ads, hoping traffic will magically convert into customers. But without a properly designed sales funnel — landing pages, lead magnets, follow-up sequences — you're essentially pouring water into a leaky bucket.

**The fix:** Before spending a single rupee on ads, build a conversion path. Create a dedicated landing page for each campaign. Include a clear value proposition, social proof (testimonials, case studies), and one clear CTA. Set up email follow-ups to nurture leads who aren't ready to buy immediately.

### 2. Ignoring SEO Completely
Paid ads deliver instant traffic, but they stop the moment you stop paying. SEO, on the other hand, compounds over time. A blog post you write today can bring you hundreds of organic visitors every month — for free — if optimised correctly.

**The fix:** Invest in at least 4–6 high-quality blog posts per month targeting long-tail keywords your potential customers are searching for. Use tools like Google Search Console, Ahrefs, or SEMrush to identify low-competition, high-intent keywords. Focus on answering real questions, not keyword stuffing.

### 3. No Analytics or Tracking
You can't improve what you don't measure. Many small businesses have Google Analytics installed but never actually look at the data. They don't know which channels drive conversions, which pages bounce, or what their customer acquisition cost is.

**The fix:** Set up Google Analytics 4 with proper conversion tracking. Create a weekly reporting dashboard (Google Looker Studio is free). Track three core metrics: cost per lead (CPL), conversion rate, and customer lifetime value (CLV).

## A Simple Marketing Framework That Works

Here's the framework we use at NexHook for every client engagement:

1. **Audit** — Analyse current digital presence, website speed, SEO health, and competitor landscape.
2. **Strategy** — Build a 90-day growth plan with specific KPIs and channel allocation.
3. **Execute** — Implement the strategy with weekly sprints and real-time performance tracking.
4. **Optimise** — Review data bi-weekly, A/B test creatives, and double down on what's working.

The businesses that succeed at digital marketing aren't the ones with the biggest budgets — they're the ones with the clearest strategies. Start with a plan, measure everything, and iterate fast.

## Ready to Stop Wasting Money?

If you're a small business owner struggling with marketing ROI, book a free 30-minute audit call with our team. We'll analyse your current setup, identify the biggest leaks, and give you a prioritised action plan — completely free, even if you don't work with us.
    `
  },
  {
    id: 'react-vs-nextjs-2025-which-one-choose-startup',
    tag: 'Development',
    title: 'React vs Next.js in 2025: Which One Should You Choose for Your Startup?',
    excerpt: 'We break down the real-world differences between React SPA and Next.js — performance, SEO, cost, and when each one makes sense for your business.',
    date: 'May 15, 2026',
    readTime: '8 min read',
    image: '/images/blog2.png',
    author: 'Kshitij Sahu',
    content: `
Choosing the right tech stack is one of the most critical decisions a startup founder faces. If you're building a web application in 2025, the debate often comes down to React (as a Single Page Application) versus Next.js (a full-stack React framework). Both are built on React, but they serve very different use cases.

## Understanding the Core Difference

**React SPA (Create React App / Vite):** Your entire application lives as a single HTML file. JavaScript renders everything on the client side. The server delivers a blank shell, and the browser does all the heavy lifting.

**Next.js:** A framework built on top of React that provides server-side rendering (SSR), static site generation (SSG), API routes, file-based routing, and much more out of the box.

## When to Choose React SPA

React SPA works best when:
- You're building internal dashboards or admin panels
- SEO is not a priority (B2B tools, authenticated apps)
- Your team is small and familiar with React but not SSR
- You want maximum flexibility with routing and state management

**Real example:** A CRM dashboard, a project management tool, or a SaaS admin panel. These are authenticated applications where search engines never need to index the content.

## When to Choose Next.js

Next.js is the better choice when:
- SEO matters (e-commerce, blogs, landing pages, marketing sites)
- You need fast initial page loads (critical for conversion rates)
- You want server-side API routes without maintaining a separate backend
- You're building a hybrid application with both static and dynamic pages

**Real example:** An e-commerce storefront, a SaaS marketing site, a content-heavy blog, or any product where Google indexing drives revenue.

## Performance Comparison

| Metric | React SPA | Next.js |
|--------|-----------|---------|
| First Contentful Paint | Slower (JS bundle must load first) | Faster (HTML pre-rendered) |
| SEO | Poor (requires workarounds) | Excellent (SSR/SSG built-in) |
| Time to Interactive | Depends on bundle size | Optimised with code splitting |
| Server Cost | Static hosting (cheap) | Requires Node.js server (moderate) |
| Developer Experience | Simple, flexible | Opinionated, powerful |

## The Cost Factor

React SPAs can be hosted on any static hosting service (Netlify, Vercel, GitHub Pages) for pennies. Next.js requires a Node.js environment for SSR features, which means slightly higher hosting costs. However, Vercel (the company behind Next.js) offers a generous free tier.

For startups watching every rupee, the hosting cost difference is marginal — usually ₹500–2000/month — and is easily justified by the SEO and performance benefits Next.js provides.

## Our Recommendation

At NexHook, we default to **Next.js** for most client projects. The SEO benefits, built-in performance optimisations, and the ability to deploy API routes alongside the frontend make it the strongest choice for businesses that need their web presence to drive revenue.

Choose React SPA only when you're building an internal tool or authenticated application where SEO is irrelevant.
    `
  },
  {
    id: 'psychology-behind-high-converting-landing-pages',
    tag: 'Design',
    title: 'The Psychology Behind High-Converting Landing Pages',
    excerpt: 'Colour theory, visual hierarchy, and micro-interactions — the design secrets that turn visitors into paying customers in under 5 seconds.',
    date: 'Apr 30, 2026',
    readTime: '5 min read',
    image: '/images/blog3.png',
    author: 'Devansh Awasthi',
    content: `
A landing page has exactly 3 seconds to convince a visitor to stay. In that brief window, your design needs to communicate trust, value, and clarity — all without the visitor reading a single word. This is where design psychology comes in.

## The 3-Second Rule

Research from the Nielsen Norman Group shows that users form an opinion about a website within 50 milliseconds. That's 0.05 seconds. The visual impression — colours, layout, typography — determines whether they stay or bounce.

### Visual Hierarchy: Guide the Eye

Every high-converting landing page follows a clear visual hierarchy:

1. **Hero headline** — The first thing the eye hits. Must communicate the core value proposition in under 8 words.
2. **Supporting subhead** — Expands on the headline. Addresses the visitor's primary pain point.
3. **Primary CTA** — Contrasting colour, above the fold, with action-oriented text ("Get Your Free Audit" beats "Submit").
4. **Social proof** — Logos, testimonials, or numbers that build immediate trust.

### Colour Theory That Converts

Colour isn't just aesthetic — it's psychological:
- **Blue** conveys trust and professionalism (used by banks, SaaS companies)
- **Orange/Red** creates urgency and draws attention to CTAs
- **Green** signals growth, health, and positive action
- **Dark backgrounds** feel premium and reduce visual noise

The highest-converting pages use a monochromatic palette with **one contrasting accent colour** for CTAs. If your page uses blue throughout, make your CTA orange. The contrast makes it impossible to miss.

### White Space: Less is More

Cramming every pixel with content is the single biggest design mistake businesses make. White space (negative space) isn't wasted space — it's breathing room that:
- Improves readability by 20%
- Increases focus on key elements
- Makes the design feel premium and trustworthy

Apple, Stripe, and Linear all use generous white space. Your landing page should too.

## Micro-Interactions That Build Trust

Small animations communicate that your product is polished and professional:
- **Button hover effects** — Subtle scale or colour shift tells users "this is clickable"
- **Loading states** — Spinner or skeleton screens during form submission reduce anxiety
- **Scroll-triggered reveals** — Elements fading in as you scroll creates a narrative flow
- **Form field focus states** — Highlighted borders confirm the field is active

These details take minutes to implement but dramatically improve perceived quality.

## The Landing Page Formula

Every landing page we build at NexHook follows this proven structure:

1. Hero with clear headline + CTA
2. Problem statement (empathise with the visitor)
3. Solution overview (your product/service)
4. Features/benefits with icons
5. Social proof (testimonials, logos, numbers)
6. FAQ section
7. Final CTA with urgency

This structure works because it mirrors the natural decision-making process: attention → problem awareness → solution → trust → action.
    `
  },
  {
    id: 'core-web-vitals-decoded-non-technical-guide',
    tag: 'SEO',
    title: 'Core Web Vitals Decoded: A Non-Technical Guide for Business Owners',
    excerpt: 'Google ranks fast sites higher. Learn what LCP, FID, and CLS actually mean — and how to fix them without touching a single line of code.',
    date: 'Apr 12, 2026',
    readTime: '7 min read',
    image: '/images/blog4.png',
    author: 'Arun Parashar',
    content: `
In 2021, Google officially made Core Web Vitals a ranking factor. Since then, website speed and user experience directly impact where your site appears in search results. Yet most business owners have no idea what these metrics are or how to improve them.

## What Are Core Web Vitals?

Core Web Vitals are three specific metrics Google uses to measure user experience:

### LCP — Largest Contentful Paint
**What it measures:** How long it takes for the main content (usually the hero image or heading) to load.
**Good score:** Under 2.5 seconds
**Bad score:** Over 4 seconds

**Why it matters:** If your homepage takes 5 seconds to load, 53% of mobile visitors will leave before they even see your content. That's potential revenue walking away.

### FID / INP — First Input Delay / Interaction to Next Paint
**What it measures:** How quickly your site responds when a user clicks a button or fills a form.
**Good score:** Under 100 milliseconds
**Bad score:** Over 300 milliseconds

**Why it matters:** If a user clicks "Add to Cart" and nothing happens for half a second, they assume the site is broken. Responsiveness builds trust.

### CLS — Cumulative Layout Shift
**What it measures:** How much the page layout shifts while loading (text jumping, images resizing, buttons moving).
**Good score:** Under 0.1
**Bad score:** Over 0.25

**Why it matters:** Layout shifts are infuriating. Imagine clicking "Buy Now" and the button moves at the last moment — you accidentally click an ad instead. That's CLS in action.

## How to Check Your Scores

You don't need to be technical to check your Core Web Vitals:

1. **Google PageSpeed Insights** (pagespeed.web.dev) — Enter your URL and get a detailed report
2. **Google Search Console** → Core Web Vitals report (shows issues across your entire site)
3. **Chrome DevTools** → Lighthouse tab (for page-by-page analysis)

## 5 Fixes You Can Make Without Code

### 1. Compress Your Images
Use tools like TinyPNG or Squoosh to reduce image file sizes by 60–80% without visible quality loss. Switch from PNG/JPEG to WebP or AVIF format.

### 2. Set Image Dimensions
Always specify width and height on images in your CMS. This prevents layout shifts (CLS) because the browser reserves space before the image loads.

### 3. Use a CDN
Services like Cloudflare (free tier available) cache your site globally. A visitor in Mumbai loads your site from a server in Mumbai instead of waiting for data from the US.

### 4. Remove Unused Plugins/Scripts
Every WordPress plugin, chat widget, and analytics script adds weight. Audit your site — if you're not actively using it, remove it.

### 5. Lazy Load Below-the-Fold Content
Don't load every image and video when the page first opens. Use lazy loading so content loads only when the user scrolls to it.

## The Business Impact

A 1-second improvement in page load time can increase conversions by 7% (Source: Portent). For an e-commerce site doing ₹10 lakh/month in revenue, that's ₹70,000 extra per month — just from being faster.

Google rewards fast, user-friendly sites with higher rankings. Higher rankings mean more organic traffic. More traffic means more customers. It's a compounding cycle.
    `
  },
  {
    id: 'how-we-grew-brand-0-to-50k-followers-90-days',
    tag: 'Social Media',
    title: 'How We Grew a Brand from 0 to 50K Followers in 90 Days',
    excerpt: 'A behind-the-scenes look at our exact strategy — content pillars, posting schedule, engagement hacks, and the one metric most people ignore.',
    date: 'Mar 25, 2026',
    readTime: '6 min read',
    image: '/images/blog5.png',
    author: 'Aditya Chaudhary',
    content: `
When a D2C skincare brand approached us with zero social media presence and a tight 90-day deadline, we knew generic "post 3 times a week" advice wouldn't cut it. Here's the exact playbook we used to grow their Instagram from 0 to 50,000 engaged followers.

## Phase 1: Foundation (Day 1–15)

### Define Content Pillars
We established 4 content pillars that balanced education, entertainment, and promotion:
1. **Skin science** — Ingredient breakdowns, myth-busting, dermatologist-backed tips
2. **Before/after transformations** — Real customer results with their permission
3. **Behind the scenes** — Manufacturing process, quality testing, team culture
4. **Trending hooks** — Trend-jacking relevant memes and audio with brand context

### Visual Identity
Before posting a single reel, we designed a comprehensive visual system:
- Consistent colour palette (soft pastels + one bold accent)
- Custom thumbnail templates for every content type
- Branded caption format with consistent emoji usage
- Bio optimised with keywords + clear CTA

### Profile Optimisation
- Username: Simple, searchable, no underscores
- Bio: Problem → Solution → CTA format
- Highlights: Organised as a mini-website (Reviews, Ingredients, FAQ, Shop)
- Link in bio: Custom Linktree with tracking

## Phase 2: Content Machine (Day 16–60)

### Posting Cadence
- **Reels:** 5 per week (primary growth driver)
- **Stories:** 8–10 per day (engagement and retention)
- **Carousels:** 2 per week (saves and shares)
- **Lives:** 1 per week (algorithm boost + community)

### The Hook Formula
Every reel opened with one of these proven hook structures:
- "Stop doing [common mistake]..."
- "Here's what [brand] doesn't tell you..."
- "POV: You finally found a [product] that..."
- "I tested [product] for 30 days — here's what happened"

### Engagement Strategy
We didn't just post and pray. Every day we spent 30 minutes:
- Responding to every comment within 60 minutes
- Engaging with 20 accounts in the same niche
- Participating in trending conversations via Stories
- DMing new followers with a personalised welcome

## Phase 3: Scale & Convert (Day 61–90)

### UGC (User-Generated Content)
We sent free products to 50 micro-influencers (1K–10K followers) with one simple ask: post an honest review reel. 32 of them posted, generating over 200K cumulative views.

### Paid Amplification
We took the top 5 organic reels (based on save rate, not just views) and put ₹15,000 behind each as paid promotions. Organic social proof + paid reach = explosive growth.

### The Metric Everyone Ignores: Save Rate
Likes are vanity. Comments are good. But **saves** are the strongest signal to Instagram's algorithm that your content is valuable. We optimised every piece of content for save-worthiness:
- Educational carousels that people reference later
- Before/after comparisons worth revisiting
- Ingredient checklists in carousel format

## The Results

| Metric | Day 0 | Day 90 |
|--------|-------|--------|
| Followers | 0 | 51,200 |
| Avg. Reel Views | — | 85,000 |
| Engagement Rate | — | 6.8% |
| Website Traffic from IG | 0 | 12,400/month |
| Revenue attributed to IG | ₹0 | ₹4.2 lakh/month |

## Key Takeaways

1. **Consistency beats perfection.** Posting 5 mediocre reels will outperform 1 "perfect" reel every time.
2. **Hooks are everything.** The first 1.5 seconds decide if someone watches or scrolls.
3. **Saves > Likes.** Optimise for value, not validation.
4. **Community first.** Engage genuinely. Respond to everyone. Build real relationships.
5. **Double down on winners.** Find your top-performing content and create 10 variations of it.
    `
  },
  {
    id: 'mastering-art-of-video-hook-stop-scrollers',
    tag: 'Video Editing',
    title: 'Mastering the Art of Video Hook: Stop Scrollers in 3 Seconds or Less',
    excerpt: 'Retention rates drop rapidly in the first few seconds. Learn our top video editing formulas, sound design tactics, and text animations to capture attention instantly.',
    date: 'Mar 10, 2026',
    readTime: '5 min read',
    image: '/images/blog6.png',
    author: 'Harsh Upadhyay',
    content: `
The average person scrolls through 91 metres of content on their phone every day. In that infinite scroll, your video has less than 3 seconds to prove it's worth watching. Miss that window, and your content — no matter how brilliant — dies in silence.

## Why the First 3 Seconds Matter More Than Everything Else

Instagram, TikTok, and YouTube Shorts all use the same core algorithm signal: **watch time percentage**. If 80% of viewers drop off in the first 3 seconds, the platform assumes your content isn't valuable and stops showing it to new audiences.

Conversely, if you can hold attention past the 3-second mark, completion rates typically jump to 60–80%, and the algorithm pushes your content to the Explore page.

## 5 Proven Hook Formulas

### 1. The Pattern Interrupt
Start with something unexpected — a loud sound effect, a jarring visual, or a statement that challenges common belief.

**Example:** Opening on a tight close-up of a product being smashed, then reverse-cutting to reveal the final product intact. The visual contrast forces the brain to pay attention.

### 2. The Question Hook
Ask a question that triggers curiosity. The viewer's brain can't help but seek the answer.

**Examples:**
- "Did you know 73% of your website visitors leave in under 3 seconds?"
- "What if I told you this ₹500 product outperforms this ₹5,000 one?"
- "Why are the biggest brands all doing THIS in 2025?"

### 3. The Before/After Tease
Show the "after" result first — the stunning final edit, the massive follower growth, the beautiful website. Then cut to "Let me show you how."

This works because the viewer already knows the payoff is coming. They stay to learn the process.

### 4. The Controversy Hook
Take a slightly polarising stance on a topic your audience cares about.

**Examples:**
- "Canva is killing design careers — and no one is talking about it."
- "Your website doesn't need an 'About Us' page. Here's why."
- "Running ads in 2025 is a waste of money for most small businesses."

### 5. The Speed Hook
Compress an impressive result into a fast-paced montage in the first 2 seconds. Motion, speed, and quick cuts signal "high value content" to the viewer.

## Sound Design: The Secret Weapon

80% of video content is consumed with sound on mobile. Audio hooks are equally important:

- **Boom/whoosh sounds** on text reveals create impact
- **Bass drops** at the hook point trigger a physical response
- **ASMR-style sounds** (satisfying clicks, typing, product unboxing) are scientifically proven to increase retention
- **Voiceover confidence** — speak as if you're sharing a secret. Lower, slower, more deliberate voice delivery hooks better than fast, high-pitched energy.

## Text Animation Techniques

Dynamic text that moves with your edit keeps eyes locked:

- **Kinetic typography** — Words flying in, scaling, rotating in sync with speech
- **Highlight/underline** — Key words get a coloured underline or background as they're spoken
- **Bounce effect** — Text that has slight bounce or elastic animation feels alive
- **Split reveals** — Text appearing word by word in sync with voiceover timing

## The Retention Graph Hack

After posting, check your retention graph (available on YouTube and Instagram). Look for the exact timestamp where the steepest drop-off occurs. That's your weakest point. In your next video, add a pattern interrupt at that exact timestamp — a sound effect, a visual change, or a new talking point.

Over time, this iterative process trains you to create content with near-perfect retention curves.

## Quick Reference: The 3-Second Checklist

Before publishing any video, verify:
- ☑ The first frame is visually striking (no boring intro)
- ☑ Text on screen within 0.5 seconds
- ☑ Sound/music hook in the first second
- ☑ The value proposition is clear by second 3
- ☑ No logos, intros, or filler before the hook
    `
  },
  {
    id: 'saas-launch-playbook-first-100-paid-customers',
    tag: 'SaaS',
    title: 'The SaaS Launch Playbook: From Code Complete to First 100 Paid Customers',
    excerpt: 'Building is only half the battle. Discover the distribution hacks, launch platforms, and quick feedback loops we use to scale SaaS products from day zero.',
    date: 'Mar 18, 2026',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    author: 'Aditya Chaudhary',
    content: `
You've built a SaaS product. The code works. The UI looks good. Now what? This is where most indie hackers and startup founders hit a wall. Building the product is only 30% of the battle — the other 70% is distribution, positioning, and finding your first paying customers.

## Pre-Launch: Building the Waiting List (Week 1–2)

### Create a Landing Page
Before you launch anywhere, you need a dedicated landing page that:
- Communicates the problem you solve in one sentence
- Shows a demo video or GIF (30 seconds max)
- Has a clear CTA: "Join the waitlist" or "Get early access"
- Includes a progress indicator ("247 people signed up")

### Start Collecting Emails Early
Use tools like ConvertKit or Waitlist.me to create a referral-based waitlist. When someone signs up, they get a unique referral link. The more people they refer, the higher they move on the list. This creates organic viral growth before you even launch.

### Warm Up Communities
Spend 2 weeks genuinely participating in communities where your target users hang out:
- Reddit (r/SaaS, r/startups, niche subreddits)
- Twitter/X (follow and engage with potential users)
- Discord communities
- LinkedIn groups
- Indie Hackers forum

Don't promote anything yet. Just build relationships and understand pain points.

## Launch Week: Maximum Impact (Week 3–4)

### Product Hunt Launch
Product Hunt is still the single best platform for SaaS launches. To maximise impact:
- Launch on a Tuesday or Wednesday (highest traffic days)
- Have 15–20 supporters ready to upvote and comment at launch
- Prepare a compelling tagline (under 60 characters)
- Create a 60-second demo video
- Respond to every comment within 30 minutes

### Hacker News / Show HN
Write a concise "Show HN" post that focuses on the technical story. HN readers love hearing about the tech stack, architecture decisions, and the problem-solving journey.

### Twitter/X Launch Thread
Write a launch thread that follows this structure:
1. The problem (relatable pain point)
2. Your solution (with screenshots)
3. The building journey (humanises the product)
4. Social proof (beta user testimonials)
5. CTA with link

### Email Your Waitlist
Send a sequence of 3 emails:
- **Day 0:** "We're live! Here's your exclusive early access."
- **Day 2:** "Here's what 50 early users are saying..."
- **Day 5:** "Launch pricing ends in 48 hours (50% off forever)"

## Post-Launch: Getting to 100 Paid Users (Week 5–12)

### The $1 Trial Strategy
Instead of a free plan, offer a $1/month trial for the first month. This filters out freebie seekers and brings in users who are genuinely interested. Even $1 creates a psychological commitment that free never does.

### Content Marketing Engine
Start a blog targeting "[problem your SaaS solves] + [alternative/tool]" keywords:
- "Best alternatives to [competitor]"
- "How to [solve problem] in 2025"
- "[Competitor] vs [Your Product]: Honest Comparison"

These posts capture high-intent search traffic — people actively looking for a solution.

### Feedback Loop
Send a personal email to every user who signs up. Ask:
1. What made you sign up?
2. What's the #1 feature you wish existed?
3. Would you recommend us? Why or why not?

These responses are gold. They tell you exactly what to build next and give you language for your marketing copy.

### Metrics That Matter

| Metric | Target (Month 1) | Target (Month 3) |
|--------|-------------------|-------------------|
| MRR | ₹10,000 | ₹50,000 |
| Trial-to-Paid Rate | 25%+ | 35%+ |
| Monthly Churn | <8% | <5% |
| NPS Score | 30+ | 50+ |

## The Compounding Effect

The first 100 customers are the hardest. But they're also the most valuable because they give you:
- Real testimonials and case studies
- Feature validation and product direction
- Word-of-mouth referrals
- Revenue to reinvest in growth

After 100 paying customers, growth typically accelerates because social proof, SEO, and referrals start compounding. The hardest part is the beginning.
    `
  },
  {
    id: 'figma-to-live-website-avoiding-handover-disasters',
    tag: 'UI/UX Design',
    title: 'Figma to Live Website: Avoiding the Common Handover Disasters',
    excerpt: 'Designers design, developers code. How to close the communication gap, prep design tokens, and verify responsiveness before launching your site.',
    date: 'May 29, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80',
    author: 'Devansh Awasthi',
    content: `
Every designer has experienced it: you spend weeks crafting a pixel-perfect Figma design, hand it off to development, and the live site looks... different. Spacing is off. Fonts are wrong. Colours don't match. Responsive breakpoints are guessed instead of designed. This handover gap costs companies thousands of hours annually.

## Why Handover Fails

The root cause isn't bad developers or bad designers — it's a **communication gap**. Designers think in visual systems. Developers think in components and logic. Without a shared language, misinterpretation is inevitable.

### Common Handover Mistakes

1. **No design tokens** — Colours specified as hex codes instead of named tokens
2. **Missing responsive states** — Only desktop mockups provided
3. **No interaction specs** — Hover states, transitions, and animations not documented
4. **Inconsistent spacing** — Padding and margins eyeballed instead of systematised
5. **Assets not exported** — Icons and images not prepared in the right formats

## The Design Token System

Design tokens are the bridge between design and code. They're named variables that represent every visual decision in your design:

### Colour Tokens
Instead of telling a developer "use #2459E7", create a token:
- \`--color-primary\` → #2459E7
- \`--color-primary-hover\` → #1E4DD4
- \`--color-surface\` → #0C0E1A
- \`--color-text-primary\` → #F0F4FF

### Spacing Tokens
Define a spacing scale and use it consistently:
- \`--space-xs\` → 4px
- \`--space-sm\` → 8px
- \`--space-md\` → 16px
- \`--space-lg\` → 24px
- \`--space-xl\` → 32px
- \`--space-2xl\` → 48px

### Typography Tokens
- \`--font-heading\` → 'Bricolage Grotesque', sans-serif
- \`--font-body\` → 'Inter', sans-serif
- \`--text-h1\` → 3.2rem / 800 weight / -0.04em tracking
- \`--text-body\` → 0.97rem / 400 weight / 1.78 line-height

## The Handover Checklist

Before sending any design to development, verify:

### 1. Component Library
Every UI element should be a reusable component in Figma:
- Buttons (primary, ghost, disabled states)
- Input fields (default, focus, error, disabled)
- Cards, modals, dropdowns
- Navigation variants (desktop, mobile, scrolled)

### 2. Responsive Breakpoints
Design at minimum 3 breakpoints:
- **Desktop:** 1440px (primary design)
- **Tablet:** 768px (layout shifts)
- **Mobile:** 375px (single-column stack)

Document exactly what happens at each breakpoint — which elements stack, which disappear, and how spacing changes.

### 3. Interaction Specifications
For every interactive element, document:
- **Hover state** — What changes on mouse hover?
- **Active/pressed state** — Visual feedback on click
- **Transition timing** — Duration and easing curve
- **Animation triggers** — On scroll? On click? On load?

### 4. Asset Export Guide
- Icons: SVG format, stroke-based (not filled), 24x24 viewBox
- Images: WebP format, specify exact dimensions
- Logos: SVG for web, PNG for social media

## Dev Inspect Mode

Figma's Dev Mode is a game-changer. Developers can:
- Click any element and see exact CSS properties
- Inspect spacing between elements visually
- Copy CSS code snippets directly
- View component variants and states

Always organise your Figma file with clean layers and meaningful naming. A developer shouldn't have to guess what "Group 47" means.

## Quality Assurance Process

After development is complete, run through this QA process:

1. **Pixel comparison** — Overlay the live site on the Figma design at each breakpoint
2. **Interaction audit** — Verify every hover, click, and transition matches specs
3. **Content review** — Real content often breaks layouts designed with placeholder text
4. **Cross-browser test** — Chrome, Safari, Firefox, Edge
5. **Accessibility check** — Colour contrast, focus states, keyboard navigation

The cost of fixing issues at this stage is 10x cheaper than fixing them after launch. Invest the time here.

## Closing Thoughts

The best design-dev teams don't just hand off files — they collaborate throughout the process. Weekly sync meetings, shared Figma access, and a culture of "show me, don't tell me" eliminate 90% of handover disasters.
    `
  },
];

export default function BlogPage() {
  useReveal();
  const [showAuditModal, setShowAuditModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="App">
      <Navbar onAuditClick={() => { console.log("BlogPage Navbar Clicked"); setShowAuditModal(true); }} />
      <div className="blog-page">
        {/* Hero */}
        <section className="blogpage-hero">
          <div className="eyebrow rev">Our Blog</div>
          <h1 className="sec-title rev">Insights, Strategies & <span>Resources</span></h1>
          <p className="sec-sub rev">
            Deep dives into digital marketing, development, design, and growth — written by the NexHook team. Real strategies, no fluff.
          </p>
        </section>

        {/* Blog Grid */}
        <section className="blogpage-grid-section">
          <div className="blogpage-grid">
            {BLOGS_DATA.map((blog, i) => (
              <Link to={`/blogs/${blog.id}`} className={`blogpage-card rev d${(i % 4) + 1}`} key={blog.id}>
                <div className="blogpage-card-cover">
                  <img src={blog.image} alt={blog.title} className="blogpage-card-img" />
                  <span className="blog-tag">{blog.tag}</span>
                </div>
                <div className="blogpage-card-body">
                  <h2 className="blogpage-card-title">{blog.title}</h2>
                  <p className="blogpage-card-excerpt">{blog.excerpt}</p>
                  <div className="blogpage-card-meta">
                    <span className="blogpage-card-author">By {blog.author}</span>
                    <span className="blog-dot">·</span>
                    <span>{blog.date}</span>
                    <span className="blog-dot">·</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <span className="blogpage-read-link">
                    Read Article
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="blogpage-cta rev">
          <h2>Want insights like these for your business?</h2>
          <p>Book a free 30-minute strategy call and get a personalised growth plan.</p>
          <button onClick={() => { console.log("BlogPage CTA Clicked"); setShowAuditModal(true); }} className="btn-prim" style={{ border: 'none', cursor: 'pointer' }}>
            Book Free Audit Call →
          </button>
        </section>

        {/* Footer */}
        <footer className="blogpage-footer">
          <p>© 2026 NexHook Services. All rights reserved.</p>
          <Link to="/">← Back to NexHook.in</Link>
        </footer>
      </div>
      <AuditModal isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} />
    </div>
  );
}

