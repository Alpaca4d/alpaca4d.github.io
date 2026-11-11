# Thick pipe under pressure, pushed past yield: LinkedIn post

A thick-walled S355 pipe, bore 200 mm and outside 400 mm, under a pressure inside it raised in 20 steps to 280 MPa: a quarter of a slice in 4 860 Ten Node Tetrahedra of steel that yields (J2Plasticity), in plane strain, with Alpaca4d. Here: the still, the still with its load-displacement curve (`-2.png`), the model beside
the curve Grasshopper draws (`-curve.png`), the video of the push with the curve so far under each step
(`-pushing.mp4`, and a `.gif`), the canvas, and the canvas beside the result (`-in-grasshopper.png`).

## What to attach

- **The post:** `thick-pipe-pushing.mp4`, with the curve growing under the model.
- **A carousel instead:** `thick-pipe-2.png`, `thick-pipe.png`, `thick-pipe-in-grasshopper.png`.
- **Alt text:** A quarter of a thick steel pipe seen end on, coloured by its stress, an orange ring of yielding steel growing out from the bore to nearly the outside, and a pressure-widening curve under it bending over.

## The post

Copy everything in the box.

```text
How much pressure can a thick steel pipe hold?

I raised the pressure inside one, a step at a time.

The steel yields first at the bore. Then a ring of yielding grows outwards. Orange shows it.

When the ring reaches the outside, the pipe can take no more.

Theory says 284 MPa. The model: 284.

Steel that yields, in Grasshopper. Alpaca4d shows you where.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #MechanicalEngineering
```

About 90 words.

## Other openings

- "Watch a pipe yield from the inside out."
- "The pressure a steel pipe gives way at, to the megapascal."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The thick pipe, with the .gh: https://alpaca4d.github.io/examples/thick-pipe/
```

## The numbers, if someone asks

- **The pipe:** S355, bore 200 mm, outside 400 mm, a long pipe (plane strain); a quarter of a 20 mm slice.
- **The model:** 4 860 Ten Node Tetrahedra; J2Plasticity, perfectly plastic; 20 steps; about 17 s.
- **First yield:** Fy / √3 (1 - a² / b²) = 154 MPa by theory, 156 in the model.
- **Collapse:** 2 Fy / √3 ln(b / a) = 284.1 MPa by theory; the model pushed on levels off at 284.0.
- **At 280 MPa:** the bore widens 0.52 mm; a thin ring at the outside is still elastic.
