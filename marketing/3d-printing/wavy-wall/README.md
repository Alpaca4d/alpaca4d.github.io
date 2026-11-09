# A wavy 3D printed wall buckling as it is printed: LinkedIn post

A free-standing wall of fresh concrete in waves, printed in Grasshopper layer by layer and checked for
buckling at each moment with Alpaca4d's Linear Buckling, against a flat wall of the same length. Here:

- the video of the whole print, 40 layers, with the nozzle on it and the load factor plotted under it
  (`-printing.mp4`, and a lighter `.gif` of every third frame);
- the still at the layer it buckles, with its chart (`-buckled-chart.png`);
- the ages at the end of the print (`-ages.png`) and the settling under its own weight at 28 layers
  (`-settling.png`);
- the buckling mode swinging (`-buckling.gif`, `.mp4`);
- the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `wavy-wall-printing.mp4`, the wall growing with its load factor falling under it.
- **A carousel instead:** `wavy-wall-buckled-chart.png`, `wavy-wall-ages.png`,
  `grasshopper-definition.png`.
- **Alt text:** A wavy concrete wall printed layer by layer, coloured from orange for fresh concrete
  to blue for the oldest, with a chart under it of the load factor on its own weight falling to 1 at
  28 layers.

## The post

Copy everything in the box.

```text
Why do printed walls wiggle?

A flat wall of fresh concrete, 40 mm thick, buckles under its own weight at about 15 layers.

Put it in waves, 50 mm deep, and it reaches 28.

I printed both in Grasshopper, layer by layer, each layer stiffening as it ages, and let Alpaca4d check them for buckling as they grow. Same filament, same length, same mortar. The shape does the work.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #3DConcretePrinting #OpenSees #StructuralEngineering
```

About 80 words.

## Other openings

- "The cheapest stiffener is a wave."
- "Same concrete, same length: 15 layers flat, 28 in waves."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The wavy wall, with the .gh: https://alpaca4d.github.io/examples/3d-printed-structure/#wavy-wall
```

## The numbers, if someone asks

- **The wall:** 1 m long, free at both ends, in waves 250 mm long and 50 mm deep, 0.4 m tall.
- **The print:** 40 layers of 40 x 10 mm with round sides, 5 m/min, 10.4 minutes.
- **The concrete:** E = 0.078 + 0.0012 t MPa, t in minutes, 2070 kg/m3 (Wolfs, Bos and Salet 2018).
- **The model:** SSP bricks, 68 a layer (1 across, 2 up, 34 along); each brick its own age.
- **Load factor on its own weight:** 5.9 at 12 layers, 2.5 at 18, 1.4 at 24, 1 at 27.6 layers (7.2
  minutes in).
- **How it buckles:** a free end swings out.
- **The flat wall:** 1 m long, the same bricks, buckles at 14.6 layers (computed with Alpaca4d's
  Core, the same way). Suiker's (2018) closed form for an endless flat wall of this mortar gives about
  16, the ends making the difference.
- **Settling under its own weight:** up to 10 mm at 28 layers.
- **This is elastic buckling alone:** a printed wall can also yield at its base first.
