# A tiny city in an earthquake: LinkedIn post

Sixteen steel buildings, from two storeys to twenty, shaken by the first 12 s of the El Centro
earthquake (1940) in a transient analysis with Alpaca4d. Here: the still (`earthquake-city.png`), the
still with its charts (`earthquake-city-2.png`), the video with its charts (`earthquake-city-shaking.mp4`,
and a `.gif`) and the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `earthquake-city-shaking.mp4`. It is 12 s long and plays muted; the bars under it, one
  per roof, tell the story without sound.
- **A carousel instead:** `earthquake-city-2.png`, `earthquake-city.png`, `grasshopper-definition.png`.
- **Alt text:** Sixteen steel buildings, two to twenty storeys, swaying differently under the same
  earthquake, with the ground's acceleration and each roof's movement plotted underneath.

## The post

Copy everything in the box.

```text
What does an earthquake do to a city?

I shook 16 buildings with a real earthquake record. From 2 floors to 20.

The small ones barely moved.
The tallest swayed 35 cm at the top.
Same ground, very different movement.

You can do this yourself. Build the buildings in Grasshopper, add the earthquake, run it. Alpaca4d does the analysis with OpenSees, on your own computer.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

About 90 words.

## Other openings

- "Same earthquake. 16 buildings. 16 different reactions."
- "Small buildings stay still. Tall ones dance."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The city, with the .gh: https://alpaca4d.github.io/examples/earthquake-city/
```

## The numbers, if someone asks

The most each roof moves along x over the record:

| Storeys | 2 | 3 | 4 | 5 | 6 | 7 | 9 | 10 | 11 | 12 | 14 | 16 | 18 | 20 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mm | 14-17 | 25-27 | 38 | 59 | 97 | 81 | 148 | 189 | 126 | 162 | 228 | 191 | 240 | 348 |

- **The buildings:** rectangles, Ls, a tower on a podium, blocks with a penthouse or balconies; HEB300
  columns, IPE400 beams, 200 mm concrete slabs.
- **The record:** El Centro north-south, 0.32 g at its peak, 2 s in; linear elastic, Newmark, 5%
  Rayleigh damping, each building's own weight as its mass.
