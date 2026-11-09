# Outriggers and a damper in an earthquake, after Taipei 101: LinkedIn post

A 101-storey steel tower of a braced core, eight super columns, outrigger trusses and a 660 t tuned mass damper, modelled after the structure of Taipei 101, shaken by all 31 s of El Centro (1940) with Alpaca4d. Here: the still (`outrigger-tower-earthquake.png`), the still with its charts beside it (`outrigger-tower-earthquake-2.png`), the video with
its charts (`outrigger-tower-earthquake-shaking.mp4`, and a `.gif`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `outrigger-tower-earthquake-shaking.mp4`. It is 31 s long and plays muted; the charts beside it tell the story
  without sound.
- **A carousel instead:** `outrigger-tower-earthquake-2.png`, `outrigger-tower-earthquake.png`, `grasshopper-definition.png`.
- **Alt text:** A 101-storey tower of eight flaring modules on a braced core and super columns, swaying under an earthquake, coloured by displacement, with the ground's acceleration and the movement of the roof and of the damper plotted beside it.

## The post

Copy everything in the box.

```text
There's a 660-tonne ball hanging inside this tower.

101 floors. A braced core. Eight super columns. Outrigger trusses tying them together.
This is the structure of Taipei 101, with its tuned mass damper.

In a real earthquake, the damper swings 1.2 m, almost twice as far as the roof.
It helps, but a little: it was built for the wind.

Model it in Grasshopper. Make the damper heavier. See what changes.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

## Other openings

- "Does a 660-tonne damper stop an earthquake?"
- "The ball swings against the tower. Watch."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The example, with the .gh: https://alpaca4d.github.io/examples/outrigger-tower-earthquake/
```

## The numbers, if someone asks

- **Roof:** 660 mm at the most, 15.1 s in; the damper 1155 mm
- **Periods:** 9.7 s alone, split to 9.9 and 9.1 s by the damper
- **The damper:** about 2% less at the roof's peak, 4% less late in the record; 3 000 t: 5% and 8% less
- **The model:** a braced core of 16 columns, 8 super columns, outriggers under every module, 800 kg/m2 floors; 13 000 elements
- **The record:** El Centro 1940, north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, Rayleigh damping, 2%. A model of how the structure works, not of the tower.
