# Topology Tower: LinkedIn post

A cube of 16 x 16 x 16 bricks held at its four bottom corners and loaded at the middle of its top,
optimised by Topology Optimisation to 8% of its volume: four legs that grow from the corners and meet
under the load. Here: the run, design by design (`tower-iterations.mp4`, and a `.gif`), the design
(`tower.png`, `tower-from-below.png`, `tower-clean.png` without the supports and loads), the design
analysed in Von Mises stress (`tower-analysed.png`, `tower-analysed-clean.png`) and the canvas
(`grasshopper-definition.png`, `grasshopper-definition-analysed.png`, and the `-in-grasshopper.png`
screens). There is no example page for it: link to the docs.

## What to attach

- **The post:** `tower-iterations.mp4`. 6.3 s, almost square, so it fills the feed; the legs grow
  without any sound.
- **A carousel instead:** `tower.png`, `tower-from-below.png`, `tower-analysed.png`,
  `tower-in-grasshopper.png`.
- **Alt text:** A cube of bricks held at its four bottom corners and loaded at the middle of its top,
  thinning step by step into four legs that lean in and meet under the load.

## The post

Copy everything in the box.

```text
Hold a cube at its four corners and push on the top. What shape is left?

I let the computer keep only 8% of the cube.

Four legs grew out of the corners. They lean in and meet right under the load.

It took 44 steps and 12 seconds on an M2 Pro.

Try it in Grasshopper. Alpaca4d runs it with OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try Topology Optimisation free on models up to 500 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #TopologyOptimization
```

About 85 words.

## Other openings

- "A cube went in. Four legs came out."
- "Four corners and one load. The material knows the rest."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Topology Optimisation, how it works: https://alpaca4d.github.io/docs/basics/optimisation/topology-optimisation.html
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Design domain | a cube of 16 x 16 x 16 unit bricks, 4 096 of them |
| Supports and load | held at its four bottom corners, loaded at the middle of its top |
| Volume kept | 8% |
| Settings | top3d's units and settings: a unit modulus, Poisson 0.3, loads of 1, penalty 3, filter 1.5 |
| Run | 100 iterations at most; it settles after 44, in 12 s on an Apple M2 Pro |

- **No units:** it runs in top3d's units, so the stresses in `tower-analysed.png` have none. The shape is
  the answer here, not the numbers.
- **Licence:** 4 096 bricks is over the free 500, so this one needs one.
