# A 3D printed dome buckling as it is printed: LinkedIn post

A beehive dome of fresh concrete, each layer resting a little inside the one below, printed in
Grasshopper layer by layer and checked for buckling at each moment with Alpaca4d's Linear Buckling.
Here:

- the video of the whole print, 38 layers, with the nozzle on it and the load factor plotted under it
  (`-printing.mp4`, and a lighter `.gif` of every third frame);
- the still at the layer it buckles, with its chart (`-buckled-chart.png`);
- the ages at the end of the print (`-ages.png`) and the settling under its own weight at 27 layers
  (`-settling.png`);
- the buckling mode swinging (`-buckling.gif`, `.mp4`);
- the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `printed-dome-printing.mp4`, the dome closing in with its load factor falling under
  it.
- **A carousel instead:** `printed-dome-buckled-chart.png`, `printed-dome-ages.png`,
  `grasshopper-definition.png`.
- **Alt text:** A concrete dome printed layer by layer, each layer leaning in over the one below,
  coloured from orange for fresh concrete to blue for the oldest, with a chart under it of the load
  factor on its own weight falling to 1 at 27 layers.

## The post

Copy everything in the box.

```text
A dome, printed without formwork.

Each layer sits a little inside the one below, up to 40 degrees at the top. Fresh concrete, soft for minutes, carrying its own weight all the way.

I printed it in Grasshopper, layer by layer, each layer stiffening as it ages. Move the time slider, and Alpaca4d checks it for buckling.

At 27 of its 38 layers, the rim goes oval. Time to rethink the curve, or the mix, before the printer starts.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #3DConcretePrinting #OpenSees #StructuralEngineering
```

About 90 words.

## Other openings

- "How far can a printed dome lean in?"
- "No formwork. 38 layers. It gives up at 27."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The dome, with the .gh: https://alpaca4d.github.io/examples/3d-printed-structure/#dome
```

## The numbers, if someone asks

- **The dome:** 0.6 m across its foot, its wall an arc of radius 0.6 m leaning in to an opening
  0.31 m across at 0.39 m, 40 degrees from upright at the top.
- **The print:** 38 layers of 40 x 10 mm with round sides, 5 m/min, 12.3 minutes.
- **The concrete:** E = 0.078 + 0.0012 t MPa, t in minutes, 2070 kg/m3 (Wolfs, Bos and Salet 2018).
- **The model:** SSP bricks, 96 a layer (1 across, 2 up, 48 along); each brick its own age.
- **Load factor on its own weight:** 5.2 at 10 layers, 2.6 at 15, 1.5 at 20, 1 at 27.4 layers (9.6
  minutes in).
- **How it buckles:** the rim goes oval, in and out twice round.
- **Settling under its own weight:** up to 16 mm at 27 layers.
- **This is elastic buckling alone:** a printed wall can also yield at its base first.
