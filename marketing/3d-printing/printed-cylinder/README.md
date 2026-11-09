# A 3D printed cylinder buckling as it is printed: LinkedIn post

A cylinder of fresh concrete printed layer by layer in Grasshopper, every layer stiffening with its
age, checked for buckling at each moment with Alpaca4d's Linear Buckling. Here: the video of it being
printed, eight steps a lap with the nozzle going round and the load factor plotted under it
(`-printing.mp4`, and a lighter `.gif` of every other step, 7.8 MB), the still at the layer it
buckles with its chart (`-buckled-chart.png`), the ages at 30 layers (`-ages.png`), the buckling
mode swinging (`-buckling.gif`, `.mp4`) and the canvas.

## What to attach

- **The post:** `printed-cylinder-printing.mp4`, the cylinder growing with its load factor falling
  under it.
- **A carousel instead:** `printed-cylinder-buckled-chart.png`, `printed-cylinder-ages.png`,
  `grasshopper-definition.png`.
- **Alt text:** A concrete cylinder growing layer by layer under a printing nozzle, coloured from orange
  for fresh concrete to blue for the oldest, with a chart under it of the load factor on its own weight
  falling to 1 at 47 layers.

## The post

Copy everything in the box.

```text
When does a 3D printed wall buckle?

While you print, the concrete is still soft. The wall carries its own weight from the first layer.

I built this cylinder in Grasshopper, layer by layer, as the printer lays it. Each layer stiffens as it ages. The bottom is the oldest.

Move the time slider, and Alpaca4d checks it for buckling at that moment.

At 10 layers it could carry five times its weight. At 47 layers, it buckles.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #3DConcretePrinting #OpenSees #StructuralEngineering
```

About 90 words.

## Other openings

- "Your printed wall is soft while you print it."
- "How tall can you print before it buckles?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The printed cylinder, with the .gh: https://alpaca4d.github.io/examples/printed-cylinder/
```

## The numbers, if someone asks

- **The cylinder:** TU/e's (Wolfs, Bos and Salet 2018): print path radius 250 mm, layers 40 x 10 mm
  with round sides, 5 m/min, a lap every 0.31 min.
- **The concrete:** E = 0.078 + 0.0012 t MPa, t in minutes, 2070 kg/m3 (their measured mortar).
- **The model:** SSP bricks, 1 across and 2 up each layer, 4 cm along; each brick its own age; about
  14 000 equations at 30 layers, about 10 s per step in Rhino (15 s at 45 layers).
- **How it buckles:** as a ring - the wall necks in just above the base and flares out above, the
  "cylindrical buckling" TU/e saw in their prints.
- **Load factor on its own weight:** about 5 at 10 layers, 1.65 at 30, 1.18 at 40, 1 at about 47.
- **Compared:** their five lab cylinders fell at 25 to 31 layers (29 on average), by buckling and
  yielding together; their Abaqus model (plastic, large deformation) at 40 to 53. This is elastic
  buckling alone.
