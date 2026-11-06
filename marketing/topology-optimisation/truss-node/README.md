# Truss Node: LinkedIn post

Where a node of a space truss needs its steel, where nine members meet at a 1 m cube of steel bricks,
found three ways side by side: Topology Optimisation (SIMP), BESO Topology and Multi-Material Topology.
Here: each run (`truss-node-simp-run.mp4`, `-beso-run.mp4`, `-multi-material-run.mp4`, and `.gif`s), each
design (`truss-node-simp.png`, `-beso.png`, `-multi-material.png`), each design analysed in Von Mises
stress (`-analysed.png`) and the three side by side (`truss-node-comparison.png`).

## What to attach

- **The post:** `truss-node-beso-run.mp4`. 7.5 s of BESO carving the cube down to the node; it needs
  no sound.
- **A carousel instead:** `truss-node-beso.png`, `truss-node-beso-analysed.png`. The SIMP and
  Multi-Material runs, and the comparison, would make posts of their own.
- **Alt text:** A cube of steel bricks with nine member stubs being carved away, step by step, into a
  body in the middle with four legs reaching down to the diagonals.

## The post

Copy everything in the box.

```text
Nine bars meet at one point. What should the joint look like?

I put a 1 m steel cube where they meet. Then I let the computer take away what isn't needed.

What is left: a body in the middle, and four legs.

It looks different from every side. No single view shows all of it.

Try it in Grasshopper. Alpaca4d runs it with OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try Topology Optimisation free on models up to 500 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #TopologyOptimization
```

About 85 words.

## Other openings

- "No single view shows this joint."
- "Nine bars, one steel cube, and only what is needed."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The node, with the .gh: https://alpaca4d.github.io/examples/truss-node/
```

## The numbers, if someone asks

- **The node:** a cube of steel bricks, 1 m a side, E = 210 GPa; aluminium, E = 70 GPa, for
  Multi-Material Topology to choose. Each member is a stub 0.2 m square and 0.2 m long, kept solid.
- **The forces:** chords along x in tension, 450 and 250 kN; along y in compression, 300 and 150 kN; a
  post bringing 600 kN down; four diagonals from the bottom corners, held at their feet. The diagonals
  carry the 600 kN and what the chords leave over: 200 kN along x, 150 kN along y.
- **Kept:** 12% of the cube for Topology Optimisation and BESO; up to 4% steel and 8% aluminium for
  Multi-Material Topology.

| | Iterations | Compliance | Time, Apple M2 Pro |
| --- | --- | --- | --- |
| Topology Optimisation | 200 | 0.134 | about two minutes |
| BESO Topology | 115 | 0.091 | about a minute |
| Multi-Material Topology | 260 | 0.158 | about four minutes |

- **Why BESO's is stiffest:** every brick of it is solid, where Topology Optimisation's design still has
  densities between 0 and 1 counting for less. Multi-Material's is softer because two thirds of its
  volume is aluminium.
- **Size and licence:** 8 576 bricks at 2 per 10 cm, so it needs one; BESO and Multi-Material are
  optimisers a licence unlocks.
