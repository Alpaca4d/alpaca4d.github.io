# Brick Block: LinkedIn post

The solver speed test: an 8 x 8 m concrete block 6 m deep, like a pile cap, of SSP bricks, pinned along
its bottom, with four columns bearing on its top and its own weight, in Von Mises stress. Here: the block
(`brick-block.png`), the canvas (`grasshopper-definition.png`) and the canvas beside the result
(`brick-block-in-grasshopper.png`). There is no video and no example page: link to the docs.

## What to attach

- **The post:** `brick-block.png`, the block with its Von Mises legend.
- **A carousel instead:** `brick-block.png`, `brick-block-in-grasshopper.png`.
- **Alt text:** A concrete block made of small bricks, coloured by Von Mises stress, red in four squares
  on its top where four columns press on it.

## The post

Copy everything in the box.

```text
What happens inside a concrete block under four columns?

It's 8 x 8 m and 6 m deep, made of solid bricks. It's held along its bottom.

The stress peaks right under the four columns.

One slider makes the bricks finer, up to 151 000 unknowns.

Big models solve 2 to 18 times quicker with an OpenSees built with Mumps. Alpaca4d then uses every core.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #FEA
```

About 85 words.

## Other openings

- "Four columns on a block of concrete. Where does it hurt?"
- "Bigger models, every core."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Solve large models on every core: https://alpaca4d.github.io/docs/how-to/analysis/several-cores.html
```

## The numbers, if someone asks

- **The block:** 8 x 8 m, 6 m deep, concrete, pinned all along its bottom, four column loads on its top
  and its own weight. Bricks per metre sets the mesh, 1 to 5 (the definition opens at 3): 8n x 8n x 6n
  SSP bricks, from 1 500 unknowns to 151 000.
- **The picture's scale** is set to 0 to 1.5 MPa: the column loads are points, and their peaks would take
  the whole scale.
- **Mumps:** on a large model 2 to 18 times quicker than BandSPD, with less memory; most of the gain is
  Mumps itself, not the extra cores. The docs' timings, one static step on an Apple M2 Pro, are for
  cubes of bricks: 45 000 unknowns, 17.0 s with BandSPD and 0.92 s with Mumps; 147 852 unknowns,
  BandSPD out of memory (> 6 GB) and Mumps 4.71 s.
- **OpenSees:** you download it yourself. The OpenSees from UC Berkeley solves on one core; Mumps needs
  an OpenSees built with it, and Alpaca4d's default System, Auto, uses it when it is there.
- **Licence:** the block is far over the free 50 elements.
