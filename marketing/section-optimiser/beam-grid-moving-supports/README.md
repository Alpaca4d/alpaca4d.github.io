# Beam grid, moving supports: LinkedIn post

The beam grid example, a 20 m square grid of steel tubes (rectangular hollow sections), ten bays each
way, on four pinned supports, with 7.5 kN at every node and its own weight. The supports walk in
along the diagonals from the corners to 8 m in, a bay at a time, and back; at each stop the Section
Optimiser sizes every element again, the lightest RHS that passes the steel check, over up to 40
iterations. The colour is each section's mass in kg/m, on one scale for the whole loop; the camera
turns a quarter round; the caption gives where the supports are and the steel's mass. Here: the loop
as a GIF and an MP4.

## What to attach

- **The post:** `beam-grid-moving-supports.mp4`.
- **A GIF instead:** `beam-grid-moving-supports.gif`, where a video will not play.
- **Alt text:** A square grid of steel beams on four supports that move in from the corners and back.
  With the supports at the corners, the edge beams and a ring inside them are heavy and orange; with
  the supports 4 m in, almost every beam is slim and blue. Under it, where the supports are and the
  steel's mass.

## The post

Copy everything in the box.

```text
Where should the columns go?

This is a 20 m steel grid on four columns. The columns walk in from the corners.

At every step, Alpaca4d sizes every beam again: the lightest tube that passes the Eurocode check.

The colour is the weight of each beam.

Columns at the corners: 15 t of steel.
Columns 4 m in: 5.2 t. A third.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 70 words.

## Other openings

- "Move four columns. Save two thirds of the steel."
- "Same grid, same load. Only the columns move."

## First comment

The example page is not published yet (it is a draft), so the comment holds only the download link.
LinkedIn shows posts with links in them to fewer people, so post it as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Grid | 20 m square, ten bays of 2 m each way, the beams cut at every crossing: 220 elements, S355 |
| Supports | four, pinned, on the diagonals: at the corners, then 2, 4, 6 and 8 m in from the edges |
| Loads | 7.5 kN at every node (about 1.9 kN/m²) and the self-weight |
| Sizing | every element on its own within the RHS, lightest first, up to 40 iterations; converged at every stop, largest utilisation 0.999 |
| Steel | 15.0 t at the corners, 7.9 t at 2 m in, 5.2 t at 4 m, 7.1 t at 6 m, 9.6 t at 8 m |
| Sections | 37 RHS, from 40x20x2 to 400x200x12.5 |

- **Why tubes:** the beams are joined rigidly at every node, so each twists as the beams across it
  bend. A closed section takes that torsion; an open one, such as an HEA, cannot at any size.
- **Deflection:** the optimiser checks strength only. The sized grid with its supports at the
  corners sags about 1.2 m, so do not claim it is a finished design.
- **Licence, if asked:** the Section Optimiser needs a licence; without one, Run Analysis takes
  models of up to 50 elements (https://alpaca4d.github.io/docs/references/license.html).
- **Made with:** `Tools/Marketing/run.sh beamgrid` in the Alpaca4d repository.
