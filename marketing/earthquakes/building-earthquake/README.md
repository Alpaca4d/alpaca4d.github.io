# Building in an earthquake: LinkedIn post

An eight-storey steel office building with concrete slabs, shaken by the first 12 s of the El Centro
earthquake (1940) in a transient analysis with Alpaca4d. Here: the still, the still with its charts
(`-2.png`), the video with its charts (`-shaking.mp4`, and a `.gif`) and the canvas.

## What to attach

- **The post:** `building-earthquake-shaking.mp4`, with the roof's movement plotted under the building.
- **A carousel instead:** `building-earthquake-2.png`, `building-earthquake.png`,
  `grasshopper-definition.png`.
- **Alt text:** An eight-storey steel building swaying in an earthquake, its slabs in bands of
  displacement, with the ground's acceleration and the roof's movement plotted underneath.

## The post

Copy everything in the box.

```text
The ground shook hardest at 2 seconds. The building moved most at 4.5.

Why? A building has its own rhythm. Each push adds to the last, like pushing a swing.

This 8-storey steel building ends up 12.5 cm off at the roof.

You won't see that with a static load. You see it when you run the earthquake second by second.

Alpaca4d does that in Grasshopper, with OpenSees.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

About 90 words.

## Other openings

- "Buildings have their own rhythm."
- "The building moved most after the shaking peaked."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The building, with the .gh: https://alpaca4d.github.io/examples/building-earthquake/
```

## The numbers, if someone asks

- **The building:** 8 storeys of 3.5 m, three bays of 6 m each way; S355 HEB400 columns built in at the
  ground, IPE450 beams, 200 mm slabs as shells.
- **The most it moves:** 125 mm at the roof along x, 4.5 s in; that is 0.45% of its 28 m height.
- **The record:** El Centro north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, 5%
  Rayleigh damping, the building's own weight as its mass.
