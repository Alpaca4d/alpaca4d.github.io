# How-to, buckling: LinkedIn post

The picture of the how-to guide *Find the load factor a model buckles at*: a portal frame's first
buckling mode, at a load factor of 1.24, swaying sideways over the frame at rest (`buckling.png`).

## What to attach

- **The post:** `buckling.png`. There is no video of it.
- **A carousel instead:** there is only the one picture.
- **Alt text:** A steel portal frame swaying sideways in its first buckling mode, coloured by how far
  it moves, drawn over the outline of the frame at rest.

## The post

Copy everything in the box.

```text
How close is your frame to buckling?

Your reviewer will ask. You want the answer first.

Add one component. It shows how much more load the frame can take before it buckles.

This frame: 1.24 times its loads. That is close.
Below 10, Eurocode 3 asks for a more careful analysis.

You also see the shape it buckles into: it sways sideways.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #Eurocode
```

About 85 words.

## Other openings

- "Your frame can take 1.24 times its loads. Then it buckles."
- "Will your reviewer ask about buckling? Know first."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The guide, find the load factor a model buckles at: https://alpaca4d.github.io/docs/how-to/analysis/buckling.html
```

## The numbers, if someone asks

- **The frame in the picture:** its first load factor, αcr, is 1.24.
- **EN 1993-1-1 5.2.1:** a first-order analysis stands when αcr ≥ 10 for an elastic analysis, 15
  for a plastic one.
- **Divisions:** with 4 elements to a half wave of the buckled shape the factor is about 5% too
  high, with 8 about 1.3%.
- **Buckling length:** N_cr = αcr × N_Ed, so L_cr = π√(EI/N_cr).
- **Size:** on OpenSees 3.8.0 a model can have at most 4000 equations, about 650 beam or shell
  nodes; a newer build has no such limit.
- **Not the capacity:** the analysis is linear and elastic, so αcr is not the load the structure
  can carry; lateral-torsional buckling is Utilisation's to check.
