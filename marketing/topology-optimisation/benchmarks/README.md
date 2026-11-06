# Topology Benchmarks: LinkedIn post

Topology Optimisation run on top3d's two problems (Liu and Tovar, 2014), a cantilever and a simply
supported beam, with top3d's settings, and checked against top3d itself. Here: each run, design by design
(`cantilever-iterations.mp4`, `simply-supported-iterations.mp4`, and `.gif`s), each design
(`cantilever.png`, `simply-supported.png`, and `-clean` ones without the supports and loads), each design
analysed (`-analysed.png`, `-analysed-clean.png`) and the canvas (`grasshopper-definition.png`,
`grasshopper-definition-analysed.png`). The docs' pictures are one folder up: `../cantilever-3d.png`,
`../simply-supported-3d.png`, and the density through the depth by Alpaca4d and by top3d,
`../cantilever-vs-top3d.png` and `../simply-supported-vs-top3d.png`.

## What to attach

- **The post:** `cantilever-iterations.mp4`. 10 s of top3d's cantilever finding its flanges and webs;
  it needs no sound.
- **A carousel instead:** `../cantilever-vs-top3d.png` (Alpaca4d over top3d, first), `cantilever.png`,
  `cantilever-analysed.png`. The simply supported beam's files would make a post of their own.
- **Alt text:** A cantilever block of bricks, held along one end and loaded at the bottom of the other,
  thinning step by step into a top and a bottom flange joined by diagonal webs.

## The post

Copy everything in the box.

```text
How do you know a shape optimiser gives the right answer?

You check it against one you trust.

This is top3d's own test. A cantilever, held at one end, loaded at the other. top3d is a research code from 2014.

Same settings, 200 steps.
Alpaca4d: 2415.86.
top3d: 2415.82.

Same shape, almost the same number.

The test is in a Grasshopper file you can open.

Alpaca4d. Structural analysis at the speed of design.

Try Topology Optimisation free on models up to 500 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #TopologyOptimization
```

About 85 words.

## Other openings

- "Before you trust an optimiser, race it."
- "2415.86 against 2415.82. Two codes, one shape."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The two tests, with the .gh: https://alpaca4d.github.io/examples/topology-benchmarks/
```

## The numbers, if someone asks

The numbers in the post are the compliance after 200 iterations, Alpaca4d against top3d.

| | Cantilever | Simply supported |
| --- | --- | --- |
| Bricks | 60 x 20 x 4 = 4 800 | 120 x 20 x 4 = 9 600 |
| First compliance, Alpaca4d against top3d | 7.7e-12 apart | 5.9e-12 apart |
| Compliance after 200 iterations, Alpaca4d / top3d | 2415.86 / 2415.82 | 1203.0263 / 1203.0263 |
| Densities after 200 iterations | 4.5e-4 apart on average | 8.1e-5 apart at most |
| Time on an Apple M2 Pro | about 45 s | about 90 s |

- **The settings:** top3d's, in its units: a unit modulus, Poisson 0.3, unit cubes and loads of 1, 30% of
  the volume, penalty 3, a filter of 1.5 elements. The cantilever is top3d's own example,
  `top3d(60,20,4,0.3,3,1.5)`.
- **Why they agree:** OpenSees' eight point brick is top3d's brick. The cantilevers part by up to 0.2%
  around iteration 70, while the design rearranges itself, then come back together.
- **Neither reaches top3d's tolerance of 0.01 in 200 iterations,** and neither does top3d.
- **Licence:** both are over 500 elements, so they need one.
