---
name: scroll-driven-handoff
description: >-
  Implements scroll-driven sticky sections with step transitions and content
  handoff (fade + simultaneous rise). Use for scrollytelling, coordinator
  sections, sticky panels, scroll-linked opacity, or Cofounder-style reveal
  animations.
---

# Scroll-Driven Handoff

## Pattern (Coordinator-style)

```
scrollContainer (tracks scroll offset)
  section (tall min-height for runway)
    stickyHead (fades during handoff)
    stickyPanel (sticky, overflow visible on desktop)
      panelRow (step content — fades + blurs)
      cofounderWrap (absolute bottom, translateY rise)
```

## Scroll math

```javascript
const scrolled = Math.max(-container.getBoundingClientRect().top, 0);
const stepProgress = Math.min(scrolled / STEPS_DISTANCE, 1);
const handoff = Math.min(Math.max((scrolled - HANDOFF_START) / HANDOFF_LENGTH, 0), 1);
const step = Math.min(4, Math.floor(5 * stepProgress));
```

## Handoff rules

1. **Same progress drives both**: `contentOpacity = 1 - handoff` AND `translateY((1 - handoff) * 100%)`
2. **Never use `position: fixed`** on handoff elements — causes duplicates and left-corner jumps
3. **panelRow → absolute only during handoff**, constrained to centered max-width column:
   ```css
   .handoff .panelRow {
     position: absolute;
     top: 0; left: 50%;
     max-width: 1080px;
     transform: translateX(-50%);
   }
   ```
4. **Expand only the rising card**, not the whole sticky panel — prevents step content layout break
5. **Increase sticky min-height** during handoff if card is taller than panel (e.g. 800px card in 660px panel)
6. **Hide panelRow** at `handoff > 0.92` with `visibility: hidden`

## Full-width card breakout

Keep panel at `max-width: 1080px`. Expand cofounder wrap only:

```css
.handoff .cofounderWrap {
  left: 50%;
  width: calc(100vw - 64px); /* match section padding */
}
```

```javascript
transform: `translateX(-50%) translateY(${(1 - handoff) * 100}%)`
```

## Step content transitions

- Debounce step changes with 300ms fade (`copyHidden` / `copyVisible`)
- Progress bars reflect `displayStep`, not `activeStep` during fade
