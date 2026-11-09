# A twisted 3D printed column buckling as it is printed: LinkedIn post

A six-lobed column of fresh concrete, turning 60 degrees as it rises, printed in Grasshopper layer by
layer along its own sections and checked for buckling at each moment with Alpaca4d's Linear Buckling.
Here:

- the video of the whole print, 60 layers, with the nozzle on it and the load factor plotted under it
  (`-printing.mp4`, and a lighter `.gif` of every third frame);
- the still at the layer it buckles, with its chart (`-buckled-chart.png`);
- the ages at the end of the print (`-ages.png`) and the settling under its own weight at 53 layers
  (`-settling.png`);
- the buckling mode swinging (`-buckling.gif`, `.mp4`);
- the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `twisted-column-printing.mp4`, the column twisting up with its load factor falling
  under it.
- **A carousel instead:** `twisted-column-buckled-chart.png`, `twisted-column-ages.png`,
  `grasshopper-definition.png`.
- **Alt text:** A six-lobed concrete column twisting as it is printed layer by layer, coloured from
  orange for fresh concrete to blue for the oldest, with a chart under it of the load factor on its
  own weight falling to 1 at 53 of its 60 layers.

## The post

Copy everything in the box.

```text
How tall can you print a twisted column?

Six lobes, turning as it rises. Fresh concrete, soft for minutes, carrying its own weight from the first layer.

I printed it in Grasshopper, layer by layer. The nodes turn with the twist, so every layer is cut the same. Each one stiffens as it ages.

Move the time slider, and Alpaca4d checks it for buckling.

53 layers. Then it sways over. A plain cylinder, wider still, gives up at 47: the lobes earn their keep.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #3DConcretePrinting #OpenSees #StructuralEngineering
```

About 90 words.

## Other openings

- "The lobes are not just for looks."
- "Six lobes, one twist, 53 layers before it sways."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The twisted column, with the .gh: https://alpaca4d.github.io/examples/3d-printed-structure/#twisted-column
```

## The numbers, if someone asks

- **The shape:** six lobes round a radius of 160 mm, 18% deep, turning 60 degrees (one lobe) over
  0.6 m.
- **The print:** 60 layers of 40 x 10 mm with round sides, 5 m/min, 14.7 minutes.
- **The concrete:** E = 0.078 + 0.0012 t MPa, t in minutes, 2070 kg/m3 (Wolfs, Bos and Salet 2018).
- **The model:** SSP bricks, 64 a layer (1 across, 2 up, 32 along); each brick its own age.
- **Load factor on its own weight:** 10 at 9 layers, 2.6 at 27, 1.3 at 45, 1 at 53 layers (13 minutes
  in), 0.83 at the end.
- **How it buckles:** the column sways over as a whole.
- **Compared:** TU/e's plain cylinder, radius 250 mm, same filament and mortar, buckles at 47 layers
  (the printed cylinder example).
- **Settling under its own weight:** up to 39 mm at 53 layers.
- **This is elastic buckling alone:** a printed wall can also yield at its base first.
