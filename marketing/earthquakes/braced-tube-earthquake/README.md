# A braced tube in an earthquake, after the John Hancock Center: LinkedIn post

A 100-storey tapering steel tower with an X of diagonals on every face every 18 storeys, modelled after the structure of the John Hancock Center in Chicago, shaken by all 31 s of El Centro (1940) with Alpaca4d. Here: the still (`braced-tube-earthquake.png`), the still with its charts beside it (`braced-tube-earthquake-2.png`), the video with
its charts (`braced-tube-earthquake-shaking.mp4`, and a `.gif`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `braced-tube-earthquake-shaking.mp4`. It is 31 s long and plays muted; the charts beside it tell the story
  without sound.
- **A carousel instead:** `braced-tube-earthquake-2.png`, `braced-tube-earthquake.png`, `grasshopper-definition.png`.
- **Alt text:** A tapering 100-storey steel tower crossed by big diagonal Xs on every face, swaying under an earthquake, coloured by displacement, with the ground's acceleration and the roof's movement plotted beside it.

## The post

Copy everything in the box.

```text
The big X's aren't decoration.

100 floors. Tapering. Every face crossed by diagonals, corner to corner.
This is the structure of the John Hancock Center.

The diagonals turn each face into a truss: the tower bends instead of racking.
Shaken by a real earthquake, its roof moves 51 cm.

Draw the X's in Grasshopper. Take them away. Compare.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

## Other openings

- "Why does the John Hancock Center wear big X's?"
- "100 floors, 5.5 X's, one earthquake."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The example, with the .gh: https://alpaca4d.github.io/examples/braced-tube-earthquake/
```

## The numbers, if someone asks

- **Roof:** 513 mm at the most, 3.8 s in
- **Periods:** 7.2 s along its short side, 5.2 s along its long side
- **The model:** 80 x 50 m at the ground, 48 x 30 m at the roof, steel box columns and diagonals 900 x 80 mm, HEM1000 spandrels, 800 kg/m2 floors; 6 700 elements
- **The record:** El Centro 1940, north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, Rayleigh damping, 2%. A model of how the structure works, not of the tower.
