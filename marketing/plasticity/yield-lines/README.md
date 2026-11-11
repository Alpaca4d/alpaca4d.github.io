# Steel plate with yield lines: LinkedIn post

A square S355 plate 1 x 1 m and 25 mm thick, simply supported on its four edges, as 1 600 ASD Shells of steel that yields (J2Plasticity), under a pressure raised in 20 steps to 1 300 kN/m² with Alpaca4d. Here: the still, the still with its load-displacement curve (`-2.png`), the model beside
the curve Grasshopper draws (`-curve.png`), the video of the push with the curve so far under each step
(`-pushing.mp4`, and a `.gif`), the canvas, and the canvas beside the result (`-in-grasshopper.png`).

## What to attach

- **The post:** `yield-lines-pushing.mp4`, with the curve growing under the model.
- **A carousel instead:** `yield-lines-2.png`, `yield-lines.png`, `yield-lines-in-grasshopper.png`.
- **Alt text:** A square steel plate sagging under a pressure, coloured from light blue to purple by its stress, with orange yielding steel forming an X along its diagonals, and a pressure-deflection curve under it bending over.

## The post

Copy everything in the box.

```text
Where does a steel plate give way?

I pressed down on a square steel plate, held on its four edges.

The corners yield first. Then the middle. Then the lines between them.

An X appears. Orange shows it.

It's the pattern engineers draw by hand for a plate's strength. The hand result: 1 331 kN/m². The model: 1 347.

Steel that yields, in Grasshopper. Alpaca4d shows you where.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 93 words.

## Other openings

- "The corners yield first. Did you expect that?"
- "Watch the X appear."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The plate with yield lines, with the .gh: https://alpaca4d.github.io/examples/yield-lines/
```

## The numbers, if someone asks

- **The plate:** S355, 1 x 1 m, 25 mm, simply supported on its edges, corners held down.
- **The model:** 1 600 ASD Shells, Layered Shell of ten layers; J2Plasticity, perfectly plastic; 20 steps; about 16 s.
- **First yield:** about 700 kN/m², at the corners, by twisting; plate theory puts it at the middle at 772.
- **Yield-line theory:** 24 mp / L² = 1 331 kN/m², mp = Fy t² / 4. The model levels off at 1 347, 1% over.
- **The X:** at 1 105 kN/m², 17.5 mm. Small deflections: membrane action, which would carry more, is left out.
