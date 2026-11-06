# Cantilever Wall: LinkedIn post

A concrete wall 8 x 2.5 m standing in its own plane, built in along one end, with a load along its top,
and its principal stress lines growing from one seed. Here: the lines growing
(`cantilever-wall-growing.mp4`), the wall spinning (`cantilever-wall-spin.mp4`) and walked past
(`cantilever-wall-walk-through.mp4`), each with a `.gif`; the wall with and without its support and load
(`cantilever-wall.png`, `cantilever-wall-clean.png`), the canvas (`grasshopper-definition.png`) and the
canvas beside the result (`cantilever-wall-in-grasshopper.png`).

## What to attach

- **The post:** `cantilever-wall-growing.mp4`. 5.4 s of the lines growing from one point until they fill
  the wall; it needs no sound.
- **A carousel instead:** `cantilever-wall.png`, `cantilever-wall-clean.png`,
  `cantilever-wall-in-grasshopper.png`.
- **Alt text:** A concrete wall held along its left end, with a load along its top, purple and blue lines
  growing across it from one point until they fill it.

## The post

Copy everything in the box.

```text
How does a wall carry its load when it's held at one end?

A concrete wall, 8 m long and 2.5 m deep. A load runs along its top.

The lines show where the forces flow. Watch them grow from one point until they fill the wall.

Against textbook answers, they are within half a degree on average.

Alpaca4d draws these lines in Grasshopper, from an analysis by OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #ConcreteDesign
```

About 90 words.

## Other openings

- "One point. A whole wall of forces."
- "Held at one end, loaded on top. Follow the forces."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Principal Stress Lines: https://alpaca4d.github.io/docs/basics/visualisation/principal-stress-lines.html
```

## The numbers, if someone asks

- **The wall:** concrete, 8 m long, 2.5 m deep, 250 mm thick, 48 x 15 shells, built in along its left
  edge, carrying 50 kN/m along its top.
- **The lines:** in-plane (membrane) principal stress lines: one line through a seed, then a field grown
  from it, each new line a set distance from its neighbours.
- **The check:** against closed-form solutions (the Timoshenko cantilever, a plate with a hole in
  tension, a simply supported plate under uniform load), the lines follow the exact directions to within
  half a degree on average. The method follows LilyPad, by Matthew Church and Format Engineers.
- **Licence:** 720 shells is over the free 50 elements. No example page: the definition was made for these
  pictures.
