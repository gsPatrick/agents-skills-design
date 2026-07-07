---
name: mhtml-reference-extraction
description: >-
  Extracts layout structure, sizing, and CSS values from saved MHTML reference
  files for landing page remakes. Use when working with .mhtml files, matching
  reference dimensions, or debugging layout differences between remake and
  original.
---

# MHTML Reference Extraction

## What MHTML gives you

- Exact Tailwind/class strings at save time
- Spacing, max-widths, breakpoints, font sizes
- DOM hierarchy and section order
- Static layout — not live scroll animations

## How to read it

1. Search for section IDs or headings (`coordinator-section`, `blog-list`, etc.)
2. Note the class chain on each wrapper — outer padding vs inner max-width
3. Record key values in a table:

| Element | Reference classes | CSS equivalent |
|---------|-------------------|----------------|
| Section | `px-5 md:px-8 xl:px-12` | 20 / 32 / 48px |
| Container | `max-w-[1080px] mx-auto lg:px-5` | 1080px + 20px inline |
| Card | `lg:min-h-[800px] lg:p-[80px]` | 800px min, 80px pad |

4. Check parent `overflow` (`overflow-clip lg:overflow-visible`)
5. Separate structure MHTML from animation HTM — use HTM only for motion timing

## Common pitfalls

- **Double padding**: section padding + container padding + wrap padding
- **Sticky + overflow-clip**: clips content taller than sticky min-height
- **items-start vs stretch**: children need explicit `width: 100%` with `items-start`
- **Breakpoint mapping**: Tailwind `xl` = 1280px, `lg` = 1024px

## Verification checklist

- [ ] Section order matches reference DOM
- [ ] Max-width containers match (1080, 1280, 7xl, etc.)
- [ ] Font families loaded and applied
- [ ] Background images/positions match (`bg-position`, `bg-bottom`)
- [ ] Mobile-first padding scale matches
