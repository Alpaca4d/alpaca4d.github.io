# Mixed Model: LinkedIn post

The speed test of Assemble Model: a 12 x 8 m concrete slab of shells on a grid of steel beams and
columns, standing on a concrete raft of bricks, all in one model, coloured by displacement. Here: the
model (`mixed-model.png`), the canvas (`grasshopper-definition.png`) and the canvas beside the result
(`mixed-model-in-grasshopper.png`). There is no video and no example page: link to the docs.

## What to attach

- **The post:** `mixed-model.png`, the model with its displacement legend in mm.
- **A carousel instead:** `mixed-model.png`, `mixed-model-in-grasshopper.png`.
- **Alt text:** A concrete slab on slender steel columns standing on a thick raft of bricks, coloured by
  displacement, the slab moving most in the middle of its bays.

## The post

Copy everything in the box.

```text
Can one model hold a steel frame, a concrete slab and a solid raft?

A 12 x 8 m slab sits on steel beams and columns. They stand on a raft of solid bricks.

Everything joins at shared points. At most, it moves about 1 mm.

One slider takes it from 100 elements to 40 000.

Alpaca4d puts it all together in Grasshopper. OpenSees solves it.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #FEA
```

About 85 words.

## Other openings

- "Beams, shells and bricks. One model."
- "Where the frame meets the raft, the nodes have to agree."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Assemble Model, how a model is put together: https://alpaca4d.github.io/docs/basics/assemble.html
```

## The numbers, if someone asks

- **The model:** a 12 x 8 m concrete slab of shells, on steel beams 4 m apart, on steel columns at every
  crossing, on a concrete raft of SSP bricks.
- **Shared nodes:** the beams and columns are cut at every node of the slab's mesh, and the raft's top is
  meshed on the same spacing, so the column feet land on its nodes.
- **Loads:** one load pattern with a point load in every bay, a line load on the beams along X, a load on
  the slab and the self weight.
- **Size:** one slider, Divisions per 4 m, takes it from about a hundred elements to forty thousand.
- **The picture:** the legend's largest displacement is 1.077 mm.
- **Licence:** a model this size is over the free 50 elements; the viewers need one too.
