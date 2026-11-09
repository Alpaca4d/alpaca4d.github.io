# A buttressed core in an earthquake, after the Burj Khalifa: LinkedIn post

A 160-storey tower of concrete walls, three wings buttressing a hexagonal core, with a 220 m steel spire, modelled after the structure of the Burj Khalifa, shaken by the first 20 s of El Centro (1940) with Alpaca4d. Here: the still (`buttressed-core-earthquake.png`), the still with its charts beside it (`buttressed-core-earthquake-2.png`), the video with
its charts (`buttressed-core-earthquake-shaking.mp4`, and a `.gif`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `buttressed-core-earthquake-shaking.mp4`. It is 20 s long and plays muted; the charts beside it tell the story
  without sound.
- **A carousel instead:** `buttressed-core-earthquake-2.png`, `buttressed-core-earthquake.png`, `grasshopper-definition.png`.
- **Alt text:** A Y-shaped tower of concrete walls stepping back as it rises to a tall spire, swaying under an earthquake, coloured by displacement, with the ground's acceleration and the movement of the spire and the roof plotted beside it.

## The post

Copy everything in the box.

```text
160 floors of concrete walls. A spire on top. One earthquake.

I modelled the structure of the Burj Khalifa: three wings buttressing a hexagonal core, stepping back as it rises.

The tower sways slowly, once every 7.5 s. Its roof: 1.1 m.
The spire whips: 5.3 m at its tip.

That's the spire whip engineers design for. Seen in Grasshopper, on a laptop.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

## Other openings

- "What does an earthquake do to the top of a spire?"
- "The tower sways 1 m. The spire, 5."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The example, with the .gh: https://alpaca4d.github.io/examples/buttressed-core-earthquake/
```

## The numbers, if someone asks

- **Spire tip:** 5.3 m at the most, 19.3 s in; the roof 1.1 m
- **Period:** 7.5 s
- **The model:** a hexagonal core and three wings of 800 mm concrete walls (ASD Shells), stepping back 9 m at a time; a steel spire 8 m across; 900 kg/m2 floors; 10 100 elements
- **The record:** El Centro 1940, north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, Rayleigh damping, 2%. A model of how the structure works, not of the tower.
