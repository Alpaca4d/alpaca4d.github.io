# Topology Bridge: LinkedIn post

Where a bridge needs its steel, found by Topology Optimisation in a block of steel bricks 16 x 2 x 4 m
under a solid deck. Here: the run, design by design (`bridge-iterations.mp4`, and a `.gif`), the design
from several sides (`bridge.png`, `bridge-front.png`, `bridge-from-below.png`, and `-clean` ones without
the supports and loads), the design analysed in Von Mises stress (`bridge-analysed.png`,
`bridge-analysed-clean.png`), the solid block's stress lines over the design
(`stress-lines-and-design.png`) and the canvas (`grasshopper-definition.png`,
`grasshopper-definition-analysed.png`, and the `-in-grasshopper.png` screens). The docs' pictures of it
are one folder up: `../bridge-3d.png` and `../bridge-analysed.png`.

## What to attach

- **The post:** `bridge-iterations.mp4`. 9.5 s of the block giving up its steel until the arch is left;
  it needs no sound.
- **A carousel instead:** `bridge.png`, `bridge-analysed.png`, `stress-lines-and-design.png`,
  `bridge-in-grasshopper.png`.
- **Alt text:** A long block of steel bricks under a deck thinning, step by step, into an arch from
  support to support with a column near each end.

## The post

Copy everything in the box.

```text
Where does a bridge really need its steel?

I took a solid steel block, 16 m long, with a deck on top. Then I let the computer take away 80% of it.

Step by step, the steel that does no work disappears.

What stays is an arch, with a column near each end.

Try it in Grasshopper. Alpaca4d runs it with OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try Topology Optimisation free on models up to 500 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #TopologyOptimization
```

About 85 words.

## Other openings

- "I asked a block of steel where the bridge should be."
- "Start with a block. End with an arch."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The bridge, with the .gh: https://alpaca4d.github.io/examples/topology-bridge/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| Design domain | a steel block 16 x 2 x 4 m, E = 210 GPa, ν = 0.3 |
| Supports | the nodes along the bottom of both ends, pinned |
| Load | 10 kN/m² on the deck, 32 m², the deck kept solid |
| Volume kept | 20% of the block below the deck |
| 3 bricks per metre | 3 456 bricks, 77 iterations, about 15 s on an Apple M2 Pro |

- **Without a licence:** the optimisation runs at 1 brick per metre, 128 bricks. The 3 456 of the
  picture, and analysing the design (over 50 elements), need a licence.
