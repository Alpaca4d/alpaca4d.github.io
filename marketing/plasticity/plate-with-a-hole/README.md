# Plate with a hole, pulled past yield: LinkedIn post

An S355 plate 400 x 200 x 10 mm with a hole 60 mm across, pulled in its own plane in 20 steps to 500 kN, as 925 ASD Shells of steel that yields (J2Plasticity), with Alpaca4d. Here: the still, the still with its load-displacement curve (`-2.png`), the model beside
the curve Grasshopper draws (`-curve.png`), the video of the push with the curve so far under each step
(`-pushing.mp4`, and a `.gif`), the canvas, and the canvas beside the result (`-in-grasshopper.png`).

## What to attach

- **The post:** `plate-with-a-hole-pushing.mp4`, with the curve growing under the model.
- **A carousel instead:** `plate-with-a-hole-2.png`, `plate-with-a-hole.png`, `plate-with-a-hole-in-grasshopper.png`.
- **Alt text:** A steel plate with a round hole, pulled along its length, coloured from light blue to purple by its stress, with orange yielding steel fanning out from the hole to the plate's edges, and a load-displacement curve under it.

## The post

Copy everything in the box.

```text
A hole makes steel yield early. How early?

I pulled a steel plate with a hole in it, a step at a time.

At the edge of the hole the stress is more than twice the average. It yields there first, under half the plate's strength.

I kept pulling. The yielding fans out across the plate.

It stops at the strength of the steel left beside the hole, as the hand result says: about 500 kN.

Steel that yields, in Grasshopper. Alpaca4d shows you where.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 110 words.

## Other openings

- "Where does a plate with a hole yield first?"
- "Watch the yielding fan out from the hole."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The plate with a hole, with the .gh: https://alpaca4d.github.io/examples/plate-with-a-hole/
```

## The numbers, if someone asks

- **The plate:** S355, 400 x 200 x 10 mm, a hole 60 mm across in its middle, pulled along its length.
- **The model:** 925 ASD Shells, finer round the hole, Layered Shell of ten layers; J2Plasticity, perfectly plastic; 20 steps; about 9 s.
- **Stress at the hole:** 2.34 times the net section's average (Heywood). First yield 212 kN by hand, 227 in the model (it reads stresses just inside the edge).
- **Net section yield:** Fy x 140 x 10 mm² = 497 kN. The model levels off at 510, as a plane stress model does.
