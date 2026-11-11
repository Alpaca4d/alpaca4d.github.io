# Pipe T-joint, pushed past yield: LinkedIn post

A T-joint of two S355 tubes - a brace 150 x 8 mm on a chord 300 x 10 mm, 1.8 m long - as 2 434 ASD Shells of steel that yields (the nD component's J2Plasticity unit), the brace pushed down in 20 steps to 640 kN with Alpaca4d. Here: the still, the still with its load-displacement curve (`-2.png`), the model beside
the curve Grasshopper draws (`-curve.png`), the video of the push with the curve so far under each step
(`-pushing.mp4`, and a `.gif`), the canvas, and the canvas beside the result (`-in-grasshopper.png`).

## What to attach

- **The post:** `pipe-t-joint-pushing.mp4`, with the curve growing under the model.
- **A carousel instead:** `pipe-t-joint-2.png`, `pipe-t-joint.png`, `pipe-t-joint-in-grasshopper.png`.
- **Alt text:** A steel tube with a smaller tube standing on it, coloured from light blue to purple by its stress, with orange patches of yielding steel spreading over the big tube round the foot of the small one, and a load-displacement curve under it bending over.

## The post

Copy everything in the box.

```text
What happens where two steel pipes meet?

I pushed a small pipe down into a big one, a step at a time.

The big pipe's wall starts to yield where they meet. Orange shows where.

I kept pushing. The yielding spreads over the wall, and the wall dents in.

The code gives this joint about 390 kN. It carries about 580 kN before it dents 9 mm.

Pipes, welded joints, steel that yields. In Grasshopper.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 100 words.

## Other openings

- "Where does a pipe joint give way first?"
- "Watch the big pipe dent."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The pipe T-joint, with the .gh: https://alpaca4d.github.io/examples/pipe-t-joint/
```

## The numbers, if someone asks

- **The joint:** S355; chord 300 x 10 mm, 1.8 m, both ends held; brace 150 x 8 mm at midspan, its top 60 mm elastic and 30 mm thick as an end plate.
- **The model:** 2 434 ASD Shells through the middle of the walls, Layered Shell of ten layers; J2Plasticity, perfectly plastic; 20 steps of Load Control, Newton; about 50 s.
- **First yield:** about 120 kN, a hot spot where the brace meets the chord.
- **At 3% of the chord's diameter, 9 mm:** about 580 kN. At 640 kN: 18 mm.
- **EN 1993-1-8, chord face failure (Table 7.2, γM5 = 1):** 388 kN, a lower bound fitted to tests.
