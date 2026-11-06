# Beam Grid: LinkedIn post

A 20 m square grid of steel beams on four pinned supports, every element sized on its own by the
Section Optimiser, as a slider walks the supports from the corners to the centre. The folder holds
the sized grid, a colour for each section (`beam-grid-sections.png`), the definition beside the grid
(`beam-grid-in-grasshopper.png`), the canvas (`grasshopper-definition.png`) and a displacement
legend (`beam-grid-displacement.png`).

## What to attach

- **The post:** `beam-grid-sections.png`, the grid from above at an angle, a colour for each
  section.
- **A carousel instead:** `beam-grid-sections.png`, then `beam-grid-in-grasshopper.png`.
- **Do not attach** `beam-grid-displacement.png`: it is a legend alone, and it reads up to
  15 221 mm, which cannot be right.
- **Alt text:** A square grid of steel beams sized element by element by the Section Optimiser, a
  colour for each section, the deep beams gathered in the middle and round four points, the rest
  slender.

## The post

Copy everything in the box.

```text
Where does the steel go in a grid of beams?

I drew a 20 m square grid of steel beams, ten bays each way.
There is a load at every crossing, and four columns.

Alpaca4d gave every beam the smallest section that works.
Each colour is a different size.
The deep ones carry the most. Most beams stay slim.

Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 90 words.

## Other openings

- "A 20 m grid of steel beams. Where does the steel go?"
- "Every colour is a different beam size."

## First comment

The example page is not published yet (it is a draft), so the comment holds only the download link. LinkedIn shows posts with links in them to fewer people, so post it as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Grid | 20 m square, ten bays each way, the beams cut at every crossing |
| Supports | four, pinned, on the diagonals, walked from the corners to the centre |
| Loads | a point load at every node, 20 kN as the definition opens, and the self-weight |
| Starting section | HEA300 in S355 |
| Sizing | every element on its own, within the family it starts in |

- **The mass:** the Section Optimiser's Mass output says which support position is the lighter.
  The pages give no figure, so do not quote one.
- **Licence, if asked:** the Section Optimiser needs a licence; without one, Run Analysis takes models of up to 50 elements and the Results components read them as numbers (https://alpaca4d.github.io/docs/references/license.html).
