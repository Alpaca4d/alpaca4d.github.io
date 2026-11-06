# Model View, the loads: LinkedIn post

Every kind of load on one small steel frame with a concrete slab, drawn by Model View with Show
Loads, Show Values and Show Supports on (`loads.png`), and the frame's own weight alone, drawn the
way OpenSees is given it (`own-weight.png`).

## What to attach

- **The post:** `loads.png`. There is no video of it.
- **A carousel instead:** `loads.png`, then `own-weight.png`.
- **Alt text:** A steel frame with a concrete slab, with every kind of load drawn on it and its
  value written beside it: point loads, a moment, line loads on a beam and a column, a pressure on
  the slab, the self-weight and a mass.

## The post

Copy everything in the box.

```text
Did every load land where you meant it to?

You open a model someone else built. Lots of loads.

Switch on Show Loads. Every load appears as arrows, with its value next to it.

Even the structure's own weight, just as the solver gets it.
A slab corner gets a quarter of what a middle point gets.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #StructuralDesign
```

About 80 words.

## Other openings

- "You didn't build this model. Can you trust its loads?"
- "Even the self-weight gets arrows now."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
How Model View draws the loads: https://alpaca4d.github.io/docs/basics/visualisation/model-view.html#how-the-loads-are-drawn
```

## The numbers, if someone asks

- **In the picture:** point loads of 50 kN and 20 kN, the second with a 15 kN·m moment; line loads
  of 10 kN/m on a beam and 5 kN/m on a column; 3 kN/m² on the slab; a mass of 2000 kg.
- **The self-weight:** 0.393 kN/m along the members; on the slab's nodes 4.905 kN inside, 2.453 kN
  on an edge, 1.226 kN at a corner.
- **The arrows, at Load Scale 1:** the largest point load's is 15% of the model's size, the largest
  line load's 60% of that, the largest surface load's 40%, the self-weight's half the point and
  line loads'. The others are in proportion, down to a tenth of the largest.
