# A diagrid in an earthquake, after the Guangzhou IFC: LinkedIn post

A 103-storey tower of steel diagonals round a concrete core, modelled after the structure of the Guangzhou International Finance Center, shaken by all 31 s of El Centro (1940) with Alpaca4d. Here: the still (`diagrid-tower-earthquake.png`), the still with its charts beside it (`diagrid-tower-earthquake-2.png`), the video with
its charts (`diagrid-tower-earthquake-shaking.mp4`, and a `.gif`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `diagrid-tower-earthquake-shaking.mp4`. It is 31 s long and plays muted; the charts beside it tell the story
  without sound.
- **A carousel instead:** `diagrid-tower-earthquake-2.png`, `diagrid-tower-earthquake.png`, `grasshopper-definition.png`.
- **Alt text:** A 103-storey tower wrapped in a lattice of steel diagonals, swaying under an earthquake, coloured by displacement, with the ground's acceleration and the roof's movement plotted beside it.

## The post

Copy everything in the box.

```text
No columns on the outside. Just diagonals.

103 floors. Steel diamonds 12 storeys tall wrapped round a concrete core.
This is the structure of the Guangzhou IFC.

The lattice carries the weight and the sway at once.
Shaken by a real earthquake, its roof moves 72 cm.

A diagrid is geometry first. Grasshopper is where geometry lives.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

## Other openings

- "Why diamonds? A diagrid in an earthquake."
- "103 floors of diagonals. One earthquake."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The example, with the .gh: https://alpaca4d.github.io/examples/diagrid-tower-earthquake/
```

## The numbers, if someone asks

- **Roof:** 719 mm at the most, 13.1 s in
- **Period:** 8.7 s
- **The model:** 12 diamonds round it, nodes every 12 storeys, steel tubes 1.8 m across, HEM1000 ring beams, a hexagonal concrete core, 700 kg/m2 floors; 6 100 elements
- **The record:** El Centro 1940, north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, Rayleigh damping, 2%. A model of how the structure works, not of the tower.
