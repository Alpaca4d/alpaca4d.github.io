# Solid Beams: LinkedIn post

A simply supported beam under a uniform load, modelled as a solid, and its principal stress lines through
it: in 1 280 SSP Bricks (`beam-bricks.png`) and in Ten Node Tetrahedra (`supported-beam.png`). Both are
pictures of the docs. There is no video and no canvas.

## What to attach

- **The post:** `beam-bricks.png`, the beam of bricks in perspective with its lines.
- **A carousel instead:** `beam-bricks.png`, then `supported-beam.png`, the same kind of beam seen from
  the front.
- **Alt text:** A long solid beam made of bricks, nearly clear, traced with orange lines sagging along
  its bottom and blue lines arching between its supports.

## The post

Copy everything in the box.

```text
You've drawn the forces in a beam many times. Have you seen them in 3D?

A beam 10 m long, 2 m deep and 1 m wide. Two supports, a load on top.

Orange lines are stretched. They sag along the bottom and rise to the supports.
Blue lines are squeezed. They arch between them.

Alpaca4d draws these lines through solids in Grasshopper, from an analysis by OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #FEA
```

About 90 words.

## Other openings

- "The beam from your first lecture, in 3D."
- "Stretched along the bottom, squeezed in an arch."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Principal Stress Lines: https://alpaca4d.github.io/docs/basics/visualisation/principal-stress-lines.html
```

## The numbers, if someone asks

- **The beam:** 10 m long, 2 m deep and 1 m wide, 1 280 SSP Bricks, simply supported, a uniform load on
  its top.
- **The lines:** one line of each family through points every 0.5 m along the neutral axis, at the back,
  the middle and the front of the width. Tension (SL1) orange, compression (SL3) blue.
- **In 3D there are three families:** in `supported-beam.png`, where both stresses in the beam's plane are
  compressions at the top, the largest principal stress is the one across the width, zero, and the second
  family of the familiar two-dimensional picture is SL2, in purple.
- **Accuracy:** against closed-form solutions, the solid lines follow the exact directions to within
  0.1–0.6° on average, more than a depth away from the supports and loads.
- **Licence:** 1 280 bricks is over the free 50 elements.
