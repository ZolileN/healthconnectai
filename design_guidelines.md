# Design Guidelines: Symptom Checker & Telehealth Platform

## Design Approach

**Selected Approach**: Design System - Material Design Foundation
**Rationale**: Healthcare applications require trust, clarity, and accessibility. Material Design provides content-rich patterns with strong visual feedback, ideal for medical information density and user reassurance.

## Core Design Principles

1. **Medical Trust**: Professional, clean aesthetic that conveys credibility and safety
2. **Information Clarity**: Clear hierarchy for complex medical data and assessments
3. **Mobile-First**: Accessible on all devices, optimized for mobile healthcare access
4. **Reassuring UX**: Calm, supportive interface that reduces user anxiety

---

## Typography System

**Font Families**:
- Primary: Inter (via Google Fonts) - for UI elements, forms, body text
- Accent: DM Sans (via Google Fonts) - for headings, emphasis

**Hierarchy**:
- Hero Headings: 48px (mobile: 32px), weight 700
- Section Headings: 32px (mobile: 24px), weight 600
- Subsection Headings: 24px (mobile: 20px), weight 600
- Body Text: 16px, weight 400, line-height 1.6
- Small Text/Labels: 14px, weight 500
- Captions/Metadata: 12px, weight 400

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16, 20** for consistency
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-20
- Element gaps: gap-4 to gap-8
- Container margins: mx-4 (mobile), mx-auto with max-w-7xl (desktop)

**Grid System**:
- Mobile: Single column, full-width components
- Tablet (md:): 2-column layouts for cards/features
- Desktop (lg:): 3-column for feature grids, 2-column for forms

**Container Strategy**:
- Full-width sections with inner max-w-7xl
- Forms and focused content: max-w-2xl
- Reading content: max-w-prose

---

## Component Library

### Navigation
**Primary Header**:
- Sticky top navigation with backdrop blur
- Logo left, main nav center, CTA + user profile right
- Mobile: Hamburger menu with slide-out drawer
- Height: h-16, padding px-4

### Hero Section
**Image Treatment**: Large hero image showing diverse patients using telehealth (video call on phone/tablet)
- Full-width container with overlay gradient for text readability
- Hero content: Centered vertical alignment with blurred button backgrounds
- Height: min-h-[600px] on desktop, min-h-[500px] mobile
- CTA buttons with backdrop-blur-md for visibility over images

### Symptom Checker Interface
**Body Map Component**:
- Interactive SVG body diagram (front/back views, toggleable)
- Click zones highlight affected areas
- Selected areas show with subtle indicators

**Input Forms**:
- Large, accessible form fields (h-12 minimum)
- Clear labels above inputs, helper text below
- Multi-select symptom chips/tags with checkboxes
- Severity sliders with clear markers (1-10 scale)
- "Add Another Symptom" functionality with expandable sections

**Assessment Results**:
- Card-based layout for each potential condition
- Probability indicators using progress bars
- Expandable sections for condition details
- Clear CTA for "Next Steps" (colored buttons with backdrop blur if over images)

### Dashboard Components
**Patient Profile Card**:
- Avatar, name, basic info in compact header
- Recent assessments timeline with icons
- Quick action buttons (New Assessment, View History, Book Consultation)

**History Timeline**:
- Chronological list with date separators
- Each entry shows: symptoms, assessment summary, actions taken
- Expandable for full details

**Consultation Booking**:
- Calendar interface with available slots
- Doctor cards with photo, specialty, rating, availability
- Time slot selection with confirmation modal

### Cards & Content Blocks
**Feature Cards** (3-column grid on desktop):
- Icon at top (from Heroicons library)
- Heading (20px, weight 600)
- Description text (16px)
- Minimum height for visual consistency
- Padding: p-6, rounded corners

**Educational Content Cards**:
- Thumbnail image (if available, otherwise medical icon)
- Category tag
- Article title and brief excerpt
- "Read More" link

### Forms & Inputs
**Text Inputs**:
- Height: h-12
- Rounded corners, clear borders
- Focus states with outline
- Placeholder text in muted styling

**Buttons**:
- Primary: Large (h-12), bold weight, rounded
- Secondary: Outlined style with hover fill
- Text buttons for tertiary actions
- Icon buttons: h-10 w-10, rounded-full

**Radio/Checkbox Groups**:
- Large touch targets (min 44px height)
- Clear labels with ample spacing (gap-3)

### Footer
**Comprehensive Footer**:
- 4-column layout (desktop), stacked (mobile)
- Columns: Quick Links, Resources, Contact, Legal
- Newsletter signup form with email input + submit
- Social media icons (from Heroicons)
- Trust indicators: certifications, partnerships
- Padding: py-12

---

## Images

**Hero Section**: 
Large, high-quality image showing a diverse patient having a positive telehealth consultation on their phone or tablet, with a friendly healthcare provider visible on screen. Should convey trust, accessibility, and modern healthcare. Image spans full width with subtle gradient overlay for text readability.

**Feature Sections**:
- Symptom checker in action: screenshot of body map interface
- Consultation interface: person using video call for doctor consultation
- Dashboard preview: clean UI showing patient history

**Educational Content**:
- Condition-specific illustrations or photos
- Health tips with supportive imagery

**About/Trust Section**:
- Medical professionals (diverse team)
- Certifications and partner logos

---

## Accessibility Considerations

- Minimum touch targets: 44px × 44px throughout
- ARIA labels on all interactive elements
- Keyboard navigation support for all forms
- High contrast text (WCAG AA minimum)
- Form validation with clear error messages
- Loading states for async operations
- Focus indicators on all interactive elements

---

## Animations

**Minimal, purposeful animations only**:
- Smooth page transitions (fade-in)
- Button hover states (subtle scale or brightness change)
- Form field focus (border highlight)
- Modal/drawer slide-in animations
- **No**: Parallax, continuous animations, decorative motion

---

## Page-Specific Layouts

### Homepage
1. Hero with CTA
2. How It Works (3-step process, 3-column grid)
3. Key Features (4 feature cards, 2×2 grid)
4. Trust Indicators (partnerships, stats)
5. Testimonials (2-column)
6. Final CTA section
7. Comprehensive footer

### Symptom Checker Page
- Progress indicator at top
- Step-by-step wizard interface
- Body map + symptom input side-by-side (desktop)
- Results page with condition cards + recommended actions

### Dashboard
- Sidebar navigation (desktop) / bottom nav (mobile)
- Main content area with recent activity feed
- Quick action cards at top
- Medical history timeline

### Consultation Booking
- Doctor directory (card grid)
- Calendar + time slot picker
- Confirmation modal with appointment details

This professional, trust-focused design creates an accessible, credible healthcare platform optimized for diverse users across devices.