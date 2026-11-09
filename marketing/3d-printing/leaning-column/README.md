# A leaning column printed with a tilting nozzle: LinkedIn post

A tube of fresh concrete that rises and then bends over to 45 degrees, printed in Grasshopper two
ways: along its axis, the nozzle tilting so that every layer sits square on the one below, and in flat
layers, each hanging a little out over the one below. Both are checked for buckling at each moment with
Alpaca4d's Linear Buckling. Here:

- the two prints side by side at the same moment, each with its load factor under it
  (`leaning-column-both-printing.mp4`, and a lighter `.gif` of every third frame);
- the print along its axis to its last layer, the nozzle tilting, with its chart
  (`leaning-column-printing.mp4`, `.gif`), and the same printed flat (`leaning-column-flat-printing.*`);
- the stills where each reaches a load factor of 1, with their charts (`leaning-column-buckled-chart.png`,
  `leaning-column-flat-buckled-chart.png`);
- the ages at the end of each print (`-ages.png`) and the settling under its own weight when it buckles
  (`-settling.png`);
- the buckling modes swinging (`leaning-column-buckling.gif`, `.mp4`, and `leaning-column-flat-buckling.*`);
- the canvas, its Path plugged in (`grasshopper-definition.png`).

## What to attach

- **The post:** `leaning-column-both-printing.mp4`, the two prints side by side, the nozzle tilting on
  the left and upright on the right.
- **A carousel instead:** `leaning-column-buckled-chart.png`, `leaning-column-flat-buckled-chart.png`,
  `leaning-column-buckling.gif`, `grasshopper-definition.png`.
- **Alt text:** Two concrete tubes printed layer by layer side by side, both rising and then bending
  over to 45 degrees: on the left the nozzle tilts and the layers lean with the tube, on the right the
  nozzle stays upright and the layers are flat. Under each, the load factor on its own weight falls to 1,
  at 52 layers on the left and 47 on the right.

## The post

Copy everything in the box.

```text
Can your printer lean over?

A column that rises, then bends over to 45 degrees. Print it in flat layers and each one hangs out over the one below, the wall thinning to 28 mm.

Tilt the nozzle with it, and every layer sits square on the last.

I printed both in Grasshopper, layer by layer, the fresh concrete stiffening as it ages, and let Alpaca4d check them for buckling as they grow.

Flat: it buckles at 47 layers. Tilting: 52. Neither reaches the top. Now you know, before the printer does.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #3DConcretePrinting #RoboticFabrication #OpenSees #StructuralEngineering
```

About 95 words.

## Other openings

- "Same column, same concrete. One nozzle tilts."
- "Flat layers or leaning layers? Ask the column."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The leaning column, with the .gh: https://alpaca4d.github.io/examples/3d-printed-structure/#leaning-column-printed-along-its-axis
```

## The numbers, if someone asks

- **The column:** a tube 0.3 m across, rising 0.2 m, then bending over to 45 degrees on a radius of
  0.4 m, and on 0.3 m at 45 degrees.
- **Along its axis:** cut square to the axis every 10 mm along it, the nozzle tilting with it: 81
  layers of 48 bricks, 15.2 minutes; round the bend each layer is 6 mm thick on its inside and 14 mm on
  its outside, the wall 40 mm thick everywhere.
- **Flat:** cut every 10 mm up: 80 layers, 14.3 minutes; each layer up to 10 mm out over the one below,
  the 45-degree wall 28 mm thick square to it.
- **The print:** a filament 40 mm wide with round sides, 5 m/min.
- **The concrete:** E = 0.078 + 0.0012 t MPa, t in minutes, 2070 kg/m3 (Wolfs, Bos and Salet 2018).
- **Load factor on its own weight, along its axis:** 10 at 8 layers, 3.0 at 24, 1.5 at 41, 1 at 52.5
  layers (9.9 minutes in), just past the end of the bend; 0.29 at the end.
- **Flat:** 1 at 47.5 layers (9.2 minutes in), near the end of the bend.
- **How it buckles:** along its axis, the leaning top nods further over and its open end flattens;
  flat, its overhanging lip droops.
- **Settling under its own weight when it buckles:** 88 mm along its axis at 52.5 layers, 114 mm flat
  at 47.5.
- **This is elastic buckling alone:** a printed wall can also yield at its base, or tear where it
  overhangs, first.
