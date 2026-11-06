# Plate with a Hole: LinkedIn post

Kirsch's plate: a plate with a round hole, pulled, in shells, with its principal stress lines checked
against the exact directions. Here: the lines beside the closed form (`plate-with-hole.png`: single lines
with the exact ones dashed, and a field grown from one seed), the canvas (`grasshopper-definition.png`)
and the canvas beside the result (`plate-with-hole-in-grasshopper.png`). There is no video.

## What to attach

- **The post:** `plate-with-hole.png`, the two plates side by side.
- **A carousel instead:** `plate-with-hole.png`, `plate-with-hole-in-grasshopper.png`.
- **Alt text:** Two square plates with a round hole in the middle, meshed in grey; on the left, red and
  blue lines bending round the hole over dashed black ones; on the right, a field of them.

## The post

Copy everything in the box.

```text
Pull a plate with a hole in it. Which way do the forces go around the hole?

This one has an exact textbook answer, so I checked against it.

Dashed lines: the exact answer. Solid lines: what Alpaca4d draws.

On average, they match within half a degree, even on a coarse mesh.

Alpaca4d draws these lines in Grasshopper, from an analysis by OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #FEA
```

About 85 words.

## Other openings

- "A hole in a plate. The forces have to go around it."
- "Dashed is the textbook. Solid is Alpaca4d."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Principal Stress Lines: https://alpaca4d.github.io/docs/basics/visualisation/principal-stress-lines.html
```

## The numbers, if someone asks

- **The check:** the shells' lines against closed-form solutions - this plate with a hole in tension, the
  Timoshenko cantilever and a simply supported plate under uniform load - follow the exact directions to
  within half a degree on average, on meshes as coarse as eight shells across a beam's depth.
- **The method:** after LilyPad, by Matthew Church and Format Engineers: lines traced with fourth-order
  Runge-Kutta steps, and a field grown by neighbour seeding.
- **The right-hand plate:** a field from one seed, with Test Dist. set so that lines stop short of their
  neighbours.
