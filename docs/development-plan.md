# Development Plan: panjifirmansyah.com — Personal Landing Page

## Who Is This For

This document is a complete development brief for an AI builder (or human designer/developer) to create the personal landing page for Panji Firmansyah. It contains brand context, design direction, content structure, technical requirements, and interaction specifications. Build from this document — it is the single source of truth.

---

## 1. Brand Context

### Who Is Panji Firmansyah

Panji has a dual persona that defines his personal brand:

**Primary: GTM Marketing Consultant**
- Principal GTM Consultant helping B2B companies in Indonesia build systematic marketing engines
- Target audience: B2B founders/CEOs (<50 people, proven product, still sales-led)
- Pain point he solves: "My product is good but leads don't come consistently"
- Solo operator using AI infrastructure to deliver full marketing engines
- Philosophy: "Share the knowledge, sell the implementation"

**Secondary: Content Creator & Culinary Explorer**
- 100K+ combined followers (Instagram + TikTok)
- Known for "Masakin Stranger" format (approaches strangers, cooks for them)
- Energetic, warm, approachable, authentic personality
- "Happy branding" — positive, fun, never edgy or dark

**How They Relate:**
They don't merge but strengthen each other. The culinary personality makes Panji memorable and relatable. The marketing expertise makes him hireable. The intersection is unique and uncopyable: "marketing consultant who's also a food explorer."

### Brand Voice & Tone
- Conversational but substantive
- Direct and concise — every element earns its place
- Confident without arrogance
- Warm and approachable — not cold/corporate
- Indonesian casual mixed with English code-switching

### Brand Values
1. Transparency over mystique
2. Substance over style
3. Authenticity — personality is a moat
4. Outcome-oriented — everything connects to results

---

## 2. Page Purpose & Goals

### Purpose
Hero-dominant one-pager that positions Panji as a premium GTM consultant while showcasing his unique personality as a content creator. The page itself should demonstrate technical taste and craft.

### Goals (in priority order)
1. **Establish credibility** — visitor instantly understands Panji is a serious, proven professional
2. **Communicate positioning** — "I help B2B founders get consistent leads without relying on their network"
3. **Show personality** — warm, energetic, human — not another boring consultant page
4. **Drive action** — visitor reaches out, follows, or explores portfolio

### Target Visitors
- **Primary:** B2B founders/CEOs in Indonesia evaluating Panji as a potential consultant
- **Secondary:** Peers, collaborators, potential content partners discovering Panji online

---

## 3. Design Direction

### Aesthetic: Dark Elegance with Warm Soul

The overall feel should be **premium, modern, and warm** — like walking into an upscale restaurant with great lighting and a chef who greets you personally.

**Color Palette:**
- **Background:** Deep dark tones (#0a0a0f to #121218 range) — not pure black, add subtle warmth
- **Primary accent:** Warm gold/amber (#D4A853 to #F0C75E range) — premium, connects to culinary warmth
- **Text:** Off-white (#F5F2EB) for primary, muted (#8A8A8A) for secondary
- **Subtle accents:** Warm gradient overlays, never cold blues or greens alone
- **Important:** The dark theme should feel warm and inviting, not cold or techy

**Typography:**
- Use a premium sans-serif or serif for the headline (e.g., Inter, Satoshi, or a display serif like Playfair for contrast)
- Clean sans-serif for body text
- Large, confident headline sizing (48-72px desktop)
- Generous letter-spacing and line-height for breathing room

**Visual Texture:**
- Subtle grain/noise overlay on background for premium feel (not flat)
- Soft gradient meshes or light blobs for depth
- No harsh borders — use subtle shadows and opacity-based separation

### Interaction Design Principles

Based on current best practices (2025-2026 trends):
1. **Functional motion over flash** — every animation should enhance UX, not distract
2. **1-2 signature interactive moments** — quality over quantity
3. **Performance is a design principle** — fast load, smooth 60fps, no jank
4. **Mobile-first** — must be equally impressive on phone
5. **Show, don't tell** — the site's quality IS the portfolio piece

### Signature Interactive Element (Hero)

The hero section should have ONE memorable interactive element. Recommended approaches (choose what fits best during implementation):

**Option A: Cursor-reactive ambient light**
- Soft, warm gradient light that follows the cursor across the dark background
- Creates a feeling of "revealing" content as you explore
- On mobile: gentle autonomous animation (breathing/pulsing light)
- Subtle, premium, not distracting from content

**Option B: Kinetic typography**
- The headline text has subtle organic motion (letters shift slightly with parallax or cursor proximity)
- Individual characters respond to hover with micro-animations
- On mobile: text appears with elegant stagger animation on scroll/load

**Option C: Particle constellation**
- Sparse, warm-toned particles (gold dots) that drift slowly
- On cursor proximity, particles connect with subtle lines (representing "building connections/engines")
- On mobile: particles move autonomously in gentle patterns

**Important:** Whichever approach is chosen, it MUST:
- Not interfere with text readability
- Work smoothly on mobile
- Feel warm and organic, not cold/techy
- Load fast (no heavy libraries if possible)
- Respect `prefers-reduced-motion`

---

## 4. Page Structure & Content

### Section 1: Hero (80% of viewport impact)

**Layout:**
- Full viewport height (100vh)
- Content vertically centered
- Photo on one side, text on the other (or overlapping with tasteful composition)
- Dark background with the chosen interactive element

**Content:**
```
[Photo: Panji's headshot/portrait — professional but warm, not stiff corporate]

PANJI FIRMANSYAH

I help B2B founders get consistent leads
without relying on their network.

GTM Consultant · Content Creator · 100K+ Followers

[CTA Button: "Let's Talk" → links to contact/WhatsApp/email]
```

**Photo treatment:**
- Professional but approachable photo (not stiff studio shot if possible)
- Can have subtle treatment: slight duotone, warm color grade, or soft mask/blend into background
- Should feel integrated into the design, not a separate element floating

**Scroll indicator:**
- Subtle animated arrow or line at the bottom indicating there's more content below
- Fade in after 2-3 seconds

### Section 2: Credibility Strip (brief, impactful)

**Layout:**
- Appears on scroll, not overwhelming
- Clean grid or horizontal layout
- Animated on scroll-in (stagger reveal)

**Content — 3 columns or horizontal blocks:**

```
Column 1: RESULTS
- [Specific metric, e.g., "Xk+ leads generated for clients"]
- [Specific metric, e.g., "X companies scaled from founder-led to systematic marketing"]

Column 2: CLIENTS
- [Client logos or company names — 3-5 most recognizable]
- Text: "Trusted by B2B companies across Indonesia"

Column 3: CREATOR
- "100K+ followers"
- "Known for Masakin Stranger"
- [Instagram/TikTok icon links]
```

**Design notes:**
- This section should feel like a brief "proof layer" — not a full portfolio
- Use warm gold accent for key numbers/metrics
- Keep it to ONE screen height max
- Subtle background shift (slightly lighter/darker than hero) to create visual separation

### Section 3: Footer / Contact

**Layout:**
- Minimal, clean
- Warm accent color for CTA

**Content:**
```
Ready to build your marketing engine?

[CTA Button: "Get in Touch" → email/WhatsApp/calendly]

---

[Social links row: LinkedIn · Instagram · TikTok · Portfolio]

© 2026 Panji Firmansyah
```

---

## 5. Responsive Behavior

### Desktop (>1024px)
- Full interactive experience
- Photo and text side-by-side in hero
- Credibility in 3-column grid
- All cursor-based interactions active

### Tablet (768px - 1024px)
- Photo above text (stacked) or slightly offset
- Credibility in 2-column grid
- Reduced interactive complexity

### Mobile (<768px)
- Photo at top, text below (stacked, centered)
- Credibility in single column (stacked cards)
- Touch-friendly: larger tap targets, no hover-dependent content
- Interactive element switches to autonomous animation (no cursor)
- Hero text scales down proportionally
- CTA button full-width

### Very Small (<400px)
- Further text size reduction
- Tighter spacing
- Social links wrap if needed

---

## 6. Technical Requirements

### Stack
- **Framework:** Use whatever produces the best result — Next.js, Astro, or even vanilla HTML/CSS/JS
- **Styling:** Tailwind CSS or CSS Modules — whichever enables the best design fidelity
- **Animation:** CSS animations for simple transitions, GSAP or Framer Motion for complex interactions (if framework supports it)
- **Deployment:** Static export, deployable to Vercel

### Performance Targets
- Lighthouse Performance: 90+
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- No layout shift (CLS: 0)
- Total page weight: <500KB (excluding photo)

### Accessibility
- `prefers-reduced-motion`: disable all animations, show static state
- All interactive elements keyboard-navigable
- WCAG 2.1 AA contrast ratios for all text
- Semantic HTML (proper heading hierarchy, landmarks, alt text)
- Screen reader friendly

### SEO & Meta
- Page title: "Panji Firmansyah — GTM Consultant & Creator"
- Meta description: "I help B2B founders get consistent leads without relying on their network. GTM Consultant, Content Creator, 100K+ followers."
- Open Graph tags (title, description, image)
- Twitter card meta tags
- Canonical URL: https://panjifirmansyah.com
- Language: en (content will be English with Indonesian mixed in)

---

## 7. Assets Needed

### From Panji (to be provided):
- [ ] Headshot/portrait photo (high-res, min 800x800px)
- [ ] Client logos (SVG or high-res PNG, transparent background)
- [ ] Specific metrics/results numbers for credibility section
- [ ] Social media profile URLs (LinkedIn, Instagram, TikTok)
- [ ] Contact method preference (email, WhatsApp, Calendly link)

### Generated during development:
- [ ] Favicon (derived from design)
- [ ] OG image (1200x630px preview image for social sharing)
- [ ] Any SVG illustrations or icons needed

---

## 8. Content Placeholders

Use these placeholder values during development. Panji will replace with real content:

```
Name: PANJI FIRMANSYAH
Tagline: I help B2B founders get consistent leads without relying on their network.
Role line: GTM Consultant · Content Creator · 100K+ Followers
CTA primary: Let's Talk
CTA secondary: Get in Touch

Metric 1: [X]k+ Leads Generated
Metric 2: [X] Companies Scaled
Metric 3: 100K+ Followers

Clients: [Company A] · [Company B] · [Company C] · [Company D]
Client label: Trusted by B2B companies across Indonesia

Creator tagline: Known for "Masakin Stranger"

Social links (placeholder URLs):
- LinkedIn: #
- Instagram: #
- TikTok: #
- Portfolio: https://portfolio.panjifirmansyah.com

Contact: hello@panjifirmansyah.com (placeholder)
```

---

## 9. Quality Checklist

Before considering the page complete, verify:

- [ ] First impression test: Does someone understand who Panji is within 3 seconds?
- [ ] Value prop is clear and pain-point driven
- [ ] Photo is well-integrated, not an afterthought
- [ ] Interactive element is smooth (60fps, no jank)
- [ ] Mobile experience is equally impressive (not a degraded desktop)
- [ ] Credibility section builds trust without overwhelming
- [ ] CTA is prominent and clear
- [ ] Dark theme feels warm, not cold
- [ ] Gold accent is used strategically, not everywhere
- [ ] Page loads fast (<2s on 4G)
- [ ] All social links work
- [ ] Accessibility: keyboard nav, screen reader, reduced motion
- [ ] Looks great on Chrome, Safari, Firefox
- [ ] No console errors
- [ ] SEO meta tags are set

---

## 10. Reference & Inspiration (for the builder)

Study these for quality benchmarks (not to copy, but to understand the bar):

- **Brittany Chiang** — clean, dark-mode, minimal developer portfolio. Gold standard for readability + personality balance.
- **Lusion** — premium interactive feel, organic motion, alive-feeling transitions.
- **Linear.app** — dark theme done right. Warm gradients, subtle motion, premium typography.
- **Rauno.me** — developer personal site with excellent minimalism and attention to craft.

The goal: Panji's site should feel like it belongs in the same league as these — but with its own warm, Indonesian, marketer-meets-creator identity.
