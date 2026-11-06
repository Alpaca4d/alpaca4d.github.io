# BESO Bridge: LinkedIn post

The block of the Topology Bridge, 16 x 2 x 4 m of steel bricks under a solid deck, carved down by BESO
Topology from the whole block to a fifth of it. Here: the run, design by design
(`beso-bridge-run.mp4`, and a `.gif`), the design (`beso-bridge-design.png`,
`beso-bridge-design-front.png`) and the design analysed in Von Mises stress
(`beso-bridge-analysed.png`).

## What to attach

- **The post:** `beso-bridge-run.mp4`. 7.25 s of the block being carved down to two leaning legs; it
  needs no sound.
- **A carousel instead:** `beso-bridge-design.png`, `beso-bridge-design-front.png`,
  `beso-bridge-analysed.png`.
- **Alt text:** A solid block of steel bricks under a deck being carved away, step by step, into two
  leaning legs rising from the supports, with a column near each end.

## The post

Copy everything in the box.

```text
What if you start with a solid block and take away what isn't working?

That's BESO. Each step takes away 2% of what is left.

First a hole opens in the middle. Then two legs appear. At the end, a fifth of the block is left.

Every step is a finished design. Pick the one you like.

Try it in Grasshopper. Alpaca4d runs it with OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try Topology Optimisation free on models up to 500 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #TopologyOptimization
```

About 90 words.

## Other openings

- "Every step is a bridge. Pick yours."
- "Don't grow a bridge. Carve one."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The bridge, with the .gh: https://alpaca4d.github.io/examples/beso-bridge/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Design domain | a steel block 16 x 2 x 4 m, E = 210 GPa, ν = 0.3, pinned along both ends of its bottom |
| Load | 10 kN/m² on the deck, kept solid |
| Volume | from the whole block down to 20% of it below the deck, 2% of what is left each iteration |
| Run | 3 456 bricks; the volume reaches 0.2 in about 80 iterations; converges after 105, in under 20 s on an Apple M2 Pro |

- **What it finds:** two inclined legs from the supports into the deck, with a column near each end;
  every brick solid or void, no grey density to threshold. Topology Optimisation, on the same block,
  finds an arch instead.
- **The method:** soft-kill BESO after Huang and Xie; a void brick keeps a billionth of its stiffness, so
  it can come back.
- **Licence:** BESO Topology is one of the optimisers a licence unlocks. The call to action is for
  Topology Optimisation, which runs free up to 500 elements.
