# A 3D printed shell on the edge of buckling: LinkedIn post

A branching shell of fresh concrete printed in Grasshopper, layer by layer along its own sections, every
layer stiffening with its age, and checked for buckling at each moment with Alpaca4d's Linear Buckling.
It is the shape of the earlier voxel example, now printed as a filament that follows the wall. Here:

- the video of the whole print, a frame for every 2.5 s of printing with the nozzle on it and the
  load factor plotted under it (`-printing.mp4`, and a lighter `.gif` of every third frame);
- the still where it comes closest to buckling, with its chart (`-buckled-chart.png`);
- the ages at the end of the print (`-ages.png`);
- the settling under its own weight at 20 layers (`-settling.png`);
- the buckling mode swinging (`-buckling.gif`, `.mp4`);
- the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `printed-structure-printing.mp4`, the shell growing with its load factor falling
  under it.
- **A carousel instead:** `printed-structure-buckled-chart.png`, `printed-structure-ages.png`,
  `grasshopper-definition.png`.
- **Alt text:** A branching concrete shell growing layer by layer under a printing nozzle, coloured
  from orange for fresh concrete to blue for the oldest, with a chart under it of the load factor on
  its own weight falling to 1 at 20 layers and staying there.

## The post

Copy everything in the box.

```text
Would you print this shape?

Three legs that merge into one. Fresh concrete, still soft, carrying its own weight from the first layer.

I printed it in Grasshopper, layer by layer along its own sections. Each layer follows the lean of the wall. Each one stiffens as it ages.

Move the time slider, and Alpaca4d checks it for buckling at that moment.

At 20 layers the safety margin is gone. It stays on the edge to the last layer. Now you know before the printer does.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #3DConcretePrinting #OpenSees #StructuralEngineering
```

About 90 words.

## Other openings

- "Your printer doesn't know when the wall will buckle. Your model can."
- "Three legs, one crown, and no safety margin from layer 20."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The printed structure, with the .gh: https://alpaca4d.github.io/examples/3d-printed-structure/
```

## The numbers, if someone asks

- **The shape:** a branching shell 0.33 x 0.43 m and 0.36 m tall: three legs at the foot, two from
  3 cm up, one from 22 cm, open at the crown from 30 cm.
- **The print:** layers 40 x 10 mm with round sides, along the sections, 5 m/min; the whole shell
  takes 7.8 minutes, 36 layers.
- **The concrete:** E = 0.078 + 0.0012 t MPa, t in minutes, 2070 kg/m3 (Wolfs, Bos and Salet 2018,
  their measured mortar).
- **The model:** SSP bricks, 1 across and 2 up each layer, about 4 cm along; each brick its own age;
  about 10 000 equations at 20 layers, 5 to 10 s per step in Rhino.
- **Load factor on its own weight:** 8.4 at 6 layers, 3.0 at 11, 1.85 at 14, 1.14 at 19, 1.00 at
  20 layers (5.5 minutes in), then between 1.00 and 1.05 to the end, 1.02 at 36.
- **How it would buckle:** in the long leg, whose flat back wall is about 43 cm long and held only at
  its ends: it bows out at the top.
- **On the edge, the mesh decides:** cut with every node carried to its closest point instead of
  evenly, it crosses 1 at 19.4 layers and goes down to 0.86.
- **Print slower?** Over a print this short the mortar hardly stiffens: at half the speed the concrete
  at its foot is only about a tenth stiffer when the print ends.
- **Settling under its own weight:** up to 15 mm at 20 layers, at the top of the merged leg.
- **This is elastic buckling alone:** a printed wall can also yield at its base first.
