# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished React/Vite personal website with a cinematic Prisma-inspired main page, personal information sections, and a public message board ready for GitHub Pages deployment.

**Architecture:** Keep the app as a single-page static React site so GitHub Pages deployment stays simple. Use Supabase as the optional shared backend for messages, with local demo fallback when credentials are absent.

**Tech Stack:** Vite, React, TypeScript, Tailwind CSS, framer-motion, lucide-react, optional Supabase REST API.

---

### Task 1: Project Configuration

**Files:**
- Modify: `index.html`
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Create: `.env.example`

- [x] Load Google Fonts and set the page title.
- [x] Configure Tailwind content scanning, cream primary color, and Instrument Serif font family.
- [x] Replace template CSS with the requested black cinematic global styles and SVG noise utilities.
- [x] Add Supabase environment variable examples.

### Task 2: Landing Page and Message Board

**Files:**
- Create: `src/App.tsx`
- Replace: `src/App.css`

- [x] Create shared text animation components for pull-up words and multi-style segments.
- [x] Implement Hero, About, Features, personal information, and public message board sections.
- [x] Use framer-motion for entrances and scroll-linked text reveal.
- [x] Use lucide-react icons for CTA, feature checks, personal info, and message UI.
- [x] Implement message loading and posting through Supabase REST API when configured.
- [x] Keep localStorage fallback for local demo and unconfigured deployments.

### Task 3: Documentation and Prompt

**Files:**
- Modify: `README.md`
- Create: `docs/complete-prompt.md`

- [x] Document local development, GitHub Pages deployment, and Supabase setup.
- [x] Provide the complete reusable prompt requested by the user.

### Task 4: Verification

**Files:**
- No source changes expected unless verification finds issues.

- [ ] Run `npm run build` and fix TypeScript/build errors.
- [ ] Run `npm run lint` and fix lint errors.
- [ ] Start the Vite development server and provide the local URL.
