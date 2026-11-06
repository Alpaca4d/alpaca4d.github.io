# Deep Beam: LinkedIn post

A concrete deep beam 10 x 4 m standing in its own plane, borne at its two ends, with a 500 kN load walked
along its top, and its principal stress lines. Here: the load walking (`deep-beam-load-walking.mp4`), the
beam spinning (`deep-beam-spin.mp4`) and walked past (`deep-beam-walk-through.mp4`), each with a `.gif`;
the beam with and without its supports and load (`deep-beam.png`, `deep-beam-clean.png`), the canvas
(`grasshopper-definition.png`) and the canvas beside the result (`deep-beam-in-grasshopper.png`).

## What to attach

- **The post:** `deep-beam-load-walking.mp4`. 5.75 s of the load moving along the top, the lines
  following it; it needs no sound.
- **A carousel instead:** `deep-beam.png`, `deep-beam-clean.png`, `deep-beam-in-grasshopper.png`.
- **Alt text:** A deep concrete wall on two end supports, a point load moving along its top, and purple
  and blue lines fanning out from the load down to the supports.

## The post

Copy everything in the box.

```text
A heavy load walks across a deep beam. Where do the forces flow?

A concrete wall, 10 m long and 4 m deep, sitting on its two ends.

I moved a 500 kN load along the top.

The lines fan out from the load and run down to the supports. Wherever the load goes, they follow.

Alpaca4d draws these lines in Grasshopper, from an analysis by OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #ConcreteDesign
```

About 90 words.

## Other openings

- "Move the load. The forces move with it."
- "A wall, two supports and one walking load."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Principal Stress Lines: https://alpaca4d.github.io/docs/basics/visualisation/principal-stress-lines.html
```

## The numbers, if someone asks

- **The beam:** concrete, 10 m long, 4 m deep, 300 mm thick, 50 x 20 shells, in a vertical plane.
- **Supports:** borne on the bottom 0.4 m of each end, pinned at one and sliding along at the other.
- **The load:** 500 kN on one node of its top, moved along it by a slider; solved again at every position.
- **The lines:** in-plane (membrane) principal stress lines. They show which way, not how much: for how
  much, colour the model by its stresses.
- **Licence:** 1 000 shells is over the free 50 elements. No example page: the definition was made for
  these pictures.
