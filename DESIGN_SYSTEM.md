# ApparelCast Design System

## 🎨 Professional Fashion Brand Aesthetic

A sophisticated, elegant design system for a modern fashion e-commerce store.

---

## Color Palette

### Primary - Charcoal & Slate
**Use for:** Main UI elements, text, backgrounds
```
50:  #f8fafc - Very light background
100: #f1f5f9 - Subtle backgrounds
600: #475569 - Primary buttons
700: #334155 - Hover states
900: #0f172a - Main text, headings
```

### Secondary - Warm Neutrals
**Use for:** Borders, secondary elements
```
100: #f5f5f4 - Light borders
300: #d6d3d1 - Dividers
600: #57534e - Secondary buttons
```

### Accent - Sophisticated Gold
**Use for:** Sale badges, premium features, highlights
```
500: #eab308 - Sale tags
600: #ca8a04 - Hover gold
```

### Success - Subtle Green
**Use for:** Success messages, in-stock indicators
```
500: #22c55e - Success states
600: #16a34a - Confirmed actions
```

---

## Typography

### Font Family
```css
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
Fallback: 'Helvetica Neue', Arial, sans-serif
```

### Font Sizes & Weights
```css
Headings: 
- H1: 2.5rem (40px), font-weight: 700, letter-spacing: -0.02em
- H2: 2rem (32px), font-weight: 700, letter-spacing: -0.01em
- H3: 1.5rem (24px), font-weight: 600

Body:
- Regular: 1rem (16px), font-weight: 400, line-height: 1.6
- Small: 0.875rem (14px)
- Tiny: 0.75rem (12px)
```

---

## Button Styles

### Primary Button
```css
Background: #334155 (primary-700)
Text: White
Hover: #1e293b (primary-800)
Padding: 12px 24px
Border-radius: 4px
Font-weight: 500
```

### Secondary Button
```css
Background: White
Text: #0f172a
Border: 1px solid #e2e8f0
Hover: #f8fafc background
```

### Sale/Accent Button
```css
Background: #eab308 (accent-500)
Text: #713f12 (accent-900)
Hover: #ca8a04
```

---

## Spacing

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

---

## Product Cards

### Style
- Clean white background
- Subtle shadow on hover
- No rounded corners (sharp, modern)
- Minimal padding
- High-quality images (no placeholders)

### Elements
- Product image (square aspect ratio)
- Category tag (small, uppercase, subtle)
- Product name (bold, clean)
- Price (prominent, no unnecessary styling)
- Sale badge (if applicable, small, corner placement)

---

## Icons

**Style:** Outline/stroke icons (not filled)
**Library:** Feather Icons (react-icons/fi)
**Size:** 20px default, 24px for important actions
**Color:** Match text color (#0f172a or lighter for subtle)

---

## Badges & Tags

### Sale Badge
```css
Background: #eab308
Text: #713f12
Size: 12px
Padding: 4px 8px
Border-radius: 2px
Font-weight: 600
```

### New Badge
```css
Background: #0f172a
Text: White
(Same size as sale badge)
```

### Category Tag
```css
Background: #f1f5f9
Text: #475569
Size: 11px
Padding: 2px 8px
Border-radius: 2px
Font-weight: 500
Text-transform: uppercase
Letter-spacing: 0.05em
```

---

## Design Principles

### 1. Minimalism
- Clean, uncluttered layouts
- Generous white space
- Focus on products, not decoration

### 2. Elegance
- Muted, sophisticated colors
- Professional typography
- Subtle animations

### 3. Clarity
- Clear hierarchy
- Readable text (16px minimum)
- Obvious CTAs

### 4. Consistency
- Same spacing throughout
- Consistent button styles
- Unified color usage

### 5. NO Emojis in UI
- ❌ No emojis in buttons
- ❌ No emojis in headings
- ❌ No decorative emojis
- ✅ Use icons instead (Feather Icons)

---

## Examples

### Homepage Hero
```
- Large, high-quality hero image
- Minimal overlay text
- Single strong CTA
- No emojis, no clutter
```

### Product Grid
```
- Clean white cards
- Subtle hover effects
- Minimal badges (only if on sale/new)
- Professional product photos
```

### Checkout
```
- Simple, step-by-step
- Clear form fields
- Obvious "Place Order" button
- Professional, trustworthy feel
```

---

## Comparison

### Before (Too Bright/Cartoonish):
- ❌ Bright teal/coral/orange
- ❌ Emojis everywhere
- ❌ Rounded everything
- ❌ Too playful/casual

### After (Professional/Elegant):
- ✅ Charcoal, slate, gold accents
- ✅ Clean icons (no emojis)
- ✅ Sharp, modern edges
- ✅ Sophisticated, trustworthy

---

## Brand Personality

**ApparelCast is:**
- Sophisticated but accessible
- Modern but timeless
- Professional but friendly
- High-quality but affordable

**Not:**
- Childish or playful
- Overly trendy
- Cheap-looking
- Cluttered

---

## Implementation Notes

- Updated `tailwind.config.js` with new color palette
- Updated `globals.css` with professional typography
- Remove emojis from all UI components
- Use Feather Icons instead
- Apply consistent spacing and sizing

---

**Your store now has a professional, luxury fashion brand aesthetic!** ✨

