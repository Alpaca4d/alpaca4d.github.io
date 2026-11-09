# A footbridge's natural modes: LinkedIn post

A footbridge 40 m long, a concrete deck on a steel box girder, and its first three natural modes from
Alpaca4d's Natural Vibration Analysis, each a still and a GIF of it swinging: up and down at 2.10 Hz,
sideways at 3.28 Hz, up and down in two arcs at 8.12 Hz. Here: `footbridge-mode-1.png` to `-3.png`,
their GIFs, and the canvas.

## What to attach

- **The post:** `footbridge-mode-1.gif`, the bridge bouncing.
- **A carousel instead:** `footbridge-mode-1.gif`, `footbridge-mode-2.gif`, `footbridge-mode-3.gif`,
  `grasshopper-definition.png`.
- **Alt text:** A footbridge on a steel box girder bouncing up and down in its first natural mode,
  coloured by how far each part moves.

## The post

Copy everything in the box.

```text
Will people walking make your footbridge bounce?

We walk at about two steps a second. Every step pushes the deck down a little.

If the bridge likes to swing at that pace, it bounces with us.

This one, 40 metres long, swings up and down 2.1 times a second. Right in the middle of our pace.

One slider makes the steel box deeper, and the number moves.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements: this bridge is 48. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #BridgeEngineering
```

About 85 words.

## Other openings

- "Two steps a second."
- "Why do some footbridges bounce?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Natural vibration in the docs: https://alpaca4d.github.io/docs/basics/analysis/natural-vibration.html
```

## The numbers, if someone asks

- **The bridge:** a single span of 40 m; a 200 mm concrete deck 3.5 m wide, as shells, on an S355
  steel box 1.6 m wide and 1.2 m deep (20 mm webs, 25 mm flanges), tied to it by rigid links;
  bearings under the box at both ends, one sliding; 110 t.
- **The modes:** 2.10 Hz up and down, 3.28 Hz sideways, 8.12 Hz up and down in two arcs.
- **Walking:** people step at 1.6 to 2.4 Hz, and sway sideways at half that.
- **Free:** 16 beams and 32 shells, 48 elements, inside the free limit of 50.
