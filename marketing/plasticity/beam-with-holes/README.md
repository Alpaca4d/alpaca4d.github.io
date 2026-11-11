# Steel beam with holes, pushed past yield: LinkedIn post

A simply supported S355 beam 2.4 m long, 300 mm deep and 80 mm thick, with six round holes 180 mm
across, in 7 478 ten node tetrahedra of steel that yields (the nD component's J2Plasticity unit),
loaded at midspan in 20 steps to 740 kN with Alpaca4d. Here: the still, the still with its
load-deflection curve (`-2.png`), the beam beside the curve Grasshopper draws (`-curve.png`), the
video of the push with the curve so far under each step (`-pushing.mp4`, and a `.gif`), the canvas,
and the canvas beside the result (`-in-grasshopper.png`).

## What to attach

- **The post:** `beam-with-holes-pushing.mp4`, with the load-deflection curve growing under the beam.
- **A carousel instead:** `beam-with-holes-2.png`, `beam-with-holes.png`,
  `beam-with-holes-in-grasshopper.png`.
- **Alt text:** A steel beam with six round holes bending under a load at midspan, coloured from
  light blue to purple by its stress, with orange patches where the steel yields beside the two
  middle holes, and its load-deflection curve underneath: a straight blue line, then an orange one
  bending over.

## The post

Copy everything in the box.

```text
How far can you push steel after it starts to yield?

This steel beam has six big holes. I loaded it in the middle, a step at a time.

Up to about 570 kN it stays elastic. Then the steel beside the middle holes yields. Orange shows where.

I kept pushing. The yielding spreads, and the beam softens.

30% more load, and it sags twice as much: from 6 mm to 12 mm.

Steel that yields, in Grasshopper. Alpaca4d shows you where, and how much more it can take.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 90 words.

## Other openings

- "Where does a beam with holes yield first?"
- "Watch the orange spread."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The steel beam with holes, with the .gh: https://alpaca4d.github.io/examples/beam-with-holes/
```

## The numbers, if someone asks

- **The beam:** S355, 2.4 m long, 300 x 80 mm, six round holes 180 mm across at 340 mm; simply
  supported on its end faces; the load on a 100 mm strip across the top at midspan.
- **The model:** 7 478 ten node tetrahedra, finer round the holes; J2Plasticity (von Mises), E 210
  GPa, Fy 355 MPa, no hardening; 20 steps of Load Control with Newton; solved in about 25 s.
- **First yield:** 566 kN, 5.7 mm at midspan, beside the two middle holes.
- **At 740 kN:** 12.2 mm, twice the deflection at first yield and 1.6 times what an elastic beam
  would sag. It levels off at about 755 kN.
- **The colours:** Von Mises from 0 to 355 MPa, light blue through blue to purple; orange is the top
  band, steel at or within 8% of yield.
