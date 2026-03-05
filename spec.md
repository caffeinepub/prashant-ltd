# Prashant Ltd

## Current State
New project. No existing frontend or backend code.

## Requested Changes (Diff)

### Add
- Full landing page website for an AI assistant platform named "Prashant Ltd"
- Sticky navigation bar with logo, nav links (Features, How It Works, Pricing, About, FAQ, Contact), and Login/Sign Up buttons
- Hero section with tagline, subtitle, and CTA buttons (Get Started, Watch Demo)
- Features section: grid of platform features with icons and descriptions (e.g., AI-powered, fast, secure, integrations, analytics, customizable)
- How It Works section: numbered step-by-step guide (3-4 steps)
- Pricing section: three tiers (Free, Pro, Enterprise) with feature lists and CTA buttons
- Testimonials section: user review cards with avatar, name, role, and quote
- FAQ section: accordion-style frequently asked questions
- About section: company mission, values, and team description
- Contact section: contact form (name, email, message) and support details
- Footer: links, social media icons (Twitter, GitHub, LinkedIn), and copyright notice
- Contact form submission stored in backend (name, email, message, timestamp)

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Select no special Caffeine components (standard build)
2. Generate Motoko backend with a contact form submission endpoint (submitContact) and query to retrieve submissions
3. Build full single-page React frontend with all 10 sections
4. Wire contact form to backend actor
5. Apply dark theme with purple/blue gradient accents, fully responsive layout
6. Deploy
